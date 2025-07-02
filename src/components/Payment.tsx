import { useEffect, useState } from 'react';
import '../styles/payment.css';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Charts from './Charts';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AnimateNumber from './AnimateNumber';

type Props = {
  onAddClick: () => void;
  setModalType: React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
  selectedDate: Date;
  sharedWith: string | null;
  partnerName:string|null;
};

const Payment = ({ onAddClick, setModalType, selectedDate, sharedWith,partnerName }: Props) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<{
    [key: string]: { amount: number; isMine: boolean }[];
  }>({});

  useEffect(() => {
    const auth = getAuth();
    let unsubMy = () => {};
    let unsubPartner = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const currentUid = user.uid;
      const myRef = query(
        collection(db, "users", currentUid, "transactions"),
        where("type", "==", "payment")
      );

      unsubMy = onSnapshot(myRef, (mySnap) => {
        const myData = mySnap.docs.map((doc) => doc.data());

        if (sharedWith && sharedWith !== currentUid) {
          const partnerRef = query(
            collection(db, "users", sharedWith, "transactions"),
            where("type", "==", "payment"),
            where("isPrivate", "==", false)
          );

          unsubPartner = onSnapshot(partnerRef, (partnerSnap) => {
            const partnerData = partnerSnap.docs.map((doc) => doc.data());
            const allData = [...myData, ...partnerData];
            processPaymentData(allData, currentUid);
          });
        } else {
          processPaymentData(myData, currentUid);
        }
      });
    });

    return () => {
      unsubMy();
      unsubPartner();
      unsubscribeAuth();
    };
  }, [selectedDate, sharedWith]);

  const processPaymentData = (allData: any[], currentUid: string) => {
    const filtered = allData
      .map((d) => {
        const createdAt = d.date?.toDate?.() || new Date();
        return {
          ...d,
          createdAt,
          isMine: !sharedWith || d.uid === currentUid,
        };
      })
      .filter(
        (d) =>
          d.createdAt.getFullYear() === selectedDate.getFullYear() &&
          d.createdAt.getMonth() === selectedDate.getMonth()
      );

    const total = filtered.reduce(
      (sum, d) => sum + (typeof d.amount === "number" ? d.amount : 0),
      0
    );
    setTotalAmount(total);

    const categoryMap: { [key: string]: { amount: number; isMine: boolean }[] } = {};
    filtered.forEach((item) => {
      const category = item.mainCategory ?? "未分類";
      const amount = typeof item.amount === "number" ? item.amount : 0;
      if (!categoryMap[category]) categoryMap[category] = [];
      categoryMap[category].push({ amount, isMine: item.isMine });
    });

    setCategoryTotals(categoryMap);
  };

  const handleClick = () => {
    setModalType("transaction");
    onAddClick();
  };

  return (
    <div className='payment-box'>
      <h1 style={{ marginBottom: '-15px' }}>今月の支出</h1>
      <h2 style={{ marginBottom: '-10px' }}><AnimateNumber value={totalAmount} /></h2>
      <div className='container'>
        <div className='left'>
          <div className='centered'>
            <div className='category-box'>
              <h2>項目</h2>
              <ul>
                {Object.entries(categoryTotals).map(([category, items]) => {
                  const total = items.reduce((sum, item) => sum + item.amount, 0);
                  const isMine = items.every(item => item.isMine);

                  return (
                    <li key={category} style={{ color: isMine ? 'white' : 'red' }}>
                      {category}・・・<AnimateNumber value={total} />{isMine && partnerName ? `(${partnerName})`:''}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='chart'>
            <Charts paymentData={Object.entries(categoryTotals).map(([category, items]) => ({
              category,
              amount: items.reduce((sum, item) => sum + item.amount, 0),
            }))} />
          </div>
        </div>
      </div>
      <div className='button-layout'>
        <button onClick={handleClick}>支出入力</button>
      </div>
    </div>
  );
};

export default Payment;
