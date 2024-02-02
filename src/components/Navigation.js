// Redux hooks
import { useSelector, useDispatch } from 'react-redux'

// Redux reducer
import { changeModalStatus } from '../features/modalSlice/modalSlice'

// React icons
import { IoIosMenu } from "react-icons/io"


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
      title='Filtrar imágenes'
      className='flex justify-between items-center px-4 h-14 text-white bg-black'
    >
      <button
        className="flex flex-col justify-center items-center cursor-pointer text-5xl
          hover:text-lime-400"
        onClick={() => openFilterMenu()}
      >
        <IoIosMenu/>
      </button>

      <h1 className='text-3xl select-none'>Galería</h1>

      <div
        title='Usuario'
        className='rounded-full bg-lime-600 h-10 w-10 flex justify-center items-center 
          cursor-pointer hover:bg-lime-500'
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