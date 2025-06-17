import { useEffect, useState } from "react";
import Header from "../components/Header";
import MonthNavigate from "../components/MonthNavigate";
import CategoryList from "../components/CategoryList";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import '../styles/caegory.css'
type Transaction = {
  id: string;
  amount: number;
  mainCategory: string;
  subCategory: string;
  memo: string;
  createdAt: Date;
};
const Category = () => {
  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "payment">("payment"); // 収入 or 支出の選択

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "users", user.uid, "transactions"),
          where("type", "==", type)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.date?.toDate?.() || new Date();
            return {
              id: doc.id,
              amount: typeof data.amount === "number" ? data.amount : 0,
              mainCategory: data.mainCategory ?? "未分類",
              subCategory: data.subCategory ?? "",
              memo: data.memo ?? "",
              createdAt: createdAt,
            };
          });

          const filtered = docs.filter(
            (item) =>
              item.createdAt.getFullYear() === date.getFullYear() &&
              item.createdAt.getMonth() === date.getMonth()
          );

          setTransactions(filtered);
        });

        return () => unsubscribeSnapshot(); // onSnapshotのクリーンアップ
      }
    });

    return () => unsubscribeAuth(); // onAuthStateChangedのクリーンアップ
  }, [date, type]);

  return (
    <div>
      <Header />
   
      <MonthNavigate date={date} setDate={setDate}/>
      
      <div className="category-list">
      <CategoryList transactions={transactions} />
      </div>
    </div>
  );
};

export default Category;
