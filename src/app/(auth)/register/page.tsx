import { RegisterForm } from '@/components/register/register-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Breadcrumbs } from '@/components/navigation/breadcrumbs'

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-sand px-4 sm:px-6">
      <UnauthNav />
      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center pb-12">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h1 className="mt-6 text-center text-3xl font-extrabold text-clay-900">
                Create your account
              </h1>
              <p className="mt-2 text-center text-clay-700">Test Tile Tracker is free to use.</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
