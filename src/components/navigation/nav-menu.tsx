'use client'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Test Tiles', href: '/test-tiles' },
  { name: 'Collections', href: '/collections' },
  { name: 'Clay Bodies', href: '/clay-bodies' },
  { name: 'Decorations', href: '/decorations' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()
  console.log('Navigation user:', user)

  const ProfileImage = () => (
    user?.imageUrl ? (
      <Image
        src={user.imageUrl}
        alt={`${user.username}'s profile picture`}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    ) : (
      <div className="h-8 w-8 rounded-full bg-clay-500 flex items-center justify-center">
        <span className="text-white font-medium">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </span>
      </div>
    )
  )

  return (
    <Disclosure as="nav" className="mx-auto max-w-7xl px-4 mt-6 rounded-2xl border border-solid border-clay-400 sm:px-6">
      {({ open }) => (
        <>
          <div>
            <div className="flex h-16 justify-between">

              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-brand">
                  <Image src="/images/ttt-logo.svg" alt="Test Tile Tracker" width={40} height={28} />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'text-brand relative'
                        : 'text-clay-800 hover:text-clay-900',
                      'inline-flex items-center px-1 py-1 text-base font-medium'
                    )}
                  >
                    {item.name}
                    {pathname === item.href ? <div className="h-2 w-4 bg-brand absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"></div> : null}
                  </Link>
                ))}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    className={classNames(
                      pathname === '/dashboard/admin'
                        ? 'text-brand relative'
                        : 'text-clay-800 hover:text-clay-900',
                      'inline-flex items-center px-1 py-1 text-base font-medium'
                    )}
                  >
                    Admin Dashboard
                    {pathname === '/dashboard/admin' ? <div className="h-2 w-4 bg-brand absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"></div> : null}
                  </Link>
                )}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-base focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <ProfileImage />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              active ? 'bg-clay-100' : '',
                              'block px-4 py-2 text-sm text-clay-700'
                            )}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className={classNames(
                              active ? 'bg-clay-100' : '',
                              'block w-full px-4 py-2 text-left text-sm text-clay-700'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-brand hover:bg-clay-100 hover:text-clay-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-clay-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'text-brand bg-brand/5'
                      : 'text-clay-800 hover:bg-sand-light hover:text-brand',
                    'block relative border border-transparent rounded-md pl-5 pr-4 py-2 text-base font-medium'
                  )}
                >
                  {pathname === item.href ? <div className="h-4 w-2 bg-brand absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full mt-[1px]"></div> : null}
                  {item.name}
                </Disclosure.Button>
              ))}
              {user.role === 'ADMIN' && (
                <Disclosure.Button
                  as={Link}
                  href="/dashboard/admin"
                  className={classNames(
                    pathname === '/dashboard/admin'
                      ? 'text-brand bg-brand/5'
                      : 'text-clay-800 hover:bg-sand-light hover:text-brand',
                    'block relative border border-transparent rounded-md pl-5 pr-4 py-2 text-base font-medium'
                  )}
                >
                  {pathname === '/dashboard/admin' ? <div className="h-4 w-2 bg-brand absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full mt-[1px]"></div> : null}
                  Admin Dashboard
                </Disclosure.Button>
              )}
            </div>
            <div className="border-t border-clay-200 py-4">
              <div className="flex items-center px-4">
                <ProfileImage />
                <div className="ml-3">
                  <div className="text-base font-medium text-clay-800">{user?.username}</div>
                  <div className="text-base font-medium text-clay-600">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as={Link}
                  href="/profile"
                  className={classNames(
                    pathname === '/profile'
                      ? 'text-brand bg-brand/5'
                      : 'text-clay-800 hover:bg-sand-light hover:text-brand',
                    'block relative border border-transparent rounded-md px-5 py-2 text-base font-medium'
                  )}
                >
                  {pathname === '/profile' ? <div className="h-4 w-2 bg-brand absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full mt-[1px]"></div> : null}
                  Profile Settings
                </Disclosure.Button>
                {user.role === 'ADMIN' && (
                  <Disclosure.Button
                    as={Link}
                    href="/dashboard/admin"
                    className={classNames(
                      pathname === '/dashboard/admin'
                        ? 'text-brand bg-brand/5'
                        : 'text-clay-800 hover:bg-sand-light hover:text-brand',
                      'block relative border border-transparent rounded-md px-5 py-2 text-base font-medium'
                    )}
                  >
                    {pathname === '/dashboard/admin' ? <div className="h-4 w-2 bg-brand absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full mt-[1px]"></div> : null}
                    Admin Dashboard
                  </Disclosure.Button>
                )}
                <Disclosure.Button
                  as="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full px-5 py-2 text-left text-base font-medium text-clay-800 hover:bg-sand-light hover:text-brand"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
