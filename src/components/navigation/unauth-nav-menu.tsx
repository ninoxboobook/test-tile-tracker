'use client'

import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

const baseStyles = "inline-flex items-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
const buttonSize = "px-3.5 py-2"
const primaryStyles = "text-clay-50 bg-brand hover:bg-clay-700 focus:ring-clay-500 border-transparent"
const secondaryStyles = "text-brand bg-sand-light border-brand hover:bg-clay-50 focus:ring-clay-500"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function UnauthNav() {
  return (
    <Disclosure as="nav" className="mx-auto max-w-7xl px-4 mt-6 rounded-2xl border border-solid border-clay-400 sm:px-6">
      {({ open }) => (
        <>
          <div>
            <div className="flex h-16 justify-between">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="text-xl font-display font-bold text-brand">
                  <Image 
                    src="/images/ttt-logo.svg" 
                    alt="Test Tile Tracker" 
                    width={40} 
                    height={28}
                  />
                </Link>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
                <Link
                  href="/login"
                  className={classNames(baseStyles, buttonSize, secondaryStyles)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={classNames(baseStyles, buttonSize, primaryStyles)}
                >
                  Sign up
                </Link>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-clay-400 hover:bg-clay-100 hover:text-clay-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand">
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
            <div className="space-y-3 pb-3 pt-2">
              <Link
                href="/login"
                className={classNames(baseStyles, buttonSize, secondaryStyles, "block w-full text-center")}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={classNames(baseStyles, buttonSize, primaryStyles, "block w-full text-center")}
              >
                Sign up
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
