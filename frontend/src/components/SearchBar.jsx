import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname.includes ('collection')) {
      setVisible(true);
    }
    else {
      setVisible(false);
    }
  
  }, [location]);

  return showSearch && visible ? (
    
    <div className='border-t border-b bg-white py-4 px-4'>
      <div className='max-w-4xl mx-auto flex items-center justify-center'>
        
        {/* Search Input Field */}
        <div className='inline-flex items-center border border-gray-300
        px-5 py-2 rounded-full flex-grow mr-4'>
          
            {/* Search Icon */}
          <img className='w-4 mr-3' src={assets.search_icon} alt="Search" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 outline-none bg-inherit text-base placeholder-gray-500'
            type='text'
            placeholder='Search'/>
        </div>
        {/* Close Icon */}
        <img
          onClick={() => setShowSearch(false)}
          className='inline w-4 cursor-pointer'
          src={assets.cross_icon}
          alt="Close"/>
      </div>
    </div>
  ) : null;
};

export default SearchBar;