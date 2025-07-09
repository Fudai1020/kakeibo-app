type SubCategoryProps = {
  subTransactions: {
    id: string;
    amount: number;
    subCategory: string;
    memo: string;
    createdAt: Date;
  }[];
};
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/category.css'
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useState } from 'react';
import AnimateNumber from './AnimateNumber';

const SubCategory = ({ subTransactions }: SubCategoryProps) => {
  const [editingId,setEditingId] = useState<string | null>(null);
  const [editSubCategoryName,setEditSubCategoryName] = useState('');
  const [editAmount,setEditAmount] = useState('');
  const [editMemo,setEditMemo] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

    const normalizeAmount = (input: string) => {
    const half = input.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/ /g, '');
    const numeric = half.replace(/[^0-9]/g, '');
    return Number(numeric);
  };

  const handleEditClick = (item:typeof subTransactions[number]) =>{
    setEditingId(item.id);
    setEditSubCategoryName(item.subCategory);
    setEditAmount(item.amount.toLocaleString());
    setEditMemo(item.memo);
  }
  const handleSave = async() => {
    if(!user?.uid || !editingId) return;

    const docRef = doc(db,'users',user.uid,'transactions',editingId);
    try{
      await updateDoc(docRef,{
        subCategory:editSubCategoryName,
        amount:normalizeAmount(editAmount),
        memo:editMemo,
      });

      setEditingId(null);
    }catch(error){
      console.log('エラー',error)
    }
  }
  const canselEdit = (item:typeof subTransactions[number]) =>{
    setEditSubCategoryName(item.subCategory);
    setEditAmount(item.amount.toLocaleString());
    setEditMemo(item.memo);
    setEditingId(null);
  } 
  const handleDeleteSubCategory = async(subCategory:string) =>{
    if(!user?.uid) return;
    const confirm = window .confirm(`${subCategory}を削除しますか？`);
    if(!confirm) return;

    const itemsToDelete = subTransactions.filter((item)=> item.subCategory === subCategory)

    try{
      const deletePromises = itemsToDelete.map((item) =>{
        const docRef = doc(db,'users',user.uid,'transactions',item.id);
        return deleteDoc(docRef);
      });

      await Promise.all(deletePromises);
    }catch(error){
      console.log('削除に失敗しました',error)
    }
  }

  return (
    <ul>
      {subTransactions.map((item) => (
        <li key={item.id} className="sub-category-item">
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
