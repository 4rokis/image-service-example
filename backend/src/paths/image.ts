import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ImageService, ImageData } from '../lib/ImageService'
import { getQueryParams } from '../lib/params'
import { Query } from '../lib/types'
import { v4 as uuid } from 'uuid'
import { AWSStorage } from '../lib/storage/AwsStorage'

let data: ImageData | null = null

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
      new AWSStorage(),
      (file as UploadedFile).data,
      params,
      uuid(),
    )
    data = await imageService.run()

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const params = getQueryParams(req.query as Query)
    if (!params) {
      console.error('Params check failed')
      return res.status(500).json({
        success: false,
      })
    }
    if (!params.path) {
      console.error('Params path is not defined')
      return res.status(500).json({
        success: false,
      })
    }
    const storage = new AWSStorage()
    const imageData = await storage.getObject(params.path)
    if (!imageData) {
      console.error('File not found')
      return res.status(500).json({
        success: false,
      })
    }
    const imageService = new ImageService(
      storage,
      imageData as Buffer,
      params,
      params.path,
    )
    data = await imageService.run()

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}

export const getImage = async (req: Request, res: Response) => {
  return res.status(data ? 200 : 404).json({
    success: true,
    data,
  })
}
