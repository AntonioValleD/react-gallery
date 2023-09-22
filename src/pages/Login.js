import React from "react"
import axios from "axios"
import "./Login.css"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { setAppConfig } from "../features/appConfigSlice.js/appConfigSlice"
import toast, { Toaster } from 'react-hot-toast'
import { saveImageList } from '../features/imageSlice/imageSlice'
import { bootstrapFilterList } from "../features/filterSlice/filterListSlice"


const Login = () => {
  // Hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // State constants
  const appConfig = useSelector(state => state.appConfig)
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)


  // Check user token
  if (appConfig.token !== ""){
    //navigate("/images")
  }


  // Set user input values
  const inputValue = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    })
  }


  // Name to short name
  const nameToShort = (userName) => {
    let shortName = userName[0]
    for (let i = 0; i < userName.length; i++){
      if (userName[i] === " "){
        shortName += userName[i + 1]
        return shortName
      }
    }
  }


  // User login
  const submitLogin = async (event) => {
    event.preventDefault()

    if (!checkUserCredentials()){
      return
    }

    try {
      const { data } = await axios.post(`${appConfig.serverUrl}/auth/login`, userInfo)
      
      dispatch(setAppConfig({
        configName: "token",
        configPayload: data.token,
      }))

      let userData = {...data.userInfo}
      userData["shortName"] = nameToShort(data.userInfo.name)
      userData["profileImageUrl"] = ""

      dispatch(setAppConfig({
        configName: "userInfo",
        configPayload: userData,
      }))

      await fetchImages(data.token)

      toast.loading("Cargando imagenes...")
      setTimeout(() => {
        navigate(`/images`)
      }, "2000")

    } catch (error) {
      console.log(error);
      toast.error("El usuario o contraseña es incorrecto")
    }
  }


  // Check user info
  const checkEmailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
  const checkUserCredentials = () => {
    if (!checkEmailRegex.test(userInfo.email)){
      toast.error("El correo ingresado no es valido!")
      return false
    } else if (userInfo.password.length < 8){
      toast.error("La contraseña debe contener al menos 8 caracteres!")
      return false
    } else {
      return true
    }
  }


  // Show/Hide password
  const showHidePassword = () => {
    if (showPassword){
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }


  // Getting images from database
  const fetchImages = async (token) => {
    try {
      const response = await axios.get(`${appConfig.serverUrl}/images`, {
        headers: {
          Authorization: `JWT ${token}`
        }
      })

      dispatch(saveImageList({
        imageList: response.data
      }))

      dispatch(bootstrapFilterList(response.data))

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    // Erasing token
    dispatch(setAppConfig({
      configName: "token",
      configPayload: "",
    }))
  }, [])


  return (
    <div 
      className="flex h-screen w-screen bg-gray-50 justify-center items-center"
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
        className='bg-black text-white rounded-2xl px-10 py-8 login-width h-fit'
      >
        <h2 
          className='text-center text-2xl border-1'
        >
          Iniciar sesión
        </h2>
        <form
          onSubmit={(event) => inputValue(event)}
          className="flex flex-col"
        >
          <label className='mt-3 px-2 text-md'>
            Correo electronico:
          </label>
          <input
            type='email'
            name="email"
            placeholder="ejemplo@email.com"
            className='my-2 rounded-md text-black px-2 py-0.5 text-base'
            required
            onChange={(event) => inputValue(event)}
          >
          </input>

          <label className='mt-2 px-2 text-md'>
            Contraseña:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className='my-2 rounded-md text-black px-2 py-0.5 text-base'
            required
            onChange={(event) => inputValue(event)}
          >
          </input>
          <div className="flex gap-x-2 pl-1">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => showHidePassword()}
            />
            <label
              className="cursor-pointer select-none hover:text-lime-300 text-sm"
              onClick={() => showHidePassword()}
            >
              Mostrar contraseña
            </label>
          </div>

          <label
            className="text-sm mt-2 pl-1 select-none"
          >
            ¿Aún no tienes una cuenta? <span 
              className="underline hover:text-lime-300 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Registrate aquí
            </span>
          </label>

          <button
            className='rounded-md mt-5 text-xl bg-lime-700 hover:bg-lime-600 py-1'
            onClick={(event) => submitLogin(event)}
          >
            Iniciar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
