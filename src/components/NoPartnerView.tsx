import { useState } from "react";
import { db } from "../firebase/firebase";
import {  doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import '../styles/noPartnerView.css'
type props = {
    onShareSuccess:(partnerUid:string)=>void;
}

const NoPartnerView = ({onShareSuccess}:props) => {
  const [mode, setMode] = useState<"start" | "join" | null>(null);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  const user = getAuth().currentUser;

  const generateKeyword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleStartSharing = async () => {
    if (!user) return;

    const newKeyword = generateKeyword();
    setKeyword(newKeyword);

    const docRef = doc(db, "sharedPairs", newKeyword);
    await setDoc(docRef, {
      userA: user.uid,
      createdAt: new Date(),
    });

    setMode("start");
  };

  const handleJoinSharing = async () => {
    if (!user || !keyword) return;

    const pairRef = doc(db, "sharedPairs", keyword);
    const pairSnap = await getDoc(pairRef);

    if (!pairSnap.exists()) {
      setError("合言葉が見つかりませんでした。");
      return;
    }

    const data = pairSnap.data();
    if (data.userB) {
      setError("この合言葉はすでに使用されています。");
      return;
    }

    // 相手のUID取得
    const partnerUid = data.userA;
    console.log("自分のUID:", user.uid);
    console.log("相手のUID:", partnerUid);

  if (partnerUid === user.uid) {
    setError("自分自身とは共有できません。");
    return;
  }

    // 相互に sharedWith を保存
    await Promise.all([
      updateDoc(doc(db, "users", user.uid), {
        sharedWith: partnerUid,
      }),
      updateDoc(doc(db, "users", partnerUid), {
        sharedWith: user.uid,
      }),
      updateDoc(pairRef, {
        userB: user.uid,
      }),
    ]);

    setMode(null); // モード終了 → shared.tsx で切り替わる
    onShareSuccess(partnerUid);
  };
  const handleBack = () =>{
    setMode(null);
  }

  return (
    <div className="no-partner-view">
      {mode === null && (
        <div className="share-options">
          <h2>共有を開始しますか？</h2>
          <button onClick={handleStartSharing}>合言葉を作成する</button>
          <button onClick={() => setMode("join")}>合言葉を入力する</button>
        </div>
      )}

      {mode === "start" && (
        <div className="share-start">
          <p style={{fontWeight:'bold',fontSize:20}}>この合言葉を相手に伝えてください：</p>
          <h3 className="keyword">{keyword}</h3>
          <button onClick={handleBack}>戻る</button>
        </div>
      )}

      {mode === "join" && (
        <div className="share-join">
          <p style={{fontWeight:'bold',fontSize:20}}>相手から教えてもらった合言葉を入力してください</p>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className='buttons'>
          <button onClick={handleJoinSharing}>共有に参加</button>
          <button onClick={handleBack}>戻る</button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default NoPartnerView;
