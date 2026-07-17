import { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function AppHeader({ title, subtitle, onMenuClick }: AppHeaderProps) {
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userRole = localStorage.getItem('userRole') || '';

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/v1/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setNotifications(resData.data);
          setUnreadCount(resData.unreadCount);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setDropdownOpen(false);

    if (!notif.isRead) {
      try {
        await fetch(`/api/v1/notifications/${notif._id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error reading notification:', err);
      }
    }

    if (notif.type === 'order_created') {
      window.location.href = '/orders';
    } else if (notif.type === 'user_signup') {
      window.location.href = '/admin/users';
    } else if (notif.type === 'design_approval') {
      window.location.href = '/';
    } else if (notif.type === 'inventory_update') {
      window.location.href = '/admin/inventory';
    }
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  function getRoleLabel(role: string): string {
    const roleLabels: Record<string, string> = {
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
    return roleLabels[role] || role;
  }

  function getRoleColor(role: string): string {
    const roleColors: Record<string, string> = {
      user: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      super_user: 'bg-red-500/10 text-red-500 border-red-500/20',
      inventory_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      order_processor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      delivery_person: 'bg-green-500/10 text-green-500 border-green-500/20',
      accounting: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      salesperson: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      finance_contracts: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      procurement: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      it_administrator: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    };
    return roleColors[role] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6 shadow-sm">
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Title (if provided) */}
      {title && (
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      {/* Search (if no title provided) */}
      {!title && (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders, or users..."
              className="w-full pl-9 bg-input-background"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {userName && (
          <div className="hidden md:flex items-center gap-3 border-l border-border pl-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground leading-normal">
                {userName} <span className="text-muted-foreground font-normal">and</span> <span className="text-primary font-mono">{userEmail}</span>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">
                Role: {getRoleLabel(userRole)}
              </p>
            </div>
            <Badge variant="outline" className={`${getRoleColor(userRole)} text-[9px] font-bold uppercase py-0.5`}>
              {getRoleLabel(userRole)}
            </Badge>
          </div>
        )}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card text-card-foreground rounded-lg border border-border shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/40">
                <span className="font-semibold text-xs">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead} 
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 border-b border-border/50 text-left cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notif.isRead ? 'bg-primary/5 font-semibold text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                          !notif.isRead ? 'bg-primary' : 'bg-transparent'
                        }`} />
                        <div className="space-y-0.5">
                          <p className="text-xs leading-tight">{notif.title}</p>
                          <p className="text-[10px] leading-normal line-clamp-2">{notif.message}</p>
                          <p className="text-[8px] opacity-75">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}