import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    imageList: [],
    filteredImageList: [],
    selectedImage: {},
    changeCarouselImage: false
}


export const imageSlice = createSlice({
    name: "imageSlice",
    initialState: initialState,
    reducers: {
        saveImageList: (state, action) => {
            const imageList = [...action.payload.imageList]

            state.imageList = imageList
        },

        // Edit image info
        editImageTitle: (state, action) => {
            const id = action.payload.id
            const title = action.payload.title

            const foundImage = state.imageList.find(image => image._id === id)
            if (foundImage){
                foundImage["title"] = title
            }
        },
        editImageFilters: (state, action) => {
            const id = action.payload.id
            const filters = [...action.payload.filters] 

            const selectedImage = state.imageList.find(image => image._id === id)
            if (selectedImage){
                selectedImage["filters"] = filters
            }
        },

        // Delete image
        deleteLocalImage: (state, action) => {
            const id = action.payload.id

            const selectedImage = state.imageList.find(image => image._id === id)
            if (selectedImage){
                state.imageList.splice(state.imageList.indexOf(selectedImage), 1)
            }
        },

        // Set selected image
        setSelectedImage: (state, action) => {
            const imgInfo = {...action.payload.imgInfo}

            state.selectedImage = imgInfo
        },
        setFilteredImageList: (state, action) => {
            let filteredList = [...action.payload.filteredImageList]

            state.filteredImageList = filteredList
        },
        setChangeCarouselImage: (state, action) => {
            if (state.changeCarouselImage){
                state.changeCarouselImage = action.payload
            } else {
                state.changeCarouselImage = action.payload
            }
        }
    }
})


export const { saveImageList, editImageTitle, editImageFilters, deleteLocalImage, setSelectedImage, setFilteredImageList, setChangeCarouselImage } = imageSlice.actions

export default imageSlice.reducer