'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  icon?: 'warning' | 'question'
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  icon = 'question',
}: ConfirmationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const iconColors = {
    warning: 'text-amber-500 bg-amber-50',
    question: 'text-blue-500 bg-blue-50',
  }

  const confirmButtonClass = confirmVariant === 'danger' ? 'btn btn-accent' : 'btn btn-primary'

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-steel-200'>
            <div className='flex items-center space-x-3'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColors[icon]}`}
              >
                <AlertTriangle className='h-5 w-5' />
              </div>
              <h3 className='text-lg font-semibold text-steel-900'>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className='p-2 text-steel-400 hover:text-steel-600 transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Content */}
          <div className='p-6'>
            <p className='text-steel-600 leading-relaxed'>{message}</p>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 p-6 border-t border-steel-200 bg-steel-50 rounded-b-2xl'>
            <button onClick={onClose} className='btn btn-outline'>
              {cancelText}
            </button>
            <button onClick={handleConfirm} className={confirmButtonClass}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
