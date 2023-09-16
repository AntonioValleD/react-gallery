import { configureStore } from "@reduxjs/toolkit"
import imageReducer from "../features/imageSlice/imageSlice"
import appConfigReducer from "../features/appConfigSlice.js/appConfigSlice"
import modalSlice from "../features/modalSlice/modalSlice"
import filterListSlice from "../features/filterSlice/filterListSlice"


export const store = configureStore({
  reducer: {
    imageList: imageReducer,
    appConfig: appConfigReducer,
    modalStatus: modalSlice,
    filterList: filterListSlice,
  },
})
