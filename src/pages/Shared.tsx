import { useEffect, useState } from "react"
import Header from "../components/Header"
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import SharedWithPartner from "../components/SharedWithPartner";
import NoPartnerView from "../components/NoPartnerView";

const Shared = () => {
  //共有相手のUidを管理
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); //ローディング状態の管理
  const [partnerLeft, setPartnerLeft] = useState(false);  //共有相手の解除状態の管理
  //ユーザのUidを保存
  const currentUid = getAuth().currentUser?.uid;
  //sharedWithとユーザのuidが一致していたらnull、位置していなかったらsharedWithを共有相手のUidとして保持
  const partnerUid = sharedWith === currentUid ? null : sharedWith;
  //初回マウント時、ユーザのUidと共有相手のUidをリアルタイム監視し、データを取得する
  useEffect(() => {
    const auth = getAuth();
    //ユーザのログイン状態をリアルタイムで監視
    const unsubscribeAuth = auth.onAuthStateChanged((user)=>{
      //ユーザ情報を確認できない場合ローディング状態を変更して処理を中断
      if (!user) {
        setLoading(false);
        return;
      }
      //取得するユーザ情報を指定
      const userDocRef = doc(db, 'users', user.uid);
      //指定したユーザの情報をリアルタイムで監視
      const unsubscribeUser = onSnapshot(userDocRef, (userSnap) => {
      const userData = userSnap.data();
      const partnerUidFromDb = userData?.sharedWith; //ユーザのデータが存在したらその中のsharedWithを保持
      //sharedWithが存在していない（共有していない)時、stateをリセットして終了
      if (!partnerUidFromDb) {
        setSharedWith(null);
        setPartnerLeft(false);
        setLoading(false);
        return;
      }
      //stateに相手のUidをセット
      setSharedWith(partnerUidFromDb);
      //ユーザが保持してある共有相手のUidを使用し、相手のデータを指定
      const partnerDocRef = doc(db, 'users', partnerUidFromDb);
      //相手のデータの変更をリアルタイムで監視
      const unsubscribePartner = onSnapshot(partnerDocRef, (partnerSnap) => {
        const partnerData = partnerSnap.data();
        //共有をしていない(取得したデータの中にsharedWithがない)時と、取得した共有相手のSharedWithがユーザのUidと一致していない場合
        if (!partnerData?.sharedWith || partnerData.sharedWith !== user.uid) {
          //stateの状態を切り替える
          setPartnerLeft(true);
        } else {
          setPartnerLeft(false);
        }
        //ローディング状態の停止
        setLoading(false);
      });
      //共有相手のリアルタイム監視の停止
      return () => unsubscribePartner();
    });
    //ユーザのリアルタイム監視の停止
    return () => unsubscribeUser();
  });
    //ユーザのログイン状態の監視の停止
    return () => unsubscribeAuth();
  }, []);

  if (loading) return <p style={{color:"white",textAlign:'center',marginTop:50}}>読み込み中...</p>;

  return (
    <div>
      <Header />
      <div className="shared-page">
        {/*partnerLeftがtrueの場合メッセージを表示*/}
        {partnerLeft ? (
          <div>
            <p>パートナーが共有を終了しました。</p>
            <button onClick={() => {setSharedWith(null); setPartnerLeft(false);}}>再読み込み</button>
          </div>
        ) : partnerUid ? (  //共有相手のUidが取得できていたら共有相手のプロフィールを表示
          <SharedWithPartner partnerUid={partnerUid} />
        ) : (//共有していない場合NoPartnerViewコンポーネントを表示
          <NoPartnerView onShareSuccess={(uid: string) => setSharedWith(uid)} />
        )}
      </div>
    </div>
  );
};


export default Shared;
