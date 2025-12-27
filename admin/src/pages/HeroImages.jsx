import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const HeroImages = ({ token }) => {
  
  const [newHeroImages, setNewHeroImages] = useState([])
  const [subheroImg1, setSubheroImg1] = useState(null)
  const [subheroImg2, setSubheroImg2] = useState(null)
  const [subheroImg3, setSubheroImg3] = useState(null)
  const [subheroImg4, setSubheroImg4] = useState(null)
  const [latestVideo, setLatestVideo] = useState(null)
  const [bestsellersVideo, setBestsellersVideo] = useState(null)

  const [currentImages, setCurrentImages] = useState({
    hero_images: [],
    subhero_img1: null,
    subhero_img2: null,
    subhero_img3: null,
    subhero_img4: null
  })

  // Fetch current hero images on component mount
  useEffect(() => {
    fetchCurrentImages()
  }, [])

  const fetchCurrentImages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/hero-images`)
      
      if (response.data.success) {
        setCurrentImages({
          hero_images: response.data.images.hero_images || [],
          subhero_img1: response.data.images.subhero_img1 || null,
          subhero_img2: response.data.images.subhero_img2 || null,
          subhero_img3: response.data.images.subhero_img3 || null,
          subhero_img4: response.data.images.subhero_img4 || null,
          latestcollection_video: response.data.images.latestcollection_video || null,
          bestsellers_video: response.data.images.bestsellers_video || null,
        })
      }
    } catch (error) {
      console.error("Error fetching hero images:", error)
      toast.error("Failed to load current images: " + (error.response?.data?.message || error.message))
    }
  }

  const handleImageChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleMultipleHeroImages = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewHeroImages(files)
    }
  }

  const handleAddHeroImages = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      // Append multiple hero images
      newHeroImages.forEach((file, index) => {
        formData.append('hero_image_' + index, file)
      })

      // Append subhero images if provided
      if (subheroImg1) formData.append('subhero_img1', subheroImg1)
      if (subheroImg2) formData.append('subhero_img2', subheroImg2)
      if (subheroImg3) formData.append('subhero_img3', subheroImg3)
      if (subheroImg4) formData.append('subhero_img4', subheroImg4)
      // Append videos if provided
      if (latestVideo) formData.append('latestcollection_video', latestVideo)
      if (bestsellersVideo) formData.append('bestsellers_video', bestsellersVideo)

      // Check if at least one image or video is selected
      if (newHeroImages.length === 0 && !subheroImg1 && !subheroImg2 && !subheroImg3 && !subheroImg4 && !latestVideo && !bestsellersVideo) {
        toast.error("Please select at least one image to add")
        return
      }

      const response = await axios.post(
        `${backendUrl}/api/hero-images/add`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (response.data.success) {
        toast.success(`Successfully added ${newHeroImages.length} hero image(s)!`)
        
        // Reset form
        setNewHeroImages([])
        setSubheroImg1(null)
        setSubheroImg2(null)
        setSubheroImg3(null)
        setSubheroImg4(null)
        setLatestVideo(null)
        setBestsellersVideo(null)
        
        // Refresh current images
        await fetchCurrentImages()
        
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = ''
        })
      } else {
        toast.error("❌Failed: " + response.data.message)
      }

    } catch (err) {
      console.error("Error adding hero images:", err)
      toast.error("❌Hero Images Add Failed! " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteHeroImage = async (index) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) {
      return
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/hero-images/delete`,
        { index },
        {
          headers: { token }
        }
      )

      if (response.data.success) {
        toast.success("Hero image deleted successfully!")
        await fetchCurrentImages()
      } else {
        toast.error("❌Failed: " + response.data.message)
      }
    } catch (err) {
      console.error("Error deleting hero image:", err)
      toast.error("❌Delete Failed! " + (err.response?.data?.message || err.message))
    }
  }

  const handleMoveImage = async (currentIndex, direction) => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= currentImages.hero_images.length) {
      return
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/hero-images/reorder`,
        { fromIndex: currentIndex, toIndex: targetIndex },
        {
          headers: { token }
        }
      )

      if (response.data.success) {
        toast.success("Image order updated!")
        await fetchCurrentImages()
      } else {
        toast.error("❌Failed: " + response.data.message)
      }
    } catch (err) {
      console.error("Error reordering images:", err)
      toast.error("❌Reorder Failed! " + (err.response?.data?.message || err.message))
    }
  }

  // Upload a single subhero image (subhero_img1..4)
  const handleUploadSubhero = async (fieldName, file, clearSetter) => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    try {
      const fd = new FormData()
      fd.append(fieldName, file)

      const response = await axios.post(
        `${backendUrl}/api/hero-images/add`,
        fd,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success('Subhero image uploaded successfully')
        // refresh
        await fetchCurrentImages()
        // clear local selection
        if (typeof clearSetter === 'function') clearSetter(null)
        const el = document.getElementById(fieldName)
        if (el) el.value = ''
      } else {
        toast.error('❌Failed: ' + response.data.message)
      }
    } catch (err) {
      console.error('Error uploading subhero:', err)
      toast.error('❌Upload Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteSubhero = async (field) => {
    if (!window.confirm('Delete this subhero image?')) return
    try {
      const res = await axios.post(`${backendUrl}/api/hero-images/delete-subhero`, { field }, { headers: { token } })
      if (res.data.success) {
        toast.success('Subhero deleted')
        await fetchCurrentImages()
      } else {
        toast.error('❌Failed: ' + res.data.message)
      }
    } catch (err) {
      console.error('Error deleting subhero:', err)
      toast.error('❌Delete Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteVideo = async (field) => {
    if (!window.confirm('Delete this hero video?')) return
    try {
      const res = await axios.post(`${backendUrl}/api/hero-images/delete-video`, { field }, { headers: { token } })
      if (res.data.success) {
        toast.success('Video deleted')
        await fetchCurrentImages()
      } else {
        toast.error('❌Failed: ' + res.data.message)
      }
    } catch (err) {
      console.error('Error deleting video:', err)
      toast.error('❌Delete Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  // Upload a single video (latestcollection_video or bestsellers_video)
  const handleUploadVideo = async (fieldName, file, clearSetter) => {
    if (!file) {
      toast.error('Please select a video to upload')
      return
    }

    try {
      const fd = new FormData()
      fd.append(fieldName, file)

      const response = await axios.post(
        `${backendUrl}/api/hero-images/add`,
        fd,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success('Video uploaded successfully')
        await fetchCurrentImages()
        if (typeof clearSetter === 'function') clearSetter(null)
        const el = document.getElementById(fieldName)
        if (el) el.value = ''
      } else {
        toast.error('❌Failed: ' + response.data.message)
      }
    } catch (err) {
      console.error('Error uploading video:', err)
      toast.error('❌Upload Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  // Upload multiple/aggregate subhero images (subhero_img1..4)
  const handleAddSubheroes = async () => {
    if (!subheroImg1 && !subheroImg2 && !subheroImg3 && !subheroImg4) {
      toast.error('Please select at least one subhero image to add')
      return
    }

    try {
      const fd = new FormData()
      if (subheroImg1) fd.append('subhero_img1', subheroImg1)
      if (subheroImg2) fd.append('subhero_img2', subheroImg2)
      if (subheroImg3) fd.append('subhero_img3', subheroImg3)
      if (subheroImg4) fd.append('subhero_img4', subheroImg4)

      const response = await axios.post(
        `${backendUrl}/api/hero-images/add`,
        fd,
        {
          headers: { token, 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.data.success) {
        toast.success('Subhero image(s) added successfully')
        await fetchCurrentImages()
        setSubheroImg1(null)
        setSubheroImg2(null)
        setSubheroImg3(null)
        setSubheroImg4(null)
        document.querySelectorAll('#subhero_img1, #subhero_img2, #subhero_img3, #subhero_img4').forEach(el => { if (el) el.value = '' })
      } else {
        toast.error('❌Failed: ' + response.data.message)
      }
    } catch (err) {
      console.error('Error adding subhero images:', err)
      toast.error('❌Add Subhero Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  // Upload aggregate videos (latestcollection_video & bestsellers_video)
  const handleAddVideos = async () => {
    if (!latestVideo && !bestsellersVideo) {
      toast.error('Please select at least one video to add')
      return
    }

    try {
      const fd = new FormData()
      if (latestVideo) fd.append('latestcollection_video', latestVideo)
      if (bestsellersVideo) fd.append('bestsellers_video', bestsellersVideo)

      const response = await axios.post(
        `${backendUrl}/api/hero-images/add`,
        fd,
        {
          headers: { token, 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.data.success) {
        toast.success('Hero video(s) added successfully')
        await fetchCurrentImages()
        setLatestVideo(null)
        setBestsellersVideo(null)
        const el1 = document.getElementById('latestcollection_video')
        const el2 = document.getElementById('bestsellers_video')
        if (el1) el1.value = ''
        if (el2) el2.value = ''
      } else {
        toast.error('❌Failed: ' + response.data.message)
      }
    } catch (err) {
      console.error('Error adding videos:', err)
      toast.error('❌Add Videos Failed! ' + (err.response?.data?.message || err.message))
    }
  }

  const ImageUploadSection = ({ title, image, setImage, currentImage, imageKey }) => (
    <div className='w-full mb-6 p-4 border rounded-lg'>
      <p className='mb-3 text-lg font-semibold'>{title}</p>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div className='mb-3'>
          <p className='text-sm text-gray-600 mb-2'>Current Image:</p>
          <img
            src={currentImage}
            alt={`Current ${title}`}
            className='w-full max-w-[400px] h-[200px] object-cover border rounded'
          />
        </div>
      )}

      {/* Upload New Image */}
      <div>
        <label htmlFor={imageKey} className='cursor-pointer'>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition'>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt={`New ${title}`}
                className='w-full max-w-[400px] h-[200px] object-cover mx-auto rounded'
              />
            ) : (
              <>
                <img
                  src={assets.upload_area}
                  alt="Upload area"
                  className='w-20 h-20 mx-auto mb-2 opacity-50'
                />
                <p className='text-gray-600'>Click to upload new image</p>
                <p className='text-sm text-gray-400 mt-1'>Recommended: 1920x1080 or similar ratio</p>
              </>
            )}
          </div>
          <input
            type="file"
            id={imageKey}
            onChange={(e) => handleImageChange(e, setImage)}
            hidden
            accept="image/*"
          />
        </label>
      </div>
    </div>
  )

  const VideoUploadSection = ({ title, video, setVideo, currentVideo, videoKey }) => (
    <div className='w-full mb-6 p-4 border rounded-lg'>
      <p className='mb-3 text-lg font-semibold'>{title}</p>

      {currentVideo && (
        <div className='mb-3'>
          <p className='text-sm text-gray-600 mb-2'>Current Video:</p>
          <video src={currentVideo} controls className='w-full max-w-[600px] h-[300px] object-cover border rounded' />
        </div>
      )}

      <div>
        <label htmlFor={videoKey} className='cursor-pointer'>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition'>
            {video ? (
              <div>
                <p className='text-blue-600 font-semibold mb-2'>New video selected</p>
                <video src={URL.createObjectURL(video)} controls className='w-full max-w-[600px] h-[300px] object-cover mx-auto rounded' />
              </div>
            ) : (
              <>
                <img
                  src={assets.upload_area}
                  alt="Upload area"
                  className='w-20 h-20 mx-auto mb-2 opacity-50'
                />
                <p className='text-gray-600'>Click to upload new video</p>
                <p className='text-sm text-gray-400 mt-1'>Recommended: mp4, reasonable size & resolution</p>
              </>
            )}
          </div>
          <input
            type="file"
            id={videoKey}
            onChange={(e) => handleImageChange(e, setVideo)}
            hidden
            accept="video/*"
          />
        </label>
      </div>
    </div>
  )

  return (
    <div className='w-full'>
      <h1 className='text-2xl font-bold mb-6'>Manage Hero Images</h1>
      
      {/* Add New Hero Images Section */}
      <div className='w-full mb-8 p-4 border rounded-lg bg-gray-50'>
        <h2 className='text-xl font-semibold mb-4'>Add New Hero Images</h2>
        <form onSubmit={handleAddHeroImages} className='flex flex-col gap-4'>
          <div>
            <label htmlFor="hero_images" className='cursor-pointer'>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition'>
                {newHeroImages.length > 0 ? (
                  <div>
                    <p className='text-blue-600 font-semibold mb-2'>{newHeroImages.length} image(s) selected</p>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {newHeroImages.slice(0, 4).map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className='w-full h-24 object-cover rounded border'
                        />
                      ))}
                    </div>
                    {newHeroImages.length > 4 && (
                      <p className='text-sm text-gray-500 mt-2'>+ {newHeroImages.length - 4} more image(s)</p>
                    )}
                  </div>
                ) : (
                  <>
                    <img
                      src={assets.upload_area}
                      alt="Upload area"
                      className='w-20 h-20 mx-auto mb-2 opacity-50'
                    />
                    <p className='text-gray-600'>Click to select hero images (multiple selection allowed)</p>
                    <p className='text-sm text-gray-400 mt-1'>You can select unlimited images</p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="hero_images"
                onChange={handleMultipleHeroImages}
                hidden
                accept="image/*"
                multiple
              />
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!(newHeroImages.length > 0 || subheroImg1 || subheroImg2 || subheroImg3 || subheroImg4 || latestVideo || bestsellersVideo)}
            className="px-6 py-3 bg-blue-900 text-white rounded hover:bg-blue-800 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
            Add {newHeroImages.length > 0 ? `${newHeroImages.length} ` : ''}Hero Image(s)
          </button>
        </form>
      </div>

      {/* Current Hero Images List */}
      <div className='w-full mb-8'>
        <h2 className='text-xl font-semibold mb-4 border-b pb-2'>Current Hero Images ({currentImages.hero_images.length})</h2>
        
        {currentImages.hero_images.length === 0 ? (
          <p className='text-gray-500 italic'>No hero images uploaded yet. Add some images above!</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {currentImages.hero_images.map((imgUrl, index) => (
              <div key={index} className='relative border rounded-lg p-4 bg-white'>
                <img
                  src={imgUrl}
                  alt={`Hero image ${index + 1}`}
                  className='w-full h-48 object-cover rounded mb-2'
                />
                <p className='text-sm text-gray-600 mb-2'>Image #{index + 1}</p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleMoveImage(index, 'up')}
                    disabled={index === 0}
                    className='px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveImage(index, 'down')}
                    disabled={index === currentImages.hero_images.length - 1}
                    className='px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                    ↓
                  </button>
                  <button
                    onClick={() => handleDeleteHeroImage(index)}
                    className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 ml-auto'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subhero Images Section */}
      <div className='w-full mt-8'>
        <h2 className='text-xl font-semibold mb-4 border-b pb-2'>Subhero Images</h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ImageUploadSection
            title="Subhero Image 1 (Men Category)"
            image={subheroImg1}
            setImage={setSubheroImg1}
            currentImage={currentImages.subhero_img1}
            imageKey="subhero_img1"
          />
          
          <ImageUploadSection
            title="Subhero Image 2 (Women Category)"
            image={subheroImg2}
            setImage={setSubheroImg2}
            currentImage={currentImages.subhero_img2}
            imageKey="subhero_img2"
          />
          
          <ImageUploadSection
            title="Subhero Image 3 (Boys Kid Category)"
            image={subheroImg3}
            setImage={setSubheroImg3}
            currentImage={currentImages.subhero_img3}
            imageKey="subhero_img3"
          />
          
          <ImageUploadSection
            title="Subhero Image 4 (Girls Kid Category)"
            image={subheroImg4}
            setImage={setSubheroImg4}
            currentImage={currentImages.subhero_img4}
            imageKey="subhero_img4"
          />
        </div>
        {/* Aggregate Subhero Add Button */}
        <div className='mt-4 flex items-center gap-2'>
          <button
            onClick={handleAddSubheroes}
            disabled={!(subheroImg1 || subheroImg2 || subheroImg3 || subheroImg4)}
            className='px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Add Subhero
          </button>
        </div>

        {/* Hero Videos Section */}
        <div className='w-full mt-8'>
          <h2 className='text-xl font-semibold mb-4 border-b pb-2'>Hero Videos</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <VideoUploadSection
              title="Latest Collection Video"
              video={latestVideo}
              setVideo={setLatestVideo}
              currentVideo={currentImages.latestcollection_video}
              videoKey="latestcollection_video"
            />

            <VideoUploadSection
              title="Best Sellers Video"
              video={bestsellersVideo}
              setVideo={setBestsellersVideo}
              currentVideo={currentImages.bestsellers_video}
              videoKey="bestsellers_video"
            />
          </div>
          <div className='mt-4 flex items-center gap-2'>
            <button
              onClick={handleAddVideos}
              disabled={!(latestVideo || bestsellersVideo)}
              className='px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Add Hero Videos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroImages
