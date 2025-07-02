import { useState } from "react"
import Header from "../components/Header"
import '../styles/changePassword.css'
import { getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const ChangePassword = () => {
    const [currentPassword,setCurrentPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [error,setError] = useState('');
    const [showCurrentPassword,setCurrentShowPassword] = useState(false);
    const [showNewPassword,setShowNewPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const handlePasswordChange = async()=>{
        setError('');
        if(newPassword !== confirmPassword){
            setError('パスワードが一致しません');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if(user && user.email){
            const credential = EmailAuthProvider.credential(user.email,currentPassword);
            try{
                await reauthenticateWithCredential(user,credential);
                await updatePassword(user,newPassword );
                alert('変更しました！');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }catch(err:any){
                setError(err.message);
            }
        }else{
            setError('ユーザが見つかりません');
        }
    }
  return (
    <div>
        <Header />
        <div className="password-inputs">
            <h1>パスワードを変更する</h1>
            <div style={{position:'relative'}}>
            <label >現在のパスワード
            <input type={showCurrentPassword?'text':'password'} value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
            <div onClick={()=>setCurrentShowPassword(!showCurrentPassword)}
                style={{position:"absolute",
                        top:'65%',
                        right:'10px',
                        transform:'translateY(-20%)',
                        cursor:'pointer'
                }}>
                {showCurrentPassword ? <AiOutlineEyeInvisible style={{fontSize:'24px'}}/>:<AiOutlineEye style={{fontSize:'24px'}}/>}
            </div>
            </label>
            </div>
            <div style={{position:'relative'}}>
            <label >新しいパスワード
            <input type={showNewPassword?'text':'password'} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
            <div onClick={()=>setShowNewPassword(!showNewPassword)}
                style={{position:"absolute",
                        top:'65%',
                        right:'10px',
                        transform:'translateY(-20%)',
                        cursor:'pointer'
                }}>
                {showNewPassword ? <AiOutlineEyeInvisible style={{fontSize:'24px'}}/>:<AiOutlineEye style={{fontSize:'24px'}}/>}
            </div>
            </label>
            </div>
            <div style={{position:'relative'}}>
            <label >再入力
            <input type={showConfirmPassword?'text':'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            <div onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                style={{position:"absolute",
                        top:'65%',
                        right:'10px',
                        transform:'translateY(-20%)',
                        cursor:'pointer'
                }}>
                {showConfirmPassword ? <AiOutlineEyeInvisible style={{fontSize:'24px'}}/>:<AiOutlineEye style={{fontSize:'24px'}}/>}
            </div>
            </label>
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <button onClick={handlePasswordChange}>保存</button>
        </div>
    </div>
  )
}

export default ChangePassword