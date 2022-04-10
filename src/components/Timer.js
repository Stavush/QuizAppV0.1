/* Timer component */
import React from "react";
import { useEffect, useState } from "react";
import $ from "jquery";
import "../App.css";

function Timer({ setTimeOut, questionNumber, timeRemains }){
    const [timer, setTimer] = useState(15);

    useEffect(() => {
        if(timer === 0){
            return setTimeOut();
        }
        const interval = setInterval(() => {
            if(timer <= 6){
                $('#timer').css({color:'red'});
            }
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(15);
        $('#timer').css({color: 'white'});
    }, [questionNumber]);
    return timer>=10 ? `00:${timer}` : `00:0${timer}`;

}

export default Timer