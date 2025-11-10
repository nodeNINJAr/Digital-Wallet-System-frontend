
/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from '../baseApi';
import type { LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  AgentsResponse, AgentUsersResponse, TransactionsResponse, UsersResponse, 
  ITransaction,
 } from '@/types/interface';




interface GetAgentsQuery {
  search?: string;
  location?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


// ⚙️ Main API Slice
export const api = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    //** */ AUTH ENDPOINTS
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        data:body,
        // credentials: 'include',
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
        data:body,
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
      providesTags: ['Agent'],
    }),

    //**
    sendMoney: builder.mutation<ITransaction, any>({
      query: (body) => ({
        url: '/transactions/send',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'Stats'],
    }),
    
    // **
    cashOut: builder.mutation<ITransaction, any>({
      query: (body) => ({
        url: '/transactions/cash-out',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),

    // **User DASHBOARD STATS
    getDashboardStats: builder.query<any, void>({
      query: () => ({
        url: '/dashboard/stats/user',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),


    //** AGENT CASH SERVICE **
    getUserForAgent: builder.query<AgentUsersResponse, GetAgentsQuery | void>({
      query: (params) => {
        const queryString = new URLSearchParams(
          Object.entries(params || {}).map(([key, value]) => [key, String(value)])
        ).toString();

        return {
          url: `/user?${queryString}`,
          method: 'GET',
        };
      },
      providesTags: ['Agent'],
    }),
   


    agentCashIn: builder.mutation<ITransaction, any>({
      query: (body) => ({
        url: '/transactions/cash-in',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),
     
    // With draw **
    agentWithdraw: builder.mutation<ITransaction, any>({
      query: (body) => ({
        url: '/transactions/withdraw',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['Transaction', 'User', 'AgentBalance', 'Stats'],
    }),

    //  
    getAgentDashboardStats: builder.query<any, void>({
      query: () => ({
        url: '/dashboard/stats/agent',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),

    // ** TRANSACTIONS for both user and agent
    getTransactions: builder.query<TransactionsResponse,
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
          url: `/transactions/all?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Transaction'],
    }),



    // ** ADMIN ENDPOINTS
    //  dashboard
    getAdminDashboardStats: builder.query<any, void>({
      query: () => ({
        url: '/dashboard/stats/admin',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),
    
    // 
     getTransactionTrends: builder.query<any, void>({
      query: () => ({
        url:"/dashboard/stats/admin/transaction-trends",
         method: 'GET',
      }),
       providesTags: ['Stats'],
    }),

        // 
     getTransactionTypes: builder.query<any, void>({
      query: () => ({
        url:"/dashboard/stats/admin/transaction-types",
         method: 'GET',
      }),
       providesTags: ['Stats'],
    }),
    //  

    getRecentActivity: builder.query<any, void>({
      query: () => ({
        url:"/dashboard/stats/admin/recent-activity",
         method: 'GET',
      }),
       providesTags: ['Stats'],
    }),

    // 
    getAllUsers: builder.query<UsersResponse, { page?: number; limit?: number; searchTerm?: string; agentStatus?: string }>
    
    ({
        query: ({ page = 1, limit = 25, searchTerm = "", agentStatus } = {}) => ({
          url: `/user/all`,
          method: "GET",
          params: {
            page,
            limit,
            ...(searchTerm && { searchTerm }),
            ...(agentStatus && { agentStatus }),
          },
        }),
        providesTags: ["User"],
      }),
  
    // Updated API endpoint
    getAllAgents: builder.query<AgentsResponse, {
        page?: number;
        limit?: number;
        searchTerm?: string;
        status?: string;
        sortOrder?:string;
      }>({
        query: ({ page = 1, limit = 10, searchTerm = "", status, }: {
          page?: number;
          limit?: number;
          searchTerm?: string;
          status?: string;
          sortOrder?:string;
        } = {}) => ({
          url: '/user/agents',
          method: 'GET',
          params: {
            page,
            limit,
            ...(searchTerm && { searchTerm }),
            ...(status && { status }),
          },
        }),
        providesTags: ['Agent'],
      }),


    //** */ updaate wallet type by admin
   approveWalletType: builder.mutation<any, { userId: string }
    >({
      query: ({ userId }) => ({
        url: `/wallets/agents/${userId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User', 'Agent', 'Wallet'],
    }),
       
    // **
       suspendWalletType: builder.mutation<any, { userId: string }
    >({
      query: ({ userId }) => ({
        url: `/wallets/agents/${userId}/suspend`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User', 'Agent', 'Wallet'],
    }),
     
    // ## block wallet by admin
    blockAgentwallet: builder.mutation<any, { agentId: string }>({
      query: ({ agentId }) => ({
        url: `/wallets/agents/${agentId}/block`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User', 'Agent'],
    }),
    // 
    ActiveAgentwallet: builder.mutation<any, { agentId: string }>({
    query: ({ agentId }) => ({
      url: `/wallets/agents/${agentId}/active`,
      method: 'PATCH',
    }),
    invalidatesTags: ['User', 'Agent'],
  }),


  // **All TRANSACTIONS Admin
    getAllTransactions: builder.query<TransactionsResponse,
      { page?: number; limit?: number; type?: string; status?: string; dateFrom?: string; dateTo?: string; search?: string; sortOrder:string}
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
          url: `/transactions/all?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Transaction'],
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
  useGetUserForAgentQuery,
  useAgentCashInMutation,
  useGetAgentDashboardStatsQuery,
  useAgentWithdrawMutation,
  // admin dsah
  useGetAdminDashboardStatsQuery,
  useGetTransactionTrendsQuery,
  useGetTransactionTypesQuery,
  useGetRecentActivityQuery,
  // 
  useGetAllUsersQuery,
  useGetAllAgentsQuery,
  useApproveWalletTypeMutation,
  useSuspendWalletTypeMutation,
  useBlockAgentwalletMutation,
  useActiveAgentwalletMutation,
  useGetAllTransactionsQuery,
} = api;
