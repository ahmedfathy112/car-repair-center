import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  AlertCircle,
  CheckCircle,
  Wrench,
  Car,
  Building,
  Fingerprint,
  Smartphone,
  Key,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

// ============ INTERNAL COMPONENTS ============

/**
 * Logo Component - Brand identity
 */
const Logo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-4 shadow-lg">
        <Wrench className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        AutoCare Pro
      </h1>
      <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
    </div>
  );
};

/**
 * InputGroup Component - Reusable form input with icons
 */
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

/**
 * SecurityIndicator Component - Password strength meter
 */
const SecurityIndicator = ({ password }) => {
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(password);

  const getColor = () => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getText = () => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Password Strength</span>
        <span className="font-medium">{getText()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * TwoFactorAuth Component - 2FA input
 */
const TwoFactorAuth = ({ value, onChange, error }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Fingerprint className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">
            Two-Factor Authentication
          </h3>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Required
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Key className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter 6-digit code"
          maxLength="6"
          className={`
            block w-full pl-10 pr-4 py-3.5
            border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:border-blue-500
            text-center text-2xl font-mono tracking-widest
            ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"}
          `}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-500">
          Code sent to your authenticator app
        </span>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <RefreshCw className="w-3 h-3 mr-1.5" />
          Resend Code
        </button>
      </div>
    </div>
  );
};

/**
 * LoadingSpinner Component - Button loading state
 */
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span className="ml-2">Authenticating...</span>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const LoginPage = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (showTwoFactor && !/^\d{6}$/.test(twoFactorCode)) {
      newErrors.twoFactorCode = "Please enter a valid 6-digit code";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      setLoading(false);

      // Simulate successful first factor
      if (!showTwoFactor && loginAttempts < 3) {
        setShowTwoFactor(true);
        setLoginAttempts((prev) => prev + 1);
        return;
      }

      // Simulate login success
      if (
        email === "admin@autocare.com" &&
        password === "Admin@123" &&
        twoFactorCode === "123456"
      ) {
        alert("Login successful! Redirecting to dashboard...");
        // In real app: navigate('/dashboard');
      } else {
        setErrors({
          general: "Invalid credentials. Please try again.",
        });
        setLoginAttempts((prev) => prev + 1);
      }
    }, 1500);
  };

  // Reset form
  const handleReset = () => {
    setEmail("");
    setPassword("");
    setTwoFactorCode("");
    setErrors({});
    setShowTwoFactor(false);
  };

  // Demo login (for testing)
  const handleDemoLogin = () => {
    setEmail("admin@autocare.com");
    setPassword("Admin@123");
    setShowTwoFactor(true);
    setTwoFactorCode("123456");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Brand/Info */}
        <div className="lg:w-2/5 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 lg:p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Secure Admin Portal</h2>
                  <p className="text-sm text-blue-200">
                    Enterprise Grade Security
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
              <p className="text-blue-200 mb-8">
                Access your auto repair center dashboard with enterprise-level
                security and full administrative controls.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Fleet Management</h3>
                    <p className="text-sm text-blue-200">
                      Monitor all vehicles in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Multi-Branch Control</h3>
                    <p className="text-sm text-blue-200">
                      Manage multiple service centers
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mobile Ready</h3>
                    <p className="text-sm text-blue-200">
                      Access from any device, anywhere
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-700">
              <div className="flex items-center text-sm text-blue-300">
                <Shield className="w-4 h-4 mr-2" />
                <span>Enterprise Security • SOC 2 Compliant • GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-3/5 bg-white p-8 lg:p-12">
          <div className="h-full flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-10">
              <Logo />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {showTwoFactor
                  ? "Two-Factor Authentication"
                  : "Admin Dashboard Access"}
              </h2>
              <p className="text-gray-600">
                {showTwoFactor
                  ? "Enter the 6-digit code from your authenticator app"
                  : "Sign in to your account to continue"}
              </p>
            </div>

            {/* Error Alert */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">
                      Authentication Failed
                    </p>
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Login Attempt {loginAttempts} of 5
                    </p>
                    <p className="text-sm text-yellow-600">
                      Multiple failed attempts will temporarily lock your
                      account
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              {!showTwoFactor ? (
                <>
                  {/* Email Input */}
                  <InputGroup
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@autocare.com"
                    icon={Mail}
                    error={errors.email}
                    success={email && !errors.email}
                  />

                  {/* Password Input */}
                  <InputGroup
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    icon={Lock}
                    error={errors.password}
                    success={password && !errors.password}
                    showPasswordToggle={true}
                    isPasswordVisible={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                  />

                  {/* Password Strength */}
                  <SecurityIndicator password={password} />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Remember this device
                      </span>
                    </label>

                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() => alert("Password reset email sent!")}
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 2FA Input */}
                  <TwoFactorAuth
                    value={twoFactorCode}
                    onChange={(e) =>
                      setTwoFactorCode(e.target.value.replace(/\D/g, ""))
                    }
                    error={errors.twoFactorCode}
                  />

                  {/* Back to login */}
                  <button
                    type="button"
                    onClick={() => setShowTwoFactor(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 mb-6 flex items-center"
                  >
                    ← Back to email/password
                  </button>
                </>
              )}

              {/* Submit Button */}
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
                    {showTwoFactor ? (
                      <>
                        <Fingerprint className="w-5 h-5 mr-3" />
                        Verify & Sign In
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-3" />
                        Sign In to Dashboard
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full mt-4 py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                Try Demo Account
              </button>

              {/* Reset Form */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Clear Form
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-3">
                <button
                  type="button"
                  className="hover:text-gray-700 transition-colors"
                  onClick={() => alert("Privacy policy")}
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  type="button"
                  className="hover:text-gray-700 transition-colors"
                  onClick={() => alert("Terms of service")}
                >
                  Terms of Service
                </button>
                <span>•</span>
                <button
                  type="button"
                  className="hover:text-gray-700 transition-colors"
                  onClick={() => alert("Contact support")}
                >
                  Support
                </button>
              </div>

              <p className="text-xs text-gray-400">
                <Clock className="w-3 h-3 inline mr-1" />
                Session timeout: 30 minutes of inactivity
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © {new Date().getFullYear()} AutoCare Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-lg">
          <Shield className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            Secure Connection
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
