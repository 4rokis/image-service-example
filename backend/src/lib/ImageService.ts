import { Params } from './types'
import { Storage } from './storage/Storage'
import { extractFileName, getFileName } from './utils'
import { Image } from './Image'
import queryString from 'querystring'

const POSTFIX = 'webp'

export type ImageData = {
  original: string
  updated: string
}

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

  save = async (image: Image, name: string) => {
    const data = await image.toBuffer()
    return this.storage.writeObject(data, name)
  }

  transformImage = async () => {
    if (!this.params.transform) {
      throw new Error('No transform params provided')
    }
    const { rotate, ...cropParams } = this.params.transform
    return (await this.image.rotate(rotate)).crop(cropParams)
  }

  getUrl = (name: string) => {
    return `${this.storage.getObjectURL(name)}?${queryString.stringify(
      this.params.transform || {},
    )}`
  }

  getOriginalUrl = () => {
    return this.getUrl(getFileName(this.name, POSTFIX))
  }

  getUpdatedUrl = () => {
    return this.getUrl(getFileName(`${this.name}-u`, POSTFIX))
  }

  async run(): Promise<ImageData> {
    const promises: Promise<void>[] = []
    await this.image.correctRotation()
    // Save original image for future transformations
    promises.push(this.save(this.image, getFileName(this.name, POSTFIX)))
    // Save transformed image
    promises.push(
      this.save(
        this.params.transform ? await this.transformImage() : this.image,
        getFileName(`${this.name}-u`, POSTFIX),
      ),
    )

    // Wait for everything to finish
    await Promise.all(promises)
    return {
      original: this.getOriginalUrl(),
      updated: this.getUpdatedUrl(),
    }
  }
}
