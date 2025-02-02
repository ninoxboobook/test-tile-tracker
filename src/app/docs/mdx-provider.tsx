'use client'

import { MDXProvider } from '@mdx-js/react'
import { PropsWithChildren } from 'react'

const components = {
  h2: (props: PropsWithChildren) => (
    <h2 {...props} className="text-3xl font-display font-semibold text-clay-600 mt-12 mb-4" />
  ),
  h3: (props: PropsWithChildren) => (
    <h3 {...props} className="text-2xl font-display font-semibold text-clay-700 mt-8 mb-3" />
  ),
  h4: (props: PropsWithChildren) => (
    <h4 {...props} className="text-xl font-display font-semibold text-clay-800 mt-6 mb-2" />
  ),

  h5: (props: PropsWithChildren) => (
    <h5 {...props} className="text-lg font-medium underline text-clay-800 mt-6 mb-1" />
  ),

  p: (props: PropsWithChildren) => (
    <p {...props} className="text-lg mb-4 leading-relaxed max-w-prose" />
  ),
  ul: (props: PropsWithChildren) => (
    <ul {...props} className="list-disc mt-5 mb-6 ml-4 pl-6" />
  ),
  ol: (props: PropsWithChildren) => (
    <ol {...props} className="list-decimal mt-5 mb-6 ml-4 pl-6" />
  ),
  li: (props: PropsWithChildren) => (
    <li {...props} className="text-lg mb-2 max-w-prose leading-normal" />
  ),
  a: (props: PropsWithChildren) => (
    <a {...props} className="text-brand underline hover:text-clay-700" />
  ),
  hr: () => (
    <hr className="mt-12 mb-6 border-t border-clay-300" />
  ),
}

export function MDXProviderWrapper({ children }: PropsWithChildren) {
  return <MDXProvider components={components}>{children}</MDXProvider>
} 