import { useState, useCallback } from 'react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ValidationErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface FormState {
  data: ContactFormData
  errors: ValidationErrors
  isSubmitting: boolean
  isSubmitted: boolean
  submitError: string | null
}

export function useContactForm() {
  const [state, setState] = useState<FormState>({
    data: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
    submitError: null
  })

  // Load saved form data on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('contact-form-draft')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setState(prev => ({ ...prev, data: parsed }))
        } catch (error) {
          console.warn('Failed to parse saved form data')
        }
      }
    }
  })

  const validateField = useCallback((name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 100) return 'Name must be less than 100 characters'
        return undefined

      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined

      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 5) return 'Subject must be at least 5 characters'
        if (value.trim().length > 200) return 'Subject must be less than 200 characters'
        return undefined

      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        if (value.trim().length > 2000) return 'Message must be less than 2000 characters'
        return undefined

      default:
        return undefined
    }
  }, [])

  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    Object.entries(state.data).forEach(([key, value]) => {
      const error = validateField(key as keyof ContactFormData, value)
      if (error) {
        errors[key as keyof ContactFormData] = error
      }
    })

    return errors
  }, [state.data, validateField])

  const updateField = useCallback((name: keyof ContactFormData, value: string) => {
    setState(prev => {
      const newData = { ...prev.data, [name]: value }
      
      // Auto-save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('contact-form-draft', JSON.stringify(newData))
      }

      // Clear field error when user starts typing
      const newErrors = { ...prev.errors }
      if (newErrors[name]) {
        delete newErrors[name]
      }

      return {
        ...prev,
        data: newData,
        errors: newErrors,
        submitError: null
      }
    })
  }, [])

  const validateFieldOnBlur = useCallback((name: keyof ContactFormData) => {
    const error = validateField(name, state.data[name])
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error
      }
    }))
  }, [state.data, validateField])

  const submitForm = useCallback(async () => {
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setState(prev => ({ ...prev, errors }))
      return { success: false, errors }
    }

    setState(prev => ({ ...prev, isSubmitting: true, submitError: null }))

    try {
      // Simulate API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.')
      }

      // Clear saved draft on successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem('contact-form-draft')
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        data: { name: '', email: '', subject: '', message: '' }, // Reset form
        errors: {}
      }))

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: errorMessage
      }))
      return { success: false, error: errorMessage }
    }
  }, [state.data, validateForm])

  const resetForm = useCallback(() => {
    setState({
      data: { name: '', email: '', subject: '', message: '' },
      errors: {},
      isSubmitting: false,
      isSubmitted: false,
      submitError: null
    })
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('contact-form-draft')
    }
  }, [])

  const isFormValid = Object.keys(validateForm()).length === 0 && 
    Object.values(state.data).every(value => value.trim().length > 0)

  return {
    ...state,
    updateField,
    validateFieldOnBlur,
    submitForm,
    resetForm,
    isFormValid
  }
}