import express, { Express } from 'express'
import { PORT } from './utils/constants'

export class Server {
  app: Express

  constructor() {
    this.app = express()
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      res.header('Access-Control-Expose-Headers', '*')
      next()
    })

    this.app.use(
      express.static(`${__dirname}/../public`, {
        extensions: ['html'],
      }),
    )

    this.app.use(express.static(`${__dirname}/../storage`))

    this.app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
    })
  }
}
