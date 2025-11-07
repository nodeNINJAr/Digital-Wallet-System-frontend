import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const commissionData = [
  { date: '2024-03-01', amount: 125, transactions: 45 },
  { date: '2024-03-02', amount: 180, transactions: 62 },
  { date: '2024-03-03', amount: 145, transactions: 51 },
  { date: '2024-03-04', amount: 220, transactions: 78 },
  { date: '2024-03-05', amount: 195, transactions: 67 },
  { date: '2024-03-06', amount: 240, transactions: 85 },
  { date: '2024-03-07', amount: 210, transactions: 73 },
];

const monthlyData = [
  { month: 'Jan', commission: 3200 },
  { month: 'Feb', commission: 3800 },
  { month: 'Mar', commission: 4500 },
  { month: 'Apr', commission: 3900 },
  { month: 'May', commission: 4200 },
  { month: 'Jun', commission: 5100 },
];

const recentCommissions = [
  { id: '1', date: '2024-03-07 14:30', type: 'Cash In', amount: 15.50, customer: 'John Doe' },
  { id: '2', date: '2024-03-07 13:15', type: 'Cash Out', amount: 22.30, customer: 'Alice Johnson' },
  { id: '3', date: '2024-03-07 11:45', type: 'Cash In', amount: 8.75, customer: 'Robert Brown' },
  { id: '4', date: '2024-03-07 10:20', type: 'Cash Out', amount: 18.90, customer: 'Emily White' },
  { id: '5', date: '2024-03-07 09:00', type: 'Cash In', amount: 12.40, customer: 'Michael Green' },
];

export default function CommissionPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalCommission = commissionData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = commissionData.reduce((sum, item) => sum + item.transactions, 0);

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Commission Tracking</h1>
              <p className="text-muted-foreground">Monitor your earnings and performance</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {totalTransactions} transactions
                </p>
                <p className="text-xs text-green-600 mt-1">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(5100)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Best month this year
                </p>
                <p className="text-xs text-green-600 mt-1">+21% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average/Day</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCommission / 7)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(22700)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Commission</CardTitle>
                <CardDescription>Your commission earnings this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={commissionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`$${value}`, 'Commission']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Commission trends over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value}`, 'Commission']} />
                    <Bar dataKey="commission" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Commission Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Commission Transactions</CardTitle>
              <CardDescription>Your latest commission earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCommissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{commission.customer}</p>
                          <p className="text-sm text-muted-foreground">{commission.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {commission.type}
                      </Badge>
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(commission.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Breakdown</CardTitle>
              <CardDescription>Understanding your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Cash In Transactions</span>
                    <span className="text-sm">0.5% commission</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Cash Out Transactions</span>
                    <span className="text-sm">0.5% commission</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Bonus Incentives</span>
                    <span className="text-sm">Variable</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium mb-2">Performance Tier</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">Gold</span>
                      <Badge>Top 10%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Maintain this tier for bonus rewards
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute> 
  );
}