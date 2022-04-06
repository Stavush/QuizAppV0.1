import React, {Component} from "react"
import {Game} from "./components/Game";
import {Start} from "./components/Start";
import {Timer} from "./components/Timer";
import "./App.css"

/* Questions API */
const API = 'https://opentdb.com/api.php?amount=100';

/* Class App - will be renderd from index.js */
class App extends React.Component {
    state = {
        playersName: '',
        questions: [],
        currentQuestion: {},
        questionIndex: undefined,
        score: 0,
        timeOut: false
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

    startOver = () => {
        // resets the game
        this.setState({
            questionNum: 0,
            score: 0,
            timeRemains: 20, //20 seconds to each question
            remainedQuestions: 10,
            isFinished: false
        })
    }

    componentDidMount = () => {
        // gets questions array and updates state
        fetch(API).then(data => data.json()).then(data => {
            this.setState({
                questions: data.results
            }, this.getNewQuestion)
        });
    }

    getNewQuestion = () => {
        // gets a random index from 0 to questions length
        const questions = this.state.questions;
        if (questions.length != 0) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            this.setState({
                questionNum: this.questionNum + 1,
                currentQuestion: questions[randomIndex]
            })
        }
    }

    setTimeOut = () => {
        // A function that's being called when time's out
        this.setState({
            timeOut: true
        })
    }

    updateScore = () => {
        this.setState({
            score: score + 1
        })
    }

    render() {

        return (
            <div id="game-container">
                {!this.state.playersName
                    ? (
                        /* if there's no name, use the Start component */
                        <div>
                            <h1>Welcome to my quiz!</h1>
                            <p>You'll have 10 questions, 20 seconds to each question. Good luck!</p>
                            <Start setPlayersName={this.setPlayersName}/>
                        </div>
                    )
                    : (
                        /* else load the Game component */
                        <div>
                            <div id="stats-section">
                                {/* Player's name */}
                                <div id="name">{this.state.playersName}</div>
                                {/* Player's score */}
                                <div id="score">Score: {this.state.score}</div>
                                <div id="timer"> Time left:
                                    {/* Time left */}
                                    <Timer
                                        setTimeOut={this.setTimeOut}
                                        question={this.getNewQuestion}
                                    />
                                </div>
                            </div>
                            <div id="game-section">
                                <Game questions={this.state.questions} currentQuestion={this.state.currentQuestion}
                                      setTimeOut={this.setTimeOut} getNewQuestion={this.getNewQuestion}
                                      setScore={this.setScore}/>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default App


