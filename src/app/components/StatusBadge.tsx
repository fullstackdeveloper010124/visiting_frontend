import { Badge } from '@/app/components/ui/badge';

export type OrderStatus = 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | StockStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'delivered':
      case 'paid':
      case 'in-stock':
        return 'bg-success/10 text-success hover:bg-success/20 border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning hover:bg-warning/20 border-warning/20';
      case 'processing':
      case 'printing':
        return 'bg-info/10 text-info hover:bg-info/20 border-info/20';
      case 'shipped':
        return 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20';
      case 'cancelled':
      case 'failed':
      case 'out-of-stock':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
      case 'low-stock':
        return 'bg-warning/10 text-warning hover:bg-warning/20 border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles()} ${className || ''}`.trim()}>
      {getStatusLabel()}
    </Badge>
  );
}
