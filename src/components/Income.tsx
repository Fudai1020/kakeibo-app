//プロップスで渡される型定義
type Props = {
  onAddClick: () => void; //何も返さない型
  setModalType: React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;//子コンポーネントはから親の状態を変更できるようにする
  selectedDate: Date;
  sharedWith: string | null; 
};

import { useEffect, useState } from 'react';
import '../styles/income.css'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AnimateNumber from './AnimateNumber';

const Income = ({ onAddClick, setModalType, selectedDate, sharedWith }: Props) => {
  const [total, setTotal] = useState(0);

  //ユーザの情報と共有相手の情報を日付マウント時、sharedWithのマウント時に取得
  useEffect(() => {
  const auth = getAuth();
  //リアルタイム監視の解除の準備
  let unsubMy = () => {};
  let unsubPartner = () => {};

  //ログイン情報をリアルタイムで監視
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) return;
    const currentUid = user.uid;

    //ユーザの収入データを参照
    const myRef = query(
      collection(db, "users", currentUid, "transactions"),
      where("type", "==", "income")
    );

    //参照したデータをリアルタイム監視
    unsubMy = onSnapshot(myRef, (mySnap) =>   {
      const myData = mySnap.docs.map((doc) => doc.data());

      // 共有相手がいれば共有相手の情報を取得する
      if (sharedWith && sharedWith !== currentUid) {
        const partnerRef = query(
          collection(db, "users", sharedWith, "transactions"),
          where("type", "==", "income"),
          where("isPrivate", "==", false)
        );

        unsubPartner = onSnapshot(partnerRef, (partnerSnap) => {
          const partnerData = partnerSnap.docs.map((doc) => doc.data());
            console.log("✅ 相手の取得データ:", partnerData); 

            //共有相手が存在する場合、自分のデータと相手のデータを結合して、そのデータを月ごとにフィルターする
          const all = [...myData, ...partnerData].filter((d) => {
            const createdAt = d.date?.toDate?.() || new Date();
            return (
              createdAt.getFullYear() === selectedDate.getFullYear() &&
              createdAt.getMonth() === selectedDate.getMonth()
            );
          });
          //結合したデータないの金額を結合する
          const totalIncome = all.reduce(
          (sum, d) => sum + (typeof d.amount === "number" ? d.amount : 0),0);
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

  //useEffectのクリーンアップ関数でリアルタイム監視を解除
  return () => {
    unsubMy();
    unsubPartner();
    unsubscribeAuth();
  };
}, [selectedDate, sharedWith]);

//transactionモーダルを開く処理
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
