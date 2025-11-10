// Enums
export const IType = {
  CASH_IN: "CASH_IN",
  CASH_OUT: "CASH_OUT",
  SEND: "SEND",
  WITHDRAW: "WITHDRAW",
  BONUS: "BONUS",
} as const;

export type IType = (typeof IType)[keyof typeof IType];

export const IStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type IStatus = (typeof IStatus)[keyof typeof IStatus];





export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// types/interface.ts

export interface DashboardChartItem {
  name?: string;       // e.g., "Tue"
  cashIn?: number;
  cashOut?: number;
  commission?: number;
}

export interface AdminDashboardStats {
  totalUsers?: number;
  totalAgents?: number;
  totalTransactions?: number;
  totalVolume?: number;
  todayTransactions?: number;
  todayVolume?: number;
  pendingAgents?: number;
  activeUsers?: number;
  balance?: number;
  moneyReceived?: number;
  moneySent?: number;
  monthlyRevenue?: number;
  monthlyCashOut?: number;
  monthlyCommission?: number;
  monthlyTransactionCount?: number;
  totalCommission?: number;
  chartData?: DashboardChartItem[];
}

// API response wrapper
export interface AdminDashboardStatsResponse {
  data: AdminDashboardStats;
  message?: string;
  statusCode?: number;
  success?: boolean;
}




export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  commission: number;
  status: string;
  joinedDate: string;
  transactions: number;
}
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface AgentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    enrichedAgents: Agent[];
    meta: Meta;
    total: number;
  };
}





// export interface AgentResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: {
//     enrichedAgents: Agent[];
//     total: number;
//     meta: Record<string, any>; // or define exact meta type if known
//   };
// }

export interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  status: string;
}


// Your single transaction type
export interface ITransaction {
  _id:string;
  transactionId: string;
  type: IType;
  from?:string;  // sender wallet
  to?: string;    // receiver wallet
  amount: number;
  fee?: number;
  commission?: number;
  tranStatus: IStatus;
  initiatedBy: string; // user or agent who initiated
  notes?: string;
  createdAt:string;
  updatedAt?: string; 
}
// Transaction interface

// Paginated transaction response
export interface TransactionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    transactions: ITransaction[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  };
}









export type AgentStatus = "approved" | "pending" | "suspended";
// 
export interface User {
  agentStatus:AgentStatus;
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  status: string;
  joinedDate: string;
  transactions: number;
}

export interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User[]; // array of users
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "agent" | string;
  isActive: "active" | "inactive" | string;
  isVerified: boolean;
  agentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AgentUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: IUser[];
    pagination: Pagination;
  };
}

