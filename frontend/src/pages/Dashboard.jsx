import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const COLORS = ['#94a3b8', '#60a5fa', '#fbbf24', '#34d399'];

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-[.3rem] shadow-sm border p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const hasChartData = (data, valueKey) =>
  Array.isArray(data) && data.some((item) => Number(item[valueKey]) > 0);

const EmptyChart = () => (
  <div className="h-[250px] flex items-center justify-center text-sm font-medium text-gray-500">
    None
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => {
      setStats(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="px-4 py-5 sm:px-6">Loading dashboard...</div>;
  if (!stats) return <div className="px-4 py-5 sm:px-6">Failed to load stats.</div>;

  const statusData = Object.entries(stats.tasksByStatus).map(([name, value]) => ({ name, value }));
  const hasStatusData = hasChartData(statusData, 'value');
  const hasHoursData = hasChartData(stats.hoursByProject, 'totalHours');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-5 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Projects" value={stats.totalProjects} />
        <StatCard label="Total Tasks" value={stats.totalTasks} />
        <StatCard label="Hours Logged" value={stats.totalHoursLogged.toFixed(1)} />
        <StatCard label="Overdue Tasks" value={stats.overdueTasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[.3rem] shadow-sm border p-5">
          <h2 className="font-semibold mb-3">Tasks by Status</h2>
          {hasStatusData ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        <div className="bg-white rounded-[.3rem] shadow-sm border p-5">
          <h2 className="font-semibold mb-3">Hours by Project</h2>
          {hasHoursData ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.hoursByProject}>
                <XAxis dataKey="projectName" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalHours" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      <div className="bg-white rounded-[.3rem] shadow-sm border p-5">
        <h2 className="font-semibold mb-3">Recent Tasks</h2>
        <div className="divide-y">
          {stats.recentTasks.map((t) => (
            <Link
              key={t._id}
              to={`/tasks/${t._id}`}
              className="flex flex-col gap-2 py-2 hover:bg-gray-50 px-2 rounded sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{t.title}</p>
                <p className="text-xs text-gray-500">{t.project?.name}</p>
              </div>
              <span className="w-fit text-xs bg-gray-100 px-2 py-1 rounded-[.3rem]">{t.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
