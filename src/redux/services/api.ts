
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  Transaction,
  SendMoneyRequest,
  DepositRequest,
  WithdrawRequest,
  AgentTransaction,
  DashboardStats
} from '@/types';
import { baseApi } from '../baseApi';

// Mock data for development
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'user@test.com', phone: '+1234567890', role: 'user', balance: 5000, status: 'active', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', name: 'Jane Smith', email: 'agent@test.com', phone: '+1234567891', role: 'agent', balance: 25000, status: 'active', createdAt: '2024-01-10T10:00:00Z' },
  { id: '3', name: 'Admin User', email: 'admin@test.com', phone: '+1234567892', role: 'admin', status: 'active', createdAt: '2024-01-01T10:00:00Z' },
  { id: '4', name: 'Alice Johnson', email: 'alice@test.com', phone: '+1234567893', role: 'user', balance: 3500, status: 'active', createdAt: '2024-02-01T10:00:00Z' },
  { id: '5', name: 'Bob Wilson', email: 'bob@test.com', phone: '+1234567894', role: 'agent', balance: 18000, status: 'pending', createdAt: '2024-02-15T10:00:00Z' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'send', amount: 500, fee: 5, status: 'completed', fromUser: '1', toUser: '4', description: 'Payment for services', createdAt: '2024-03-01T10:00:00Z' },
  { id: 't2', type: 'deposit', amount: 2000, fee: 0, status: 'completed', toUser: '1', description: 'Cash deposit via agent', createdAt: '2024-03-02T11:30:00Z' },
  { id: 't3', type: 'withdraw', amount: 1000, fee: 10, status: 'completed', fromUser: '1', description: 'ATM withdrawal', createdAt: '2024-03-03T14:20:00Z' },
  { id: 't4', type: 'receive', amount: 750, fee: 0, status: 'completed', fromUser: '4', toUser: '1', description: 'Refund', createdAt: '2024-03-04T09:15:00Z' },
  { id: 't5', type: 'send', amount: 300, fee: 3, status: 'completed', fromUser: '1', toUser: '4', description: 'Grocery payment', createdAt: '2024-03-05T16:45:00Z' },
];


interface Agent {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface GetAgentsQuery {
  search?: string;
  location?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AgentsResponse {
  agents: Agent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 
export const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
        credentials: 'include',
      }),
    }),
      // ** veryfy user 
    verifyUser: builder.query<{ data: User }, void>({
      query: () => ({
        url: '/auth/verify',
        method: 'GET',
      }),
    }),
     
    // 
    // Logout mutation
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Register
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),

    // Get User Profile (real API)
    getProfile: builder.query({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
        credentials: 'include',
      }),
    }),

    //  Update User Profile (real API)
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH", // or "PUT" based on your backend
        data,
      }),
      invalidatesTags: ["User"],
    }),
   
// Get all agents with filters
    getAgents: builder.query<AgentsResponse, GetAgentsQuery | void>({
      query: (params = {}) => ({
        url: 'user/agents',
        method: 'GET',
        params,
      }),
      providesTags: ['Agents'],
    }),

    // Get single agent by ID
    // getAgentById: builder.query<Agent, string>({
    //   query: (agentId) => `/agents/${agentId}`,
    //   providesTags: (result, error, id) => [{ type: 'Agents', id }],
    // }),



 // ** Get transactions
   getTransactions: builder.query<
      { transactions: Transaction[]; meta: { total: number; totalPages: number; page: number; limit: number } },
      { page?: number; limit?: number; type?: string; status?: string; dateFrom?: string; dateTo?: string; search?: string }
    >({
      query: ({ page = 1, limit = 10, type, status, dateFrom, dateTo, search }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (type) params.append('type', type);
        if (status) params.append('status', status);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        if (search) params.append('search', search);

        return {
          url: `/transactions/me?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'Transaction' }],
    }),

    // Send money
    sendMoney: builder.mutation<Transaction, SendMoneyRequest>({
      query: (data) => ({
        url: '/transactions/send',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Transaction', 'User', 'Stats'],
    }),

    // Deposit money
    depositMoney: builder.mutation<Transaction, DepositRequest>({
      query: (data) => ({
        url: '/transactions/deposit',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Transaction', 'User', 'Stats'],
    }),

    // Withdraw money
    withdrawMoney: builder.mutation<Transaction, WithdrawRequest>({
      query: (data) => ({
        url: '/transactions/withdraw',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Transaction', 'User', 'Stats'],
    }),
    // stats
    // Get dashboard stats
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ url: '/user/dashboard/stats', method: 'GET'}),
      providesTags: ['Stats'],
    }),




    // Agent endpoints
    agentAddMoney: builder.mutation<Transaction, AgentTransaction>({
      queryFn: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const transaction: Transaction = {
          id: `t-${Date.now()}`,
          type: 'cash_in',
          amount: data.amount,
          fee: 0,
          status: 'completed',
          description: data.description || 'Cash in',
          createdAt: new Date().toISOString(),
        };
        return { data: transaction };
      },
      invalidatesTags: ['Transaction', 'Stats'],
    }),

    agentWithdrawMoney: builder.mutation<Transaction, AgentTransaction>({
      queryFn: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const transaction: Transaction = {
          id: `t-${Date.now()}`,
          type: 'cash_out',
          amount: data.amount,
          fee: Math.round(data.amount * 0.005),
          status: 'completed',
          description: data.description || 'Cash out',
          createdAt: new Date().toISOString(),
        };
        return { data: transaction };
      },
      invalidatesTags: ['Transaction', 'Stats'],
    }),

    // Admin endpoints
    getAllUsers: builder.query<User[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { data: MOCK_USERS.filter(u => u.role === 'user') };
      },
      providesTags: ['User'],
    }),

    getAllAgents: builder.query<User[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { data: MOCK_USERS.filter(u => u.role === 'agent') };
      },
      providesTags: ['Agent'],
    }),

    updateUserStatus: builder.mutation<User, { userId: string; status: 'active' | 'blocked' }>({
      queryFn: async ({ userId, status }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
          return { data: { ...user, status } };
        }
        return { error: { status: 404, data: 'User not found' } };
      },
      invalidatesTags: ['User', 'Agent'],
    }),

  //   getDashboardStats: builder.query<DashboardStats, void>({
  //     queryFn: async () => {
  //       await new Promise(resolve => setTimeout(resolve, 500));
  //       return {
  //         data: {
  //           totalUsers: 150,
  //           totalAgents: 25,
  //           totalTransactions: 1250,
  //           totalVolume: 2500000,
  //           balance: 5000,
  //           todayTransactions: 45,
  //           monthlyRevenue: 125000,
  //           commission: 3500,
  //         },
  //       };
  //     },
  //     providesTags: ['Stats'],
  //   }),
  }),

});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyUserQuery,
  useLogoutMutation,
  useGetProfileQuery,
  useGetAgentsQuery,
  useUpdateProfileMutation,
  useGetTransactionsQuery,
  useSendMoneyMutation,
  useDepositMoneyMutation,
  useWithdrawMoneyMutation,
  useGetDashboardStatsQuery,
  useAgentAddMoneyMutation,
  useAgentWithdrawMoneyMutation,
  useGetAllUsersQuery,
  useGetAllAgentsQuery,
  useUpdateUserStatusMutation,
} = api;
