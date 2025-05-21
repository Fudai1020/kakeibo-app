import Header from "../components/Header"
import Income from "../components/Income"
import MonthNavigate from "../components/MonthNavigate"
import Payment from "../components/Payment"
import Saving from "../components/Saving"
import "../styles/home.css"

const Home = () => {
  return (
    <div>
    <Header />
      <div className="month-layout">
      <MonthNavigate />
      </div>
      <div className="income-layout">
      <Income />
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