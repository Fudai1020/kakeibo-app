import { FaEdit, FaTrash } from "react-icons/fa";
import AnimateNumber from "./AnimateNumber";
import SubCategories from "./SubCategories";
import { db } from "../firebase/firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";

type Transaction = {
  id: string;
  amount: number;
  mainCategory: string;
  subCategory: string;
  memo: string;
  createdAt: Date;
};

type Props = {
  transactions: Transaction[];
};

const CategoryList = ({ transactions }: Props) => {
    const [editCategory,setEditCategory] = useState<string | null>(null);
    const [newCategory,setNewCategory] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const grouped = transactions.reduce((acc, item) => {
    if (!acc[item.mainCategory]) acc[item.mainCategory] = [];
    acc[item.mainCategory].push(item);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // ✅ 指定された mainCategory のトランザクション全部を削除
  const handleDeleteCategory = async (mainCategory: string) => {
    if (!user?.uid) return;
    const confirm = window.confirm(`${mainCategory} のすべての項目を本当に削除しますか？`);
    if (!confirm) return;

    const itemsToDelete = grouped[mainCategory];
    try {
      const deletePromises = itemsToDelete.map((item) => {
        const docRef = doc(db, "users", user.uid, "transactions", item.id);
        return deleteDoc(docRef);
      });

      await Promise.all(deletePromises);
      console.log(`${mainCategory} の項目すべて削除完了`);
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  const startEdit = (category:string) =>{
    setEditCategory(category);
    setNewCategory(category);
  }
  const handleSave = async()=>{
    if(!editCategory || newCategory.trim() === '') return;
    if(!user) return;

    const itemsToUpdate = grouped[editCategory];
    try{
        const categoriesSnapShot = await getDocs(
            collection(db,'users',user.uid,'categories')
        );
        const matchedDoc = categoriesSnapShot.docs.find((doc)=>doc.data().name === editCategory)
        const updatePromises = itemsToUpdate.map(item=>{
            const docRef = doc(db,'users',user.uid,'transactions',item.id);
            return updateDoc(docRef,{
                mainCategory:newCategory,
            });
        });

        let categoryUpdatePromise = Promise.resolve();
            if (matchedDoc) {
      const categoryDocRef = doc(
        db,
        'users',
        user.uid,
        'categories',
        matchedDoc.id
      );
      categoryUpdatePromise = updateDoc(categoryDocRef, {
        name: newCategory,
      });
    } else {
      console.warn('該当カテゴリが categories コレクションに見つかりませんでした。');
    }
        await Promise.all([...updatePromises,categoryUpdatePromise]);
        console.log('完了');
    }catch(error){
        console.log('失敗',error); 
    }
    setEditCategory(null);
  };
  const canselEdit = ()=>{
    setEditCategory(null);
    setNewCategory('');
  }
  const totalAmount = transactions.reduce((sum,item) => sum + item.amount,0);


  return (
    <div className="overflow-category">
      {Object.entries(grouped).map(([mainCategory, subTransactions]) => {
        const total = subTransactions.reduce((sum, item) => sum + item.amount, 0);
        return (
          <div key={mainCategory} className="category-block">
            <div className="category-header">
                {editCategory === mainCategory ?(
                    <input type="text"
                    className="edit-category"
                    value={newCategory} 
                    onChange={(e)=>setNewCategory(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter") handleSave()
                        if(e.key === 'escape') canselEdit()}
                    }
                    autoFocus
                    />
                    
                ):(
              <h3>
                <span className="category-title">
                  {mainCategory}・・・合計：<AnimateNumber value={total} />円
                </span>
              </h3>
                )}
              <div className="category-actions">
                {editCategory===mainCategory ? (
                    <div className="edit-buttons">
                    <button className='edit-button' onClick={handleSave}>保存</button>
                    <button className="edit-button" onClick={canselEdit}>キャンセル </button>
                    </div>
                ):(
                <div className="icon-buttons">
                <button className="icon-button"
                onClick={()=>startEdit(mainCategory)}>
                  <FaEdit />
                </button>
                
                <button
                  className="icon-button"
                  onClick={() => handleDeleteCategory(mainCategory)}
                >
                  <FaTrash />
                </button>
                </div>
                )}
              </div>
            </div>
            <SubCategories subTransactions={subTransactions} />
          </div>
        );
      })}
    <div className="total-amount">
      <h1>合計：<AnimateNumber value={totalAmount}/></h1>
      </div>
    </div>
  );
};

export default CategoryList;
