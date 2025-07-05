import Header from "../components/Header"
import icon from '../assets/default.png'
import '../styles/userProfile.css'
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { getAuth } from "firebase/auth"


const UserProfile = () => {
    const [userData,setUserData] = useState<{name?:string,email?:string,memo?:string} | null>(null);

    useEffect(()=>{
        const fetchData = async () =>{
            const auth = getAuth();
            const currentUser   = auth.currentUser;
            if(currentUser){
            const docRef = doc(db,'users',currentUser.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setUserData(docSnap.data());
            }else{
                setUserData(null);
            }   
        }
    }
        fetchData();
    },[])
  return (
    <div className="main-container">
        <Header />
        <h1 style={{marginTop:'50px',marginBottom:'10px'}}>Account</h1>
        <div className="profile-icon">
        <img src={icon} alt="" className="profile-img"/>
        </div>
        <h2>{userData?.name || 'NoName'}</h2>
        <h2>{userData?.email || 'メール未設定'}</h2>
        <h2>一言メモ</h2>
        <h2 style={{marginTop:'10px'}}>{userData?.memo || 'メモはありません'}</h2>
    </div>
  )
}

export default UserProfile