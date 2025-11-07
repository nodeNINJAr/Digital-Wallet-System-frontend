import { useState, useMemo } from 'react';
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
import { Search, Filter, CheckCircle, XCircle, Eye, Ban } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';

// Mock agents data
const mockAgents = [
  { id: 1, name: 'Agent Sarah Lee', email: 'sarah.agent@email.com', phone: '+1234567900', commission: 1450.00, status: 'approved', joinedDate: '2024-01-05', transactions: 432 },
  { id: 2, name: 'Agent Tom Wilson', email: 'tom.agent@email.com', phone: '+1234567901', commission: 2340.50, status: 'approved', joinedDate: '2023-12-15', transactions: 678 },
  { id: 3, name: 'Agent Lisa Chen', email: 'lisa.agent@email.com', phone: '+1234567902', commission: 0.00, status: 'pending', joinedDate: '2024-03-25', transactions: 0 },
  { id: 4, name: 'Agent David Park', email: 'david.agent@email.com', phone: '+1234567903', commission: 3200.75, status: 'approved', joinedDate: '2023-11-20', transactions: 892 },
  { id: 5, name: 'Agent Jennifer Lopez', email: 'jennifer.agent@email.com', phone: '+1234567904', commission: 0.00, status: 'suspended', joinedDate: '2024-02-10', transactions: 145 },
  { id: 6, name: 'Agent Michael Chang', email: 'michael.agent@email.com', phone: '+1234567905', commission: 1820.30, status: 'approved', joinedDate: '2024-01-18', transactions: 524 },
  { id: 7, name: 'Agent Emma Rodriguez', email: 'emma.agent@email.com', phone: '+1234567906', commission: 0.00, status: 'pending', joinedDate: '2024-03-28', transactions: 0 },
  { id: 8, name: 'Agent James Kim', email: 'james.agent@email.com', phone: '+1234567907', commission: 2650.80, status: 'approved', joinedDate: '2023-12-08', transactions: 745 },
];

export default function ManageAgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'suspend' | 'view' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and search agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agents, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApproveAgent = () => {
    if (!selectedAgent) return;

    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === selectedAgent.id ? { ...agent, status: 'approved' } : agent
      )
    );
    toast.success(`Agent ${selectedAgent.name} has been approved`);
    setActionDialog(null);
    setSelectedAgent(null);
  };

  const handleSuspendAgent = () => {
    if (!selectedAgent) return;

    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === selectedAgent.id ? { ...agent, status: 'suspended' } : agent
      )
    );
    toast.success(`Agent ${selectedAgent.name} has been suspended`);
    setActionDialog(null);
    setSelectedAgent(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    // <ProtectedRoute allowedRoles={['admin']}>
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
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agents ({filteredAgents.length})</CardTitle>
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
                    {paginatedAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{agent.phone}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${agent.commission.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">{agent.transactions}</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(agent.status)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {agent.joinedDate}
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
                            {agent.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent);
                                  setActionDialog('approve');
                                }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {agent.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAgent(agent);
                                  setActionDialog('suspend');
                                }}
                              >
                                <Ban className="h-4 w-4 text-destructive" />
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
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredAgents.length)} of{' '}
                    {filteredAgents.length} agents
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedAgent.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedAgent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedAgent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="font-medium">${selectedAgent.commission.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="font-medium">{selectedAgent.transactions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium">{selectedAgent.joinedDate}</p>
                  </div>
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

        {/* Approve Agent Dialog */}
        <Dialog open={actionDialog === 'approve'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Agent</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve {selectedAgent?.name}? They will be able to perform cash services.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleApproveAgent}>
                Approve Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend Agent Dialog */}
        <Dialog open={actionDialog === 'suspend'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend Agent</DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend {selectedAgent?.name}? They will not be able to perform any cash services.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSuspendAgent}>
                Suspend Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    /* </ProtectedRoute> */
  );
}