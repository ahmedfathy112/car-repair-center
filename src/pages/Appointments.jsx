import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Car,
  Phone,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  FileText,
  TrendingUp,
  Users,
  CalendarDays,
  ChevronDown,
  RefreshCw,
  Download,
  Printer,
  Wrench,
  MapPin,
  MessageSquare,
  Mail,
  Tag,
  Shield,
  ArrowRight,
} from "lucide-react";

// ============ INTERNAL COMPONENTS ============

/**
 * StatCard Component - Appointments summary cards
 */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  isLoading = false,
}) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-700",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      text: "text-purple-700",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      text: "text-orange-700",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-sm px-2 py-1 rounded-full ${
              change >= 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </>
      )}
    </div>
  );
};

/**
 * StatusBadge Component - Color-coded appointment status
 */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Confirmed: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
    },
    Completed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: CheckCircle,
    },
    Cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: XCircle,
    },
    "No Show": {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: XCircle,
    },
    InProgress: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      icon: Wrench,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {status}
    </div>
  );
};

/**
 * AppointmentRow Component - Flexbox-based appointment row
 */
const AppointmentRow = ({
  appointment,
  onView,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onCreateJobCard,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const isToday = (dateString) => {
    const today = new Date().toDateString();
    const appointmentDate = new Date(dateString).toDateString();
    return today === appointmentDate;
  };

  return (
    <div
      className={`flex items-center p-5 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${
        isToday(appointment.date) ? "bg-blue-50 hover:bg-blue-100" : ""
      }`}
    >
      {/* Customer Info */}
      <div className="flex-1 min-w-[220px]">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-800">
              {appointment.customer_name}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Phone className="w-3 h-3 mr-1.5" />
              {appointment.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="flex-1 min-w-[180px]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
            <Car className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-800">
              {appointment.plate_number}
            </div>
            <div className="text-sm text-gray-500">
              {appointment.vehicle_model}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex-1 min-w-[180px]">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-800">
              {formatDate(appointment.date)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(appointment.time)}
            </div>
          </div>
        </div>
      </div>

      {/* Service Type */}
      <div className="flex-1 min-w-[150px]">
        <div className="flex flex-wrap gap-1">
          {appointment.services.slice(0, 2).map((service, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            >
              {service}
            </span>
          ))}
          {appointment.services.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{appointment.services.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[140px]">
        <StatusBadge status={appointment.status} />
      </div>

      {/* Actions */}
      <div className="flex-1 min-w-[280px] flex justify-end space-x-2">
        <button
          onClick={() => onView(appointment)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {appointment.status === "Pending" && (
          <>
            <button
              onClick={() => onConfirm(appointment.id)}
              className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Confirm
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Cancel
            </button>
          </>
        )}

        {appointment.status === "Confirmed" && (
          <button
            onClick={() => onCreateJobCard(appointment)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Convert to Job Card
          </button>
        )}

        {appointment.status === "Completed" && (
          <button
            onClick={() => onView(appointment)}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            View Invoice
          </button>
        )}

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * FilterBar Component - Search and filter controls
 */
const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) => {
  const statusOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "InProgress",
    "No Show",
  ];
  const dateOptions = [
    "Today",
    "Tomorrow",
    "This Week",
    "Next Week",
    "This Month",
    "All Dates",
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, or plate number..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <CalendarDays className="w-5 h-5 text-gray-400 mr-2" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("All");
            setDateFilter("All Dates");
          }}
          className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

/**
 * AppointmentModal Component - View appointment details
 */
const AppointmentModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Appointment Details
                </h2>
                <p className="text-sm text-gray-500">ID: {appointment.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Customer & Vehicle Info */}
              <div className="lg:w-1/2">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">Customer</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.phone}
                        </div>
                        <div className="text-sm text-gray-500">
                          Phone Number
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.email || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Email Address
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Vehicle Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.vehicle_model}
                        </div>
                        <div className="text-sm text-gray-500">
                          Model & Year
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.plate_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          License Plate
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Wrench className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.mileage || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Current Mileage
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Appointment Details */}
              <div className="lg:w-1/2">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Appointment Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {formatDate(appointment.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Scheduled Date
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.time}
                        </div>
                        <div className="text-sm text-gray-500">
                          Scheduled Time
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {appointment.assigned_tech || "Not Assigned"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Assigned Technician
                        </div>
                      </div>
                    </div>
                    <div>
                      <StatusBadge status={appointment.status} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Requested Services
                  </h3>
                  <div className="space-y-2">
                    {appointment.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-800">{service}</span>
                        <span className="font-medium text-blue-600">
                          ${appointment.estimated_price?.[index] || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {appointment.notes && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Customer Notes
                      </h4>
                      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <p className="text-gray-700">{appointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              {appointment.status === "Confirmed" && (
                <button className="flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  <Wrench className="w-4 h-4 mr-2" />
                  Create Job Card
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * QuickStats Component - Today's schedule overview
 */
const QuickStats = ({ appointments }) => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const todaysAppointments = appointments.filter((a) => a.date === today);
  const tomorrowsAppointments = appointments.filter((a) => a.date === tomorrow);
  const pendingRequests = appointments.filter((a) => a.status === "Pending");

  const upcomingAppointments = appointments
    .filter((a) => a.status === "Confirmed" && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <StatCard
        title="Today's Appointments"
        value={todaysAppointments.length}
        change={12.5}
        icon={Calendar}
        color="blue"
      />
      <StatCard
        title="Pending Requests"
        value={pendingRequests.length}
        change={-8.2}
        icon={Clock}
        color="orange"
      />
      <StatCard
        title="Confirmed for Tomorrow"
        value={tomorrowsAppointments.length}
        change={15.3}
        icon={CalendarDays}
        color="green"
      />
      <StatCard
        title="This Week"
        value={
          appointments.filter(
            (a) =>
              new Date(a.date) >= new Date() &&
              new Date(a.date) <= new Date(Date.now() + 7 * 86400000)
          ).length
        }
        change={8.7}
        icon={TrendingUp}
        color="purple"
      />
    </div>
  );
};

// ============ MAIN COMPONENT ============

const AppointmentsPage = () => {
  // Mock appointments data
  const mockAppointments = [
    {
      id: "APT-2024-001",
      customer_name: "John Smith",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      plate_number: "ABC-123",
      vehicle_model: "Toyota Camry 2020",
      date: new Date().toISOString().split("T")[0],
      time: "09:00 AM",
      services: ["Oil Change", "Tire Rotation"],
      estimated_price: [45, 30],
      status: "Confirmed",
      assigned_tech: "Mike Johnson",
      notes: "Please check brake pads as well.",
      mileage: "45,230",
    },
    {
      id: "APT-2024-002",
      customer_name: "Maria Garcia",
      phone: "(555) 987-6543",
      email: "maria.g@email.com",
      plate_number: "XYZ-789",
      vehicle_model: "Honda Civic 2022",
      date: new Date().toISOString().split("T")[0],
      time: "10:30 AM",
      services: ["Brake Inspection", "AC Repair"],
      estimated_price: [80, 250],
      status: "Pending",
      assigned_tech: null,
      notes: "AC not cooling properly.",
      mileage: "18,450",
    },
    {
      id: "APT-2024-003",
      customer_name: "Robert Johnson",
      phone: "(555) 456-7890",
      email: "robert.j@email.com",
      plate_number: "DEF-456",
      vehicle_model: "Ford F-150 2021",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "02:00 PM",
      services: ["Transmission Service", "Wheel Alignment"],
      estimated_price: [350, 120],
      status: "Confirmed",
      assigned_tech: "Sarah Wilson",
      notes: "",
      mileage: "62,800",
    },
    {
      id: "APT-2024-004",
      customer_name: "Sarah Williams",
      phone: "(555) 234-5678",
      email: "sarah.w@email.com",
      plate_number: "GHI-789",
      vehicle_model: "BMW X5 2023",
      date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      time: "11:00 AM",
      services: ["Full Service", "Interior Detailing"],
      estimated_price: [400, 150],
      status: "Pending",
      assigned_tech: null,
      notes: "Regular maintenance service.",
      mileage: "12,300",
    },
    {
      id: "APT-2024-005",
      customer_name: "Michael Brown",
      phone: "(555) 876-5432",
      email: "michael.b@email.com",
      plate_number: "JKL-012",
      vehicle_model: "Chevrolet Malibu 2019",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      time: "03:30 PM",
      services: ["Battery Replacement"],
      estimated_price: [180],
      status: "Completed",
      assigned_tech: "Mike Johnson",
      notes: "",
      mileage: "78,900",
    },
    {
      id: "APT-2024-006",
      customer_name: "Jennifer Lee",
      phone: "(555) 345-6789",
      email: "jennifer.l@email.com",
      plate_number: "MNO-345",
      vehicle_model: "Tesla Model 3 2023",
      date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      time: "01:15 PM",
      services: ["Software Update", "Tire Check"],
      estimated_price: [120, 25],
      status: "Cancelled",
      assigned_tech: null,
      notes: "Customer rescheduled",
      mileage: "8,500",
    },
    {
      id: "APT-2024-007",
      customer_name: "David Wilson",
      phone: "(555) 765-4321",
      email: "david.w@email.com",
      plate_number: "PQR-678",
      vehicle_model: "Jeep Wrangler 2022",
      date: new Date().toISOString().split("T")[0],
      time: "04:00 PM",
      services: ["Suspension Check", "Oil Change"],
      estimated_price: [120, 45],
      status: "InProgress",
      assigned_tech: "Sarah Wilson",
      notes: "Suspension feels loose.",
      mileage: "32,100",
    },
    {
      id: "APT-2024-008",
      customer_name: "Lisa Taylor",
      phone: "(555) 543-2109",
      email: "lisa.t@email.com",
      plate_number: "STU-901",
      vehicle_model: "Mercedes C-Class 2023",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      time: "10:00 AM",
      services: ["Engine Diagnostic"],
      estimated_price: [95],
      status: "No Show",
      assigned_tech: "Mike Johnson",
      notes: "Customer did not show up.",
      mileage: "15,600",
    },
  ];

  // State management
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      appointment.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.plate_number.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    // Date filter
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];
    const weekStart = new Date().toISOString().split("T")[0];
    const weekEnd = new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const nextWeekStart = new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const nextWeekEnd = new Date(Date.now() + 14 * 86400000)
      .toISOString()
      .split("T")[0];

    const matchesDate =
      dateFilter === "All Dates" ||
      (dateFilter === "Today" && appointment.date === today) ||
      (dateFilter === "Tomorrow" && appointment.date === tomorrow) ||
      (dateFilter === "This Week" &&
        appointment.date >= weekStart &&
        appointment.date <= weekEnd) ||
      (dateFilter === "Next Week" &&
        appointment.date >= nextWeekStart &&
        appointment.date <= nextWeekEnd) ||
      (dateFilter === "This Month" &&
        new Date(appointment.date).getMonth() === new Date().getMonth());

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Event handlers
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleConfirmAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, status: "Confirmed", assigned_tech: "Auto Assign" }
          : apt
      )
    );
    alert(`Appointment ${id} confirmed!`);
  };

  const handleCancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, status: "Cancelled", assigned_tech: null }
          : apt
      )
    );
    alert(`Appointment ${id} cancelled.`);
  };

  const handleCreateJobCard = (appointment) => {
    alert(
      `Creating job card for appointment: ${appointment.id}\nCustomer: ${appointment.customer_name}\nRedirecting to job card creation...`
    );
    // In a real app, this would navigate to job card creation page
  };

  const handleAddManualAppointment = () => {
    alert("Opening appointment creation form...");
    // In a real app, this would open a form modal
  };

  const handleSendReminders = () => {
    const pendingAppointments = appointments.filter(
      (a) => a.status === "Pending"
    );
    alert(`Sending reminders to ${pendingAppointments.length} customers...`);
  };

  const handleExportSchedule = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Customer,Phone,Vehicle,Date,Time,Services,Status\n" +
      filteredAppointments
        .map(
          (apt) =>
            `"${apt.id}","${apt.customer_name}","${apt.phone}","${
              apt.vehicle_model
            }","${apt.date}","${apt.time}","${apt.services.join(", ")}","${
              apt.status
            }"`
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "appointments_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get today's date for display
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Appointments Management
          </h1>
          <p className="text-gray-600">
            Manage and schedule customer appointments
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1.5" />
            {today}
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleSendReminders}
            className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Reminders
          </button>
          <button
            onClick={handleExportSchedule}
            className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleAddManualAppointment}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <QuickStats appointments={appointments} />

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">{filteredAppointments.length}</span> of{" "}
          <span className="font-medium">{appointments.length}</span>{" "}
          appointments
        </div>
        <div className="text-sm text-gray-500">
          Sorted by:{" "}
          <span className="font-medium text-gray-700">Date & Time</span>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-[220px] font-medium text-gray-700 text-sm">
            CUSTOMER
          </div>
          <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-sm">
            VEHICLE
          </div>
          <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-sm">
            DATE & TIME
          </div>
          <div className="flex-1 min-w-[150px] font-medium text-gray-700 text-sm">
            SERVICES
          </div>
          <div className="flex-1 min-w-[140px] font-medium text-gray-700 text-sm">
            STATUS
          </div>
          <div className="flex-1 min-w-[280px] font-medium text-gray-700 text-sm text-right">
            ACTIONS
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setDateFilter("All Dates");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onView={handleViewAppointment}
                onEdit={() => alert(`Edit appointment: ${appointment.id}`)}
                onDelete={(id) => {
                  if (window.confirm("Delete this appointment?")) {
                    setAppointments((prev) => prev.filter((a) => a.id !== id));
                  }
                }}
                onConfirm={handleConfirmAppointment}
                onCancel={handleCancelAppointment}
                onCreateJobCard={handleCreateJobCard}
              />
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Today's appointments: </span>
            {
              appointments.filter(
                (a) =>
                  a.date === new Date().toISOString().split("T")[0] &&
                  a.status !== "Cancelled" &&
                  a.status !== "No Show"
              ).length
            }
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700">
              Page 1 of 2
            </span>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Schedule</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Calendar →
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {["Today", "Tomorrow", "This Week"].map((day) => {
            const dayAppointments = appointments
              .filter((a) => {
                if (day === "Today")
                  return a.date === new Date().toISOString().split("T")[0];
                if (day === "Tomorrow")
                  return (
                    a.date ===
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  );
                return true; // This Week
              })
              .slice(0, 2);

            return (
              <div
                key={day}
                className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">{day}</h3>
                  <span className="text-sm text-gray-500">
                    {dayAppointments.length} appointments
                  </span>
                </div>
                <div className="space-y-3">
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-800">
                            {apt.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {apt.time}
                          </div>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                      <div className="text-sm text-gray-600">
                        {apt.vehicle_model} • {apt.services[0]}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No appointments scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
