import React, {Component} from "react"
import { useRef, useState, useEffect } from "react";
import $ from "jquery";
import "./App.css"
import Board from "./components/Board";
import useSound from "use-sound";
import correct from "./sounds/correct.wav";
import wrong from "./sounds/wrong.wav";
import win from "./sounds/win.wav";
import fail from "./sounds/fail.wav"
// import timesup from "./sounds/timesup.wav";

/* Questions API */
const API = 'https://opentdb.com/api.php?amount=100';

/* Class App - will be rendered from index.js */
class App extends Component {
    state = {
        playersName: '',
        totalQuestions: 20, // amount of questions in the quiz
        questions: [],
        currentQuestion: {},
        questionNumber: 1,
        timeRemains: 15, // Time for each question
        score: 0,
        highestScores: []
    }

    setPlayersName = (name) => {
        this.setState({
            playersName: name
        });
    }

    setScore = () => {
        this.setState({
            score: this.state.score + 1
        });
    }

    setTimeRemains = () => {
        this.setState({
            timeRemains: 15
        });
    }

    setQuestionNumber = () => {
        this.setState({
            questionNumber: this.state.questionNumber +1
        });
    }

    setTimeOut = () => {
        // A function that's being called when time's out
        new Audio(wrong).play();
        this.setQuestionNumber();
        this.getNewQuestion();
        this.setTimeRemains();
    }

    startOver = () => {
        // resets the game
        this.setState({
            questionNum: 1,
            score: 0,
            timeRemains: 20, //20 seconds to each question
            remainedQuestions: 10,
            currentQuestion: {}
        });
        window.location.reload();
    }

    componentDidMount = () => {
        // Gets the questions array and updates state
        fetch(API).then(data => data.json()).then(data => {
            this.setState({
                questions: data.results
            }, this.getNewQuestion)
        });
    }

    getNewQuestion = () => {
        // gets a random index from 0 to questions length
        const questions = this.state.questions;
        if (questions.length !== 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            this.setState({
                currentQuestion: questions[randomIndex]
            })
        }
    }

    playSound = () => {
        this.state.score===this.state.totalQuestions ? new Audio(win).play() : new Audio(fail).play();
    }

    // updateHighscores = () => {
    //     const {highestScores, score, playersName} = this.state;
    //     var minPlayerScore = {name: playersName, score: score}
    //     for(var i = 0; i < highestScores.length; i++) {
    //         if(highestScores[i] < minPlayerScore.score) {
    //             var tmpPlayerScore = highestScores[i];
    //             highestScores[i] = minPlayerScore;
    //             minPlayerScore = tmpPlayerScore
    //         }
    //     }
    //     if (highestScores.length < 3) {
    //         highestScores.push({name: minPlayerScore.name, score: minPlayerScore.score})
    //     }
    // }

    render() {
        const {questionNumber, score, totalQuestions, playersName, timeRemains} = this.state;

        if(questionNumber <= totalQuestions){
            return (
                <div id="game-container">
                    {!this.state.playersName
                        ? (
                            /* if there's no name, use the Start component */
                            <div>
                                <h1>Welcome to my quiz!</h1>
                                <p>You'll have {totalQuestions} questions, 15 seconds to each question. Good luck!</p>
                                <Start setPlayersName={this.setPlayersName}/>
                            </div>
                        )
                        : (
                            /* else load the Game component */
                            <div id="game-pad">
                                <div id="stats-section">
                                    {/* Player's name */}
                                    <div id="question-number">{questionNumber}/{totalQuestions}</div>
                                    {/* Player's score */}
                                    <div id="score">Score: {score*100/totalQuestions}%</div>
                                    <div id="timer"> Time left:
                                        {/* Time left */}
                                        <Timer
                                            setTimeOut={this.setTimeOut}
                                            questionNumber={questionNumber}
                                            timeRemains={timeRemains}
                                        />
                                    </div>
                                </div>
                                <div id="game-section">
                                    <Game questions={this.state.questions} questionNumber={questionNumber} currentQuestion={this.state.currentQuestion}
                                          setQuestionNumber={this.setQuestionNumber} getNewQuestion={this.getNewQuestion}
                                          setScore={this.setScore} setTimeRemains={this.setTimeRemains} />
                                </div>
                            </div>
                        )
                    }
                </div>
            )
        } else{
            this.playSound();
            // this.updateHighscores();

            return(
                <div id="game-end">
                    <h1>Game over!</h1>
                    <h2>{playersName}, you scored {score*100/totalQuestions}%</h2>
                    {score===10 ? <h2> Well done, it's a perfect score!</h2> : (score>5 ? <h2>Nice, you were so close...</h2> : <h2>You can do better next time...</h2>)
                    }
                    <Board highestScores={this.state.highestScores}></Board>
                    <button onClick={this.startOver}>Try again?</button>
                </div>
            )
        }
    }
}


function Game({ setQuestionNumber, currentQuestion, getNewQuestion, setScore, setTimeRemains }){
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
            playCorrect();
            setScore();

        } else{
            playWrong();
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

function Timer({ setTimeOut, questionNumber, timeRemains }){
    const [timer, setTimer] = useState(15);
    // const [playBeep, { stop }] = useSound(timesup);
    const beep = new Audio(win);

    useEffect(() => {
        if(timer === 0){
            return setTimeOut();
        }
        const interval = setInterval(() => {
            if(timer <= 6){
                $('#timer').css({color:'red'});
                if(timer === 6) {
                     beep.play();
                }
            }
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(15);
        $('#timer').css({color: 'white'});
         beep.pause();
    }, [questionNumber]);
    return timer>=10 ? `00:${timer}` : `00:0${timer}`;
}


function Start({setPlayersName}){
    // Starting point of game component - gets the player's name
    const nameRef = useRef();

    const startGame = () => {
        setPlayersName(nameRef.current.value);
    }

    return(
        <div id="start">
            <input
                id="name"
                placeholder="What's your name?"
                ref={nameRef}
            />
            <button id="go" onClick={startGame}>Go! </button>
        </div>
    )
}


export default App


