import { baseButtonStyles, buttonSizes, buttonVariants } from '@/components/ui/buttons/action-button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-clay-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-clay-700 mb-2">Sorry, we couldn't find the page you're looking for.</p>
        <p className="text-lg text-clay-700 mb-8">If you're seeing this page unexpectedly, please let us know at <a href="mailto:hello@testtiletracker.com" className="underline text-brand font-medium">hello@testtiletracker.com</a>.</p>
        <a
          href="/"
          className={`${baseButtonStyles} ${buttonSizes.default} ${buttonVariants.primary}`}
        >
          Go back home
        </a>
      </div>
    </div>
  )
}
