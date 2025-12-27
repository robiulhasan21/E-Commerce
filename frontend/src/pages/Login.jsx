import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [loadingForgot, setLoadingForgot] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [loadingReset, setLoadingReset] = useState(false)

  const clearForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Frontend validation
    if (currentState === 'Sign Up') {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields!");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
    } else {
      if (!email || !password) {
        toast.error("Please fill in all fields!");
        return;
      }
    }

    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success("Registration Successful!")
          clearForm()
          navigate('/')
        } else {
          toast.error(response.data.message)
        }

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success("Login Successful!")
          clearForm()
          navigate('/')
        } else {
          toast.error(response.data.message)
        }
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' :
        <input onChange={(e) => setName(e.target.value)} value={name} className='border border-blue-200 rounded py-2 px-3 w-full' type="text" placeholder='Name' />
      }

      <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-blue-200 rounded py-2 px-3 w-full' type="email" placeholder='Email Address' />
      <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-blue-200 rounded py-2 px-3 w-full' type="password" placeholder='Password' />

      {currentState === 'Sign Up' &&
        <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='border border-blue-200 rounded py-2 px-3 w-full' type="password" placeholder='Confirm Password' />
      }

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <button type='button' onClick={() => setForgotMode(prev => !prev)} className='text-left text-blue-700 underline'>Forgot your password?</button>
        {currentState === 'Login' ?
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p> :
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>

      {forgotMode && (
        <form onSubmit={handleForgotSubmit} className='w-full mt-3'>
          <div className='flex gap-2'>
            <input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className='border border-blue-200 rounded py-2 px-3 flex-1' type='email' placeholder='Enter your account email' />
            <button type='submit' disabled={loadingForgot} className='bg-yellow-600 text-white rounded px-4 disabled:opacity-50'>
              {loadingForgot ? 'Sending...' : 'Send'}
            </button>
          </div>

          {showResetForm && (
            <form onSubmit={handleResetSubmit} className='mt-3 space-y-2'>
              <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} className='border border-blue-200 rounded py-2 px-3 w-full' type='text' placeholder='Reset token' />
              <input value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className='border border-blue-200 rounded py-2 px-3 w-full' type='password' placeholder='New password' />
              <input value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} className='border border-blue-200 rounded py-2 px-3 w-full' type='password' placeholder='Confirm new password' />
              <div className='flex gap-2'>
                <button type='button' onClick={() => { setShowResetForm(false); setResetToken(''); }} className='bg-gray-300 text-gray-800 px-4 py-2 rounded'>Cancel</button>
                <button type='button' onClick={handleResetSubmit} disabled={loadingReset} className='bg-green-600 text-white px-4 py-2 rounded'>
                  {loadingReset ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </form>
      )}

      <button 
        className='bg-blue-950 text-white rounded py-2 px-8 mt-4 disabled:opacity-50 disabled:cursor-not-allowed' 
        disabled={loading}
      >
        {loading ? 'Processing...' : currentState}
      </button>
    </form>
  )
}

export default Login
