
// import Logo from "@/assets/icons/Logo"
// import { Button } from "@/components/ui/button"
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// import { Link } from "react-router";
// import { ModeToggle } from "./Mode-toggle";


// // Navigation links array to be used in both desktop and mobile menus
//   const navigation = [
//     { name: 'Home', href: '/',active:false},
//     { name: 'About', href: '/about' },
//     { name: 'Features', href: '/features' },
//     { name: 'Pricing', href: '/pricing' },
//     { name: 'Contact', href: '/contact' },
//     { name: 'FAQs', href: '/faqs' },
//   ];

// export default function Navbar() {
//   return (
//     <header className="border-b px-4 md:px-6">
//       <div className="flex h-16 items-center justify-between gap-4">
//         {/* Left side */}
//         <div className="flex items-center gap-2">
//           {/* Mobile menu trigger */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 className="group size-8 md:hidden"
//                 variant="ghost"
//                 size="icon"
//               >
//                 <svg
//                   className="pointer-events-none"
//                   width={16}
//                   height={16}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M4 12L20 12"
//                     className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
//                   />
//                   <path
//                     d="M4 12H20"
//                     className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
//                   />
//                   <path
//                     d="M4 12H20"
//                     className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
//                   />
//                 </svg>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent align="start" className="w-36 p-1 md:hidden">
//               <NavigationMenu className="max-w-none *:w-full">
//                 <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
//                   {navigation.map((link, index) => (
//                     <NavigationMenuItem key={index} className="w-full">
//                       <NavigationMenuLink
//                         asChild
//                         className="py-1.5"
//                         active={link.active}
//                       >
//                          <Link to={link.href}>{link.name}</Link>
//                       </NavigationMenuLink>
//                     </NavigationMenuItem>
//                   ))}
//                 </NavigationMenuList>
//               </NavigationMenu>
//             </PopoverContent>
//           </Popover>
//           {/* Main nav */}
//           <div className="flex items-center gap-6">
//             <a href="#" className="text-primary hover:text-primary/90">
//               <Logo />
//             </a>
//             {/* Navigation menu */}
//             <NavigationMenu className="max-md:hidden">
//               <NavigationMenuList className="gap-2">
//                 {navigation.map((link, index) => (
//                   <NavigationMenuItem key={index}>
//                     <NavigationMenuLink
//                       asChild
//                       active={link.active}
//                       className="text-muted-foreground hover:text-primary py-1.5 font-medium"
//                     >
//                       <Link to={link.href}>{link.name}</Link>
//                     </NavigationMenuLink>
//                   </NavigationMenuItem>
//                 ))}
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>
//         </div>
//         {/* Right side */}
//         <div className="flex items-center gap-2">
//             <ModeToggle/>
//           <Button asChild variant="ghost" size="sm" className="text-sm">
//             <Link to="/login">Sign In</Link>
//           </Button>
//           <Button asChild size="sm" className="text-sm">
//             <Link to="/login">Take a Tour</Link>
//           </Button>
//         </div>
//       </div>
//     </header>
//   )
// }


import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Menu, Wallet, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ModeToggle } from './Mode-toggle'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              PayFlow
            </span>
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
              <Button asChild variant="outline" size="sm" className="text-sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="ghost" asChild size="sm" className="text-sm">
                  <Link to="/login">Take a Tour</Link>
              </Button>
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
                    <Button asChild variant="ghost" size="sm" className="text-sm">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="text-sm bg-amber-600" variant="outline">
                        <Link to="/login">Take a Tour</Link>
                    </Button>
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