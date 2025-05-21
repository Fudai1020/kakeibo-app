import { ChevronLeft, ChevronRight } from "lucide-react"
import '../styles/monthNavigate.css' 
import { useState } from "react"

const MonthNavigate = () => {
  const [date,setDate] = useState(new Date())

  const handlePrevMonth = () => {
    const prevDate = new Date(date);
    prevDate.setMonth(prevDate.getMonth()-1);
    setDate(prevDate);
  }
  const handleNextMonth = () => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth()+1);
    setDate(nextDate);
  }
  return (
    <div className="month" >
      <button onClick={handlePrevMonth}
      style={{all:'unset' ,cursor:'pointer',verticalAlign:'middle'}}>
      <ChevronLeft size={40}  />
      </button>
      <span style={{fontSize:'25px', fontWeight:'bold'}}>{date.getFullYear()}年{date.getMonth()+1}月</span>
      <button onClick={handleNextMonth}
       style={{all:'unset',cursor:'pointer',verticalAlign:'middle'}}>
      <ChevronRight size={40}  />
      </button>
    </div>
  )
}

export default MonthNavigate