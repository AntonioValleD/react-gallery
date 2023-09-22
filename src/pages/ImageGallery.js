import React from 'react'
import "./ImageGallery.css"
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { saveImageList, setSelectedImage } from '../features/imageSlice/imageSlice'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Navigation from '../components/Navigation'
import NewImageForm from '../components/NewImageForm'
import ImageDetail from '../components/ImageDetail'
import FilterMenu from '../components/FilterMenu'
import UserInfo from '../components/UserInfo'


const ImageGallery = () => {
  // Hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // State
  const appConfig = useSelector(state => state.appConfig)
  const imageList = useSelector(state => state.imageList).imageList
  const filteredImageList = useSelector(state => state.imageList).filteredImageList

  const [selectedImageList, setSelectedImageList] = useState([])


  // Check filtered list
  const checkFilteredList = () => {
    if (filteredImageList.length === 0){
      setSelectedImageList(imageList)
    } else {
      setSelectedImageList(filteredImageList)
    }
  }

  
  // Getting images from database
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${appConfig.serverUrl}/images`, {
        headers: {
          Authorization: `JWT ${appConfig.token}`
        }
      })

      dispatch(saveImageList({
        imageList: response.data
      }))

    } catch (error) {
      console.log(error)
    }
  }


  // Open full image
  const openFullImg = (imgId) => {
    const selectedImg = imageList.find(image => image._id === imgId)

    dispatch(setSelectedImage({
      imgInfo: selectedImg
    }))

    dispatch(changeModalStatus({
      modalName: "imageDetail",
      modalStatus: true,
    }))
  }


  // Modal success function
  const successModal = (status) => {
    if (status){
      toast.success("La imagen se guardó correctamente")
    } else {
      toast.error("La imagen no pudo ser guardada")
    }
  }


  // Image detail success function
  const successFn = (message) => {
    toast.success(message)
  }


  // Modal window selector
  const modalStatus = useSelector(state => state.modalStatus)
  let modalWindow
  
  if (modalStatus.addImage){
    modalWindow = <NewImageForm
      fetch={fetchImages}
      successFn={successModal}
    />
  } else if (modalStatus.imageDetail){
    modalWindow = <ImageDetail
      successFn={successFn}
    />
  } else if (modalStatus.filterMenu){
    modalWindow = <FilterMenu/>
  } else if (modalStatus.userInfo){
    modalWindow = <UserInfo/>
  }


  useEffect(() => {
    if (appConfig.token === ""){
      navigate("/")
    }
    checkFilteredList()
  }, [appConfig, filteredImageList, imageList])



  return (
    <div
      className='flex flex-col'
    >

      {modalWindow}

      <Toaster
        toastOptions={{
          position: "top-center",
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />

      <div className='w-full'>
        <Navigation/>
      </div>

      <div
        className='gallery m-2'
      >
        {selectedImageList.map(image => (
          <div
            key={image._id}
            className='pics mb-4'
          >
            <img 
              src={image.url}
              alt={image._id}
              className='w-full cursor-pointer'
              onClick={() => openFullImg(image._id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery