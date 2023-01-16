import Sharp from 'sharp'

type CropParams = {
  left: number
  top: number
  height: number
  width: number
}

type Metadata = {
  width: number
  height: number
  orientation: number
}

export class Image {
  private data: Sharp.Sharp
  private metadata: Metadata | null = null

  constructor(data: Buffer | Sharp.Sharp) {
    if (Buffer.isBuffer(data)) {
      this.data = Sharp(data)
      return
    }
    this.data = data
  }

  private getMetadata = async (): Promise<Metadata> => {
    if (this.metadata) {
      return this.metadata
    }
    const { width, height, orientation } = await this.data.metadata()
    if (!width || !height) {
      throw new Error('Metadata cannot be fetched')
    }
    this.metadata = {
      width,
      height,
      orientation: orientation || 1,
    }
    return this.metadata
  }

  private swapDimensions = async () => {
    const metadata = await this.getMetadata()
    // noinspection JSSuspiciousNameCombination
    this.metadata = {
      ...metadata,
      width: metadata.height,
      height: metadata.width,
    }
  }

  private calculateCropData = async ({
    left,
    top,
    width,
    height,
  }: CropParams) => {
    const cropLeft = left < 0 ? 0 : left
    const cropTop = top < 0 ? 0 : top
    const { width: imageWidth, height: imageHeight } = await this.getMetadata()
    let cropWidth = width
    if (left < 0) {
      cropWidth = width + left
    } else if (width + left > imageWidth) {
      cropWidth = imageHeight - cropLeft
    }

    let cropHeight = height
    if (top < 0) {
      cropHeight = height + top
    } else if (height + cropTop > imageHeight) {
      cropHeight = imageHeight - cropTop
    }
    cropHeight = Math.min(cropHeight, imageHeight)
    cropWidth = Math.min(cropWidth, imageWidth)

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

  private compositeWithBg = async ({
    width,
    height,
    left,
    top,
  }: CropParams) => {
    const cropData = await this.data.toBuffer()
    const bg = Sharp(
      await Sharp(await Sharp(cropData).resize(10, 10).toBuffer())
        .resize(width, height)
        .toBuffer(),
    )
    this.data = Sharp(
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

  /**
   * Rotate the image by angle
   * @param angle to rotate the image by. Multiplier of 90 required.
   * @return A Image instance that can be used to chain operations
   */
  public rotate = async (angle: number) => {
    if (angle % 90 !== 0) {
      throw new Error('Angle is not multiplier of 90')
    }
    const areDimensionSwapped = angle % 90 === 0 && angle % 180 !== 0
    if (areDimensionSwapped) {
      await this.swapDimensions()
    }
    this.data = this.data.rotate(angle)
    return this
  }

  /**
   * Crop image and put on blurred background if out of bounds
   * @param cropParams - Crop parameters
   */
  public crop = async (cropParams: CropParams): Promise<Image> => {
    const { withBG, ...rest } = await this.calculateCropData(cropParams)
    this.data = this.data.extract(rest)

    if (withBG) {
      await this.compositeWithBg(cropParams)
    }
    return this
  }

  /**
   * Resize image and keeping the aspect ratio
   * @param width - width of the desired result
   */
  public resize = (width: number): Image => {
    this.data = this.data.resize(width, null, {
      withoutEnlargement: false,
      fit: 'cover',
    })
    return this
  }

  /**
   * This needs to be run to correctly crop the image.
   * https://magnushoff.com/articles/jpeg-orientation/
   */
  public correctRotation = async (): Promise<Image> => {
    const orientation = (await this.getMetadata()).orientation

    if (orientation === 6) {
      this.data = Sharp(await (await this.rotate(90)).toBuffer())
    }

    if (orientation === 8) {
      this.data = Sharp(await (await this.rotate(-90)).toBuffer())
    }

    if (orientation === 3) {
      this.data = Sharp(await (await this.rotate(180)).toBuffer())
    }
    return this
  }

  /**
   * Resize image to multiple widths and keeping the aspect ratio
   * @param widths - widths of the desired results
   * @param fn -
   * @returns Array of the Buffers
   */
  public resizeTo = async (
    widths: number[],
    fn: (buffer: Buffer, width: number) => Promise<void>,
  ): Promise<void> => {
    await Promise.all(
      widths.map((width) =>
        this.data
          .resize(width, null, {
            withoutEnlargement: false,
            fit: 'cover',
          })
          .webp()
          .toBuffer()
          .then((buffer) => fn(buffer, width)),
      ),
    )
  }

  /**
   * Extract image data as webp Buffer
   * @returns Image data
   */
  public toBuffer = async (): Promise<Buffer> => {
    return this.data.webp().toBuffer()
  }
}
