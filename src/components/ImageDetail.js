// Components
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { DateTime } from 'luxon'

// CSS documents
import "animate.css"

// Redux toolkit hooks
import { useSelector, useDispatch } from 'react-redux'
import ImageCarrousel from './ImageCarrousel'
import TagList from './TagList'

// Redux toolkit reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { 
  editImageTitle, 
  editImageFilters, 
  deleteLocalImage, 
  setChangeCarouselImage 
} from '../features/imageSlice/imageSlice'

// React hooks
import { useState, useRef } from 'react'

// React icons
import { AiFillEdit } from 'react-icons/ai'
import { BiSolidSave } from 'react-icons/bi'
import { HiPlus } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { RiDeleteBinFill } from 'react-icons/ri'
import { MdOutlineClose } from "react-icons/md"


const ImageDetail = (props) => {
  // Hooks
  const dispatch = useDispatch()

  const appConfig = useSelector(state => state.appConfig)

  const currentImage = useSelector(state => state.imageList).selectedImage

  const changeImage = useSelector(state => state.imageList).changeCarouselImage


  // Local component state
  const [selectedImage, setSelectedImage] = useState(currentImage)

  const [closeButton, setCloseButton] = useState(false)

  const [disableTitle, setDisableTitle] = useState(true)

  const [imgTitle, setImgTitle] = useState(selectedImage.title)


  // Close full image modal
  const closeFullImg = () => {
    if (changeImage){
      setSelectedImage(currentImage)
      dispatch(setChangeCarouselImage(false))
    }
    
    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "imageDetail",
        modalStatus: false
      })) 
    }  
  }


  // Input references
  const titleInputRef = useRef(null)


  const editImage = async (inputName) => {
    if (inputName === "title"){
      if (disableTitle){
        setDisableTitle(false)
      } else {
        // Save new title
        if (imgTitle === ""){
          titleInputRef.current.focus()
          return
        } else {
          // Patch request
          try {
            await axios.patch(`${appConfig.serverUrl}/images`, {
              id: selectedImage._id,
              title: imgTitle
            }, {
              headers: {
                "Authorization": `JWT ${appConfig.token}`,
                "Content-Type": "application/json"
              }
            })

            dispatch(editImageTitle({
              id: selectedImage._id,
              title: imgTitle
            }))

            toast.success("El titulo de la imagen se actualizó correctamente")

            setDisableTitle(true)
          } catch (error) {
            toast.error("Error al actualizar los datos")
          }
        }
      }
    }
  }


  // Delete image
  const deleteImage = async () => {
    try {
      await axios.post(`${appConfig.serverUrl}/images/delete`, {
        id: selectedImage._id,
        imgKey: selectedImage.key
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "application/json"
        }
      })

      dispatch(deleteLocalImage({
        id: selectedImage._id
      }))

      props.successFn("La imagen se eliminó correctamente")

      setCloseButton(true)
    } catch (error) {
      console.log(error);
      toast.error("La imagen no pudo ser eliminada")
    }
  }


  return (
    <div 
      className={`flex fixed w-screen h-screen top-0 right-0 items-center 
        justify-center ${closeButton ? 'bg-white/0' : 'bg-black/60'}`}
        style={{zIndex: "11"}}
    >
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
      <div 
        className={`h-fit mb-16 w-fit relative rounded-lg p-4 bg-gray-950 shadow-xl shadow-gray-700 animate__animated animate__faster ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'} ${changeImage ? 'animate__fadeOut': 'animate__fadeIn'}`}
        onAnimationEnd={() => closeFullImg()}
      >
        <h3
          className='flex justify-center items-center absolute right-2 top-2 w-8 h-8 rounded-full text-center text-xl font-medium text-white bg-red-700 hover:bg-red-600 cursor-pointer'
          onClick={() => setCloseButton(true)}
        >
          <MdOutlineClose/>
        </h3>

        <div
          className="flex gap-x-4"
        >
          <img
            className={`border border-lime-700 rounded-md`}
            style={{maxHeight: "500px"}}
            alt={selectedImage._id}
            src={selectedImage.url}
          />

          <div
            className='bg-gray-900 w-96 text-white text-center'
          >
            <h3
              className='flex justify-center items-center gap-x-1 text-center text-xl select-none my-3'
            >
              <RiDeleteBinFill
                title='Eliminar imagen'
                className='hover:text-red-400 cursor-pointer'
                onClick={() => deleteImage()}
              />
              Información
            </h3>

            <div
              className="flex justify-between w-full"
            >
              <div className='flex flex-col'>
                <div className='flex items-center justify-center'>
                  <label
                    className='cursor-pointer'
                    onClick={() => editImage("title")}
                  >
                    {
                      disableTitle ? 
                      <AiFillEdit title='Editar' className='hover:text-yellow-300'/> : 
                      <BiSolidSave title='Guardar' className='hover:text-lime-400'/>
                    }
                  </label>
                  <label className='px-1'>
                    Título de imagen:
                  </label>
                </div>
                <input 
                  className={`px-1 text-center rounded ${disableTitle ? 'text-white' : 'text-black'}`}
                  disabled={disableTitle}
                  value={imgTitle}
                  onChange={(event) => setImgTitle(event.target.value)}
                />
              </div>

              <div className='flex flex-col'>
                <label className='px-1'>
                  Nombre del archivo:
                </label>
                <input className={`px-1 text-center rounded text-white overflow-ellipsis`}
                  disabled
                  value={selectedImage.fileName}
                />
              </div>
            </div>

            <div
              className="flex justify-between w-full mt-2"
            >
              <div className='flex flex-col'>
                <label className='px-1'>
                  Fecha de subida:
                </label>
                <input className='px-1 text-center rounded'
                  disabled
                  value={DateTime.fromISO(selectedImage.uploadDate).toLocaleString(DateTime.DATE_FULL)}
                />
              </div>

              <div className='flex flex-col'>
                <label className='px-1'>
                  Hora de subida:
                </label>
                <input className='px-1 text-center rounded'
                  disabled
                  value={`${DateTime.fromISO(selectedImage.uploadDate).toLocaleString(DateTime.TIME_24_WITH_SECONDS)} Hrs`}
                />
              </div>
            </div>

            <div className='flex items-center justify-center mt-4'>
              <label className='px-2 text-xl select-none'>
                Etiquetas
              </label>
              
              {

              }

            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-0 right-0 left-0 w-full animate__animated ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'}`}
      >
        <ImageCarrousel/>
      </div>
    </div>
  )
}

export default ImageDetail