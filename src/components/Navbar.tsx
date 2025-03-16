
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Ticket, 
  PackageOpen, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { getCurrentUser, logout, hasPermission } from '@/lib/auth';
import { User as UserType, Role } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    loadUser();
  }, []);
  
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      allowedRoles: ['admin', 'cashier', 'operator'] as Role[]
    },
    {
      name: 'Tickets',
      path: '/tickets',
      icon: <Ticket className="h-5 w-5" />,
      allowedRoles: ['admin', 'cashier'] as Role[]
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: <PackageOpen className="h-5 w-5" />,
      allowedRoles: ['admin'] as Role[]
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: <BarChart3 className="h-5 w-5" />,
      allowedRoles: ['admin', 'cashier', 'operator'] as Role[]
    }
  ];
  
  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-border bg-card p-4 shadow-sm md:block">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-center py-4">
            <h1 className="text-2xl font-semibold text-laundry-500">WashWise</h1>
          </div>
          
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              hasPermission(user, item.allowedRoles) && (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    location.pathname === item.path 
                      ? "bg-laundry-50 text-laundry-600"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </nav>
          
          <div className="mt-auto">
            {user && (
              <div className="mb-4 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-laundry-100 text-laundry-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-muted-foreground/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="fixed left-0 top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold text-laundry-500">WashWise</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden" onClick={closeMobileMenu}>
          <div 
            className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 animate-slide-left bg-card shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col p-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  hasPermission(user, item.allowedRoles) && (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        location.pathname === item.path 
                          ? "bg-laundry-50 text-laundry-600"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      onClick={closeMobileMenu}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )
                ))}
              </nav>
              
              <div className="mt-auto">
                {user && (
                  <div className="mb-4 rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-laundry-100 text-laundry-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-muted-foreground/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
