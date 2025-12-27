import React, { useEffect } from "react";
import {
  LayoutDashboard,
  Wrench,
  Package,
  Settings,
  Users,
  LogOut,
  Calendar,
  LogInIcon,
  Car,
  DollarSign,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsMechanic,
  selectIsCustomer,
  logoutUser,
} from "../Redux-Toolkit/slices/authSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isMechanic = useSelector(selectIsMechanic);
  const isCustomer = useSelector(selectIsCustomer);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const baseMenuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "لوحة التحكم",
      path: "/dashboard",
      exact: true,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "المواعيد",
      path: "/appointments",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 
          bg-white border-r w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col shadow-xl lg:shadow-none
        `}
        dir="rtl"
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">
                AutoCare
              </h2>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                Workshop Pro
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {isAuthenticated &&
              baseMenuItems.map((item, index) => (
                <li key={index}>
                  <SidebarLink item={item} onClose={onClose} />
                </li>
              ))}

            {/* Admin Management Section */}
            {isAdmin && (
              <div className="mt-8">
                <p className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  الإدارة العامة
                </p>
                <ul className="space-y-1.5">
                  <SidebarLink
                    item={{
                      icon: <Package size={20} />,
                      label: "أمر تشغيل",
                      path: "/job-card",
                    }}
                    onClose={onClose}
                  />
                  <SidebarLink
                    item={{
                      icon: <Package size={20} />,
                      label: "عرض أوامر التشغيل",
                      path: "/All-jops",
                    }}
                    onClose={onClose}
                  />
                  <SidebarLink
                    item={{
                      icon: <Users size={20} />,
                      label: "المستخدمين",
                      path: "/admin/customers",
                    }}
                    onClose={onClose}
                  />
                  <SidebarLink
                    item={{
                      icon: <Package size={20} />,
                      label: "المخزن",
                      path: "/admin/inventory",
                    }}
                    onClose={onClose}
                  />
                  <SidebarLink
                    item={{
                      icon: <DollarSign size={20} />,
                      label: "الماليه",
                      path: "/admin/finance",
                    }}
                    onClose={onClose}
                  />
                </ul>
              </div>
            )}

            {/* Mechanic Section */}
            {isMechanic && (
              <div className="mt-8">
                <p className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  قسم الفنيين
                </p>
                <SidebarLink
                  item={{
                    icon: <Wrench size={20} />,
                    label: "مهامي الحالية",
                    path: "/workshop/jobs",
                  }}
                  onClose={onClose}
                />
              </div>
            )}

            {/* Customer Section */}
            {isCustomer && (
              <div className="mt-8">
                <p className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  حسابي
                </p>
                <SidebarLink
                  item={{
                    icon: <Car size={20} />,
                    label: "سياراتي",
                    path: "/my-vehicles",
                  }}
                  onClose={onClose}
                />
              </div>
            )}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50/50">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-all duration-200 font-bold text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 w-full shadow-md shadow-blue-100 transition-all font-bold text-sm"
            >
              <LogInIcon className="w-5 h-5" />
              <span>تسجيل الدخول</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

// مكون فرعي للروابط لتقليل التكرار
const SidebarLink = ({ item, onClose }) => (
  <NavLink
    to={item.path}
    end={item.exact}
    onClick={onClose}
    className="block w-full" // تأكد أن الرابط يأخذ المساحة كاملة
  >
    {({ isActive }) => (
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-200 group
          ${
            isActive
              ? "bg-blue-50 text-blue-700 shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <span
          className={`transition-colors ${
            isActive
              ? "text-blue-600"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        >
          {item.icon}
        </span>
        <span className="font-bold text-sm">{item.label}</span>
      </div>
    )}
  </NavLink>
);
export default Sidebar;
