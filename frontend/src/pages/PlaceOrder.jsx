import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate, token, backendUrl, cartItems, products, getCartAmount, delivery_fee, setCartItems } = useContext(ShopContext);
  const [loading, setLoading] = useState(false)
  
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  useEffect(() => {
    if (!token) {
      toast.error("Please login to place an order")
      navigate('/login')
    }
  }, [token])

  const handlePlaceOrder = async () => {
    // Validate address fields
    if (!address.firstName || !address.lastName || !address.email || !address.street || 
        !address.city || !address.state || !address.zipcode || !address.country || !address.phone) {
      toast.error("Please fill in all address fields")
      return
    }

    // Get cart items
    const orderItems = []
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const product = products.find(p => p._id === itemId)
          if (product) {
            orderItems.push({
              productId: itemId,
              name: product.name,
              price: product.price,
              size: size,
              quantity: cartItems[itemId][size],
              image: product.image && product.image[0] ? product.image[0] : ''
            })
          }
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty")
      navigate('/cart')
      return
    }

    const totalAmount = getCartAmount() + delivery_fee

    setLoading(true)

    try {
      if (method === 'cod') {
        const response = await axios.post(
          backendUrl + '/api/order/create',
          {
            items: orderItems,
            amount: totalAmount,
            address: address,
            paymentMethod: method
          },
          {
            headers: { token }
          }
        )

        if (response.data.success) {
          toast.success("Order placed successfully!")
          setCartItems({})
          navigate('/orders')
        } else {
          toast.error(response.data.message)
        }
      } else {
        // For bkash / nagad: initiate sslcommerz flow and redirect to payment gateway
        const res = await axios.post(
          backendUrl + '/api/payment/sslcommerz/initiate',
          {
            items: orderItems,
            amount: totalAmount,
            address: address,
            paymentMethod: method,
            cus_name: `${address.firstName} ${address.lastName}`,
            cus_email: address.email,
            cus_phone: address.phone
          },
          { headers: { token } }
        )

        if (res.data.success && res.data.url) {
          window.location.href = res.data.url
        } else {
          toast.error(res.data.message || 'Failed to initialize payment')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

        {/* Left Side */}
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          <div className='flex gap-3'>
            <input 
              value={address.firstName}
              onChange={(e) => setAddress({...address, firstName: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="text" 
              placeholder='First Name' 
              required
            />
            <input 
              value={address.lastName}
              onChange={(e) => setAddress({...address, lastName: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="text" 
              placeholder='Last Name' 
              required
            />
          </div>
          <input 
            value={address.email}
            onChange={(e) => setAddress({...address, email: e.target.value})}
            className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
            type="email" 
            placeholder='Email Address' 
            required
          />
          <input 
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Street' 
            required
          />
          <div className='flex gap-3'>
            <input 
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="text" 
              placeholder='City' 
              required
            />
            <input 
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="text" 
              placeholder='State' 
              required
            />
          </div>
           <div className='flex gap-3'>
            <input 
              value={address.zipcode}
              onChange={(e) => setAddress({...address, zipcode: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="number" 
              placeholder='Zipcode' 
              required
            />
            <input 
              value={address.country}
              onChange={(e) => setAddress({...address, country: e.target.value})}
              className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
              type="text" 
              placeholder='Country' 
              required
            />
          </div>
          <input 
            value={address.phone}
            onChange={(e) => setAddress({...address, phone: e.target.value})}
            className='border border-blue-200 rounded py-1.5 px-3.5 w-full' 
            type="number"  
            placeholder='Phone' 
            required
          />
        </div>

        {/* Right Side */}
        <div className='mt-8'>

          <div className='mt-8 min-w-80'>
            <CartTotal />
          </div>
          <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />

            {/* Pay */}
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div onClick={()=>setMethod('bkash')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'bkash' ? 'bg-green-400' : ''}`}></p>
                <img className='h-11 mx-4' src={assets.bkash_logo} alt="stripe" />
              </div>
              <div onClick={()=>setMethod('nagad')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'nagad' ? 'bg-green-400' : ''}`}></p>
                <img className='h-12 mx-4' src={assets.nagad_logo} alt="stripe" />
              </div>
              <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
              </div>
            </div>
            <div className='s-full text-end mt-8'>
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading}
                className='bg-blue-950 text-white py-3 px-16 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Processing...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default PlaceOrder