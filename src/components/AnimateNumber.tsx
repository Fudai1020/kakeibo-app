import { useEffect, useState } from "react"
import '../styles/animationNumber.css'
type props ={
    value:number;
}


const AnimateNumber = ({value}:props) => {
    const [displayValue,setDisplayValue] = useState(0);

    useEffect(()=>{
        let start = displayValue;
        const duration = 500;
        const steptime = 15;
        const steps = Math.floor(duration/steptime);
        const increment = (value - start) /steps;

        let current = 0;
        let count = 0;

        const timer = setInterval(()=>{
            current += increment;
            count++;
            if(count>=steps){
                clearInterval(timer);
                setDisplayValue(value);
            }else{
                setDisplayValue(Math.floor(current))
            }
        },steptime);
        return ()=> clearInterval(timer);
    },[value]);
  return (
    <span className="animated-number">
        ¥{displayValue.toLocaleString()}
    </span>
  )
}

export default AnimateNumber