import { PageLayout } from '@/components/ui/layout/page-layout'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { UnauthNav } from "@/components/navigation/unauth-nav-menu";
import Link from 'next/link'
import { Footer } from "@/components/navigation/footer";

export default function AccountDeletedPage() {
  return (
    <div className="min-h-full px-4 sm:px-6">
      <UnauthNav />
      <div className="py-6">
        <PageLayout
          title="Account deleted"
          description="Your account has been successfully deleted"
        >
          <div className="space-y-6 max-w-2xl">
            <p className="text-clay-800 mb-6">
              We're sorry to see you go. Your account and all associated data have been permanently deleted.
            </p>
            <Link href="/">
              <ActionButton>Return to home</ActionButton>
            </Link>
          </div>
        </PageLayout>
      </div>
      <Footer />
    </div>
  )
}
