export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiaryDanger' | 'danger';
  size?: 'default' | 'compact';
  isLoading?: boolean;
}

export const baseButtonStyles = "inline-flex items-center border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
export const buttonSizes = {
  default: "text-base px-4 py-2",
  compact: "text-sm px-2.5 py-1.5"
};
export const buttonVariants = {
  primary: "text-clay-50 bg-brand hover:bg-clay-700 focus:ring-clay-500 disabled:opacity-50",
  secondary: "text-brand bg-sand-light !border-brand hover:bg-clay-50 focus:ring-clay-500 disabled:opacity-50",
  tertiary: "px-0 text-brand bg-transparent hover:text-clay-600 focus:ring-clay-500 disabled:opacity-50",
  tertiaryDanger: "px-0 text-red-600 bg-transparent hover:text-red-800 focus:ring-clay-500 disabled:opacity-50",
  danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50"
};

export function ActionButton({ 
  children, 
  variant = 'primary',
  size = 'default', 
  isLoading, 
  className,
  ...props 
}: ActionButtonProps) {
  const baseStyles = "inline-flex items-center border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    default: "text-base px-4 py-2",
    compact: "text-sm px-2.5 py-1.5"
  };
  
  const variants = {
    primary: "text-clay-50 bg-brand hover:bg-clay-700 focus:ring-clay-500 disabled:opacity-50",
    secondary: "text-brand bg-sand-light border-brand hover:bg-clay-50 focus:ring-clay-500 disabled:opacity-50",
    tertiary: "px-0 text-brand bg-transparent hover:text-clay-600 focus:ring-clay-500 disabled:opacity-50",
    tertiaryDanger: "px-0 text-red-600 bg-transparent hover:text-red-800 focus:ring-clay-500 disabled:opacity-50",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
} 