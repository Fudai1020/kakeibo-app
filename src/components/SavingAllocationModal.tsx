import '../styles/savingAllocationModal.css'
type props = {
    onClose:() => void;
}
const SavingAllocationModal = ({onClose}:props) => {
  return (
    <div className="saving-container">
        <h1>振り分け可能金額</h1>
        <h2>¥10000</h2>
        <h2>振り分け先を選ぶ</h2>
        <div className='amount-form'>
        <ul>
            <li>旅費・・・¥<input type="text" /></li>
        </ul>
        </div>
        <div className='category-type'>
        <input type="text" placeholder="新しい金額を入力..." />
        <select>
            <option value=""></option>
            <option value="公開">公開</option>
            <option value="非公開">非公開</option>
        </select>
        <button>追加</button>
        </div>
        <div className='saving-button'>
        <button onClick={onClose}>保存</button>
        </div>
    </div>
  )
}

export default SavingAllocationModal