import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, DollarSign, Users, TrendingUp, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useAppSelector } from '@/redux/hook';
import { useGetDashboardStatsQuery, useGetTransactionsQuery } from '@/redux/services/api';
import { StatsCard } from '@/components/ui/StatsCard';
import { Link } from 'react-router';

const chartData = [
  { name: 'Mon', cashIn: 4000, cashOut: 2400, commission: 160 },
  { name: 'Tue', cashIn: 3000, cashOut: 1398, commission: 140 },
  { name: 'Wed', cashIn: 2000, cashOut: 9800, commission: 380 },
  { name: 'Thu', cashIn: 2780, cashOut: 3908, commission: 220 },
  { name: 'Fri', cashIn: 1890, cashOut: 4800, commission: 270 },
  { name: 'Sat', cashIn: 2390, cashOut: 3800, commission: 240 },
  { name: 'Sun', cashIn: 3490, cashOut: 4300, commission: 290 },
];

export default function AgentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetTransactionsQuery({ page: 1, limit: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'cash_in':
        return <Plus className="h-4 w-4" />;
      case 'cash_out':
        return <Minus className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'cash_in':
        return 'text-green-600';
      case 'cash_out':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! Manage your cash services here.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Balance"
              value={formatCurrency(stats?.balance || 25000)}
              icon={Wallet}
              description="Available funds"
              isLoading={statsLoading}
            />
            <StatsCard
              title="Today's Commission"
              value={formatCurrency(stats?.commission || 3500)}
              icon={DollarSign}
              description="Earnings today"
              trend={{ value: 8, isPositive: true }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Customers Served"
              value={stats?.todayTransactions || 45}
              icon={Users}
              description="Today's transactions"
              isLoading={statsLoading}
            />
            <StatsCard
              title="This Month"
              value={formatCurrency(stats?.monthlyRevenue || 125000)}
              icon={TrendingUp}
              description="Monthly volume"
              trend={{ value: 15, isPositive: true }}
              isLoading={statsLoading}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Provide cash services to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/dashboard/agent/cash-service?type=cash-in">
                  <Button className="w-full h-24 flex flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Cash In</span>
                  </Button>
                </Link>
                <Link to="/dashboard/agent/cash-service?type=cash-out">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Minus className="h-6 w-6" />
                    <span>Cash Out</span>
                  </Button>
                </Link>
                <Link to="/dashboard/agent/transactions">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <ArrowUpRight className="h-6 w-6" />
                    <span>View All</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="chart-card">
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Cash in vs Cash out activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cashIn" fill="#22c55e" name="Cash In" />
                    <Bar dataKey="cashOut" fill="#ef4444" name="Cash Out" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Trend</CardTitle>
                <CardDescription>Your earnings over the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commission" stroke="#3b82f6" strokeWidth={2} name="Commission ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest cash services provided</CardDescription>
              </div>
              <Link to="/dashboard/agent/transactions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded" />
                          <div className="h-3 w-24 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {transactionsData?.transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}