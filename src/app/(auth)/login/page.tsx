import { LoginForm } from '@/components/login/login-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-sand px-4 sm:px-6">
      <UnauthNav />
      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center pb-12">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h1 className="mt-6 text-center text-3xl font-extrabold text-clay-900">
                Sign in to your account
              </h1>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
