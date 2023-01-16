import { Params } from './types'
import { Storage } from './storage/Storage'
import { extractFileName, getFileName } from './utils'
import { Image } from './Image'

const SIZES = [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const POSTFIX = 'webp'

export class ImageService {
  storage: Storage
  params: Params
  image: Image
  name: string

  constructor(storage: Storage, data: Buffer, params: Params, name: string) {
    this.storage = storage
    this.params = params
    this.image = new Image(data)
    this.name = extractFileName(name)
  }

  saveOriginal = async () => {
    const data = await this.image.toBuffer()
    return this.storage.writeObject(data, getFileName(this.name, POSTFIX))
  }

  transformImage = async () => {
    if (!this.params.transform) {
      return
    }
    const { rotate, ...cropParams } = this.params.transform
    return (await this.image.rotate(rotate)).crop(cropParams)
  }

  resizeAndSave = async () => {
    return this.image.resizeTo(SIZES, (buffer, width) => {
      return this.storage.writeObject(
        buffer,
        getFileName(this.name, POSTFIX, width),
      )
    })
  }

  getOriginalUrl = () => {
    return this.storage.getObjectURL(getFileName(this.name, POSTFIX))
  }

  async run(): Promise<string> {
    await this.image.correctRotation()
    await this.saveOriginal()
    await this.transformImage()
    await this.resizeAndSave()
    return this.getOriginalUrl()
  }
}
