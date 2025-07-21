import { useEffect, useState } from "react"
import Header from "../components/Header"
import Income from "../components/Income"
import MonthNavigate from "../components/MonthNavigate"
import Payment from "../components/Payment"
import Saving from "../components/Saving"
import "../styles/home.css"
import TransactionFormModal from "../components/TransactionFormModal"
import { Modal } from "../components/Modal"
import SavingAllocationModal from "../components/SavingAllocationModal"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"


const Home = () => {
  const [modalType,setModalType] = useState<"transaction" | "saving" |null>(null); //モーダルのタイプを管理
  const [isopenModal,setIsopenModal] = useState(false); //モーダルの開閉管理
  const [savingBalance,setSavingBalance] = useState(0); //収入かた支出を引いた値を管理
  const [selectDate,setSelectDate] = useState(new Date());  //表示する月の管理
  const [transactionTyoe,setTransactionType] = useState<'income' | 'payment'>('income')  //支出と収入の種類管理
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]); //収入のカテゴリを配列で管理
  const [paymentCategories, setPaymentCategories] = useState<string[]>([]); //支出のカテゴリを配列で管理
  const [sharedWith,setSharedWith] = useState<string|null>(null); //共有相手のuidを管理
  const [currentUser,setCurrentUser] = useState<User|null>(null); //ユーザのuidを管理
  const [partnerName,setPartnerName] = useState<string|null>(null); //共有相手の名前を管理

  //コンポーネントの初回マウント時にユーザデータを取得
  useEffect(()=>{
    //ユーザ情報取得
    const auth = getAuth();
    //リアルタイム監視の解除
    let unsubscribeUser = () => {};
    let unsubscribePartner = () =>{};

    //ログイン情報をリアルタイムで監視
    const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{
      if(!user) return;//ユーザが存在しない場合中断
      setCurrentUser(user);//ローカルstateに現在のユーザをセット

      
      const userDocRef = doc(db,'users',user.uid);//ユーザのドキュメントをFirebaseから参照
      //ユーザのFirebaseの情報をリアルタイムで監視
       unsubscribeUser = onSnapshot(userDocRef,(snap)=>{
        const data = snap.data();
        const partnerUid = data?.sharedWith || null;//データが存在していればsharedWithをパートナーUidとしてセット、それ以外はnullをセット
        setSharedWith(partnerUid);//stateにセット

      //パートナーUidが存在していたら共有相手の情報を取得
      if(partnerUid){
        const partnerRef = doc(db,'users',partnerUid);//共有相手の情報をFirebaseから参照
        //共有相手の情報をリアルタイムで監視
        unsubscribePartner = onSnapshot(partnerRef,(partnerSnap)=>{
          const partnerData = partnerSnap.data();
          setPartnerName(partnerData?.name||'相手');//パートナーのデータが存在していれば、partner.nameをstateにセット、それ以外は相手をセット
        });
      }else{
        setPartnerName(null);//共有相手が存在していなかったらnullをセット
      }
    });
  });
  //コンポーネントのアンマウント時にリアルタイム監視を解除する
    return ()=> {
      unsubscribeAuth();
      unsubscribePartner();
      unsubscribeUser();
    }
  },[]);
  console.log(currentUser);
  //モーダルの開閉処理
  const openModal = () => setIsopenModal(true);
  const closeModal = () => setIsopenModal(false);

  return (
    <div>
    <Header />{/*ヘッダーコンポーネントを表示*/}
    {/*モーダル開閉管理*/}
    {isopenModal && ( /*isopenModalがtrueの場合modalコンポーネントを表示*/
      <Modal onClose={closeModal}>
        {/*modalTypeの値によって表示するコンポーネントを切り替え*/}
        {modalType === "transaction" &&(
        <TransactionFormModal 
        onClose={closeModal} type={transactionTyoe} incomeCategories={incomeCategories} 
        setIncomeCategories={setIncomeCategories}paymentCategories={paymentCategories}
        setPaymentCategories={setPaymentCategories}/>
        )}
        {modalType === "saving" &&(
          <SavingAllocationModal onClose={closeModal} balance={savingBalance} selectedDate={selectDate}/>
        )}
      </Modal>
    )}
    <div className="home-layout">
      <div className="month-layout">
        {/*子コンポーネントに現在の日付と更新関数を渡す*/}
      <MonthNavigate date={selectDate} setDate={setSelectDate} />
      </div>
      <div className="main-content">
        <div className="left-section">
          <div className="income-layout">
            <Income onAddClick={()=>{setTransactionType('income');setModalType("transaction");openModal();}} 
            setModalType={setModalType} selectedDate={selectDate} sharedWith={sharedWith}/>
          </div>
          <div className="saving-layout">
          <Saving onAddClick={openModal} setModalType={setModalType} onBalanceChange={setSavingBalance} selectedDate={selectDate} sharedWith={sharedWith} />
          </div>
        </div>  
        <div className="payment-layout">
          <Payment onAddClick={()=>{setTransactionType('payment');setModalType("transaction");openModal();}} 
            setModalType={setModalType} selectedDate={selectDate} sharedWith={sharedWith} partnerName={partnerName}/>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home