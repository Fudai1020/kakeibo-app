import { getAuth } from "firebase/auth";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({children}:{children:JSX.Element}) => {
    const auth = getAuth();
    const user = auth.currentUser;
    //ログインしていたらページ遷移、ログインしていない場合ログイン画面に戻る
    return user ? children:<Navigate to='/' />;
}

export default PrivateRoute