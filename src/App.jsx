import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./MainLayout";
import Dashboard from "./pages/Home";
import ServicesPage from "./pages/Services";
// import ManageServices from "./pages/Operation";
import InventoryPage from "./pages/Inventory";
import FinancePage from "./pages/Finance";
import AppointmentsPage from "./pages/Appointments";
import LoginPage from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard - Main overview */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Customer-facing services page */}
          <Route path="services" element={<ServicesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Admin Management Pages */}
          <Route path="admin">
            {/* <Route path="services" element={<ManageServices />} /> */}
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="finance" element={<FinancePage />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a
                    href="/dashboard"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Return to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
