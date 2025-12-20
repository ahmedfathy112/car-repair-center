import React from "react";
import {
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

const ServiceStats = ({ services }) => {
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "Active").length;
  const totalRevenue = services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const avgPrice = totalServices > 0 ? totalRevenue / totalServices : 0;

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      trend: "+12%",
    },
    {
      title: "Active Services",
      value: activeServices,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      trend: "+8%",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
      trend: "+15%",
    },
    {
      title: "Avg. Price",
      value: `$${avgPrice.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-yellow-100 text-yellow-600",
      trend: "+5%",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex-1 min-w-[200px] bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color.split(" ")[0]}`}>
              <stat.icon className={`w-6 h-6 ${stat.color.split(" ")[1]}`} />
            </div>
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stat.trend}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-500">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ServiceStats;
