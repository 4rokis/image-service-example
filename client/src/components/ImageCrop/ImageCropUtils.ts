import { v4 as uuidv4 } from 'uuid'

export type Crop = {
  x: number
  y: number
  width: number
  height: number
}

export const MIN_ZOOM = 0.6
export const MAX_ZOOM = 3

export const ROTATE_ANGLE = 90
export const ZOOM_STEP = 0.1

export const getRadianAngle = (degreeValue: number) => {
  return (degreeValue * Math.PI) / 180
}

export const getImageBlobUrl = async (src: string) => {
  try {
    const response = await fetch(`${src}?cb=${uuidv4()}`)
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (e: any) {
    throw new Error(e)
  }
}
