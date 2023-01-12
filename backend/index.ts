import express from 'express'
import { upload, edit, getImage } from './src/paths/image'
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

app.use(express.static(`${__dirname}/public`))
app.use(fileUpload())

app.route('/api/image').put(upload)
app.route('/api/image').post(edit)
app.route('/api/image').get(getImage)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
