import { useEffect, useState } from 'react';
import '../styles/savingAllocationModal.css'
import { setDoc, getDocs ,doc, deleteDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { FaTrash } from 'react-icons/fa';
import AnimateNumber from './AnimateNumber';
//プロップスの方を指定する
type props = {
    onClose:() => void;
    balance:number;
  selectedDate:Date;
}
const SavingAllocationModal = ({onClose,balance,selectedDate}:props) => {
  const [allocations,setAllocations] = useState<{name:string;amount:string}[]>([]); //データの値をオブジェクトとして管理
  const [allocationName,setAllocationName] = useState("");  //貯金名を入力するテキストボックスの値を管理
  const [allocationAmount,setAllocationAmount] = useState("");  //貯金金額を入力するテキストボックスの値を管理
  const [isPrivate,setIsPrivate] = useState("");  //公開か非公開の値を管理
  const [totalAllcation,setTotalAllcation] = useState(balance);
  //全角入力を半角に変換し、数字以外の文字を除去する関数
  const normalizeAmount = (input: string) => {
    const half = input.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g, '');
    const numeric = half.replace(/[^0-9]/g, '');
    return Number(numeric);
  };
  //Firebaseに保存されている貯金名を取得
  useEffect(()=>{
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if(currentUser){
    const fetchAllocations = async () =>{
      //対象のデータを参照して取得
      const snapshot = await getDocs(collection(db,'users',currentUser.uid,'SavingAllocations'));
      //取得したデータ整形して新しいオブジェクトを作成し一つずつ配列に入れていく
      const data = snapshot.docs.map((doc) => {
        const d = doc.data()
        return{
          name:d.name,
          amount:d.amount,
          createAt:d.date?.toDate?.() || new Date(),
        }
      })
      setAllocations(data);
    }
    //関数の実行
    fetchAllocations();
  }
  },[selectedDate]);
  //データを保存する処理
  const handleSave = async() =>{
    //ユーザ認証処理
      const auth = getAuth();
      const currentUser = auth.currentUser;
    //ユーザが確認できたら実行
    if(currentUser){
    try{
      //データをそれぞれ参照したコレクションに更新をして１件ずつ配列に入れる
      const batch = allocations.map((item) => {
        const docRef = doc(db,'users',currentUser.uid,'SavingAllocations',item.name)
        return setDoc(docRef,{
          name:item.name,
          amount:normalizeAmount(String(item.amount)) || 0, //文字列に変換してセット
          isPrivate:isPrivate==='非公開', //isPrivateが非公開ならtrue、違うならfalseをセット
          createdAt:new Date()
        })
      });
      //1件1件セットしたデータを一括でデータベースに保存させる処理の実行
      await Promise.all(batch);
      onClose();
    }catch(error){
      console.error('保存エラー',error);
    }
  }
  }

  //入力した貯金名を追加する処理
  const handleClick = () => {
    if(allocationName.trim() === "") return;  //貯金名が空欄の場合処理を中断
    const isDuplicate = allocations.some(item=>item.name === allocationName);
    if(isDuplicate){
      alert('同じ名前が存在しています');
      setAllocationName('');
      return;
    }
    //配列の中の名前と、金額の値を更新
    setAllocations([...allocations,{name:allocationName,amount:allocationAmount}]);
    //テキストボックスを空欄にする
    setAllocationName("");
    setAllocationAmount("");
  }
  //追加された貯金名を削除する処理
  const handleDelete = async(name:string) =>{
    const auth = getAuth();
    const user = auth.currentUser;
    //ユーザのUidが確認できなければ処理を中断
    if(!user?.uid) return;
    //ブラウザの確認アラートを出す
    const confirm = window.confirm('削除しますか？');
    //キャンセルされたら処理を中断
    if(!confirm) return;

    try{
      //データを参照して削除
      const docRef = doc(db,'users',user.uid,'SavingAllocations',name);
      await deleteDoc(docRef);
      //stateで管理している貯金名も削除
      setAllocations((prev) => prev.filter((item)=> item.name != name));
    }catch(error){
      console.error('削除失敗',error);
    }
  }
  useEffect(()=>{
    const totalAllocated = allocations.reduce((sum,item)=>{
      return sum + normalizeAmount(item.amount);
    },0);
    setTotalAllcation(balance - totalAllocated);

  },[balance,allocations])
  return (
    <div className="saving-container">
        <h1>振り分け可能金額</h1>
        <h1 style={{color:totalAllcation > 0 ? 'white':'red'}}><AnimateNumber value={totalAllcation}/></h1>
        <h2>振り分け先を選ぶ</h2>
        <div className='amount-form'>
        <ul className='allocation-list'>
          {/*取得したデータをリスト表示*/}
          {allocations.map((item,index)=>(
        <li key={index} className="allocation-item">
        <span className="allocation-name">{item.name}・・・</span>
        <input type="text" className="allocation-input" value={item.amount} 
          onChange={(e) => {
          const newAllocations = [...allocations]; //取得したデータの配列を新しくコピー
          newAllocations[index].amount = e.target.value; //入力された値を保存
          setAllocations(newAllocations); //更新した配列をstateで更新
        }}
        />
      <button onClick={() => handleDelete(item.name)} className="saving-delete">
        <FaTrash />
      </button>
      </li>

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