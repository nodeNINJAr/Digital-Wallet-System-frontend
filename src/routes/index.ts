import App from "@/App";
import { Login } from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Faqs from "@/pages/common/Faqs";
import Features from "@/pages/common/Features";
import Home from "@/pages/common/Home";
import Pricing from "@/pages/common/Pricing";
import CashServicePage from "@/pages/dashboard/agent/CashService";
import CommissionPage from "@/pages/dashboard/agent/Commission";
import AgentDashboard from "@/pages/dashboard/agent/Dashboard";
import AgentProfilePage from "@/pages/dashboard/agent/Profile";
import AgentTransactionsPage from "@/pages/dashboard/agent/Transactions";
import UserDashboard from "@/pages/dashboard/user/Dashboard";
import DepositMoneyPage from "@/pages/dashboard/user/Deposit";
import ProfilePage from "@/pages/dashboard/user/Profile";
import SendMoneyPage from "@/pages/dashboard/user/Send";
import TransactionsPage from "@/pages/dashboard/user/Transactions";
import WithdrawMoneyPage from "@/pages/dashboard/user/Withdraw";
import { createBrowserRouter } from "react-router";



export const router = createBrowserRouter([
      { path: "/",
        Component: App,
        children:[
            {
                path: "/",
                Component: Home,

            },
            {
                path: "about",
                Component: About,

            },
             {
                path: "features",
                Component: Features,

            },
             {
                path: "pricing",
                Component: Pricing,

            },
             {
                path: "contact",
                Component: Contact,

            },
            {
                path: "faqs",
                Component:Faqs ,
             },
          
         ]
       },
       {
        path: "/dashboard/user",
        Component:UserDashboard,
        },
        {
        path: "/dashboard/user/deposit",
        Component:DepositMoneyPage,
        },
        {
        path: "/dashboard/user/profile",
        Component:ProfilePage,
        },
        {
        path: "/dashboard/user/send",
        Component:SendMoneyPage,
        },
        {
         path: "/dashboard/user/transactions",
         Component:TransactionsPage,
        },
        {
         path: "/dashboard/user/withdraw",
         Component:WithdrawMoneyPage,
        },

        // agent
        {
        path: "/dashboard/agent",
        Component:AgentDashboard
        },
        {
        path: "/dashboard/agent/commission",
        Component:CommissionPage,
        },
        {
        path: "/dashboard/agent/profile",
        Component:AgentProfilePage,
        },
        {
        path: "/dashboard/agent/cash-service",
        Component:CashServicePage,
        },
        {
        path: "/dashboard/agent/transactions",
        Component:AgentTransactionsPage,
        },
       {
        path: "/login",
        Component:Login,
        },
        {
        path: "/register",
        Component:Register,
        },
      
]);