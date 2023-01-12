import React from 'react'

import { Image } from '@/components/Image'

type Props = {
  sizes: string
  src: string
}

export const Preview: React.FC<Props> = ({
  src,
  sizes,
}) => {
  return (
    <div className='w-full max-w-4xl relative'>
      <div className='aspect-square'>
        <Image
          src={src}
          sizes={sizes}
          data-testid="imagePreviewImage"
        />
      </div>
    </div>
  )
}
Preview.displayName = 'Preview'