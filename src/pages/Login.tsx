import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/MY HOUSEHOLD.png'
import '../styles/App.css'
import '../styles/login.css'
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  const navigate = useNavigate();

  //ログイン処理  
  const handleLogin =async () => {
    //入力チェック：メールアドレスかパスワードが未入力の場合アラート出して中断
    if(!email || !password){
      alert('メールアドレスとパスワードを入力してください');
      return;
    }
    //入力チェック：メールアドレス内に＠が含まれていない場合アラート出して中断
    if(!email.includes('@')){
      alert('有効なメールアドレスを入力してください');
      return;
    }
    //ログイン処理、エラーの場合アラートで返す
    try{
      //Firebaseの認証機能を使ってログイン処理
      const userCrendential = await signInWithEmailAndPassword(auth,email,password);
      console.log('ログイン成功',userCrendential.user);
      //ホーム画面に遷移
      navigate('/Home')
    }catch(error){
      //ログイン失敗時のエラー処理
      console.error('ログイン失敗',error);
      alert("メールアドレスまたはパスワードが間違っています");
    }


  }
  return (
    <div className='login-page'>
      <div className='login-box'>
      
      <img src={logo} alt="logo" className='login-logo'/>
      <div className='gap-group'>
      <input type='email'  className='login-input' placeholder='メールアドレス' value={email}
      onChange={(e) => setEmail(e.target.value)}/>
      <div style={{position:'relative'}}>
      <input type={showPassword ? 'text':'password'}  
        className='login-input' placeholder='パスワード' value={password}
        onChange={(e) => setPassword(e.target.value)}/>
         <div 
            onClick={() => setShowPassword(!showPassword)}
            style={{position: 'absolute',
            top: '65%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',}}
          >
          {/*パスワード表示・非表示の切り替えアイコン */}
        {showPassword ? <AiOutlineEyeInvisible className='eye-icon' style={{fontSize:'24px'}}/> : <AiOutlineEye className='eye-icon' style={{fontSize:'24px'}}/>}
        </div>
      </div>
      <p className="register-text">
          アカウントが未登録ですか？ <Link to="/Register">アカウントの作成</Link>
      </p>
      <button onClick={handleLogin} className='login-button'>ログイン</button>

      </div>
    </div>
    </div>
  )
};

export default Login;