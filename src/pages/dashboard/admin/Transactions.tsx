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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, Eye, Download, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { useGetAllTransactionsQuery } from '@/redux/services/api';
import { format } from 'date-fns';

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: '',
    sortOrder: 'desc',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { data, isLoading } = useGetAllTransactionsQuery({
    page,
    limit: 10,
    search: appliedFilters.search,
    type: appliedFilters.type !== 'all' ? appliedFilters.type : undefined,
    status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
    sortOrder: appliedFilters.sortOrder as 'asc' | 'desc',
  });
console.log(data);
  const transactions = data?.data?.transactions || [];
  const totalPages = data?.data?.meta?.totalPages || 1;
  const total = data?.data?.meta?.total || 0;

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      type: 'all',
      status: 'all',
      search: '',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeUpper = type?.toUpperCase();
    switch (typeUpper) {
      case 'SEND':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Send</Badge>;
      case 'CASH_IN':
        return <Badge variant="outline" className="border-green-500 text-green-600">Cash In</Badge>;
      case 'CASH_OUT':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Cash Out</Badge>;
      case 'BONUS':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Bonus</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    // Create CSV content
    const headers = ['Transaction ID', 'Type', 'Status', 'Amount', 'Fee', 'Commission', 'Notes', 'Date'];
    const csvContent = [
      headers.join(','),
      ...transactions.map((txn: any) => 
        [
          txn.transactionId,
          txn.type,
          txn.tranStatus,
          txn.amount / 100,
          txn.fee / 100,
          txn.commission / 100,
          `"${txn.notes || ''}"`,
          format(new Date(txn.createdAt), 'yyyy-MM-dd HH:mm:ss')
        ].join(',')
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Transactions exported successfully');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
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

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
              <p className="text-muted-foreground mt-1">
                Monitor and analyze all system transactions
              </p>
            </div>
            <Button onClick={handleExport} className="gap-2" disabled={transactions.length === 0}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Advanced Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by transaction ID, type, or notes..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="SEND">Send Money</SelectItem>
                      <SelectItem value="CASH_IN">Cash In</SelectItem>
                      <SelectItem value="CASH_OUT">Cash Out</SelectItem>
                      <SelectItem value="BONUS">Bonus</SelectItem>
                    </SelectContent>
                  </Select>

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
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
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
                    <Button variant={"outline"} onClick={handleApplyFilters} className="flex-1 !text-white/30 !border-white/20">
                      Apply
                    </Button>
                    <Button onClick={handleResetFilters} variant="outline" className="flex-1 !text-white/30 !border-white/20">
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({total})</CardTitle>
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
                          <TableHead>Transaction ID</TableHead>
                          <TableHead className="text-center">Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Fee</TableHead>
                          <TableHead className="text-right">Commission</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length > 0 ? (
                          transactions.map((txn: any) => (
                            <TableRow key={txn._id}>
                              <TableCell className="font-mono text-sm">{txn.transactionId}</TableCell>
                              <TableCell className="text-center">
                                {getTypeBadge(txn.type)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${(txn.amount / 100).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                ${(txn.fee / 100).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                ${(txn.commission / 100).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(txn.tranStatus)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(txn.createdAt)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTransaction(txn)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages} ({total} total transactions)
                      </p>
                      <div className="flex gap-2">
                        <Button
                         className='!text-white/30'
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                          disabled={page === 1 || isLoading}
                        >
                          Previous
                        </Button>
                        <Button
                          className='!text-white/30'
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

        {/* View Transaction Dialog */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-medium">{selectedTransaction.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedTransaction.tranStatus)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    {getTypeBadge(selectedTransaction.type)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">
                      ${(selectedTransaction.amount / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fee</p>
                    <p className="font-medium">
                      ${(selectedTransaction.fee / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="font-medium text-green-600">
                      ${(selectedTransaction.commission / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{selectedTransaction.notes || 'No notes'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From Wallet</p>
                    <p className="font-mono text-xs">{selectedTransaction.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To Wallet</p>
                    <p className="font-mono text-xs">{selectedTransaction.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Initiated By</p>
                    <p className="font-mono text-xs">{selectedTransaction.initiatedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">{formatDate(selectedTransaction.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}