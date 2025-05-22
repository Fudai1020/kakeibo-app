import '../styles/transactionFormModal.css'

type Props = {
  onClose: () => void;
};

const TransactionFormModal = ({onClose}:Props) => {
  return (
    <div className="modal-container">
      <div className="radio-group">
        <label>
        <input type="radio" id='income'name="transactionType" value="income"/>
        収入</label>
        <label>
        <input type="radio" id='payment' name="transactionType" value="payment"/>
        支出</label>
      </div>
      <div className='input-amount'>
      <input type="text" />
      </div>
      <div className="select-category">
      <h2>カテゴリ</h2>
      <select name="" id="">
        <option value=""></option>
        <option value="">食費</option>
      </select>
      </div>
      <div className="memo">
      <h2>メモ</h2>
      <textarea name="" id=""></textarea>
      </div>
      <h2>日付</h2>
      <input type="date" />
      <h2>公開設定</h2>
      <div className="radio-group">
       <label>
        <input type="radio" id='isprivate'name="privateselect" value="isprivate"/>
        公開</label>
        <label>
        <input type="radio" id='isnotprivate' name="privateselect" value="isnotprivate"/>
        非公開</label>
      </div>
      <button>登録</button>
    </div>
  )
}

export default TransactionFormModal