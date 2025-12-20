import React from "react";

const StatsCard = ({ title, value, prefix, progress, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      bar: "bg-blue-500",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-100",
      bar: "bg-green-500",
      text: "text-green-600",
    },
    red: {
      bg: "bg-red-100",
      bar: "bg-red-500",
      text: "text-red-600",
    },
    purple: {
      bg: "bg-purple-100",
      bar: "bg-purple-500",
      text: "text-purple-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <div className="flex flex-col">
        {/* Title */}
        <h3 className="text-gray-600 text-sm font-medium mb-4">{title}</h3>

        {/* Value with Prefix */}
        <div className="flex items-baseline mb-6">
          <span className="text-gray-400 text-lg font-medium mr-2">
            {prefix}:
          </span>
          <span className="text-3xl font-bold text-gray-800">{value}</span>
        </div>

        {/* Progress Bar - Simple visualization like in screenshot */}
        <div className="mt-2">
          <div className={`h-1.5 w-full rounded-full ${colors.bg} mb-1`}>
            <div
              className={`h-1.5 rounded-full ${colors.bar}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
