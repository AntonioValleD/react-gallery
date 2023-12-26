import { createSlice } from "@reduxjs/toolkit"

// Server url
// "https://image-gallery-server.fly.dev" 
// "http://localhost:4000"


const initialState = {
    token: "",
    serverUrl: "https://image-gallery-server.fly.dev" ,
    userInfo: {
        id: "",
        name: "",
        lastName: "",
        birthdate: "",
        gender: "",
        email: "",
        registerDate: "",
        shortName: "",
        profileImageUrl: "",
        tags: []
    }
}


export const configSlice = createSlice({
    name: "configSlice",
    initialState: initialState,
    reducers: {
        setAppConfig: (state, action) => {
            const configName = action.payload.configName
            const configPayload = action.payload.configPayload

            state[configName] = configPayload
        },
        setProfileImageUrl: (state, action) => {
            const profileImageUrl = action.payload.profileImageUrl

            state.userInfo.profileImageUrl = profileImageUrl
        },
        setUserData: (state, action) => {
          const dataName = action.payload.dataName
          const dataInfo = action.payload.dataInfo

          const userInfo = state.userInfo
          if (userInfo){
            userInfo[dataName] = dataInfo
          }
        }
    }
})


export const { 
    setAppConfig,
    setProfileImageUrl,
    setUserData
} = configSlice.actions

export default configSlice.reducer