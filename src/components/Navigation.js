import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalStatus } from '../features/modalSlice/modalSlice'


const Navigation = () => {
  // Hooks
  const dispatch = useDispatch()


  // Redux state
  const userInfo = useSelector(state => state.appConfig).userInfo


  // Button functions
  const openFilterMenu = () => {
    dispatch(changeModalStatus({
      modalName: "filterMenu",
      modalStatus: true
    }))
  }

  const openUserInfo = () => {
    dispatch(changeModalStatus({
      modalName: "userInfo",
      modalStatus: true
    }))
  }


  return (
    <div
      className='flex justify-between items-center px-4 py-3 text-white bg-black'
    >
      <div
        className="flex flex-col justify-center items-center gap-y-1.5 cursor-pointer"
        onClick={() => openFilterMenu()}
      >
        <span className='h-0.5 w-10 bg-white rounded-sm'></span>
        <span className='h-0.5 w-10 bg-white rounded-sm'></span>
        <span className='h-0.5 w-10 bg-white rounded-sm'></span>
      </div>

      <h1 className='text-3xl select-none'>Galería</h1>

      <div
        title='Usuario'
        className='rounded-full bg-lime-600 h-10 w-10 flex justify-center items-center cursor-pointer'
        onClick={() => openUserInfo()}
      >
        {
          userInfo.profileImageUrl === "" ?
          <label
            className='cursor-pointer'
          >
            {userInfo.shortName}
          </label> :
          <img
            className='w-10 h-10 rounded-full cursor-pointer'
            alt={userInfo.profileImageUrl}
            src={userInfo.profileImageUrl}
          />
        }
      </div>
    </div>
  )
}

export default Navigation