
import { Route, Routes } from 'react-router-dom'
import './styles/App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Category from './pages/Category'
import Shared from './pages/Shared'
import UserProfile from './pages/UserProfile'

function App() {

  return (

      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} /> 
      <Route path="/Home" element={<Home />} />
      <Route path="/category" element={<Category />} />
      <Route path="/shared" element={<Shared />} />
      <Route path="/userProfile" element={<UserProfile />} />
      </Routes>
    
  )
}

export default App
