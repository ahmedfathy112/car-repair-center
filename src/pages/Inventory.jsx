import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Upload,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ShoppingCart,
  Box,
  Layers,
  Tag,
  BarChart3,
} from "lucide-react";

// ============ INTERNAL COMPONENTS ============

/**
 * StatCard Component - Inventory summary cards
 */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  isAlert = false,
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-100",
    },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-100",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      border: "border-purple-100",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`flex-1 min-w-[250px] bg-white rounded-xl p-6 shadow-sm border ${
        isAlert ? "border-red-300" : colors.border
      }`}
    >
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
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
        {isAlert && (
          <div className="flex items-center text-sm px-2 py-1 rounded-full bg-red-50 text-red-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Alert</span>
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
};

/**
 * StockIndicator Component - Visual indicator for stock levels
 */
const StockIndicator = ({ quantity, minThreshold }) => {
  const isLowStock = quantity <= minThreshold;
  const isCriticalStock = quantity <= minThreshold * 0.5;
  const percentage = Math.min((quantity / (minThreshold * 2)) * 100, 100);

  let colorClass = "bg-green-500";
  let textClass = "text-green-700";
  let bgClass = "bg-green-50";

  if (isCriticalStock) {
    colorClass = "bg-red-500";
    textClass = "text-red-700";
    bgClass = "bg-red-50";
  } else if (isLowStock) {
    colorClass = "bg-orange-500";
    textClass = "text-orange-700";
    bgClass = "bg-orange-50";
  }

  return (
    <div className="flex items-center">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
        <div
          className={`h-full ${colorClass} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div
        className={`px-2 py-1 rounded text-xs font-medium ${bgClass} ${textClass}`}
      >
        {quantity} units
        {isLowStock && <AlertTriangle className="w-3 h-3 inline ml-1" />}
      </div>
    </div>
  );
};

/**
 * PartRow Component - Flexbox-based inventory row
 */
const PartRow = ({ part, onEdit, onDelete, onView }) => {
  const isLowStock = part.quantity <= part.minThreshold;
  const isCriticalStock = part.quantity <= part.minThreshold * 0.5;

  return (
    <div
      className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${
        isCriticalStock
          ? "bg-red-50 hover:bg-red-100"
          : isLowStock
          ? "bg-orange-50 hover:bg-orange-100"
          : ""
      }`}
    >
      {/* Part Name & SKU */}
      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-3 ${
              isCriticalStock
                ? "bg-red-500"
                : isLowStock
                ? "bg-orange-500"
                : "bg-green-500"
            }`}
          ></div>
          <div>
            <div className="font-medium text-gray-800">{part.name}</div>
            <div className="text-sm text-gray-500">SKU: {part.sku}</div>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="flex-1 min-w-[120px]">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {part.category}
        </span>
      </div>

      {/* Supplier */}
      <div className="flex-1 min-w-[150px]">
        <div className="text-gray-700">{part.supplier}</div>
      </div>

      {/* Stock Level */}
      <div className="flex-1 min-w-[180px]">
        <StockIndicator
          quantity={part.quantity}
          minThreshold={part.minThreshold}
        />
        <div className="text-xs text-gray-500 mt-1">
          Min: {part.minThreshold} | Reorder: {part.reorderPoint || 5}
        </div>
      </div>

      {/* Price */}
      <div className="flex-1 min-w-[100px]">
        <div className="font-bold text-gray-800">${part.price.toFixed(2)}</div>
        <div className="text-sm text-gray-500">
          Value: ${(part.quantity * part.price).toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 min-w-[180px] flex justify-end space-x-2">
        <button
          onClick={() => onView(part)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(part)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Part"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(part.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Part"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {isLowStock && (
          <button className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Order
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * InventoryModal Component - Add/Edit part form
 */
const InventoryModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Engine Parts",
    supplier: "",
    quantity: "",
    minThreshold: "",
    reorderPoint: "",
    price: "",
    location: "A-12",
    description: "",
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sku: initialData.sku,
        category: initialData.category,
        supplier: initialData.supplier,
        quantity: initialData.quantity.toString(),
        minThreshold: initialData.minThreshold.toString(),
        reorderPoint: initialData.reorderPoint?.toString() || "",
        price: initialData.price.toString(),
        location: initialData.location || "A-12",
        description: initialData.description || "",
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "Engine Parts",
      supplier: "",
      quantity: "",
      minThreshold: "",
      reorderPoint: "",
      price: "",
      location: "A-12",
      description: "",
    });
  };

  const categories = [
    "Engine Parts",
    "Brake System",
    "Electrical",
    "Suspension",
    "Exhaust",
    "Cooling System",
    "Transmission",
    "AC & Heating",
    "Body Parts",
    "Filters & Fluids",
    "Tools & Equipment",
  ];

  const suppliers = [
    "AutoParts Direct",
    "Car Repair Supplies Co.",
    "Premium Auto Parts",
    "Global Automotive",
    "Local Distributor",
    "OEM Supplier",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Part name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) < 0
    )
      newErrors.quantity = "Valid quantity is required";
    if (
      !formData.minThreshold ||
      isNaN(formData.minThreshold) ||
      parseInt(formData.minThreshold) < 1
    )
      newErrors.minThreshold = "Minimum threshold must be at least 1";
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    )
      newErrors.price = "Valid price is required";

    return newErrors;
  };

  const generateSKU = () => {
    const prefix = "AUTO";
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const sku = `${prefix}-${randomNum}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const partData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        minThreshold: parseInt(formData.minThreshold),
        reorderPoint: formData.reorderPoint
          ? parseInt(formData.reorderPoint)
          : 5,
        price: parseFloat(formData.price),
        id: initialData?.id || Date.now(),
      };
      onSubmit(partData);
      if (!initialData) resetForm();
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <Package className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "Edit Inventory Item" : "Add New Inventory Item"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="e.g., Brake Pad Set"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.sku ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="AUTO-0001"
                    />
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
              </div>

              {/* Category & Supplier */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier
                  </label>
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock & Pricing */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.quantity ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Threshold *
                  </label>
                  <input
                    type="number"
                    name="minThreshold"
                    value={formData.minThreshold}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.minThreshold ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="5"
                  />
                  {errors.minThreshold && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.minThreshold}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Location & Description */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Shelf A-12"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    name="reorderPoint"
                    value={formData.reorderPoint}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional details about this part..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                {initialData ? "Update Part" : "Add Part"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * LowStockAlert Component - Critical stock alerts
 */
const LowStockAlert = ({ parts }) => {
  const lowStockParts = parts.filter((p) => p.quantity <= p.minThreshold);
  const criticalParts = lowStockParts.filter(
    (p) => p.quantity <= p.minThreshold * 0.5
  );

  if (lowStockParts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Low Stock Alerts</h3>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          {criticalParts.length} Critical
        </span>
      </div>

      <div className="space-y-3">
        {lowStockParts.map((part) => (
          <div
            key={part.id}
            className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
          >
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  part.quantity <= part.minThreshold * 0.5
                    ? "bg-red-500"
                    : "bg-orange-500"
                }`}
              ></div>
              <div>
                <div className="font-medium text-gray-800">{part.name}</div>
                <div className="text-sm text-gray-600">SKU: {part.sku}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-red-600">
                  {part.quantity} units
                </div>
                <div className="text-sm text-gray-500">
                  Min: {part.minThreshold}
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const InventoryPage = () => {
  // Mock inventory data
  const mockParts = [
    {
      id: 1,
      name: "Brake Pad Set",
      sku: "AUTO-1001",
      category: "Brake System",
      supplier: "AutoParts Direct",
      quantity: 3,
      minThreshold: 10,
      price: 89.99,
      location: "A-12",
    },
    {
      id: 2,
      name: "Oil Filter",
      sku: "AUTO-1002",
      category: "Filters & Fluids",
      supplier: "Premium Auto Parts",
      quantity: 45,
      minThreshold: 20,
      price: 12.5,
      location: "B-05",
    },
    {
      id: 3,
      name: "Spark Plug",
      sku: "AUTO-1003",
      category: "Engine Parts",
      supplier: "Global Automotive",
      quantity: 2,
      minThreshold: 15,
      price: 8.99,
      location: "C-08",
    },
    {
      id: 4,
      name: "Air Filter",
      sku: "AUTO-1004",
      category: "Filters & Fluids",
      supplier: "Local Distributor",
      quantity: 8,
      minThreshold: 15,
      price: 24.99,
      location: "B-07",
    },
    {
      id: 5,
      name: "Battery 12V",
      sku: "AUTO-1005",
      category: "Electrical",
      supplier: "Car Repair Supplies Co.",
      quantity: 12,
      minThreshold: 5,
      price: 129.99,
      location: "D-03",
    },
    {
      id: 6,
      name: "Wiper Blades",
      sku: "AUTO-1006",
      category: "Body Parts",
      supplier: "OEM Supplier",
      quantity: 25,
      minThreshold: 10,
      price: 34.99,
      location: "E-11",
    },
    {
      id: 7,
      name: "Shock Absorber",
      sku: "AUTO-1007",
      category: "Suspension",
      supplier: "AutoParts Direct",
      quantity: 1,
      minThreshold: 4,
      price: 189.99,
      location: "F-09",
    },
    {
      id: 8,
      name: "AC Compressor",
      sku: "AUTO-1008",
      category: "AC & Heating",
      supplier: "Premium Auto Parts",
      quantity: 0,
      minThreshold: 2,
      price: 349.99,
      location: "G-02",
    },
    {
      id: 9,
      name: "Timing Belt",
      sku: "AUTO-1009",
      category: "Engine Parts",
      supplier: "Global Automotive",
      quantity: 6,
      minThreshold: 8,
      price: 79.99,
      location: "C-04",
    },
    {
      id: 10,
      name: "Radiator",
      sku: "AUTO-1010",
      category: "Cooling System",
      supplier: "Local Distributor",
      quantity: 3,
      minThreshold: 3,
      price: 219.99,
      location: "H-07",
    },
  ];

  // State management
  const [parts, setParts] = useState(mockParts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  // Calculate inventory metrics
  const totalParts = parts.length;
  const lowStockItems = parts.filter(
    (p) => p.quantity <= p.minThreshold
  ).length;
  const totalValue = parts.reduce(
    (sum, part) => sum + part.quantity * part.price,
    0
  );
  const criticalItems = parts.filter(
    (p) => p.quantity <= p.minThreshold * 0.5
  ).length;

  // Get unique categories for filter
  const categories = ["All", ...new Set(parts.map((p) => p.category))];

  // Filter parts
  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || part.category === categoryFilter;

    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "Low" && part.quantity <= part.minThreshold) ||
      (stockFilter === "Normal" && part.quantity > part.minThreshold) ||
      (stockFilter === "Critical" && part.quantity <= part.minThreshold * 0.5);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Event handlers
  const handleAddPart = () => {
    setEditingPart(null);
    setModalOpen(true);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setModalOpen(true);
  };

  const handleDeletePart = (id) => {
    if (
      window.confirm("Are you sure you want to delete this inventory item?")
    ) {
      setParts((prev) => prev.filter((part) => part.id !== id));
    }
  };

  const handleViewPart = (part) => {
    alert(
      `Part Details:\n\nName: ${part.name}\nSKU: ${part.sku}\nCategory: ${part.category}\nSupplier: ${part.supplier}\nQuantity: ${part.quantity}\nMin Threshold: ${part.minThreshold}\nPrice: $${part.price}\nLocation: ${part.location}`
    );
  };

  const handleSubmitPart = (partData) => {
    if (editingPart) {
      // Update existing part
      setParts((prev) =>
        prev.map((part) =>
          part.id === editingPart.id ? { ...part, ...partData } : part
        )
      );
    } else {
      // Add new part
      setParts((prev) => [{ ...partData, id: Date.now() }, ...prev]);
    }
  };

  const handleRestockAll = () => {
    if (
      window.confirm(
        "Restock all low inventory items to 150% of minimum threshold?"
      )
    ) {
      setParts((prev) =>
        prev.map((part) =>
          part.quantity <= part.minThreshold
            ? { ...part, quantity: Math.ceil(part.minThreshold * 1.5) }
            : part
        )
      );
    }
  };

  const handleExportInventory = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,SKU,Category,Supplier,Quantity,Min Threshold,Price,Location,Stock Value\n" +
      parts
        .map(
          (p) =>
            `"${p.name}","${p.sku}","${p.category}","${p.supplier}",${
              p.quantity
            },${p.minThreshold},${p.price},"${p.location}",${(
              p.quantity * p.price
            ).toFixed(2)}`
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage auto parts inventory
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleExportInventory}
            className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleAddPart}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Part
          </button>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          title="Total Parts"
          value={totalParts}
          change={8.2}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          change={-12.5}
          icon={AlertTriangle}
          color="orange"
          isAlert={lowStockItems > 0}
        />
        <StatCard
          title="Critical Items"
          value={criticalItems}
          change={25.0}
          icon={AlertCircle}
          color="red"
          isAlert={criticalItems > 0}
        />
        <StatCard
          title="Total Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          change={15.3}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlert parts={parts} />

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by part name, SKU, or supplier..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Stock Levels</option>
            <option value="Critical">Critical Stock</option>
            <option value="Low">Low Stock</option>
            <option value="Normal">Normal Stock</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All");
              setStockFilter("All");
            }}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            Clear Filters
          </button>

          {lowStockItems > 0 && (
            <button
              onClick={handleRestockAll}
              className="flex items-center px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restock All
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredParts.length}</span> of{" "}
          <span className="font-medium">{parts.length}</span> parts
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Critical ({criticalItems})</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Low ({lowStockItems - criticalItems})</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Normal ({parts.length - lowStockItems})</span>
          </div>
        </div>
      </div>

      {/* Parts List - Flexbox Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-[200px] font-medium text-gray-700 text-sm">
            PART
          </div>
          <div className="flex-1 min-w-[120px] font-medium text-gray-700 text-sm">
            CATEGORY
          </div>
          <div className="flex-1 min-w-[150px] font-medium text-gray-700 text-sm">
            SUPPLIER
          </div>
          <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-sm">
            STOCK LEVEL
          </div>
          <div className="flex-1 min-w-[100px] font-medium text-gray-700 text-sm">
            PRICE
          </div>
          <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-sm text-right">
            ACTIONS
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredParts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No parts found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredParts.map((part) => (
              <PartRow
                key={part.id}
                part={part}
                onEdit={handleEditPart}
                onDelete={handleDeletePart}
                onView={handleViewPart}
              />
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Total Value:{" "}
            <span className="font-medium text-green-600">
              ${totalValue.toLocaleString()}
            </span>
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

      {/* Summary Section */}
      <div className="flex flex-wrap gap-4 mt-8">
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">
            Stock Level Summary
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  Critical Stock (≤ 50% of min)
                </span>
                <span className="font-medium text-red-600">
                  {criticalItems} parts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(criticalItems / parts.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  Low Stock (≤ min threshold)
                </span>
                <span className="font-medium text-orange-600">
                  {lowStockItems} parts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(lowStockItems / parts.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Normal Stock</span>
                <span className="font-medium text-green-600">
                  {parts.length - lowStockItems} parts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((parts.length - lowStockItems) / parts.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">
            Top Categories by Value
          </h3>
          <div className="space-y-3">
            {Object.entries(
              parts.reduce((acc, part) => {
                acc[part.category] =
                  (acc[part.category] || 0) + part.quantity * part.price;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, value]) => (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-700">{category}</span>
                  <span className="font-medium text-blue-600">
                    ${value.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPart(null);
        }}
        onSubmit={handleSubmitPart}
        initialData={editingPart}
      />
    </div>
  );
};

export default InventoryPage;
