import '../styles/modal.css'

type Props = {
  onClose: () => void; //何も返さない関数として定義
  children: React.ReactNode; //親コンポーネントで書かれた要素全てを受けとる宣言
};


export const Modal = ({onClose,children}:Props) => {
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e)=> e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
