// Components 
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

// React hooks
import { useState, useRef, useEffect } from 'react'

// Redux toolkit hooks
import { useDispatch, useSelector } from 'react-redux'

// Redux toolkit reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'

// React icons
import { MdOutlineClose } from "react-icons/md"


const NewImageForm = (props) => {
  // Hooks
  const dispatch = useDispatch()
  const appConfig =  useSelector(state => state.appConfig)


  // Local component state
  const [fileInfo, setFileInfo] = useState({
    title: "",
    file: "",
  })

  const [imageTags, setImageTags] = useState([])

  const [closeButton, setCloseButton] = useState(false)

  
  // Handle file input value
  const fileInputHandler = (event) => {
    setFileInfo({
      ...fileInfo,
      file: event.target.files[0]
    })
  }


  // Handle title input value
  const titleInputHandler = (event) => {
    setFileInfo({
      ...fileInfo,
      title: event.target.value
    })
  }


  // Handle image tag inputs
  const imageTagsInput = (event) => {
    setImageTags({
      ...imageTags,
      [event.target.name]: event.target.value
    })
  }


  // Submit inputs references
  const titleInputRef = useRef(null)
  const fileInputRef = useRef(null)


  // Check image info
  const checkImageInfo = () => {
    if (fileInfo.file === ""){
      toast.error("Seleccione una imagen")
      return false
    
    } else if(fileInfo.title === "") {
      titleInputRef.current.focus()
      toast.error("Ingrese un nombre para la imagen")
      return false
    }

    return true
  }


  // Submit image function
  const submitImage = async () => {
    if (!checkImageInfo()){
      return
    }

    try {
      await axios.post(`${appConfig.serverUrl}/images`, {
        title: fileInfo.title,
        file: fileInfo.file,
        tags: JSON.stringify(imageTags),
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "multipart/form-data",
        }
      })
      
      props.successFn(true)

      setCloseButton(true)
    } catch (error) {
      toast.error("The image already exists")
    }
  }


  // Close new image form
  const closeNewImageForm = () => {
    if (closeButton){
      props.fetch()

      dispatch(changeModalStatus({
        modalName: "addImage",
        modalStatus: false
      }))
    }
  }


  // Pre-visualize selected image
  let prevImageUrl = ""
  if (fileInfo.file !== ""){
    prevImageUrl = URL.createObjectURL(fileInfo.file)
  }


  useEffect(() => {
    let tagObject = {}

    appConfig.userInfo.tags.forEach((tag) => {
      tagObject[tag] = ""
    })

    setImageTags(tagObject)
  }, [])


  return (
    <div 
      className={`fixed w-screen h-screen top-0 right-0 z-20 flex items-center 
        justify-center ${closeButton ? 'bg-white/0' : 'bg-black/60'}`}
    >
      <Toaster
        toastOptions={{
          position: "top-center",
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '2px',
          },
        }}
      />

      <div 
        className={`h-fit relative rounded-lg p-4 bg-gray-950 shadow-xl shadow-gray-700 text-white animate__animated ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'}`}
        style={{ width: "700px" }}
        onAnimationEnd={() => closeNewImageForm()}
      >
        <h3
          className='flex justify-center items-center absolute right-3 top-3 w-8 h-8 rounded-full text-center text-xl text-white bg-red-700 hover:bg-red-500 cursor-pointer'
          onClick={() => setCloseButton(true)}
        >
          <MdOutlineClose/>
        </h3>

        <h3
          className='text-center text-xl mb-2'
        >
          Nueva imagen
        </h3>

        <div
          className='flex justify-between gap-x-4'
        >
          <div
            className='w-1/2'
          >
            <h3 className='text-center text-lg'>Vista previa</h3>
            <div
              className={`${fileInfo.file === "" ? "bg-gray-900" : "bg-gray-950"} w-full h-96 flex justify-center items-center z-10`}
            >
              {
                fileInfo.file === "" ?
                "Seleccione una imagen" :
                <img
                  className='max-h-96'
                  src={prevImageUrl}
                  alt='previewImage'
                />
              }
            </div>
          </div>

          <div
            className='w-1/2'
          >
            <h3 className='text-center text-lg'>Información</h3>
            <div>
              <label className='mt-2 ml-1'>
                Buscar imagen:
              </label>
              <input
                type='file'
                className='my-1 rounded text-sm'
                ref={fileInputRef}
                onChange={(event) => fileInputHandler(event)}
              >
              </input>
              
              <label className='mt-2 ml-1'>
                Nombre de imagen: 
              </label>
              <input
                type='text'
                className='py-px text-sm text-black pl-1 my-1 w-full bg-gray-50 border border-black rounded'
                ref={titleInputRef}
                onChange={(event) => titleInputHandler(event)}
              >
              </input>

              <div className='flex justify-center'>
                <button
                  className='absolute bottom-2 bg-green-800 hover:bg-green-600 py-1 w-80 text-white text-base rounded'
                  onClick={() => submitImage()}
                >
                  Subir imagen
                </button>
              </div>
            </div>

            <h3 className='text-center text-lg my-2'>Etiquetas</h3>

            <div
              className={`${appConfig.userInfo.tags.length >= 7 ?
                "overflow-y-scroll" : ""}`}
              style={{maxHeight: "200px"}}
            >
              {
                appConfig.userInfo.tags.map((tagName) => (
                  <div
                    key={tagName}
                    className='flex justify-between items-center mb-2 px-2'
                  >
                    <label
                      className='w-4/12'
                    >
                      {tagName}
                    </label>

                    <input
                      value={imageTags[tagName]}
                      name={tagName}
                      className='text-black w-8/12 rounded px-1'
                      onChange={(event) => imageTagsInput(event)}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewImageForm