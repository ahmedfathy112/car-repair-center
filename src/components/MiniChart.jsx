import React from "react";

const SimpleBarChart = ({ value, maxValue = 100, color = "blue" }) => {
  const percentage = (value / maxValue) * 100;

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClasses[color]} rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 font-medium">
          {value}/{maxValue}
        </span>
      </div>
    </div>
  );
};

export default SimpleBarChart;
