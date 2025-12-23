import { DashboardLayout } from '../layouts/DashboardLayout';

export const DashboardPage = () => {

  const stats = [
    { label: 'Total Products', value: '0', color: 'blue' },
    { label: 'Active Products', value: '0', color: 'green' },
    { label: 'Low Stock', value: '0', color: 'orange' },
    { label: 'Orders Today', value: '0', color: 'purple' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

       
        {/* Recent Activity Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
