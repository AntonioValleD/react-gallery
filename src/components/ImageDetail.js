// Components
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { DateTime } from 'luxon'

// CSS documents
import "animate.css"

// Redux toolkit hooks
import { useSelector, useDispatch } from 'react-redux'
import ImageCarrousel from './ImageCarrousel'

// Redux toolkit reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { 
  editImageTitle, 
  editImageTags, 
  deleteLocalImage, 
  setChangeCarouselImage 
} from '../features/imageSlice/imageSlice'

// React hooks
import { useState, useRef, useEffect } from 'react'

// React icons
import { AiFillEdit } from 'react-icons/ai'
import { BiSolidSave } from 'react-icons/bi'
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

  const [imageTags, setImageTags] = useState({})

  const [closeButton, setCloseButton] = useState(false)

  const [disableTitle, setDisableTitle] = useState(true)

  const [imgTitle, setImgTitle] = useState(selectedImage.title)

  const [disableTagInputs, setDisableTagInputs] = useState(true)


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


  // Edit image tags
  const imageTagsInput = (event) => {
    setImageTags({
      ...imageTags,
      [event.target.name]: event.target.value
    })
  }

  const saveImageTags = async () => {
    try {
      await axios.patch(`${appConfig.serverUrl}/images`, {
        id: selectedImage._id,
        tags: {...imageTags}
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "application/json"
        }
      })

      dispatch(editImageTags({
        id: selectedImage._id,
        tags: {...imageTags}
      }))

      toast.success("Las etiquetas se actualizaron correctamente")

      setDisableTagInputs(true)
    } catch (error) {
      toast.error("Error al actualizar las etiquetas")
    }
  }


  const editImage = async (inputName) => {
    if (inputName === "title"){
      if (disableTitle){
        setDisableTitle(false)
      } else {
        // Save new title
        if (imgTitle === ""){
          titleInputRef.current.focus()
          toast.error("Ingrese un titulo para la imagen")
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

  
  // Image tags constructor
  useEffect(() => {
    let tags = {}
    appConfig.userInfo.tags.forEach((tagName) => {
      if (selectedImage.tags[tagName]){
        tags[tagName] = selectedImage.tags[tagName]
      } else {
        tags[tagName] = ""
      }
    })

    setImageTags(tags)
  }, [currentImage])


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
                  ref={titleInputRef}
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

            <div className='mt-4 flex flex-col gap-2'>
              <div
                className='flex items-center justify-center gap-x-2'
              >
                {
                  disableTagInputs ? 
                  <label
                    title='Editar etiquetas' 
                    className='cursor-pointer hover:text-yellow-300'
                    onClick={() => setDisableTagInputs(false)}
                  >
                    <AiFillEdit/> 
                  </label> : 
                  <label
                    title='Editar etiquetas' 
                    className='cursor-pointer hover:text-lime-400'
                    onClick={() => saveImageTags()}
                  >
                    <BiSolidSave/> 
                  </label>
                }

                <label className='text-xl select-none'>
                  Etiquetas:
                </label>
              </div>
              
              <div
                className={`${appConfig.userInfo.tags.length > 9 ?
                  "overflow-y-scroll" : ""}`}
                style={{maxHeight: "290px"}}
              >
                {
                  appConfig.userInfo.tags.map((tagName) => (
                    <div
                      key={tagName}
                      className='flex justify-between items-center mb-2 px-2'
                    >
                      <label
                        className='w-4/12 text-start'
                      >
                        {tagName}
                      </label>

                      <input
                        value={imageTags[tagName]}
                        name={tagName}
                        className={`${disableTagInputs ? "text-white" : "text-black"}
                          text-center w-8/12 rounded px-1`}
                        onChange={(event) => imageTagsInput(event)}
                        disabled={disableTagInputs}
                      />
                    </div>
                  ))
                }
              </div>

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