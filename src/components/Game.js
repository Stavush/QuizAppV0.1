
/* Game component */
import App from "../App";

function Game({ questions, currentQuestion, questionIndex, setTimeOut, getNewQuestion, setScore }){
    const [answers, getAnswers] = useState([]);
    const [timeRemains, setTimeRemains] = useState(20);
    const [questionsReemained, setQuestionsRemained] = useState(10);

    function correctAnswer(ans){
        return ans === decodeHtml(currentQuestion['correct_answer']);
    }

    useEffect( () => {
        // gathers the answers to 1 array named answers
        getAnswers([...currentQuestion['incorrect_answers'], currentQuestion['correct_answer']]) }, [currentQuestion]);

    function handleClick (e) {
        const answer = e;
        console.log("e: ", e)
        console.log("answer: " + answer + '\n' +
            "curQ-correctAns: " + currentQuestion['correct_answer'] + '\n' +
            "check: " + correctAnswer(answer));
        correctAnswer(answer) ? console.log("success") : console.log("fail");

    }

    function decodeHtml(html) {
        //A function that decodes the question's array
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    console.log("answers:", answers)

    return(
        <div id="game-pad">
            <h3 id="questionLabel">{decodeHtml(currentQuestion.question)}</h3>
            <div id="answers">
                {/* change answers from array to set*/}
                {answers.map(answer =>
                    (<button onClick={(event) => handleClick(answer)}>
                        {decodeHtml(answer)}
                    </button>)
                )}
            </div>
        </div>
    )
}
export default Game