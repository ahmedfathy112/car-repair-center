import React, { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import {
  DollarSign,
  FileText,
  Search,
  Printer,
  CheckCircle,
  Clock,
  Loader2,
  Filter,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const FinancePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب البيانات من Supabase
  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("issued_at", { ascending: false });

    if (error) {
      toast.error("فشل في تحميل الفواتير");
    } else {
      setInvoices(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // تحديث حالة الفاتورة لتصبح "مدفوعة"
  const handleMarkAsPaid = async (id) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", id);

    if (error) {
      toast.error("حدث خطأ أثناء التحديث");
    } else {
      toast.success("تم تحديث حالة الفاتورة");
      fetchInvoices(); // إعادة تحميل البيانات
    }
  };

  // الحسابات الإجمالية
  const stats = {
    total: invoices.reduce(
      (acc, inv) => acc + Number(inv.total_amount || 0),
      0
    ),
    paid: invoices
      .filter((i) => i.status === "paid")
      .reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0),
    pending: invoices
      .filter((i) => i.status === "unpaid")
      .reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0),
  };

  const filteredInvoices = invoices.filter((inv) =>
    inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">المالية</h1>
          <p className="text-gray-500 mt-1">
            إدارة الفواتير والتحصيلات النقدية
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ابحث باسم العميل..."
              className="pr-10 pl-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                إجمالي المبيعات
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.total.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                المحصلة (مدفوعة)
              </p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                ${stats.paid.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                المستحقة (غير مدفوعة)
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                ${stats.pending.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                <th className="p-4 font-bold">رقم الفاتورة</th>
                <th className="p-4 font-bold">العميل</th>
                <th className="p-4 font-bold">التاريخ</th>
                <th className="p-4 font-bold">المبلغ</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-600"
                      size={32}
                    />
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400">
                    لا توجد فواتير مطابقة
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm text-blue-600 font-bold">
                      #INV-{inv.invoice_number}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {inv.customer_name}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(inv.issued_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      ${Number(inv.total_amount).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {inv.status === "paid" ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {inv.status === "paid" ? "مدفوعة" : "بانتظار الدفع"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {inv.status !== "paid" && (
                          <button
                            onClick={() => handleMarkAsPaid(inv.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تحديد كمدفوعة"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Printer size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
