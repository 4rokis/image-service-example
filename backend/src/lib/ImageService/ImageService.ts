import Sharp from 'sharp'
import { Params, Runner, TransformParams } from '../../lib/types'
import { Storage } from '../../lib/storage/Storage'
import { getFileName, rotated0 } from '../utils'
import { UploadedFile } from 'express-fileupload'

const SIZES = [600, 800, 1200, 1600]

export class ImageService implements Runner {
  storage: Storage
  params: Params
  image: Sharp.Sharp
  name: string
  metadata!: Sharp.Metadata

  constructor(storage: Storage, file: UploadedFile, params: Params) {
    this.storage = storage
    this.params = params
    this.image = Sharp(file.data)
    this.name = getFileName(file.name)
  }

  correctRotation = async () => {
    const orientation = this.metadata.orientation || 1

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

  getCropData = () => {
    const {
      left: x,
      top: y,
      width,
      height,
      rotate: rawRotate,
    } = this.params.transform as TransformParams
    const metaWidth = this.metadata.width as number
    const metaHeight = this.metadata.height as number
    const rotate = Math.abs(rawRotate % 360)
    const isRotated = rotate % 90 === 0 && rotate !== 0 && rotate !== 180
    const rotatedBase = rotated0(metaHeight, metaWidth)
    const [left, top] = isRotated
      ? [x - rotatedBase[0], y - rotatedBase[1]]
      : [x, y]
    const trueLeft = left < 0 ? 0 : left
    const trueTop = top < 0 ? 0 : top
    let trueWidth = width
    if (left < 0) {
      trueWidth = width + left
    } else if (width + left > metaWidth) {
      trueWidth = metaWidth - trueLeft
    }

    let trueHeight = height
    if (top < 0) {
      trueHeight = height + top
    } else if (height + trueTop > metaHeight) {
      trueHeight = metaHeight - trueTop
    }
    trueHeight = Math.min(trueHeight, metaHeight)
    trueWidth = Math.min(trueWidth, metaWidth)

    const withBG =
      trueLeft !== left ||
      trueTop !== top ||
      trueWidth !== width ||
      trueHeight !== height
    return {
      originLeft: Math.round(left),
      originTop: Math.round(top),
      left: Math.round(trueLeft),
      top: Math.round(trueTop),
      width: Math.round(trueWidth),
      height: Math.round(trueHeight),
      withBG,
    }
  }

  compositeWithBg = async ({
    width,
    height,
    left: x,
    top: y,
  }: TransformParams) => {
    const cropData = await this.image.jpeg().toBuffer()
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
            left: x < 0 ? Math.abs(x) : 0,
            top: y < 0 ? Math.abs(y) : 0,
          },
        ])
        .jpeg()
        .toBuffer(),
    )
  }

  crop = async () => {
    const { withBG, originLeft, originTop, ...rest } = this.getCropData()

    this.image = this.image.extract(rest)
    if (withBG) {
      this.image = await this.compositeWithBg({
        ...this.params.transform,
        left: originLeft,
        top: originTop,
      } as TransformParams)
    }
    return true
  }

  rotate = async () => {
    const { rotate = 0 } = this.params.transform || {}
    if (!rotate) {
      return false
    }
    this.image = Sharp(await this.image.rotate(rotate).toBuffer())
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
          .rotate()
          .webp()
          .toBuffer()
          .then((data: Buffer) => {
            return this.storage.writeObject(data, `${this.name}-${width}.webp`)
          })
      }),
    )
  }

  save = async () => {
    const data = await this.image.rotate().webp().toBuffer()
    return this.storage.writeObject(data, `${this.name}.webp`)
  }

  async run() {
    this.metadata = await this.image.metadata()
    await this.correctRotation()
    await this.save()
    if (this.params.transform) {
      await this.rotate()
      await this.crop()
    }
    await this.resizeAndSave()
  }
}
