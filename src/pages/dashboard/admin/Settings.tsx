import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  
  // Transaction Fees
  const [sendMoneyFee, setSendMoneyFee] = useState('1.5');
  const [withdrawFee, setWithdrawFee] = useState('2.0');
  const [agentCashInFee, setAgentCashInFee] = useState('1.0');
  const [agentCommissionRate, setAgentCommissionRate] = useState('0.5');

  // Transaction Limits
  const [minTransaction, setMinTransaction] = useState('10');
  const [maxTransaction, setMaxTransaction] = useState('10000');
  const [dailyLimit, setDailyLimit] = useState('25000');
  const [monthlyLimit, setMonthlyLimit] = useState('100000');

  // Agent Limits
  const [agentDailyLimit, setAgentDailyLimit] = useState('50000');
  const [agentMonthlyLimit, setAgentMonthlyLimit] = useState('500000');

  const handleSaveFees = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Transaction fees updated successfully');
  };

  const handleSaveLimits = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Transaction limits updated successfully');
  };

  const handleSaveAgentSettings = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Agent settings updated successfully');
  };

  const handleResetDefaults = () => {
    setSendMoneyFee('1.5');
    setWithdrawFee('2.0');
    setAgentCashInFee('1.0');
    setAgentCommissionRate('0.5');
    setMinTransaction('10');
    setMaxTransaction('10000');
    setDailyLimit('25000');
    setMonthlyLimit('100000');
    setAgentDailyLimit('50000');
    setAgentMonthlyLimit('500000');
    toast.success('Settings reset to defaults');
  };

  return (
    // <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
              <p className="text-muted-foreground mt-1">
                Configure transaction fees, limits, and system parameters
              </p>
            </div>
            <Button onClick={handleResetDefaults} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Transaction Fees */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Fees</CardTitle>
              <CardDescription>
                Set the fees charged for different types of transactions (in %)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sendMoneyFee">Send Money Fee (%)</Label>
                  <Input
                    id="sendMoneyFee"
                    type="number"
                    step="0.1"
                    value={sendMoneyFee}
                    onChange={(e) => setSendMoneyFee(e.target.value)}
                    placeholder="1.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged when users send money to others
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawFee">Withdraw Fee (%)</Label>
                  <Input
                    id="withdrawFee"
                    type="number"
                    step="0.1"
                    value={withdrawFee}
                    onChange={(e) => setWithdrawFee(e.target.value)}
                    placeholder="2.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged for withdrawing money to bank
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agentCashInFee">Agent Cash-In Fee (%)</Label>
                  <Input
                    id="agentCashInFee"
                    type="number"
                    step="0.1"
                    value={agentCashInFee}
                    onChange={(e) => setAgentCashInFee(e.target.value)}
                    placeholder="1.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee for depositing money through agents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agentCommissionRate">Agent Commission Rate (%)</Label>
                  <Input
                    id="agentCommissionRate"
                    type="number"
                    step="0.1"
                    value={agentCommissionRate}
                    onChange={(e) => setAgentCommissionRate(e.target.value)}
                    placeholder="0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Commission agents earn per transaction
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveFees} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Fee Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Limits */}
          <Card>
            <CardHeader>
              <CardTitle>User Transaction Limits</CardTitle>
              <CardDescription>
                Set minimum, maximum, and periodic limits for user transactions (in $)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minTransaction">Minimum Transaction ($)</Label>
                  <Input
                    id="minTransaction"
                    type="number"
                    value={minTransaction}
                    onChange={(e) => setMinTransaction(e.target.value)}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum amount per transaction
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTransaction">Maximum Transaction ($)</Label>
                  <Input
                    id="maxTransaction"
                    type="number"
                    value={maxTransaction}
                    onChange={(e) => setMaxTransaction(e.target.value)}
                    placeholder="10000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum amount per transaction
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Transaction Limit ($)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    placeholder="25000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Total amount a user can transact per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Transaction Limit ($)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    placeholder="100000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Total amount a user can transact per month
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveLimits} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Limit Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Transaction Limits</CardTitle>
              <CardDescription>
                Set daily and monthly transaction limits for agents (in $)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agentDailyLimit">Agent Daily Limit ($)</Label>
                  <Input
                    id="agentDailyLimit"
                    type="number"
                    value={agentDailyLimit}
                    onChange={(e) => setAgentDailyLimit(e.target.value)}
                    placeholder="50000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Total amount an agent can process per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agentMonthlyLimit">Agent Monthly Limit ($)</Label>
                  <Input
                    id="agentMonthlyLimit"
                    type="number"
                    value={agentMonthlyLimit}
                    onChange={(e) => setAgentMonthlyLimit(e.target.value)}
                    placeholder="500000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Total amount an agent can process per month
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveAgentSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Agent Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-muted-foreground">System Version</p>
                  <p className="font-medium">v2.1.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">March 28, 2024</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Users</p>
                  <p className="font-medium">8,932</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Agents</p>
                  <p className="font-medium">312</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    /* </ProtectedRoute> */
  );
}