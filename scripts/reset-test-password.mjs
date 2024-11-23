import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Update the test user's password
    const updatedUser = await prisma.users.update({
      where: {
        email: 'test@example.com'
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date() // Required by schema
      },
      select: {
        email: true,
        username: true
      }
    })

    console.log('Updated user:', updatedUser)
    console.log('New password is:', password)
  } catch (error) {
    console.error('Error:', error)
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
