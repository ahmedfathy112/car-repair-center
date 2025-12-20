import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import ServiceModal from "../components/ServiceModal";
import ServiceTable from "../components/ServiceTable";
import ServiceStats from "../components/ServiceStats";
import { Search, Filter, Plus, Download, Package } from "lucide-react";

const ManageServices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Initial mock data
  const initialServices = [
    {
      id: 1,
      name: "Engine Oil Change",
      description:
        "Complete engine oil change with synthetic oil and filter replacement",
      price: 89.99,
      duration: "45 mins",
      category: "Maintenance",
      status: "Active",
    },
    {
      id: 2,
      name: "Brake Pad Replacement",
      description: "Brake pad replacement with inspection and testing",
      price: 149.99,
      duration: "2 hours",
      category: "Brakes",
      status: "Active",
    },
    {
      id: 3,
      name: "AC System Repair",
      description: "Complete AC system diagnosis and repair",
      price: 299.99,
      duration: "3-4 hours",
      category: "AC & Heating",
      status: "Coming Soon",
    },
    {
      id: 4,
      name: "Battery Replacement",
      description: "Battery testing and replacement service",
      price: 129.99,
      duration: "1 hour",
      category: "Electrical",
      status: "Active",
    },
    {
      id: 5,
      name: "Tire Rotation",
      description: "Professional tire rotation and pressure check",
      price: 49.99,
      duration: "30 mins",
      category: "Tires & Wheels",
      status: "Active",
    },
    {
      id: 6,
      name: "Engine Diagnostic",
      description: "Complete engine diagnostic and performance check",
      price: 79.99,
      duration: "1 hour",
      category: "Engine",
      status: "Inactive",
    },
  ];

  const [services, setServices] = useState(initialServices);

  // Filter services based on search and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" || service.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = ["All", ...new Set(services.map((s) => s.category))];
  const statuses = ["All", "Active", "Inactive", "Coming Soon"];

  const handleAddService = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((service) => service.id !== id));
    }
  };

  const handleViewService = (service) => {
    alert(
      `Viewing: ${service.name}\n\n${service.description}\n\nPrice: $${service.price}\nDuration: ${service.duration}\nCategory: ${service.category}\nStatus: ${service.status}`
    );
  };

  const handleSubmitService = (serviceData) => {
    if (editingService) {
      // Update existing service
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id
            ? { ...service, ...serviceData }
            : service
        )
      );
    } else {
      // Add new service
      const newService = {
        ...serviceData,
        id: Date.now(), // Generate unique ID
      };
      setServices((prev) => [newService, ...prev]);
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Description,Price,Duration,Category,Status\n" +
      filteredServices
        .map(
          (service) =>
            `"${service.name}","${service.description}",${service.price},"${service.duration}","${service.category}","${service.status}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "services_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <DashboardHeader onMenuClick={() => setSidebarOpen(true)} /> */}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Service Management
              </h1>
              <p className="text-gray-600">
                Manage your car repair services and pricing
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddService}
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <ServiceStats services={services} />

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search services by name or description..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                }}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{filteredServices.length}</span> of{" "}
              <span className="font-medium">{services.length}</span> services
            </div>
            <div className="text-sm text-gray-500">
              Sorted by:{" "}
              <span className="font-medium text-gray-700">Recently Added</span>
            </div>
          </div>

          {/* Services Table */}
          <ServiceTable
            services={filteredServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onView={handleViewService}
          />

          {/* Empty State */}
          {filteredServices.length === 0 && services.length > 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No matching services found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleSubmitService}
        initialData={editingService}
      />
    </div>
  );
};

export default ManageServices;
