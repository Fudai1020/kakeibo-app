import { useEffect, useState } from "react"
import '../styles/animationNumber.css'
type props ={
    value:number;
}


const AnimateNumber = ({value}:props) => {
    //画面に表示する数値を管理
    const [displayValue,setDisplayValue] = useState(0);

    //valueマウント時アニメーションを開始
    useEffect(()=>{
        let start = displayValue; //アニメーション開始時の数値
        const duration = 500;   //アニメーション全体の時間
        const steptime = 15;    //1回ごとに更新される間隔
        const steps = Math.floor(duration/steptime);    //何回更新すればアニメーションが完了するか
        const increment = (value - start) /steps;   //1回の更新で増やす値

        let current = start;    //増えていく一時的な数値
        let count = 0;      //更新した回数をカウント

        //15msおきに実行される関数
        const timer = setInterval(()=>{
            current += increment;   
            count++;
            if(count>=steps){
                clearInterval(timer); //アニメーションの終了
                setDisplayValue(value); //最終値をセット
            }else{
                setDisplayValue(Math.floor(current)); //現在の数値をセット
            }
        },steptime);
        return ()=> clearInterval(timer); //クリーンアップ関数
    },[value]);
  return (
    <span className="animated-number">
        ¥{displayValue.toLocaleString()}
    </span>
  )
}

export default AnimateNumber