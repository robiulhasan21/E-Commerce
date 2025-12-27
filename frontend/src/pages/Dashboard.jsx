import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [passwordMode, setPasswordMode] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access your dashboard")
      navigate('/login')
      return
    }
    fetchUserProfile()
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/user/profile', {
        headers: { token }
      })
      if (response.data.success) {
        setUser(response.data.user)
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email
        })
      } else {
        toast.error(response.data.message)
        if (response.data.message.includes('login')) {
          navigate('/login')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to load profile")
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const response = await axios.put(backendUrl + '/api/user/profile', formData, {
        headers: { token }
      })
      if (response.data.success) {
        setUser(response.data.user)
        setEditMode(false)
        toast.success("Profile updated successfully!")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    }
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first')
      return
    }

    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('avatar', avatarFile)

      const response = await axios.put(backendUrl + '/api/user/profile/avatar', fd, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setUser(response.data.user)
        setAvatarFile(null)
        setAvatarPreview(null)
        toast.success('Avatar uploaded successfully')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    try {
      const response = await axios.put(
        backendUrl + '/api/user/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { token }
        }
      )
      if (response.data.success) {
        setPasswordMode(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        toast.success("Password updated successfully!")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update password")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    toast.success("Logged out successfully")
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-600'>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-600'>Failed to load user data</p>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto my-10 px-4 bg-gradient-to-br from-white via-indigo-50 to-pink-50 rounded-xl p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-900 mb-2 text-center'>My Profile</h1>
        <hr className='border-transparent h-1 bg-gradient-to-r from-indigo-200 to-pink-200 rounded' />
      </div>

      {/* Profile Information */}
      <div className='bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border-l-8 border-indigo-300'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-indigo-700'>Profile Information</h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className='bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded hover:from-indigo-700 hover:to-blue-600 transition'
            >
              Edit Profile
            </button>
          )}
        </div>

        {!editMode ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center ring-4 ring-indigo-100 shadow-sm'>
                <img
                  src={user.avatar?.url || '/default-avatar.png'}
                  alt='avatar'
                  className='w-full h-full object-cover'
                />
              </div>
              <div>
                <label className='text-sm text-indigo-600'>Name</label>
                <p className='text-lg text-gray-900 font-medium mt-1'>{user.name}</p>
              </div>
            </div>
            <div>
              <label className='text-sm text-indigo-600'>Email</label>
              <p className='text-lg text-gray-900 font-medium mt-1'>{user.email}</p>
            </div>
            <div>
              <label className='text-sm text-indigo-600'>Member Since</label>
              <p className='text-lg text-gray-900 font-medium mt-1'>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className='space-y-4'>
            <div className='flex items-start gap-4'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center ring-4 ring-indigo-100 shadow-sm'>
                <img
                  src={avatarPreview || user.avatar?.url || '/default-avatar.png'}
                  alt='avatar-preview'
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Picture</label>
                <input type='file' accept='image/*' onChange={handleAvatarSelect} />
                <div className='mt-2 flex gap-2'>
                  <button
                    type='button'
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50'
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Upload Picture'}
                  </button>
                  <button
                    type='button'
                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                    className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition'
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full border border-blue-200 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full border border-blue-200 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300'
                required
              />
            </div>
            <div className='flex gap-3'>
              <button
                type='submit'
                className='bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded hover:from-indigo-700 hover:to-blue-600 transition'
              >
                Save Changes
              </button>
              <button
                type='button'
                onClick={() => {
                  setEditMode(false)
                  setFormData({
                    name: user.name,
                    email: user.email
                  })
                }}
                className='bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Change */}
      <div className='bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border-l-8 border-blue-300'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-blue-700'>Change Password</h2>
          {!passwordMode && (
            <button
              onClick={() => setPasswordMode(true)}
              className='bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded hover:from-indigo-700 hover:to-blue-600 transition'
            >
              Change Password
            </button>
          )}
        </div>

        {passwordMode && (
          <form onSubmit={handlePasswordUpdate} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
              <input
                type='password'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className='w-full border border-blue-200 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
              <input
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='w-full border border-blue-200 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-300'
                required
                minLength={8}
              />
              <p className='text-xs text-gray-500 mt-1'>Minimum 8 characters</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
              <input
                type='password'
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='w-full border border-blue-200 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-300'
                required
                minLength={8}
              />
            </div>
            <div className='flex gap-3'>
              <button
                type='submit'
                className='bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded hover:from-indigo-700 hover:to-blue-600 transition'
              >
                Update Password
              </button>
              <button
                type='button'
                onClick={() => {
                  setPasswordMode(false)
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  })
                }}
                className='bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Button */}
      <div className='flex justify-end'>
        <button
          onClick={handleLogout}
          className='bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded hover:from-red-600 hover:to-red-500 transition'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
