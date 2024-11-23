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
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Test Tile Tracker
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A modern solution for potters to track and manage their test tiles.
                Document your experiments, track results, and make informed
                decisions about your ceramic work.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-clay-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-600"
                  >
                    Go to Dashboard
                  </Link>
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
                      Sign In <span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Features
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to track and manage your ceramic test tiles.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  className="absolute left-1 top-1 h-5 w-5 text-clay-600"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
