import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export const ACCEPT_TYPE = ['image/x-png', 'image/jpeg', 'image/png']
export const MAX_SIZE = 10485760
export type ImageData = {
  id: string
  name: string
  size: number
  format: string
  data: any
}

export const preventAll = (
  e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>,
) => {
  e.preventDefault()
  e.stopPropagation()
}

export const handleFile = async (file: File | null): Promise<ImageData> => {
  if (!file) {
    throw new Error('File should be defined')
  }

  let shouldFetchData = true
  if (!ACCEPT_TYPE.includes(file.type)) {
    shouldFetchData = false
  }

  if (file.size >= MAX_SIZE) {
    shouldFetchData = false
  }

  return {
    id: uuidv4(),
    data: shouldFetchData ? file : null,
    name: file.name,
    format: file.type,
    size: file.size,
  }
}

export const getUploadData = async (
  ev: React.ChangeEvent<HTMLInputElement>,
): Promise<ImageData | null> => {
  const files = ev.target.files
  if (!files) {
    return null
  }
  const file = files[0]
  return handleFile(file)
}
