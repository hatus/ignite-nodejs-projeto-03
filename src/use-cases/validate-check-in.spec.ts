import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepo: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepo = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to valiadte a check-in', async () => {
    const createdCheckIn = await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepo.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutos of its creation', async () => {
    /**
     * Define a hora do sistema para essa abaixo.
     *
     * Ao criar um novo checkIn com checkInsRepo.create(),
     * o new Date() vai pegar a data criada abaixo.
     */
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // em UTC

    const createdCheckIn = await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // 21 minutos em milisegundos
    const twentyOneMinutesInMs = 1000 * 60 * 21

    /**
     * Avança na data criado acima o valor abaixo em milisegundos.
     * Com a constante twentyOneMinutesInMs, o novo valor da hora do sistema
     * é 14:01 (adicionou 21 minutos)
     */
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
