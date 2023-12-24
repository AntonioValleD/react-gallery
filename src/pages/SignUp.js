import React from "react"
import axios from "axios"
import "./Login.css"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react"  
import toast, { Toaster } from 'react-hot-toast'


const SignUp = () => {
  // Hooks
  const navigate = useNavigate()


  // State constants
  const appConfig = useSelector(state => state.appConfig)
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    lastName: "",
    age: "",
    gender: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)


  // Check user token
  if (appConfig.token !== ""){
    //navigate("/images")
  }


  // Input references
  const nameInputRef = useRef(null)
  const lastNameInputRef = useRef(null)
  const ageInputRef = useRef(null)
  const genderInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)


  // Set user input values
  const inputValue = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    })
  }


  // User login
  const submitLogin = async (event) => {
    event.preventDefault()

    if (!checkUserCredentials()){
      return
    }

    try {
      await axios.post(`${appConfig.serverUrl}/auth/signup`, userInfo)
      toast.success("Cuenta de usuario creada correctamente!")
      setTimeout(() => {
        navigate("/Login")
      }, "2000")

    } catch (error) {
      console.log(error.response.data.error);
      if (error.response.data.error === "User already exists"){
        toast.error("El correo electrónico ingresado ya está\nasociado a una cuenta de usuario")
      } else {
        toast.error("El usuario o contraseña es incorrecto")
      }
    }
  }


  // Check user info
  const checkEmailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 

  const checkUserCredentials = () => {
    if (userInfo.name === ""){
      toast.error("Ingresa tu nombre para continuar")
      nameInputRef.current.focus()
      return false

    } else if (userInfo.lastName === ""){
      toast.error("Ingresa tu apellido para continuar")
      lastNameInputRef.current.focus()
      return false

    } else if (userInfo.age === ""){
      toast.error("Ingresa tu edad para continuar")
      ageInputRef.current.focus()
      return false

    } else if (userInfo.gender === ""){
      toast.error("Especifica tu sexo para continuar")
      genderInputRef.current.focus()
      return false

    } else if (!checkEmailRegex.test(userInfo.email)){
      toast.error("El correo ingresado no es valido")
      emailInputRef.current.focus()
      return false

    } else if (userInfo.password.length < 8){
      toast.error("La contraseña debe contener al menos 8 caracteres!")
      passwordInputRef.current.focus()
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
          className='text-center text-2xl border-1 mb-3'
        >
          Crear nueva cuenta
        </h2>
        <form
          onSubmit={(event) => inputValue(event)}
          className="flex flex-col"
        >
          <div className="flex w-full">
            <div className="flex flex-col w-6/12">
              <label className="text-base pl-2">
                Nombre: 
              </label>
              <input
                type="text"
                name="name"
                ref={nameInputRef}
                className='my-2 rounded-md text-black px-2 py-0.5 text-base'
                onChange={(event) => inputValue(event)}
              />
            </div>
            <div className="flex flex-col px-2 w-6/12 ml-2">
              <label className="pl-2">
                Apellido: 
              </label>
              <input
                type="text"
                name="lastName"
                ref={lastNameInputRef}
                className='my-2 rounded-md text-black px-2 py-0.5 text-base'
                onChange={(event) => inputValue(event)}
              />
            </div>
          </div>
          <div className="flex justify-between text-base w-full">
            <div className="flex flex-col w-6/12">
              <label className="text-base pl-2">
                Edad: 
              </label>
              <input
                type="number"
                name="age"
                ref={ageInputRef}
                className='my-2 rounded-md text-black px-2 py-0.5 text-base'
                onChange={(event) => inputValue(event)}
              />
            </div>
            <div className="flex flex-col px-2 w-6/12 ml-2">
              <label className="pl-2">
                Sexo: 
              </label>
              <select
                type="select"
                name="gender"
                ref={genderInputRef}
                className='my-2 rounded-md text-black px-2 py-0.5 text-base'
                onChange={(event) => inputValue(event)}
              >
                <option value="">--Seleccionar--</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
          </div>

          <label className='mt-1 px-2 text-base'>
            Correo electronico:
          </label>
          <input
            type='email'
            name="email"
            placeholder="ejemplo@email.com"
            ref={emailInputRef}
            className='my-2 rounded-md text-black px-2 py-0.5 text-base'
            onChange={(event) => inputValue(event)}
          />

          <label className='mt-1 px-2 text-base'>
            Contraseña:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            ref={passwordInputRef}
            className='my-2 rounded-md text-black px-2 py-0.5 text-base'
            onChange={(event) => inputValue(event)}
          />
          <div className="flex gap-x-2 pl-1">
            <input
              type="checkbox"
              checked={showPassword}
              required
              onChange={() => showHidePassword()}
            />
            <label
              className="cursor-pointer select-none hover:text-blue-200 text-sm"
              onClick={() => showHidePassword()}
            >
              Mostrar contraseña
            </label>
          </div>

          <label
            className="text-sm mt-1 pl-1 select-none"
          >
            ¿Ya tienes una cuenta? <span 
              className="underline hover:text-blue-200 cursor-pointer"
              onClick={() => navigate("/Login")}
            >
              Inicia sesión aquí
            </span>
          </label>

          <button
            className='rounded-md mt-5 text-xl bg-lime-700 hover:bg-lime-600 py-1'
            onClick={(event) => submitLogin(event)}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp
