type props = {
    onAddClick:() => void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
}

import { useEffect, useState } from 'react';
import '../styles/payment.css'
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Payment = ({onAddClick,setModalType}:props) => {
    const [totalAmount,setTotalAmount] = useState(0);
    const [categoryTotals,setCategoryTotals] = useState<{[key:string]:Number}>({});
    
    useEffect(() => {

        const q  = query(
              collection(db,"transactions"),
              where("type","==","payment")
            );
            
            const unsubscribe = onSnapshot(q,(snapshot)=>{
              const paymentAmounts = snapshot.docs.map((doc)=>{
                const data =doc.data();
                return {
                    amount: typeof data.amount === "number" ? data.amount : 0,
                    category:data.category ?? "未分類"
                }
              });
            const totalPayment = paymentAmounts.reduce((sum,item) => sum + item.amount,0);
            setTotalAmount(totalPayment);

            const categoryMap: {[key:string]:number} = {};
            paymentAmounts.forEach((item)=>{
                if(categoryMap[item.category]){
                    categoryMap[item.category] += item.amount;
                }else{
                    categoryMap[item.category] = item.amount;
                }
            });
            setCategoryTotals(categoryMap);
            });
            return  () => unsubscribe();

    },[]);



    const handleClick = () => {
        setModalType("transaction")
        onAddClick();
    }
  return (
    <div className='payment-box'>
        <h1 style={{marginBottom:'-15px'}}>今月の支出</h1>
        <h2 style={{marginBottom:'-10px'}}>¥{totalAmount.toLocaleString()}</h2>
        <div className='container'>
            <div className='left'>
                <div className='centered'>
                <h2>項目</h2>
                <ul>
                    {Object.entries(categoryTotals).map(([category,amount])=>
                    
                    <li key={category}>
                        {category}・・・¥{amount.toLocaleString()}</li>
                    )}
                </ul>
                </div>
            </div>
            <div className='right'>
                <div className='chart'>

                </div>
            </div>
        </div>
        <div className='button-layout'>
        <button onClick={handleClick}>支出入力</button>
        </div>
    </div>
  )
}

export default Payment