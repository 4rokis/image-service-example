import express from 'express'
import { upload } from './src/paths/upload'
import { PORT } from './src/constants'
import cors from 'cors'
import fileUpload from 'express-fileupload'

const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Expose-Headers', '*')
  next()
})
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
)

app.use(
  express.static(`${__dirname}/../public`, {
    extensions: ['html'],
  }),
)
app.use(fileUpload())

app.use(express.static(`${__dirname}/../storage`))

app.route('/api/upload').put(upload)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
