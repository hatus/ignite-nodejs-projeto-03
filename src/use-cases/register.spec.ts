import { expect, describe, it } from 'vitest'

import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async create(data) {
        return {
          created_at: new Date(),
          email: data.email,
          id: 'user-1',
          name: data.name,
          password_hash: data.password_hash,
        }
      },
      async findByEmail(email) {
        return null
      },
    })

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
})
