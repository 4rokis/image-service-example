import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ImageService } from '../lib/ImageService'
import { getQueryParams } from '../lib/params'
import { FileStorage } from '../lib/storage/FileStorage'
import { Query } from '../lib/types'
import { v4 as uuid } from 'uuid'
import queryString from 'querystring'

let image: string | null = null

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
      (file as UploadedFile).data,
      params,
      uuid(),
    )
    const url = await imageService.run()

    image = `${url}?${queryString.stringify(req.query as Query)}`
    return res.status(200).json({
      success: true,
      data: image,
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
    const storage = new FileStorage()
    const data = await storage.getObject(params.path)
    if (!data) {
      console.error('File not found')
      return res.status(500).json({
        success: false,
      })
    }
    const imageService = new ImageService(
      new FileStorage(),
      data,
      params,
      params.path,
    )
    const url = await imageService.run()

    image = `${url}?${queryString.stringify(req.query as Query)}`
    return res.status(200).json({
      success: true,
      data: image,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}

export const getImage = async (req: Request, res: Response) => {
  return res.status(image ? 200 : 404).json({
    success: true,
    data: image,
  })
}
