import { CheckCircle, RefreshCw, XCircle } from 'lucide-react'

interface FormMessageProps {
  type: 'success' | 'error' | 'loading'
  title: string
  message: string
  onRetry?: () => void
  onReset?: () => void
}

export default function FormMessage({ type, title, message, onRetry, onReset }: FormMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-12 w-12 text-green-500' />
      case 'error':
        return <XCircle className='h-12 w-12 text-red-500' />
      case 'loading':
        return <RefreshCw className='h-12 w-12 text-orange-500 animate-spin' />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'loading':
        return 'bg-orange-50 border-orange-200'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-900'
      case 'error':
        return 'text-red-900'
      case 'loading':
        return 'text-orange-900'
    }
  }

  return (
    <div className={`rounded-xl border p-8 text-center ${getBgColor()}`}>
      <div className='flex justify-center mb-4'>{getIcon()}</div>

      <h3 className={`text-xl font-bold mb-2 ${getTextColor()}`}>{title}</h3>

      <p className={`mb-6 ${getTextColor()} opacity-80`}>{message}</p>

      {type === 'error' && (onRetry || onReset) && (
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          {onRetry && (
            <button
              onClick={onRetry}
              className='inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors'
            >
              <RefreshCw className='h-4 w-4' />
              Try Again
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className='inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors'
            >
              Start Over
            </button>
          )}
        </div>
      )}

      {type === 'success' && onReset && (
        <button
          onClick={onReset}
          className='inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors'
        >
          Send Another Message
        </button>
      )}
    </div>
  )
}
