import { Request, Response } from 'express'
import { ImageService } from '../lib/ImageService'
import { getQueryParams } from '../lib/params'
import { FileStorage } from '../lib/storage/FileStorage'
import { Query } from '../lib/types'

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
    console.log('file', params.path)
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

    return res.status(200).json({
      success: true,
      data: url,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}
