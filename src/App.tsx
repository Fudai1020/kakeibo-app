
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
import PrivateRoute from './components/PrivateRoute'


function App() {


  return (

      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  <Route path="/home" element={
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  } />

  <Route path="/category" element={
    <PrivateRoute>
      <Category />
    </PrivateRoute>
  } />

  <Route path="/shared" element={
    <PrivateRoute>
      <Shared />
    </PrivateRoute>
  } />

  <Route path="/userProfile" element={
    <PrivateRoute>
      <UserProfile />
    </PrivateRoute>
  } />

  <Route path="/changePassword" element={
    <PrivateRoute>
      <ChangePassword />
    </PrivateRoute>
  } />

  <Route path="/editProfile" element={
    <PrivateRoute>
      <EditProfile />
    </PrivateRoute>
  } />
</Routes>
    
  )
}

export default App
