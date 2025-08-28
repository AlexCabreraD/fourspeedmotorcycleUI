'use client'

import { AlertCircle, ChevronRight, Clock, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import FormMessage from '@/components/ui/FormMessage'
import { useContactForm } from '@/hooks/useContactForm'

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0)
  const {
    data: formData,
    errors,
    isSubmitting,
    isSubmitted,
    submitError,
    updateField,
    validateFieldOnBlur,
    submitForm,
    resetForm,
    isFormValid,
  } = useContactForm()

  // Optimized parallax scroll tracking with throttling
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitForm()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(e.target.name as keyof typeof formData, e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateFieldOnBlur(e.target.name as keyof typeof formData)
  }

  return (
    <div className='min-h-screen bg-black overflow-x-hidden'>
      {/* CINEMATIC HERO CONTACT */}
      <div className='relative h-screen overflow-hidden'>
        {/* Background Image with Parallax */}
        <div
          className='absolute inset-0'
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src='/images/assets/contact-hero-desert-motocross.JPG'
            alt='Connect With Us'
            fill
            className='object-cover scale-110'
            sizes='100vw'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent'></div>
        </div>

        {/* Hero Content */}
        <div className='relative h-full flex items-center'>
          <div className='max-w-7xl mx-auto px-8 lg:px-16 w-full'>
            <div className='max-w-4xl'>
              {/* Badge */}
              <div className='inline-block px-6 py-3 bg-orange-500 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full mb-8'>
                Get In Touch
              </div>

              {/* Epic Typography */}
              <h1 className='text-6xl md:text-8xl lg:text-9xl font-display font-black text-white mb-8 leading-[0.9]'>
                Ride
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600'>
                  Together
                </span>
              </h1>

              <p className='text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl'>
                Questions about parts? Need expert advice? Ready to build your dream ride? We're
                here to help every step of the way.
              </p>

              {/* Quick Contact */}
              <div className='flex flex-col sm:flex-row gap-6'>
                <a
                  href='mailto:support@4speedmotorcycle.com'
                  className='group relative overflow-hidden bg-orange-500 text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-2xl'
                >
                  <span className='relative z-10 flex items-center'>
                    <Mail className='mr-3 h-6 w-6' />
                    Email Us
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </a>

                <a
                  href='tel:+1-800-MOTO-PARTS'
                  className='group border-2 border-white text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 hover:bg-white hover:text-steel-900'
                >
                  <Phone className='inline mr-3 h-6 w-6' />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center'>
          <div className='w-8 h-14 border-2 border-white/40 rounded-full flex justify-center mb-3'>
            <div className='w-1 h-4 bg-orange-500 rounded-full mt-3 animate-bounce'></div>
          </div>
          <div className='text-white/60 text-xs font-medium'>SCROLL</div>
        </div>
      </div>

      {/* CONTACT DETAILS SECTION */}
      <div className='relative py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-8 lg:px-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* Contact Information */}
            <div>
              <div className='inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider mb-8'>
                Contact Information
              </div>

              <h2 className='text-5xl lg:text-6xl font-display font-black text-steel-900 mb-8 leading-tight'>
                Let's Talk
                <span className='block text-orange-600'>Motorcycles</span>
              </h2>

              <p className='text-xl text-steel-600 leading-relaxed mb-12'>
                Whether you're building your first bike or upgrading a classic, our expert team is
                here to guide you to the perfect parts for your ride.
              </p>

              {/* Contact Details */}
              <div className='space-y-8'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center'>
                    <Mail className='h-6 w-6 text-white' />
                  </div>
                  <div className='ml-6'>
                    <h3 className='text-lg font-bold text-steel-900 mb-2'>Email Support</h3>
                    <a
                      href='mailto:support@4speedmotorcycle.com'
                      className='text-orange-600 hover:text-orange-700 font-semibold text-lg transition-colors'
                    >
                      support@4speedmotorcycle.com
                    </a>
                    <p className='text-steel-600 mt-1'>
                      Get expert advice on parts and installation
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center'>
                    <Phone className='h-6 w-6 text-white' />
                  </div>
                  <div className='ml-6'>
                    <h3 className='text-lg font-bold text-steel-900 mb-2'>Phone Support</h3>
                    <a
                      href='tel:+1-800-MOTO-PARTS'
                      className='text-orange-600 hover:text-orange-700 font-semibold text-lg transition-colors'
                    >
                      1-800-MOTO-PARTS
                    </a>
                    <p className='text-steel-600 mt-1'>
                      Speak directly with our motorcycle experts
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center'>
                    <Clock className='h-6 w-6 text-white' />
                  </div>
                  <div className='ml-6'>
                    <h3 className='text-lg font-bold text-steel-900 mb-2'>Support Hours</h3>
                    <div className='text-steel-700'>
                      <p className='font-semibold'>Monday - Friday: 8:00 AM - 6:00 PM PST</p>
                      <p className='font-semibold'>Saturday: 9:00 AM - 4:00 PM PST</p>
                      <p className='text-steel-600'>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='bg-steel-50 rounded-3xl p-12'>
              <h3 className='text-3xl font-display font-bold text-steel-900 mb-8'>
                Send us a Message
              </h3>

              {/* Show success/error message */}
              {isSubmitted && (
                <FormMessage
                  type='success'
                  title='Message Sent!'
                  message="Thank you for contacting us. We'll get back to you within 24 hours."
                  onReset={resetForm}
                />
              )}

              {submitError && (
                <FormMessage
                  type='error'
                  title='Sending Failed'
                  message={submitError}
                  onRetry={submitForm}
                  onReset={resetForm}
                />
              )}

              {isSubmitting && (
                <FormMessage
                  type='loading'
                  title='Sending Message...'
                  message='Please wait while we send your message.'
                />
              )}

              {!isSubmitted && !isSubmitting && (
                <form onSubmit={handleSubmit} className='space-y-6' noValidate>
                  <div>
                    <label htmlFor='name' className='block text-steel-700 font-semibold mb-3'>
                      Your Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-6 py-4 bg-white border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-steel-200'
                      }`}
                      placeholder='Enter your full name'
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && (
                      <div id='name-error' className='mt-2 flex items-center text-red-600 text-sm'>
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor='email' className='block text-steel-700 font-semibold mb-3'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-6 py-4 bg-white border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-steel-200'
                      }`}
                      placeholder='your.email@example.com'
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && (
                      <div id='email-error' className='mt-2 flex items-center text-red-600 text-sm'>
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor='subject' className='block text-steel-700 font-semibold mb-3'>
                      Subject *
                    </label>
                    <input
                      type='text'
                      id='subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-6 py-4 bg-white border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                        errors.subject ? 'border-red-500' : 'border-steel-200'
                      }`}
                      placeholder='What can we help you with?'
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      aria-invalid={errors.subject ? 'true' : 'false'}
                    />
                    {errors.subject && (
                      <div
                        id='subject-error'
                        className='mt-2 flex items-center text-red-600 text-sm'
                      >
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {errors.subject}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor='message' className='block text-steel-700 font-semibold mb-3'>
                      Message *
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-6 py-4 bg-white border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none ${
                        errors.message ? 'border-red-500' : 'border-steel-200'
                      }`}
                      placeholder='Tell us about your project, the parts you need, or any questions you have...'
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      aria-invalid={errors.message ? 'true' : 'false'}
                    />
                    {errors.message && (
                      <div
                        id='message-error'
                        className='mt-2 flex items-center text-red-600 text-sm'
                      >
                        <AlertCircle className='h-4 w-4 mr-1' />
                        {errors.message}
                      </div>
                    )}
                    <div className='mt-2 text-steel-500 text-sm'>
                      {formData.message.length}/2000 characters
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={!isFormValid || isSubmitting}
                    className={`group w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                      isFormValid && !isSubmitting
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-steel-300 text-steel-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <ChevronRight className='ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300' />
                    )}
                  </button>

                  {Object.values(formData).some((value) => value.trim().length > 0) && (
                    <p className='text-steel-500 text-sm text-center'>
                      💾 Your message is automatically saved as you type
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK HELP SECTION */}
      <div className='relative py-24 bg-steel-900'>
        <div className='max-w-7xl mx-auto px-8 lg:px-16'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl lg:text-6xl font-display font-black text-white mb-6'>
              Need Help
              <span className='block text-orange-500'>Right Now?</span>
            </h2>
            <p className='text-xl text-steel-300 max-w-3xl mx-auto'>
              Browse our most popular resources or jump straight into shopping.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Link
              href='/categories'
              className='group bg-steel-800 rounded-2xl p-8 hover:bg-steel-700 transition-all duration-300 transform hover:-translate-y-2'
            >
              <div className='text-orange-500 text-5xl font-bold mb-4'>01</div>
              <h3 className='text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors'>
                Browse Categories
              </h3>
              <p className='text-steel-300 leading-relaxed'>
                Explore our full range of motorcycle parts and accessories organized by category.
              </p>
            </Link>

            <Link
              href='/products'
              className='group bg-steel-800 rounded-2xl p-8 hover:bg-steel-700 transition-all duration-300 transform hover:-translate-y-2'
            >
              <div className='text-orange-500 text-5xl font-bold mb-4'>02</div>
              <h3 className='text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors'>
                Shop All Products
              </h3>
              <p className='text-steel-300 leading-relaxed'>
                Search through our complete inventory with advanced filtering and sorting options.
              </p>
            </Link>

            <div className='group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-2'>
              <div className='text-white text-5xl font-bold mb-4'>03</div>
              <h3 className='text-2xl font-bold text-white mb-4'>Expert Support</h3>
              <p className='text-white/90 leading-relaxed'>
                Get personalized recommendations from our motorcycle specialists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
