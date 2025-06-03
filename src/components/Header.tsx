import '../styles/header.css'
import logo from '../assets/logo.png'
import { Settings,UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <div className='header'>
        <Link to='/Home'><img src={logo} alt='logo' className='header-logo' /></Link>
        <div className='layout-right'>
            <div className='gap'>
        <Link to='/shared' className='link-style'><h1>共有</h1></Link>
        <Link to='/Category' className='link-style'><h1>カテゴリ別</h1></Link>
        </div>
        <div className='icons'>
        <UserCircle2 size={45} style={{verticalAlign:'middle',marginRight:'20px'}}/>
        <Settings size={45} style={{verticalAlign:'middle'}}/>
        </div>
        </div>
    </div>
  )
}

export default Header