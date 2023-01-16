import React, { useId, useState } from 'react'
import { ErrorModal } from '../ErrorModal'
import { ACCEPT_TYPE, getUploadData, preventAll } from './utils'

type Props = {
  onUpload(data: File): void
}

export const FileInput: React.FC<Props> = ({ onUpload }) => {
  const id = useId()
  const onFileUpload = React.useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      preventAll(ev)
      const files = ev.target.files
      if (!files) {
        return null
      }
      const file = files[0]

      if (!file) {
        ev.target.value = null as any
        return
      }

      onUpload(file)
    },
    [onUpload, getUploadData],
  )

  return (
    <div className="relative flex h-36 w-full flex-col items-center justify-center rounded-md bg-gray-50 shadow ring-1 ring-gray-300 focus-within:border-indigo-500 focus-within:ring-indigo-500 sm:text-sm">
      <input
        id={id}
        className="absolute inset-0 cursor-pointer opacity-0"
        accept={ACCEPT_TYPE.join(',')}
        type="file"
        onChange={onFileUpload}
      />
      <div className={`text-center text-sm font-semibold text-gray-800`}>
        <label htmlFor={id}>Upload image</label>
      </div>
    </div>
  )
}
FileInput.displayName = 'FileInput'
