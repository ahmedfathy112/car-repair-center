import React from "react";
import {
  LayoutDashboard,
  Wrench,
  Package,
  DollarSign,
  Settings,
  Users,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut,
  Home,
  Calendar,
  LogInIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
      exact: true,
    },
    {
      icon: <Home className="w-5 h-5" />,
      label: "Services Page",
      path: "/services",
      exact: true,
    },
    {
      icon: <LogInIcon className="w-5 h-5" />,
      label: "Login",
      path: "/login",
      exact: true,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Appointments",
      path: "/appointments",
      exact: true,
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      label: "Manage Services",
      path: "/admin/services",
      exact: true,
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Inventory",
      path: "/admin/inventory",
      exact: true,
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Finance",
      path: "/admin/finance",
      exact: true,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Customers",
      path: "/admin/customers",
      exact: true,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Reports",
      path: "/admin/reports",
      exact: true,
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      path: "/admin/analytics",
      exact: true,
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/admin/settings",
      exact: true,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30 
        bg-white border-r w-64 transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AutoCare Pro</h2>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Help & Logout */}
        <div className="p-4 border-t space-y-2">
          <NavLink
            to="/admin/help"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-lg
              transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </NavLink>

          <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
