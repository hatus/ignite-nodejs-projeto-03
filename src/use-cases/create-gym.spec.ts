import { expect, describe, it, beforeEach } from 'vitest'

import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepo: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepo)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'descrição da gym',
      latitude: -5.0358163,
      longitude: -42.7810551,
      phone: '86 99992-2222',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
