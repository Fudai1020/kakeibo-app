import Header from "../components/Header"
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import'../styles/editProfile.css';
import icon from '../assets/default.png'
import { useNavigate } from "react-router-dom";




const EditProfile = () => {
    const [newName,setNewName] = useState('');
    const [newMemo,setNewMemo] = useState('');
    const [originalName,setOriginalName] = useState('');
    const [originalMemo,setOriginalMemo] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
    const auth = getAuth();
    const user = auth.currentUser;
    if(!user) return;

    const fetchData = async()=>{
        const docRef = doc(db,'users',user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            const data = docSnap.data();
            setOriginalName(data.name || '');
            setOriginalMemo(data.memo || '');
        }
    };
    fetchData();
},[])
    const handleEditSave = async() =>{
        const auth = getAuth();
        const user = auth.currentUser;
        if(!user) return;

        const userRef = doc(db,'users',user.uid);   
        try{
        await updateDoc(userRef,{
            name:newName.trim() === '' ? originalName : newName,
            memo:newMemo.trim() === '' ? originalMemo : newMemo,
        })
        alert('編集完了！');
        setNewName('');
        setNewMemo('');
        navigate('/userProfile');
    }catch(error){
        console.error('更新に失敗しました',error);
    }
    }

  return (
    <div>
        <Header />
        <div className="main">
        <h1 style={{marginTop:'30px',marginBottom:'0'}}>Account</h1>
        <div className="profile-icon">
        <img src={icon} alt="" className="profile-img"/>
        </div>
        <label className="edit-name">名前
        <input type="text" placeholder={originalName} value={newName} onChange={(e)=>setNewName(e.target.value)}/>
        </label>
        <label className="edit-memo" > 一言メモ
        <textarea value={newMemo} placeholder={originalMemo} onChange={(e)=>setNewMemo(e.target.value)}></textarea>
        </label>
        <button onClick={handleEditSave}>変更</button>
        </div>
    </div>
  )
}

export default EditProfile