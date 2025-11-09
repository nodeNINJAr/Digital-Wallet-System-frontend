import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, DollarSign, Users, TrendingUp, Plus, Minus, ArrowUpRight, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useAppSelector } from '@/redux/hook';
import { useGetAgentDashboardStatsQuery, useGetAllTransactionsQuery } from '@/redux/services/api';
import { StatsCard } from '@/components/ui/StatsCard';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { AgentTour } from '@/components/ui/AgentTour';




// 
export default function AgentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading: statsLoading } = useGetAgentDashboardStatsQuery();
  const stats = data?.data
  const { data:trans, isLoading: transactionsLoading } = useGetAllTransactionsQuery({ page: 1, limit: 5 });
  const transactionsData = trans?.data?.transactions;
  // 
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
      case 'CASH_IN':
        return <Plus className="h-4 w-4" />;
      case 'CASH_OUT':
        return <Minus className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CASH_IN':
        return 'text-green-600';
      case 'CASH_OUT':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };



  const [showTour, setShowTour] = useState(false);
  // const { mode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    // Check if tour has been shown
    const tourCompleted = localStorage.getItem('agent-tour-completed');
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 1500);
    }
  }, []);

  const handleStartTour = () => {
    setShowTour(true);
  };




  // 

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
           <div className='flex justify-between'>
              <div>
              <h1 className="text-3xl font-bold">Agent Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}! Manage your cash services here.</p>
            </div>
            <Button onClick={handleStartTour} variant="outline" className="gap-2 bg-white/40">
              <PlayCircle className="h-4 w-4" />
              Start Tour
            </Button>
           </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Balance"
              value={formatCurrency(stats?.balance)}
              icon={Wallet}
              description="Available funds"
              isLoading={statsLoading}
            />
            <StatsCard
              title="Monthly Commission"
              value={formatCurrency(stats?.monthlyCommission)}
              icon={DollarSign}
              description="Earnings today"
              trend={{ value: 8, isPositive: true }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Customers Served"
              value={stats?.monthlyTransactionCount}
              icon={Users}
              description="Today's transactions"
              isLoading={statsLoading}
            />
            <StatsCard
              title="This Month"
              value={formatCurrency(stats?.monthlyCashOut)}
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
                  <Button variant={"outline"} className="!border-white/10 !text-white/40 w-full h-24 flex flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Cash In</span>
                  </Button>
                </Link>
                <Link to="/dashboard/agent/cash-service?type=withdraw">
                  <Button variant="outline" className="!border-white/10 !text-white/40 w-full h-24 flex flex-col gap-2">
                    <Minus className="h-6 w-6" />
                    <span>Withdraw</span>
                  </Button>
                </Link>
                <Link to="/dashboard/agent/transactions">
                  <Button variant="outline" className="!border-white/10 !text-white/40 w-full h-24 flex flex-col gap-2">
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
                  <BarChart data={stats?.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="CASH_IN" fill="#22c55e" name="Cash In" />
                    <Bar dataKey="CASH_OUT" fill="#ef4444" name="Cash Out" />
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
                  <LineChart data={stats?.chartData}>
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
                <Button variant="outline" size="sm" className='!border-white/30 !text-white/30'>View All</Button>
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
                  {transactionsData?.slice(0, 5).map((transaction) => (
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

        {/* Tour Component */}
        {showTour && <AgentTour onComplete={() => setShowTour(false)} />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}