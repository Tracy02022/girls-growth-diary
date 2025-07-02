import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2';
  const variants = {
    default: 'bg-purple-500 text-white hover:bg-purple-600',
    outline: 'border border-purple-500 text-purple-600 bg-white hover:bg-purple-50',
  };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />
  );
});

Button.displayName = 'Button';

export { Button };
