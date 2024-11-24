interface FormProps {
  children: React.ReactNode;
  onSubmit: (formData: FormData) => Promise<void>;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form action={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
} 