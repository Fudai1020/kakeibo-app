import { ChevronLeft, ChevronRight } from "lucide-react"
import '../styles/monthNavigate.css' 

type props ={
  date:Date,
  setDate:React.Dispatch<React.SetStateAction<Date>>; //親コンポーネントのset関数に値を渡す
}
const MonthNavigate = ({date,setDate}:props) => {

  //前の月に変える処理
  const handlePrevMonth = () => {
    const prevDate = new Date(date); //propsで受けとった値date型オブジェクトをコピーして新しく生成
    prevDate.setMonth(prevDate.getMonth()-1);  //月をー１にして前の月にする
    setDate(prevDate);  //親から受け取った更新関数にセット
  }
  //次の月に変える処理
  const handleNextMonth = () => {
    const nextDate = new Date(date); //propsで受け取った値date型のオブジェクトをコピーして新しく生成
    nextDate.setMonth(nextDate.getMonth()+1); //月を＋１にして次の月にする
    setDate(nextDate);  //親から受け取った更新関数にセット
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