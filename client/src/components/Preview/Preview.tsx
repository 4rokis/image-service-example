import React from 'react'

import { Image } from '@/components/Image'

type Props = {
  sizes: string
  src: string
  native: boolean
}

export const Preview: React.FC<Props> = ({ src, sizes, native }) => {
  return (
    <div className="relative w-full max-w-4xl">
      <div className="aspect-square">
        <Image
          native={native}
          src={src}
          sizes={sizes}
          data-testid="imagePreviewImage"
        />
      </div>
    </div>
  )
}
Preview.displayName = 'Preview'
