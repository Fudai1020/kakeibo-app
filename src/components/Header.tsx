import '../styles/header.css'
import logo from '../assets/logo.png'
import { Settings,UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SettingModal from './SettingModal'
import SlideinModal from './SlideinModal'


const Header = () => {
  const [isOpen,setIsOpen] = useState(false);
  const [isvisible,setIsvisible] = useState(false);

  const openModal = () => {
    setIsvisible(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsvisible(false);
    }, 300);
  }
  return (
    <div className='header'>
        <Link to='/Home'><img src={logo} alt='logo' className='header-logo' /></Link>
        <div className='layout-right'>
            <div className='gap'>
        <Link to='/shared' className='link-style'><h1>共有</h1></Link>
        <Link to='/Category' className='link-style'><h1>カテゴリ別</h1></Link>
        </div>
        <div className='icons'>
        <Link to="/userProfile" className='logo-link'><UserCircle2 className='logo-hover' size={47} style={{verticalAlign:'middle',marginRight:'30px'}}/></Link>
        <Settings className='logo-hover' size={45} style={{verticalAlign:'middle'}} onClick={openModal}/>
        </div>
        </div>
        {isvisible &&(
          <SlideinModal onClose={closeModal} isOpen={isOpen}>
            <SettingModal  />
          </SlideinModal>
        )}
    </div>
  )
}

export default Header