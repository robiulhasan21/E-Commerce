import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from './ShopContext'
import Title from './Title';
import ProductItem from '../components/ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestproducts,setLatesProducts] = useState([]);

    useEffect(()=> {
        setLatesProducts(products.slice(0,10))
    },[products])

    console.log(products);

  return (
    <div className='my-10'>
        <div className='py-8 text-center'>
            {/* Start of the new change to match the image */}
            <div className='w-3/4 py-4 mx-auto rounded-full bg-blue-950 md:w-1/2 lg:w-1/4'>
                <Title text1={'LATEST'} text2={'COLLECTION'} customTextColor={'text-white'} /> 
            </div>
            {/* End of the new change */}
            <p className='w-3/4 m-auto mt-4 text-xs text-gray-600 sm:text-sm md:text-base'>
            Fashion Latest Collection means new trends, unique designs, and seasonal outfits. 
            It offers modern styles, comfortable wear, and matching accessories. The best choice to highlight your personality.
            </p>
        </div> 
        
        {/* Rendering Products*/}
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
            {
                latestproducts.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
  )
}
export default LatestCollection