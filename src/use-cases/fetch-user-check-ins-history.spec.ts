import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepo: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User CheckIns History Use Case', () => {
  beforeEach(() => {
    checkInsRepo = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepo)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepo.create({ gym_id: 'gym-01', user_id: 'user-01' })
    await checkInsRepo.create({ gym_id: 'gym-02', user_id: 'user-01' })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    // espera que o array checkIns tenha o tamanho 2
    expect(checkIns).toHaveLength(2)

    // espera um array com dois objetos que contenha a propriedade gym_id
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepo.create({ gym_id: `gym-${i}`, user_id: 'user-01' })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
  })
})
