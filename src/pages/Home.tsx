import { useState } from "react"
import Header from "../components/Header"
import Income from "../components/Income"
import MonthNavigate from "../components/MonthNavigate"
import Payment from "../components/Payment"
import Saving from "../components/Saving"
import "../styles/home.css"
import TransactionFormModal from "../components/TransactionFormModal"
import { Modal } from "../components/Modal"
import SavingAllocationModal from "../components/SavingAllocationModal"


const Home = () => {
  const [modalType,setModalType] = useState<"transaction" | "saving" |null>(null);
  const [isopenModal,setIsopenModal] = useState(false);
  const openModal = () => setIsopenModal(true);
  const closeModal = () => setIsopenModal(false);
  const [savingBalance,setSavingBalance] = useState(0);
  const [selectDate,setSelectDate] = useState(new Date());
  const [transactionTyoe,setTransactionType] = useState<'income' | 'payment'>('income')  

  return (
    <div>
    <Header />
    {isopenModal && (
      <Modal onClose={closeModal}>
        {modalType === "transaction" &&(
        <TransactionFormModal onClose={closeModal} type={transactionTyoe} />
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
      <Income onAddClick={()=>{setTransactionType('income');setModalType("transaction");openModal();}} setModalType={setModalType} selectedDate={selectDate}/>
      </div>
      <div className="saving-layout">
      <Saving onAddClick={openModal} setModalType={setModalType} onBalanceChange={setSavingBalance} selectedDate={selectDate}/>
      </div>
      <div className="payment-layout">
      <Payment onAddClick={()=>{setTransactionType('payment');setModalType("transaction");openModal();}} setModalType={setModalType} selectedDate={selectDate}/>
      </div>
    </div>
  )
}

export default Home