import React, { HTMLAttributes } from 'react'
import NextImage from 'next/image'

import { getS3SrcSet } from './utils'

type Props = HTMLAttributes<HTMLImageElement> & {
  src: string
  blur?: boolean
  sizes: string
  cb?: number
  className?: string
}

export const Image: React.FC<Props> = ({
  className,
  src,
  blur = true,
  sizes,
  children,
  ...rest
}) => {
  return (
    <img
      className="h-full w-full object-cover"
      {...rest}
      alt=""
      src={src}
      sizes={sizes}
      srcSet={getS3SrcSet(src)}
      placeholder={'empty'}
    />
  )
}
Image.displayName = 'Image'
