import React, { useState, useEffect, useMemo } from "react"; // أضفنا useMemo للأداء
import { useSelector, useDispatch } from "react-redux";
import supabase from "../utils/supabase";
import {
  fetchInventoryParts,
  selectAllParts,
} from "../Redux-Toolkit/slices/inventorySlice";
import {
  ClipboardList,
  Search,
  Edit3,
  Trash2,
  Package,
  Save,
  X,
  PlusCircle,
  Car,
  Loader2,
} from "lucide-react";

const RepairOrdersPage = () => {
  const dispatch = useDispatch();
  const inventoryParts = useSelector(selectAllParts);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // دالة مساعدة لتحويل مسار الصورة إلى رابط كامل
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    const { data } = supabase.storage.from("inventory").getPublicUrl(path);
    return data.publicUrl;
  };

  const fetchData = async () => {
    setLoading(true);
    dispatch(fetchInventoryParts());
    const { data, error } = await supabase
      .from("repair_orders")
      .select(
        `
        *,
        repair_order_items (
          id, part_id, quantity, unit_price,
          inventory_parts ( part_name, part_image_url )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // --- تحسين منطق البحث والفلترة باستخدام useMemo لضمان الدقة والأداء ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. تنظيف نص البحث واسم العميل من الفراغات وتحويلهم لحروف صغيرة
      const customerName = (order.customer_name || "").toLowerCase().trim();
      const search = searchTerm.toLowerCase().trim();

      // 2. التحقق من مطابقة الاسم
      const matchesSearch = customerName.includes(search);

      // 3. التحقق من مطابقة الحالة
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // --- بقية الدوال (إدارة المودال والحفظ) دون تغيير ---
  const openEditModal = (order) => {
    setCurrentOrder(order);
    setItems(order.repair_order_items || []);
    setIsEditModalOpen(true);
  };

  const addItemRow = () => {
    setItems([...items, { part_id: "", quantity: 1, unit_price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "part_id") {
      const selectedPart = inventoryParts.find((p) => p.id === value);
      if (selectedPart) {
        newItems[index].unit_price = selectedPart.price || 0;
      }
    }
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0
    );

    try {
      await supabase
        .from("repair_orders")
        .update({ status: currentOrder.status, total_amount: totalPrice })
        .eq("id", currentOrder.id);

      await supabase
        .from("repair_order_items")
        .delete()
        .eq("repair_order_id", currentOrder.id);

      const itemsToInsert = items.map((item) => ({
        repair_order_id: currentOrder.id,
        part_id: item.part_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      if (itemsToInsert.length > 0) {
        await supabase.from("repair_order_items").insert(itemsToInsert);
      }

      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <ClipboardList className="text-blue-600" /> ورشة الصيانة
        </h1>
        <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border">
          {["all", "pending", "in_progress", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400"
              }`}
            >
              {s === "all"
                ? "الكل"
                : s === "pending"
                ? "انتظار"
                : s === "in_progress"
                ? "شغال"
                : "تم"}
            </button>
          ))}
        </div>
      </div>

      {/* حقل البحث المحدث */}
      <div className="mb-6 relative">
        <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ابحث باسم العميل..."
          className="w-full pr-12 pl-4 py-3.5 rounded-2xl border-none shadow-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* عرض الكروت */}
      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-gray-800 text-lg">
                      {order.customer_name}
                    </h3>
                    <p className="text-blue-600 font-bold text-xs flex items-center gap-1">
                      <Car size={14} /> {order.car_brand}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {order.status === "completed" ? "جاهزة" : "في الورشة"}
                  </div>
                </div>

                {/* معاينة قطع الغيار */}
                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-3xl">
                  {order.repair_order_items?.slice(0, 3).map((item, i) => {
                    const part = Array.isArray(item.inventory_parts)
                      ? item.inventory_parts[0]
                      : item.inventory_parts;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs font-bold text-gray-600"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={getImageUrl(part?.part_image_url)}
                            className="w-8 h-8 rounded-lg object-cover border bg-white shadow-sm"
                            alt=""
                          />
                          <span>{part?.part_name || "بند خارجي"}</span>
                        </div>
                        <span className="bg-white px-2 py-1 rounded-md">
                          x{item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-black text-gray-800">
                    {order.total_amount || 0}{" "}
                    <span className="text-xs text-gray-400">ج.م</span>
                  </div>
                  <button
                    onClick={() => openEditModal(order)}
                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 hover:scale-110 transition-transform"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold">
                لا يوجد نتائج تطابق بحثك..
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal - نفس الكود السابق */}
      {isEditModalOpen && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          {/* ... محتوى المودال السابق ... */}
          {/* (يمكنك نسخ محتوى المودال من كودك السابق هنا كما هو) */}
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-800">تعديل الطلب</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-white p-3 rounded-full shadow-sm hover:text-red-500 transition-colors"
              >
                <X />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* محتوى التعديل داخل المودال */}
              <div className="grid grid-cols-3 gap-3">
                {["pending", "in_progress", "completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setCurrentOrder({ ...currentOrder, status: s })
                    }
                    className={`py-4 rounded-2xl font-black text-xs border-2 transition-all ${
                      currentOrder.status === s
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-inner"
                        : "border-gray-100 text-gray-400 bg-white"
                    }`}
                  >
                    {s === "pending"
                      ? "انتظار"
                      : s === "in_progress"
                      ? "بدأ العمل"
                      : "تم الاستلام"}
                  </button>
                ))}
              </div>
              {/* قائمة البنود */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Package size={20} /> بنود المخزن
                  </h3>
                  <button
                    onClick={addItemRow}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-100"
                  >
                    <PlusCircle size={16} /> إضافة بند
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center bg-gray-50 p-4 rounded-[1.8rem] border border-gray-100"
                    >
                      <select
                        className="flex-[3] bg-white border-none rounded-xl px-4 py-3 text-sm font-bold outline-none shadow-sm"
                        value={item.part_id}
                        onChange={(e) =>
                          updateItem(index, "part_id", e.target.value)
                        }
                      >
                        <option value="">اختر من المخزن...</option>
                        {inventoryParts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.part_name} ({p.price} ج.م)
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="w-16 bg-white border-none rounded-xl py-3 text-sm font-bold text-center outline-none shadow-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        className="w-24 bg-white border-none rounded-xl py-3 text-sm font-bold text-center outline-none shadow-sm"
                        value={item.unit_price}
                        onChange={(e) =>
                          updateItem(index, "unit_price", e.target.value)
                        }
                      />
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 border-t bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-gray-100">
                <p className="text-3xl font-black text-blue-600">
                  {items.reduce(
                    (s, i) => s + (i.quantity * i.unit_price || 0),
                    0
                  )}{" "}
                  <span className="text-sm">ج.م</span>
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={22} /> حفظ الفاتورة
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairOrdersPage;
