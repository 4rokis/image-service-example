export const isDefined = (x: any) => Boolean(x) || x === 0
export const isNumber = (x: any) =>
  isDefined(x) && (Boolean(Number(x)) || Number(x) === 0)

export const extractFileName = (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]
  return filename.split('.')[0]
}

export const getFileName = (name: string, postfix: string) => {
  return `${name}.${postfix}`
}
