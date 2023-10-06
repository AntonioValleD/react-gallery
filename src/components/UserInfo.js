// Style sheet import
import 'animate.css'

// Hook import
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// Redux reducer import
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { setAppConfig } from '../features/appConfigSlice.js/appConfigSlice'

// React icons import
import { BiLogOut } from "react-icons/bi"
import { BsFillKeyFill } from "react-icons/bs"
import { AiFillEdit } from 'react-icons/ai'
import { RiDeleteBinFill } from 'react-icons/ri'
import { MdOutlineClose } from "react-icons/md"
import { AiFillTags } from "react-icons/ai"

// Component import
import toast, { Toaster } from 'react-hot-toast'
import UpdateProfileImage from './UpdateProfileImage'


const UserInfo = () => {
  // Hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // Redux state
  const userInfo = useSelector(state => state.appConfig).userInfo


  // Local component state
  const [closeButton, setCloseButton] = useState(false)


  // Button functions
  const closeUserInfo = () => {
    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "userInfo",
        modalStatus: false
      }))
    }
  }

  // Logout
  const userLogout = () => {
    toast.loading("Cerrando sesión...")

    setTimeout(() => {
      dispatch(setAppConfig({
        configName: "token",
        configPayload: ""
      }))
  
      dispatch(changeModalStatus({
        modalName: "userInfo",
        modalStatus: false
      }))
  
      navigate("/")
    }, 1500)
  }


  // Update profile image
  const updateProfileImage = () => {
    dispatch(changeModalStatus({
      modalName: "updateProfileImage",
      modalStatus: true
    }))
  }


  // Modal window selector
  const modalStatus = useSelector(state => state.modalStatus)
  let modalWindow
  if (modalStatus.updateProfileImage){
    modalWindow = <UpdateProfileImage/>
  }


  return (
    <div
      className={`fixed w-screen h-screen top-0 right-0 z-20 flex items-start justify-end ${closeButton ? 'bg-white/0' : 'bg-black/30'}`}
    >
      {modalWindow}
      <Toaster
        toastOptions={{
          position: "top-center",
          duration: 1200,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      <div 
        className={`h-fit relative p-4 bg-gray-950 shadow-xl shadow-gray-700 text-white animate__animated ${closeButton ? 'animate__fadeOutRight' : 'animate__fadeInRight'} flex flex-col items-center`}
        style={{ width: "300px" }}
        onAnimationEnd={() => closeUserInfo()}
      >
        <h3
          className='flex justify-center items-center absolute right-3 top-3 w-8 h-8 rounded-full text-center text-xl text-white bg-red-700 hover:bg-red-500 cursor-pointer'
          onClick={() => setCloseButton(true)}
          title='Guardar filtros'
        >
          <MdOutlineClose/>
        </h3>

        <div
          className='ml-4 flex items-end'
        >
          <div
            className='w-28 h-28 bg-lime-600 rounded-full mt-4 flex justify-center items-center'
          >
            {
              userInfo.profileImageUrl === "" ?
              <label
                className='text-5xl'
              >
                {userInfo.shortName}
              </label> :
              <img
                alt={userInfo.profileImageUrl}
                src={userInfo.profileImageUrl}
              />
            }
          </div>

          <label
            className='cursor-pointer text-lg hover:text-yellow-300'
            title='Editar foto de perfil'
            onClick={() => updateProfileImage()}
          >
            <AiFillEdit/>
          </label>
        </div>



        <label
          className='mt-2 text-lg'
        >
          {`${userInfo.name} ${userInfo.lastName}`}
        </label>

        <label
          className='mt-px text-sm text-white/80'
        >
          {`${userInfo.email}`}
        </label>

        <div
          className='mt-4 flex justify-center gap-x-6'
        >
          <label
            className='rounded-full border p-1 cursor-pointer text-lg hover:text-yellow-300 hover:border-yellow-300'
            title='Cambiar contraseña'
          >
            <BsFillKeyFill/>
          </label>

          <label
            className='rounded-full border p-1 cursor-pointer text-lg hover:text-yellow-300 hover:border-yellow-300'
            title='Editar información de usuario'
          >
            <AiFillEdit/>
          </label>

          <label
            className='rounded-full border p-1 cursor-pointer text-lg hover:text-yellow-300 hover:border-yellow-300'
            title='Editar etiquetas'
          >
            <AiFillTags/>
          </label>

          <label
            className='rounded-full border p-1 cursor-pointer text-lg hover:text-red-400 hover:border-red-400'
            title='Eliminar cuenta'
          >
            <RiDeleteBinFill/>
          </label>
        </div>

        <label
          className='flex items-center gap-x-2 text-base mt-6 mb-6 border px-4 py-1 rounded-full hover:text-lime-300 hover:border-lime-300 cursor-pointer select-none'
          onClick={() => userLogout()}
        >
          <BiLogOut/>
          Cerrar sesión
        </label>
      </div>
    </div>
  )
}

export default UserInfo