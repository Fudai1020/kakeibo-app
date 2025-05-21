type Props = {
  onClose: () => void;
  children: React.ReactNode;
};


export const Modal = ({onClose,children}:Props) => {
  return (
    <div>
        <button onClick={onClose}></button>
        {children}
    </div>
  )
}
