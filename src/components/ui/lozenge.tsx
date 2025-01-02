export type LozengeVariant =
  | 'brand'
  | 'brand-emphasis'
  | 'positive'
  | 'positive-emphasis'
  | 'negative'
  | 'negative-emphasis'
  | 'neutral'
  | 'neutral-emphasis'

interface LozengeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: LozengeVariant
}

export function Lozenge({ variant = 'neutral', className = '', ...props }: LozengeProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-sm ring-1 ring-inset transition-colors'

  const variantClasses = {
    'brand': 'bg-clay-50 text-brand-dark ring-brand-dark',
    'brand-emphasis': 'bg-brand-dark text-clay-50 ring-brand-dark',
    'positive': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    'positive-emphasis': 'bg-emerald-600 text-white ring-emerald-600',
    'negative': 'bg-red-50 text-red-700 ring-red-600/20',
    'negative-emphasis': 'bg-red-600 text-white ring-red-600',
    'neutral': 'bg-clay-50 text-clay-700 ring-clay-600/20',
    'neutral-emphasis': 'bg-clay-600 text-white ring-clay-600',
  }[variant]

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      <span className="translate-y-[-1px]" {...props} />
    </span>
  )
}
