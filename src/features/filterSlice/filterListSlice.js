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
      const imageList = [...action.payload]
      if (!imageList || imageList.length === 0){
        return
      }

      let allFilters = []

      imageList.forEach((image) => {
        if (image.filters && image.filters.length !== 0){
          image.filters.forEach((filter) => {
            let foundFilter = allFilters.find(savedFilter => savedFilter.filterName === filter.filterName)

            if (foundFilter){
              let foundData = foundFilter.filterData.find(data => data.toLowerCase() === filter.filterData.toLowerCase())

              if (!foundData){
                allFilters.find(sfilter => sfilter.filterName === filter.filterName).filterData.push(filter.filterData.toLowerCase())
              }
            } else {
              let newFilter = {
                filterName: filter.filterName,
                filterData: [filter.filterData.toLowerCase()]
              }

              allFilters.push(newFilter)
            }
          })
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