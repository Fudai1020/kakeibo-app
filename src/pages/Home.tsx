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
  const [modalType,setModalType] = useState<"transaction" | "saving" |null>(null);
  const [isopenModal,setIsopenModal] = useState(false);
  const openModal = () => setIsopenModal(true);
  const closeModal = () => setIsopenModal(false);
  const [savingBalance,setSavingBalance] = useState(0);
  const [selectDate,setSelectDate] = useState(new Date());
  const [transactionTyoe,setTransactionType] = useState<'income' | 'payment'>('income')  
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [paymentCategories, setPaymentCategories] = useState<string[]>([]);
  const [sharedWith,setSharedWith] = useState<string|null>(null);
  const [currentUser,setCurrentUser] = useState<User|null>(null);
  const [partnerName,setPartnerName] = useState<string|null>(null);

  useEffect(()=>{
    const auth = getAuth();
    let unsubscribeUser = () => {};
    let unsubscribePartner = () =>{};

    const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{
      if(!user) return;
      setCurrentUser(user);

      const userDocRef = doc(db,'users',user.uid);
       unsubscribeUser = onSnapshot(userDocRef,(snap)=>{
        const data = snap.data();
        const partnerUid = data?.sharedWith || null;
        setSharedWith(partnerUid);  

      if(partnerUid){
        const partnerRef = doc(db,'users',partnerUid);
         unsubscribePartner = onSnapshot(partnerRef,(partnerSnap)=>{
          const partnerData = partnerSnap.data();
          setPartnerName(partnerData?.name||'相手');
        });
      }else{
        setPartnerName(null);
      }
    });
  });
    return ()=> {
      unsubscribeAuth();
      unsubscribePartner();
      unsubscribeUser();
    }
  },[]);


  return (
    <div>
    <Header />
    {isopenModal && (
      <Modal onClose={closeModal}>
        {modalType === "transaction" &&(
        <TransactionFormModal 
        onClose={closeModal} type={transactionTyoe} incomeCategories={incomeCategories} setIncomeCategories={setIncomeCategories}paymentCategories={paymentCategories}
        setPaymentCategories={setPaymentCategories}/>
        )}
        {modalType === "saving" &&(
          <SavingAllocationModal onClose={closeModal} balance={savingBalance} selectedDate={selectDate}/>
        )}
      </Modal>
    )}
      <div className="month-layout">
      <MonthNavigate date={selectDate} setDate={setSelectDate} />
      </div>
      <div className="income-layout">
      <Income onAddClick={()=>{setTransactionType('income');setModalType("transaction");openModal();}} setModalType={setModalType} selectedDate={selectDate} sharedWith={sharedWith}/>
      </div>
      <div className="saving-layout">
      <Saving onAddClick={openModal} setModalType={setModalType} onBalanceChange={setSavingBalance} selectedDate={selectDate} sharedWith={sharedWith} />
      </div>
      <div className="payment-layout">
      <Payment onAddClick={()=>{setTransactionType('payment');setModalType("transaction");openModal();}} 
      setModalType={setModalType} selectedDate={selectDate} sharedWith={sharedWith} partnerName={partnerName}/>
      </div>
    </div>
  )
}

export default Home