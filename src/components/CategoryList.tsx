import { FaEdit, FaTrash } from "react-icons/fa";
import AnimateNumber from "./AnimateNumber";
import SubCategories from "./SubCategories";
import { db } from "../firebase/firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";
//新しくtransaction型としてオブジェクトの型を定義
type Transaction = {
  id: string;
  amount: number;
  mainCategory: string;
  subCategory: string;
  memo: string;
  createdAt: Date;
};
//プロップスで受け取る値に方を当てはめる
type Props = {
  transactions: Transaction[];
};

const CategoryList = ({ transactions }: Props) => {
  //現在編集中のカテゴリ名を管理
  const [editCategory,setEditCategory] = useState<string | null>(null);
    //編集した内容の値を管理
  const [newCategory,setNewCategory] = useState('');
  //ユーザ認証
  const auth = getAuth();
  const user = auth.currentUser;
  //配列を一つのオブジェクトに変換する処理
  const grouped = transactions.reduce((acc, item) => {
    //指定された値が存在していなければ新しく配列を用意
    if (!acc[item.mainCategory]) acc[item.mainCategory] = [];
    acc[item.mainCategory].push(item);  //データを配列に追加
    return acc; //完成したオブジェクトを返す
  }, {} as Record<string, Transaction[]>); //初期値として空のオブジェクトを作成し、型を指定

  //指定された mainCategory のトランザクション全部を削除
  const handleDeleteCategory = async (mainCategory: string) => {
    if (!user?.uid) return;
    const confirm = window.confirm(`${mainCategory} のすべての項目を本当に削除しますか？`);
    if (!confirm) return;
    //グループ分けしたオブジェクトから指定されたmainCategoryの値をコピーする
    const itemsToDelete = grouped[mainCategory];
    try {
      //mainCtegoryの値を1件ずつ配列に移し、データを参照して削除する準備を行う
      const deletePromises = itemsToDelete.map((item) => {
        const docRef = doc(db, "users", user.uid, "transactions", item.id);
        return deleteDoc(docRef);
      });
      //Promise.allでデータが複数あった場合でも削除できる
      await Promise.all(deletePromises);
      console.log(`${mainCategory} の項目すべて削除完了`);
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };
  //編集モードの開始
  const startEdit = (category:string) =>{
    setEditCategory(category);
    setNewCategory(category);
  }
  //編集した内容を保存
  const handleSave = async()=>{
    //何も入力されていない時とデータが存在しない場合中断
    if(!editCategory || newCategory.trim() === '') return;
    if(!user) return;
    //編集中のカテゴリをコピー
    const itemsToUpdate = grouped[editCategory];
    try{
      //更新先のデータを取得
        const categoriesSnapShot = await getDocs(
            collection(db,'users',user.uid,'categories')
        );
        //取得したデータの中から編集中のデータと一致する値を探す
        const matchedDoc = categoriesSnapShot.docs.find((doc)=>doc.data().name === editCategory);
        //保存処理を準備
        const updatePromises = itemsToUpdate.map(item=>{
            const docRef = doc(db,'users',user.uid,'transactions',item.id);
            return updateDoc(docRef,{
                mainCategory:newCategory,
            });
        });

        let categoryUpdatePromise = Promise.resolve(); //初期値として解決済みのpromiseを用意
        //データが取得できた場合更新の準備
        if (matchedDoc) {
          const categoryDocRef = doc(db,'users',user.uid,'categories',matchedDoc.id);
          categoryUpdatePromise = updateDoc(categoryDocRef, {name: newCategory,});
        }else {
          console.warn('該当カテゴリが categories コレクションに見つかりませんでした。');
        }
        //Promise.allで一気に更新処理を実行
        await Promise.all([...updatePromises,categoryUpdatePromise]);
        console.log('完了');
    }catch(error){
        console.log('失敗',error); 
    }
    //編集内容をリセット
    setEditCategory(null);
  };
  //編集を中断する処理
  const canselEdit = ()=>{
    setEditCategory(null);
    setNewCategory('');
  }
  //データの金額を合計
  const totalAmount = transactions.reduce((sum,item) => sum + item.amount,0);


  return (
    <>
    <div className="overflow-category">
      {/*オブジェクトを配列に変換し、グループの中でカテゴリ別の合計金額を計算*/}
      {Object.entries(grouped).map(([mainCategory, subTransactions]) => {
        const total = subTransactions.reduce((sum, item) => sum + item.amount, 0);
        return (
          <div key={mainCategory} className="category-block">
            <div className="category-header">
              {/*編集状態の場合テキストボックスの表示*/}
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
    </div>
     <div className="total-amount">
      <h2>合計：<AnimateNumber value={totalAmount}/></h2>
      </div>
    </>
  );
};

export default CategoryList;
