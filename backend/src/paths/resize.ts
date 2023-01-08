import { Request, Response } from 'express'
import sharp from 'sharp'
import { resizeImage } from '../lib/Resize'
import { FileStorage } from '../lib/storage/FileStorage'
import { getFileName } from '../utils/utils'

export const resize = async (req: Request, res: Response) => {
  try {
    const { path } = req.query
    if (typeof path !== 'string') {
      return res.status(500).json({
        success: false,
      })
    }
    const storage = new FileStorage()
    const image = sharp(await storage.getObject(path))
    await resizeImage(image, storage, `${getFileName(path)}-`)

    return res.status(200).json({
      success: true,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}
