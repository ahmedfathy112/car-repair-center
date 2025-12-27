import React, { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import {
  Activity,
  Package,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  ChevronLeft,
  DollarSign,
  Wrench,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex-1 min-w-[240px]">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      {subtitle && (
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
          {subtitle}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-black text-gray-800">{value}</div>
    </div>
  </div>
);

const OrdersTable = ({ orders, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
      <h3 className="font-bold text-gray-800 text-lg">آخر طلبات الإصلاح</h3>
      <Link
        to={"/admin/finance"}
        className="text-sm text-blue-600 hover:underline"
      >
        عرض الكل
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-6 py-4">العميل</th>
            <th className="px-6 py-4">التاريخ</th>
            <th className="px-6 py-4">المبلغ</th>
            <th className="px-6 py-4 text-center">الحالة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan="4" className="p-10 text-center">
                <Loader2 className="animate-spin mx-auto text-blue-500" />
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-10 text-center text-gray-400">
                لا توجد طلبات حالياً
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800">
                  {order.customer_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-6 py-4 font-black text-gray-900">
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                      نشط
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenueMonth: 0,
    activeOrdersCount: 0,
    lowStockAlerts: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);

      // 1. جلب آخر 5 طلبات
      const { data: orders } = await supabase
        .from("repair_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentOrders(orders || []);

      // calculate the evalutions of this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyInvoices } = await supabase
        .from("invoices")
        .select("total_amount")
        .eq("status", "paid")
        .gte("issued_at", startOfMonth.toISOString());

      const revenue =
        monthlyInvoices?.reduce(
          (acc, inv) => acc + Number(inv.total_amount),
          0
        ) || 0;

      // 3. عدد الطلبات النشطة (بناءً على الـ Repair Orders)
      const { count: activeCount } = await supabase
        .from("repair_orders")
        .select("*", { count: "exact", head: true });

      // 4. قطع غيار شارفت على الانتهاء (أقل من 5 قطع)
      const { count: lowStock } = await supabase
        .from("inventory_parts")
        .select("*", { count: "exact", head: true })
        .lt("quantity_in_stock", 5);

      setStats({
        totalRevenueMonth: revenue,
        activeOrdersCount: activeCount || 0,
        lowStockAlerts: lowStock || 0,
        totalTransactions: orders?.length || 0,
      });

      setLoading(false);
    };

    getDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">نظرة عامة</h1>
          <p className="text-gray-500 mt-1">
            أداء الورشة الحالي وبيانات النظام
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-bold text-gray-700">
            النظام متصل الآن
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex flex-wrap gap-6 mb-8">
        <StatCard
          title="أرباح الشهر الحالي"
          value={`$${stats.totalRevenueMonth.toLocaleString()}`}
          icon={DollarSign}
          colorClass="bg-green-100 text-green-600"
          subtitle="تم تحصيلها"
        />
        <StatCard
          title="طلبات الإصلاح"
          value={stats.activeOrdersCount}
          icon={Wrench}
          colorClass="bg-blue-100 text-blue-600"
          subtitle="إجمالي الطلبات"
        />
        <StatCard
          title="تنبيهات المخزن"
          value={stats.lowStockAlerts}
          icon={AlertCircle}
          colorClass="bg-orange-100 text-orange-600"
          subtitle="قطع شارفت على الانتهاء"
        />
        <StatCard
          title="عمليات اليوم"
          value={stats.totalTransactions}
          icon={Activity}
          colorClass="bg-purple-100 text-purple-600"
          subtitle="نشاط النظام"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Column */}
        <div className="lg:col-span-2">
          <OrdersTable orders={recentOrders} loading={loading} />
        </div>

        {/* Side Summary Column */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors">
                <Wrench size={18} /> طلب إصلاح جديد
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-colors">
                <Package size={18} /> جرد المخزن
              </button>
            </div>
          </div>

          {/* Business Goal Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">مستوى الإنجاز</h3>
            <p className="text-blue-100 text-xs mb-6">
              معدل إنهاء المهام اليومي مقارنة بالأمس
            </p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black">82%</span>
              <TrendingUp size={24} className="mb-1 text-green-300" />
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: "82%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
