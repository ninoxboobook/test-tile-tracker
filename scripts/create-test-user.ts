import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  try {
    const user = await prisma.users.upsert({
      where: {
        email: 'test@example.com',
      },
      update: {
        password: hashedPassword,
      },
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
      },
    })
    
    console.log('Test user created/updated:', user)
  } catch (error) {
    console.error('Error creating test user:', error)
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
