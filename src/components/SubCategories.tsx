import { FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/category.css'
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useState } from 'react';
import AnimateNumber from './AnimateNumber';
//親から渡されるpropsの配列の中身の型を指定
type SubCategoryProps = {
  subTransactions: {
    id: string;
    amount: number;
    subCategory: string;
    memo: string;
    createdAt: Date;
  }[];  //オブジェクトの配列を意味している
};

const SubCategory = ({ subTransactions }: SubCategoryProps) => {
  //現在編集しているデータのインデックスを管理
  const [editingId,setEditingId] = useState<string | null>(null);
  //入力される値を管理
  const [editSubCategoryName,setEditSubCategoryName] = useState('');
  const [editAmount,setEditAmount] = useState('');
  const [editMemo,setEditMemo] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;
  //文字を変換する処理
  const normalizeAmount = (input: string) => {
  const half = input.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g, '');
  const numeric = half.replace(/[^0-9]/g, '');
  return Number(numeric);
  };
  //編集モードに切り替える処理
  const handleEditClick = (item:typeof subTransactions[number]) =>{
    setEditingId(item.id);
    setEditSubCategoryName(item.subCategory);
    setEditAmount(item.amount.toLocaleString());
    setEditMemo(item.memo);
  }
  //編集した値を保存する処理
  const handleSave = async() => {
    //ユーザのUidと編集データが存在していない場合処理を中断
    if(!user?.uid || !editingId) return;
    //更新するデータ先を指定
    const docRef = doc(db,'users',user.uid,'transactions',editingId);
    try{
      //保存するデータのオブジェクトのキーに値を当てはめて保存
      await updateDoc(docRef,{
        subCategory:editSubCategoryName,
        amount:normalizeAmount(editAmount),
        memo:editMemo,
      });
      //インデックスを初期化
      setEditingId(null);
    }catch(error){
      console.log('エラー',error)
    }
  }
  //編集を中断する処理
  const canselEdit = (item:typeof subTransactions[number]) =>{
    //stateに編集前の値をセットしてインデックスを初期化する
    setEditSubCategoryName(item.subCategory);
    setEditAmount(item.amount.toLocaleString());
    setEditMemo(item.memo);
    setEditingId(null);
  } 
  //データを削除する処理
  const handleDeleteSubCategory = async(subCategory:string) =>{
    if(!user?.uid) return;
    const confirm = window .confirm(`${subCategory}を削除しますか？`);
    if(!confirm) return;
    //削除したいデータと取得先のデータが一致したものを抽出
    const itemsToDelete = subTransactions.filter((item)=> item.subCategory === subCategory)

    try{
      //削除したいデータ先を指定して削除する準備をする
      const deletePromises = itemsToDelete.map((item) =>{
        const docRef = doc(db,'users',user.uid,'transactions',item.id);
        return deleteDoc(docRef);
      });
      //削除処理を一括で実行
      await Promise.all(deletePromises);
    }catch(error){
      console.log('削除に失敗しました',error)
    }
  }

  return (
    <ul>
      {subTransactions.map((item) => (
        <li key={item.id} className="sub-category-item">
          {/*削除したいインデックスが存在している場合編集モードに切り替え*/}
          {editingId === item.id ? (
            <div>
            <div className='edit-subcategory'>
              <div className='input-row'>
              <input value={editSubCategoryName}
                onChange={(e) => setEditSubCategoryName(e.target.value)} />・・・
              <input type='text' value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)} />
              </div>
              <div className='edit-category-memo'>
              <input value={editMemo}
                onChange={(e) => setEditMemo(e.target.value)} />
                </div>
            </div>
            <div className='subEdit-buttons'>
                <button onClick={handleSave}>保存</button>
                <button onClick={() => canselEdit(item)}>キャンセル</button>
            </div>
            </div>
          ):(
            <div>
            <span className='subcategory-list'>{item.subCategory}・・・<AnimateNumber value={item.amount} />円</span>
            <span className="memo-text">{item.memo? item.memo:'メモなし'}</span>
            <span className='created-at'>{item.createdAt && item.createdAt.toLocaleDateString('ja-JP')}</span>
            <div className='subicon-buttons'>
            <button className='subicon-button' onClick={()=>handleEditClick(item)} >
                <FaEdit />
            </button>
            <button className='subicon-button' onClick={()=>handleDeleteSubCategory(item.subCategory)} >
                <FaTrash />
            </button>
            </div>
          </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SubCategory;
