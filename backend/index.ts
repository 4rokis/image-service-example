import express from 'express'
import { upload } from './src/paths/upload'
import { PORT } from './src/constants'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { edit } from './src/paths/edit'

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

app.route('/api/upload').put(upload)
app.route('/api/edit').post(edit)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
