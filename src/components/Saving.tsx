type props = {
  onAddClick:() => void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  onBalanceChange:(balance:number) => void;
  selectedDate:Date;
  sharedWith:string|null;
}
import { useEffect, useState } from 'react';
import '../styles/saving.css' 
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AnimateNumber from './AnimateNumber';

const Saving = ({onAddClick,setModalType,onBalanceChange,selectedDate,sharedWith}:props) => {
  const [savingTotal,setSavingTotal] = useState(0);
  const [savingAllocations,setSavingAllocations] = useState<{name:string,amount:number}[]>([]);//オブジェクトの型を指定してstate管理

  //ユーザ情報と共有相手の情報をselectedDate、sharedwithマウント時に取得
  useEffect(()=>{
    const auth = getAuth();
    let unsubMy = ()=> {};
    let unsubPartner = () =>{};
    let incomeTotal = 0;
    let paymentTotal = 0;

    const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{
      if(!user) return;

      const currentUid = user.uid;

      const myRef = query(
      collection(db,"users",currentUid,"transactions"));

      //リアルタイムでユーザの情報を監視
      unsubMy = onSnapshot(myRef,(snapshot)=>{
      const docs = snapshot.docs.map((doc)=>{
        const d = doc.data();
        //データを取り出して整形された型で返す
        return{
          type:d.type,
          amount:typeof d.amount === 'number' ? d.amount : 0,
          createdAt:d.date?.toDate?.() || new Date(),
        }
      });
      
      if(sharedWith && sharedWith != currentUid){
        const partnerRef = query(collection(db,'users',sharedWith,'transactions'),
        where('isPrivate','==',false));

        unsubPartner = onSnapshot(partnerRef,(partnerSnap)=>{
          const partnerDocs = partnerSnap.docs.map((doc)=>{
            const partnerData = doc.data();
            return{
              type:partnerData.type,
              amount:typeof partnerData.amount === 'number' ? partnerData.amount:0,
              createdAt:partnerData.date?.toDate?.() || new Date(),
            }
          });
          const allData = [...docs,...partnerDocs];
          //現在の月と同じものだけにフィルター
          const filteredDocs = allData.filter((item)=>
          item.createdAt.getFullYear() === selectedDate.getFullYear() &&
          item.createdAt.getMonth() === selectedDate.getMonth()
          )

          filteredDocs.forEach((item)=>{
            if(item.type === 'income'){
              incomeTotal += typeof item.amount === 'number'? item.amount:0; //typeが'income'のデータの金額を合計
            }else if(item.type === 'payment'){
              paymentTotal += typeof item.amount === 'number' ? item.amount:0;//typeが'payment'のデータ金額を集計
            }
          });

          const balance = incomeTotal - paymentTotal;
          setSavingTotal(balance);
          onBalanceChange(balance);//親コンポーネントに渡す
        });
      }else{
        //ユーザのデータを現在の月のデータに絞る
      const filteredDocs = docs.filter((item) =>{
        return(
          item.createdAt.getFullYear() === selectedDate.getFullYear() &&
          item.createdAt.getMonth() === selectedDate.getMonth()
        )
      })
      filteredDocs.forEach((item)=>{
        if(item.type === "income"){
          incomeTotal += typeof item.amount === "number" ? item.amount:0;
        }else if(item.type === "payment"){
          paymentTotal += typeof item.amount === "number" ? item.amount:0;
        }
      });

      const balance = incomeTotal - paymentTotal;
      setSavingTotal(balance);
      onBalanceChange(balance);
    }
    });
    
    })
    return () => {
      unsubscribeAuth();
      unsubMy();
      unsubPartner();
    }
  },[selectedDate,sharedWith]);
//初回マウント時にデータを取得
useEffect(() => {
  const auth = getAuth();
  let unsubMy = () => {};
  let unsubUserDoc = () => {};
  let unsubPartner = () => {};
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const currentUid = user.uid;
    const userDocRef = doc(db, 'users', currentUid);

    // 自分の SavingAllocations を取得
    const myRef = query(collection(db, 'users', currentUid, 'SavingAllocations'));
    unsubMy = onSnapshot(myRef, (mySnap) => {
      const myData = mySnap.docs.map((doc) => ({
        name: doc.data().name,
        amount: doc.data().amount,
        isMine: true,
      }));

      // 自分の user ドキュメントから sharedWith を取得
        unsubUserDoc = onSnapshot(userDocRef, (userSnap) => {
        const partnerUid = userSnap.data()?.sharedWith;

        if (partnerUid && partnerUid !== currentUid) {
          const partnerRef = query(collection(db, 'users', partnerUid, 'SavingAllocations'));
          //すでに設定済みのpartner処理を解除して重複を防ぐ
          unsubPartner();
          //パートナーの情報の変化をリアルタイム監視
          unsubPartner = onSnapshot(partnerRef, (partnerSnap) => {
            const partnerData = partnerSnap.docs.map((doc) => ({
              name: doc.data().name,
              amount: doc.data().amount,
              isMine: false,
            }));

            setSavingAllocations([...myData, ...partnerData]);
          });
        } else {
          unsubPartner();
          setSavingAllocations(myData);
        }
      });
    });
  });
  //リアルタイム監視の解除、クリーンアップ
  return () => {
    unsubMy();
    unsubUserDoc();
    unsubPartner();
    unsubscribeAuth();
  };
}, []);
//savingAllocationモーダルを開く情報を親に渡す
const handleClick = ()=>{
  setModalType("saving");
  onAddClick();
}
  return (
    <div className="saving-box">
        <h1 style={{marginBottom:'-20px'}}>今月の収支</h1>
        <h2 style={{marginBottom:'-20px'}}><AnimateNumber value={savingTotal} /></h2>
        <h2 style={{marginBottom:'-5px'}}> 貯金一覧</h2>
        <div className='saving-category'>
          {savingAllocations.map((item,index)=>(
            <p key={index}>
              {item.name}：¥{item.amount.toLocaleString()}
            </p>
          ))}
        </div>
        <button className='Saving-button' onClick={handleClick}>振り分け</button>       
    </div>
  )
}

export default Saving