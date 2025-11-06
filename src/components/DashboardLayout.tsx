import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Wallet,
  LayoutDashboard,
  ArrowLeftRight,
  User,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  Users,
  DollarSign,
  FileText,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { logout } from '@/redux/slice/authSlice';
import { toggleTheme } from '@/redux/slice/themeSlice';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getNavigationItems = () => {
    const baseRoute = `/dashboard/${user?.role}`;
    
    const commonItems = [
      { href: baseRoute, icon: LayoutDashboard, label: 'Overview', id: 'nav-overview' },
      { href: `${baseRoute}/transactions`, icon: ArrowLeftRight, label: 'Transactions', id: 'nav-transactions' },
      { href: `${baseRoute}/profile`, icon: User, label: 'Profile', id: 'nav-profile' },
    ];

    if (user?.role === 'user') {
      return [
        ...commonItems.slice(0, 1),
        { href: `${baseRoute}/send`, icon: DollarSign, label: 'Send Money', id: 'nav-send' },
        ...commonItems.slice(1),
      ];
    }

    if (user?.role === 'agent') {
      return [
        ...commonItems.slice(0, 1),
        { href: `${baseRoute}/cash-service`, icon: DollarSign, label: 'Cash Service', id: 'nav-cash-service' },
        { href: `${baseRoute}/commission`, icon: FileText, label: 'Commission', id: 'nav-commission' },
        ...commonItems.slice(1),
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems.slice(0, 1),
        { href: `${baseRoute}/users`, icon: Users, label: 'Manage Users', id: 'nav-users' },
        { href: `${baseRoute}/agents`, icon: UserCheck, label: 'Manage Agents', id: 'nav-agents' },
        { href: `${baseRoute}/transactions`, icon: ArrowLeftRight, label: 'All Transactions', id: 'nav-transactions' },
        { href: `${baseRoute}/settings`, icon: Settings, label: 'Settings', id: 'nav-settings' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to={`/dashboard/${user?.role}`} className="flex items-center gap-2">
                <Wallet className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">PayWallet</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button variant="ghost" className="gap-2" id={item.id}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                id="theme-toggle"
              >
                {mode === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Role: {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/${user?.role}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-4 mt-8">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}