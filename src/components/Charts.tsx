import { ResponsiveContainer, Pie, Cell, Tooltip, Legend,PieChart} from "recharts";

type props={
    paymentData:{category:string;amount:number}[]
}
const COLORS = [
  '#e0ffff', '#48d1cc', '#ffc658', '#ff7f50',
  '#a4de6c', '#d0ed57', '#8dd1e1', '#ffbb28',
];

const Charts = ({paymentData}:props) => {
    console.log(paymentData)
   return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={paymentData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {paymentData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts