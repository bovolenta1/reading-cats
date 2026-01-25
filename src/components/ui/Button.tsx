import * as React from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  'cursor-pointer inline-flex items-center justify-center gap-2 font-semibold transition ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0C22]';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#39FF14] text-[#0F0C22] shadow-lg hover:brightness-110',
  secondary:
    'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
  ghost:
    'bg-transparent text-white/80 hover:bg-white/10',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'rounded-lg px-3 py-1.5 text-sm',
  md: 'rounded-xl px-4 py-2 text-sm',
  lg: 'rounded-2xl px-5 py-3 text-base',
  icon: 'rounded-xl p-2',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
