import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  ViewColumnsIcon,
  CameraIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Systematic Organization',
    description:
      'Keep your test tiles organized with custom IDs, series grouping, and comprehensive metadata tracking.',
    icon: ViewColumnsIcon,
  },
  {
    name: 'Photo Documentation',
    description:
      'Document your test tiles with high-quality photos to track visual changes and results.',
    icon: CameraIcon,
  },
  {
    name: 'Material Tracking',
    description:
      'Track clay bodies, glazes, and decorations with detailed recipes and firing schedules.',
    icon: BeakerIcon,
  },
  {
    name: 'Search and Filter',
    description:
      'Quickly find test tiles with powerful search and filtering capabilities.',
    icon: MagnifyingGlassIcon,
  },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link href="/" className="-m-1.5 p-1.5 text-2xl font-semibold text-gray-900">
            Test Tile Tracker
          </Link>
        </div>
        <div className="flex items-center gap-x-6">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-clay-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-clay-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-clay-600/10 px-3 py-1 text-sm font-semibold leading-6 text-clay-600 ring-1 ring-inset ring-clay-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Test Tile Tracker for Potters
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Systematically document and manage your ceramic test tiles, glazes, and experiments. Keep track of your successes, learn from your failures, and build your pottery knowledge base.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              {session ? (
                <>
                  <Link
                    href="/test-tiles"
                    className="rounded-md bg-clay-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
                  >
                    View Test Tiles
                  </Link>
                  <Link
                    href="/test-series/new"
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-clay-600 shadow-sm ring-1 ring-inset ring-clay-600 hover:bg-gray-50"
                  >
                    Start New Series
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-md bg-clay-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Already have an account? <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-clay-600">Track Everything</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to document your ceramic experiments
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From test tiles to glaze recipes, clay bodies to firing schedules - keep all your pottery documentation in one place.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-clay-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
