import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useDepositMoneyMutation } from '@/redux/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';

const MOCK_AGENTS = [
  { id: '2', name: 'Jane Smith', phone: '+1234567891', location: 'Downtown Branch' },
  { id: '5', name: 'Bob Wilson', phone: '+1234567894', location: 'Westside Mall' },
  { id: 'agent3', name: 'Sarah Johnson', phone: '+1234567895', location: 'City Center' },
  { id: 'agent4', name: 'Mike Davis', phone: '+1234567896', location: 'Airport Terminal' },
];

export default function DepositMoneyPage() {
  const navigate = useNavigate();
  const [depositMoney, { isLoading }] = useDepositMoneyMutation();
  const [formData, setFormData] = useState({
    agentId: '',
    amount: '',
  });
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredAgents = MOCK_AGENTS.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agentId) {
      newErrors.agentId = 'Please select an agent';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setFormData({ ...formData, agentId: agent.id });
    setErrors({ ...errors, agentId: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await depositMoney({
        agentId: formData.agentId,
        amount: parseFloat(formData.amount),
      }).unwrap();

      toast.success('Money deposited successfully!');
      setFormData({ agentId: '', amount: '' });
      setSelectedAgent(null);
      
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 1500);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to deposit money. Please try again.');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Deposit Money</h1>
            <p className="text-muted-foreground">Add funds to your wallet via an agent</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Agent Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select an Agent</CardTitle>
                <CardDescription>Choose a nearby agent location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or location..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                        selectedAgent?.id === agent.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.phone}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {agent.location}
                      </div>
                    </button>
                  ))}
                </div>

                {errors.agentId && (
                  <p className="text-sm text-destructive">{errors.agentId}</p>
                )}
              </CardContent>
            </Card>

            {/* Deposit Form */}
            <Card>
              <CardHeader>
                <CardTitle>Deposit Amount</CardTitle>
                <CardDescription>
                  {selectedAgent
                    ? `Depositing via ${selectedAgent.name}`
                    : 'Select an agent first'}
                </CardDescription>
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
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className={errors.amount ? 'border-destructive' : ''}
                      disabled={!selectedAgent}
                    />
                    {errors.amount && (
                      <p className="text-sm text-destructive">{errors.amount}</p>
                    )}
                  </div>

                  {formData.amount && parseFloat(formData.amount) > 0 && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Deposit Amount:</span>
                            <span className="font-medium">${parseFloat(formData.amount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Fee:</span>
                            <span className="font-medium">$0.00 (Free)</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t font-semibold">
                            <span>Total Received:</span>
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
                      disabled={isLoading || !selectedAgent}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Confirm Deposit
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

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Visit the selected agent with cash</p>
                    <p>• Provide your phone number or email</p>
                    <p>• Receive instant credit to your wallet</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}