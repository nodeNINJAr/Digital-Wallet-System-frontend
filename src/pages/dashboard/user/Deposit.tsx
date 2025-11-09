import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, MapPin, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCashOutMutation, useGetAgentsQuery } from '@/redux/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';

// -------------------- Constants --------------------
const MIN_DEPOSIT_AMOUNT = 1;
const DEPOSIT_FEE = 0; // Free deposits
const REDIRECT_DELAY = 1500;

// -------------------- Types --------------------
interface Agent {
  id: string;
  name: string;
  phone: string;
  location?: string;
  email?: string;
}

// -------------------- Validation Schema --------------------
const depositSchema = z.object({
  agentId: z.string().min(1, 'Please select an agent'),
  amount: z.number().min(MIN_DEPOSIT_AMOUNT, `Amount must be at least $${MIN_DEPOSIT_AMOUNT}`),
});

type DepositForm = z.infer<typeof depositSchema>;

// -------------------- Subcomponents --------------------
interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}

const AgentCard = ({ agent, isSelected, onClick }: AgentCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
      isSelected ? 'border-primary bg-primary/5' : 'border-border'
    }`}
  >
    <p className="font-semibold">{agent.name}</p>
    <p className="text-sm text-muted-foreground">{agent.phone}</p>
    {agent.location && (
      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {agent.location}
      </div>
    )}
  </button>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

const ErrorState = () => (
  <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
    <AlertCircle className="h-4 w-4" />
    <span className="text-sm">Failed to load agents. Please try again.</span>
  </div>
);

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

const EmptyState = ({ hasSearchQuery }: EmptyStateProps) => (
  <div className="text-center py-8 text-muted-foreground">
    <p className="text-sm">No agents found</p>
    {hasSearchQuery && <p className="text-xs mt-1">Try adjusting your search</p>}
  </div>
);

interface AmountSummaryProps {
  amount: number;
  fee: number;
}

const AmountSummary = ({ amount, fee }: AmountSummaryProps) => (
  <Card className="bg-muted/50">
    <CardContent className="pt-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Deposit Amount:</span>
          <span className="font-medium">${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Fee:</span>
          <span className="font-medium">${fee.toFixed(2)} (Free)</span>
        </div>
        <div className="flex justify-between pt-2 border-t font-semibold">
          <span>Total Received:</span>
          <span className="text-lg">${amount.toFixed(2)}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DepositInstructions = () => (
  <div className="text-sm text-muted-foreground space-y-1">
    <p>• Visit the selected agent with cash</p>
    <p>• Provide your phone number or email</p>
    <p>• Receive instant credit to your wallet</p>
  </div>
);

// -------------------- Main Component --------------------
export default function DepositMoneyPage() {
  const navigate = useNavigate();
  
  // API Hooks
  const { data: agentsData, isLoading: isLoadingAgents, error: agentsError } = useGetAgentsQuery();
  const [depositMoney, { isLoading: isDepositing }] = useCashOutMutation();
  
  // Local State
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      agentId: '',
      amount: 0,
    },
  });
  console.log(agentsData)
  const amount = watch('amount') || 0;

  // -------------------- Computed Values --------------------
  const agents: Agent[] = useMemo(() => 
    agentsData?.data?.agents || agentsData || [], 
    [agentsData]
  );
  
  const filteredAgents = useMemo(() => 
   agents.length > 0 && agents?.filter((agent) => {
      const query = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(query) ||
        agent.location?.toLowerCase().includes(query) ||
        agent.phone.includes(searchQuery) ||
        agent.email?.toLowerCase().includes(query)
      );
    }), 
    [agents, searchQuery]
  );

  // -------------------- Handlers --------------------
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setValue('agentId', agent.id, { shouldValidate: true });
  };

  const onSubmit = async (data: DepositForm) => {


    try {
      await depositMoney({
        agentId: data.agentId,
        amount: data.amount,
      }).unwrap();

      toast.success('Money deposited successfully!');
      setTimeout(() => navigate('/dashboard/user'), REDIRECT_DELAY);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to deposit money. Please try again.');
    }
  };

  const handleCancel = () => navigate(-1);

  // -------------------- Render Helpers --------------------
  const renderAgentsList = () => {
    if (isLoadingAgents) return <LoadingState />;
    if (agentsError) return <ErrorState />;
    if (filteredAgents && filteredAgents?.length === 0) return <EmptyState hasSearchQuery={!!searchQuery} />;

    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAgents && filteredAgents?.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent?.id === agent.id}
            onClick={() => handleAgentSelect(agent)}
          />
        ))}
      </div>
    );
  };

  // -------------------- Render --------------------
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold">Deposit Money</h1>
            <p className="text-muted-foreground">Add funds to your wallet via an agent <span className='text-red-500'>Its currently under construction</span></p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Agent Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle>Select an Agent</CardTitle>
                <CardDescription>Choose a nearby agent location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or location..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Agents List */}
                {renderAgentsList()}

                {/* Error Message */}
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Deposit Form Card */}
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Amount Input */}
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
                      disabled={!selectedAgent}
                    />
                    {errors.amount && (
                      <p className="text-sm text-destructive">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Amount Summary */}
                  {amount > 0 && <AmountSummary amount={amount} fee={DEPOSIT_FEE} />}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isDepositing || !selectedAgent}
                    >
                      {isDepositing ? (
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
                      onClick={handleCancel}
                      disabled={isDepositing}
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Instructions */}
                  <DepositInstructions />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}