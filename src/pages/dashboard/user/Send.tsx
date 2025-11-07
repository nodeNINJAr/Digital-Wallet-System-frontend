import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useSendMoneyMutation } from '@/redux/services/api';


// -------------------- Constants --------------------
const TRANSACTION_FEE_RATE = 0.01; // 1%
const MIN_AMOUNT = 5;

// -------------------- Validation Schema --------------------
const sendMoneySchema = z.object({
  to: z.string().min(1, 'Recipient email or phone is required'),
  amount: z.number().min(MIN_AMOUNT, `Amount must be at least $${MIN_AMOUNT}`),
  notes: z.string().optional(),
});

type SendMoneyForm = z.infer<typeof sendMoneySchema>;

// -------------------- Component --------------------
export default function SendMoneyPage() {
  const navigate = useNavigate();
  const [sendMoney, { isLoading }] = useSendMoneyMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendMoneyForm>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      to: '',
      amount: 0,
      notes: '',
    },
  });

  const amount = watch('amount') || 0;

  // -------------------- Calculations --------------------
  const calculateFee = (amt: number) => Math.round(amt * TRANSACTION_FEE_RATE * 100) / 100;
  const calculateTotal = (amt: number) => amt + calculateFee(amt);

  // -------------------- Handlers --------------------
  const onSubmit = async (data: SendMoneyForm) => {
    try {
      await sendMoney(data).unwrap();
      toast.success('Money sent successfully!');
      setTimeout(() => navigate('/dashboard/user'), 1500);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send money. Please try again.');
    }
  };

  const handleCancel = () => navigate('/dashboard/user');

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold">Send Money</h1>
            <p className="text-muted-foreground">Transfer money to another user instantly</p>
          </header>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient's information and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Recipient Field */}
                <div className="space-y-2">
                  <Label htmlFor="to">Recipient Email or Phone</Label>
                  <Input
                    id="to"
                    placeholder="email@example.com or +1234567890"
                    {...register('to')}
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
                    {...register('amount', { valueAsNumber: true })}
                    className={errors.amount ? 'border-destructive' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount.message}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="What's this payment for?"
                    {...register('notes')}
                    rows={3}
                  />
                </div>

                {/* Fee Summary */}
                {amount > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Amount:</span>
                          <span className="font-medium">${amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fee ({TRANSACTION_FEE_RATE * 100}%):</span>
                          <span className="font-medium">${calculateFee(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total:</span>
                          <span className="text-lg">${calculateTotal(amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Money
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Instant Transfer</p>
                <p className="text-sm text-muted-foreground">
                  Your money will be transferred instantly to the recipient's wallet
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}