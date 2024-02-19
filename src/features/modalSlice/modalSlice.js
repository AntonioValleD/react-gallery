import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  addImage: false,
  imageDetail: false,
  filterMenu: false,
  userInfo: false,
  updateProfileImage: false,
  tagList: false,
  updatePassword: false,
}


export const modalSlice = createSlice({
  name: "modalSlice",
  initialState: initialState,
  reducers: {
    changeModalStatus: (state, action) => {
      const modalName = action.payload.modalName
      const modalStatus = action.payload.modalStatus

      state[modalName] = modalStatus
    },
  },
})


export const { changeModalStatus } = modalSlice.actions

export default modalSlice.reducer
