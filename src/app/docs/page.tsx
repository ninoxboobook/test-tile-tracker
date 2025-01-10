'use client'

import { DocsLayout } from '@/components/docs/docs-layout'
import Content from './content.mdx'
import { MDXProviderWrapper } from './mdx-provider'

export default function DocsPage() {
  return (
    <DocsLayout>
      <MDXProviderWrapper>
        <Content />
      </MDXProviderWrapper>
    </DocsLayout>
  )
} 