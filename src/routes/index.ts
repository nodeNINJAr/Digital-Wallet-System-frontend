import { createBrowserRouter } from 'react-router';
import App from '@/App';
import ErrorPage from '@/pages/error/ErrorPage';

// Common pages
import Home from '@/pages/common/Home';
import About from '@/pages/common/About';
import Contact from '@/pages/common/Contact';
import Faqs from '@/pages/common/Faqs';
import Features from '@/pages/common/Features';
import Pricing from '@/pages/common/Pricing';

// Auth pages
import { Login } from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// User Dashboard pages
import UserDashboard from '@/pages/dashboard/user/Dashboard';
import DepositMoneyPage from '@/pages/dashboard/user/Deposit';
import ProfilePage from '@/pages/dashboard/user/Profile';
import SendMoneyPage from '@/pages/dashboard/user/Send';
import TransactionsPage from '@/pages/dashboard/user/Transactions';
import WithdrawMoneyPage from '@/pages/dashboard/user/Withdraw';

// Agent Dashboard pages
import AgentDashboard from '@/pages/dashboard/agent/Dashboard';
import CommissionPage from '@/pages/dashboard/agent/Commission';
import AgentProfilePage from '@/pages/dashboard/agent/Profile';
import CashServicePage from '@/pages/dashboard/agent/CashService';
import AgentTransactionsPage from '@/pages/dashboard/agent/Transactions';

// Admin Dashboard pages
import AdminDashboard from '@/pages/dashboard/admin/Dashboard';
import ManageUsersPage from '@/pages/dashboard/admin/Users';
import AdminTransactionsPage from '@/pages/dashboard/admin/Transactions';
import AdminSettingsPage from '@/pages/dashboard/admin/Settings';
import ManageAgentsPage from '@/pages/dashboard/admin/Agents';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "features", Component: Features },
      { path: "pricing", Component: Pricing },
      { path: "contact", Component: Contact },
      { path: "faqs", Component: Faqs },
    ],
  },
  // Auth routes - no layout wrapper
  {
    path: "auth",
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  // User Dashboard routes - no component, just path grouping
  {
    path: "dashboard/user",
    children: [
      { index: true, Component: UserDashboard },
      { path: "deposit", Component: DepositMoneyPage },
      { path: "profile", Component: ProfilePage },
      { path: "send", Component: SendMoneyPage },
      { path: "transactions", Component: TransactionsPage },
      { path: "withdraw", Component: WithdrawMoneyPage },
    ],
  },
  // Agent Dashboard routes - no component, just path grouping
  {
    path: "dashboard/agent",
    children: [
      { index: true, Component: AgentDashboard },
      { path: "commission", Component: CommissionPage },
      { path: "profile", Component: AgentProfilePage },
      { path: "cash-service", Component: CashServicePage },
      { path: "transactions", Component: AgentTransactionsPage },
    ],
  },
  // Admin Dashboard routes - no component, just path grouping
  {
    path: "dashboard/admin",
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users", Component: ManageUsersPage },
      { path: "transactions", Component: AdminTransactionsPage },
      { path: "settings", Component: AdminSettingsPage },
      { path: "agents", Component: ManageAgentsPage },
    ],
  },
  // Catch-all 404 route
  {
    path: "*",
    Component: ErrorPage,
  },
]);