import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import splashImg from 'public/images/splash.jpg'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import {
  BeakerIcon,
  SwatchIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Test Tiles',
    description:
      'Document your test tiles with photos, clay bodies, decorations, and firing details. Track multiple decoration layers and organize tiles into collections.',
    icon: SwatchIcon,
  },
  {
    name: 'Clay Bodies',
    description:
      'Maintain a catalog of clay bodies with detailed properties like cone range, firing temperature, texture, plasticity, and shrinkage rates.',
    icon: BeakerIcon,
  },
  {
    name: 'Collections',
    description:
      'Group related test tiles into collections for easy reference. Perfect for organizing experiments, tracking projects, or documenting class work.',
    icon: FolderIcon,
  },
  {
    name: 'Decorations',
    description:
      'Keep track of your glazes, slips, underglazes, and other decorations. Record recipes, firing requirements, and application methods.',
    icon: MagnifyingGlassIcon,
  },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-sand min-h-screen">
      <UnauthNav />
      <div className="relative">
        <div className="mx-auto max-w-7xl py-10">
          <div className="bg-sand-light rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2">
            <div className="mx-auto px-14 py-14 col-span-1">
              <h1 className="text-2xl font-display font-semibold text-brand mb-2">Test Tile Tracker <span className="text-xs font-sans font-medium inline-block translate-y-[-12px]"><em>beta</em></span></h1>
              <h2 className="text-6xl font-display font-bold text-clay-900">
                Document Your Pottery Journey
              </h2>
              <p className="mt-6 text-lg leading-8 text-clay-700">
                A comprehensive tool for potters to document and track their ceramic experiments. From test tiles and clay bodies to glazes and decorations, organize your pottery documentation in one place.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/register"
                  className="rounded-md bg-brand px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-emphasis focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Get Started
                </Link>
                <Link href="/login" className="text-sm font-semibold leading-6 text-clay-900">
                  Sign in to your account <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="col-span-1 h-full">
              <Image
                src={splashImg}
                alt=""
                className="h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div></div>

      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-display font-semibold text-clay-900 sm:text-4xl">
              Your Complete Pottery Documentation System
            </h2>
            <p className="mt-6 text-lg leading-8 text-clay-700">
              Keep track of every aspect of your ceramic work, from test tiles and clay bodies to glazes and firing schedules. Build your knowledge base and learn from every experiment.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-display font-semibold leading-7 text-clay-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-clay-700">
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
