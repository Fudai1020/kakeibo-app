import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/MY HOUSEHOLD.png'
import '../styles/App.css'
import '../styles/register.css'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { AiOutlineEye, AiOutlineEyeInvisible, } from 'react-icons/ai'
const register = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword,setShowPassword] = useState(false);

    const handleRegister = async() => {


        if(password != confirmPassword){
            alert('パスワードが一致していません');
            return;
        }
        try{
            const userCrendential = await createUserWithEmailAndPassword(auth,email,password)
            const user = userCrendential.user;

            await setDoc(doc(db,'users',user.uid),{
                uid: user.uid,
                email:user.email,
                createdAt:new Date(),
            })
        alert('登録完了！')
        navigate('/');
        }catch(eroor:any){
        alert('登録エラー') 
        }
    }


  return (
    <div className='login-page'>
      <div className='login-box'>
      
      <img src={logo} alt="logo" className='login-logo'/>
      <div className='gap-group'>
      <input type="text"  className='login-input' placeholder='メールアドレス' value={email} 
      onChange={(e) => setEmail(e.target.value)}/>
      <div style={{position:'relative'}}>
      <input type={showPassword ? 'text':'password'}  
            className='login-input' 
            placeholder='パスワード' 
            value={password} 
      onChange={(e) => setPassword(e.target.value)}/>
      <div 
      onClick={() => setShowPassword(!showPassword)}
      style={{position: 'absolute',
      top: '65%',
      right: '10px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',}}
      >
        {showPassword ? <AiOutlineEyeInvisible className='eye-icon' style={{fontSize:'24px'}}/> : <AiOutlineEye className='eye-icon' style={{fontSize:'24px'}}/>}
      </div>
      </div>
      <div style={{position:'relative'}}>
      <input type={showPassword ? 'text':'password'}  
            className='login-input' 
            placeholder='パスワードの確認' 
            value={confirmPassword} 
      onChange={(e) => setConfirmPassword(e.target.value)}/>
        <div 
            onClick={() => setShowPassword(!showPassword)}
            style={{position: 'absolute',
            top: '65%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',}}
        >
        {showPassword ? <AiOutlineEyeInvisible className='eye-icon' style={{fontSize:'24px'}}/> : <AiOutlineEye className='eye-icon' style={{fontSize:'24px'}}/>}

      </div>
      </div>
      </div>
        <p className='login-text'>
        <Link to={'/'}>ログイン</Link>
        </p>
      <button className='login-button' onClick={handleRegister}>登録</button>

      </div>
    </div>
  )
}

export default register