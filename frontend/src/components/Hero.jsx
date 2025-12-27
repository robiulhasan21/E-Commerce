import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hero = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  // Fallback to static images if API fails
  const defaultHeroImages = [assets.hero_img, assets.hero_img1];
  const defaultSubheroImages = {
    subhero_img1: assets.subhero_img1 || assets.hero_img,
    subhero_img2: assets.subhero_img2 || assets.hero_img1,
    subhero_img3: assets.subhero_img3 || assets.hero_img,
    subhero_img4: assets.subhero_img4 || assets.hero_img1,
  };

  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [subheroImages, setSubheroImages] = useState(defaultSubheroImages);
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch hero images from backend
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hero-images`);
        console.debug('GET /api/hero-images response (Hero):', response?.data)
        if (response.data.success && response.data.images) {
          const images = response.data.images;
          
          // Update hero images from array (supports unlimited images)
          if (images.hero_images && Array.isArray(images.hero_images) && images.hero_images.length > 0) {
            setHeroImages(images.hero_images);
          }

          // Update subhero images
          if (images.subhero_img1 || images.subhero_img2 || images.subhero_img3 || images.subhero_img4) {
            setSubheroImages({
              subhero_img1: images.subhero_img1 || defaultSubheroImages.subhero_img1,
              subhero_img2: images.subhero_img2 || defaultSubheroImages.subhero_img2,
              subhero_img3: images.subhero_img3 || defaultSubheroImages.subhero_img3,
              subhero_img4: images.subhero_img4 || defaultSubheroImages.subhero_img4,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
        // Keep using default images if API fails
      }
    };

    fetchHeroImages();
  }, [backendUrl]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // autoplay
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
    {/* Offer banner */}
    <div className="w-full bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center px-4 py-2">
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="marquee">
            বিজয় উৎসবের উপহার! ৳১৬৫৪ শপিং করলেই ৳৫৪০ গিফট ভাউচার! আজই শপিং করুন এবং অফারটি উপভোগ করুন!
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .marquee { animation: marquee 28s linear infinite; }`} </style>
    </div>
    <div className="relative h-[300px] md:h-[calc(90vh-80px)] overflow-hidden"> 
      <div className="absolute inset-0 w-full h-full bg-black opacity-10 z-[1]">
        
      </div>

      {/* Image Slider */}
      <div
        className="relative flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {heroImages.length > 0 ? (
          heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className="flex-shrink-0 object-cover w-full h-full"
            />
          ))
        ) : (
          <img
            src={assets.hero_img}
            alt="Hero"
            className="flex-shrink-0 object-cover w-full h-full"
          />
        )}
      </div>

      {/* SHOP NOW Button */}
      <div className="absolute z-10 top-5 left-5"> 
        <Link to="/collection">
          <button className="px-5 py-2 text-sm font-semibold text-white transition bg-blue-800 
          rounded-full hover:bg-white hover:text-black">
            SHOP NOW
          </button>
        </Link>
      </div>

      {/* Left Arrow - Only show if more than 1 image */}
      {heroImages.length > 1 && (
        <button 
          onClick={prevImage} 
          className="absolute z-10 p-2 text-white -translate-y-1/2 rounded-full left-3 top-1/2 
          bg-black/50 hover:bg-black"
        >
          ◀
        </button>
      )}

      {/* Right Arrow - Only show if more than 1 image */}
      {heroImages.length > 1 && (
        <button 
          onClick={nextImage} 
          className="absolute z-10 p-2 text-white -translate-y-1/2 rounded-full right-3 top-1/2 
          bg-black/50 hover:bg-black"
        >
          ▶
        </button>
      )}
    </div>

    {/* Subhero Images Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4 bg-white">
      <Link to="/collection?category=Men" className="relative overflow-hidden rounded-lg aspect-square md:aspect-auto md:h-[300px] flex flex-col">
        <img 
          src={subheroImages.subhero_img1} 
          alt="Men Category"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <div className="text-center mt-2 text-sm font-semibold uppercase">MEN</div>
      </Link>
      <Link to="/collection?category=Women" className="relative overflow-hidden rounded-lg aspect-square md:aspect-auto md:h-[300px] flex flex-col">
        <img 
          src={subheroImages.subhero_img2} 
          alt="Women Category"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <div className="text-center mt-2 text-sm font-semibold uppercase">WOMEN</div>
      </Link>
      <Link to="/collection?category=Boys%20Kid" className="relative overflow-hidden rounded-lg aspect-square md:aspect-auto md:h-[300px] flex flex-col">
        <img 
          src={subheroImages.subhero_img3} 
          alt="Boys Kid Category"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <div className="text-center mt-2 text-sm font-semibold uppercase">BOY KID</div>
      </Link>
      <Link to="/collection?category=Girls%20Kid" className="relative overflow-hidden rounded-lg aspect-square md:aspect-auto md:h-[300px] flex flex-col">
        <img 
          src={subheroImages.subhero_img4} 
          alt="Girls Kid Category"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <div className="text-center mt-2 text-sm font-semibold uppercase">GIRL KID</div>
      </Link>
    </div>
    </> 
  );
};

export default Hero;
