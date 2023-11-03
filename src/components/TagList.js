// Hook import
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Component import
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

// Redux reducer import
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { setUserData } from '../features/appConfigSlice.js/appConfigSlice'

// React icons import
import { MdOutlineClose } from "react-icons/md"
import { RiDeleteBinFill } from "react-icons/ri"
import { AiFillSave } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { AiFillEdit } from "react-icons/ai"


const TagList = (props) => {
  // Hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appConfig =  useSelector(state => state.appConfig)


  // Local component state
  const [tagListArray, setTagListArray] = useState([
    "Lugar",
    "Fecha",
    "Evento",
    "Persona"
  ])

  const [closeButton, setCloseButton] = useState(false)

  const [hoverTag, setHoverTag] = useState("")

  const [componentActions, setComponentActions] = useState({
    addNewTag: false,
    editArrayTag: false,
  })

  const [newTagName, setNewTagName] = useState("")


  // Close new image form
  const closeTagList = () => {
    if (closeButton){
      if (props.update){
        dispatch(changeModalStatus({
          modalName: "tagList",
          modalStatus: false
        }))

      } else {
        navigate("/images")
      }
    }
  }


  // Input references
  const newTagInputRef = useRef(null)


  // Add new tag function
  const saveNewTag = () => {
    if (newTagName === ""){
      toast.error("La etiqueta esta vacia")
    } else {
      let newTagList = [
        ...tagListArray,
        newTagName
      ]
  
      setTagListArray(newTagList)

      setComponentActions({
        ...componentActions,
        addNewTag: false
      })

      setNewTagName("")

      toast.success("Nueva etiqueta añadida")
    }
  }


  // Delete tag function
  const deleteTag = (tag) => {
    let newTagList = [...tagListArray]

    newTagList.splice(newTagList.indexOf(newTagList.find(arrayTag => arrayTag === tag)), 1)

    setTagListArray(newTagList)

    toast.success("Etiqueta eliminada")
  }


  // Save tag list
  const saveTagList = async () => {
    if (tagListArray.length === 0){
      toast.error("Debe agregar por lo menos una etiqueta para continuar")
    } else {
      dispatch(setUserData({
        dataName: "tags",
        dataInfo: [...tagListArray]
      }))

      await axios.patch(`${appConfig.serverUrl}/auth/users`, {
        email: appConfig.userInfo.email,
        tags: [...tagListArray]
      }, {
        headers: {
          Authorization: `JWT ${appConfig.token}`
        }
      })

      toast.success("Etiquetas guardadas con exito")

      setTimeout(() => {
        setCloseButton(true)
      }, 1700)
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
          duration: 1700,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '2px',
          },
        }}
      />

      <div 
        className={`relative rounded-lg p-4 bg-gray-950 shadow-xl shadow-gray-700 text-white animate__animated ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'} flex flex-col animate__faster`}
        style={{ width: "230px", maxHeight: "350px" }}
        onAnimationEnd={() => closeTagList()}
      >
        {
          props.update ?
          <h3
            className='flex justify-center items-center absolute right-2 top-2 w-8 h-8 rounded-full text-center text-xl text-white bg-red-700 hover:bg-red-500 cursor-pointer'
            onClick={() => setCloseButton(true)}
            title='Cerrar'
          >
            <MdOutlineClose/>
          </h3> :
          ""
        }

        <h3
          className='text-center text-xl'
        >
          Etiquetas
        </h3>

        <div
          className={`my-2 ${tagListArray.length >= 10 ? "overflow-y-scroll"
            : ""}`}
        >
          {
            tagListArray.map((tag) => (
              <div
                key={tag}
              >
                <div
                  className='py-px px-2 flex justify-between items-center
                    hover:bg-gray-800 transition-all duration-75'
                  onMouseEnter={() => setHoverTag(tag)}
                  onMouseLeave={() => setHoverTag("")}
                  onDoubleClick={() => setComponentActions({
                    ...componentActions,
                    editArrayTag: true
                  })}
                >
                  <label
                    className='text-lg'
                  >
                    {tag}
                  </label>

                  {
                    hoverTag === tag ?
                      <div
                        className='flex gap-x-1'
                      >
                        <label
                          title='Editar etiqueta'
                          className='hover:text-yellow-400 transition-all duration-75 cursor-pointer'
                          onClick={() => setComponentActions({
                            ...componentActions,
                            editArrayTag: true
                          })}
                        >
                          <AiFillEdit/>
                        </label>

                        <label
                          title='Eliminar etiqueta'
                          className='hover:text-red-400 transition-all duration-75 cursor-pointer'
                          onClick={() => deleteTag(tag)}
                        >
                          <RiDeleteBinFill/>
                        </label>
                      </div>
                    :
                      null
                  }
                </div>
              </div>
            ))
          }

          {
            componentActions.addNewTag ?
            <div
              className='flex items-center px-2 my-1 justify-between gap-x-2'
            >
              <input
                className='text-base w-full rounded text-black px-1'
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
                ref={newTagInputRef}
              />

              <div
                className='flex items-center gap-x-1'
              >
                <label
                  className='hover:text-lime-400 transition-all duration-75 cursor-pointer'
                  title='Guardar etiqueta'
                  onClick={() => saveNewTag()}
                >
                  <AiFillSave/>
                </label>

                <label
                  className='hover:text-red-400 transition-all duration-75 cursor-pointer text-lg'
                  title='Cancelar'
                  onClick={() => setComponentActions({
                    ...componentActions,
                    addNewTag: false
                  })}
                >
                  <MdOutlineClose/>
                </label>
              </div>
            </div>
            :
            ""
          }
        </div>
        
        <div
          className='flex justify-center gap-x-8 mt-1'
        >
          <h3
            className='flex justify-center items-center w-8 h-8 rounded-full text-center text-xl text-white bg-lime-800 hover:bg-lime-600 cursor-pointer'
            onClick={() => setComponentActions({
              ...componentActions,
              addNewTag: true
            })}
            title='Añadir etiqueta'
          >
            <MdAdd/>
          </h3>

          <h3
            className='flex justify-center items-center w-8 h-8 rounded-full text-center text-xl text-white bg-lime-800 hover:bg-lime-600 cursor-pointer'
            onClick={() => saveTagList()}
            title='Guardar cambios'
          >
            <AiFillSave/>
          </h3>
        </div>
      </div>
    </div>
  )
}

export default TagList