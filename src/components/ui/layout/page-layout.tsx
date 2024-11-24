interface PageLayoutProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

export function PageLayout({ title, action, children, description }: PageLayoutProps) {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {action}
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
} 