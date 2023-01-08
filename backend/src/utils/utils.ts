export const getFileName = (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]
  return filename.split('.')[0]
}
