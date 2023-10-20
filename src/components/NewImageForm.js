import React from 'react'
import axios from 'axios'
import { useState, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineClose } from "react-icons/md"
import DataTable from 'react-data-table-component'
import addFilterImg from "../assets/img/New green.png"
import deleteFilterImg from "../assets/img/Eliminar red.png"


const NewImageForm = (props) => {
  // Hooks
  const dispatch = useDispatch()
  const appConfig =  useSelector(state => state.appConfig)


  // Local component state
  const [fileInfo, setFileInfo] = useState({
    title: "",
    file: "",
  })

  const [filterInfo, setFilterInfo] = useState({
    no: "",
    filterName: "",
    filterData: ""
  })

  const [filters, setFilters] = useState([])

  const [selectedFilter, setSelectedFilter] = useState()

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


  // Filter functions
  // Input references
  const filterNameInputRef = useRef(null)
  const filterDataInputRef = useRef(null)

  // Handle selected filter
  const selectFilter = (no) => {
    setSelectedFilter(no)
  }

  // Handle filter info values
  const filterInputValues = (event) => {
    setFilterInfo({
      ...filterInfo,
      [event.target.name]: event.target.value,
    })
  }

  // Add filter
  const addNewFilter = () => {
    if (filterInfo.filterName === ""){
      filterNameInputRef.current.focus()
      return
    } else if (filterInfo.filterData === ""){
      filterDataInputRef.current.focus()
      return
    }

    let newFilter = {...filterInfo}
    newFilter.no = filters.length + 1

    setFilters([
      ...filters,
      newFilter
    ])

    setFilterInfo({
      no: "",
      filterName: "",
      filterData: ""
    })
  }

  // Delete filter
  const deleteFilter = () => {
    if (selectedFilter === ""){
      return
    }

    let filterList = [...filters]
    filterList.splice(filterList.indexOf(filterList.find(filter => parseInt(filter.no) === parseInt(selectedFilter))), 1)

    let counter = 1
    filterList.forEach((filter) => {
      filter.no = counter
      counter ++
    })

    setFilters(filterList)

    setSelectedFilter("")
  }


  // Submit inputs references
  const titleInputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Submit image function
  const submitImage = async () => {
    if (fileInfo.title === ""){
      titleInputRef.current.focus()
      return
    } else if (fileInfo.file === ""){
      fileInputRef.current.focus()
      return
    }

    try {
      await axios.post(`${appConfig.serverUrl}/images`, {
        title: fileInfo.title,
        file: fileInfo.file,
        filters: JSON.stringify(filters),
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


  // Getting images from database
  // const fetchImages = async () => {
  //   try {
  //     const response = await axios.get(`${appConfig.serverUrl}/images`, {
  //       headers: {
  //         Authorization: `JWT ${appConfig.token}`
  //       }
  //     })

  //     dispatch(saveImageList({
  //       imageList: response.data
  //     }))

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


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


  // Filters data table component
  const columns = [
    {
      id: "main",
      name: "No.",
      selector: (row) => row.no,
      width: "10%",
      center: true,
    },
    {
      name: "Filtro",
      selector: (row) => row.filterName,
      width: "35%",
      center: true
    },
    {
      name: "Valor",
      selector: (row) => row.filterData,
      with: '55%',
      center: true,
      wrap: true
    },
  ]

  const customStyles = {
    headCells: {
      style: {
        borderBottom: "1px solid black",
        backgroundColor: 'rgb(23 37 84)',
        color: 'white',
        paddingLeft: "8px",
        paddingRight: "0px",
        fontSize: "13px",
        textAlign: 'center',
      }
    },
    cells: {
      style: {
        fontSize: "12px",
        paddingRight: "0px",
        paddingLeft: "0px",
        textAlign: 'center',
        userSelect: 'none',
      },
    },
    table: {
      style: {
        minHeight: "150px",
      }
    },
  }

  const conditionalRowStyles = [
    {
      when: row => parseInt(row.no) % 2 !== 0,
      style: {
        backgroundColor: '#dddddd',
      }
    },
    {
      when: row => parseInt(row.no) === parseInt(selectedFilter),
      style: {
        backgroundColor: 'green',
        color: "white"
      }
    },
  ];


  return (
    <div 
      className={`fixed w-screen h-screen top-0 right-0 z-20 flex items-center 
        justify-center ${closeButton ? 'bg-white/0' : 'bg-black/60'}`}
    >
      <Toaster
        toastOptions={{
          position: "top-center",
          duration: 3000,
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

            <h3 className='text-center text-lg mt-2'>Etiquetas</h3>
            <div
              className='flex justify-between items-end gap-x-2'
            >
              <div
                className='w-5/12'
              >
                <label className='ml-1 text-base'>
                  Etiqueta: 
                </label>
                <input
                  type='text'
                  value={filterInfo.filterName}
                  name='filterName'
                  ref={filterNameInputRef}
                  className='py-px text-sm text-black pl-1 mb-1 rounded w-full bg-gray-50'
                  onChange={(event) => filterInputValues(event)}
                >
                </input>
              </div>

              <div
                className='w-5/12'
              >
                <label className='ml-1 text-base'>
                  Valor: 
                </label>
                <input
                  type='text'
                  value={filterInfo.filterData}
                  name='filterData'
                  ref={filterDataInputRef}
                  className='py-px text-sm text-black pl-1 mb-1 rounded w-full bg-gray-50'
                  onChange={(event) => filterInputValues(event)}
                >
                </input>
              </div>

              <div
                className='flex items-center gap-x-1'
              >
                <img
                  alt='addFilter'
                  src={addFilterImg}
                  className='h-5 mb-1 cursor-pointer'
                  onClick={() => addNewFilter()}
                />

                <img
                  alt='deleteFilter'
                  src={deleteFilterImg}
                  className='h-6 mb-1 cursor-pointer'
                  onClick={() => deleteFilter()}
                />
              </div>
            </div>
            <div
              className='rounded'
            >
              <DataTable
                columns={columns}
                data={filters}
                responsive
                dense={true}
                striped
                selectableRowsHighlight
                highlightOnHover
                customStyles={customStyles}
                defaultSortFieldId={'main'}
                defaultSortAsc={true}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight='150px'
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={(row) => selectFilter(row.no)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewImageForm