import { IMAGES_SIZES } from '@/constants'

const IMAGE_BASE_URL = 'http://localhost:8080/'

export const parseFileName = (path: string) => {
  const pathParts = path.split('/')
  const filename = pathParts[pathParts.length - 1]
  return filename.split('.')
}

export const myLoader = ({ src, width }: any) => {
  if (!src) {
    return ''
  }
  const [name, end] = parseFileName(src)
  return `${IMAGE_BASE_URL}/${name}-${width}.${end}`
}

export const getSrcSet = (image: string) => {
  return IMAGES_SIZES.map((size) => {
    return `${myLoader({ src: image, width: size })} ${size}w`
  }).join(', ')
}
