//親から渡されるプロップスの型定義
type props = {
  onClose: () => void;  //何も返さない関数
  children: React.ReactNode;  //Reactで表示できるすべての要素
  isOpen:boolean;
};
import '../styles/slideinModal.css'
const SlideinModal = ({onClose,children,isOpen}:props) => {
  return (
    <div className={`slidein-overlay ${isOpen ? 'open':'close '}`} onClick={onClose}>
      <div className="slidein-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className='slide-button'>×</button>
        {children}
      </div>
    </div>
  )
}

export default SlideinModal