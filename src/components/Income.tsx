type props = {
  onAddClick:() =>void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  selectedDate:Date;
}

import { useEffect, useState } from 'react';
import '../styles/income.css'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const income = ({onAddClick,setModalType,selectedDate}:props) => {
  const [total,setTotal] = useState(0);
  useEffect(()=>{
    const q  = query(
      collection(db,"transactions"),
      where("type","==","income")
    );

    const unsubscribe = onSnapshot(q,(snapshot)=>{
      const incomeAmounts = snapshot.docs.map((doc)=>{
        const data =doc.data();
        const createdAt = data.date?.toDate?.() || new Date();

        if(
          createdAt.getFullYear() === selectedDate.getFullYear() &&
          createdAt.getMonth() === selectedDate.getMonth()
        ){
        return  typeof data.amount === "number" ? data.amount : 0 
        }else{
          return 0
        }
      });

      const totalIncome = incomeAmounts.reduce((sum,amount)=> sum+amount,0);
      setTotal(totalIncome);
    })
    return () => unsubscribe();
  },[selectedDate]);

  const handleClick = () =>{
    setModalType("transaction")
    onAddClick();
  }
  return (
    <div className="income-box">
        <h1>今月の収入</h1>
        <h2>¥{total.toLocaleString()}</h2>
        <button onClick={handleClick}>収入を追加</button>
    </div>
  )
}

export default income