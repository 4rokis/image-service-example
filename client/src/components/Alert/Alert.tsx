import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'

type Props = {
  title?: string
  red?: boolean
  children: ReactNode
}

export const Alert: React.FC<Props> = ({ children, title, red = false }) => {
  return (
    <div
      className={`pointer-events-auto my-6 w-full overflow-hidden rounded-lg ${
        red ? 'bg-red-50' : 'bg-yellow-50'
      } ring-1 ring-black ring-opacity-5`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className={`h-6 w-6 ${red ? 'text-red-400' : 'text-yellow-400'}`}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="mb-1 text-sm font-medium text-gray-900">{title}</p>
            )}
            <div
              className={`text-sm ${title ? 'text-gray-500' : 'text-gray-900'}`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
Alert.displayName = 'Alert'
