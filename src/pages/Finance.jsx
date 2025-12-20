import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  CreditCard,
  Wallet,
  BarChart3,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ============ INTERNAL COMPONENTS ============

/**
 * StatCard Component - For displaying financial KPIs
 */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  isLoading = false,
}) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-700",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      text: "text-purple-700",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      text: "text-orange-700",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {change && (
          <div
            className={`flex items-center text-sm px-2 py-1 rounded-full ${
              change >= 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
          <div className="text-sm text-gray-500">{title}</div>
        </>
      )}
    </div>
  );
};

/**
 * StatusBadge Component - Color-coded status indicators
 */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Paid: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
    },
    Unpaid: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: XCircle,
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: AlertCircle,
    },
    Partial: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: AlertCircle,
    },
    Overdue: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3 mr-1.5" />
      {status}
    </div>
  );
};

/**
 * InvoiceRow Component - Flexbox-based table row
 */
const InvoiceRow = ({ invoice, onView, onPrint, onMarkPaid }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      {/* Invoice ID */}
      <div className="flex-1 min-w-[150px]">
        <div className="font-mono font-medium text-gray-800">#{invoice.id}</div>
        <div className="text-sm text-gray-500 mt-1">
          Due {formatDate(invoice.dueDate)}
        </div>
      </div>

      {/* Customer */}
      <div className="flex-1 min-w-[180px]">
        <div className="font-medium text-gray-800">{invoice.customer}</div>
        <div className="text-sm text-gray-500">{invoice.carModel}</div>
      </div>

      {/* Date */}
      <div className="flex-1 min-w-[120px]">
        <div className="text-gray-700">{formatDate(invoice.date)}</div>
      </div>

      {/* Amount */}
      <div className="flex-1 min-w-[120px]">
        <div className="font-bold text-gray-800">
          {formatCurrency(invoice.amount)}
        </div>
        {invoice.tax && (
          <div className="text-sm text-gray-500">
            +{formatCurrency(invoice.tax)} tax
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[120px]">
        <StatusBadge status={invoice.status} />
      </div>

      {/* Actions */}
      <div className="flex-1 min-w-[200px] flex justify-end space-x-2">
        <button
          onClick={() => onView(invoice)}
          className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View
        </button>
        <button
          onClick={() => onPrint(invoice)}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Print PDF"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print
        </button>
        {invoice.status !== "Paid" && (
          <button
            onClick={() => onMarkPaid(invoice.id)}
            className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
            title="Mark as Paid"
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Mark Paid
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * FilterBar Component - Search and filter controls
 */
const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  const statusOptions = [
    "All",
    "Paid",
    "Unpaid",
    "Pending",
    "Partial",
    "Overdue",
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, invoice ID, or car model..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option} Status
              </option>
            ))}
          </select>
        </div>

        <select className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
          <option>Custom Range</option>
        </select>

        <button className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>
    </div>
  );
};

/**
 * InvoiceTableHeader Component - Flexbox table header
 */
const InvoiceTableHeader = () => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex-1 min-w-[150px] font-medium text-gray-700 text-sm">
        INVOICE ID
      </div>
      <div className="flex-1 min-w-[180px] font-medium text-gray-700 text-sm">
        CUSTOMER
      </div>
      <div className="flex-1 min-w-[120px] font-medium text-gray-700 text-sm">
        DATE
      </div>
      <div className="flex-1 min-w-[120px] font-medium text-gray-700 text-sm">
        AMOUNT
      </div>
      <div className="flex-1 min-w-[120px] font-medium text-gray-700 text-sm">
        STATUS
      </div>
      <div className="flex-1 min-w-[200px] font-medium text-gray-700 text-sm text-right">
        ACTIONS
      </div>
    </div>
  );
};

/**
 * QuickActionCard Component - For common finance actions
 */
const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
    >
      <div className={`p-3 rounded-lg mb-4 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </button>
  );
};

/**
 * RevenueChart Component - Simple revenue trend visualization
 */
const RevenueChart = () => {
  const revenueData = [65000, 72000, 68000, 85000, 92000, 88000, 105000];
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
          <p className="text-sm text-gray-500">Last 7 months</p>
        </div>
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span className="font-medium">+18.5%</span>
        </div>
      </div>

      <div className="flex items-end h-48 gap-2">
        {revenueData.map((value, index) => {
          const height = (value / maxRevenue) * 100;
          const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][
            index
          ];

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
              <div className="mt-2 text-xs text-gray-500">{month}</div>
              <div className="text-xs font-medium text-gray-700 mt-1">
                ${(value / 1000).toFixed(0)}k
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const FinancePage = () => {
  // Mock data for invoices
  const mockInvoices = [
    {
      id: "INV-2024-001",
      customer: "John Smith",
      carModel: "Toyota Camry 2020",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 450.0,
      tax: 31.5,
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      customer: "Maria Garcia",
      carModel: "Honda Civic 2022",
      date: "2024-01-18",
      dueDate: "2024-02-18",
      amount: 320.75,
      tax: 22.45,
      status: "Unpaid",
    },
    {
      id: "INV-2024-003",
      customer: "Robert Johnson",
      carModel: "Ford F-150 2021",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 850.5,
      tax: 59.54,
      status: "Pending",
    },
    {
      id: "INV-2024-004",
      customer: "Sarah Williams",
      carModel: "BMW X5 2023",
      date: "2024-01-22",
      dueDate: "2024-02-22",
      amount: 1250.0,
      tax: 87.5,
      status: "Partial",
    },
    {
      id: "INV-2024-005",
      customer: "Michael Brown",
      carModel: "Chevrolet Malibu 2019",
      date: "2024-01-25",
      dueDate: "2024-02-25",
      amount: 275.25,
      tax: 19.27,
      status: "Overdue",
    },
    {
      id: "INV-2024-006",
      customer: "Jennifer Lee",
      carModel: "Tesla Model 3 2023",
      date: "2024-01-28",
      dueDate: "2024-02-28",
      amount: 980.0,
      tax: 68.6,
      status: "Paid",
    },
    {
      id: "INV-2024-007",
      customer: "David Wilson",
      carModel: "Jeep Wrangler 2022",
      date: "2024-02-01",
      dueDate: "2024-03-01",
      amount: 620.8,
      tax: 43.46,
      status: "Unpaid",
    },
    {
      id: "INV-2024-008",
      customer: "Lisa Taylor",
      carModel: "Mercedes C-Class 2023",
      date: "2024-02-03",
      dueDate: "2024-03-03",
      amount: 1120.4,
      tax: 78.43,
      status: "Pending",
    },
  ];

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [invoices, setInvoices] = useState(mockInvoices);

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.carModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate financial KPIs
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount + (inv.tax || 0), 0);

  const pendingPayments = invoices
    .filter((inv) => inv.status === "Unpaid" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount + (inv.tax || 0), 0);

  const completedInvoices = invoices.filter(
    (inv) => inv.status === "Paid"
  ).length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "Overdue"
  ).length;

  // Event handlers
  const handleViewInvoice = (invoice) => {
    alert(
      `Viewing Invoice: ${invoice.id}\nCustomer: ${invoice.customer}\nAmount: $${invoice.amount}`
    );
  };

  const handlePrintInvoice = (invoice) => {
    alert(`Printing Invoice: ${invoice.id}`);
  };

  const handleMarkAsPaid = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
      )
    );
    alert(`Invoice ${invoiceId} marked as paid`);
  };

  const handleGenerateReport = () => {
    alert("Generating financial report...");
  };

  const handleSendReminders = () => {
    alert("Sending payment reminders...");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Finance & Invoicing
          </h1>
          <p className="text-gray-600">
            Manage payments, invoices, and financial reports
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Financial Overview - KPIs */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Pending Payments"
          value={`$${pendingPayments.toLocaleString()}`}
          change={-8.2}
          icon={Wallet}
          color="orange"
        />
        <StatCard
          title="Completed Invoices"
          value={completedInvoices}
          change={15.3}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Overdue Invoices"
          value={overdueInvoices}
          change={-3.1}
          icon={AlertCircle}
          color="purple"
        />
      </div>

      {/* Filters and Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="lg:w-2/3">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <div className="lg:w-1/3">
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
            <QuickActionCard
              title="Send Reminders"
              description="Send payment reminders to customers"
              icon={CreditCard}
              color="bg-blue-600"
              onClick={handleSendReminders}
            />
            <QuickActionCard
              title="Monthly Report"
              description="Generate monthly financial report"
              icon={BarChart3}
              color="bg-green-600"
              onClick={handleGenerateReport}
            />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mb-8">
        <RevenueChart />
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <InvoiceTableHeader />

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                onView={handleViewInvoice}
                onPrint={handlePrintInvoice}
                onMarkPaid={handleMarkAsPaid}
              />
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{filteredInvoices.length}</span> of{" "}
            <span className="font-medium">{invoices.length}</span> invoices
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700">
              Page 1 of 3
            </span>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex flex-wrap gap-4 mt-8">
        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Invoices</span>
              <span className="font-medium text-green-600">
                $
                {invoices
                  .filter((i) => i.status === "Paid")
                  .reduce((sum, i) => sum + i.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unpaid Invoices</span>
              <span className="font-medium text-red-600">
                $
                {invoices
                  .filter(
                    (i) => i.status === "Unpaid" || i.status === "Overdue"
                  )
                  .reduce((sum, i) => sum + i.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Invoice Value</span>
              <span className="font-medium text-blue-600">
                $
                {Math.round(
                  invoices.reduce((sum, i) => sum + i.amount, 0) /
                    invoices.length
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">
                Invoice INV-2024-006 marked as paid
              </span>
              <span className="text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-700">
                New invoice created for John Smith
              </span>
              <span className="text-gray-500 ml-auto">1 hour ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-gray-700">
                Payment reminder sent to Maria Garcia
              </span>
              <span className="text-gray-500 ml-auto">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
