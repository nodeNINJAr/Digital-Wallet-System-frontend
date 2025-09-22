import { Wallet } from 'lucide-react'
import { Link } from 'react-router'

export default function Logo() {
  return (
    <div>
         <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg group-hover:shadow-lg transition-all duration-200">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              PayFlow
            </span>
          </Link>
    </div>
  )
}
