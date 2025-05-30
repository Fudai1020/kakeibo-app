import { useEffect, useState } from 'react';
import '../styles/savingAllocationModal.css'
import { addDoc, getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
type props = {
    onClose:() => void;
    balance:number;
}
const SavingAllocationModal = ({onClose,balance}:props) => {
  const [allocations,setAllocations] = useState<{name:string;amount:string}[]>([]);
  const [allocationName,setAllocationName] = useState("");
  const [allocationAmount,setAllocationAmount] = useState("");
  const [isPrivate,setIsPrivate] = useState("");

  useEffect(()=>{
    const fetchAllocations = async () =>{
      const snapshot = await getDocs(collection(db,'SavingAllocations'));
      const data = snapshot.docs.map(doc => doc.data() as {name:string,amount:string})
      setAllocations(data);
    }
    fetchAllocations();
  },[]);
  const handleSave = async() =>{
    try{
      const batch = allocations.map((item) => {
        return addDoc(collection(db,"SavingAllocations"),{
          name:item.name,
          amount:Number(item.amount) || 0,
          isPrivate:isPrivate==='非公開',
          createdAt:new Date()
        })
      });
      await Promise.all(batch);
      onClose();
    }catch(error){
      console.error('保存エラー',error);
    }
  }

  const handleClick = () => {
    if(allocationName.trim() === "") return;
    setAllocations([...allocations,{name:allocationName,amount:allocationAmount}]);
    setAllocationName("");
    setAllocationAmount("");
  }
  return (
    <div className="saving-container">
        <h1>振り分け可能金額</h1>
        <h1>¥{balance.toLocaleString()}
        </h1>
        <h2>振り分け先を選ぶ</h2>
        <div className='amount-form'>
        <ul>
          {allocations.map((item,index)=>(
          <li key={index}>{item.name}・・・¥<input type="input" value={item.amount} onChange={(e) => {
            const newAllocations = [...allocations];
            newAllocations[index].amount = e.target.value;
            setAllocations(newAllocations); 
          }}/></li>
          ))}
        </ul>
        </div>
        <div className='category-type'>
        <input type="text" placeholder="新しい貯金を入力..." value={allocationName} onChange={(e) => setAllocationName(e.target.value)} />
        <select value={isPrivate} onChange={(e)=>setIsPrivate(e.target.value)}>
            <option value=""></option>
            <option value="公開">公開</option>
            <option value="非公開">非公開</option>
        </select>
        <button onClick={handleClick}>追加</button>
        </div>
        <div className='saving-button'>
        <button onClick={handleSave}>保存</button>
        </div>
    </div>
  )
}

export default SavingAllocationModal