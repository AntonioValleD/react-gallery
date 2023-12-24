import { useState, useEffect } from "react"


const useScreenSize = () => {
  // Local component state
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)


  // Update state on resize
  const handleResize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }


  // Add event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize)
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  
  return { 
    width: width,
    height: height
  }
}


export default useScreenSize