import { Outlet } from 'react-router'
import CommonLayouts from './components/layouts/CommonLayouts'

export default function App() {
  return (
   <CommonLayouts>
        <Outlet/>
   </CommonLayouts>
  )
}
