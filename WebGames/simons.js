document.addEventListener("DOMContentLoaded", function() {
    const colors = ["green", "red", "yellow", "blue"];
    const gameSequence = [];
    let playerSequence = [];
    let gameRound = 1;
    let isGameOn = false;
    let maxRound = 0
    const startButton = document.getElementById("start-btn");
    const gameTiles = document.querySelectorAll(".tile");

    // Function to start the game
    function startGame() {
        startButton.style.display = "none";
        gameSequence.length = 0;
        playerSequence.length = 0;
        gameRound = 1;
        isGameOn = true;
        updateGameInfo();
        generateSequence();
    }

    // Function to generate a random sequence
    function generateSequence() {
        playerSequence = [];
        for (let i = 0; i < gameRound; i++) {
            const randomIndex = Math.floor(Math.random() * colors.length);
            gameSequence.push(colors[randomIndex]);
        }
        playSequence();
    }
// Change color of a tile based on its ID
function changeTileColor(tileId, newColor) {
    console.log("Line 31")
    const tile = document.getElementById(tileId);
    if (tile) {
        tile.style.backgroundColor = newColor;
    } else {
        console.error("Tile with ID '" + tileId + "' not found.");
    }
}


function getTileColor(tileId) {
    const tile = document.getElementById(tileId);
    if (tile) {
        const computedStyle = window.getComputedStyle(tile);
        return computedStyle.backgroundColor;
    } else {
        console.error("Tile with ID '" + tileId + "' not found.");
        return null;
    }
}

function playSequence() {
    let index = 0;
    const intervalId = setInterval(function() {
        if (index >= gameSequence.length) {
            clearInterval(intervalId);
            return;
        }
        const tile = document.getElementById(gameSequence[index]);
        setTimeout(function() {
            tile.classList.add("active");
            setTimeout(function() {
                tile.classList.remove("active");
            }, 500); // Reduce the delay for removing the 'active' class
        }, 500 * index);
        index++;
    }, 1000);
}
    



// Function to handle player's tile click
function handleTileClick(tileId) {
    if (!isGameOn) return;
    const expectedTile = gameSequence[playerSequence.length]; // Get the expected tile from the game sequence
    if (tileId !== expectedTile) {
        endGame();
        return;
    }
    playerSequence.push(tileId);
    if (playerSequence.length === gameSequence.length) {
        setTimeout(function() {
            nextRound();
        }, 1000);
    }
}

    // Function to start the next round
    function nextRound() {
        gameRound++;
        updateGameInfo();
        generateSequence();
    }

    // Function to end the game
    function endGame() {
        isGameOn = false;
        if( gameRound - 1 > maxRound){
            alert("New Record! Your score: " + (gameRound - 1));
            maxRound=gameRound - 1
        }
        else{
            alert("Game Over! Your score: " + (gameRound - 1) +"\n your record is:"+maxRound);
        }
        
        startButton.style.display = "block"
    }

    // Function to update game information
    function updateGameInfo() {
        const roundElement = document.getElementById("round");
        if (roundElement) {
            roundElement.innerText = "Round: " + gameRound;
        } else {
            console.error("Element with ID 'round' not found.");
        }
    }

    // Event listener for Start Game button click
    startButton.addEventListener("click", function() {
        startGame();
    });

    // Event listeners for tile clicks
    gameTiles.forEach(function(tile) {
        tile.addEventListener("click", function() {
            handleTileClick(tile.id);
        });
    });
});
