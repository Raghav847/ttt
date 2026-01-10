const Player = (name, marker) => {
    return { name, marker };
};

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, marker) => {
        if (index < 0 || index > 8) {
            console.log("invalid position");
            return false;
        }
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        console.log("Position already taken");
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const isFull = () => {
        return board.every(cell => cell !== "");
    };

    const displayBoard = () => {
        console.log("\n");
        console.log(` ${board[0] || 0} | ${board[1] || 1} | ${board[2] || 2} `);
        console.log("-----------");
        console.log(` ${board[3] || 3} | ${board[4] || 4} | ${board[5] || 5} `);
        console.log("-----------");
        console.log(` ${board[6] || 6} | ${board[7] || 7} | ${board[8] || 8} `);
        console.log("\n");
    };

    return {
        getBoard,
        setMark,
        resetBoard,
        isFull,
        displayBoard
    };
})();

const GameController = (() => {
    let playerOne = Player("Player 1", "X");
    let playerTwo = Player("Player 2", "O");
    let currentPlayer = playerOne;
    let gameOver = false;
    let winner = null;

    const winningCombinations = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];

    const checkWinner = () => {
        const board = GameBoard.getBoard();

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;

            if (board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]) {
                    return board[a];
                }
        }
        return null;
    };

    const checkTie = () => {
        return GameBoard.isFull() && !checkWinner();   
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const getCurrentPlayer = () => currentPlayer;

    const getGameOver = () => gameOver;

    const getWinner = () => winner;

    const playRound = (index) => {
        if (gameOver) {
            console.log("Game over! reset to play");
            return;
        }

        const markPlaced = GameBoard.setMark(index, currentPlayer.marker);

        if (!markPlaced) {
            return;
        }

        GameBoard.displayBoard();

        const winningMarker = checkWinner();
        if (winningMarker) {
            gameOver = true;
            winner = winningMarker === playerOne.marker ? playerOne : playerTwo;
            console.log(`${winner.name} (${winner.marker}) wins!)`);
            return;
        }
        if (checkTie()) {
            gameOver = true;
            console.log("its a tie");
            return;
        }

        switchPlayer();
        console.log(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    };

    const resetGame = () => {
        GameBoard.resetBoard();
        currentPlayer = playerOne;
        gameOver = false;
        winner = null;
        console.log("Game reset! Starting new game...");
        GameBoard.displayBoard();
        console.log(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    };

    const setPlayerNames = (name1, name2) => {
        playerOne = Player(name1, "X");
        playerTwo = Player(name2, "O");
        currentPlayer = playerOne;
    };
    
    // Initialize game
    const init = () => {
        console.log("=== TIC-TAC-TOE ===");
        GameBoard.displayBoard();
        console.log(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    };
    
    return { 
        playRound, 
        getCurrentPlayer, 
        resetGame, 
        getGameOver,
        getWinner,
        setPlayerNames,
        init
    };
})();

GameController.init();

// ===== INSTRUCTIONS =====
console.log("\n📖 HOW TO PLAY:");
console.log("1. Call GameController.playRound(position) where position is 0-8");
console.log("2. Players alternate automatically");
console.log("3. Call GameController.resetGame() to start over");
console.log("4. Call GameController.setPlayerNames('Alice', 'Bob') to set names\n");

// ===== EXAMPLE GAME =====
console.log("🎮 Try this example:");
console.log("GameController.playRound(4); // Center");
console.log("GameController.playRound(0); // Top-left");
console.log("GameController.playRound(3); // Middle-left");
console.log("And so on...\n");