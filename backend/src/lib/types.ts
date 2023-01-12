export type Params = {
  path?: string
  transform?: TransformParams
}

export type Query = Partial<{
  [key: string]: string | string[]
}>

export type TransformParams = {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}
