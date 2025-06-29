import { useEffect, useState } from "react"
import Header from "../components/Header"
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import SharedWithPartner from "../components/SharedWithPartner";
import NoPartnerView from "../components/NoPartnerView";

const Shared = () => {
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [partnerLeft, setPartnerLeft] = useState(false);

  const currentUid = getAuth().currentUser?.uid;
  const partnerUid = sharedWith === currentUid ? null : sharedWith;

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user)=>{
    if (!user) {
      setLoading(false);
      return;
    }
  
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribeUser = onSnapshot(userDocRef, (userSnap) => {
      const userData = userSnap.data();
      const partnerUidFromDb = userData?.sharedWith;

      if (!partnerUidFromDb) {
        setSharedWith(null);
        setPartnerLeft(false);
        setLoading(false);
        return;
      }

      setSharedWith(partnerUidFromDb);

      const partnerDocRef = doc(db, 'users', partnerUidFromDb);

      const unsubscribePartner = onSnapshot(partnerDocRef, (partnerSnap) => {
        const partnerData = partnerSnap.data();
        if (!partnerData?.sharedWith || partnerData.sharedWith !== user.uid) {
          setPartnerLeft(true);
        } else {
          setPartnerLeft(false);
        }
        setLoading(false);
      });

      return () => unsubscribePartner();
    });
    return () => unsubscribeUser();
  });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <p style={{color:"white",textAlign:'center',marginTop:50}}>読み込み中...</p>;

  return (
    <div>
      <Header />
      <div className="shared-page">
        {partnerLeft ? (
          <div>
            <p>パートナーが共有を終了しました。</p>
            <button onClick={() => {setSharedWith(null); setPartnerLeft(false);}}>再読み込み</button>
          </div>
        ) : partnerUid ? (
          <SharedWithPartner partnerUid={partnerUid} />
        ) : (
          <NoPartnerView onShareSuccess={(uid: string) => setSharedWith(uid)} />
        )}
      </div>
    </div>
  );
};


export default Shared;
