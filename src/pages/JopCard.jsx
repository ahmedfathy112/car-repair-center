import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Package,
  User,
  Printer,
  Save,
  X,
  Plus,
  Trash2,
  ImageIcon,
  Loader2,
  Lock,
  Calculator,
} from "lucide-react";
import toast from "react-hot-toast";

import supabase from "../utils/supabase";

import {
  fetchInventoryParts,
  selectAllParts,
  selectInventoryLoading,
} from "../Redux-Toolkit/slices/inventorySlice";

import {
  selectCurrentUser,
  selectUserRole,
} from "../Redux-Toolkit/slices/authSlice";

import {
  setActiveJobCard,
  addPartToJobCard,
  removePartFromJobCard,
  updatePartQuantityInJobCard,
  selectActiveJobCard,
  selectJobCardItems,
  clearJobCard,
} from "../Redux-Toolkit/slices/jobCardSlice";

const PartSearchModal = ({ isOpen, onClose, onSelectPart, currentParts }) => {
  const dispatch = useDispatch();
  const inventoryParts = useSelector(selectAllParts);
  const loading = useSelector(selectInventoryLoading);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) dispatch(fetchInventoryParts());
  }, [isOpen, dispatch]);

  const filteredParts = inventoryParts.filter((part) => {
    const matchesSearch =
      part.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const isNotAlreadyAdded = !currentParts.some((p) => p.part_id === part.id);
    return matchesSearch && isNotAlreadyAdded;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-200">
        <div
          className="p-6 border-b flex justify-between items-center bg-gray-50 text-right"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <Package className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              إضافة قطع من المخزن
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث باسم القطعة أو SKU..."
              className="w-full pr-10 pl-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParts.map((part) => (
                <div
                  key={part.id}
                  className="border rounded-xl p-4 flex gap-4 hover:border-blue-500 transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {part.part_image_url ? (
                      <img
                        src={
                          supabase.storage
                            .from("inventory")
                            .getPublicUrl(part.part_image_url).data.publicUrl
                        }
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-right" dir="rtl">
                    <h4 className="font-bold text-gray-800">
                      {part.part_name}
                    </h4>
                    <p className="text-sm text-gray-500">SKU: {part.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-blue-600 font-bold">
                        ${Number(part.sell_price || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onSelectPart(part)}
                        disabled={part.quantity_in_stock <= 0}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        {part.quantity_in_stock > 0 ? "إضافة" : "نفذت"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  const price = Number(item.sell_price || 0);
  const quantity = Number(item.quantity || 0);

  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex-1 text-right">
        <div className="font-bold text-gray-800">{item.part_name}</div>
        <div className="text-xs text-gray-500">SKU: {item.sku}</div>
      </div>
      <div className="w-24 text-center font-medium text-gray-600">
        ${price.toFixed(2)}
      </div>
      <div className="w-32 flex justify-center">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.id, quantity - 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
          >
            -
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, quantity + 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>
      <div className="w-24 text-left font-bold text-blue-600">
        ${(price * quantity).toFixed(2)}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const JobCardEditor = ({ jobCardId = null, onSave, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const activeJobCard = useSelector(selectActiveJobCard);
  const jobItems = useSelector(selectJobCardItems);

  const [saving, setSaving] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);

  // --- عملية الحساب المباشرة لضمان عدم وجود 0 أو NaN ---
  const calculatedTotals = useMemo(() => {
    const subtotal = jobItems.reduce((acc, item) => {
      const itemPrice = Number(item.sell_price || 0);
      const itemQty = Number(item.quantity || 0);
      return acc + itemPrice * itemQty;
    }, 0);
    const tax = subtotal * 0.14; // ضريبة 14%
    const grandTotal = subtotal + tax;
    return { subtotal, tax, grandTotal };
  }, [jobItems]);

  const canEdit = userRole === "admin" || userRole === "mechanic";

  useEffect(() => {
    if (!jobCardId) {
      dispatch(clearJobCard());
      dispatch(
        setActiveJobCard({
          id: `JC-${Date.now()}`,
          status: "draft",
          customer_name: "",
          vehicle_plate: "",
          notes: "",
        })
      );
    }
  }, [jobCardId, dispatch]);

  const handleAddPart = (part) => {
    dispatch(
      addPartToJobCard({
        part_id: part.id,
        part_name: part.part_name,
        sku: part.sku,
        sell_price: Number(part.sell_price || 0),
        quantity: 1,
        max_quantity: part.quantity_in_stock,
      })
    );
    toast.success("تمت إضافة القطعة");
  };

  const handleSaveJob = async () => {
    if (!activeJobCard.customer_name || !activeJobCard.vehicle_plate) {
      return toast.error("يرجى إكمال بيانات العميل واللوحة");
    }

    setSaving(true);
    try {
      // 1. حفظ الرأس
      const { data: order, error: orderError } = await supabase
        .from("repair_orders")
        .upsert({
          id: jobCardId || undefined,
          customer_name: activeJobCard.customer_name,
          vehicle_plate: activeJobCard.vehicle_plate,
          status: activeJobCard.status,
          total_amount: calculatedTotals.grandTotal, // استخدام القيمة المحسوبة هنا
          created_by: currentUser?.id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. حذف العناصر القديمة إذا كان تعديل (إجراء وقائي)
      if (jobCardId) {
        await supabase
          .from("repair_order_items")
          .delete()
          .eq("repair_order_id", order.id);
      }

      // 3. حفظ العناصر الجديدة
      if (jobItems.length > 0) {
        const itemsToSave = jobItems.map((item) => ({
          repair_order_id: order.id,
          part_id: item.part_id,
          quantity: item.quantity,
          unit_price: Number(item.sell_price || 0),
        }));

        const { error: itemsError } = await supabase
          .from("repair_order_items")
          .insert(itemsToSave);

        if (itemsError) throw itemsError;
      }

      toast.success("تم حفظ كرت العمل بنجاح");

      // تنفيذ الإغلاق والتنظيف
      if (onSave) onSave();
      dispatch(clearJobCard());
      if (onClose) onClose();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit)
    return (
      <div className="p-20 text-center bg-white rounded-2xl">
        <Lock className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold">غير مسموح لك بالدخول</h2>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleSaveJob}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              حفظ كرت العمل
            </button>
            <button
              onClick={onClose}
              className="border px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-600"
            >
              إلغاء
            </button>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">كرت عمل جديد</h1>
            <p className="text-sm text-gray-500">{activeJobCard?.id}</p>
          </div>
        </div>

        <div
          className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-right"
          dir="rtl"
        >
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-600">
                <User size={18} /> بيانات المركبة
              </h3>
              <div className="space-y-4">
                <input
                  placeholder="اسم العميل"
                  type="text"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeJobCard?.customer_name || ""}
                  onChange={(e) =>
                    dispatch(
                      setActiveJobCard({
                        ...activeJobCard,
                        customer_name: e.target.value,
                      })
                    )
                  }
                />
                <input
                  placeholder="رقم اللوحة"
                  type="text"
                  className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeJobCard?.vehicle_plate || ""}
                  onChange={(e) =>
                    dispatch(
                      setActiveJobCard({
                        ...activeJobCard,
                        vehicle_plate: e.target.value,
                      })
                    )
                  }
                />
                <select
                  className="w-full p-2.5 border rounded-lg outline-none"
                  value={activeJobCard?.status || "draft"}
                  onChange={(e) =>
                    dispatch(
                      setActiveJobCard({
                        ...activeJobCard,
                        status: e.target.value,
                      })
                    )
                  }
                >
                  <option value="draft">مسودة</option>
                  <option value="in_progress">قيد العمل</option>
                  <option value="completed">مكتمل</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
                <Calculator size={18} /> الحساب الإجمالي
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between opacity-80 text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>${calculatedTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-80 text-sm">
                  <span>الضريبة (14%):</span>
                  <span>${calculatedTotals.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-black">
                  <span className="text-blue-400">الإجمالي الصافي:</span>
                  <span>${calculatedTotals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowPartModal(true)}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-100 transition-all"
              >
                <Plus size={18} /> إضافة من المخزن
              </button>
              <h3 className="font-bold text-lg text-gray-700">
                قطع الغيار المختارة
              </h3>
            </div>

            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-gray-50 p-4 flex font-bold text-gray-400 text-xs uppercase tracking-wider border-b">
                <div className="flex-1 text-right">الوصف</div>
                <div className="w-24 text-center">سعر الوحدة</div>
                <div className="w-32 text-center">الكمية</div>
                <div className="w-24 text-left">الإجمالي</div>
                <div className="w-10"></div>
              </div>

              {jobItems.length === 0 ? (
                <div className="p-16 text-center text-gray-300">
                  <Package className="mx-auto mb-3 opacity-20" size={64} />
                  <p>قائمة القطع فارغة، ابدأ بإضافة قطع من المخزن</p>
                </div>
              ) : (
                jobItems.map((item) => (
                  <PartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, q) =>
                      dispatch(
                        updatePartQuantityInJobCard({
                          itemId: id,
                          quantity: Math.max(1, q),
                        })
                      )
                    }
                    onRemove={(id) => dispatch(removePartFromJobCard(id))}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <PartSearchModal
        isOpen={showPartModal}
        onClose={() => setShowPartModal(false)}
        onSelectPart={handleAddPart}
        currentParts={jobItems}
      />
    </div>
  );
};

export default JobCardEditor;
