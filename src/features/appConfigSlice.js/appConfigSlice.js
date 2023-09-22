import { createSlice } from "@reduxjs/toolkit"

// Server url
// "https://image-gallery-server.fly.dev" 
// "http://localhost:4000"


const initialState = {
    token: "",
    serverUrl: "http://localhost:4000",
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
        }
    }
})


export const { setAppConfig } = configSlice.actions

export default configSlice.reducer