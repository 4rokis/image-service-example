import { CropParams } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import queryString from 'query-string'

type ApiResponse =
  | {
      success: true
      data: {
        original: string
        updated: string
      }
    }
  | {
      success: false
      data: null
    }

const request = <T = ApiResponse>(
  url: string,
  method: string,
  body: any,
): Promise<T | null> => {
  return fetch(url, {
    method,
    body,
  })
    .then(async (res) => {
      if (res.status >= 400) {
        console.error(`[${res.status}] ${res.statusText}`)
        return null
      }
      return res.json()
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}

type UploadError = {
  message: string
  description: string
}

const UNEXPECTED_ERROR: UploadError = {
  message: 'Unexpected error',
  description: 'This should not happen. Please retry.',
}

const ENDPOINT = `http://localhost:8080/api/image`

export const useImage = () => {
  const [error, setError] = useState<UploadError | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [image, setImage] = useState<string | null>(null)
  const [original, setOriginal] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const response = await request(`${ENDPOINT}`, 'GET', null)
        if (response?.success) {
          setImage(response.data.updated)
          setOriginal(response.data.original)
          return
        }
        setImage(null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const uploadImage = useCallback(
    async (data: File, params: Partial<CropParams> = {}) => {
      try {
        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append('file', data)
        const response = await request(
          `${ENDPOINT}?${queryString.stringify(params)}`,
          'PUT',
          formData,
        )
        if (response?.success && response.data) {
          setImage(response.data.updated)
          setOriginal(response.data.original)
          return
        }
        setImage(null)
        setError(UNEXPECTED_ERROR)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setImage],
  )

  const editUploadedImage = useCallback(
    async (path: string, params: CropParams) => {
      try {
        setLoading(true)
        setError(null)
        const response = await request(
          `${ENDPOINT}?${queryString.stringify({ path, ...params })}`,
          'POST',
          null,
        )
        if (response?.success && response.data) {
          setImage(response.data.updated)
          setOriginal(response.data.original)
          return
        }
        setImage(null)
        setError(UNEXPECTED_ERROR)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setImage],
  )

  return {
    image,
    original,
    loading,
    error,
    editUploadedImage,
    uploadImage,
  }
}
