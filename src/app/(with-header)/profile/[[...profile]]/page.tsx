'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import {
  Calendar,
  Edit3,
  Heart,
  Key,
  LogOut,
  Mail,
  Package,
  Phone,
  Settings,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('account')
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingCommunications: true,
  })
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.primaryPhoneNumber?.phoneNumber || '',
      })

      // Load preferences from Clerk metadata
      const metadata = user.unsafeMetadata as any
      setPreferences({
        emailNotifications: metadata?.preferences?.emailNotifications ?? true,
        smsNotifications: metadata?.preferences?.smsNotifications ?? false,
        marketingCommunications: metadata?.preferences?.marketingCommunications ?? true,
      })
    }
  }, [user])

  // Helper function to get display name
  const getDisplayName = (field: 'firstName' | 'lastName') => {
    if (field === 'firstName') {
      return user?.firstName || 'Not provided'
    }
    return user?.lastName || 'Not provided'
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
      </div>
    )
  }

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    if (!user) {
      return
    }

    setIsUpdating(true)
    try {
      // Update user's firstName and lastName using Clerk's standard fields
      const updates: any = {}

      if (formData.firstName !== user.firstName) {
        updates.firstName = formData.firstName
      }
      if (formData.lastName !== user.lastName) {
        updates.lastName = formData.lastName
      }

      if (Object.keys(updates).length > 0) {
        console.log('Updating with:', updates)
        await user.update(updates)
      }

      // Update phone number separately if provided
      if (formData.phoneNumber && formData.phoneNumber !== user.primaryPhoneNumber?.phoneNumber) {
        // Check if user already has a phone number
        if (user.primaryPhoneNumber) {
          await user.primaryPhoneNumber.update({ phoneNumber: formData.phoneNumber })
        } else {
          await user.createPhoneNumber({ phoneNumber: formData.phoneNumber })
        }
      }

      setIsEditing(false)
      setShowSuccessMessage('Profile updated successfully!')
      setTimeout(() => setShowSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      setShowSuccessMessage('Failed to update profile. Please try again.')
      setTimeout(() => setShowSuccessMessage(''), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber || '',
    })
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = async (key: string) => {
    if (!user) {
      return
    }

    setIsLoadingPreferences(true)
    try {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key as keyof typeof preferences],
      }

      // Update Clerk metadata using unsafeMetadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: newPreferences,
        },
      })

      setPreferences(newPreferences)
      setShowSuccessMessage('Preferences updated successfully!')
      setTimeout(() => setShowSuccessMessage(''), 2000)
    } catch (error) {
      console.error('Failed to update preferences:', error)
      setShowSuccessMessage('Failed to update preferences. Please try again.')
      setTimeout(() => setShowSuccessMessage(''), 3000)
    } finally {
      setIsLoadingPreferences(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user) {
      return
    }

    setPasswordError('')

    // Validate form
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError('All fields are required')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long')
      return
    }

    setIsChangingPassword(true)
    try {
      // Use Clerk's updatePassword method with current password verification
      await user.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        signOutOfOtherSessions: false,
      })

      // If successful, close modal and show success
      setShowPasswordModal(false)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setShowSuccessMessage('Password changed successfully!')
      setTimeout(() => setShowSuccessMessage(''), 3000)
    } catch (error: any) {
      console.error('Password change error:', error)
      setPasswordError(
        error.errors?.[0]?.message ||
          'Failed to change password. Please check your current password and try again.'
      )
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setPasswordError('')
  }

  const navigationItems = [
    { id: 'account', label: 'Account Details', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className='space-y-6'>
            {/* Quick Access Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <button
                onClick={() => router.push('/orders')}
                className='bg-white rounded-lg shadow-sm border border-steel-200 p-6 text-left hover:shadow-md hover:border-accent-300 transition-all group'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='flex items-center mb-2'>
                      <Package className='h-5 w-5 text-accent-600 mr-2' />
                      <h3 className='font-semibold text-steel-900'>Order History</h3>
                    </div>
                    <p className='text-sm text-steel-600'>View and track your orders</p>
                  </div>
                  <div className='text-accent-600 group-hover:translate-x-1 transition-transform'>
                    →
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/wishlist')}
                className='bg-white rounded-lg shadow-sm border border-steel-200 p-6 text-left hover:shadow-md hover:border-accent-300 transition-all group'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='flex items-center mb-2'>
                      <Heart className='h-5 w-5 text-accent-600 mr-2' />
                      <h3 className='font-semibold text-steel-900'>Wishlist</h3>
                    </div>
                    <p className='text-sm text-steel-600'>Manage your saved items</p>
                  </div>
                  <div className='text-accent-600 group-hover:translate-x-1 transition-transform'>
                    →
                  </div>
                </div>
              </button>
            </div>

            <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-6'>
              <h2 className='text-xl font-semibold text-steel-900 mb-6'>Personal Information</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-steel-700 mb-2'>
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className='w-full p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      placeholder='Enter your first name'
                    />
                  ) : (
                    <div className='p-3 bg-steel-50 rounded-lg border border-steel-200'>
                      {getDisplayName('firstName')}
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-steel-700 mb-2'>Last Name</label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className='w-full p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                      placeholder='Enter your last name'
                    />
                  ) : (
                    <div className='p-3 bg-steel-50 rounded-lg border border-steel-200'>
                      {getDisplayName('lastName')}
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-steel-700 mb-2'>
                    Email Address
                  </label>
                  <div className='p-3 bg-steel-50 rounded-lg border border-steel-200 flex items-center'>
                    <Mail className='h-4 w-4 text-steel-400 mr-2' />
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                  {isEditing && (
                    <p className='text-xs text-steel-500 mt-1'>
                      Email changes require verification
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-steel-700 mb-2'>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Phone className='h-4 w-4 text-steel-400' />
                      </div>
                      <input
                        type='tel'
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className='w-full pl-10 p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                        placeholder='Enter your phone number'
                      />
                    </div>
                  ) : (
                    <div className='p-3 bg-steel-50 rounded-lg border border-steel-200 flex items-center'>
                      <Phone className='h-4 w-4 text-steel-400 mr-2' />
                      {user.primaryPhoneNumber?.phoneNumber || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-steel-700 mb-2'>
                    Member Since
                  </label>
                  <div className='p-3 bg-steel-50 rounded-lg border border-steel-200 flex items-center'>
                    <Calendar className='h-4 w-4 text-steel-400 mr-2' />
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className='mt-6 pt-6 border-t border-steel-200 flex gap-4'>
                {!isEditing ? (
                  <button
                    onClick={handleEditProfile}
                    className='inline-flex items-center bg-accent-600 text-white px-6 py-2 rounded-lg hover:bg-accent-700 transition-colors font-medium'
                  >
                    <Edit3 className='h-4 w-4 mr-2' />
                    Edit Profile
                  </button>
                ) : (
                  <div className='flex gap-3'>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                    >
                      {isUpdating ? (
                        <>
                          <svg
                            className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className='bg-steel-500 text-white px-6 py-2 rounded-lg hover:bg-steel-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-6'>
              <h2 className='text-xl font-semibold text-steel-900 mb-6'>Account Settings</h2>

              <div className='space-y-4'>
                <div className='flex items-center justify-between py-3 border-b border-steel-200'>
                  <div>
                    <h3 className='font-medium text-steel-900'>Email Notifications</h3>
                    <p className='text-sm text-steel-600'>
                      Receive updates about your orders and promotions
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      className='sr-only peer'
                      checked={preferences.emailNotifications}
                      onChange={() => handlePreferenceChange('emailNotifications')}
                      disabled={isLoadingPreferences}
                    />
                    <div
                      className={`w-11 h-6 bg-steel-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-steel-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600 ${isLoadingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                    ></div>
                  </label>
                </div>

                <div className='flex items-center justify-between py-3 border-b border-steel-200'>
                  <div>
                    <h3 className='font-medium text-steel-900'>SMS Notifications</h3>
                    <p className='text-sm text-steel-600'>
                      Get text updates about shipping and delivery
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      className='sr-only peer'
                      checked={preferences.smsNotifications}
                      onChange={() => handlePreferenceChange('smsNotifications')}
                      disabled={isLoadingPreferences}
                    />
                    <div
                      className={`w-11 h-6 bg-steel-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-steel-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600 ${isLoadingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                    ></div>
                  </label>
                </div>

                <div className='flex items-center justify-between py-3'>
                  <div>
                    <h3 className='font-medium text-steel-900'>Marketing Communications</h3>
                    <p className='text-sm text-steel-600'>
                      Receive news about new products and special offers
                    </p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      className='sr-only peer'
                      checked={preferences.marketingCommunications}
                      onChange={() => handlePreferenceChange('marketingCommunications')}
                      disabled={isLoadingPreferences}
                    />
                    <div
                      className={`w-11 h-6 bg-steel-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-steel-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600 ${isLoadingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-6'>
              <h2 className='text-xl font-semibold text-steel-900 mb-6'>Account Actions</h2>

              <div className='space-y-4'>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className='w-full text-left p-4 border border-steel-200 rounded-lg hover:bg-steel-50 hover:border-accent-300 transition-colors group'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Key className='h-5 w-5 text-steel-400 mr-3' />
                      <div>
                        <h3 className='font-medium text-steel-900'>Change Password</h3>
                        <p className='text-sm text-steel-600'>
                          Update your account password securely
                        </p>
                      </div>
                    </div>
                    <div className='text-accent-600 group-hover:translate-x-1 transition-transform'>
                      →
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => signOut()}
                  className='w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600'
                >
                  <div className='flex items-center'>
                    <LogOut className='h-5 w-5 mr-3' />
                    <div>
                      <h3 className='font-medium'>Sign Out</h3>
                      <p className='text-sm text-red-500'>Sign out of your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-white border-b border-steel-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center'>
                <span className='text-2xl font-bold text-white'>
                  {user.firstName?.charAt(0) ||
                    user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-steel-900'>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || 'Welcome'}
                </h1>
                <p className='text-steel-600'>{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Success Message Toast */}
            {showSuccessMessage && (
              <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg animate-fade-in'>
                <div className='flex items-center'>
                  <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {showSuccessMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          {/* Sidebar Navigation */}
          <div className='lg:col-span-3'>
            <nav className='space-y-1'>
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                        activeTab === item.id
                          ? 'text-primary-500'
                          : 'text-steel-400 group-hover:text-steel-500'
                      }`}
                    />
                    <span className='truncate'>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className='mt-8 lg:mt-0 lg:col-span-9'>{renderContent()}</div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-steel-900'>Change Password</h3>
              <button
                onClick={handlePasswordModalClose}
                className='text-steel-400 hover:text-steel-600 transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='space-y-4'>
              {passwordError && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm'>
                  {passwordError}
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-steel-700 mb-2'>
                  Current Password
                </label>
                <input
                  type='password'
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  className='w-full p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500'
                  placeholder='Enter your current password'
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-steel-700 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className='w-full p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500'
                  placeholder='Enter your new password'
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-steel-700 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  className='w-full p-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500'
                  placeholder='Confirm your new password'
                  disabled={isChangingPassword}
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className='flex-1 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                >
                  {isChangingPassword ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
                <button
                  onClick={handlePasswordModalClose}
                  disabled={isChangingPassword}
                  className='flex-1 bg-steel-100 text-steel-600 px-4 py-2 rounded-lg hover:bg-steel-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
