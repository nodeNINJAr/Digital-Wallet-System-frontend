import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Menu, Wallet, ChevronDown, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModeToggle } from './Mode-toggle'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useLogoutMutation } from '@/redux/services/api'
import { clearUser } from '@/redux/slice/authSlice'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [ logout, {isLoading}]= useLogoutMutation(undefined)   

  // 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  // 
  const navigationItems = [
    { name: 'Home', href: '/', hasDropdown: false },
    { name: 'About', href: '/about', hasDropdown: false },
    { name: 'Features', href: '/features', hasDropdown: false },
    { name: 'Pricing', href: '/pricing', hasDropdown: false },
    { name: 'Support', href: '#', hasDropdown: true, dropdownItems: [
      { name: 'FAQ', href: '/faqs' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Help Center', href: '#' },
    ]},
  ]

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }
// 
  // ** handle logout
 const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Logout failed");
      console.error(err);
    }
 }




  // 
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 dark:bg-gray-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/`} className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PayWallet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Button variant="outline" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-48"
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors relative ${
                      isActivePath(item.href)
                        ? 'text-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                    {isActivePath(item.href) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

           {/* Right side */}
          <div className="flex items-center gap-2">
              <ModeToggle/>
                   <Avatar>
                   {user ? <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    :<AvatarFallback>CN</AvatarFallback>}
                  </Avatar>
             { !user ? <Button asChild variant="outline" size="sm" className="text-sm">
                <Link to="/auth/login">Sign In</Link>
              </Button> :
              <Button variant={"ghost"} onClick={handleLogout} className="cursor-pointer text-destructive flex justify-center align-middle items-center">
                <LogOut className="mr-2 h-4 w-4" />
                  {isLoading ? "Logging out..." : "Logout"}
              </Button>}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center space-x-2 mb-8">
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-2 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  PayEase
                </span>
              </div>
              <div className="space-y-4">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className="block py-2 text-lg font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && (
                      <div className="ml-4 space-y-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block py-1 text-gray-600 hover:text-emerald-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Separator className="my-4" />
               {/* Right side */}
                  <div className="flex items-center gap-2">
                      <ModeToggle/>
                          <Avatar>
                          {user ? <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            :<AvatarFallback>CN</AvatarFallback>}
                          </Avatar>
                    { !user ? <Button asChild variant="outline" size="sm" className="text-sm">
                        <Link to="/auth/login">Sign In</Link>
                      </Button> :
                      <Button variant={"ghost"} onClick={handleLogout} className="cursor-pointer text-destructive flex justify-center align-middle items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                          {isLoading ? "Logging out..." : "Logout"}
                      </Button>}
                  </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar