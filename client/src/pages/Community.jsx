import React, { useEffect, useState} from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const {axios} = useAppContext()

  const fetchImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images')
      if(data.success) {
        setImages(data.images)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchImages()
  },[])

  if (loading) return <Loading />

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
      <h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-white'>Community Images</h2>
      
      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((item, index)=>(
            <a
              key={index}
              href={item.imageUrl}
              target='_blank'
              rel='noreferrer'
              className='relative group block w-48 sm:w-56 rounded-xl overflow-hidden border border-gray-200 dark:border-purple-700/50 shadow-sm hover:shadow-lg transition-all duration-300'
            >
              <img
                src={item.imageUrl}
                alt={`Community image by ${item.userName}`}
                className='w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
              />
              <p className='absolute bottom-0 left-0 right-0 text-xs bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate'>
                By {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 dark:text-white/60'>No community images yet. Generate and publish one!</p>
      )}
    </div>
  )
}

export default Community
