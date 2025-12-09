import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../context/Title';
import ProductItem from './ProductItem';

const BestSeller = ()=>{

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <div className='my-10'>
      <div className='py-8 text-3xl text-center'>

        {/* START: BEST SELLERS box */}
        <div className='justify-center flex-grow'>
        <div className='w-3/4 py-4 mx-auto rounded-full bg-blue-950 md:w-1/2 lg:w-1/5'>
          <Title text1={'BEST'} text2={'SELLERS'} customTextColor={'text-white'} />
        </div>
      </div>


        {/* END */}
        <p className='w-3/4 m-auto mt-4 text-xs text-gray-600 sm:text-sm md:text-base'>
          Best Sale means the biggest discounts and exciting offers. 
          Here you’ll find the most popular products at the lowest prices. 
          This limited-time offer gives customers the best shopping experience with great savings.
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
        {
            bestSeller.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
        }
      </div>

      <div className="hidden">{bestSeller.length}</div>
    </div>
  )
}

export default BestSeller
