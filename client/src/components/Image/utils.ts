import { IMAGES_SIZES } from "../constants"

const IMAGE_BASE_URL = 'http://localhost:8080/'

export const parseFileName = (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]
  const [name, params] = filename.split('?')
  return [path, params, ...name.split('.')]
}

export const myS3Loader = ({ src, width, height }: any) => {
  if (!src) {
    return ''
  }
  const [path, params, name, end] = parseFileName(src)
  return `${IMAGE_BASE_URL}/${name}-${width}.${end}`
}

export const getS3SrcSet = (image: string) => {
  return IMAGES_SIZES.map((size) => {
    return `${myS3Loader({ src: image, width: size })} ${size}w`
  }).join(', ')
}
