import { useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Loader2, Search, User } from 'lucide-react';
import { toast } from 'sonner';



const MOCK_USERS = [
  { id: '1', name: 'John Doe', phone: '+1234567890', email: 'user@test.com' },
  { id: '4', name: 'Alice Johnson', phone: '+1234567893', email: 'alice@test.com' },
  { id: 'user3', name: 'Robert Brown', phone: '+1234567897', email: 'robert@test.com' },
  { id: 'user4', name: 'Emily White', phone: '+1234567898', email: 'emily@test.com' },
];

export default function CashServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'cash-out' ? 'cash-out' : 'cash-in';
  
  //TODO: Replace RTK Query hooks with your API implementation
  // For example, using fetch, axios, or React Query
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [isWithdrawingMoney, setIsWithdrawingMoney] = useState(false);
  
  const [activeTab, setActiveTab] = useState(initialType);
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    description: '',
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) {
      newErrors.userId = 'Please select a customer';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setFormData({ ...formData, userId: user.id });
    setErrors({ ...errors, userId: '' });
  };

  // API functions - replace with your actual API calls
  const addMoney = async (data: any) => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/agent/add-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add money');
    return response.json();
  };

  const withdrawMoney = async (data: any) => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/agent/withdraw-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to withdraw money');
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent, type: 'add' | 'withdraw') => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const setLoading = type === 'add' ? setIsAddingMoney : setIsWithdrawingMoney;
      setLoading(true);

      const apiCall = type === 'add' ? addMoney : withdrawMoney;
      await apiCall({
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        type: type === 'add' ? 'add' : 'withdraw',
        description: formData.description,
      });

      toast.success(`Cash ${type === 'add' ? 'in' : 'out'} successful!`);
      setFormData({ userId: '', amount: '', description: '' });
      setSelectedUser(null);
      setSearchQuery('');
      
      setTimeout(() => {
        navigate('/dashboard/agent');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.message || `Failed to process cash ${type === 'add' ? 'in' : 'out'}. Please try again.`);
    } finally {
      const setLoading = type === 'add' ? setIsAddingMoney : setIsWithdrawingMoney;
      setLoading(false);
    }
  };

  const calculateCommission = () => {
    const amount = parseFloat(formData.amount) || 0;
    return Math.round(amount * 0.005 * 100) / 100; // 0.5% commission
  };

  const isLoading = isAddingMoney || isWithdrawingMoney;

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Cash Service</h1>
            <p className="text-muted-foreground">Provide cash in/out services to customers</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="cash-in">
                <Plus className="h-4 w-4 mr-2" />
                Cash In
              </TabsTrigger>
              <TabsTrigger value="cash-out">
                <Minus className="h-4 w-4 mr-2" />
                Cash Out
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cash-in" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Customer</CardTitle>
                    <CardDescription>Search and select the customer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone or email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                            selectedUser?.id === user.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {errors.userId && (
                      <p className="text-sm text-destructive">{errors.userId}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Cash In Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cash In Details</CardTitle>
                    <CardDescription>
                      {selectedUser
                        ? `Adding money to ${selectedUser.name}'s wallet`
                        : 'Select a customer first'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, 'add')} className="space-y-6">
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
                          disabled={!selectedUser}
                        />
                        {errors.amount && (
                          <p className="text-sm text-destructive">{errors.amount}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Note (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Add a note..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          disabled={!selectedUser}
                        />
                      </div>

                      {formData.amount && parseFloat(formData.amount) > 0 && (
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Amount to Add:</span>
                                <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Your Commission (0.5%):</span>
                                <span className="font-medium">${calculateCommission().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t font-semibold">
                                <span>Customer Receives:</span>
                                <span className="text-lg">${parseFloat(formData.amount).toFixed(2)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading || !selectedUser}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Complete Cash In
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(-1)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cash-out" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Customer</CardTitle>
                    <CardDescription>Search and select the customer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone or email..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                            selectedUser?.id === user.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {errors.userId && (
                      <p className="text-sm text-destructive">{errors.userId}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Cash Out Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cash Out Details</CardTitle>
                    <CardDescription>
                      {selectedUser
                        ? `Withdrawing from ${selectedUser.name}'s wallet`
                        : 'Select a customer first'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, 'withdraw')} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount-out">Amount (USD)</Label>
                        <Input
                          id="amount-out"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className={errors.amount ? 'border-destructive' : ''}
                          disabled={!selectedUser}
                        />
                        {errors.amount && (
                          <p className="text-sm text-destructive">{errors.amount}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description-out">Note (Optional)</Label>
                        <Textarea
                          id="description-out"
                          placeholder="Add a note..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          disabled={!selectedUser}
                        />
                      </div>

                      {formData.amount && parseFloat(formData.amount) > 0 && (
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Withdrawal Amount:</span>
                                <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Transaction Fee (0.5%):</span>
                                <span className="font-medium">${calculateCommission().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Your Commission:</span>
                                <span className="font-medium">${calculateCommission().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t font-semibold">
                                <span>Cash to Dispense:</span>
                                <span className="text-lg">${parseFloat(formData.amount).toFixed(2)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading || !selectedUser}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Minus className="mr-2 h-4 w-4" />
                              Complete Cash Out
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(-1)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
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