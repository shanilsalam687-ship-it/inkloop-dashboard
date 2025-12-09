import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Users, Briefcase, TrendingUp, Calendar, CheckCircle, Download } from 'lucide-react';

// InkloopDashboard.jsx
// A production-ready single-file dashboard for Inkloop. Uses Tailwind for styling.

export default function InkloopDashboard({ initialData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [range, setRange] = useState('6m'); // '3m' | '6m' | '12m'

  // Fallback sample data (used if no initialData prop provided)
  const sample = useMemo(() => ({
    financialData: {
      monthlyRevenue: [
        { month: 'Jan', revenue: 45000, expenses: 28000, profit: 17000 },
        { month: 'Feb', revenue: 52000, expenses: 30000, profit: 22000 },
        { month: 'Mar', revenue: 48000, expenses: 29000, profit: 19000 },
        { month: 'Apr', revenue: 61000, expenses: 32000, profit: 29000 },
        { month: 'May', revenue: 58000, expenses: 31000, profit: 27000 },
        { month: 'Jun', revenue: 67000, expenses: 33000, profit: 34000 },
      ],
      totalRevenue: 331000,
      totalExpenses: 183000,
      netProfit: 148000,
      profitMargin: 44.7,
    },
    clientData: {
      totalClients: 24,
      activeClients: 18,
      newThisMonth: 4,
      retentionRate: 85,
      clientsByType: [
        { name: 'Branding', value: 8 },
        { name: 'Social Media', value: 6 },
        { name: 'Full Service', value: 10 },
      ],
    },
    projectData: {
      totalProjects: 42,
      completed: 38,
      inProgress: 4,
      avgProjectValue: 7881,
      completionRate: 90.5,
      projectsByMonth: [
        { month: 'Jan', completed: 5, started: 6 },
        { month: 'Feb', completed: 7, started: 5 },
        { month: 'Mar', completed: 6, started: 7 },
        { month: 'Apr', completed: 8, started: 6 },
        { month: 'May', completed: 6, started: 8 },
        { month: 'Jun', completed: 6, started: 10 },
      ],
    },
    teamData: {
      totalHours: 856,
      billableHours: 684,
      utilizationRate: 79.9,
      partnerContribution: [
        { name: 'Shanil', hours: 214, revenue: 89000 },
        { name: 'Sharin', hours: 228, revenue: 95000 },
        { name: 'Sabah', hours: 198, revenue: 78000 },
        { name: 'Thasni', hours: 216, revenue: 69000 },
      ],
    },
  }), []);

  const data = initialData || sample;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Helpers
  const formatCurrency = (n) => {
    if (typeof n !== 'number') return n;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const exportCSV = (rows, filename = 'inkloop_data.csv') => {
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metric card component
  const MetricCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200" role="region" aria-label={title}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <Icon size={16} />
            <span>{title}</span>
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
        </div>
        {typeof trend === 'number' && (
          <div className={`px-2 py-1 rounded text-xs font-semibold ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  const partnerTable = data.teamData.partnerContribution.map((p) => ({
    Partner: p.name,
    Hours: p.hours,
    Revenue: p.revenue,
    AvgRate: Math.round(p.revenue / p.hours),
    Share: '25%',
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Inkloop Dashboard</h1>
            <p className="text-gray-600">Real-time business metrics for smart decisions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
              <label htmlFor="range" className="text-xs text-gray-600 mr-2">Range</label>
              <select
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="text-sm bg-transparent outline-none"
              >
                <option value="3m">Last 3 months</option>
                <option value="6m">Last 6 months</option>
                <option value="12m">Last 12 months</option>
              </select>
            </div>

            <button
              onClick={() => exportCSV(partnerTable, 'inkloop_partners.csv')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-blue-700"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['overview', 'financial', 'clients', 'projects', 'team'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                icon={DollarSign}
                title="Total Revenue"
                value={formatCurrency(data.financialData.totalRevenue)}
                subtitle="Last 6 months"
                trend={12.3}
              />
              <MetricCard
                icon={Users}
                title="Active Clients"
                value={data.clientData.activeClients}
                subtitle={`${data.clientData.newThisMonth} new this month`}
                trend={8.5}
              />

              <MetricCard
                icon={Briefcase}
                title="Projects In Progress"
                value={data.projectData.inProgress}
                subtitle={`${data.projectData.completed} completed`}
                trend={5.2}
              />

              <MetricCard
                icon={TrendingUp}
                title="Profit Margin"
                value={`${data.financialData.profitMargin}%`}
                subtitle="Healthy growth"
                trend={3.1}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Revenue vs Profit</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.financialData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Clients by Service Type</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.clientData.clientsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {data.clientData.clientsByType.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* FINANCIAL TAB */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                icon={DollarSign}
                title="Total Revenue"
                value={formatCurrency(data.financialData.totalRevenue)}
                subtitle="6-month total"
              />
              <MetricCard
                icon={TrendingUp}
                title="Net Profit"
                value={formatCurrency(data.financialData.netProfit)}
                subtitle={`${data.financialData.profitMargin}% margin`}
              />

              <MetricCard
                icon={Calendar}
                title="Avg Monthly"
                value={formatCurrency(Math.round(data.financialData.totalRevenue / 6))}
                subtitle="Revenue per month"
              />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3">Monthly Financial Overview</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={data.financialData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                  <Bar dataKey="profit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CLIENT TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard title="Total Clients" icon={Users} value={data.clientData.totalClients} />
              <MetricCard title="Active Clients" icon={CheckCircle} value={data.clientData.activeClients} trend={8.5} />
              <MetricCard title="New This Month" icon={TrendingUp} value={data.clientData.newThisMonth} />
              <MetricCard title="Retention Rate" icon={DollarSign} value={`${data.clientData.retentionRate}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Service Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.clientData.clientsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, value }) => `${name}: ${value}`}
                      dataKey="value"
                    >
                      {data.clientData.clientsByType.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Key Client Metrics</h3>
                <div className="space-y-4 mt-4">
                  <div className="p-3 bg-blue-50 rounded flex justify-between">
                    <span>Average Client Value</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(Math.round(data.financialData.totalRevenue / data.clientData.totalClients))}
                    </span>
                  </div>

                  <div className="p-3 bg-green-50 rounded flex justify-between">
                    <span>Client Lifetime Value</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        Math.round(
                          (data.financialData.totalRevenue / data.clientData.totalClients) *
                            (data.clientData.retentionRate / 100),
                        ),
                      )}
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded flex justify-between">
                    <span>Growth Rate</span>
                    <span className="font-semibold text-purple-600">
                      +{((data.clientData.newThisMonth / data.clientData.totalClients) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard title="Total Projects" icon={Briefcase} value={data.projectData.totalProjects} />
              <MetricCard
                title="Completed"
                icon={CheckCircle}
                value={data.projectData.completed}
                subtitle={`${data.projectData.completionRate}% rate`}
              />

              <MetricCard title="In Progress" icon={TrendingUp} value={data.projectData.inProgress} />

              <MetricCard
                title="Avg Project Value"
                icon={DollarSign}
                value={formatCurrency(Math.round(data.projectData.avgProjectValue))}
              />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3">Project Activity Timeline</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={data.projectData.projectsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="started" fill="#3b82f6" />
                  <Bar dataKey="completed" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Total Hours" icon={Users} value={data.teamData.totalHours} subtitle="Last month" />
              <MetricCard
                title="Billable Hours"
                icon={DollarSign}
                value={data.teamData.billableHours}
                subtitle={`${data.teamData.utilizationRate}% utilization`}
              />

              <MetricCard
                title="Efficiency"
                icon={TrendingUp}
                value={`${data.teamData.utilizationRate}%`}
                subtitle="Strong performance"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Partner Contributions (Hours)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.teamData.partnerContribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-3">Revenue by Partner</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.teamData.partnerContribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${v / 1000}k`} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3">Partner Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Partner</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hours</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avg Rate</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.teamData.partnerContribution.map((partner, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{partner.name}</td>
                        <td className="px-4 py-3 text-sm">{partner.hours}h</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(partner.revenue)}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(Math.round(partner.revenue / partner.hours))}/h</td>
                        <td className="px-4 py-3 text-sm">25%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro Tip:</strong> This dashboard accepts an <code>initialData</code> prop if you want to feed real data from your backend. 
          </p>
        </div>
      </div>
    </div>
  );
}
