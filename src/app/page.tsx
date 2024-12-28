import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import splashImg from 'public/images/splash.jpg'
import testTile1 from 'public/images/test-tile-1.png'
import testTile2 from 'public/images/test-tile-2.png'
import testTile3 from 'public/images/test-tile-3.png'
import testTile4 from 'public/images/test-tile-4.png'
import testTile5 from 'public/images/test-tile-5.png'
import { UnauthNav } from '@/components/navigation/unauth-nav-menu'
import { Footer } from '@/components/navigation/footer'
import { DemoTilesView } from '@/components/ui/demo-tiles-view'
import {
  PlusIcon,
  PaintBrushIcon,
  SwatchIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import {
  baseButtonStyles,
  buttonSizes,
  buttonVariants,
} from '@/components/ui/buttons/action-button'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const features = [
  {
    name: 'Add clay bodies',
    description:
      'Start by adding the clay bodies you use in your practice. Record details like clay body type, firing temperature range, texture, shrinkage and more to help you make informed decisions.',
    icon: PlusIcon,
  },
  {
    name: 'Add decorations',
    description:
      'Add glazes, underglazes, slips, oxides and other decorations to your library. Document recipes (or link out to Glazy), firing requirements, and colour and surface properties.',
    icon: PaintBrushIcon,
  },
  {
    name: 'Document test tiles',
    description:
      'Create test tiles using your clay bodies and decorations. Take photos, record multiple decoration layers, and add notes about your results.',
    icon: SwatchIcon,
  },
  {
    name: 'Organise collections',
    description:
      'Group related test tiles into collections to track experiments and projects. Perfect for organising glaze combinations, surface techniques, or class work.',
    icon: FolderIcon,
  },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="bg-sand min-h-full px-4 sm:px-6">
      <UnauthNav />
      <div className="relative mb-4 md:mb-14 lg:mb-20">
        <div className="mx-auto max-w-7xl py-10">
          <div className="bg-sand-light rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="mx-auto p-10 lg:p-16 col-span-1 order-2 md:order-1">
              <h1 className="text-2xl font-display font-semibold text-brand mb-2">Test Tile Tracker <span className="text-xs font-sans font-medium inline-block translate-y-[-12px]"><em>beta</em></span></h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-clay-900">
                Make every glaze day a good day
              </h2>
              <p className="mt-4 md:mt-6 lg:mt-8 pr-4 text-lg lg:text-xl text-clay-700">
                Document and organise your test tiles, decorations and clay bodies. Keep track of your experiments, build your personal library, and access it anywhere, anytime.
              </p>
              <div className="mt-6 lg:mt-8 flex items-center gap-x-3">
                <Link
                  href="/register"
                  className={classNames(baseButtonStyles, buttonVariants.primary, buttonSizes.default)}
                >
                  Get started
                </Link>
                <Link href="/login" className={classNames(baseButtonStyles, buttonVariants.secondary, buttonSizes.default)}>
                  Sign in
                </Link>
              </div>
            </div>
            <div className="col-span-1 h-60 md:h-full order-1 md:order-2">
              <Image
                src={splashImg}
                alt=""
                className="h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 md:mb-8">
          <h2 className="font-display font-semibold text-clay-800 text-3xl md:text-4xl text-center mb-4 md:mb-6">No more rummaging through boxes</h2>
          <p className="md:text-lg max-w-5xl text-center mx-auto text-clay-700">Do your test tiles or pots have a habit of going missing? Can you never remember what a particular glaze combination looks like? Test Tile Tracker lets you search, filter and cross-reference your test tiles so you can spend less time wondering and more time creating.</p>
        </div>

        <DemoTilesView
          tiles={[
            {
              title: 'Frozen pond test',
              subtitle: 'Keane Midfire',
              images: [testTile1.src],
              lozenges: [
                { label: 'Cone 6', lozengeVariant: 'brand' },
                { label: 'Oxidation', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { value: 'Honey Flux, Mayco Green Tea' },
              ],
            },
            {
              title: 'Chrome red',
              subtitle: 'Keane Midfire',
              images: [testTile2.src],
              lozenges: [
                { label: 'Cone 6', lozengeVariant: 'brand' },
                { label: 'Oxidation', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { value: 'Martin\'s Chrome Red' },
              ],
            },
            {
              title: 'Matte over slips',
              subtitle: 'Studio Reclaim',
              images: [testTile3.src],
              lozenges: [
                { label: 'Cone 10', lozengeVariant: 'brand' },
                { label: 'Reduction', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { value: 'Porcelain slip, Terracotta slip, Iron oxide, Base matte' },
              ],
            },
            {
              title: 'Green brush-on',
              subtitle: 'Walkers PB103',
              images: [testTile4.src],
              lozenges: [
                { label: 'Cone 10', lozengeVariant: 'brand' },
                { label: 'Reduction', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { value: 'Studio teal' },
              ],
            },
            {
              title: 'Butterscotch',
              subtitle: 'Feeneys Dark Stoneware',
              images: [testTile5.src],
              lozenges: [
                { label: 'Cone 10', lozengeVariant: 'brand' },
                { label: 'Oxidation', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { value: 'Porcelain slip, Butterscotch' },
              ],
            }
          ]}
        />
      </div>

      <div className="pt-14 pb-8 md:pt-14 md:pt-20 lg:pt-28 lg:pb-20">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-8 md:gap-14">
          <div className="mx-auto max-w-2xl col-span-12 md:col-span-5">
            <h2 className="text-3xl md:text-4xl text-center md:text-left font-display font-semibold text-clay-800 lg:pt-14">
              Get started with Test Tile Tracker
            </h2>
            <p className="mt-4 md:mt-6 mb-6 md:mb-8 text-lg lg:text-xl text-center md:text-left text-clay-700">
              Test Tile Tracker is free and easy to use. Sign up to create your own studio library today.
            </p>
            <div className="flex md:block justify-center">

              <Link
                href="/register"
                className={classNames(baseButtonStyles, buttonVariants.primary, buttonSizes.default)}
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="mx-auto col-span-12 md:col-span-7 max-w-2xl rounded-2xl bg-sand-light p-14">
            <dl className="relative">
              {/* Vertical dotted line */}
              <div className="absolute left-5 top-0 h-[calc(100%-12rem)] md:h-[calc(100%-8rem)] w-[2px] border-l-2 border-dashed border-clay-300" />

              {features.map((feature, index) => (
                <div key={feature.name} className="relative mb-16 last:mb-0 pl-16">
                  {/* Icon disc */}
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-brand">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>

                  <dt>
                    {/* Step number */}
                    <span className="inline-block text-sm font-medium text-brand">Step {index + 1}</span>
                    {/* Heading */}
                    <div className="font-display text-2xl font-semibold text-clay-800">
                      {feature.name}
                    </div>
                  </dt>
                  {/* Description */}
                  <dd className="mt-3 text-lg leading-7 text-clay-700">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
