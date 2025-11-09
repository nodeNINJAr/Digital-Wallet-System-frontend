import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useGetAllTransactionsQuery } from '@/redux/services/api';

export default function AgentTransactionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // 🔹 Pass filters + pagination to query
  const { data, isLoading } = useGetAllTransactionsQuery({
    page,
    limit: 10,
    search: appliedFilters.search,
    type: appliedFilters.type,
    status: appliedFilters.status,
    dateFrom: appliedFilters.dateFrom,
    dateTo: appliedFilters.dateTo,
  });

  const transactions = data?.data?.transactions || [];
  const meta = data?.data?.meta || { totalPages: 1, total: 0 };
  const totalPages = meta.totalPages || 1;
  const totalTransactions = meta.total || transactions.length;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'cashin':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'cashout':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'withdraw':
        return <Minus className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'cashin':
      case 'withdraw':
        return 'text-red-600';
      case 'cashout':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Transactions</CardTitle>
              <CardDescription>Search and filter your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search transactions..."
                      className="pl-9"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters({ ...filters, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="cashin">Cash In</SelectItem>
                      <SelectItem value="cashout">Cash Out</SelectItem>
                      <SelectItem value="withdraw">Withdraw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  className='!text-white/70 !border-white/30'
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAppliedFilters(filters);
                    setPage(1);
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button
                  className='!text-white/70 !border-white/30'
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const reset = {
                      type: 'all',
                      status: 'all',
                      search: '',
                      dateFrom: '',
                      dateTo: '',
                    };
                    setFilters(reset);
                    setAppliedFilters(reset);
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
                <Button className='!text-white/70 !border-white/30 ml-auto' variant="outline" size="sm" >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7} className="h-16 text-center">
                          <div className="animate-pulse h-4 bg-muted rounded"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-full bg-muted ${getTransactionColor(
                                transaction.type
                              )}`}
                            >
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <span className="capitalize font-medium">
                              {transaction.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.notes || '—'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell
                          className={`font-medium ${getTransactionColor(
                            transaction.type
                          )}`}
                        >
                          {transaction.type === 'send' ||
                          transaction.type === 'withdraw'
                            ? '-'
                            : '+'}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatCurrency(transaction.fee || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.tranStatus === 'completed'
                                ? 'default'
                                : transaction.tranStatus === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {transaction.tranStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(
                            (transaction.amount || 0) +
                              (transaction.fee || 0)
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, totalTransactions)} of{' '}
              {totalTransactions} transactions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    className="w-10"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
