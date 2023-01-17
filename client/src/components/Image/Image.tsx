import React, { HTMLAttributes } from 'react'
import NextImage from 'next/image'

import { getSrcSet, myLoader } from './utils'

type Props = HTMLAttributes<HTMLImageElement> & {
  src: string
  sizes: string
  native: boolean
  className?: string
}

export const Image: React.FC<Props> = ({
  className,
  src,
  sizes,
  native,
  children,
  ...rest
}) => {
  if (native) {
    return (
      <img
        className="h-full w-full object-cover"
        {...rest}
        alt=""
        src={src}
        sizes={sizes}
        srcSet={getSrcSet(src)}
      />
    )
  }
  return (
    <NextImage
      {...rest}
      className="!relative"
      fill
      alt=""
      placeholder="empty"
      loader={myLoader}
      src={src}
      sizes={sizes}
    />
  )
}
Image.displayName = 'Image'
