import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [category, setCategory] = useState('')
  const [types, setTypes] = useState([])
  const [type, setType] = useState('')
  const [sizes, setSizes] = useState([])

  const [images, setImages] = useState([null, null, null, null])
  const [bestseller, setBestseller] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])

  const categoryOptions = {
    Men: ["Shirt", "Pants", "T-shirt", "Panjabi"],
    Women: ["Salwar Kameez", "Kameez", "Saree", "Top", "Skirt", "Palazzo"],
    "Boys Kid": ["Kid Shirt", "Kid Pants", "Kid T-Shirt", "Kid Panjabi"],
    "Girls Kid": ["Kid Salwar Kameez", "Kid Frock", "Kid Palazzo"]
  }

  const sizeOptions = {
    Shirt: ["S", "M", "L", "XL", "XXL"],
    Pants: ["28", "30", "32", "34", "36"],
    "T-shirt": ["S", "M", "L", "XL", "XXL"],
    Panjabi: ["S", "M", "L", "XL"],

    "Salwar Kameez": ["32", "34", "36", "38", "40", "42"],
    Kameez: ["32", "34", "36", "38", "40", "42"],
    Saree: ["Free Size"],
    Top: ["S", "M", "L"],
    Skirt: ["S", "M", "L"],
    Palazzo: ["S", "M", "L"],

    "Kid Shirt": ["2-3", "4-5", "6-7", "8-9", "10-11"],
    "Kid Pants": ["XS", "S", "M"],
    "Kid T-Shirt": ["XS", "S", "M"],
    "Kid Panjabi": ["XS", "S", "M"],

    "Kid Salwar Kameez": ["2-3", "4-5", "6-7", "8-9", "10-11"],
    "Kid Frock": ["XS", "S", "M"],
    "Kid Palazzo": ["XS", "S", "M"]
  }

  const handleCategoryChange = (e) => {
    const selected = e.target.value
    setCategory(selected)
    setTypes(categoryOptions[selected] || [])
    setType('')
    setSizes([])
  }

  const handleTypeChange = (e) => {
    const selectedType = e.target.value
    setType(selectedType)
    setSizes(sizeOptions[selectedType] || [])
  }

  const handleSizeCheck = (e) => {
    const value = e.target.value
    if (e.target.checked) {
      setSelectedSizes([...selectedSizes, value])
    } else {
      setSelectedSizes(selectedSizes.filter(sz => sz !== value))
    }
  }

  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...images]
      newImages[index] = e.target.files[0]
      setImages(newImages)
    }
  }

  // ✅ FIXED submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("type", type)
      formData.append("price", price)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(selectedSizes))

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img)
      })

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (response.data.success) {

        toast.success("Product Added Successfully!")

        // Reset fields
        setName("")
        setDescription("")
        setCategory("")
        setType("")
        setPrice("")
        setSelectedSizes([])
        setBestseller(false)
        setImages([null, null, null, null])

      } else {
        toast.error("❌Failed: " + response.data.message)
      }

    } catch (err) {
      console.error("Error adding product:", err)
      toast.error("❌Product Add Failed!")
    }
  }

  return (
    <form className='flex flex-col w-full items-start gap-3' onSubmit={handleSubmit}>

      <div>
        <p className='mb-2 font-semibold'>Upload Images</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map(index => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                className='w-20 h-20 object-cover cursor-pointer border rounded'
                src={images[index] ? URL.createObjectURL(images[index]) : assets.upload_area}
                alt={`Image ${index + 1}`}
              />
              <input
                type="file"
                id={`image${index}`}
                onChange={(e) => handleImageChange(e, index)}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2 font-semibold'>Product Name</p>
        <input
          className='w-full max-w-[500px] px-3 py-2 border rounded'
          type="text"
          placeholder='Type here'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='w-full'>
        <p className='mb-2 font-semibold'>Description</p>
        <textarea
          className='w-full max-w-[500px] px-3 py-2 border rounded'
          placeholder='Write details here...'
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 font-semibold'>Category</p>
          <select
            className='w-full px-3 py-2 border rounded'
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categoryOptions).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2 font-semibold'>Type</p>
          <select
            className='w-full px-3 py-2 border rounded'
            value={type}
            onChange={handleTypeChange}
            required
            disabled={types.length === 0}
          >
            <option value="">Select Type</option>
            {types.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <p className='mb-2 font-semibold'>Price</p>
          <input
            className='w-full px-3 py-2 border rounded sm:w-[120px]'
            type="number"
            placeholder='00'
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className='mb-2 font-semibold'>Available Sizes</p>
        <div className='flex gap-2 flex-wrap'>
          {sizes.length === 0 && <p className='text-gray-500'>Select a Type first</p>}
          {sizes.map((size, i) => (
            <label key={i} className='border px-2 py-1 rounded cursor-pointer'>
              <input
                type="checkbox"
                className='mr-1'
                value={size}
                onChange={handleSizeCheck}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
        />
        <label htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-900 text-white rounded mt-4 hover:bg-blue-800">
        Add Product
      </button>
    </form>
  )
}

export default Add
