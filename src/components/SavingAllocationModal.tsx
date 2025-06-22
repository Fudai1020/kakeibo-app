import { useEffect, useState } from 'react';
import '../styles/savingAllocationModal.css'
import { setDoc, getDocs ,doc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
type props = {
    onClose:() => void;
    balance:number;
  selectedDate:Date;
}
const SavingAllocationModal = ({onClose,balance,selectedDate}:props) => {
  const [allocations,setAllocations] = useState<{name:string;amount:string}[]>([]);
  const [allocationName,setAllocationName] = useState("");
  const [allocationAmount,setAllocationAmount] = useState("");
  const [isPrivate,setIsPrivate] = useState("");
      const normalizeAmount = (input: string) => {
    const half = input.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g, '');
    const numeric = half.replace(/[^0-9]/g, '');
    return Number(numeric);
  };

  useEffect(()=>{

      const auth = getAuth();
  const currentUser = auth.currentUser;

    if(currentUser){
    const fetchAllocations = async () =>{
      const snapshot = await getDocs(collection(db,'users',currentUser.uid,'SavingAllocations'));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data()
        return{
          name:d.name,
          amount:d.amount,
          createAt:d.date?.toDate?.() || new Date(),
        }
      })
      const filtered = data.filter((item) => {
        return(
          item.createAt.getFullYear() === selectedDate.getFullYear() &&
          item.createAt.getMonth() === selectedDate.getMonth()
        )
      })
      setAllocations(filtered);
    }
    fetchAllocations();
  }
  },[selectedDate]);
  const handleSave = async() =>{
      const auth = getAuth();
      const currentUser = auth.currentUser;

    if(currentUser){
    try{
      const batch = allocations.map((item) => {
        const docRef = doc(db,'users',currentUser.uid,'SavingAllocations',item.name)
        return setDoc(docRef,{
          name:item.name,
          amount:normalizeAmount(item.amount) || 0,
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
        <ul className='allocation-list'>
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