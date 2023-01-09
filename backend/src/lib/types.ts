export type Params = {
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

export interface Runner {
  run: () => Promise<void>
}
