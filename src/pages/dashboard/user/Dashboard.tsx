import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Send, Plus, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppSelector } from '@/redux/hook';
import { useGetDashboardStatsQuery, useGetTransactionsQuery } from '@/redux/services/api';
import { StatsCard } from '@/components/ui/StatsCard';
import { Link } from 'react-router';

const chartData = [
  { name: 'Jan', sent: 400, received: 240 },
  { name: 'Feb', sent: 300, received: 139 },
  { name: 'Mar', sent: 200, received: 980 },
  { name: 'Apr', sent: 278, received: 390 },
  { name: 'May', sent: 189, received: 480 },
  { name: 'Jun', sent: 239, received: 380 },
];

const transactionTypeData = [
  { name: 'Sent', value: 45, color: '#ef4444' },
  { name: 'Received', value: 30, color: '#22c55e' },
  { name: 'Deposits', value: 15, color: '#3b82f6' },
  { name: 'Withdrawals', value: 10, color: '#f59e0b' },
];

export default function UserDashboard() {
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
      case 'send':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'deposit':
        return <Plus className="h-4 w-4" />;
      case 'withdraw':
        return <Minus className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send':
      case 'withdraw':
        return 'text-red-600';
      case 'receive':
      case 'deposit':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your wallet today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Current Balance"
              value={formatCurrency(stats?.balance || 5000)}
              icon={Wallet}
              description="Available funds"
              isLoading={statsLoading}
            />
            <StatsCard
              title="This Month"
              value={formatCurrency(stats?.monthlyRevenue || 2450)}
              icon={TrendingUp}
              description="Total transactions"
              trend={{ value: 12, isPositive: true }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Money Sent"
              value={formatCurrency(1850)}
              icon={ArrowUpRight}
              description="Outgoing payments"
              isLoading={statsLoading}
            />
            <StatsCard
              title="Money Received"
              value={formatCurrency(3200)}
              icon={ArrowDownLeft}
              description="Incoming payments"
              isLoading={statsLoading}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your money in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/dashboard/user/send">
                  <Button className="w-full h-24 flex flex-col gap-2">
                    <Send className="h-6 w-6" />
                    <span>Send Money</span>
                  </Button>
                </Link>
                <Link to="/dashboard/user/deposit">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Deposit</span>
                  </Button>
                </Link>
                <Link to="/dashboard/user/withdraw">
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Minus className="h-6 w-6" />
                    <span>Withdraw</span>
                  </Button>
                </Link>
                <Link to="/dashboard/user/transactions">
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
                <CardTitle>Transaction Activity</CardTitle>
                <CardDescription>Your sending and receiving patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#ef4444" name="Sent" />
                    <Bar dataKey="received" fill="#22c55e" name="Received" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
                <CardDescription>Distribution of your transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </div>
              <Link to="/dashboard/user/transactions">
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
                  {transactionsData?.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'send' || transaction.type === 'withdraw' ? '-' : '+'}
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
