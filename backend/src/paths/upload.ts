import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ImageService } from '../lib/ImageService'
import { getQueryParams } from '../lib/params'
import { FileStorage } from '../lib/storage/FileStorage'
import { Query } from '../lib/types'

export const upload = async (req: Request, res: Response) => {
  try {
    const params = getQueryParams(req.query as Query)
    if (!params) {
      console.error('Params check failed')
      return res.status(500).json({
        success: false,
      })
    }
    const file = req.files?.file
    if (!file) {
      console.error('File not found')
      return res.status(500).json({
        success: false,
      })
    }
    const imageService = new ImageService(
      new FileStorage(),
      file as UploadedFile,
      params,
    )
    await imageService.run()

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
