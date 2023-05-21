import { FastifyListenOptions } from 'fastify'

import { app } from './app'
import { env } from './env'

const opts: FastifyListenOptions = {
  host: '0.0.0.0',
  port: env.PORT,
}

app.listen(opts).then(() => {
  console.log(`HTTP Server listening on port ${env.PORT}`)
})
