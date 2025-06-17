import { FaEdit, FaTrash } from "react-icons/fa";
import AnimateNumber from "./AnimateNumber";
import SubCategories from "./SubCategories";
import { db } from "../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

  return (
    <div>
      {Object.entries(grouped).map(([mainCategory, subTransactions]) => {
        const total = subTransactions.reduce((sum, item) => sum + item.amount, 0);
        return (
          <div key={mainCategory} className="category-block">
            <div className="category-header">
              <h3>
                <span className="category-title">
                  {mainCategory}・・・合計：<AnimateNumber value={total} />円
                </span>
              </h3>
              <div className="category-actions">
                <button className="icon-button">
                  <FaEdit />
                </button>
                <button
                  className="icon-button"
                  onClick={() => handleDeleteCategory(mainCategory)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <SubCategories subTransactions={subTransactions} />
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
