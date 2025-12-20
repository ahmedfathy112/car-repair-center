import React from "react";
import {
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
} from "lucide-react";

const ServiceTable = ({ services, onEdit, onDelete, onView }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Inactive":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="flex border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex-1 font-medium text-gray-700 text-sm">SERVICE</div>
        <div className="flex-1 font-medium text-gray-700 text-sm">CATEGORY</div>
        <div className="flex-1 font-medium text-gray-700 text-sm">PRICE</div>
        <div className="flex-1 font-medium text-gray-700 text-sm">DURATION</div>
        <div className="flex-1 font-medium text-gray-700 text-sm">STATUS</div>
        <div className="flex-1 font-medium text-gray-700 text-sm text-right">
          ACTIONS
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {services.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No services found</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Service Name & Description */}
              <div className="flex-1">
                <div className="font-medium text-gray-800">{service.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {service.description.substring(0, 60)}...
                </div>
              </div>

              {/* Category */}
              <div className="flex-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>

              {/* Price */}
              <div className="flex-1 flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-medium text-gray-800">
                  {formatPrice(service.price)}
                </span>
              </div>

              {/* Duration */}
              <div className="flex-1 flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600 text-sm">
                  {service.duration}
                </span>
              </div>

              {/* Status */}
              <div className="flex-1 flex items-center">
                <div className="flex items-center">
                  {getStatusIcon(service.status)}
                  <span
                    className={`ml-2 text-sm font-medium ${
                      service.status === "Active"
                        ? "text-green-600"
                        : service.status === "Inactive"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-1 flex justify-end space-x-2">
                <button
                  onClick={() => onView(service)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceTable;
