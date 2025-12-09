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
        <p className='cursor-pointer'>Forget your password?</p>
        {currentState === 'Login' ?
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p> :
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>

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
