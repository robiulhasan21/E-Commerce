import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useSearchParams } from 'react-router-dom';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  // Read category from URL parameters on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && ['Men', 'Women', 'Boys Kid', 'Girls Kid'].includes(categoryParam)) {
      setCategory([categoryParam]);
    }
  }, [searchParams]);

  // Toggle Category
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (Category.includes(value)) {
      setCategory([]);
    } else {
      setCategory([value]);
    }
  }

  // Toggle SubCategory
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory([]); 
    } else {
      setSubCategory([value]); 
    }
  }

  // Update SubCategory options based on selected Category
  useEffect(() => {
    let subs = [];
    if (Category.includes('Men')) {
      subs = ['Shirt','Pants','T-shirt','Panjabi','Winter'];
    } else if (Category.includes('Women')) {
      subs = ['Salwar Kameez','Kameez','Saree','Top','Skirt','Palazzo','Winter'];
    } else if (Category.includes('Boys Kid')) {
      subs = ['Kid Shirt','Kid Pants','Kid T-Shirt','Kid Panjabi','Winter'];
    }else if (Category.includes('Girls Kid')) {
      subs = ['Kid Salwar Kameez','Kid Frock','Kid Palazzo','Winter'];
    }
    setAvailableSubCategories(subs);

    setSubCategory(prev => prev.filter(item => subs.includes(item)));
  }, [Category]);

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (Category.length > 0) {
      productsCopy = productsCopy.filter(item => Category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.type));
    }

    // --- SORTING LOGIC ---
    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a,b)=>(a.price - b.price));
        break;
      case 'high-low':
        productsCopy.sort((a,b)=>(b.price - a.price));
        break;
      default:
        break;
    }
    // --- In-stock products first ---
    productsCopy.sort((a, b) => {
      const aAvailable = Number(a.quantity) > 0 ? 0 : 1;
      const bAvailable = Number(b.quantity) > 0 ? 0 : 1;
      return aAvailable - bAvailable;
    });

    setFilterProducts(productsCopy);
  }, [products, Category, subCategory, sortType, search, showSearch]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return (
    <div className='flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10'>

      {/* Filter Option */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='flex items-center gap-2 my-2 text-2xl cursor-pointer'
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""/>
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Men','Women','Boys Kid','Girls Kid'].map((cat,i)=>(
              <p className='flex gap-2' key={i}>
                <input 
                  className='w-3' 
                  type="checkbox" 
                  value={cat} 
                  onChange={toggleCategory} 
                  checked={Category.includes(cat)}
                /> {cat}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {availableSubCategories.map((sub,i)=>(
              <p className='flex gap-2' key={i}>
                <input
                  className='w-3'
                  type="checkbox"
                  value={sub}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(sub)}
                /> {sub}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between mb-4 text-base sm:text-2xl'>
          <Title text1={'ALL'} text2={'COLLECTION'} />

          {/* Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='px-2 text-sm border-2 border-gray-300'>
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                quantity={item.quantity}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection;