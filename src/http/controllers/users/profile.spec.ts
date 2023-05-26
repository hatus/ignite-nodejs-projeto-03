import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    // Cria o usuário
    await request(app.server).post('/users').send({
      name: 'john doe',
      email: 'john@example.com',
      password: '123123',
    })

    // Faz a autenticação para obter o token
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: '123123',
    })

    const { token } = authResponse.body

    // Obtém o perfil através do token
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({ email: 'john@example.com' }),
    )
  })
})
