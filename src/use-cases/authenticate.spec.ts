import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepo)

    await usersRepo.create({
      name: 'john doe',
      email: 'john@example.com',
      password_hash: await hash('123123', 6),
    })

    const { user } = await sut.execute({
      email: 'john@example.com',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepo)

    expect(() =>
      sut.execute({
        email: 'johndoie@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepo)

    await usersRepo.create({
      name: 'john doe',
      email: 'john@example.com',
      password_hash: await hash('123123', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoie@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
