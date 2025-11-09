import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  UserCheck,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  PlayCircle,
} from 'lucide-react';
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
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppSelector } from '@/redux/hook';
import { AdminTour } from '@/components/ui/AdminTour';
import { useGetAdminDashboardStatsQuery, useGetRecentActivityQuery, useGetTransactionTrendsQuery, useGetTransactionTypesQuery } from '@/redux/services/api';



export default function AdminDashboard() {

 const {data, isLoading} = useGetAdminDashboardStatsQuery();
 const {data:trans} = useGetTransactionTrendsQuery();
  const {data:tTypes} = useGetTransactionTypesQuery();
  const {data:RecentAc} = useGetRecentActivityQuery()
 const statsData = data?.data;
 const transactionTrends = trans?.data;
 const transactionTypes = tTypes?.data;
const  recentActivity = RecentAc?.data;

  const [showTour, setShowTour] = useState(false);
  const { mode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    // Check if tour has been shown
    const tourCompleted = localStorage.getItem('admin-tour-completed');
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 1500);
    }
  }, []);

  const handleStartTour = () => {
    setShowTour(true);
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage users, agents, and monitor system performance
              </p>
            </div>
            <Button onClick={handleStartTour} variant="outline" className="gap-2 dark:!border-white/60 dark:text-white/60">
              <PlayCircle className="h-4 w-4 " />
              Start Tour
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" id="stats-cards">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsData.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{statsData.activeUsers.toLocaleString()} active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <UserCheck className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsData.totalAgents.toLocaleString()}</div>
                <div className="flex items-center text-xs text-amber-600 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{statsData.pendingAgents} pending approval</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsData.totalTransactions.toLocaleString()}</div>
                <div className="flex items-center text-xs text-blue-600 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>{statsData.todayTransactions.toLocaleString()} today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${(statsData.totalVolume / 1000000).toFixed(2)}M</div>
                <div className="flex items-center text-xs text-green-600 mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>${statsData.todayVolume.toLocaleString()} today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Transaction Trends */}
            <Card id="charts-section">
              <CardHeader>
                <CardTitle>Transaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={transactionTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke={mode === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
                        border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="transactions" stroke="#8b5cf6" strokeWidth={2} name="Transactions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction Types */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypes && transactionTypes?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
                        border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volume Trends Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={mode === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#3b82f6" name="Volume ($)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tour Component */}
        {showTour && <AdminTour onComplete={() => setShowTour(false)} />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}