import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepo: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepo)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      email: 'john@example.com',
      name: 'john doe',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      email,
      name: 'john doe',
      password: '123123',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'john doe',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
