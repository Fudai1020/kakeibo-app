
import { Route, Routes } from 'react-router-dom'
import './styles/App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Category from './pages/Category'
import Shared from './pages/Shared'
import UserProfile from './pages/UserProfile'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'


function App() {


  return (

      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} /> 
      <Route path="/Home" element={<Home />} />
      <Route path="/category" element={<Category  />} />
      <Route path="/shared" element={<Shared />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/ChangePassword" element={<ChangePassword />} />
      <Route path="/editProfile" element={<EditProfile />} />
      </Routes>
    
  )
}

export default App
