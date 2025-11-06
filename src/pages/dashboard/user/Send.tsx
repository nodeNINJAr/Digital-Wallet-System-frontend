'use client';

import { useState } from 'react';
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
import { useNavigate } from 'react-router';

export default function SendMoneyPage() {
  const navigate = useNavigate();
  const [sendMoney, { isLoading }] = useSendMoneyMutation();
  const [formData, setFormData] = useState({
    recipientIdentifier: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientIdentifier) {
      newErrors.recipientIdentifier = 'Recipient email or phone is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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
      await sendMoney({
        recipientIdentifier: formData.recipientIdentifier,
        amount: parseFloat(formData.amount),
        description: formData.description,
      }).unwrap();

      toast.success('Money sent successfully!');
      setFormData({ recipientIdentifier: '', amount: '', description: '' });
      
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.data || 'Failed to send money. Please try again.');
    }
  };

  const calculateFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    return Math.round(amount * 0.01 * 100) / 100;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    return amount + calculateFee();
  };

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Send Money</h1>
            <p className="text-muted-foreground">Transfer money to another user instantly</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient's information and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email or Phone</Label>
                  <Input
                    id="recipient"
                    placeholder="email@example.com or +1234567890"
                    value={formData.recipientIdentifier}
                    onChange={(e) => setFormData({ ...formData, recipientIdentifier: e.target.value })}
                    className={errors.recipientIdentifier ? 'border-destructive' : ''}
                  />
                  {errors.recipientIdentifier && (
                    <p className="text-sm text-destructive">{errors.recipientIdentifier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={errors.amount ? 'border-destructive' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this payment for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Amount:</span>
                          <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fee (1%):</span>
                          <span className="font-medium">${calculateFee().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total:</span>
                          <span className="text-lg">${calculateTotal().toFixed(2)}</span>
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
                    onClick={() => navigate("/dashboard/user")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Instant Transfer</p>
                  <p className="text-sm text-muted-foreground">
                    Your money will be transferred instantly to the recipient's wallet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
