import { useState } from 'react';
import '../styles/transactionFormModal.css'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

type Props = {
  onClose: () => void;
};

const TransactionFormModal = ({onClose}:Props) => {

  const incomeCategories = ["給料","副業"];
  const paymentCategories = ["食費","家賃","光熱費"];

  const [type,setType] = useState<"income"|"payment">('income');
  const [amount,setAmount] = useState("");
  const [category,setCategory] = useState("");
  const [memo,setMemo] = useState("");
  const [date,setDate] = useState("");
  const [isPrivate,setIsPrivate] = useState(false);
  const normalizeAmount = (input:string) => {
    const harf = input.replace(/[０-９]/g,s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g,"");
    const numeric = harf.replace(/[^0-9]/g,"");
    return Number(numeric);
  }

  const handleSubmit = async () => {
    try{
      await addDoc(collection(db,"transactions"),{
        type,
        amount:normalizeAmount(amount),
        category,
        memo,
        date:new Date(),
        isPrivate,
      });
      alert("登録完了！");
      onClose();
    }catch(e){
      console.error("保存エラー",e);
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="modal-container">
      <div className="radio-group">
        <label>
        <input type="radio" id='income'name="transactionType" value="income" checked={type === 'income'} onChange={() => setType('income')}/>
        収入</label>
        <label>
        <input type="radio" id='payment' name="transactionType" value="payment" checked={type === 'payment'} onChange={() => setType('payment')}/>
        支出</label>
      </div>
      <div className='input-amount'>
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='金額'/>
      </div>
      <div className="select-category">
      <h2>カテゴリ</h2>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value=""></option>
        {(type === "income" ? incomeCategories : paymentCategories).map((c)=>(
        <option key={c} value={c}>{c}</option>
        ))}
      </select>
      </div>
      <div className="memo">
      <h2>メモ</h2>
      <textarea value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
      </div>
      <div className='date-lay'>
      <h2>日付</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
      </div>
      <div className="radio-group">
          <h2>公開設定</h2>
       <label>
        <input type="radio" id='isprivate'name="privateselect" value="isprivate" checked={!isPrivate} onChange={() => setIsPrivate(false)}/>
        公開</label>
        <label>
        <input type="radio" id='isnotprivate' name="privateselect" value="isnotprivate" checked={isPrivate} onChange={() => setIsPrivate(true)}/>
        非公開</label>
      </div>
      <button className='index-button' onClick={handleSubmit}>登録</button>
    </div>
  )
}

export default TransactionFormModal