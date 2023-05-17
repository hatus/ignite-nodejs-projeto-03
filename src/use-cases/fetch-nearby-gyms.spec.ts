import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepo: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepo)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepo.create({
      title: 'near gym',
      description: 'descrição da gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: '86 99992-2222',
    })

    await gymsRepo.create({
      title: 'far gym',
      description: 'descrição da gym',
      latitude: -27.0610928,
      longitude: -49.5229501,
      phone: '86 99992-2222',
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)

    // espera um array com dois objetos que contenha a propriedade gym_id
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })])
  })
})
