import Sharp from 'sharp'
import { Params, TransformParams } from '../types'
import { Storage } from '../storage/Storage'
import { getFileName } from '../utils'

export const SIZES = [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export class ImageService {
  storage: Storage
  params: Params
  image: Sharp.Sharp
  name: string
  width!: number
  height!: number

  constructor(storage: Storage, data: Buffer, params: Params, name: string) {
    this.storage = storage
    this.params = params
    this.image = Sharp(data)
    this.name = getFileName(name)
  }

  correctRotation = async () => {
    const orientation = (await this.image.metadata()).orientation || 1

    if (orientation === 6) {
      this.image = Sharp(await this.image.rotate(90).toBuffer())
      return
    }

    if (orientation === 8) {
      this.image = Sharp(await this.image.rotate(-90).toBuffer())
      return
    }

    if (orientation === 3) {
      this.image = Sharp(await this.image.rotate(180).toBuffer())
      return
    }
  }

  calculateCropData = () => {
    const { left, top, width, height } = this.params
      .transform as TransformParams

    const cropLeft = left < 0 ? 0 : left
    const cropTop = top < 0 ? 0 : top
    let cropWidth = width
    if (left < 0) {
      cropWidth = width + left
    } else if (width + left > this.width) {
      cropWidth = this.height - cropLeft
    }

    let cropHeight = height
    if (top < 0) {
      cropHeight = height + top
    } else if (height + cropTop > this.height) {
      cropHeight = this.height - cropTop
    }
    cropHeight = Math.min(cropHeight, this.height)
    cropWidth = Math.min(cropWidth, this.width)

    const withBG =
      cropLeft !== left ||
      cropTop !== top ||
      cropWidth !== width ||
      cropHeight !== height
    return {
      left: Math.round(cropLeft),
      top: Math.round(cropTop),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
      withBG,
    }
  }

  compositeWithBg = async ({ width, height, left, top }: TransformParams) => {
    const cropData = await this.image.toBuffer()
    const bg = Sharp(
      await Sharp(await Sharp(cropData).resize(10, 10).toBuffer())
        .resize(width, height)
        .toBuffer(),
    )
    return Sharp(
      await bg
        .composite([
          {
            input: cropData,
            left: left < 0 ? Math.abs(left) : 0,
            top: top < 0 ? Math.abs(top) : 0,
          },
        ])
        .jpeg()
        .toBuffer(),
    )
  }

  crop = async () => {
    const { withBG, ...rest } = this.calculateCropData()
    this.image = this.image.extract(rest)

    if (withBG) {
      this.image = await this.compositeWithBg(
        this.params.transform as TransformParams,
      )
    }
    return true
  }

  rotate = async () => {
    const { rotate = 0 } = this.params.transform || {}
    if (!rotate) {
      return false
    }
    const is90Rotated = rotate % 90 === 0 && rotate !== 0 && rotate !== 180
    if (is90Rotated) {
      ;[this.height, this.width] = [this.width, this.height]
    }
    this.image = this.image.rotate(rotate)
    return true
  }

  resizeAndSave = async () => {
    return await Promise.all(
      SIZES.map((width) => {
        return this.image
          .resize(width, null, {
            withoutEnlargement: false,
            fit: 'cover',
          })
          .webp()
          .toBuffer()
          .then((data: Buffer) => {
            return this.storage.writeObject(data, `/${this.name}-${width}.webp`)
          })
      }),
    )
  }

  save = async () => {
    const data = await this.image.webp().toBuffer()
    return this.storage.writeObject(data, `/${this.name}.webp`)
  }

  async run(): Promise<string> {
    const { width: metaWidth, height: metaHeight } = await this.image.metadata()
    if (!metaWidth || !metaHeight) {
      throw new Error('Metadata size is undefined')
    }
    this.width = metaWidth
    this.height = metaHeight
    await this.correctRotation()
    await this.save()
    if (this.params.transform) {
      await this.rotate()
      await this.crop()
    }
    await this.resizeAndSave()
    return this.storage.getObjectURL(`${this.name}.webp`)
  }
}
