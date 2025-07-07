import { getAuth } from "firebase/auth";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({children}:{children:JSX.Element}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    return user ? children:<Navigate to='/' />;
}

export default PrivateRoute