import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gym-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, q } = searchGymQuerySchema.parse(request.query)

  const searchGymUseCase = makeSearchGymUseCase()

  const { gyms } = await searchGymUseCase.execute({
    page,
    query: q,
  })

  return reply.status(200).send({ gyms })
}
