import React, { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import queryString from 'query-string'
import {
  PlusIcon,
  MinusIcon,
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/20/solid'

import { CropParams } from '@/types'

export type Crop = {
  x: number
  y: number
  width: number
  height: number
}

export const MIN_ZOOM = 0.6
export const MAX_ZOOM = 3

export const ROTATE_ANGLE = 90
export const ZOOM_STEP = 0.1

type Props = {
  aspect: number
  image: string
  onSave(path: string, params: CropParams): void
}

export const ImageCrop: React.FC<Props> = ({ image, aspect, onSave }) => {
  const [imageUrl, urlParams] = image.split('?')
  const croppedAreaPixels = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [params, setParams] = useState({
    x: 0,
    y: 0,
    zoom: 1,
    rotate: 0,
  })

  const onCropComplete = useCallback(
    async (_: any, crop: Crop) => {
      croppedAreaPixels.current = crop
    },
    [image],
  )

  React.useEffect(() => {
    const {
      rotate = 0,
      zoom = 1,
      x = 0,
      y = 0,
    } = queryString.parse(urlParams) || {}
    setParams({
      x: Number(x),
      y: Number(y),
      zoom: Number(zoom),
      rotate: Number(rotate),
    })
  }, [image])

  const onCrop = useCallback(async () => {
    if (!croppedAreaPixels.current) {
      throw new Error('Crop data should be present')
    }
    const path = new URL(imageUrl).pathname
    const { x, y, width, height } = croppedAreaPixels.current
    const { x: cropX, y: cropY } = params
    onSave(path, {
      rotate: rotate,
      zoom: zoom,
      left: x,
      top: y,
      x: cropX,
      y: cropY,
      width,
      height,
    })
  }, [onSave, imageUrl, params])

  const rotateRight = () => {
    setParams(({ rotate, ...rest }) => ({
      ...rest,
      rotate: rotate + ROTATE_ANGLE,
    }))
  }

  const rotateLeft = () => {
    setParams(({ rotate, ...rest }) => ({
      ...rest,
      rotate: rotate - ROTATE_ANGLE,
    }))
  }

  const zoomOut = () => {
    setParams(({ zoom, ...rest }) => ({
      ...rest,
      zoom: Math.max(zoom - ZOOM_STEP, MIN_ZOOM),
    }))
  }

  const zoomIn = () => {
    setParams(({ zoom, ...rest }) => ({
      ...rest,
      zoom: Math.min(zoom + ZOOM_STEP, MAX_ZOOM),
    }))
  }

  const setZoom = (newZoom: number) => {
    setParams(({ ...rest }) => ({
      ...rest,
      zoom: newZoom,
    }))
  }

  const setCrop = ({ x: newX, y: newY }: { x: number; y: number }) => {
    setParams(({ ...rest }) => ({
      ...rest,
      x: newX,
      y: newY,
    }))
  }

  const { zoom, rotate, ...crop } = params

  return (
    <div className="relative flex h-full w-full">
      <div className="relative h-full w-full flex-none">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          objectFit="horizontal-cover"
          rotation={rotate}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          aspect={aspect}
          restrictPosition={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="absolute bottom-5 left-1/2 flex w-full max-w-xs -translate-x-1/2 justify-between px-4">
        <button
          type="button"
          onClick={zoomOut}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <MinusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={rotateLeft}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="submit"
          onClick={onCrop}
          className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Crop
        </button>
        <button
          type="button"
          onClick={rotateRight}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowUturnRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
