import React, {Component} from "react";
import "./App.css";
import Start from "./components/Start";
import Timer from "./components/Timer";
import Game from "./components/Game";
import wrong from "./sounds/wrong.wav";
import win from "./sounds/win.wav";
import fail from "./sounds/fail.wav";

/* Questions API */
const API = 'https://opentdb.com/api.php?amount=100';


class App extends Component {
    state = {
        playersName: '',
        totalQuestions: 20, // amount of questions in the quiz
        questions: [],
        currentQuestion: {},
        questionNumber: 1,
        timeRemains: 15, // Time for each question
        score: 0,
        mute: false
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
        if(!this.state.mute){
            new Audio(wrong).play();
        }
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
        if(!this.state.mute) {
            this.state.score===this.state.totalQuestions ? new Audio(win).play() : new Audio(fail).play();
        }
    }

    mute = () => {
        if (this.state.mute){
            this.setState({
                mute: false
            })
        } else {
            this.setState({
                mute: true
            })
        }
        console.log(this.state.mute)
    }

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
                                <p>You'll have {totalQuestions} questions, {timeRemains} seconds to each question. Good luck!</p>
                                <Start setPlayersName={this.setPlayersName}/>
                            </div>
                        )
                        : (
                            /* else load the Game component */
                            <div id="game-pad">
                                <div id="control-pad">
                                    {this.state.mute ? <button id="mute-btn" onClick={this.mute}>
                                            <i className="fa-solid fa-volume-xmark"></i>
                                        </button> :
                                    <button id="mute-btn" onClick={this.mute}>
                                        <i className="fa-solid fa-volume-high"></i>
                                    </button>}
                                    <button id="exit" onClick={this.startOver}>
                                        <i className="fa-solid fa-door-open"></i>
                                    </button>
                                </div>
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
                                          setScore={this.setScore} setTimeRemains={this.setTimeRemains} mute={this.state.mute} />
                                </div>
                            </div>
                        )
                    }
                </div>
            )
        } else{
            if(!this.state.mute){
                this.playSound();
            }

            return(
                <div id="game-end">
                    <h1>Game over!</h1>
                    <h2>{playersName}, you scored {score*100/totalQuestions}%</h2>
                    {score===totalQuestions ? <h2> Well done, it's a perfect score!</h2> : (score>totalQuestions/2 ? <h2>Nice, you were so close...</h2> : <h2>You can do better next time...</h2>)
                    }
                    <button onClick={this.startOver}>Try again?</button>
                </div>
            )
        }
    }
}


export default App


