/* Timer component */
import App from "../App";

function Timer({ setTimeOut, questionRemained }){
    const [timer, setTimer] = useState(20);

    useEffect(() => {
        if(timer === 0){
            return setTimeOut(true);
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(20);
    }, [questionRemained]);
    return timer;
}

export default Timer