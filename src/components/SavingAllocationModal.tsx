import { useState } from 'react';
import '../styles/savingAllocationModal.css'
type props = {
    onClose:() => void;
    balance:number;
}
const SavingAllocationModal = ({onClose,balance}:props) => {
  const [allocations,setAllocations] = useState<{name:string;amount:number}[]>([]);
  const [allocationName,setAllocationName] = useState("");
  const [allocationAmount,setAllocationAmount] = useState("");

  const handleClick = () => {
    if(allocationName.trim() === "") return;
    setAllocations([...allocations,{name:allocationName,amount:Number(allocationAmount) || 0}]);
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
          {allocations.map((item)=>(
          <li>{item.name}・・・¥<input type="text"/></li>
          ))}
        </ul>
        </div>
        <div className='category-type'>
        <input type="text" placeholder="新しい貯金を入力..." value={allocationName} onChange={(e) => setAllocationName(e.target.value)} />
        <select>
            <option value=""></option>
            <option value="公開">公開</option>
            <option value="非公開">非公開</option>
        </select>
        <button onClick={handleClick}>追加</button>
        </div>
        <div className='saving-button'>
        <button onClick={onClose}>保存</button>
        </div>
    </div>
  )
}

export default SavingAllocationModal