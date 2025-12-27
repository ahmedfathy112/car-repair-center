import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Copy,
  Shield,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
  ChevronDown,
  RefreshCw,
  Download,
  MoreVertical,
  Tag,
  Calendar,
  Sparkles,
  BarChart3,
} from "lucide-react";

// Redux imports
import {
  selectServices,
  selectServicesLoading,
  fetchServices,
  createService,
  updateService,
  deleteService,
  toggleServiceAvailability,
} from "../Redux-Toolkit/slices/servicesSlice";

import { selectUserRole } from "../Redux-Toolkit/slices/authSlice";
import AuthorizedElement from "../components/AuthorizedElement";

// Internal Components
const ServiceModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    service_name: "",
    base_price: "",
    estimated_duration_hours: 0,
    estimated_duration_minutes: 30,
    description: "",
    is_available: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Parse PostgreSQL interval format (e.g., '2 hours 30 minutes')
      const duration = initialData.estimated_duration || "";
      let hours = 0;
      let minutes = 0;

      const hoursMatch = duration.match(/(\d+)\s*hour/);
      const minutesMatch = duration.match(/(\d+)\s*minute/);

      if (hoursMatch) hours = parseInt(hoursMatch[1]);
      if (minutesMatch) minutes = parseInt(minutesMatch[1]);

      setFormData({
        service_name: initialData.service_name || "",
        base_price: initialData.base_price || "",
        estimated_duration_hours: hours,
        estimated_duration_minutes: minutes,
        description: initialData.description || "",
        is_available: initialData.is_available ?? true,
      });
    } else {
      setFormData({
        service_name: "",
        base_price: "",
        estimated_duration_hours: 0,
        estimated_duration_minutes: 30,
        description: "",
        is_available: true,
      });
    }
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.service_name.trim()) {
      newErrors.service_name = "Service name is required";
    }

    if (
      !formData.base_price ||
      isNaN(formData.base_price) ||
      parseFloat(formData.base_price) <= 0
    ) {
      newErrors.base_price = "Valid price is required";
    }

    if (
      formData.estimated_duration_hours < 0 ||
      formData.estimated_duration_minutes < 0
    ) {
      newErrors.duration = "Duration cannot be negative";
    }

    if (
      formData.estimated_duration_hours === 0 &&
      formData.estimated_duration_minutes === 0
    ) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format PostgreSQL interval
      const durationParts = [];
      if (formData.estimated_duration_hours > 0) {
        durationParts.push(
          `${formData.estimated_duration_hours} hour${
            formData.estimated_duration_hours > 1 ? "s" : ""
          }`
        );
      }
      if (formData.estimated_duration_minutes > 0) {
        durationParts.push(
          `${formData.estimated_duration_minutes} minute${
            formData.estimated_duration_minutes > 1 ? "s" : ""
          }`
        );
      }

      const estimated_duration = durationParts.join(" ");

      const serviceData = {
        service_name: formData.service_name.trim(),
        base_price: parseFloat(formData.base_price).toFixed(2),
        estimated_duration,
        description: formData.description.trim(),
        is_available: formData.is_available,
      };

      await onSubmit(serviceData);
      onClose();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <Wrench className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "Edit Service" : "Add New Service"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.service_name}
                  onChange={(e) =>
                    setFormData({ ...formData, service_name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.service_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Complete Engine Tune-up"
                />
                {errors.service_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    {errors.service_name}
                  </p>
                )}
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.base_price}
                      onChange={(e) =>
                        setFormData({ ...formData, base_price: e.target.value })
                      }
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.base_price ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.base_price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      {errors.base_price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration *
                  </label>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <select
                        value={formData.estimated_duration_hours}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_duration_hours: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[...Array(9).keys()].map((h) => (
                          <option key={h} value={h}>
                            {h} hour{h !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={formData.estimated_duration_minutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimated_duration_minutes: parseInt(
                              e.target.value
                            ),
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[0, 15, 30, 45].map((m) => (
                          <option key={m} value={m}>
                            {m} minutes
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.duration && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      {errors.duration}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Total:{" "}
                    {formData.estimated_duration_hours > 0
                      ? `${formData.estimated_duration_hours} hour${
                          formData.estimated_duration_hours > 1 ? "s" : ""
                        }`
                      : ""}
                    {formData.estimated_duration_minutes > 0
                      ? ` ${formData.estimated_duration_minutes} minute${
                          formData.estimated_duration_minutes > 1 ? "s" : ""
                        }`
                      : ""}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe the service in detail..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_available: e.target.checked,
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-7 rounded-full ${
                        formData.is_available ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${
                        formData.is_available ? "transform translate-x-7" : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-gray-700">
                      Available for booking
                    </span>
                    <p className="text-sm text-gray-500">
                      Customers can book this service
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* BTNS Submit and Cancel */}
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </span>
                ) : initialData ? (
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ServiceTableRow = ({
  service,
  userRole,
  onEdit,
  onDelete,
  onToggleAvailability,
  onCopyId,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    return duration
      .replace(/(\d+)\s*hour/, "$1h")
      .replace(/(\d+)\s*minute/, "$1m");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Service ID copied to clipboard");
    if (onCopyId) onCopyId(service.id);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Service Name & ID */}
      <div className="flex-1 min-w-[250px]">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
            <Wrench className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-800">
              {service.service_name}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                ID: {service.id.substring(0, 8)}...
              </span>
              <button
                onClick={() => copyToClipboard(service.id)}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title="Copy full ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex-1 min-w-[120px]">
        <div className="font-bold text-gray-800">
          {formatPrice(service.base_price)}
        </div>
        <div className="text-sm text-gray-500">Base price</div>
      </div>

      {/* Duration */}
      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          {formatDuration(service.estimated_duration)}
        </div>
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[120px]">
        <div
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            service.is_available
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {service.is_available ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Available
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 mr-1.5" />
              Unavailable
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 min-w-[180px] flex justify-end space-x-2">
        <AuthorizedElement allowedRoles={["admin"]}>
          <>
            <button
              onClick={() => onToggleAvailability(service.id)}
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-lg ${
                service.is_available
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              title={service.is_available ? "Deactivate" : "Activate"}
            >
              {service.is_available ? (
                <>
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Activate
                </>
              )}
            </button>

            <button
              onClick={() => onEdit(service)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit
            </button>

            <button
              onClick={() => onDelete(service.id)}
              className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </button>
          </>
        </AuthorizedElement>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Wrench className="w-12 h-12 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        No services found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Start by adding your first service to offer to customers. Services help
        organize your offerings and streamline booking.
      </p>
      <div className="w-64 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
    </div>
  );
};

const ServiceStats = ({ services }) => {
  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      change: "+12%",
    },
    {
      title: "Available Services",
      value: services.filter((s) => s.is_available).length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      change: "+8%",
    },
    {
      title: "Average Price",
      value:
        services.length > 0
          ? `$${(
              services.reduce((sum, s) => sum + parseFloat(s.base_price), 0) /
              services.length
            ).toFixed(2)}`
          : "$0.00",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
      change: "+5%",
    },
    {
      title: "Total Value",
      value:
        services.length > 0
          ? `$${services
              .reduce((sum, s) => sum + parseFloat(s.base_price), 0)
              .toLocaleString()}`
          : "$0",
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600",
      change: "+15%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color.split(" ")[0]}`}>
              <stat.icon className={`w-6 h-6 ${stat.color.split(" ")[1]}`} />
            </div>
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stat.change}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-500">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};

// Main Component
const ServiceManagement = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const loading = useSelector(selectServicesLoading);
  const userRole = useSelector(selectUserRole);

  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && service.is_available) ||
      (availabilityFilter === "unavailable" && !service.is_available);

    return matchesSearch && matchesAvailability;
  });

  const handleCreate = async (serviceData) => {
    await dispatch(createService(serviceData));
  };

  const handleUpdate = async (serviceData) => {
    await dispatch(
      updateService({
        id: editingService.id,
        ...serviceData,
      })
    );
  };

  const handleDelete = async (serviceId) => {
    setShowDeleteConfirm(null);
    await dispatch(deleteService(serviceId));
  };

  const handleToggleAvailability = async (serviceId) => {
    await dispatch(toggleServiceAvailability(serviceId));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Service Name,Base Price,Estimated Duration,Description,Available\n" +
      filteredServices
        .map(
          (s) =>
            `"${s.id}","${s.service_name}",${s.base_price},"${s.estimated_duration}","${s.description}",${s.is_available}`
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "services_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAdmin = userRole === "admin";

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Service Management
          </h1>
          <p className="text-gray-600">
            Manage and organize your automotive services
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          <AuthorizedElement allowedRoles={["admin"]}>
            <button
              onClick={() => {
                setEditingService(null);
                setModalOpen(true);
              }}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </button>
          </AuthorizedElement>
        </div>
      </div>

      {/* Stats */}
      <ServiceStats services={services} />

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            <button
              onClick={() => dispatch(fetchServices())}
              className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredServices.length}</span>{" "}
          of <span className="font-medium">{services.length}</span> services
        </div>
        <div className="text-sm text-gray-500">
          {!isAdmin && (
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-gray-400" />
              Read-only mode
            </span>
          )}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-[250px] font-medium text-gray-700">
            SERVICE
          </div>
          <div className="flex-1 min-w-[120px] font-medium text-gray-700">
            PRICE
          </div>
          <div className="flex-1 min-w-[120px] font-medium text-gray-700">
            DURATION
          </div>
          <div className="flex-1 min-w-[120px] font-medium text-gray-700">
            STATUS
          </div>
          <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-right">
            ACTIONS
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <SkeletonLoader />
          ) : filteredServices.length === 0 ? (
            <EmptyState />
          ) : (
            filteredServices.map((service) => (
              <ServiceTableRow
                key={service.id}
                service={service}
                userRole={userRole}
                onEdit={(service) => {
                  setEditingService(service);
                  setModalOpen(true);
                }}
                onDelete={(id) => setShowDeleteConfirm(id)}
                onToggleAvailability={handleToggleAvailability}
              />
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Last updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700">
              Page 1 of 3
            </span>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={editingService ? handleUpdate : handleCreate}
        initialData={editingService}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDeleteConfirm(null)}
          />

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Delete Service
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this service? This action
                  cannot be undone.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700"
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
