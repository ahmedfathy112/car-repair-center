// features/auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Wrench,
  User,
  Settings,
  Car,
  Shield,
  Building,
  Smartphone,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  clearError,
  selectIsAdmin,
  selectIsMechanic,
  selectIsCustomer,
  selectProfileLoaded,
} from "../Redux-Toolkit/slices/authSlice";

// مكونات داخلية
const Logo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-4 shadow-lg">
        <Wrench className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        AutoCare Pro
      </h1>
      <p className="text-gray-500 text-sm mt-1">نظام إدارة الورشة</p>
    </div>
  );
};

const InputGroup = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  success,
  onToggleVisibility,
  showPasswordToggle = false,
  isPasswordVisible = false,
}) => {
  return (
    <div className="w-full mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type={
            showPasswordToggle
              ? isPasswordVisible
                ? "text"
                : "password"
              : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-10 py-3.5
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-offset-1
            transition-all duration-200
            ${
              error
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : success
                ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }
            ${error ? "bg-red-50" : success ? "bg-green-50" : "bg-gray-50"}
          `}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={
              isPasswordVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
          >
            {isPasswordVisible ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}

        {success && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error}
        </p>
      )}
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span className="ml-2">جاري المصادقة...</span>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: {
      color: "bg-purple-100 text-purple-800",
      icon: Settings,
      label: "مدير النظام",
    },
    mechanic: {
      color: "bg-blue-100 text-blue-800",
      icon: Wrench,
      label: "ميكانيكي",
    },
    customer: {
      color: "bg-green-100 text-green-800",
      icon: User,
      label: "عميل",
    },
  };

  const config = roleConfig[role] || roleConfig.customer;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {config.label}
    </div>
  );
};

// المكون الرئيسي
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAdmin = useSelector(selectIsAdmin);
  const isMechanic = useSelector(selectIsMechanic);
  const isCustomer = useSelector(selectIsCustomer);
  const profileLoaded = useSelector(selectProfileLoaded);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // مسح الأخطاء عند التحميل
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // التعامل مع أخطاء المصادقة
  useEffect(() => {
    if (authError) {
      let errorMessage = authError;

      if (authError.includes("Invalid login credentials")) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (authError.includes("Email not confirmed")) {
        errorMessage = "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول";
      } else if (authError.includes("Database error")) {
        errorMessage = "مشكلة في قاعدة البيانات. يرجى المحاولة لاحقاً";
      } else if (authError.includes("Cannot connect")) {
        errorMessage = "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت";
      }

      setErrors({ general: errorMessage });
    }
  }, [authError]);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "يجب أن تكون كلمة المرور 6 أحرف على الأقل";
    }

    return newErrors;
  };

  // التعامل مع تغيير المدخلات
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // مسح الخطأ المحدد عند البدء في الكتابة
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result && profileLoaded) {
        // إعادة التوجيه بعد تأخير قصير
        setTimeout(() => {
          switch (result.role) {
            case "admin":
              navigate("/");
              break;
            case "mechanic":
              navigate("/");
              break;
            case "customer":
              navigate("/my-vehicles");
              break;
            default:
              navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("فشل تسجيل الدخول:", error);
    }
  };

  // تسجيل الدخول التجريبي
  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: "admin@autocare.com", password: "Admin123!" },
      mechanic: { email: "mechanic@autocare.com", password: "Mechanic123!" },
      customer: { email: "customer@example.com", password: "Customer123!" },
    };

    const account = demoAccounts[role];
    if (account) {
      setFormData(account);
      toast(`جاري استخدام حساب ${role} التجريبي`, { icon: "🔧" });
    }
  };

  // نسخ النموذج
  const handleReset = () => {
    setFormData({ email: "", password: "" });
    setErrors({});
    dispatch(clearError());
    toast.success("تم مسح النموذج");
  };

  // نسيت كلمة المرور
  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error("يرجى إدخال بريدك الإلكتروني أولاً");
      return;
    }
    toast(`سيتم إرسال رابط إعادة تعيين كلمة المرور إلى ${formData.email}`, {
      icon: "🔒",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* الحاوية الرئيسية */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
        {/* الجانب الأيسر - العلامة التجارية والمعلومات */}
        {/* <div className="lg:w-2/5 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 lg:p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">بوابة الإدارة الآمنة</h2>
                  <p className="text-sm text-blue-200">
                    أمان على مستوى المؤسسات
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-6">مرحباً بعودتك</h1>
              <p className="text-blue-200 mb-8">
                قم بالوصول إلى لوحة تحكم ورشة السيارات الخاصة بك مع أمان على
                مستوى المؤسسات وضوابط إدارية كاملة.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">إدارة الأسطول</h3>
                    <p className="text-sm text-blue-200">
                      مراقبة جميع المركبات في الوقت الفعلي
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">التحكم متعدد الفروع</h3>
                    <p className="text-sm text-blue-200">
                      إدارة مراكز الخدمة المتعددة
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">جاهز للجوال</h3>
                    <p className="text-sm text-blue-200">
                      الوصول من أي جهاز، في أي مكان
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-700">
              <div className="flex items-center text-sm text-blue-300">
                <Shield className="w-4 h-4 mr-2" />
                <span>أمان المؤسسات • متوافق مع SOC 2 • جاهز لـ GDPR</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* الجانب الأيمن - نموذج تسجيل الدخول */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12">
          <div className="h-full flex flex-col justify-center">
            {/* الرأس */}
            <div className="text-center mb-10">
              <Logo />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                الوصول إلى لوحة التحكم
              </h2>
              <p className="text-gray-600">
                قم بتسجيل الدخول إلى حسابك للمتابعة
              </p>
            </div>

            {/* تنبيه الخطأ */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">فشل المصادقة</p>
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            {/* حسابات تجريبية */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                جرب الحسابات التجريبية:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDemoLogin("admin")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  حساب المدير
                </button>
                <button
                  onClick={() => handleDemoLogin("mechanic")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  حساب الميكانيكي
                </button>
                <button
                  onClick={() => handleDemoLogin("customer")}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all"
                >
                  حساب العميل
                </button>
              </div>
            </div>

            {/* النموذج */}
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              {/* إدخال البريد الإلكتروني */}
              <InputGroup
                type="email"
                label="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="admin@autocare.com"
                icon={Mail}
                error={errors.email}
                success={formData.email && !errors.email}
              />

              {/* إدخال كلمة المرور */}
              <InputGroup
                type="password"
                label="كلمة المرور"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="أدخل كلمة المرور"
                icon={Lock}
                error={errors.password}
                success={formData.password && !errors.password}
                showPasswordToggle={true}
                isPasswordVisible={showPassword}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />

              {/* تذكرني ونسيت كلمة المرور */}
              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    تذكر هذا الجهاز
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 px-6 rounded-xl font-medium
                  flex items-center justify-center
                  transition-all duration-200
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }
                  text-white shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-3" />
                    تسجيل الدخول إلى لوحة التحكم
                  </>
                )}
              </button>

              {/* زر مسح النموذج */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full mt-4 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                مسح النموذج
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
