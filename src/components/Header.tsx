import '../styles/header.css'
import logo from '../assets/logo.png'
import { Settings,UserCircle2 } from 'lucide-react'
const Header = () => {
  return (
    <div className='header'>
        <img src={logo} alt='logo' className='header-logo' />
        <div className='layout-right'>
            <div className='gap'>
        <h1>共有</h1>
        <h1>カテゴリ別</h1>
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