import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  filterList: [],
  activeFilters: []
}


export const filterListSlice = createSlice({
  name: "filterListSlice",
  initialState: initialState,
  reducers: {
    bootstrapFilterList: (state, action) => {
      const imageList = [...action.payload.imageList]
      const tagList = [...action.payload.tagList]

      if (!imageList || imageList.length === 0){
        return
      }

      let allFilters = []

      // Add tags to filter list
      tagList.forEach((tag) => {
        allFilters.push({
          filterName: tag,
          filterData: []
        })
      })

      imageList.forEach((image) => {
        if (image.tags){
          for (let tag in image.tags){
            if (image.tags[tag] !== ""){
              let foundFilter = allFilters.find(filter => filter.filterName === tag)

              if (foundFilter){
                foundFilter.filterData.push(image.tags[tag])
              }
            }
          }
        }  
      })

      state.filterList = allFilters
    },
    setActiveFilters: (state, action) => {
      let activeFilters = [...action.payload.activeFilters]

      state.activeFilters = activeFilters
    },
    clearFilterDataData: (state) => {
      state.filterList = []
      state.activeFilters = []
    }
  }
})


export const { 
  bootstrapFilterList, 
  setActiveFilters,
  clearFilterDataData
} = filterListSlice.actions

export default filterListSlice.reducer