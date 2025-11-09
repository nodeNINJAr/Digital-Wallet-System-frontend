import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, CheckCircle, Eye, Ban } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';
import {
  useActiveAgentwalletMutation,
  useBlockAgentwalletMutation,
  useGetAllAgentsQuery,
} from '@/redux/services/api';

export default function ManageAgentsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
    sortOrder: 'desc',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'blocked' | 'active' | null>(null);

  const { data, isLoading, isError } = useGetAllAgentsQuery({
    page,
    limit: 10,
    searchTerm: appliedFilters.searchTerm,
    status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
    sortOrder: appliedFilters.sortOrder as 'asc' | 'desc',
  });
  // 
  const agentsData = data?.data;
  const [blockAgentWallet] = useBlockAgentwalletMutation();
  const [activeAgentWallet] = useActiveAgentwalletMutation();
  console.log(data);
  const agents = agentsData?.enrichedAgents || [];
  const totalPages = data?.data?.meta?.totalPages;

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-600">ACTIVE</Badge>;
      case 'BLOCKED':
        return <Badge variant="destructive">BLOCKED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSuspendAgent = async () => {
    if (!selectedAgent) return;
    try {
    const {message} = await blockAgentWallet({ agentId: selectedAgent.agentId }).unwrap();
      toast.success(`${message}`);
      setActionDialog(null);
      setSelectedAgent(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to block agent');
    }
  };

  const handleActivateAgent = async () => {
    if (!selectedAgent) return;
    try {
      const {message} = await activeAgentWallet({ agentId: selectedAgent.agentId }).unwrap();
      toast.success(`${message}`);
      setActionDialog(null);
      setSelectedAgent(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to activate agent');
    }
  };

  if (isLoading) return <p>Loading agents...</p>;
  if (isError) return <p>Error fetching agents</p>;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Agents</h1>
            <p className="text-muted-foreground mt-1">
              Review, approve, and manage all agent accounts
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  />
                </div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={"outline"} className='!text-white/70 !border-white/30' onClick={handleApplyFilters}>Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Agents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agents ({agentsData?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-center">Transactions</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Joined</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{agent.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{agent.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{agent.phone || 'N/A'}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${agent.commission?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="text-center">{agent.transactions || 0}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(agent.status)}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {agent.joinedDate ? new Date(agent.joinedDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAgent(agent);
                                setActionDialog('view');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {agent.status === 'ACTIVE' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent);
                                  setActionDialog('blocked');
                                }}
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                            {agent.status === 'BLOCKED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent);
                                  setActionDialog('active');
                                }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages >= 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
        <Dialog open={actionDialog === 'view'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Agent Details</DialogTitle></DialogHeader>
            {selectedAgent && (
              <div className="space-y-4 grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{selectedAgent.name || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p>{getStatusBadge(selectedAgent.status)}</div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{selectedAgent.email || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selectedAgent.phone || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Commission</p><p className="font-medium">${selectedAgent.commission?.toFixed(2) || '0.00'}</p></div>
                <div><p className="text-sm text-muted-foreground">Transactions</p><p className="font-medium">{selectedAgent.transactions || 0}</p></div>
                <div><p className="text-sm text-muted-foreground">Joined Date</p><p className="font-medium">{selectedAgent.joinedDate ? new Date(selectedAgent.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p></div>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setActionDialog(null)}>Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={actionDialog === 'blocked'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Agent</DialogTitle>
              <DialogDescription>Are you sure you want to block this agent? They will no longer be able to access the platform.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='!text-white/60' variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleSuspendAgent}>Block Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={actionDialog === 'active'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Agent</DialogTitle>
              <DialogDescription>Are you sure you want to activate this agent? They will regain access to the platform.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className='!text-white/80 !border-2 !bg-red-500' onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button className='!text-white/80 !border-2' onClick={handleActivateAgent}>Activate Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}