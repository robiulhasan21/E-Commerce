import React, { useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import { assets } from '../assets/assets' 
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', text: 'Sending report...' })
    try {
      const res = await axios.post(`${backendUrl}/api/contact`, form, { timeout: 15000 })
      setStatus({ type: 'success', text: res?.data?.message || 'Report submitted' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Unable to send report'
      setStatus({ type: 'error', text: String(msg) })
    }
  }
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img}alt="contact" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>1212, Midddle Badda Link Road <br/> Dhaka,Bangladesh</p>
          <p className='text-gray-500'>
            Phone: <br/>
            +880 1319-290231 <br/>
            +880 1616-053460 <br/>
            +880 1887-522963 <br/>
            +880 1854-801837 <br/>
            Email: <br/>
            robiulhasan2k25@gmail.com <br/> 
            rehanaakterlia45@gmail.com <br/>
            kolikaniz6@gmail.com <br/>
            syedasanjida88@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-blue-900 px-8 py-4 text-sm hover:bg-blue-900 hover:text-white transition duration-500'>Explore Jobs</button>
        </div>
        {/* Report form for users to contact admin */}
      </div>

      <div className='max-w-3xl mx-auto border px-6 py-6 rounded-md'>
        <h3 className='text-2xl font-semibold mb-3 text-center'>Get In Touch</h3>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input name='name' value={form.name} onChange={handleChange} placeholder='Your name' className='p-2 border rounded' />
          <input name='email' value={form.email} onChange={handleChange} placeholder='Your email' className='p-2 border rounded' />
          <input name='subject' value={form.subject} onChange={handleChange} placeholder='Subject (optional)' className='p-2 border rounded' />
          <textarea name='message' value={form.message} onChange={handleChange} placeholder='Describe the problem' className='p-2 border rounded h-28' />
          <div className='flex items-center gap-3'>
            <button type='submit' className='px-4 py-2 bg-blue-900 text-white rounded' disabled={status?.type === 'loading'}>Send Report</button>
            {status && (
              <div className={`text-sm ${status.type === 'error' ? 'text-red-600' : status.type === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
                {status.text}
              </div>
            )}
          </div>
        </form>
      </div>
      <div className='mt-10'>
        <NewsletterBox />
      </div>
    </div>
  )
}

export default Contact