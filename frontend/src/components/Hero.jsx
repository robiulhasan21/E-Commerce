import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroImages = [assets.hero_img, assets.hero_img1]; 
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // autoplay
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  },);

  return (
    <div className="relative h-[300px] md:h-[calc(90vh-80px)] overflow-hidden"> 
      <div className="absolute inset-0 w-full h-full bg-black opacity-10 z-[1]"></div>

      {/* Image Slider */}
      <div
        className="relative flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className="flex-shrink-0 object-cover w-full h-full"
          />
        ))}
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

      {/* Left Arrow */}
      <button 
        onClick={prevImage} 
        className="absolute z-10 p-2 text-white -translate-y-1/2 rounded-full left-3 top-1/2 
        bg-black/50 hover:bg-black"
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextImage} 
        className="absolute z-10 p-2 text-white -translate-y-1/2 rounded-full right-3 top-1/2 
        bg-black/50 hover:bg-black"
      >
        ▶
      </button>
    </div> 
  );
};

export default Hero;
