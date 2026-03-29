import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
      <div className="text-base font-semibold text-foreground mb-1">{title}</div>
      <div className="text-sm text-muted-foreground max-w-sm mb-6">{description}</div>
      {actionLabel && actionTo && (
        <Button asChild>
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
