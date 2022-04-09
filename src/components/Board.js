import React from "react";

function Board({ highestScores }){
    return(
        <div id="scores">
            <h3>Leader Board</h3>
            <table id="leaderBoard">
                <tr>
                    <th>Ranking</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                {highestScores.map((player, i) => (<tr><th>{i+1}</th>
                    <th>{player.name}</th>
                    <th>{player.score}%</th></tr>)
                )}
            </table>
        </div>
    )

}

export default Board;