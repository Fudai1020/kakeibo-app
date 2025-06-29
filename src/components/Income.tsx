type Props = {
  onAddClick: () => void;
  setModalType: React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  selectedDate: Date;
  sharedWith: string | null; // 👈 追加
};

import { useEffect, useState } from 'react';
import '../styles/income.css'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AnimateNumber from './AnimateNumber';

const Income = ({ onAddClick, setModalType, selectedDate, sharedWith }: Props) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    
  const auth = getAuth();
  let unsubMy = () => {};
  let unsubPartner = () => {};

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) return;
    const currentUid = user.uid;

    const myRef = query(
      collection(db, "users", currentUid, "transactions"),
      where("type", "==", "income")
    );

    unsubMy = onSnapshot(myRef, (mySnap) =>   {
      const myData = mySnap.docs.map((doc) => doc.data());

      // 👇 相手のデータはここでしか購読しないようにする
      if (sharedWith && sharedWith !== currentUid) {
        const partnerRef = query(
          collection(db, "users", sharedWith, "transactions"),
          where("type", "==", "income"),
          where("isPrivate", "==", false)
        );

        unsubPartner = onSnapshot(partnerRef, (partnerSnap) => {
          const partnerData = partnerSnap.docs.map((doc) => doc.data());
            console.log("✅ 相手の取得データ:", partnerData); 
          const all = [...myData, ...partnerData].filter((d) => {
            const createdAt = d.date?.toDate?.() || new Date();
            return (
              createdAt.getFullYear() === selectedDate.getFullYear() &&
              createdAt.getMonth() === selectedDate.getMonth()
            );
          });

          const totalIncome = all.reduce(
            (sum, d) => sum + (typeof d.amount === "number" ? d.amount : 0),
            0
          );

          setTotal(totalIncome);
        });
      } else {
        // 相手なし
        const filtered = myData.filter((d) => {
          const createdAt = d.date?.toDate?.() || new Date();
          return (
            createdAt.getFullYear() === selectedDate.getFullYear() &&
            createdAt.getMonth() === selectedDate.getMonth()
          );
        });

        const totalIncome = filtered.reduce(
          (sum, d) => sum + (typeof d.amount === "number" ? d.amount : 0),
          0
        );

        setTotal(totalIncome);
      }
    });
  });

  return () => {
    unsubMy();
    unsubPartner();
    unsubscribeAuth();
  };
}, [selectedDate, sharedWith]);


  const handleClick = () => {
    setModalType("transaction");
    onAddClick();
  };

  return (
    <div className="income-box">
      <h1>今月の収入</h1>
      <h2><AnimateNumber value={total} /></h2>
      <button onClick={handleClick}>収入を追加</button>
    </div>
  );
};

export default Income;
