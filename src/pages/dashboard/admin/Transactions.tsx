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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, Eye, Download } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toast } from 'sonner';

// Mock transactions data
const mockTransactions = [
  { id: 'TXN001', from: 'John Smith', to: 'Sarah Johnson', type: 'send', amount: 250.00, fee: 2.50, status: 'completed', date: '2024-03-28 14:32', method: 'wallet' },
  { id: 'TXN002', from: 'Agent Tom Wilson', to: 'Michael Brown', type: 'deposit', amount: 500.00, fee: 5.00, status: 'completed', date: '2024-03-28 13:15', method: 'agent' },
  { id: 'TXN003', from: 'Emma Davis', to: 'Bank Account', type: 'withdraw', amount: 150.00, fee: 3.00, status: 'completed', date: '2024-03-28 12:48', method: 'bank' },
  { id: 'TXN004', from: 'James Wilson', to: 'Olivia Martinez', type: 'send', amount: 75.00, fee: 1.50, status: 'completed', date: '2024-03-28 11:22', method: 'wallet' },
  { id: 'TXN005', from: 'Agent Sarah Lee', to: 'William Taylor', type: 'deposit', amount: 300.00, fee: 3.00, status: 'completed', date: '2024-03-28 10:55', method: 'agent' },
  { id: 'TXN006', from: 'Sophia Anderson', to: 'Benjamin Thomas', type: 'send', amount: 125.00, fee: 2.00, status: 'pending', date: '2024-03-28 10:30', method: 'wallet' },
  { id: 'TXN007', from: 'Isabella Garcia', to: 'Bank Account', type: 'withdraw', amount: 200.00, fee: 4.00, status: 'completed', date: '2024-03-28 09:45', method: 'bank' },
  { id: 'TXN008', from: 'Agent David Park', to: 'John Smith', type: 'deposit', amount: 450.00, fee: 4.50, status: 'completed', date: '2024-03-28 09:12', method: 'agent' },
  { id: 'TXN009', from: 'Sarah Johnson', to: 'Emma Davis', type: 'send', amount: 80.00, fee: 1.50, status: 'completed', date: '2024-03-27 18:40', method: 'wallet' },
  { id: 'TXN010', from: 'Michael Brown', to: 'Bank Account', type: 'withdraw', amount: 350.00, fee: 7.00, status: 'failed', date: '2024-03-27 17:25', method: 'bank' },
  { id: 'TXN011', from: 'Agent Lisa Chen', to: 'James Wilson', type: 'deposit', amount: 600.00, fee: 6.00, status: 'completed', date: '2024-03-27 16:50', method: 'agent' },
  { id: 'TXN012', from: 'Olivia Martinez', to: 'William Taylor', type: 'send', amount: 95.00, fee: 1.50, status: 'completed', date: '2024-03-27 15:33', method: 'wallet' },
];

export default function AdminTransactionsPage() {
  const [transactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.to.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || txn.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || txn.method === methodFilter;

      return matchesSearch && matchesType && matchesStatus && matchesMethod;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter, methodFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'send':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Send</Badge>;
      case 'deposit':
        return <Badge variant="outline" className="border-green-500 text-green-600">Deposit</Badge>;
      case 'withdraw':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Withdraw</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleExport = () => {
    toast.success('Transactions exported successfully');
  };

  return (
    // <ProtectedRoute allowedRoles={['admin']}>
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
            <Button onClick={handleExport} className="gap-2">
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
                    placeholder="Search by transaction ID, sender, or recipient..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select value={typeFilter} onValueChange={(value) => {
                    setTypeFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="send">Send Money</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdraw">Withdraw</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={methodFilter} onValueChange={(value) => {
                    setMethodFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell>{txn.from}</TableCell>
                        <TableCell>{txn.to}</TableCell>
                        <TableCell className="text-center">
                          {getTypeBadge(txn.type)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${txn.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${txn.fee.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(txn.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {txn.date}
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                    {filteredTransactions.length} transactions
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
                    <p className="font-mono font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{selectedTransaction.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{selectedTransaction.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    {getTypeBadge(selectedTransaction.type)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p className="font-medium capitalize">{selectedTransaction.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-lg">${selectedTransaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fee</p>
                    <p className="font-medium">${selectedTransaction.fee.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">{selectedTransaction.date}</p>
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
    /* </ProtectedRoute> */
  );
}