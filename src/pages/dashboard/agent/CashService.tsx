import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Minus, Loader2, Search, User } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useAgentCashInMutation,
  useAgentWithdrawMutation,
  useGetAllUsersQuery,
} from '@/redux/services/api';

const formSchema = z.object({
  email: z.string().min(1, 'Please select a user'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CashServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'withdraw' ? 'withdraw' : 'cash-in';

  const [activeTab, setActiveTab] = useState<'cash-in' | 'withdraw'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading: usersLoading } = useGetAllUsersQuery();
  const [cashIn, { isLoading: isCashingIn }] = useAgentCashInMutation();
  const [withdrawMoney, { isLoading: isWithdrawing }] = useAgentWithdrawMutation();

  const users = data?.data?.users;
  const isProcessing = isCashingIn || isWithdrawing;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', amount: '', description: '' },
  });

  const filteredUsers = useMemo(() => {
    if (!users?.length) return [];
    return users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    form.setValue('email', user.email);
    form.clearErrors('email');
  };

  const calculateCommission = (amount: string) => {
    const numAmount = parseFloat(amount || '0');
    return Math.round(numAmount * 0.005 * 100) / 100;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        to: values.email,
        amount: parseFloat(values.amount),
        description: values.description || undefined,
      };
      if (activeTab === 'cash-in') {
        await cashIn(payload).unwrap();
        toast.success('Cash In completed successfully!');
      } else {
        await withdrawMoney(payload).unwrap();
        toast.success('withdraw completed successfully!');
      }

      form.reset();
      setSelectedUser(null);
      setSearchQuery('');
      setTimeout(() => navigate('/dashboard/agent'), 1500);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Transaction failed. Please try again.');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'cash-in' | 'withdraw');
    form.reset();
    setSelectedUser(null);
    setSearchQuery('');
  };

  const currentAmount = form.watch('amount');
  const commission = calculateCommission(currentAmount);
  const showSummary = currentAmount && parseFloat(currentAmount) > 0;

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Cash Service</h1>
            <p className="text-muted-foreground">
              Perform cash in and cash out transactions for customers
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="cash-in">
                <Plus className="h-4 w-4 mr-2" /> Cash In
              </TabsTrigger>
              <TabsTrigger value="cash-out">
                <Minus className="h-4 w-4 mr-2" /> Withdraw
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Selection Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Customer</CardTitle>
                    <CardDescription>Search and select a user for the transaction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone or email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {usersLoading ? (
                        <div className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Loading users...</p>
                        </div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            disabled={isProcessing}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                              selectedUser?.id === user.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.phone}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'No users found matching your search.' : 'No users available.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Form Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeTab === 'cash-in' ? 'Cash In Details' : 'Withdraw Details'}
                    </CardTitle>
                    <CardDescription>
                      {selectedUser
                        ? `Transaction for ${selectedUser.name}`
                        : 'Select a customer to continue'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...form.register('amount')}
                          disabled={!selectedUser || isProcessing}
                        />
                        {form.formState.errors.amount && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.amount.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Note (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Add a note about this transaction..."
                          rows={3}
                          {...form.register('description')}
                          disabled={!selectedUser || isProcessing}
                        />
                      </div>

                      {showSummary && (
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-medium">
                                  ${parseFloat(currentAmount).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Your Commission (0.5%):</span>
                                <span className="font-medium">+${commission.toFixed(2)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      )}

                      <div className="space-y-3">
                        <Button
                          variant={"outline"}
                          onClick={form.handleSubmit(onSubmit)}
                          className="w-full !text-white/70 !border-white/20"
                          disabled={isProcessing || !selectedUser}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : activeTab === 'cash-in' ? (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Complete Cash In
                            </>
                          ) : (
                            <>
                              <Minus className="mr-2 h-4 w-4" />
                              Complete Cash Out
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full !text-white/70 !border-white/20"
                          onClick={() => navigate(-1)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}