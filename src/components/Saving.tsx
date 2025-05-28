type props = {
  onAddClick:() => void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  onBalanceChange:(balance:number) => void;
}
import { useEffect, useState } from 'react';
import '../styles/saving.css' 
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Saving = ({onAddClick,setModalType,onBalanceChange}:props) => {
  const [savingTotal,setSavingTotal] = useState(0);

  useEffect(()=>{
    const q = query(
      collection(db,"transactions")
    );

    const unsubscribe = onSnapshot(q,(snapshot)=>{
      const docs = snapshot.docs.map(doc=> doc.data());

      let incomeTotal = 0;
      let paymentTotal = 0;

      docs.forEach((item)=>{
        if(item.type === "income"){
          incomeTotal += typeof item.amount === "number" ? item.amount:0;
        }else if(item.type === "payment"){
          paymentTotal += typeof item.amount === "number" ? item.amount:0;
        }
      });

      const balance = incomeTotal - paymentTotal;
      setSavingTotal(balance);
      onBalanceChange(balance);
    });
    return ()=> unsubscribe();

  },[]);
  const handleClick = ()=>{
    setModalType("saving");
    onAddClick();
  }
  return (
    <div className="saving-box">
        <h1 style={{marginBottom:'-10px'}}>今月の収支</h1>
        <h2 style={{marginBottom:'-10px'}}>¥{savingTotal.toLocaleString()}</h2>
        <h1 style={{marginBottom:'-5px'}}> 貯金一覧</h1>
        <div className='saving-category'>
        <p>人生の貯金：¥1000</p>
        <p>人生の貯金：¥1000</p>
        </div>
        <button onClick={handleClick}>振り分け</button>       
    </div>
  )
}

export default Saving