import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    token: "",
    serverUrl: "https://image-gallery-server.fly.dev"
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