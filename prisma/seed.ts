import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log({ testUser })

    // Create Cones
    const coneNames = ['14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '01', '02', '03', '04', '05', '06', '07', '08', '09', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022']
    const cones = []
    
    for (const name of coneNames) {
      const cone = await prisma.cone.upsert({
        where: { name },
        update: {},
        create: { name },
      })
      cones.push(cone)
    }

    console.log({ cones })

    // Create Atmospheres
    const atmospheres = await Promise.all([
      prisma.atmosphere.upsert({
        where: { name: 'Oxidation' },
        update: {},
        create: { name: 'Oxidation' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Reduction' },
        update: {},
        create: { name: 'Reduction' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Neutral' },
        update: {},
        create: { name: 'Neutral' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Salt & Soda' },
        update: {},
        create: { name: 'Salt & Soda' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Wood' },
        update: {},
        create: { name: 'Wood' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Raku' },
        update: {},
        create: { name: 'Raku' },
      }),
      prisma.atmosphere.upsert({
        where: { name: 'Lustre' },
        update: {},
        create: { name: 'Lustre' },
      }),
    ])

    // Create Decoration Types
    const decorationTypes = await Promise.all([
      prisma.decorationType.upsert({
        where: { name: 'Glaze' },
        update: {},
        create: { name: 'Glaze' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Underglaze' },
        update: {},
        create: { name: 'Underglaze' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Slip' },
        update: {},
        create: { name: 'Slip' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Engobe' },
        update: {},
        create: { name: 'Engobe' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Oxide' },
        update: {},
        create: { name: 'Oxide' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Lustre' },
        update: {},
        create: { name: 'Lustre' },
      }),
      prisma.decorationType.upsert({
        where: { name: 'Other' },
        update: {},
        create: { name: 'Other' },
      }),
    ])

    // Create Clay Body Types
    const clayBodyTypes = await Promise.all([
      prisma.clayBodyType.upsert({
        where: { name: 'Stoneware' },
        update: {},
        create: { name: 'Stoneware' },
      }),
      prisma.clayBodyType.upsert({
        where: { name: 'Porcelain' },
        update: {},
        create: { name: 'Porcelain' },
      }),
      prisma.clayBodyType.upsert({
        where: { name: 'Earthenware' },
        update: {},
        create: { name: 'Earthenware' },
      }),
      prisma.clayBodyType.upsert({
        where: { name: 'Raku' },
        update: {},
        create: { name: 'Raku' },
      }),
      prisma.clayBodyType.upsert({
        where: { name: 'Bone China' },
        update: {},
        create: { name: 'Bone China' },
      }),
      prisma.clayBodyType.upsert({
        where: { name: 'Other' },
        update: {},
        create: { name: 'Other' },
      }),
    ])

    console.log('Seed data created successfully')

  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })