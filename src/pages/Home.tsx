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
  const [modalType,setModalType] = useState<"transaction" | "saving" | null>(null);
  const [isopenModal,setIsopenModal] = useState(false);

  const openModal = () => setIsopenModal(true);
  const closeModal = () => setIsopenModal(false);
  const [savingBalance,setSavingBalance] = useState(0);

  return (
    <div>
    <Header />
    {isopenModal && (
      <Modal onClose={closeModal}>
        {modalType === "transaction" &&(
        <TransactionFormModal onClose={closeModal} />
        )}
        {modalType === "saving" &&(
          <SavingAllocationModal onClose={closeModal} balance={savingBalance}/>
        )}
      </Modal>
    )}
      <div className="month-layout">
      <MonthNavigate />
      </div>
      <div className="income-layout">
      <Income onAddClick={openModal} setModalType={setModalType}/>
      </div>
      <div className="saving-layout">
      <Saving onAddClick={openModal} setModalType={setModalType} onBalanceChange={setSavingBalance}/>
      </div>
      <div className="payment-layout">
      <Payment onAddClick={openModal} setModalType={setModalType}/>
      </div>
    </div>
  )
}

export default Home