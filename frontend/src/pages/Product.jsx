import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef(null);

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 50, y: 50 });
  };

  return productData ? (
    <div className='border-t-2 pt-2 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
<div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
  <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
    {productData.image.map((item, index) => (
      <div key={index} className='overflow-hidden rounded-lg sm:mb-3 w-[24%] sm:w-full flex-shrink-0'>
        <img 
          onClick={() => setImage(item)}
          src={item} 
          className='w-full h-auto hover:scale-125 transition-transform duration-300 ease-in-out cursor-zoom-in' 
          alt={`product-${index}`} 
        />
      </div>
    ))}
  </div>

  {/* Main Image Container */}
  <div 
    ref={imageContainerRef}
    className='w-full sm:w-[80%] overflow-hidden rounded-lg relative cursor-zoom-in'
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
  >
    {/* --- SOLD OUT BADGE --- */}
    {productData.quantity === 0 && (
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="bg-black bg-opacity-60 text-white px-6 py-2 rounded-md font-bold text-xs tracking-widest border-2 border-white">
          SOLD OUT
        </div>
      </div>
    )}
    
    <img 
      className={`w-full h-auto transition-transform duration-200 ease-out ${productData.quantity === 0 ? 'grayscale-[0.5]' : ''}`} 
      src={image} 
      alt="main-product"
      style={{
        transform: isHovering && productData.quantity > 0 // Zoom only if in stock
          ? `scale(2) translate(${(50 - mousePosition.x) * 0.5}%, ${(50 - mousePosition.y) * 0.5}%)`
          : 'scale(1) translate(0%, 0%)',
        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
      }}
    />
    </div>            
  </div>
        
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='text-2xl font-medium mt-2'>{productData.name}</h1>

          {/* ⭐ Rating */}
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" /> 
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>

          {/* 💲 Price */}
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>

          {/* 📦 Stock Status */}
          <p className={`mt-2 font-semibold ${productData.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {productData.quantity > 0 ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Description */}
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {/* Sizes */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-blue-100 ${item === size ? 'border-red-600' : ''}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(productData._id, size)}
            disabled={productData.quantity === 0}  // ✅ Disabled if out of stock
            className={`px-8 py-3 text-sm ${productData.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white active:bg-blue-950'}`}
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5'/>

          {/* Extra Info */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-3 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'> Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. 
          It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct 
          transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, 
          accessibility, and the global reach they offer.</p>
          <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available 
          variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} />
    </div>
  ) : <div className='opacity-0'></div>
};

export default Product;
