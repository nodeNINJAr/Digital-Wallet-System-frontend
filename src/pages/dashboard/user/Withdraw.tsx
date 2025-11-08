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
import { useForm } from 'react-hook-form';

interface WithdrawFormType {
  to: string;
  amount: number;
}

export default function WithdrawMoneyPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [withdrawMoney, { isLoading }] = useWithdrawMoneyMutation();
  const currentBalance = user?.walletBalance || 5000;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WithdrawFormType>({
    defaultValues: {
      to: '',
      amount: 0,
    },
  });

  const amount = watch('amount');
  const calculateFee = () => Math.round((Number(amount) || 0) * 0.01 * 100) / 100;
  const calculateTotal = () => (Number(amount) || 0) + calculateFee();

  const onSubmit = async (data: WithdrawFormType) => {
    if (data.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (data.amount + calculateFee() > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await withdrawMoney({
        amount: data.amount,
        to: data.to,
      }).unwrap();

      toast.success('Withdrawal successful!');
      reset();
      setTimeout(() => navigate('/dashboard/user'), 1500);
    } catch (error: any) {
      toast.error(error?.data.message || 'Failed to withdraw money. Please try again.');
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Withdraw Money</h1>
            <p className="text-muted-foreground">Cash out from your wallet through an agent</p>
          </div>

          {/* Wallet Balance */}
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

          {/* Withdraw Form */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>Enter agent info and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Agent Identifier */}
                <div className="space-y-2">
                  <Label htmlFor="to">Agent Email or Phone</Label>
                  <Input
                    id="to"
                    placeholder="agent@example.com or +1234567890"
                    {...register('to', { required: 'Agent email or phone is required' })}
                    className={errors.to ? 'border-destructive' : ''}
                  />
                  {errors.to && (
                    <p className="text-sm text-destructive">{errors.to.message}</p>
                  )}
                </div>

                {/* Amount Field */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('amount', {
                      required: 'Amount is required',
                      valueAsNumber: true,
                      validate: (value) => value > 0 || 'Amount must be greater than 0',
                    })}
                    className={errors.amount ? 'border-destructive' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount.message}</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <Label className="mb-2 block">Quick Select</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        type="button"
                        variant="outline"
                        className="!text-amber-500 !border-amber-800"
                        onClick={() => setValue('amount', amt)}
                      >
                        ${amt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Calculation Card */}
                {amount && amount > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Withdrawal Amount:</span>
                          <span className="font-medium">${amount.toFixed(2)}</span>
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

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button  variant={"outline"} type="submit" className="flex-1 !border-gray-500 !text-white" disabled={isLoading}>
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
                    className="!text-white !border-amber-900"
                    onClick={() => navigate('/dashboard/user')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Important Information</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Visit your assigned agent to collect cash</li>
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
