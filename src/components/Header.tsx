import '../styles/header.css'
import logo from '../assets/logo.png'
import { Settings,UserCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SettingModal from './SettingModal'
import SlideinModal from './SlideinModal'


const Header = () => {
  const [isOpen,setIsOpen] = useState(false); //モーダルの開閉管理
  const [isvisible,setIsvisible] = useState(false); //背景（暗転）の表示を管理

  //settingモーダルを開く処理
  //ハンドラが動いた瞬間背景を暗くし、10ms後にモーダルを開く
  const openModal = () => {
    setIsvisible(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 10);
  }
  //モーダルを閉じる処理
  // 300ms後に背景も非表示にする
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsvisible(false);
    }, 300);
  }
  return (
    <div className='header'>
      {/*ロゴをクリック時homeへ遷移*/}
        <Link to='/Home'><img src={logo} alt='logo' className='header-logo' /></Link>
        <div className='layout-right'>
            <div className='gap'>
              {/*リンククリック時共有画面、カテゴリ別画面へ遷移*/}         
              <Link to='/shared' className='link-style'><h1>共有</h1></Link>
              <Link to='/Category' className='link-style'><h1>カテゴリ別</h1></Link>
            </div>
          <div className='icons'>
            {/*リンククリック時ユーザプロフィール画面を表示*/}
            <Link to="/userProfile" className='logo-link'><UserCircle2 className='logo-hover user-icon'  style={{verticalAlign:'middle',marginRight:'15px'}}/></Link>
            {/*アイコンクリック時設定モーダルを開く*/}
            <Settings className='logo-hover settings-icon' style={{verticalAlign:'middle'}} onClick={openModal}/>
          </div>
        </div>
        {/*モーダルを表示する場合*/}
        {isvisible &&(
          <SlideinModal onClose={closeModal} isOpen={isOpen}>
            <SettingModal  />
          </SlideinModal>
        )}
    </div>
  )
}

export default Header