/* Start component */
import { useRef } from "react";
import "../App.css"
import React from 'react';

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

export default Start