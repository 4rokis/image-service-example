import Sharp from 'sharp'
import { Storage } from '../storage/Storage'

const SIZES = [600, 800, 1200, 1600]

export const resizeImage = async (
  image: Sharp.Sharp,
  storage: Storage,
  prefix: string = '',
): Promise<void> => {
  await Promise.all(
    SIZES.map((width) => {
      return image
        .resize(width, null, {
          withoutEnlargement: false,
          fit: 'cover',
        })
        .rotate()
        .webp()
        .toBuffer()
        .then((data: Buffer) => {
          return storage.writeObject(data, `/${prefix}${width}.webp`)
        })
    }),
  )
}
