/* Game component */
import "../App.css";
import React from 'react';
import { useEffect, useState } from "react";
import useSound from "use-sound";
import correct from "../sounds/correct.wav";
import wrong from "../sounds/wrong.wav";

function Game({ setQuestionNumber, currentQuestion, getNewQuestion, setScore, setTimeRemains, mute }){
    const [answers, getAnswers] = useState([]);
    const [playCorrect] = useSound(correct);
    const [playWrong] = useSound(wrong);

    function correctAnswer(ans){
        return ans === decodeHtml(currentQuestion['correct_answer']);
    }

    function shuffleArray(arr) {
        // helper function that shuffles a given array
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    useEffect( () => {
        // gathers the answers to 1 array named answers
        const allAnswers = shuffleArray([...currentQuestion['incorrect_answers'], currentQuestion['correct_answer']])
        getAnswers(allAnswers) }, [currentQuestion]);

    function handleClick (e) {
        const answer = decodeHtml(e);
        if(correctAnswer(answer)){
            if(!mute){
                playCorrect();
            }
            setScore();
        } else{
            if(!mute){
                playWrong();
            }
        }
        setQuestionNumber();
        getNewQuestion();
        setTimeRemains();
    }

    function decodeHtml(html){
        //A function that decodes the questions array
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    return(
        <div id="game-pad">
            <h3 id="questionLabel">{decodeHtml(currentQuestion.question)}</h3>
            <div id="answers">
                {/* change answers from array to set*/}
                {answers.map(answer =>
                    (<button id={answer} onClick={(event) => handleClick(answer)}>
                        {decodeHtml(answer)}
                    </button>)
                )}
            </div>
        </div>
    )
}

export default Game