import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryParts,
  addPart,
  updatePart,
  deletePart,
  selectAllParts,
  selectInventoryLoading,
} from "../Redux-Toolkit/slices/inventorySlice";
import supabase from "../utils/supabase";
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

// ============ مكون المودال (إضافة وتعديل) ============
const InventoryModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    part_name: "",
    sku: "",
    quantity_in_stock: 0,
    buy_price: 0,
    sell_price: 0,
    min_threshold: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        part_name: initialData.part_name || "",
        sku: initialData.sku || "",
        quantity_in_stock: initialData.quantity_in_stock || 0,
        buy_price: initialData.buy_price || 0,
        sell_price: initialData.sell_price || 0,
        min_threshold: initialData.min_threshold || 5,
      });
      if (initialData.part_image_url) {
        const { data } = supabase.storage
          .from("inventory")
          .getPublicUrl(initialData.part_image_url);
        setPreviewUrl(data.publicUrl);
      }
    } else {
      setFormData({
        part_name: "",
        sku: "",
        quantity_in_stock: 0,
        buy_price: 0,
        sell_price: 0,
        min_threshold: 5,
      });
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        // حالة التعديل
        await dispatch(
          updatePart({
            id: initialData.id,
            updates: formData,
            imageFile,
          })
        ).unwrap();
        toast.success("تم التحديث بنجاح");
      } else {
        // حالة الإضافة
        await dispatch(
          addPart({
            partData: formData,
            imageFile,
          })
        ).unwrap();
        toast.success("تمت الإضافة للمخزون");
      }
      onClose();
    } catch (err) {
      toast.error(err || "حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "تعديل قطعة" : "إضافة قطعة جديدة"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* رفع الصورة */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <ImageIcon size={32} className="text-gray-300" />
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-400">انقر لرفع صورة القطعة</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                اسم القطعة
              </label>
              <input
                required
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.part_name}
                onChange={(e) =>
                  setFormData({ ...formData, part_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                SKU
              </label>
              <input
                className="w-full p-2.5 border rounded-lg"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                الكمية
              </label>
              <input
                type="number"
                className="w-full p-2.5 border rounded-lg"
                value={formData.quantity_in_stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity_in_stock: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                سعر الشراء
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2.5 border rounded-lg"
                value={formData.buy_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buy_price: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                سعر البيع
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2.5 border rounded-lg"
                value={formData.sell_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sell_price: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center gap-2"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {initialData ? "حفظ التعديلات" : "إضافة للمخزون"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============ الصفحة الرئيسية ============
const InventoryPage = () => {
  const dispatch = useDispatch();
  const parts = useSelector(selectAllParts);
  const loading = useSelector(selectInventoryLoading);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  useEffect(() => {
    dispatch(fetchInventoryParts());
  }, [dispatch]);

  const filteredParts = useMemo(() => {
    return parts.filter(
      (p) =>
        p.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parts, searchTerm]);

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">المخزن</h1>
          <p className="text-gray-500">إدارة قطع الغيار والكميات المتوفرة</p>
        </div>
        <button
          onClick={() => {
            setEditingPart(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold"
        >
          <Plus size={20} className="ml-2" /> إضافة قطعة جديدة
        </button>
      </div>

      {/* البحث */}
      <div className="relative mb-6">
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="ابحث باسم القطعة أو SKU..."
          className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول البيانات */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-medium">جاري تحميل بيانات المخزن...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500">
                    القطعة
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500">
                    المخزون
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500">
                    سعر البيع
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredParts.map((part) => (
                  <tr
                    key={part.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                          {part.part_image_url ? (
                            <img
                              src={
                                supabase.storage
                                  .from("inventory")
                                  .getPublicUrl(part.part_image_url).data
                                  .publicUrl
                              }
                              className="w-full h-full object-cover"
                              alt={part.part_name}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-gray-800">
                          {part.part_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {part.sku || "---"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            part.quantity_in_stock <= part.min_threshold
                              ? "bg-red-500 animate-pulse"
                              : "bg-green-500"
                          }`}
                        ></span>
                        <span className="font-semibold text-gray-700">
                          {part.quantity_in_stock} وحدة
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600">
                      ${part.sell_price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingPart(part);
                            setModalOpen(true);
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("هل أنت متأكد من الحذف؟"))
                              dispatch(deletePart(part.id));
                          }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InventoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingPart}
      />
    </div>
  );
};

export default InventoryPage;
