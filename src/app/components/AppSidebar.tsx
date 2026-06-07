import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Printer,
  ClipboardList,
  X,
  Truck,
  DollarSign,
  PhoneCall,
  Building2,
  Shield,
  Database,
  Activity,
  GitBranch,
  LogOut,
  User,
  HelpCircle,
  Edit
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { UserRole } from '../types/roles';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: UserRole[];
}

interface AppSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function AppSidebar({ userRole, isOpen, onClose, onLogout }: AppSidebarProps) {
  const location = useLocation();

  const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['user', 'super_user', 'inventory_admin', 'order_processor', 'delivery_person', 'accounting', 'salesperson', 'finance_contracts', 'procurement', 'it_administrator'] },
    
    // Super User / Admin specific navigation
    { title: 'Products', href: '/products', icon: Package, roles: ['super_user', 'procurement'] },
    { title: 'Customize', href: '/customize', icon: Printer, roles: ['super_user'] },
    { title: 'My Orders', href: '/orders', icon: ShoppingCart, roles: ['super_user', 'accounting', 'order_processor'] },
    { title: 'Inventory', href: '/inventory', icon: Package, roles: ['super_user', 'procurement'] },
    
    // User role specific navigation
    { title: 'My Products', href: '/products', icon: Package, roles: ['user'] },
    { title: 'My Inventory', href: '/user-inventory', icon: Database, roles: ['user'] },
    { title: 'Update Product', href: '/update-product', icon: Edit, roles: ['user'] },
    { title: 'Edit Profile', href: '/profile', icon: User, roles: ['user'] },
    { title: 'Analytics / Stats', href: '/user-analytics', icon: BarChart3, roles: ['user'] },
    { title: 'Help', href: '/help', icon: HelpCircle, roles: ['user'] },
    
    // Inventory Admin
    { title: 'Stock Management', href: '/admin/inventory', icon: Package, roles: ['super_user', 'inventory_admin'] },
    
    // Order Processor
    { title: 'Order Processing', href: '/orders', icon: ClipboardList, roles: ['super_user', 'order_processor'] },
    
    // Delivery Person
    { title: 'My Deliveries', href: '/deliveries', icon: Truck, roles: ['super_user', 'delivery_person'] },
    
    // Accounting
    { title: 'Invoices & Payments', href: '/accounting', icon: DollarSign, roles: ['super_user', 'accounting'] },
    
    // Salesperson
    { title: 'Leads & Sales', href: '/sales', icon: PhoneCall, roles: ['super_user', 'salesperson'] },
    
    // Finance Contracts
    { title: 'Contracts', href: '/finance', icon: FileText, roles: ['super_user', 'finance_contracts'] },
    
    // Procurement
    { title: 'Vendor Management', href: '/procurement', icon: Building2, roles: ['super_user', 'procurement'] },
    
    // IT Administrator
    { title: 'User Management', href: '/admin/users', icon: Users, roles: ['super_user', 'it_administrator'] },
    
    // System wide
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['super_user', 'accounting', 'salesperson'] },
    { title: 'Workflows', href: '/system/workflow-diagrams', icon: GitBranch, roles: ['super_user', 'it_administrator'] },
    { title: 'Documentation', href: '/system/documentation', icon: Database, roles: ['super_user', 'it_administrator'] },
    { title: 'Audit Logs', href: '/system/audit-logs', icon: Activity, roles: ['super_user', 'it_administrator'] },
    { title: 'Settings', href: '/settings', icon: Settings, roles: ['user', 'super_user', 'inventory_admin', 'order_processor', 'delivery_person', 'accounting', 'salesperson', 'finance_contracts', 'procurement', 'it_administrator'] },
  ];

  const filteredItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      user: 'User',
      super_user: 'Super User',
      inventory_admin: 'Inventory Admin',
      order_processor: 'Order Processor',
      delivery_person: 'Delivery Person',
      accounting: 'Accounting',
      salesperson: 'Salesperson',
      finance_contracts: 'Finance Contracts',
      procurement: 'Procurement',
      it_administrator: 'IT Administrator',
    };
    return roleLabels[role];
  };

  const getRoleColor = (role: UserRole): string => {
    const roleColors: Record<UserRole, string> = {
      user: 'bg-gray-500',
      super_user: 'bg-red-500',
      inventory_admin: 'bg-purple-500',
      order_processor: 'bg-blue-500',
      delivery_person: 'bg-green-500',
      accounting: 'bg-yellow-500',
      salesperson: 'bg-pink-500',
      finance_contracts: 'bg-indigo-500',
      procurement: 'bg-orange-500',
      it_administrator: 'bg-cyan-500',
    };
    return roleColors[role];
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex h-screen w-64 flex-col border-r border-border bg-card
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between gap-3 border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Printer className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">PrintFlow</h1>
              <p className="text-xs text-muted-foreground">Enterprise System</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Role Badge */}
        <div className="p-4 pb-0">
          <Badge className={`${getRoleColor(userRole)} text-white w-full justify-center`}>
            {getRoleLabel(userRole)}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href + item.title}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRoleColor(userRole)} text-white font-medium text-sm`}>
              {getRoleLabel(userRole).substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {getRoleLabel(userRole)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userRole}@company.com
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}