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
    const cones = await Promise.all([
      prisma.cone.upsert({
        where: { name: '14' },
        update: {},
        create: { name: '14' },
      }),
      prisma.cone.upsert({
        where: { name: '13' },
        update: {},
        create: { name: '13' },
      }),
      prisma.cone.upsert({
        where: { name: '12' },
        update: {},
        create: { name: '12' },
      }),
      prisma.cone.upsert({
        where: { name: '11' },
        update: {},
        create: { name: '11' },
      }),
      prisma.cone.upsert({
        where: { name: '10' },
        update: {},
        create: { name: '10' },
      }),
      prisma.cone.upsert({
        where: { name: '9' },
        update: {},
        create: { name: '9' },
      }),
      prisma.cone.upsert({
        where: { name: '8' },
        update: {},
        create: { name: '8' },
      }),
      prisma.cone.upsert({
        where: { name: '7' },
        update: {},
        create: { name: '7' },
      }),
      prisma.cone.upsert({
        where: { name: '6' },
        update: {},
        create: { name: '6' },
      }),
      prisma.cone.upsert({
        where: { name: '5' },
        update: {},
        create: { name: '5' },
      }),
      prisma.cone.upsert({
        where: { name: '4' },
        update: {},
        create: { name: '4' },
      }),
      prisma.cone.upsert({
        where: { name: '3' },
        update: {},
        create: { name: '3' },
      }),
      prisma.cone.upsert({
        where: { name: '2' },
        update: {},
        create: { name: '2' },
      }),
      prisma.cone.upsert({
        where: { name: '1' },
        update: {},
        create: { name: '1' },
      }),
      prisma.cone.upsert({
        where: { name: '01' },
        update: {},
        create: { name: '01' },
      }),
      prisma.cone.upsert({
        where: { name: '02' },
        update: {},
        create: { name: '02' },
      }),
      prisma.cone.upsert({
        where: { name: '03' },
        update: {},
        create: { name: '03' },
      }),
      prisma.cone.upsert({
        where: { name: '04' },
        update: {},
        create: { name: '04' },
      }),
      prisma.cone.upsert({
        where: { name: '05' },
        update: {},
        create: { name: '05' },
      }),
      prisma.cone.upsert({
        where: { name: '06' },
        update: {},
        create: { name: '06' },
      }),
      prisma.cone.upsert({
        where: { name: '07' },
        update: {},
        create: { name: '07' },
      }),
      prisma.cone.upsert({
        where: { name: '08' },
        update: {},
        create: { name: '08' },
      }),
      prisma.cone.upsert({
        where: { name: '09' },
        update: {},
        create: { name: '09' },
      }),
      prisma.cone.upsert({
        where: { name: '010' },
        update: {},
        create: { name: '010' },
      }),
      prisma.cone.upsert({
        where: { name: '011' },
        update: {},
        create: { name: '011' },
      }),
      prisma.cone.upsert({
        where: { name: '012' },
        update: {},
        create: { name: '012' },
      }),
      prisma.cone.upsert({
        where: { name: '013' },
        update: {},
        create: { name: '013' },
      }),
      prisma.cone.upsert({
        where: { name: '014' },
        update: {},
        create: { name: '014' },
      }),
      prisma.cone.upsert({
        where: { name: '015' },
        update: {},
        create: { name: '015' },
      }),
      prisma.cone.upsert({
        where: { name: '016' },
        update: {},
        create: { name: '016' },
      }),
      prisma.cone.upsert({
        where: { name: '017' },
        update: {},
        create: { name: '017' },
      }),
      prisma.cone.upsert({
        where: { name: '018' },
        update: {},
        create: { name: '018' },
      }),
      prisma.cone.upsert({
        where: { name: '019' },
        update: {},
        create: { name: '019' },
      }),
      prisma.cone.upsert({
        where: { name: '020' },
        update: {},
        create: { name: '020' },
      }),
      prisma.cone.upsert({
        where: { name: '021' },
        update: {},
        create: { name: '021' },
      }),
      prisma.cone.upsert({
        where: { name: '022' },
        update: {},
        create: { name: '022' },
      }),
    ])

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