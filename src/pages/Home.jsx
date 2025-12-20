import React, { useState } from "react";
import StatsCard from "../components/StatsCard";
import RecentOrdersTable from "../components/RecentOrdersTable";
import { Activity, Package, AlertTriangle, CreditCard } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for stats cards
  const statsData = [
    { title: "Product Requests", value: "10", label: "VX", prefix: "VX" },
    { title: "Service Requests", value: "2", label: "SX", prefix: "SX" },
    {
      title: "Emergency Service Requests",
      value: "10",
      label: "SX",
      prefix: "SX",
    },
    { title: "Transactions", value: "22", label: "NX", prefix: "NX" },
  ];

  // Sample data for recent orders
  const recentOrders = [
    {
      customer: "Tom Grains",
      location: "Ur - 7 Served",
      orderDetails: "Brake Pad Replacement",
      orderType: "Product",
      otpVerification: "Verify",
      orderStatus: "Pending",
      time: "Just now",
    },
    {
      customer: "Angelina Jolla",
      location: "Remote team",
      orderDetails: "Driver Paydownload",
      orderType: "Emergency",
      otpVerification: "Verify",
      orderStatus: "Pending",
      time: "Just now",
    },
    {
      customer: "Georges Alvarez",
      location: "The most grateful",
      orderDetails: "Service Request + cost $250",
      orderType: "Service",
      otpVerification: "Verify",
      orderStatus: "Pending",
      time: "3 hours ago",
    },
    {
      customer: "Hans Dean",
      location: "Jurassic record",
      orderDetails: "Oil Change + 100$ + 50%",
      orderType: "Product",
      otpVerification: "Verified",
      orderStatus: "Completed",
      time: "3 hours ago",
    },
    {
      customer: "Robert Devaney Jr.",
      location: "Tom more useful",
      orderDetails: "Strategy + 750 $150",
      orderType: "Product",
      otpVerification: "Verified",
      orderStatus: "Completed",
      time: "Today, 5:00 am",
    },
    {
      customer: "Suzafar Johansson",
      location: "Black widow square",
      orderDetails: "Suspension + 700 $150",
      orderType: "Emergency",
      otpVerification: "Verified",
      orderStatus: "Completed",
      time: "Today, 5:00 am",
    },
    {
      customer: "Nv",
      location: "India",
      orderDetails: "Device Wheel + 700 $150",
      orderType: "Product",
      otpVerification: "Verified",
      orderStatus: "Completed",
      time: "Today, 5:00 am",
    },
    {
      customer: "John Smith",
      location: "Downtown",
      orderDetails: "Tire Rotation",
      orderType: "Service",
      otpVerification: "Verify",
      orderStatus: "Pending",
      time: "Today, 8:00 am",
    },
  ];

  // Icons for stats cards
  const statIcons = [
    <Package key="product" className="w-8 h-8 text-blue-500" />,
    <Activity key="service" className="w-8 h-8 text-green-500" />,
    <AlertTriangle key="emergency" className="w-8 h-8 text-red-500" />,
    <CreditCard key="transactions" className="w-8 h-8 text-purple-500" />,
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <DashboardHeader onMenuClick={() => setSidebarOpen(true)} /> */}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Live Activity Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Live Activity
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Live</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 flex-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-600 text-sm font-medium mb-2">
                        {stat.title}
                      </h3>
                      <div className="flex items-baseline">
                        <span className="text-gray-400 text-sm mr-2">
                          {stat.prefix}:
                        </span>
                        <span className="text-3xl font-bold text-gray-800">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                    {statIcons[index]}
                  </div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="mb-8">
            <RecentOrdersTable orders={recentOrders} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm">
                  + New Service Request
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-sm">
                  View All Orders
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 text-sm">
                  Generate Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2 lg:col-span-2">
              <h3 className="font-medium text-gray-800 mb-4">
                Activity Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Today's Orders</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Pending Verification</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Emergency Requests</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-4">Total Revenue</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  $2,850
                </div>
                <div className="text-sm text-gray-500 mb-4">This Month</div>
                <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                  +12.5% from last month
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
