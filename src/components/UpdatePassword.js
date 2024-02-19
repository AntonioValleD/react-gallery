// React hooks
import { useState, useRef } from 'react'

// Redux hooks
import { useSelector, useDispatch } from 'react-redux'

// Redux reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'

// Components
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

// React icons
import { MdOutlineClose } from "react-icons/md"


const UpdatePassword = ({


}) => {
  // Hooks
  const dispatch = useDispatch()

  // Global state
  const appConfig = useSelector(state => state.appConfig)


  // Local component state
  const [closeButton, setCloseButton] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })


  // Input values
  const inputValues = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value
    })
  }


  // Input ref
  const currentPasswordRef = useRef(null)
  const newPasswordRef = useRef(null)
  const confirmNewPasswordRef = useRef(null)


  // Check passwords
  const checkPasswords = () => {
    if (passwords.currentPassword === ""){
      toast.error("Ingrese su contraseña actual")
      currentPasswordRef.current.focus()

      return false
    } else if (passwords.newPassword === ""){
      toast.error("Ingrese su nueva contraseña")
      newPasswordRef.current.focus()

      return false
    } else if (passwords.confirmNewPassword === ""){
      toast.error("Confirme su nueva contraseña")
      confirmNewPasswordRef.current.focus()

      return false
    } else if (passwords.newPassword !== passwords.confirmNewPassword){
      toast.error("Las contraseñas no coinciden")
      confirmNewPasswordRef.current.focus()

      return false
    }

    return true
  }


  const changePassword = async () => {
    try {
      const response = await axios.put(
        `${appConfig.serverUrl}/auth/password`,
        {
          ...passwords
        },
        {
          headers: {
            "Authorization": `JWT ${appConfig.token}`
          }
        }
      )

      toast.success(response.data.message)
      return 
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }


  // Update password
  const updatePassword = async () => {
    if (!checkPasswords()){
      return
    }
    
    await changePassword()

    setTimeout(() => {
      setCloseButton(true)
    }, 2000)
  }


  const closeWindow = () => {
    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "updatePassword",
        modalStatus: false
      }))
    }
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
        className={`relative rounded-lg py-4 px-8 bg-gray-950 shadow-xl shadow-gray-700 
          text-white animate__animated animate__faster ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'} 
          flex flex-col items-center`}
        style={{ width: "400px" }}
        onAnimationEnd={() => closeWindow()}
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
          Cambiar contraseña
        </h3>

        <div
          className='mt-2 mb-4 w-full'
        >
          <div
            className='flex flex-col mb-2'
          >
            <label
              className='text-base mb-1 ml-1'
            >
              Contraseña actual
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className=' bg-gray-850 rounded text-black px-2'
              name='currentPassword'
              ref={currentPasswordRef}
              onChange={(event) => inputValues(event)}
            />
          </div>

          <div
            className='flex flex-col mb-2'
          >
            <label
              className='text-base mb-1 ml-1'
            >
              Nueva contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className=' bg-gray-850 rounded text-black px-2'
              name='newPassword'
              ref={newPasswordRef}
              onChange={(event) => inputValues(event)}
            />
          </div>

          <div
            className='flex flex-col'
          >
            <label
              className='text-base mb-1 ml-1'
            >
              Confirmar nueva contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className='bg-gray-850 rounded text-black px-2'
              name='confirmNewPassword'
              ref={confirmNewPasswordRef}
              onChange={(event) => inputValues(event)}
            />
          </div>

          <div className="flex gap-x-2 ml-2 mt-4">
            <input
              className='accent-lime-700 w-4'
              type="checkbox"
              checked={showPassword}
              onChange={() => {
                showPassword ? setShowPassword(false) : setShowPassword(true)
              }}
            />
            <label
              className="cursor-pointer select-none hover:text-lime-300 text-sm"
              onClick={() => {
                showPassword ? setShowPassword(false) : setShowPassword(true)
              }}
            >
              Mostrar contraseña
            </label>
          </div>
        </div>

        <button
          className='bg-lime-800 hover:bg-lime-600 py-1 px-4 mb-2 
            text-white text-base rounded'
          onClick={() => updatePassword()}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}


export default UpdatePassword