import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

interface PageLayoutProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

export function PageLayout({ title, action, children, description }: PageLayoutProps) {
  return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center p-8 bg-sand-light rounded-2xl">
          <div>
            <Breadcrumbs title={title} />
            <h1 className="text-3xl font-display font-semibold text-clay-800">{title}</h1>
            {description && (
              <p className="mt-4 text-lg text-clay-900">{description}</p>
            )}
          </div>
          {action}
        </div>
        <div className="mt-8 bg-sand-light rounded-2xl p-8">
          {children}
        </div>
      </div>
  );
} 