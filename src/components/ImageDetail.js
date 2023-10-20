import React, { useEffect } from 'react'
import axios from 'axios'
import "animate.css"
import toast, { Toaster } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef } from 'react'
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { editImageTitle, editImageFilters, deleteLocalImage, setChangeCarouselImage } from '../features/imageSlice/imageSlice'
import { DateTime } from 'luxon'
import { AiFillEdit } from 'react-icons/ai'
import { BiSolidSave } from 'react-icons/bi'
import { HiPlus } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { RiDeleteBinFill } from 'react-icons/ri'
import { MdOutlineClose } from "react-icons/md"
import DataTable from 'react-data-table-component'
import ImageCarrousel from './ImageCarrousel'

const ImageDetail = (props) => {
  // Hooks
  const dispatch = useDispatch()
  const appConfig = useSelector(state => state.appConfig)
  const currentImage = useSelector(state => state.imageList).selectedImage
  const changeImage = useSelector(state => state.imageList).changeCarouselImage


  // Local component state
  const [selectedImage, setSelectedImage] = useState(currentImage)
  const [closeButton, setCloseButton] = useState(false)
  const [disableTitle, setDisableTitle] = useState(true)
  const [imgTitle, setImgTitle] = useState(selectedImage.title)
  const [metadataConfig, setMetadataConfig] = useState({
    configMode: "",
    disableInputs: true,
  })
  const [filters, setFilters] = useState(selectedImage.filters)
  const [selectedFilter, setSelectedFilter] = useState({})


  // Close full image modal
  const closeFullImg = () => {
    if (changeImage){
      setSelectedImage(currentImage)
      dispatch(setChangeCarouselImage(false))
    }
    
    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "imageDetail",
        modalStatus: false
      })) 
    }  
  }


  // Data table config
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
      name: "Dato",
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
        minHeight: "240px",
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
      when: row => parseInt(row.no) === selectedFilter.no,
      style: {
        backgroundColor: 'green',
        color: "white"
      }
    },
  ]


  // Input references
  const titleInputRef = useRef(null)
  const filterNameInputRef = useRef(null)
  const filterDataInputRef = useRef(null)


  // Metadata futton functions
  const addNewFilter = () => {
    setSelectedFilter({
      filterName: "",
      filterData: ""
    })
    setMetadataConfig({
      configMode: "Add",
      disableInputs: false,
    })
  }

  const cancelMetadataOperation = () => {
    setSelectedFilter({
      filterName: "",
      filterData: ""
    })
    setMetadataConfig({
      configMode: "",
      disableInputs: true,
    })
  }

  const editFilter = () => {
    if (!selectedFilter.filterName || selectedFilter.filterName === ""){
      return
    }
    setMetadataConfig({
      configMode: "Edit",
      disableInputs: false,
    })  
  }

  const checkFilterData = () => {
    if (selectedFilter.filterName === ""){
      filterNameInputRef.current.focus()
      return false
    } else if (selectedFilter.filterData === ""){
      filterDataInputRef.current.focus()
      return false
    } else {
      return true
    }
  }

  const saveFilter = async () => {
    if (!checkFilterData()){
      return
    }

    let allImgFilters
    switch (metadataConfig.configMode){
      case "Add":
        let newFilter

        if (filters && filters.length > 0){
          allImgFilters = [...filters]
        } else {
          allImgFilters = []
        }

        newFilter = {
          ...selectedFilter,
          no: allImgFilters.length + 1,
        }

        allImgFilters.push(newFilter)

        try {
          await axios.patch(`${appConfig.serverUrl}/images`, {
            id: selectedImage._id,
            filters: allImgFilters
          }, {
            headers: {
              "Authorization": `JWT ${appConfig.token}`,
              "Content-Type": "application/json"
            }
          })

          dispatch(editImageFilters({
            id: selectedImage._id,
            filters: allImgFilters,
          }))

          toast.success("Información guardada correctamente")

          setFilters(allImgFilters)

          setSelectedFilter({
            filterName: "",
            filterData: "",
          })
        } catch (error) {
          toast.error("No se pudo guardar la información")
        }
        break
      
      case "Edit": 
        allImgFilters = [...filters]

        allImgFilters[allImgFilters.indexOf(allImgFilters.find(imgFilter => imgFilter.no === selectedFilter.no))] = selectedFilter

        try {
          await axios.patch(`${appConfig.serverUrl}/images`, {
            id: selectedImage._id,
            filters: allImgFilters
          }, {
            headers: {
              "Authorization": `JWT ${appConfig.token}`,
              "Content-Type": "application/json"
            }
          })

          setFilters([...allImgFilters])

          setSelectedFilter({
            filterName: "",
            filterData: "",
          })

          toast.success("Información guardada correctamente")
        } catch (error) {
          toast.error("No se pudo guardar la información")
        }

        break
      default:
        break
    }


    setMetadataConfig({
      configMode: "",
      disableInputs: true,
    })
  }

  const deleteFilter = async () => {
    if (!selectedFilter.no){
      return
    }

    let allFilters = []
    let counter = 1
    filters.forEach((filter) => {
      if (selectedFilter.no !== filter.no){
        let newFilter = {
          filterName: filter.filterName,
          filterData: filter.filterData,
          no: counter
        }
        allFilters.push(newFilter)
        counter ++
      }
    })

    try {
      await axios.patch(`${appConfig.serverUrl}/images`, {
        id: selectedImage._id,
        filters: allFilters
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "application/json"
        }
      })

      dispatch(editImageFilters({
        id: selectedImage._id,
        filters: allFilters,
      }))

      toast.success("Información guardada correctamente")

      setFilters(allFilters)

      setSelectedFilter({
        filterName: "",
        filterData: "",
      })
    } catch (error) {
      toast.error("No se pudo guardar la información")
    }
  }

  const editImage = async (inputName) => {
    if (inputName === "title"){
      if (disableTitle){
        setDisableTitle(false)
      } else {
        // Save new title
        if (imgTitle === ""){
          titleInputRef.current.focus()
          return
        } else {
          // Patch request
          try {
            await axios.patch(`${appConfig.serverUrl}/images`, {
              id: selectedImage._id,
              title: imgTitle
            }, {
              headers: {
                "Authorization": `JWT ${appConfig.token}`,
                "Content-Type": "application/json"
              }
            })

            dispatch(editImageTitle({
              id: selectedImage._id,
              title: imgTitle
            }))

            toast.success("El titulo de la imagen se actualizó correctamente")

            setDisableTitle(true)
          } catch (error) {
            toast.error("Error al actualizar los datos")
          }
        }
      }
    }
  }


  // Delete image
  const deleteImage = async () => {
    try {
      await axios.post(`${appConfig.serverUrl}/images/delete`, {
        id: selectedImage._id,
        imgKey: selectedImage.key
      }, {
        headers: {
          "Authorization": `JWT ${appConfig.token}`,
          "Content-Type": "application/json"
        }
      })

      dispatch(deleteLocalImage({
        id: selectedImage._id
      }))

      props.successFn("La imagen se eliminó correctamente")

      setCloseButton(true)
    } catch (error) {
      console.log(error);
      toast.error("La imagen no pudo ser eliminada")
    }
  }


  // Handle filter input values
  const filterInputValues = (event) => {
    setSelectedFilter({
      ...selectedFilter,
      [event.target.name]: event.target.value
    })
  }


  return (
    <div 
      className={`flex fixed w-screen h-screen top-0 right-0 items-center 
        justify-center ${closeButton ? 'bg-white/0' : 'bg-black/60'}`}
        style={{zIndex: "11"}}
    >
      <Toaster
        toastOptions={{
          position: "top-center",
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      <div 
        className={`h-fit mb-16 w-fit relative rounded-lg p-4 bg-gray-950 shadow-xl shadow-gray-700 animate__animated animate__faster ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'} ${changeImage ? 'animate__fadeOut': 'animate__fadeIn'}`}
        onAnimationEnd={() => closeFullImg()}
      >
        <h3
          className='flex justify-center items-center absolute right-2 top-2 w-8 h-8 rounded-full text-center text-xl font-medium text-white bg-red-700 hover:bg-red-600 cursor-pointer'
          onClick={() => setCloseButton(true)}
        >
          <MdOutlineClose/>
        </h3>

        <div
          className="flex gap-x-4"
        >
          <img
            className={`border border-lime-700 rounded-md`}
            style={{maxHeight: "500px"}}
            alt={selectedImage._id}
            src={selectedImage.url}
          />

          <div
            className='bg-gray-900 w-96 text-white text-center'
          >
            <h3
              className='flex justify-center items-center gap-x-1 text-center text-xl select-none my-3'
            >
              <RiDeleteBinFill
                title='Eliminar imagen'
                className='hover:text-red-400 cursor-pointer'
                onClick={() => deleteImage()}
              />
              Información
            </h3>

            <div
              className="flex justify-between w-full"
            >
              <div className='flex flex-col'>
                <div className='flex items-center justify-center'>
                  <label
                    className='cursor-pointer'
                    onClick={() => editImage("title")}
                  >
                    {
                      disableTitle ? 
                      <AiFillEdit title='Editar' className='hover:text-yellow-300'/> : 
                      <BiSolidSave title='Guardar' className='hover:text-lime-400'/>
                    }
                  </label>
                  <label className='px-1'>
                    Título de imagen:
                  </label>
                </div>
                <input 
                  className={`px-1 text-center rounded ${disableTitle ? 'text-white' : 'text-black'}`}
                  disabled={disableTitle}
                  value={imgTitle}
                  onChange={(event) => setImgTitle(event.target.value)}
                />
              </div>

              <div className='flex flex-col'>
                <label className='px-1'>
                  Nombre del archivo:
                </label>
                <input className={`px-1 text-center rounded text-white overflow-ellipsis`}
                  disabled
                  value={selectedImage.fileName}
                />
              </div>
            </div>

            <div
              className="flex justify-between w-full mt-2"
            >
              <div className='flex flex-col'>
                <label className='px-1'>
                  Fecha de subida:
                </label>
                <input className='px-1 text-center rounded'
                  disabled
                  value={DateTime.fromISO(selectedImage.uploadDate).toLocaleString(DateTime.DATE_FULL)}
                />
              </div>

              <div className='flex flex-col'>
                <label className='px-1'>
                  Hora de subida:
                </label>
                <input className='px-1 text-center rounded'
                  disabled
                  value={`${DateTime.fromISO(selectedImage.uploadDate).toLocaleString(DateTime.TIME_24_WITH_SECONDS)} Hrs`}
                />
              </div>
            </div>

            <div className='flex items-center justify-center mt-4'>
              <div className='flex items-center justify-center gap-x-1'>
                <label
                  className='flex text-lg text-white'
                >
                  {
                    metadataConfig.disableInputs ?
                    <HiPlus 
                      title='Nuevo'
                      className='hover:text-lime-400 cursor-pointer'
                      onClick={() => addNewFilter()}
                    /> :
                    <AiOutlineClose 
                      title='Cancelar'
                      className='hover:text-red-400 cursor-pointer'
                      onClick={() => cancelMetadataOperation()}
                    />
                  }
                </label>
                <label
                  className='cursor-pointer flex gap-x-1'
                >
                  {
                    metadataConfig.disableInputs ? 
                    <AiFillEdit 
                      title='Editar'
                      className='hover:text-yellow-300'
                      onClick={() => editFilter()}
                    /> : 
                    <BiSolidSave 
                      title='Guardar'
                      className='hover:text-lime-400'
                      onClick={() => saveFilter()}
                    />
                  }
                  <RiDeleteBinFill
                    title='Eliminar'
                    className='hover:text-red-400 cursor-pointer'
                    onClick={() => deleteFilter()}
                  />
                </label>
              </div>

              <label className='px-2 text-lg select-none'>
                Etiquetas
              </label>
            </div>

            <div
              className="flex justify-between w-full"
            >
              <div className='flex flex-col'>
                <label className='px-1 select-none'>
                  Etiqueta:
                </label>
                <input className={`px-1 text-center rounded ${metadataConfig.disableInputs ? 'text-white' : 'text-black'}`}
                  disabled={metadataConfig.disableInputs}
                  value={selectedFilter.filterName}
                  name="filterName"
                  ref={filterNameInputRef}
                  onChange={(event) => filterInputValues(event)}
                />
              </div>

              <div className='flex flex-col'>
                <label className='px-1 select-none'>
                  Valor:
                </label>
                <input className={`px-1 text-center rounded ${metadataConfig.disableInputs ? 'text-white' : 'text-black'}`}
                  disabled={metadataConfig.disableInputs}
                  value={selectedFilter.filterData}
                  name="filterData"
                  ref={filterDataInputRef}
                  onChange={(event) => filterInputValues(event)}
                />
              </div>
            </div>

            <div
              className='rounded mt-2'
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
                fixedHeaderScrollHeight='240px'
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={(row) => setSelectedFilter(row)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-0 right-0 left-0 w-full animate__animated ${closeButton ? 'animate__fadeOut' : 'animate__fadeIn'}`}
      >
        <ImageCarrousel/>
      </div>
    </div>
  )
}

export default ImageDetail