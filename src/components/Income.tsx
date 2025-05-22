type props = {
  onAddClick:() =>void;
}

import '../styles/income.css'

const income = ({onAddClick}:props) => {
  return (
    <div className="income-box">
        <h1>今月の収入</h1>
        <h2>¥10000</h2>
        <button onClick={onAddClick}>収入を追加</button>
    </div>
  )
}

export default income