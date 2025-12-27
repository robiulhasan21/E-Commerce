import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, quantity }) => {
  const { currency } = useContext(ShopContext);

  // Ginagawang number para makasiguro sa comparison
  const stock = Number(quantity); 

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='relative overflow-hidden rounded-lg'>
        
        {/* ✅ SOLD OUT BADGE */}
        {stock === 0 && (
          <div className='absolute top-2 left-2 z-20'>
            <p className=' text-blue-900 text-[10px] sm:text-[12px] px-2 py-0.5 font-bold rounded shadow-md'>
              SOLD OUT
            </p>
          </div>
        )}

        <div className='overflow-hidden bg-gray-100'>
          <img 
            className={`w-full h-auto hover:scale-110 transition ease-in-out duration-300 ${stock === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`} 
            src={image[0]} 
            alt={name} 
          />
        </div>
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem;