type props = {
  onAddClick:() => void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  onBalanceChange:(balance:number) => void;
  selectedDate:Date;
}
import { useEffect, useState } from 'react';
import '../styles/saving.css' 
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Saving = ({onAddClick,setModalType,onBalanceChange,selectedDate}:props) => {
  const [savingTotal,setSavingTotal] = useState(0);
  const [savingAllocations,setSavingAllocations] = useState<{name:string,amount:number}[]>([]);


  useEffect(()=>{
    const q = query(
      collection(db,"transactions")
    );

    const unsubscribe = onSnapshot(q,(snapshot)=>{
      const docs = snapshot.docs.map((doc)=>{
        const d = doc.data();
        return{
          type:d.type,
          amount:typeof d.amount === 'number' ? d.amount : 0,
          createdAt:d.date?.toDate?.() || new Date(),
        }
      });
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
    });
    return ()=> unsubscribe();

  },[selectedDate]);

useEffect(()=>{
  const q = query(collection(db,'SavingAllocations'));
  const unsubscribe = onSnapshot(q,(snapshot)=>{
    const data = snapshot.docs.map((doc) => {
      const d = doc.data()
    return{
      name:d.name,
      amount:d.amount,
    }
    });
    setSavingAllocations(data);
  })
  return () => unsubscribe();
},[]);

  const handleClick = ()=>{
    setModalType("saving");
    onAddClick();
  }
  return (
    <div className="saving-box">
        <h1 style={{marginBottom:'-10px'}}>今月の収支</h1>
        <h2 style={{marginBottom:'-10px'}}>¥{savingTotal.toLocaleString()}</h2>
        <h2 style={{marginBottom:'0px'}}> 貯金一覧</h2>
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