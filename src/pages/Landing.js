// CSS documents
import './Landing.css'
import 'animate.css'

// Assets
import vid1 from '../assets/video/vid1.mp4'
import vid2 from '../assets/video/vid2.mp4'

// React hooks
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

// Custom hooks
import useScreenSize from "../hooks/useScreenSize"

// React icons
import { FaFacebookF } from "react-icons/fa"
import { FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa"
import { FaYoutube } from "react-icons/fa"
import { FaExternalLinkAlt } from "react-icons/fa"
import { IoMenu } from "react-icons/io5"
import { IoClose } from "react-icons/io5"


const Landing = () => {
  // Hooks
  const navigate = useNavigate()

  const screenWidth = useScreenSize().width
  const screenHeight = useScreenSize().height


  // Local component state
  const [menuBtnStatus, setMenuBtnStatus] = useState(false)
  const [closeMenu, setCloseMenu] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(vid1)


  // Go to login page
  const goToLogin = () => {
    navigate("/login")
  }

  // Go to sign up page
  const goToSignUp = () => {
    navigate("/signup")
  }


  // Close/Open menu
  const closeOpenMenu = () => {
    if (!menuBtnStatus) {
      setMenuBtnStatus(true)
    } else {
      setCloseMenu(true)
    }
  }

  const animationEnd = () => {
    if (closeMenu) {
      setMenuBtnStatus(false)
      setCloseMenu(false)
    }
  }

  
  // Reset state values
  useEffect(() => {
    if (screenWidth > 1000) {
      setMenuBtnStatus(false)
      setCloseMenu(false)
    }
  }, [screenWidth])


  return (
    <div
      className=""
    >
      <header
        className="top-0 absolute left-0 w-full flex justify-between items-center
          transition-all duration-400 ease-linear z-50 bg-black"
      >
        <button
          className="text-white text-xl font-bold uppercase"
        >
          Gallery
        </button>

        <button
          className="menuBtn"
          onClick={() => closeOpenMenu()}
        >
          {
            !menuBtnStatus ?
            <IoMenu/> :
            <IoClose/>
          }
        </button>

        <div
          className={`animate__animated relative navigation ${menuBtnStatus ? 
            "showMenu animate__fadeIn bg-black/70" : ""} animate__faster
            ${closeMenu ? "animate__fadeOut" : ""}`}
          onAnimationEnd={() => animationEnd()}
        >
          <div
            className={`${menuBtnStatus ? "navigationItems" : "headerItems"}`}
          >
            <button
              className="navigationButtons"
              onClick={() => goToLogin()}
            >
              Log In
            </button>

            <button
              className="navigationButtons"
              onClick={() => goToSignUp()}
            >
              Sign Up
            </button>

            <button
              className="navigationButtons"
            >
              Log Out
            </button>

            <button
              className="navigationButtons"
            >
              My Images
            </button>

            <button
              className="navigationButtons"
            >
              My Tags
            </button>
          </div>
        </div>

      </header>

      <section
        className="relative w-full h-screen flex justify-center
          flex-col bg-lime-600"
      >
        <video src={selectedVideo} autoPlay muted loop className="videoSlider"/>

        <div
          className="z-40 text-white w-9/12 mt-12 content"
        >
          <h1>
            Guarda tus<br/><span>Imagenes</span>
          </h1>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni aliquid
            omnis aliquam expedita autem laboriosam, nihil consequuntur! Expedita
            laborum temporibus, aliquam inventore, ipsum nemo, eveniet natus excepturi
            quod quos mollitia.
          </p>

          <button>
            Read more
          </button>
        </div>

        <div
          className="z-40 absolute flex flex-col transition-all duration-500 
            ease-linear mediaIcons"
        >
          <button
            className=""
            title="Facebook"
          >
            <FaFacebookF/>
          </button>

          <button
            className=""
            title="Instagram"
          >
            <FaInstagram/>
          </button>

          <button
            className=""
            title="TikTok"
          >
            <FaTiktok/>
          </button>

          <button
            className=""
            title="YouTube"
          >
            <FaYoutube/>
          </button>

          <button
            className=""
            title="Pagina web"
          >
            <FaExternalLinkAlt/>
          </button>
        </div>

        <div
          className="sliderNavigation"
        >
          <button
            className={`sliderNavigationButton ${selectedVideo === vid1 ? 
              "bg-lime-950" : "bg-white"}`}
            onClick={() => setSelectedVideo(vid1)}
          />

          <button
            className={`sliderNavigationButton ${selectedVideo === vid2 ? 
              "bg-lime-950" : "bg-white"}`}
            onClick={() => setSelectedVideo(vid2)}
          />
        </div>
      </section>
    </div>
  )
}

export default Landing
