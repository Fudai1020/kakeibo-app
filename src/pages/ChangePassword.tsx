import Header from "../components/Header"
import '../styles/changePassword.css'


const ChangePassword = () => {
  return (
    <div>
        <Header />
        <div className="password-inputs">
            <h1>パスワードを変更する</h1>
            <label >現在のパスワード
            <input type="text" />
            </label>
            <input type="text" />
            <input type="text" />
            <button>保存</button>
        </div>
    </div>
  )
}

export default ChangePassword