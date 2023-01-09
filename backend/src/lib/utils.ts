export const rotated0 = (width: number, height: number): [number, number] => {
  const x = width / 2
  const y = height / 2

  return rotatePointMinus90(x, y)
}
export const rotatePointMinus90 = (x: number, y: number): [number, number] => {
  return [-y + x, y - x]
}
export const isDefined = (x: any) => Boolean(x) || x === 0
export const isNumber = (x: any) =>
  isDefined(x) && (Boolean(Number(x)) || Number(x) === 0)

export const isURLExists = async (url: string) => {
  const res = await fetch(url, { method: 'HEAD' })
  return res.ok
}

export const getFileName = (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]
  return filename.split('.')[0]
}
