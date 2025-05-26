type props = {
    onAddClick:() => void;
  setModalType:React.Dispatch<React.SetStateAction<"transaction" | "saving" | null>>;
}

import '../styles/payment.css'

const Payment = ({onAddClick,setModalType}:props) => {
    const handleClick = () => {
        setModalType("transaction")
        onAddClick();
    }
  return (
    <div className='payment-box'>
        <h1 style={{marginBottom:'-15px'}}>今月の支出</h1>
        <h2 style={{marginBottom:'-10px'}}>¥10,000</h2>
        <div className='container'>
            <div className='left'>
                <div className='centered'>
                <h2>項目</h2>
                <ul>
                    <li>食費：</li>
                </ul>
                </div>
            </div>
            <div className='right'>
                <div className='chart'>

                </div>
            </div>
        </div>
        <div className='button-layout'>
        <button onClick={handleClick}>支出入力</button>
        </div>
    </div>
  )
}

export default Payment