import { useEffect, useState } from 'react';
import '../styles/transactionFormModal.css'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';

type Props = {
  onClose: () => void;
  type:'income' | 'payment';
};

const TransactionFormModal = ({onClose,type:initialType}:Props) => {
  const [view,setView] = useState<'form' | 'category'>('form');
  const [slideDirection,setSlideDirection] = useState<'left'|'right'|null>(null);
  const [animeClass,setAnimeClass] = useState('slide-in-right');

  const [type,setType] = useState<"income"|"payment">(initialType);
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

  useEffect(()=> {
    if(slideDirection === 'left'){
      setAnimeClass('slide-in-left');
    }else if(slideDirection === 'right'){
      setAnimeClass('slide-in-right');
    }
  },[slideDirection])
  const handleSubmit = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if(currentUser){  
      try{
        await addDoc(collection(db,"users",currentUser.uid,"transactions"),{
          type,
          amount:normalizeAmount(amount),
          category,
          memo,
          date:new Date(date),
          isPrivate,
        });
        alert("登録完了！");
        onClose();
      }catch(e){
        console.error("保存エラー",e);
        alert("保存に失敗しました");
      }
    }
  };

  const openCategoryModal=()=>{
    setSlideDirection('left');
    setView('category');
  }

  const closeCategoryModal = () =>{
    setSlideDirection('right')
    setView('form');
    }

  return (
    <div className="modal-container">
      {view==='form' && (
        <div className={`content ${animeClass}`}>
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
      <button className='index-button' onClick={openCategoryModal}>項目を追加</button>
        </div>
      )}
      {view === 'category'&&(
        <div className={`content ${animeClass}`}>
          <h1>項目</h1>
            <input type="text" />
            <select name="" id="">
              <option value=""></option>
            </select>
            <input type="text" />
            <button onClick={closeCategoryModal}>戻る</button>
            <button onClick={handleSubmit}>保存</button>
        </div>
      )}
    </div>
  )
}

export default TransactionFormModal