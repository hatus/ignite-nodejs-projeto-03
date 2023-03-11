import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

export const app = fastify()

const prisma = new PrismaClient()

async function createuser(name: string, email: string) {
  const user = await prisma.user.create({ data: { email, name } })

  return user
}

async function deleteuser(email: string) {
  const deletedUser = await prisma.user.delete({ where: { email } })
  return deletedUser
}

deleteuser('hatusn@gmail.com')
  .then((user) => {
    console.log(`${user.name} apagado com sucesso`)
  })
  .catch((error) => {
    console.log(error.message)
  })

createuser('hatus', 'hatusn@gmail.com')
  .then((user) => {
    console.log(user.name)
  })
  .catch((error) => {
    console.log(error.message)
  })
