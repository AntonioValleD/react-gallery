// React hooks
import { useEffect, useState } from 'react'

// CSS documents
import 'animate.css'

//Redux toolkit hooks
import { useSelector, useDispatch } from 'react-redux'

// Redux toolkit reducers
import { changeModalStatus } from '../features/modalSlice/modalSlice'
import { 
  setActiveFilters,
  bootstrapFilterList
} from '../features/filterSlice/filterListSlice'
import { setFilteredImageList } from '../features/imageSlice/imageSlice'
import { GiCheckMark } from "react-icons/gi"


const FilterMenu = () => {
  // Hooks
  const dispatch = useDispatch()


  // Redux state
  const appConfig = useSelector(state => state.appConfig)
  const imageList = useSelector(state => state.imageList).imageList
  const filterList = useSelector(state => state.filterList).filterList
  const activeFilters = useSelector(state => state.filterList).activeFilters


  // Local component state
  const [closeButton, setCloseButton] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState(activeFilters)
  const [fullFilterName, setFullFliterName] = useState([])
  const [animationController, setAnimationController] = useState([])


  // Button functions
  const closeFilterMenu = () => {
    filterImageList()

    dispatch(setActiveFilters({
      activeFilters: selectedFilters
    }))

    if (closeButton){
      dispatch(changeModalStatus({
        modalName: "filterMenu",
        modalStatus: false
      }))
    }
  }

  // Show filter data
  const showFilterData = (filterName) => {
    let foundFilter = fullFilterName.find(filter => filter === filterName)

    let newFilterNameList = []
    if (foundFilter){
      fullFilterName.forEach((filter) => {
        if (filter !== filterName){
          newFilterNameList = [...newFilterNameList, filter]
        }
      })

      setAnimationController(newFilterNameList)

      setTimeout(() => {
        setFullFliterName(newFilterNameList)
      }, 250)
    } else {
      setFullFliterName([...fullFilterName, filterName])
      setAnimationController([...fullFilterName, filterName])
    }
  }


  // Filtered image list constructor
  const filterImageList = () => {
    let filteredImageList = []

    imageList.forEach((image) => {
      for (let tag in image.tags){
        if (selectedFilters.find(filter => filter === image.tags[tag])){
          if (!filteredImageList.includes(image)){
            filteredImageList.push(image)
          }
        }
      }
    })

    dispatch(setFilteredImageList({
      filteredImageList: filteredImageList
    }))
  }


  // Camel case
  const camelCase = (text) => {
    let first = text[0]
    let rest = text.slice(1)

    let newText = first.toUpperCase() + rest

    return newText
  }


  // Select filter option
  const selectFilterOption = (data) => {
    let allSelectedFilters = [...selectedFilters]
    let selectedData = selectedFilters.find(filter => filter === data)

    if (selectedData){
      allSelectedFilters.splice(allSelectedFilters.indexOf(data), 1)
      setSelectedFilters(allSelectedFilters)
    } else {
      allSelectedFilters.push(data)
      setSelectedFilters(allSelectedFilters)
    }
  }


  // Compare filter arrays
  const compareArrays = (array1, array2) => {
    for (let item of array1){
      if (array2.includes(item)){
        return true
      }
    }
    return false
  }


  useEffect(() => {
    filterImageList()
    dispatch(bootstrapFilterList({
      imageList: imageList,
      tagList: appConfig.userInfo.tags
    }))
  }, [])


  return (
    <div
      className={`fixed w-screen h-screen top-0 left-0 z-20 flex items-start 
        justify-start ${closeButton ? 'bg-white/0' : 'bg-black/60'}`}
    >
      <div 
        className={`h-screen relative p-4 bg-gray-950 shadow-xl shadow-gray-700 text-white animate__animated ${closeButton ? 'animate__fadeOutLeft' : 'animate__fadeInLeft'} animate__faster z-20`}
        style={{ width: "250px" }}
        onAnimationEnd={() => closeFilterMenu()}
      >
        <h3
          className='flex justify-center items-center absolute right-3 top-3 w-8 h-8 rounded-full text-center text-sm text-white bg-lime-700 hover:bg-lime-600 cursor-pointer font-bold'
          onClick={() => setCloseButton(true)}
          title='Guardar filtros'
        >
          <GiCheckMark/>
        </h3>

        <h1
          className='text-xl text-center pr-10 mb-4'
        >
          Filtrar por...
        </h1>

        {filterList.map((filter) => (
          <div
            className='mb-2'
            key={filter.filterName}
          >
            <h1
              className={`cursor-pointer select-none font-semibold hover:text-blue-300
                ${compareArrays(filter.filterData, selectedFilters) ? 'text-lime-400' : 'text-white'}`}
              onClick={() => showFilterData(filter.filterName)}
            >
              {filter.filterName}
            </h1>
            {
              fullFilterName.find(filterTag => filterTag === filter.filterName) ? 
              filter.filterData.map((data) => (
                <div
                  className={`ml-3 cursor-pointer hover:text-blue-300 animate__animated 
                    animate__faster ${animationController.find(fName => fName === filter.filterName) ? 
                    'animate__slideInLeft': 'animate__slideOutLeft'} select-none
                    ${selectedFilters.includes(data) ? 'text-lime-200' : 'text-white'}`}
                  key={data}
                  onClick={() => selectFilterOption(data)}
                >
                  <input
                    className='mr-2 cursor-pointer'
                    type='checkbox'
                    onChange={() => console.log()}
                    checked={selectedFilters.find(filter => filter === data) ? true : false}
                  />
                  <label
                    className='cursor-pointer text-sm'
                  >
                    {camelCase(data)}
                  </label>
                </div>
              )) : null
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterMenu