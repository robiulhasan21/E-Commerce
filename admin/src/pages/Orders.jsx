import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/order/list', {
        headers: { token }
      })

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success("Order status updated")
        await fetchOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update order status")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-600'>Loading orders...</p>
      </div>
    )
  }

  return (
    <div>
      <p className='mb-4 text-xl font-semibold'>All Orders</p>
      
      {orders.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>
          <p>No orders found</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order, index) => (
            <div
              key={order._id}
              className='border rounded-lg p-4 bg-white shadow-sm'
            >
              {/* Order Header */}
              <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b'>
                <div>
                  <p className='font-semibold text-gray-800'>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className='text-sm text-gray-500'>
                    Date: {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className='flex items-center gap-3 mt-2 md:mt-0'>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className='text-lg font-semibold text-gray-800'>
                    {currency}{order.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className='mb-4'>
                <p className='text-sm font-semibold text-gray-700 mb-2'>Customer Information:</p>
                <div className='text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <p><span className='font-medium'>Name:</span> {order.address.firstName} {order.address.lastName}</p>
                  <p><span className='font-medium'>Email:</span> {order.address.email}</p>
                  <p><span className='font-medium'>Phone:</span> {order.address.phone}</p>
                  <p><span className='font-medium'>Address:</span> {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p><span className='font-medium'>Country:</span> {order.address.country}</p>
                  <p><span className='font-medium'>Payment:</span> {order.paymentMethod} {order.payment ? '(Paid)' : '(Pending)'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className='mb-4'>
                <p className='text-sm font-semibold text-gray-700 mb-2'>Order Items:</p>
                <div className='space-y-2'>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className='flex items-center gap-4 p-2 bg-gray-50 rounded'>
                      {item.image && (
                        <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded' />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium text-gray-800'>{item.name}</p>
                        <div className='flex items-center gap-4 text-sm text-gray-600 mt-1'>
                          <p>Size: {item.size}</p>
                          <p>Qty: {item.quantity}</p>
                          <p>Price: {currency}{item.price}</p>
                        </div>
                      </div>
                      <p className='font-semibold text-gray-800'>
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className='flex flex-wrap items-center gap-2 pt-4 border-t'>
                <p className='text-sm font-medium text-gray-700'>Update Status:</p>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className='border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value="Order Placed">Order Placed</option>               
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders