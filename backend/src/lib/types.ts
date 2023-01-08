export type Params = {
  dir: string
  fileName: string
  size_width: number | null
  size_height: number | null
  left: number | null
  top: number | null
  width: number | null
  height: number | null
  rotate: number
  quality: number
}

export type Query = Partial<{
  [key: string]: string | string[]
}>

export type CropParams = {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}
