import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import { getUserProfile } from './actions'
import { FormLayout } from '@/components/ui/layout/form-layout'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await getUserProfile()
  if (!user) {
    redirect('/login')
  }

  const profileData = {
    email: user.email,
    username: user.username,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    imageUrl: user.imageUrl || undefined,
  }

  return (
    <FormLayout
      title="Profile Settings"
      description="Manage your account settings and profile information"
      backHref="/dashboard"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Link
            href={`/profile/${user.id}`}
            className="text-sm text-clay-600 hover:text-clay-900"
          >
            View Public Profile
          </Link>
        </div>
        <ProfileForm initialData={profileData} />
      </div>
    </FormLayout>
  )
}