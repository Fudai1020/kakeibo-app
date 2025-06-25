import icon from '../assets/default.png'
import { useEffect, useState } from "react"
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import {  useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

type Props = {
  partnerUid: string;
};

const PartnerProfile = ({ partnerUid }: Props) => {
  const [partnerData, setPartnerData] = useState<{
    name?: string;
    email?: string;
    photoURL?: string;
  } | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const stopShare = async()=>{
    if(!user || !partnerUid) return;

    const confirm = window.confirm('本当に共有を停止しますか？');
    if(!confirm) return;

    try{
        const myDocRef = doc(db,'users',user.uid);
        const partnerDocRef = doc(db,'users',partnerUid);

        await Promise.all([
            updateDoc(myDocRef,{sharedWith:deleteField()}),
            updateDoc(partnerDocRef,{sharedWith:deleteField()})
        ]);

        navigate('/shared')
    }catch(error){
        console.error('エラー',error);
    }
  }

  useEffect(() => {
    const fetchPartnerData = async () => {
      const docRef = doc(db, 'users', partnerUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPartnerData(docSnap.data());
      } else {
        setPartnerData(null);
      }
    };

    fetchPartnerData();
  }, [partnerUid]);

  return (
    <div className="main-container">
      <h1 style={{ marginTop: '30px', marginBottom: '10px' }}>共有中</h1>
      <div className="profile-icon">
        <img src={partnerData?.photoURL || icon} alt="" className="profile-img" />
      </div>
      <h2>{partnerData?.name || 'NoName'}</h2>
      <h2>{partnerData?.email || 'メール未設定'}</h2>
      <button onClick={stopShare}>共有をやめる</button>
    </div>
  );
};

export default PartnerProfile;
