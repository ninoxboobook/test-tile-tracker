import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface PageLayoutProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  variant?: 'default' | 'detail';
  isPublic?: boolean;
}

export function PageLayout({ title, action, children, description, variant = 'default', isPublic = true }: PageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex-row sm:flex justify-between items-center p-8 bg-sand-light rounded-2xl">
        <div>
          <Breadcrumbs title={title} />
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-semibold text-clay-800">{title}</h1>
            {!isPublic && <LockClosedIcon className="h-5 w-5 text-clay-500 translate-y-[3px]" aria-hidden="false" aria-label="Private content"/>}
          </div>
          {description && (
            <p className="mt-4 text-lg text-clay-900">{description}</p>
          )}
        </div>
        {action && <div className="mt-6 sm:mt-0">
          {action}
        </div>}
      </div>
      <div className=
        {variant === 'default' ? 'mt-6 bg-sand-light rounded-2xl p-8' : 'mt-6'} >
        {children}
      </div>
    </div>
  );
} 