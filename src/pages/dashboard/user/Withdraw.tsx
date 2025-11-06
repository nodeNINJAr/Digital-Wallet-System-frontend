import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/redux/hook';
import { useWithdrawMoneyMutation } from '@/redux/services/api';


export default function WithdrawMoneyPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [withdrawMoney, { isLoading }] = useWithdrawMoneyMutation();
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentBalance = user?.balance || 5000;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(amount) + calculateFee() > currentBalance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await withdrawMoney({
        amount: parseFloat(amount),
      }).unwrap();

      toast.success('Withdrawal successful!');
      setAmount('');
      
      setTimeout(() => {
       navigate('/dashboard/user');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.data || 'Failed to withdraw money. Please try again.');
    }
  };

  const calculateFee = () => {
    const amt = parseFloat(amount) || 0;
    return Math.round(amt * 0.01 * 100) / 100;
  };

  const calculateTotal = () => {
    const amt = parseFloat(amount) || 0;
    return amt + calculateFee();
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Withdraw Money</h1>
            <p className="text-muted-foreground">Cash out from your wallet</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Balance</CardTitle>
                  <CardDescription>Current wallet balance</CardDescription>
                </div>
                <div className="text-3xl font-bold">${currentBalance.toFixed(2)}</div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>Enter the amount you want to withdraw</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={errors.amount ? 'border-destructive' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2 block">Quick Select</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        type="button"
                        variant="outline"
                        onClick={() => setAmount(quickAmount.toString())}
                      >
                        ${quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Withdrawal Amount:</span>
                          <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fee (1%):</span>
                          <span className="font-medium">${calculateFee().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Deducted:</span>
                          <span className="text-lg">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Remaining Balance:</span>
                          <span>${(currentBalance - calculateTotal()).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Minus className="mr-2 h-4 w-4" />
                        Withdraw Money
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>navigate("/dashboard/user")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Important Information</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Visit any agent location to collect your cash</li>
                    <li>• Bring a valid ID for verification</li>
                    <li>• Withdrawals are processed instantly</li>
                    <li>• A 1% transaction fee applies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
