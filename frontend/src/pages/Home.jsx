import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../context/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import ChatWidget from '../components/ChatWidget'
import WhatsAppButton from '../components/WhatsAppButton'
import { assets } from '../assets/assets' 
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Home = () => {
  const navigate = useNavigate();

  const [latestVideo, setLatestVideo] = useState(null)
  const [bestsellersVideo, setBestsellersVideo] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/hero-images`)
        console.debug('GET /api/hero-images response (Home):', res?.data)
        if (res.data.success && res.data.images) {
          setLatestVideo(res.data.images.latestcollection_video || null)
          setBestsellersVideo(res.data.images.bestsellers_video || null)
        }
      } catch (err) {
        // Silent fail - fallback to bundled assets
        console.error('Could not fetch hero videos', err)
      }
    }

    fetchVideos()
  }, [])

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
          src={latestVideo || assets.latestcollection_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[700px]"
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
          src={bestsellersVideo || assets.bestsellers_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[700px]"
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
        <ChatWidget />
        <WhatsAppButton />
    </div>
  )
}

export default Home
