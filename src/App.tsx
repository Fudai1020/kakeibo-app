
import { Route, Routes } from 'react-router-dom'
import './styles/App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'


function App() {

  return (

      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} /> 
      <Route path="/Home" element={<Home />} />
      </Routes>
    
  )
}

export default App
