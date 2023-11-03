import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ImageGallery from './pages/ImageGallery'
import TagList from './components/TagList'

function App() {
  return (
    <div 
      className=""
    >
      <Routes>
        <Route path="/" Component={Login}/>
        <Route path="/signup" Component={SignUp}/>
        <Route path="/images" Component={ImageGallery}/>
        <Route path="/tags" Component={TagList}/>
      </Routes>
    </div>
  );
}

export default App
