import '../styles/modal.css'

type Props = {
  onClose: () => void;
  children: React.ReactNode;
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
