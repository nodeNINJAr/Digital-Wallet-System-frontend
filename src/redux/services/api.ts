import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Transaction,
  SendMoneyRequest,
  AgentTransaction,
  DashboardStats,
} from '@/types';
import { baseApi } from '../baseApi';

// ============================================
// 🧩 Interfaces
// ============================================
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



// ⚙️ Main API Slice
export const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    //** */ AUTH ENDPOINTS
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    verifyUser: builder.query<{ data: User }, void>({
      query: () => ({
        url: '/auth/verify',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (body) => ({
        url: '/user/register',
        method: 'POST',
        body,
      }),
    }),


    // ** USER PROFILE
    getProfile: builder.query<User, void>({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/user/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    
    // ** user services
    getAgents: builder.query<AgentsResponse, GetAgentsQuery | void>({
      query: (params) => {
        const queryString = new URLSearchParams(
          Object.entries(params || {}).map(([key, value]) => [key, String(value)])
        ).toString();

        return {
          url: `/user/agents?${queryString}`,
          method: 'GET',
        };
      },
      providesTags: ['Agents'],
    }),

    //**
    sendMoney: builder.mutation<Transaction, SendMoneyRequest>({
      query: (body) => ({
        url: '/transactions/send',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'Stats'],
    }),
    
    // **
    cashOut: builder.mutation<Transaction, AgentTransaction>({
      query: (body) => ({
        url: '/transactions/cash-out',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),

    // **User DASHBOARD STATS
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: '/user/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),


    //** AGENT CASH SERVICE
    agentCashIn: builder.mutation<Transaction, AgentTransaction>({
      query: (body) => ({
        url: '/transactions/cash-in',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),
     
    // With draw **
    agentWithdraw: builder.mutation<Transaction, AgentTransaction>({
      query: (body) => ({
        url: '/transactions/withdraw',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),

    //  
    getAgentDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: '/dashboard/stats/agent',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),

    // ** TRANSACTIONS for both user and agent
    getTransactions: builder.query<
      { transactions: Transaction[]; meta: { total: number; totalPages: number; page: number; limit: number } },
      { page?: number; limit?: number; type?: string; status?: string; dateFrom?: string; dateTo?: string; search?: string }
    >({
      query: ({ page = 1, limit = 10, type, status, dateFrom, dateTo, search }) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
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
      providesTags: ['Transaction'],
    }),







    // ** ADMIN ENDPOINTS
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/user/all',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getAllAgents: builder.query<User[], void>({
      query: () => ({
        url: '/user/agent',
        method: 'GET',
      }),
      providesTags: ['Agent'],
    }),
    
    // 
    updateUserStatus: builder.mutation<User, { userId: string; status: 'active' | 'blocked' }>({
      query: ({ userId, status }) => ({
        url: `/user/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User', 'Agent'],
    }),
  }),
});




// ** Export Hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyUserQuery,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  // user
  useGetAgentsQuery,
  useCashOutMutation,
  useSendMoneyMutation,
  useGetDashboardStatsQuery,
  //both 
  useGetTransactionsQuery,
  // agent
  useAgentCashInMutation,
  useGetAgentDashboardStatsQuery,
  useAgentWithdrawMutation,
  // admin
  useGetAllUsersQuery,
  useGetAllAgentsQuery,
  useUpdateUserStatusMutation,
} = api;
