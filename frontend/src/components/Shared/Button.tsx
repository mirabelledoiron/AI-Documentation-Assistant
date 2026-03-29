// frontend/src/components/Shared/Button.tsx
import React from 'react';
import { Button as UiButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const uiVariant =
    variant === 'primary'
      ? 'default'
      : variant === 'secondary'
        ? 'secondary'
        : variant === 'outline'
          ? 'outline'
          : 'ghost';

  const uiSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <UiButton
      variant={uiVariant}
      size={uiSize}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && (
        <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </UiButton>
  );
};
