import type { ReactNode } from "react"
import { Footer } from "./Footer";
import Navbar from "./Nabvar";


interface IProps{
    children:ReactNode; 
}


export default function CommonLayouts({children}:IProps) {
  return (
    <div className="min-h-screen flex flex-col">
        {/* navbar */}
        <Navbar/>
        {/* main content */}
        <main className="grow-1">{children}</main>
        {/* footer */}
        <Footer/>
    </div>
  )
}
