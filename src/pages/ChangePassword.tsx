import { useState } from "react"
import Header from "../components/Header"
import '../styles/changePassword.css'
import { getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const ChangePassword = () => {
    //パスワードの内容を管理する
    const [currentPassword,setCurrentPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    //エラー状態を管理
    const [error,setError] = useState('');
    //パスワード表示の状態を管理
    const [showCurrentPassword,setCurrentShowPassword] = useState(false);
    const [showNewPassword,setShowNewPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    //パスワードの変更の処理
    const handlePasswordChange = async()=>{
        setError('');
        //新しいパスワードと確認パスワードが一致しなければエラーメッセージを出して処理を中断
        if(newPassword !== confirmPassword){
            setError('パスワードが一致しません');
            return;
        }
        //Firebsdrからユーザ情報を取得
        const auth = getAuth();
        const user = auth.currentUser;
        //ユーザとメールアドレスが存在していたら変更処理を行う
        if(user && user.email){
            //メールアドレスとパスワードから認証用の資格情報を作成
            const credential = EmailAuthProvider.credential(user.email,currentPassword);
            try{
                //作成した資格情報を使用してユーザを再認証
                await reauthenticateWithCredential(user,credential);
                //パスワードを更新
                await updatePassword(user,newPassword );
                alert('変更しました！');
                //テキストボックスを空欄にする
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }catch(err:any){
                //エラーメッセージを表示
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