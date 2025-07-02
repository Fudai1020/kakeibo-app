import { useState } from "react"
import Header from "../components/Header"
import '../styles/changePassword.css'
import { getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";


const ChangePassword = () => {
    const [currentPassword,setCurrentPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [error,setError] = useState('');

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
            <label >現在のパスワード
            <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
            </label>
            <label >新しいパスワード
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
            </label>
            <label >再入力
            <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            </label>
            {error && <p style={{color:'red'}}>{error}</p>}
            <button onClick={handlePasswordChange}>保存</button>
        </div>
    </div>
  )
}

export default ChangePassword