import App from "@/App";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import About from "@/pages/common/About";
import Contact from "@/pages/common/Contact";
import Faqs from "@/pages/common/Faqs";
import Features from "@/pages/common/Features";
import Home from "@/pages/common/Home";
import Pricing from "@/pages/common/Pricing";
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
        path: "/login",
        Component:Login,
        },
        {
        path: "/register",
        Component:Register,
        },
      
]);