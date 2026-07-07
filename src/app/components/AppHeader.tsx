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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}