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
import { Search, Filter, Ban, CheckCircle, Eye } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';
import {
  useApproveWalletTypeMutation,
  useGetAllUsersQuery,
  useSuspendWalletTypeMutation,
} from '@/redux/services/api';

export default function ManageUsersPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'view' | 'approved' | 'suspended' | null>(null);

  const { data, isLoading, isError } = useGetAllUsersQuery({
    page,
    limit: 10,
    searchTerm: appliedFilters.searchTerm,
    agentStatus: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
  });

  const [suspendAgent] = useSuspendWalletTypeMutation();
  const [approveAgent] = useApproveWalletTypeMutation();

  const usersData = data?.data;
  const users = usersData || [];
  const totalPages = data?.meta?.totalPages;
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'APPROVED':
        return <Badge className="bg-green-600">APPROVED</Badge>;
      case 'pending':
      case 'PENDING':
        return <Badge className="bg-yellow-600">PENDING</Badge>;
      case 'suspended':
      case 'SUSPENDED':
        return <Badge variant="destructive">SUSPENDED</Badge>;
      case '':
        return <Badge variant="outline">INITIAL</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSuspendAgent = async () => {

    if (!selectedUser) return;
    try {
      const { message } = await suspendAgent({ userId: selectedUser.userId }).unwrap();
      toast.success(message || 'User has been Suspended');
      setActionDialog(null);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to block user');
    }
  };

  const handleApproveAgent = async () => {
    if (!selectedUser) return;
    try {
      const { message } = await approveAgent({ userId: selectedUser.userId }).unwrap();
      toast.success(message || 'User has been promototed to Agent ');
      setActionDialog(null);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to activate user');
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error fetching users</p>;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground mt-1">
              View, search, and manage all registered users
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
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="initial">Initial</SelectItem> {/* ✅ Fixed */}
                    </SelectContent>
                  </Select>
                <Button variant={"outline"} className='!text-white/80 !border-white/40' onClick={handleApplyFilters}>Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({data?.meta?.total || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-center">Transactions</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Agent Status</TableHead>
                      <TableHead className="text-center">Joined</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{user.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${user.balance?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="text-center">{user.transactions || 0}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(user.agentStatus)}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', {
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
                                setSelectedUser(user);
                                setActionDialog('view');
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(user.agentStatus === 'pending' || user.agentStatus  === "APPROVED" ||user.agentStatus  === "suspended" || user.agentStatus  === "approved" || user.agentStatus === 'PENDING') ? (
                                 <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog("approved");
                                }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionDialog("suspended");
                                }}
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                                 </> 
                             ) : <></>
                          
                          } 
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages >=1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className='!text-white/40'
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      className='!text-white/40'
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

        {/* View User Dialog */}
        <Dialog open={actionDialog === 'view'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{selectedUser.name || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p>{getStatusBadge(selectedUser.status)}</div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{selectedUser.email || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selectedUser.phone || 'N/A'}</p></div>
                <div><p className="text-sm text-muted-foreground">Balance</p><p className="font-medium">${selectedUser.balance?.toFixed(2) || '0.00'}</p></div>
                <div><p className="text-sm text-muted-foreground">Transactions</p><p className="font-medium">{selectedUser.transactions || 0}</p></div>
                <div><p className="text-sm text-muted-foreground">Joined Date</p><p className="font-medium">{selectedUser.joinedDate ? new Date(selectedUser.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block User Dialog */}
        <Dialog open={actionDialog === 'suspended'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend {selectedUser?.name}? They will not be able to perform any transactions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='!text-red-500 !border-white/30' variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button  variant="destructive" onClick={handleSuspendAgent}>
                Suspend User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unblock User Dialog */}
        <Dialog open={actionDialog === 'approved'} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve User</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve {selectedUser?.name}? They will be able to perform transactions again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='!text-red-500 !border-white/30' variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button variant={"outline"} className='!text-white/40 !border-white/30' onClick={handleApproveAgent}>
                Approve User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}