import { useState } from "react"
import Header from "../components/Header"
import Income from "../components/Income"
import MonthNavigate from "../components/MonthNavigate"
import Payment from "../components/Payment"
import Saving from "../components/Saving"
import "../styles/home.css"
import TransactionFormModal from "../components/TransactionFormModal"
import { Modal } from "../components/Modal"

const Home = () => {
  const [isopenModal,setIsopenModal] = useState(false);

  const openModal = () => setIsopenModal(true);
  const closeModal = () => setIsopenModal(false);


  return (
    <div>
    <Header />
    {isopenModal && (
      <Modal onClose={closeModal}>
        <TransactionFormModal onClose={closeModal} />
      </Modal>
    )}
      <div className="month-layout">
      <MonthNavigate />
      </div>
      <div className="income-layout">
      <Income onAddClick={openModal} />
      </div>
      <div className="saving-layout">
      <Saving />
      </div>
      <div className="payment-layout">
      <Payment />
      </div>
    </div>
  )
}

export default Home