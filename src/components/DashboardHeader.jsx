import React from "react";
import { Search, Bell, User, Menu, Home, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/services") return "Services";
    if (path === "/admin/services") return "Service Management";
    if (path === "/admin/inventory") return "Inventory Management";
    if (path === "/admin/finance") return "Finance & Invoicing";
    if (path === "/admin/customers") return "Customer Management";
    if (path === "/admin/reports") return "Reports";
    if (path === "/admin/analytics") return "Analytics";
    if (path === "/admin/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {getPageTitle()}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <Home className="w-4 h-4 mr-1" />
              <span className="text-xs">
                {location.pathname
                  .split("/")
                  .filter(Boolean)
                  .join(" / ")
                  .toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
