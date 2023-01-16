import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useRef } from 'react'
import { Modal } from '../Modal'

type Props = {
  title: string
  description: string
  open: boolean
  onClose: () => void
}

export const ErrorModal: React.FC<Props> = ({
  title,
  open,
  onClose,
  description,
}) => {
  const cancelButtonRef = useRef(null)
  return (
    <Modal initialFocus={cancelButtonRef} onClose={onClose} open={open}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={onClose}
          ref={cancelButtonRef}
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
ErrorModal.displayName = 'ErrorModal'
