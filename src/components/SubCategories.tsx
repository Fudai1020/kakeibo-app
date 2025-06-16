type SubCategoryProps = {
  subTransactions: {
    id: string;
    amount: number;
    subCategory: string;
    memo: string;
    createdAt: Date;
  }[];
};
import '../styles/caegory.css'

const SubCategory = ({ subTransactions }: SubCategoryProps) => {
  return (
    <ul>
      {subTransactions.map((item) => (
        <li key={item.id} className="sub-category-item">
            <span>{item.subCategory}・・・{item.amount}円</span>
            <span className="memo-text">{item.memo? item.memo:'メモなし'}</span>

        </li>
      ))}
    </ul>
  );
};

export default SubCategory;
