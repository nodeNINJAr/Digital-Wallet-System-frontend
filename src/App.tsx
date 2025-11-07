import { Outlet } from 'react-router'
import CommonLayouts from './components/layouts/CommonLayouts'
import { useAuthCheck } from './lib/hooks/useAuthCheck'

export default function App() {
  useAuthCheck();
  return (
   <CommonLayouts>
        <Outlet/>
   </CommonLayouts>
  )
}
