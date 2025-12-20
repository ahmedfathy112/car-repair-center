import React from "react";
import { CheckCircle, XCircle, Clock, MoreVertical } from "lucide-react";

const RecentOrdersTable = ({ orders }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Customer
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Location
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Order Details
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Order Type
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                OTP Verification
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Order Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Time
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-50 ${
                  index === orders.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium text-sm">
                        {order.customer.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {order.customer}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{order.location}</td>
                <td className="p-4">
                  <span className="font-medium text-gray-800">
                    {order.orderDetails}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.orderType === "Emergency"
                        ? "bg-red-100 text-red-800"
                        : order.orderType === "Service"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.orderType}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    {order.otpVerification === "Verify" ? (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                        Verify
                      </button>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-md text-xs ${
                          order.otpVerification === "Verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.otpVerification}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    {getStatusIcon(order.orderStatus)}
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-sm">{order.time}</td>
                <td className="p-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <span>Rows per page:</span>
          <select className="ml-2 border rounded px-2 py-1">
            <option>8</option>
            <option>16</option>
            <option>24</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
            Previous
          </button>
          <span className="text-sm text-gray-600">1 of 180</span>
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
