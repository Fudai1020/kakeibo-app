
type Props = {
  onClose: () => void;
};

const TransactionFormModal = ({onClose}:Props) => {
  return (
    <div>TransactionFormModal
    <button onClick={onClose}></button>
    </div>
  )
}

export default TransactionFormModal