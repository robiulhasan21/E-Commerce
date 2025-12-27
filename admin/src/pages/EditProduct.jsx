import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const EditProduct = ({ token }) => {

  const { id } = useParams()
  const navigate = useNavigate()

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
  const [quantity, setQuantity] = useState(0)
  const [existingImages, setExistingImages] = useState([null, null, null, null])

  const categoryOptions = {
    Men: ["Shirt", "Pants", "T-shirt", "Panjabi", "Winter"],
    Women: ["Salwar Kameez", "Kameez", "Saree", "Top", "Skirt", "Palazzo", "Winter"],
    "Boys Kid": ["Kid Shirt", "Kid Pants", "Kid T-Shirt", "Kid Panjabi", "Winter"],
    "Girls Kid": ["Kid Salwar Kameez", "Kid Frock", "Kid Palazzo", "Winter"]
  }

  const sizeOptions = {
    Shirt: ["S", "M", "L", "XL", "XXL"],
    Pants: ["28", "30", "32", "34", "36"],
    "T-shirt": ["S", "M", "L", "XL", "XXL"],
    Panjabi: ["S", "M", "L", "XL"],
    Winter: ["S", "M", "L", "XL", "XXL"],
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
    "Kid Palazzo": ["XS", "S", "M"],
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id })
        if (res.data.success) {
          const p = res.data.product
          setName(p.name)
          setDescription(p.description)
          setPrice(p.price)
          setCategory(p.category)
          setType(p.type)
          setSizes(sizeOptions[p.type] || [])
          setSelectedSizes(p.sizes)
          setBestseller(p.bestseller)
          setQuantity(p.quantity || 0)
          setExistingImages(p.images)
          setImages([null, null, null, null])
          setTypes(categoryOptions[p.category] || [])
        } else {
          toast.error(res.data.message)
        }
      } catch (err) {
        console.log(err)
        toast.error(err.message)
      }
    }
    fetchProduct()
  }, [id])

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
      formData.append("quantity", quantity)

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img)
      })

      let url = `${backendUrl}/api/product/add`
      if (id) {
        formData.append("id", id)
        url = `${backendUrl}/api/product/update`
      }

      const res = await axios.post(url, formData, {
        headers: { token, "Content-Type": "multipart/form-data" }
      })

      if (res.data.success) {
        toast.success(id ? "Product Updated!" : "Product Added!")
        navigate("/list") 
      } else {
        toast.error(res.data.message)
      }

    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }

  return (
    <div className='w-full'>
      {/* --- Heading Jog Kora Hoyeche --- */}
      <p className='text-2xl font-bold mb-6 text-blue-700'>Edit Product:</p>

      <form className='flex flex-col w-full items-start gap-3' onSubmit={handleSubmit}>
        <div>
          <p className='mb-2 font-semibold'>Upload Images</p>
          <div className='flex gap-2'>
            {[0, 1, 2, 3].map(index => (
              <label key={index} htmlFor={`image${index}`}>
                <img
                  className='w-20 h-20 object-cover cursor-pointer border rounded'
                  src={images[index] ? URL.createObjectURL(images[index]) : existingImages[index] || assets.upload_area}
                  alt={`Image ${index + 1}`}
                />
                <input type="file" id={`image${index}`} hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
              </label>
            ))}
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2 font-semibold'>Product Name</p>
          <input className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" required value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className='w-full'>
          <p className='mb-2 font-semibold'>Description</p>
          <textarea className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Write details here...' required value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          <div>
            <p className='mb-2 font-semibold'>Category</p>
            <select className='w-full px-3 py-2 border rounded' value={category} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {Object.keys(categoryOptions).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <p className='mb-2 font-semibold'>Type</p>
            <select className='w-full px-3 py-2 border rounded' value={type} onChange={handleTypeChange} required disabled={types.length === 0}>
              <option value="">Select Type</option>
              {types.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <p className='mb-2 font-semibold'>Price</p>
            <input className='w-full px-3 py-2 border rounded sm:w-[120px]' type="number" required value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <p className='mb-2 font-semibold'>Quantity</p>
            <input className='w-full px-3 py-2 border rounded sm:w-[120px]' type="number" min={0} value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
        </div>

        <div>
          <p className='mb-2 font-semibold'>Available Sizes</p>
          <div className='flex gap-2 flex-wrap'>
            {sizes.length === 0 && <p className='text-gray-500'>Select a Type first</p>}
            {sizes.map((size, i) => (
              <label key={i} className='border px-2 py-1 rounded cursor-pointer'>
                <input type="checkbox" className='mr-1' value={size} checked={selectedSizes.includes(size)} onChange={handleSizeCheck} />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-2 mt-2'>
          <input type="checkbox" id="bestseller" checked={bestseller} onChange={e => setBestseller(e.target.checked)} />
          <label htmlFor="bestseller">Add to Bestseller</label>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded mt-4 hover:bg-blue-800">
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  )
}

export default EditProduct