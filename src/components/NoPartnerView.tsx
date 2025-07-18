import { useState } from "react";
import { db } from "../firebase/firebase";
import {  doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import '../styles/noPartnerView.css'
//親から渡される値の型を定義
type props = {
    onShareSuccess:(partnerUid:string)=>void;
}

const NoPartnerView = ({onShareSuccess}:props) => {
  //共有の始め方の管理
  const [mode, setMode] = useState<"start" | "join" | null>(null);
  //キーワードの管理
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  //ユーザ認証を行う
  const user = getAuth().currentUser;

  //合言葉を作成する処理
  const generateKeyword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"; //合言葉で使用する文字列
    return Array.from({ length: 6 }, //要素数が６つの配列を作成
      () => chars[Math.floor(Math.random() * chars.length)]).join("");//インデックスの範囲内の数で整数に変換してランダムに配列に格納して結合
  };
  //共有を開始する処理
  const handleStartSharing = async () => {
    if (!user) return;

    //合言葉を作成し合言葉をセット
    const newKeyword = generateKeyword();
    setKeyword(newKeyword);

    //データ先を指定してデータを追加
    const docRef = doc(db, "sharedPairs", newKeyword);
    //ユーザAとして自分のUidと共有開始日を追加
    await setDoc(docRef, {
      userA: user.uid,
      createdAt: new Date(),
    });
    //共有状態にstateを更新
    setMode("start");
  };
  //招待されたユーザが共有に参加する処理
  const handleJoinSharing = async () => {
    //ユーザ情報と合言葉が存在していない場合処理を中断
    if (!user || !keyword) return;
    //招待された相手のデータ先を指定して取得
    const pairRef = doc(db, "sharedPairs", keyword);
    const pairSnap = await getDoc(pairRef);
    //取得した情報にデータが存在しない場合エラーを出して処理を中断
    if (!pairSnap.exists()) {
      setError("合言葉が見つかりませんでした。");
      return;
    }
    //共有相手のデータをコピー
    const data = pairSnap.data();
    //共有相手のデータにUserB（共有済み）が存在していたら処理を中断
    if (data.userB) {
      setError("この合言葉はすでに使用されています。");
      return;
    }

    // 相手のUID取得
    const partnerUid = data.userA;
    //自分のUidto共有対象のUidga一致していた場合処理を中断
  if (partnerUid === user.uid) {
    setError("自分自身とは共有できません。");
    return;
  }

    // 相互に sharedWith に相手のUidを保存
    await Promise.all([
      updateDoc(doc(db, "users", user.uid), {
        sharedWith: partnerUid,
        sharedAt:Timestamp.now(),
      }),
      updateDoc(doc(db, "users", partnerUid), {
        sharedWith: user.uid,
        sharedAt:Timestamp.now(),
      }),
      //userBに共有に参加したユーザのUidを保存
      updateDoc(pairRef, {
        userB: user.uid,
        startedAt:Timestamp.now(),
      }),
    ]);

    setMode(null); // モード終了 → shared.tsx で切り替わる
    onShareSuccess(partnerUid);//親コンポーネントに共有相手のUidを渡す
  };
  //共有モードの終了
  const handleBack = () =>{
    setMode(null);
  }

  return (
    <div className="no-partner-view">
      {/*共有モードの状態管理*/}
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
