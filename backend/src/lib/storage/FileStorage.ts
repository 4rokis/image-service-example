import { Storage } from './Storage'
import { existsSync, readFile, writeFile } from 'fs'

const URL = 'http://localhost:3000/'
const BASE_PATH = `${__dirname}/../../../public/`

export class FileStorage implements Storage {
  getObjectURL(path: string): string {
    return `${URL}/${path}`
  }

  async getObject(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) =>
      readFile(`${BASE_PATH}/${path}`, null, (err, data) => {
        if (err) {
          reject(err.message)
          return
        }
        resolve(data)
      }),
    )
  }

  async objectExits(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(existsSync(`${BASE_PATH}${path}`))
    })
  }

  async writeObject(data: string | Buffer, path: string): Promise<void> {
    console.log('write', `${BASE_PATH}${path}`)
    return new Promise((resolve, reject) =>
      writeFile(`${BASE_PATH}${path}`, data, null, () => {
        resolve()
      }),
    )
  }
}
