import '../styles/saving.css' 

const Saving = () => {
  return (
    <div className="saving-box">
        <h1 style={{marginBottom:'-10px'}}>今月の収支</h1>
        <h2 style={{marginBottom:'-10px'}}>¥1,000</h2>
        <h1 style={{marginBottom:'-5px'}}> 貯金一覧</h1>
        <div className='saving-category'>
        <p>人生の貯金：¥1000</p>
        <p>人生の貯金：¥1000</p>
        </div>
        <button>振り分け</button>       
    </div>
  )
}

export default Saving