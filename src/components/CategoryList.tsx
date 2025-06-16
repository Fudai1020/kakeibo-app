import AnimateNumber from "./AnimateNumber";
import SubCategories from "./SubCategories";

type Transaction = {
  id: string;
  amount: number;
  mainCategory: string;
  subCategory: string;
  memo: string;
  createdAt: Date;
};

type Props = {
  transactions: Transaction[];
};

const CategoryList = ({ transactions }: Props) => {
    const grouped = transactions.reduce((acc,item)=>{
        if(!acc[item.mainCategory]) acc[item.mainCategory] = [];
        acc[item.mainCategory].push(item);
        return acc;
    },{} as Record<string,Transaction[]>);
  return (
    <div>
        {Object.entries(grouped).map(([mainCategory,subTransactioins])=>{
            const total = subTransactioins.reduce((sum,item)=> sum += item.amount,0);
            return(
                <div key={mainCategory} className="category-block">
                <h3><span style={{ textDecoration: 'underline' }}>
                    {mainCategory}・・・合計：
                     <AnimateNumber value={total} />円
                    </span>
                </h3>

                    <SubCategories subTransactions={subTransactioins} />    
                    </div>
            )
        })}
    </div>
  );
};

export default CategoryList;
