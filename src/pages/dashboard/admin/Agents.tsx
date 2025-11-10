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
import { Search, Filter, CheckCircle, Eye, Ban, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  useActiveAgentwalletMutation,
  useBlockAgentwalletMutation,
  useGetAllAgentsQuery,
} from '@/redux/services/api';
import axios from 'axios';

type Agent = {
  _id?: string;
  agentId?: string;
  name?: string;
  email?: string;
  phone?: string;
  commission?: number;
  transactions?: number;
  status?: 'ACTIVE' | 'BLOCKED' | string;
  joinedDate?: string | null;
};

export default function ManageAgentsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
    sortOrder: 'desc',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'blocked' | 'active' | null>(null);

  const { data, isLoading, isError } = useGetAllAgentsQuery({
    page,
    limit: 10,
    searchTerm: appliedFilters.searchTerm,
    status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
    sortOrder: appliedFilters.sortOrder as 'asc' | 'desc',
  });
  //  
  const [blockAgentWallet, { isLoading: isBlocking }] = useBlockAgentwalletMutation();
  const [activeAgentWallet, { isLoading: isActivating }] = useActiveAgentwalletMutation();

  // const agentsData = data?.data;
  const agents = data?.data?.enrichedAgents || [];
  const totalPages = data?.data?.meta?.totalPages || 1;
  const total = data?.data?.meta?.total || 0;

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: 'all',
      searchTerm: '',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'BLOCKED':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  const handleBlockAgent = async () => {
    if (!selectedAgent?.agentId) return;
    try {
      const response = await blockAgentWallet({ agentId: selectedAgent.agentId }).unwrap();
      toast.success(response?.message || 'Agent blocked successfully');
      setActionDialog(null);
      setSelectedAgent(null);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || 'Failed to block agent');
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Failed to block agent');
        }
      }
  };

  const handleActivateAgent = async () => {
    if (!selectedAgent?.agentId) return;
    try {
      const response = await activeAgentWallet({ agentId: selectedAgent.agentId }).unwrap();
      toast.success(response?.message || 'Agent activated successfully');
      setActionDialog(null);
      setSelectedAgent(null);
    } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            toast.error(err.response?.data?.message || 'Failed to activate agent');
          } else if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error('Failed to activate agent');
          }
        }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading && page === 1) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-destructive font-medium">Error fetching agents</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button onClick={handleApplyFilters} className="flex-1 !bg-black dark:!bg-white">
                      Apply
                    </Button>
                    <Button onClick={handleResetFilters} variant="outline" className="flex-1 dark:!text-white/40 dark:!border-white/40">
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agents ({total})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
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
                        {agents.length > 0 ? (
                          agents.map((agent: Agent) => (
                            <TableRow key={agent.agentId || agent._id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{agent.name || 'N/A'}</p>
                                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {agent.email || 'N/A'}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{agent.phone || 'N/A'}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">
                                ${((agent.commission || 0) / 100).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">{agent.transactions || 0}</TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(agent.status)}
                              </TableCell>
                              <TableCell className="text-center text-sm text-muted-foreground">
                                {formatDate(agent.joinedDate)}
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
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              No agents found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages >= 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages} ({total} total agents)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                          disabled={page === 1 || isLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={page === totalPages || isLoading}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Agent Dialog */}
        <Dialog open={actionDialog === 'view'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agent Details</DialogTitle>
            </DialogHeader>
            {selectedAgent && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedAgent.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedAgent.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedAgent.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedAgent.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="font-medium text-green-600">
                    ${((selectedAgent.commission || 0) / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="font-medium">{selectedAgent.transactions || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Joined Date</p>
                  <p className="font-medium">{formatDate(selectedAgent.joinedDate)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Agent ID</p>
                  <p className="font-mono text-xs">{selectedAgent.agentId || 'N/A'}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block Agent Dialog */}
        <Dialog open={actionDialog === 'blocked'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Agent</DialogTitle>
              <DialogDescription>
                Are you sure you want to block {selectedAgent?.name}? They will no longer be able
                to access the platform or perform any transactions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)} disabled={isBlocking}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBlockAgent} disabled={isBlocking}>
                {isBlocking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Blocking...
                  </>
                ) : (
                  'Block Agent'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activate Agent Dialog */}
        <Dialog open={actionDialog === 'active'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Agent</DialogTitle>
              <DialogDescription>
                Are you sure you want to activate {selectedAgent?.name}? They will regain full
                access to the platform and can resume performing transactions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)} disabled={isActivating}>
                Cancel
              </Button>
              <Button onClick={handleActivateAgent} disabled={isActivating} className="bg-green-600 hover:bg-green-700">
                {isActivating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  'Activate Agent'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}