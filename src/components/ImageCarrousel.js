import React from 'react'
import "./ImageCarousel.css"
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { setSelectedImage, setChangeCarouselImage } from '../features/imageSlice/imageSlice'

const ImageCarrousel = () => {
  // Hooks 
  const dispatch = useDispatch()
  const imageList = useSelector(state => state.imageList).imageList
  const selectedImageInfo = useSelector(state => state.imageList).selectedImage


  // Local component state
  const [carouselImageList, setCarouselImageList] = useState([])

  // Set carrousel image list
  const bootstrapCarouselImageList = (id) => {
    const imageQuantity = imageList.length

    let imageIndex = imageList.indexOf(imageList.find(image => image._id === selectedImageInfo._id))

    let showImageList = []

    if (imageQuantity < 14) {
      setCarouselImageList(imageList)
    } else {
      if (imageIndex < 7) {;
        for (let i = 0; i < 13; i ++){
          showImageList.push(imageList[i])
        }

        setCarouselImageList(showImageList)
      } else if (
        (
          (imageQuantity - imageIndex - 1) < 7 && 
          (imageQuantity - imageIndex - 1) !== 0
        ) || 
          imageIndex === imageQuantity - 1)
      {
        for (let i = (imageQuantity - 14); i < (imageQuantity - 1); i ++){
          showImageList.push(imageList[i])
        }

        setCarouselImageList(showImageList)
      } else {
        for (let i = (imageIndex - 6); i < (imageIndex + 7); i ++){
          showImageList.push(imageList[i])
        }

        setCarouselImageList(showImageList)
      }
    }
  }


  // Change selected image
  const changeSelectedImage = (image) => {
    dispatch(setChangeCarouselImage(true))
    dispatch(setSelectedImage({
      imgInfo: image
    }))
  }


  useEffect(() => {
    bootstrapCarouselImageList()
  }, [selectedImageInfo])


  return (
    <div
      className='w-full flex justify-center py-1 gap-x-2'
    >
      {
        carouselImageList.map(image => (
          <div
            key={image._id}
            className='objectfit'
          >
            <img
              className={`rounded border-2 ${selectedImageInfo._id === image._id ? 'border-lime-400' : 'border-black'} cursor-pointer`}
              onClick={() => changeSelectedImage(image)}
              alt={image.title}
              src={image.url}
            />
          </div>
        ))
      }
    </div>
  )
}

export default ImageCarrousel