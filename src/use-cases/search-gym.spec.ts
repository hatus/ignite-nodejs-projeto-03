import { expect, describe, it, beforeEach } from 'vitest'

import { SearchGymUseCase } from './search-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepo: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepo)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepo.create({
      title: 'javascript gym',
      description: 'descrição da gym',
      latitude: -5.0358163,
      longitude: -42.7810551,
      phone: '86 99992-2222',
    })

    await gymsRepo.create({
      title: 'typescript gym',
      description: 'descrição da gym',
      latitude: -5.0358163,
      longitude: -42.7810551,
      phone: '86 99992-2222',
    })

    const { gyms } = await sut.execute({ page: 1, query: 'javascript' })

    expect(gyms).toHaveLength(1)

    // espera um array com dois objetos que contenha a propriedade gym_id
    expect(gyms).toEqual([expect.objectContaining({ title: 'javascript gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepo.create({
        title: `typescript gym ${i}`,
        description: 'descrição da gym',
        latitude: -5.0358163,
        longitude: -42.7810551,
        phone: '86 99992-2222',
      })
    }

    const { gyms } = await sut.execute({ query: 'typescript', page: 2 })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'typescript gym 21' }),
      expect.objectContaining({ title: 'typescript gym 22' }),
    ])
  })
})
