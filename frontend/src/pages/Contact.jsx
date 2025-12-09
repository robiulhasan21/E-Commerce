import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets' 
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
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
      </div>
      <NewsletterBox />       
    </div>
  )
}

export default Contact