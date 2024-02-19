// Libraries
import axios from 'axios'

// React hooks
import { useState, useRef } from 'react'

// Redux hooks
import { useDispatch, useSelector } from 'react-redux'

//Redux reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { setProfileImageUrl } from '../features/appConfigSlice.js/appConfigSlice'

// Components
import toast, { Toaster } from 'react-hot-toast'

// React icons
import { MdOutlineClose } from "react-icons/md"


const UpdateProfileImage = (props) => {
  // Hooks
  const dispatch = useDispatch()
  const appConfig =  useSelector(state => state.appConfig)
  const userInfo = useSelector(state => state.appConfig).userInfo


  // Local component state
  const [fileInfo, setFileInfo] = useState({
    file: "",
  })

  const [closeButton, setCloseButton] = useState(false)

  
  // Handle file input value
  const fileInputHandler = (event) => {
    setFileInfo({
      ...fileInfo,
      file: event.target.files[0]
    })
  }


  // Submit inputs references
  const fileInputRef = useRef(null)


  // Submit image function
  const submitImage = async () => {
    if (fileInfo.file === ""){
      fileInputRef.current.focus()
      return
    }

    try {
      let profilePicInfo = await axios.post(`${appConfig.serverUrl}/images/profilePic`, {
        file: fileInfo.file,
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "multipart/form-data",
        }
      })

      dispatch(setProfileImageUrl({
        profileImageUrl: profilePicInfo.data.url
      }))

      setCloseButton(true)
    } catch (error) {
      toast.error("The image already exists")
    }
  }


  // Close profile image settings
  const closeNewImageForm = () => {
    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "updateProfileImage",
        modalStatus: false
      }))
    }
  }


  // Pre-visualize selected image
  let prevImageUrl = ""
  if (fileInfo.file !== ""){
    prevImageUrl = URL.createObjectURL(fileInfo.file)
  }


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
        className={`relative rounded-lg p-4 bg-gray-950 shadow-xl shadow-gray-700 
          text-white animate__animated animate__faster ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'} 
          flex flex-col items-center`}
        style={{ width: "400px" }}
        onAnimationEnd={() => closeNewImageForm()}
      >
        <h3
          className='flex justify-center items-center absolute right-3 top-3 w-8 h-8 
            rounded-full text-center text-xl text-white bg-red-700 hover:bg-red-500 
            cursor-pointer'
          onClick={() => setCloseButton(true)}
          title='Cancelar'
        >
          <MdOutlineClose/>
        </h3>

        <h3
          className='text-center text-xl mt-2'
        >
          Foto de perfil
        </h3>

        <div
          className='w-64 h-64 bg-lime-600 rounded-full flex justify-center items-center mt-4'
        >
          {
            fileInfo.file !== "" ?
              <img
                className='w-64 h-64 rounded-full'
                alt='profileImage'
                src={URL.createObjectURL(fileInfo.file)}
              />
            :
            userInfo.profileImageUrl === "" ?
              <label
                className='text-8xl'
              >
                {userInfo.shortName}
              </label>
            : 
              <img
                className='w-64 h-64 rounded-full'
                alt={userInfo.profileImageUrl}
                src={userInfo.profileImageUrl}
              />
          }
        </div>

        <label className='mt-4'>
          Cambiar imagen:
        </label>
        <input
          type='file'
          className='rounded text-sm h-14 mt-1 mb-4'
          ref={fileInputRef}
          onChange={(event) => fileInputHandler(event)}
        />

        <button
          className='absolute bottom-2 bg-lime-800 hover:bg-lime-600 py-1 px-2 mb-2 
            text-white text-base rounded'
          onClick={() => submitImage()}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

export default UpdateProfileImage