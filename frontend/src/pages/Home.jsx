import React from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../context/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets' 

const Home = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
        <Hero/>

        <div className="px-4 my-10 text-center">
          <h2 className="text-2xl font-bold">🛍️ LATEST COLLECTION</h2>
          <p className="max-w-3xl mx-auto mt-4 text-gray-700">
            Fashion Latest Collection means new trends, unique designs, and seasonal outfits. It offers modern styles, comfortable wear, and matching accessories. The best choice to highlight your personality.

          </p>
        </div>
        
        <div className="relative w-full my-10">
        <video 
          src={assets.latestcollection_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[500px]"
        />

        {/* Overlay with SHOP NOW */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* <h1 className="px-4 mb-4 text-3xl font-bold text-center text-white md:text-4xl drop-shadow-lg">
            Latest Collection!
          </h1> */}

          <button 
            onClick={handleShopNow}
            className="px-6 py-3 font-semibold text-white transition-transform transform rounded-md bg-blue-950 hover:bg-black hover:scale-110 active:scale-95"
          >
            SHOP NOW
          </button>
        </div>
      </div>

        <LatestCollection/>
        <BestSeller/>

        <div className="px-4 my-10 text-center">
          <h2 className="text-2xl font-bold">🛍️BEST SELLERS</h2>
          <p className="max-w-3xl mx-auto mt-4 text-gray-700">
            Best Sale means the biggest discounts and exciting offers. Here you’ll find the most popular products at the lowest prices. 
            This limited-time offer gives customers the best shopping experience with great savings.
          </p>
        </div>

        <div className="relative w-full my-10">
        <video 
          src={assets.bestsellers_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[500px]"
        />

        {/* Overlay with SHOP NOW */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* <h1 className="px-4 mb-4 text-3xl font-bold text-center text-white md:text-4xl drop-shadow-lg">
            Special Offer!
          </h1> */}

          <button 
            onClick={handleShopNow}
            className="px-6 py-3 font-semibold text-white transition-transform transform rounded-md bg-blue-950 hover:bg-black hover:scale-110 active:scale-95"
          >
            SHOP NOW
          </button>
        </div>
      </div>


        <OurPolicy/>
        <NewsletterBox/>
    </div>
  )
}

export default Home
