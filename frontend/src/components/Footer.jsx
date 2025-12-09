import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='mt-40 text-sm'>
      {/* Main Content */}
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10'>
        
        {/* Left section */}
        <div>
          <img src={assets.logo} className='w-40 mb-5' alt="" />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.<br />
            When an unknown printer took of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Middle section */}
        <div>
          <p className='mb-5 text-xl font-medium'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right section */}
        <div>
          <p className='mb-5 text-xl font-medium'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+880 1319-290231</li>
            <li>+880 1616-053460</li>
            <li>+880 1887-522963</li>
            <li>+880 1854-801837</li>
            <li>robiulhasan2k25@gmail.com</li>
            <li>rehanaakterlia45@gmail.com</li>
            <li>kolikaniz6@gmail.com</li>
            <li>syedasanjida88@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <hr className='my-4 border-gray-300' />
      <p className='text-sm text-center pb-5'>
        Copyright 2025@ stylewearbd.com - All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
