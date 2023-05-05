import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepo: InMemoryCheckInsRepository
let gymsRepo: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInsRepo = new InMemoryCheckInsRepository()
    gymsRepo = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepo, gymsRepo)

    gymsRepo.items.push({
      id: 'gym-01',
      title: 'academia do dev',
      description: '',
      latitue: new Decimal(0),
      longitude: new Decimal(0),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
