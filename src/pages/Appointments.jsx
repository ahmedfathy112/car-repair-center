import React, { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Printer,
  Loader2,
  RefreshCw,
  Download,
  X,
  Save,
  Edit3,
  Car,
  Tag,
} from "lucide-react";

// Brands Of Cars
const CAR_BRANDS = [
  "تويوتا (Toyota)",
  "هوندا (Honda)",
  "نيسان (Nissan)",
  "فورد (Ford)",
  "مرسيدس (Mercedes-Benz)",
  "بي إم دبليو (BMW)",
  "أودي (Audi)",
  "لكزس (Lexus)",
  "هيونداي (Hyundai)",
  "كيا (Kia)",
  "مازدا (Mazda)",
  "شيفروليه (Chevrolet)",
  "جيب (Jeep)",
  "دودج (Dodge)",
  "جي إم سي (GMC)",
  "كاديلاك (Cadillac)",
  "فولكس فاجن (Volkswagen)",
  "بورشه (Porsche)",
  "لاند روفر (Land Rover)",
  "رينو (Renault)",
  "بيجو (Peugeot)",
  "فيات (Fiat)",
  "ميتسوبيشي (Mitsubishi)",
  "سوزوكي (Suzuki)",
  "إيسوزو (Isuzu)",
  "سوبارو (Subaru)",
  "تسلا (Tesla)",
  "إم جي (MG)",
  "هافال (Haval)",
  "شيري (Chery)",
];

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="flex-1 min-w-[200px] bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div
        className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4`}
      >
        <Icon size={24} />
      </div>
      <div className="text-2xl font-black text-gray-800">{value}</div>
      <div className="text-sm text-gray-500 font-bold">{title}</div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "مقبول",
      icon: CheckCircle,
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "انتظار",
      icon: Clock,
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "ملغي",
      icon: XCircle,
    },
  };
  const item = config[status] || config.pending;
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${item.bg} ${item.text}`}
    >
      <item.icon size={14} /> {item.label}
    </span>
  );
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    car_brand: "",
    car_model: "",
    appointment_date: "",
    notes: "",
    status: "pending",
  });

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      customer_name: "",
      phone_number: "",
      car_brand: "",
      car_model: "",
      appointment_date: "",
      notes: "",
      status: "approved",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (apt) => {
    setModalMode("edit");
    setSelectedId(apt.id);
    const date = new Date(apt.appointment_date);
    const formattedDate = date.toISOString().slice(0, 16);

    setFormData({
      customer_name: apt.customer_name,
      phone_number: apt.phone_number,
      car_brand: apt.car_brand || "",
      car_model: apt.car_model || "",
      appointment_date: formattedDate,
      notes: apt.notes || "",
      status: apt.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let error;
    if (modalMode === "create") {
      const { error: err } = await supabase
        .from("appointments")
        .insert([formData]);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("appointments")
        .update(formData)
        .eq("id", selectedId);
      error = err;
    }

    if (!error) {
      setIsModalOpen(false);
      fetchAppointments();
    } else {
      alert("حدث خطأ أثناء حفظ البيانات");
    }
    setIsSubmitting(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      );
    }
  };

  const filteredData = appointments.filter((apt) => {
    const matchesSearch =
      apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone_number.includes(searchTerm) ||
      (apt.car_brand &&
        apt.car_brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800">
            إدارة المواعيد والسيارات
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            تحكم في طلبات الصيانة وبيانات المركبات
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAppointments}
            className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> حجز يدوي جديد
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          title="إجمالي المواعيد"
          value={appointments.length}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="في الانتظار"
          value={appointments.filter((a) => a.status === "pending").length}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="تمت الموافقة"
          value={appointments.filter((a) => a.status === "approved").length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="الملغاة"
          value={appointments.filter((a) => a.status === "rejected").length}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="ابحث باسم العميل، الهاتف، أو نوع السيارة..."
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-gray-50 border-none rounded-xl px-4 py-2 outline-none font-bold text-gray-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="approved">مقبول</option>
          <option value="rejected">ملغي</option>
        </select>
      </div>

      {/* Table For All Appoitments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">العميل والمركبة</th>
                <th className="px-6 py-4">تاريخ الموعد</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الملاحظات</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Car size={20} />
                      </div>
                      <div>
                        <div className="font-black text-gray-800">
                          {apt.customer_name}
                        </div>
                        <div className="text-xs text-blue-600 font-black flex items-center gap-1">
                          {apt.car_brand} - {apt.car_model}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold">
                          {apt.phone_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {new Date(apt.appointment_date).toLocaleString("ar-EG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm max-w-[150px] truncate font-medium">
                    {apt.notes || "---"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => openEditModal(apt)}
                        className="bg-gray-100 text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="تعديل"
                      >
                        <Edit3 size={18} />
                      </button>
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(apt.id, "approved")
                            }
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm"
                            title="موافقة"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(apt.id, "rejected")
                            }
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm"
                            title="إلغاء"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold">
              لا توجد مواعيد تطابق بحثك
            </div>
          )}
        </div>
      </div>

      {/* Edit Model */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                {modalMode === "create" ? (
                  <Plus className="text-blue-600" />
                ) : (
                  <Edit3 className="text-blue-600" />
                )}
                {modalMode === "create" ? "تسجيل حجز جديد" : "تعديل البيانات"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* بيانات العميل */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-500 mb-1">
                    اسم العميل
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-500 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                </div>

                {/* بيانات السيارة - مع ميزة البحث الذكي */}
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-1">
                    نوع السيارة (الماركة)
                  </label>
                  <div className="relative">
                    <Car
                      className="absolute right-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      list="carBrands"
                      required
                      type="text"
                      placeholder="ابحث أو اختر..."
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={formData.car_brand}
                      onChange={(e) =>
                        setFormData({ ...formData, car_brand: e.target.value })
                      }
                    />
                    <datalist id="carBrands">
                      {CAR_BRANDS.map((brand, index) => (
                        <option key={index} value={brand} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 mb-1">
                    موديل السيارة (السنة/النوع)
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute right-3 top-3 text-gray-400"
                      size={16}
                    />
                    <input
                      required
                      type="text"
                      placeholder="مثلاً: 2023"
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={formData.car_model}
                      onChange={(e) =>
                        setFormData({ ...formData, car_model: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-500 mb-1">
                    التاريخ والوقت
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={formData.appointment_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-1">
                  ملاحظات إضافية
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />{" "}
                      {modalMode === "create" ? "حفظ الحجز" : "تحديث البيانات"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 bg-gray-100 text-gray-600 font-black py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
