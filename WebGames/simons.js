document.addEventListener("DOMContentLoaded", function() {
    const colors = ["green", "red", "yellow", "blue", "orange", "purple"];
    const originalColorsToRGB = {
        "green": ["#66bb6a", "#43a047"],
        "red": ["#ef5350", "#d32f2f"],
        "yellow": ["#ffee58", "#fbc02d"],
        "blue": ["#42a5f5", "#1e88e5"],
        "purple": ["#ce93d8", "#8e24aa"],
        "orange": ["#ffb74d", "#f57c00"],
    };
    


    const gameSequence = [];
    let playerSequence = [];
    let gameRound = 1;
    let isGameOn = false;
    let maxRound = 0;
    let blacked = false;
    let blacked_counter = 0;
    const startButton = document.getElementById("start-btn");
    const gameTiles = document.querySelectorAll(".tile");
    const originalTileColors = {};

    /*sounds*/
    let gameOverSound = new Audio('Sounds/Simons/game_over.wav');
    let round_won = new Audio('Sounds/Simons/round_won_2.wav');
    




    function storeOriginalColors() {
        const gameTiles = document.querySelectorAll(".tile");
        gameTiles.forEach(tile => {
            const tileId = tile.id;
            originalTileColors[tileId] = tile.style.background;
        });
    }
    storeOriginalColors();

    

    // Start the game
    function startGame() {
        startButton.style.display = "none";
        gameSequence.length = 0;
        playerSequence.length = 0;
        gameRound = 1;
        isGameOn = true;
        updateGameInfo();
        generateSequence();
    }

    // Generate a random sequence
    function generateSequence() {
        playerSequence = [];
        for (let i = 0; i < 1; i++) {
            const randomIndex = Math.floor(Math.random() * colors.length);
            gameSequence.push(colors[randomIndex]);
        }
        playSequence();
    }

    // Play the generated sequence
    function playSequence() {
        disableInteraction(); // Disable tile interaction during sequence playback
        
        gameSequence.forEach((color, index) => {
            setTimeout(() => {
                const tile = document.getElementById(color);
                tile.classList.add("show");
                 // Add a class to visually indicate the tile is active
                setTimeout(() => {
                    tile.classList.remove("show");
                    if (index === gameSequence.length - 1) {
                        enableInteraction(); 
                    }
                }, 500); // Adjust timing as needed
            }, 1000 * index); // Adjust timing as needed
        });
    }

    // Handle player's tile click
    // Function to handle tile clicks
function handleTileClick(tileId) {
    if (!isGameOn) return;
    
    const expectedTile = gameSequence[playerSequence.length]; // Get the expected tile from the game sequence
    
    if (tileId !== expectedTile) {
        gameOverSound.play();
        gameOverSound.onended = endGame;
        return;
    }
    
    playerSequence.push(tileId);

    // Toggle class to make tile smaller briefly when clicked
    const tile = document.getElementById(tileId);
    tile.classList.add("clicked");
    setTimeout(() => {
        tile.classList.remove("clicked");
    }, 200); // Adjust timing as needed

    if (playerSequence.length === gameSequence.length) {
        setTimeout(() => {
            round_won.play();
        }, 1000);
        round_won.onended = nextRound;
    }
}


function changeTileToBlack(tileId) {
    const tile = document.getElementById(tileId);
    if (tile) {
        tile.style.background = "linear-gradient(135deg, #2C2C2C, #1A1A1A, #000000, #1A1A1A, #2C2C2C)";
    }
    blacked =true;
}
function restoreTileColor() {
    const gameTiles = document.querySelectorAll(".tile");
    blacked=false
    gameTiles.forEach(tile => {
        const tileId = tile.id;
        tile.style.background = originalTileColors[tileId];
});
}

// Start the next round
    function nextRound() {
        gameRound++;
        
        if (!blacked) {
            if (Math.floor(Math.random() * 10) + 1 <= 4 ){
                colors.forEach((color) => {
                    changeTileToBlack(color);
                });
                
                blacked_counter = gameRound + 3;
            }          
        }
        if (blacked_counter == gameRound) {
            restoreTileColor()
        }

        updateGameInfo();
        generateSequence();
    }


    // End the game
    function endGame() {
        
        isGameOn = false;
        restoreTileColor()
        disableInteraction(); // Disable tile interaction immediately
        const score = gameRound - 1;
        if (score > maxRound) {
            maxRound = score;
            alert("New Record! Your score: " + score);
        } else {
            alert("Game Over! Your score: " + score + "\nYour record is: " + maxRound);
        }
        startButton.style.display = "block";
        gameSequence.length = 0; // Clear the game sequence immediately
        playerSequence.length = 0; // Clear the player sequence immediately
    }
    

    // Update game information on the UI
    function updateGameInfo() {
        const roundElement = document.getElementById("round");
        if (roundElement) {
            roundElement.innerText = "Round: " + gameRound;
        } else {
            console.error("Element with ID 'round' not found.");
        }
    }

    // Disable tile interaction during sequence playback
    function disableInteraction() {
        gameTiles.forEach(tile => {
            tile.removeEventListener("click", tileClickHandler);
            tile.classList.add("disable-interaction");
        });
    }

    // Enable tile interaction after sequence playback
    function enableInteraction() {
        gameTiles.forEach(tile => {
            tile.addEventListener("click", tileClickHandler);
            tile.classList.remove("disable-interaction");
        });
    }

    // Event listener for Start Game button click
    startButton.addEventListener("click", startGame);

    // Event listener for tile clicks
    gameTiles.forEach(tile => {
        tile.addEventListener("click", tileClickHandler);
    });

    // Handler for tile clicks
    function tileClickHandler() {
        handleTileClick(this.id);
    }
});
