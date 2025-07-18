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
  // 共有相手のプロフィール情報を管理する。各プロパティは存在しない可能性があるためoptional(?:)にしている。
  const [partnerData, setPartnerData] = useState<{
    name?: string;
    email?: string;
    photoURL?: string;
    memo?:string;
    sharedAt?:Date;
  } | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  //共有を停止する処理
  const stopShare = async()=>{
    //ユーザか共有相手が存在しなければ処置を中断
    if(!user || !partnerUid) return;
    // 確認ダイアログを表示し、キャンセルされた場合は処理を中断
    const confirm = window.confirm('本当に共有を停止しますか？');
    if(!confirm) return;

    try{
      //ユーザのデータを参照
      const myDocRef = doc(db,'users',user.uid);
      //共有相手のデータを参照
      const partnerDocRef = doc(db,'users',partnerUid);
      //deleteField()で特定のドキュメントのみ削除して更新promise.allで一括更新
      await Promise.all([
        updateDoc(myDocRef,{sharedWith:deleteField(),sharedAt:deleteField()}),
        updateDoc(partnerDocRef,{sharedWith:deleteField(),sharedAt:deleteField()})
      ]);
      //sharedページに遷移

      navigate('/shared')
    }catch(error){
        console.error('エラー',error);
    }
  }
//共有相手のUidマウント時、共有相手の情報を取得する
useEffect(() => {
  const fetchPartnerData = async () => {
    //取得するデータを指定
    const docRef = doc(db, 'users', partnerUid);
    //データを取得する
    const docSnap = await getDoc(docRef);
    //取得したデータが存在する場合処理を行う
    if (docSnap.exists()) {
      const data = docSnap.data();
      //取得したデータのtimestampをDate型に変換し、データが存在しなければundefinedを返す
      setPartnerData({...data,sharedAt:data.sharedAt?.toDate?.() ?? undefined});
    }else{
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
      <h2>共有開始日:{partnerData?.sharedAt?.toLocaleDateString() }</h2>
      <h2>{partnerData?.memo||'メモなし'}</h2>
      <button onClick={stopShare}>共有をやめる</button>
    </div>
  );
};

export default PartnerProfile;
