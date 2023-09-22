import React, { useState } from 'react'
import 'animate.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { setAppConfig } from '../features/appConfigSlice.js/appConfigSlice'
import { BiLogOut } from "react-icons/bi"
import toast, { Toaster } from 'react-hot-toast'


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


  return (
    <div
      className={`fixed w-screen h-screen top-0 right-0 z-10 flex items-start justify-end ${closeButton ? 'bg-white/0' : 'bg-black/30'}`}
    >
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
        className={`h-fit relative p-4 bg-gray-950 shadow-xl shadow-gray-700 text-white animate__animated ${closeButton ? 'animate__fadeOutRight' : 'animate__fadeInRight'} z-20 flex flex-col items-center`}
        style={{ width: "300px" }}
        onAnimationEnd={() => closeUserInfo()}
      >
        <h3
          className='flex justify-center items-center absolute right-3 top-3 w-8 h-8 rounded-full text-center text-sm text-white bg-red-700 hover:bg-red-500 cursor-pointer font-bold'
          onClick={() => setCloseButton(true)}
          title='Guardar filtros'
        >
          X
        </h3>

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
          className='mt-2 text-lg'
        >
          {`${userInfo.name} ${userInfo.lastName}`}
        </label>

        <label
          className='mt-px text-sm text-white/80'
        >
          {`${userInfo.email}`}
        </label>

        <label
          className='flex items-center gap-x-2 text-base mt-8 mb-4 border px-4 py-1 rounded-full hover:bg-white/30 cursor-pointer select-none'
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