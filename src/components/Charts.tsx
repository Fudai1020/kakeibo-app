import { ResponsiveContainer, Pie, Cell, Tooltip, Legend,PieChart} from "recharts";
//支出の金額のデータをプロップスとして受け取る
type props={
    paymentData:{category:string;amount:number}[]
}
//色を用意８種類を循環使用
const COLORS = [
  '#e0ffff', '#48d1cc', '#ffc658', '#ff7f50',
  '#a4de6c', '#d0ed57', '#8dd1e1', '#ffbb28',
];

const Charts = ({paymentData}:props) => {
    console.log(paymentData)
   return (
    <div style={{ width: '100%', height: 300 }}>
      {/*親コンテナに合わせてグラフのサイズを調整する*/}
      <ResponsiveContainer>
        {/*グラフ本体の入れ物*/}
        <PieChart>
          {/* 円グラフの本体設定。金額を半径に応じて表示 */}
          <Pie 
            data={paymentData}
            dataKey="amount"  //グラフの大きさに使う値
            nameKey="category"  //グラフの名前に使う値
            cx="50%"          //円の中心位置
            cy="50%"
            outerRadius={100}   //半径の大きさ
            fill="#8884d8"      //グラフのデフォルト色
            label               //各項目をリスト表示
          >
            {paymentData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> //グラフの各項目のスタイルを設定
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