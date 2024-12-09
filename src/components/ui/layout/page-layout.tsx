import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

interface PageLayoutProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

export function PageLayout({ title, action, children, description }: PageLayoutProps) {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex justify-between items-center pb-10 mt-4">
          <div>
            <Breadcrumbs title={title} />
            <h1 className="text-3xl font-display font-semibold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-4 text-lg text-gray-600">{description}</p>
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