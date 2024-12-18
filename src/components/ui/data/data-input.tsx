interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`flex h-10 rounded-md border border-clay-300 bg-white px-3 py-2 text-sm placeholder:text-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
} 