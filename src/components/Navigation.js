import React from 'react'
import { useDispatch } from 'react-redux'
import { changeModalStatus } from '../features/modalSlice/modalSlice'


const Navigation = () => {
  // Hooks
  const dispatch = useDispatch()


  // Button functions
  const openNewImageForm = () => {
    dispatch(changeModalStatus({
      modalName: "addImage",
      modalStatus: true
    }))
  }

  const openFilterMenu = () => {
    dispatch(changeModalStatus({
      modalName: "filterMenu",
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

      <button
        className='bg-lime-700 hover:bg-lime-600 text-white w-fit py-1 px-2 rounded-md'
        onClick={() => openNewImageForm()}
      >
        Subir imagen
      </button>
    </div>
  )
}

export default Navigation