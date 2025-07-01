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
  const [savingAllocations,setSavingAllocations] = useState<{name:string,amount:number}[]>([]);


  useEffect(()=>{
    const auth = getAuth();
    let unsubMy = ()=> {};
    let unsubPartner = () =>{};
    const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{
      if(!user) return;

      const currentUid = user.uid;

      const myRef = query(
      collection(db,"users",currentUid,"transactions"));

      unsubMy = onSnapshot(myRef,(snapshot)=>{
      const docs = snapshot.docs.map((doc)=>{
        const d = doc.data();
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
          const filteredDocs = allData.filter((item)=>
          item.createdAt.getFullYear() === selectedDate.getFullYear() &&
          item.createdAt.getMonth() === selectedDate.getMonth()
          )
          let incomeTotal = 0;
          let paymentTotal = 0;

          filteredDocs.forEach((item)=>{
            if(item.type === 'income'){
              incomeTotal += typeof item.amount === 'number'? item.amount:0;
            }else if(item.type === 'payment'){
              paymentTotal += typeof item.amount === 'number' ? item.amount:0;
            }
          });

          const balance = incomeTotal - paymentTotal;
          setSavingTotal(balance);
          onBalanceChange(balance);
        });
      }else{
      const filteredDocs = docs.filter((item) =>{
        return(
          item.createdAt.getFullYear() === selectedDate.getFullYear() &&
          item.createdAt.getMonth() === selectedDate.getMonth()
        )
      })

      let incomeTotal = 0;
      let paymentTotal = 0;

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

useEffect(() => {
  const auth = getAuth();
  let unsubMy = () => {};
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
      const unsubUserDoc = onSnapshot(userDocRef, (userSnap) => {
        const partnerUid = userSnap.data()?.sharedWith;

        if (partnerUid && partnerUid !== currentUid) {
          const partnerRef = query(collection(db, 'users', partnerUid, 'SavingAllocations'));
          unsubPartner = onSnapshot(partnerRef, (partnerSnap) => {
            const partnerData = partnerSnap.docs.map((doc) => ({
              name: doc.data().name,
              amount: doc.data().amount,
              isMine: false,
            }));

            setSavingAllocations([...myData, ...partnerData]);
          });
        } else {
          setSavingAllocations(myData);
        }
      });
      unsubPartner = () => unsubUserDoc();
    });
  });

  return () => {
    unsubMy();
    unsubPartner();
    unsubscribeAuth();
  };
}, []);


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