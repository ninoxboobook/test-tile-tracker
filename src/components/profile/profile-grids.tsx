'use client'

import { DataGrid } from '@/components/ui/data/data-grid'
import { DataGridTile } from '@/components/ui/data/data-grid-tile'
import { LozengeVariant } from '@/components/ui/lozenge'

type TestTile = {
  id: string
  name: string
  createdAt: Date
  imageUrl?: string[] | null
  clayBody?: {
    name: string
  } | null
  atmosphere?: {
    name: string
  } | null
  cone?: {
    name: string
  } | null
  decorationLayers: {
    order: number
    decorations: {
      name: string
    }[]
  }[]
}

type Collection = {
  id: string
  name: string
  description?: string | null
  testTiles: {
    id: string
    imageUrl?: string[] | null
  }[]
}

type Decoration = {
  id: string
  name: string
  imageUrl?: string[] | null
  source?: string | null
  manufacturer?: string | null
  type?: {
    name: string
  } | null
  cone: {
    name: string
  }[]
  atmosphere: {
    name: string
  }[]
}

type ClayBody = {
  id: string
  name: string
  imageUrl?: string[] | null
  manufacturer?: string | null
  type?: {
    name: string
  } | null
  cone: {
    name: string
  }[]
}

export const TestTilesGrid = ({ testTiles }: { testTiles: TestTile[] }) => (
  <DataGrid
    items={testTiles}
    renderItem={(testTile) => ({
      id: testTile.id,
      href: `/test-tiles/${testTile.id}`,
      content: (
        <DataGridTile
          title={testTile.name}
          images={testTile.imageUrl ?? undefined}
          subtitle={testTile.clayBody?.name ?? undefined}
          lozenges={[
            ...(testTile.atmosphere ? [{ label: testTile.atmosphere.name, lozengeVariant: 'brand-emphasis' as LozengeVariant }] : []),
            ...(testTile.cone ? [{ label: /^(Low|Mid|High)/.test(testTile.cone.name) ? testTile.cone.name : `Cone ${testTile.cone.name}`, lozengeVariant: 'brand' as LozengeVariant }] : []),
          ]}
          metadata={[
            ...(testTile.decorationLayers.length > 0 ? [{
              value: testTile.decorationLayers
                .sort((a, b) => a.order - b.order)
                .flatMap(layer => layer.decorations.map(d => d.name))
                .join(', ')
            }] : []),
          ]}
        />
      )
    })}
  />
)

export const CollectionsGrid = ({ collections }: { collections: Collection[] }) => (
  <DataGrid
    items={collections}
    renderItem={(collection) => ({
      id: collection.id,
      href: `/collections/${collection.id}`,
      content: (
        <DataGridTile
          variant="quad"
          title={collection.name}
          images={collection.testTiles.flatMap(tile => tile?.imageUrl ?? []).filter(Boolean)}
          description={collection.description ?? undefined}
        />
      )
    })}
  />
)

export const DecorationsGrid = ({ decorations }: { decorations: Decoration[] }) => (
  <DataGrid
    items={decorations}
    renderItem={(decoration) => ({
      id: decoration.id,
      href: `/decorations/${decoration.id}`,
      content: (
        <DataGridTile
          title={decoration.name}
          images={decoration.imageUrl ?? undefined}
          subtitle={
            decoration.source === 'Commercial' 
              ? (decoration.manufacturer ?? decoration.source ?? undefined) 
              : (decoration.source ?? undefined)
          }
          lozenges={[
            ...decoration.cone.map(cone => ({
              label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
              lozengeVariant: 'brand' as LozengeVariant
            })),
            ...decoration.atmosphere.map(atm => ({
              label: atm.name,
              lozengeVariant: 'brand-emphasis' as LozengeVariant
            })),
          ]}
          metadata={[
            ...(decoration.type ? [{ value: decoration.type.name }] : []),
          ]}
        />
      )
    })}
  />
)

export const ClayBodiesGrid = ({ clayBodies }: { clayBodies: ClayBody[] }) => (
  <DataGrid
    items={clayBodies}
    renderItem={(clayBody) => ({
      id: clayBody.id,
      href: `/clay-bodies/${clayBody.id}`,
      content: (
        <DataGridTile
          title={clayBody.name}
          images={clayBody.imageUrl ?? undefined}
          subtitle={clayBody.manufacturer ?? undefined}
          lozenges={[
            ...clayBody.cone.map(cone => ({
              label: /^(Low|Mid|High)/.test(cone.name) ? cone.name : `Cone ${cone.name}`,
              lozengeVariant: 'brand' as LozengeVariant
            })),
          ]}
          metadata={[
            ...(clayBody.type?.name ? [{ value: clayBody.type.name }] : []),
          ]}
        />
      )
    })}
  />
)
