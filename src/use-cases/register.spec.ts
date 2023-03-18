import { expect, describe, it } from 'vitest'

import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepo)

    const { user } = await registerUseCase.execute({
      email: 'john@example.com',
      name: 'john doe',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepo = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepo)

    const { user } = await registerUseCase.execute({
      email: 'john@example.com',
      name: 'john doe',
      password: '123123',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it.skip('should not be able to register with same email twice', async () => {
    const usersRepo = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(usersRepo)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      email,
      name: 'john doe',
      password: '123123',
    })

    await expect(() =>
      registerUseCase.execute({
        email,
        name: 'john doe',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
