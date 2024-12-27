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
import {
  BeakerIcon,
  SwatchIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Carousel } from '@/components/ui/carousel'
import { Footer } from '@/components/navigation/footer'
import {
  baseButtonStyles,
  buttonSizes,
  buttonVariants,
} from '@/components/ui/buttons/action-button'

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
      <div className="relative mb-20">
        <div className="mx-auto max-w-7xl py-10">
          <div className="bg-sand-light rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2">
            <div className="mx-auto px-14 py-14 col-span-1">
              <h1 className="text-2xl font-display font-semibold text-brand mb-2">Test Tile Tracker <span className="text-xs font-sans font-medium inline-block translate-y-[-12px]"><em>beta</em></span></h1>
              <h2 className="text-6xl font-display font-bold text-clay-900">
                Document Your Pottery Journey
              </h2>
              <p className="mt-6 pr-4 text-lg text-clay-700">
                A comprehensive tool for potters to document and track their ceramic experiments. From test tiles and clay bodies to glazes and decorations, organize your pottery documentation in one place.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/register"
                  className={baseButtonStyles + ' ' + buttonVariants.primary + ' ' + buttonSizes.default}
                >
                  Get Started
                </Link>
                <Link href="/login" className={baseButtonStyles + ' ' + buttonVariants.secondary + ' ' + buttonSizes.default}>
                  Sign in to your account
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

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
        <h2 className="font-display font-semibold text-clay-800 text-4xl text-center pb-4">No more rummaging through boxes</h2>
        <p className="text-xl max-w-4xl text-center mx-auto text-clay-700">Document and organise your personal library of test tiles, decorations and clay so you can access it anywhere. Search, filter and cross-reference existing test tiles to make every glaze day a good day.</p>
        </div>
        <Carousel
          tiles={[
            {
              title: 'Frozen Pond Test',
              subtitle: 'Walkers PB103',
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
              title: 'Tenmoku Over Celadon',
              subtitle: 'Layered Test',
              images: [testTile2.src],
              lozenges: [
                { label: 'Cone 6', lozengeVariant: 'brand' },
                { label: 'Porcelain', lozengeVariant: 'neutral' },
                { label: 'Tenmoku', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { label: 'Date', value: '2024-01-12' },
                { label: 'Collection', value: 'Layered Glazes' }
              ],
              description: 'Exploring glaze interactions'
            },
            {
              title: 'Copper Red Test',
              subtitle: 'Reduction Firing',
              images: [testTile3.src],
              lozenges: [
                { label: 'Cone 10', lozengeVariant: 'brand' },
                { label: 'Stoneware', lozengeVariant: 'neutral' },
                { label: 'Copper Red', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { label: 'Date', value: '2024-01-10' },
                { label: 'Collection', value: 'Copper Reds' }
              ],
              description: 'Testing reduction atmosphere effects'
            },
            {
              title: 'Ash Glaze Study',
              subtitle: 'Wood Ash Base',
              images: [testTile4.src],
              lozenges: [
                { label: 'Cone 11', lozengeVariant: 'brand' },
                { label: 'Groggy Clay', lozengeVariant: 'neutral' },
                { label: 'Ash Glaze', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { label: 'Date', value: '2024-01-08' },
                { label: 'Collection', value: 'Ash Glazes' }
              ],
              description: 'Local wood ash composition test'
            },
            {
              title: 'Crystalline Test',
              subtitle: 'Zinc Silicate',
              images: [testTile5.src],
              lozenges: [
                { label: 'Cone 8', lozengeVariant: 'brand' },
                { label: 'Porcelain', lozengeVariant: 'neutral' },
                { label: 'Crystalline', lozengeVariant: 'brand-emphasis' }
              ],
              metadata: [
                { label: 'Date', value: '2024-01-05' },
                { label: 'Collection', value: 'Crystal Growth' }
              ],
              description: 'Testing crystal growth patterns'
            }
          ]}
        />
      </div>

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
      <Footer />
    </div>
  )
}
