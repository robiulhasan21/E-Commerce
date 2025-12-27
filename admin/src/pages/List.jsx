import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'  // ✅ useNavigate import

const List = ({ token }) => {

  const [list, setList] = useState([])
  const navigate = useNavigate()  // ✅ navigate hook

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // ✅ Edit button handler using navigate
  const editProduct = (id) => {
    navigate(`/edit/${id}`) // SPA style navigation
  }

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-blue-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Quantity</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
          >
            <img
              className='w-12 h-12 object-cover'
              src={item.images && item.images[0] ? item.images[0] : ''}
              alt={item.name}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p>{item.quantity}</p>
            <div className='flex gap-2 justify-end md:justify-center'>
              <button
                onClick={() => editProduct(item._id)} // ✅ navigate call
                className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
              >
                Edit
              </button>
              <p
                onClick={() => removeProduct(item._id)}
                className='cursor-pointer text-red-500 font-bold border border-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white transition-all'
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default List
