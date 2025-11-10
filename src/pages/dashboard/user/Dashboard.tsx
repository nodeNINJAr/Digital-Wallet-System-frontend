import { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Send, Plus, Minus, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, type PieLabelRenderProps } from 'recharts';
import { useAppSelector } from '@/redux/hook';
import { StatsCard } from '@/components/ui/StatsCard';
import { Link } from 'react-router';
import { useGetDashboardStatsQuery, useGetTransactionsQuery } from '@/redux/services/api';
import { IStatus, IType } from '@/types/interface';
import { UserTour } from '@/components/ui/UserTour';



export default function UserDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetTransactionsQuery({ page: 1, limit: 10 });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getTransactionIcon = (type: IType) => {
    switch (type) {
      case IType.CASH_OUT: return <ArrowUpRight className="h-4 w-4" />;
      case IType.CASH_IN: return <ArrowDownLeft className="h-4 w-4" />;
      case IType.SEND: return <Plus className="h-4 w-4" />;
      case IType.WITHDRAW: return <Minus className="h-4 w-4" />;
      case IType.BONUS: return <Plus className="h-4 w-4" />;
      default: return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: IType) => {
    switch (type) {
      case IType.SEND:
      case IType.WITHDRAW:
      case IType.CASH_OUT:
        return 'text-red-600';
      case IType.CASH_IN:
      case IType.BONUS:
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = months.map((m) => ({ name: m, SEND: 0, CASH_OUT: 0 }));

    transactionsData?.data?.transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const monthIndex = date.getMonth();
      const type = t.type as IType;
      if (([IType.SEND, IType.WITHDRAW, IType.CASH_OUT] as IType[]).includes(type)) {
       data[monthIndex].SEND += t.amount;
         }
      else data[monthIndex].CASH_OUT += t.amount;
    });

    return data;
  }, [transactionsData]);

  const transactionTypeData = useMemo(() => {
    const types: IType[] = [IType.SEND, IType.CASH_IN, IType.CASH_OUT, IType.BONUS];
    const colors: Record<IType, string> = {
      [IType.SEND]: '#ef4444',
      [IType.CASH_IN]: '#22c55e',
      [IType.CASH_OUT]: '#f59e0b',
      [IType.BONUS]: '#a855f7',
      [IType.WITHDRAW]: ''
    };

    return types.map((type) => {
      const total = transactionsData?.data?.transactions
        .filter((t) => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      return { name: type, value: total, color: colors[type] };
    });
  }, [transactionsData]);
   

        // 
      const [showTour, setShowTour] = useState(false);
      // const { mode } = useAppSelector((state) => state.theme);
     useEffect(() => {
       // Check if tour has been shown
       const tourCompleted = localStorage.getItem('user-tour-completed');
       if (!tourCompleted) {
         setTimeout(() => setShowTour(true), 1500);
       }
     }, []);
   
     const handleStartTour = () => {
       setShowTour(true);
     };


  // 
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome */}
        <div className='flex'>
            <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your wallet today.</p>
          </div>
          <Button onClick={handleStartTour} variant="outline" className="gap-2 dark:bg-white/40">
            <PlayCircle className="h-4 w-4" />
            Start Tour
          </Button>
       </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Current Balance"
              value={formatCurrency(stats?.data?.balance || 0)}
              icon={Wallet}
              description="Available funds"
              isLoading={statsLoading}
            />
            <StatsCard
              title="This Month"
              value={formatCurrency(stats?.data?.monthlyRevenue || 0)}
              icon={TrendingUp}
              description="Total transactions"
              trend={{ value: stats?.data?.monthlyTrend || 0, isPositive: true }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Money Sent"
              value={formatCurrency(stats?.data?.moneySent || 0)}
              icon={ArrowUpRight}
              description="Outgoing payments"
              isLoading={statsLoading}
            />
            <StatsCard
              title="Money Received"
              value={formatCurrency(stats?.data?.moneyReceived || 0)}
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
                <Link to="/dashboard/user/send"><Button variant="outline" className="w-full h-24 flex flex-col gap-2 dark:!text-white/40"><Send className="h-6 w-6" /> Send Money</Button></Link>
                <Link to="/dashboard/user/deposit"><Button variant="outline" className="w-full h-24 flex flex-col gap-2 dark:!text-white/40"><Plus className="h-6 w-6" /> Deposit</Button></Link>
                <Link to="/dashboard/user/withdraw"><Button variant="outline" className="w-full h-24 flex flex-col gap-2 dark:!text-white/40"><Minus className="h-6 w-6" /> Withdraw</Button></Link>
                <Link to="/dashboard/user/transactions"><Button variant="outline" className="w-full h-24 flex flex-col gap-2 dark:!text-white/40"><ArrowUpRight className="h-6 w-6" /> View All</Button></Link>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
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
                    <Bar dataKey="SEND" fill="#ef4444" name="Sent" />
                    <Bar dataKey="CASH_OUT" fill="#22c55e" name="Cash Out" />
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
                      label={({ name, percent }:PieLabelRenderProps) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
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
              <Link to="/dashboard/user/transactions"><Button variant="outline" size="sm" className='dark:!border-white/50 dark:!text-white/80'>View All</Button></Link>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                      <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-muted" /><div className="space-y-2"><div className="h-4 w-32 bg-muted rounded" /><div className="h-3 w-24 bg-muted rounded" /></div></div><div className="h-5 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {transactionsData?.data?.transactions.map((t) => (
                    <div key={t._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${getTransactionColor(t.type)}`}>
                          {getTransactionIcon(t.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{t.type}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(t.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionColor(t.type)}`}>
                            {([IType.SEND, IType.WITHDRAW, IType.CASH_OUT] as IType[]).includes(t.type) ? '-' : '+'}
                            {formatCurrency(t.amount / 100)}
                          </p>
                        <Badge variant={t.tranStatus === IStatus.COMPLETED ? 'default' : 'secondary'} className="text-xs">
                          {t.tranStatus}
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
      {showTour && <UserTour onComplete={() => setShowTour(false)} />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
