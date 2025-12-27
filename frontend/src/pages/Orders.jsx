import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, navigate, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders function
  const fetchOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.get(backendUrl + '/api/order/user', { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [token]);

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString();
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-600'>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className='border-t pt-16 min-h-[60vh]'>

      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {orders.length === 0 ? (
        <div className='text-center text-gray-600 font-medium py-10'>
          You have no orders yet.
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => (
            <div key={order._id} className='py-5 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
              
              {/* Left Side: Image and Basic Info */}
              <div className='flex items-start gap-6 text-sm'>
                <div className='flex gap-2 flex-wrap max-w-[220px]'>
                  {order.items && order.items.slice(0, 3).map((it, idx) => {
                    const displayImg = Array.isArray(it.image) ? it.image[0] : it.image;
                    return (
                      <img 
                        key={idx} 
                        className='w-16 sm:w-20 rounded border bg-gray-50' 
                        src={displayImg} 
                        alt={it.name} 
                      />
                    )
                  })}
                </div>
                <div>
                  <p className='sm:text-base font-semibold text-gray-800'>Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg font-bold text-blue-900'>{currency}{order.amount}</p>
                    <p className='text-sm bg-gray-100 px-2 py-0.5 rounded'>{order.items?.length || 0} items</p>
                  </div>
                  <p className='mt-2 text-gray-500'>Date: <span>{formatDate(order.date)}</span></p>
                  <p className='mt-1 text-xs text-gray-400 italic'>Method: {order.paymentMethod}</p>
                </div>
              </div>

              {/* Right Side: Status and Buttons */}
              <div className='md:w-1/2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {/* ✅ Dot Color: Delivered=Green, Cancelled=Red, Others=Yellow */}
                  <p className={`min-w-2 h-2 rounded-full ${             
                    order.status === 'Delivered' ? 'bg-green-500' : 
                    order.status === 'Cancelled' ? 'bg-red-500' : 
                    'bg-yellow-400'
                  }`}></p>
                  
                  {/* ✅ Text Color: Delivered=Green, Cancelled=Red */}
                  <p className={`text-sm md:text-base font-medium ${
                    order.status === 'Delivered' ? 'text-green-600' : 
                    order.status === 'Cancelled' ? 'text-red-600' : 
                    'text-gray-700'
                  }`}>
                    {order.status}
                  </p>
                </div>

                <div className='flex gap-3'>
                  <button 
                    onClick={fetchOrders} 
                    className='border px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition'
                  >
                    Track Order
                  </button>
                  <button 
                    className='border px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition' 
                    onClick={() => {
                      navigator.clipboard.writeText(order._id);
                      toast.success("Order ID Copied!");
                    }}
                  >
                    Copy ID
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Orders