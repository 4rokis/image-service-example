import React from 'react'

import { Image } from '@/components/Image'

type Props = {
  sizes: string
  src: string
  native?: boolean
}

export const Preview: React.FC<Props> = ({ src, sizes, native = false }) => {
  return (
    <div style={{ width: sizes }} className="relative w-full max-w-[90vw]">
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
