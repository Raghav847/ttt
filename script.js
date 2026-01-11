const Player = (name, marker) => {
    return { name, marker };
};

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, marker) => {
        if (index < 0 || index > 8) return false;
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const isFull = () => {
        return board.every(cell => cell !== "");
    };

    return {
        getBoard,
        setMark,
        resetBoard,
        isFull
    };
})();

const GameController = (() => {
    let playerOne = Player("Player 1", "X");
    let playerTwo = Player("Player 2", "O");
    let currentPlayer = playerOne;
    let gameOver = false;
    let winner = null;
    let gameStarted = false;

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

    const isGameStarted = () => gameStarted;

    const playRound = (index) => {
        if (gameOver || !gameStarted) return false; 

        const markPlaced = GameBoard.setMark(index, currentPlayer.marker);

        if (!markPlaced) return false;

        const winningMarker = checkWinner();
        if (winningMarker) {
            gameOver = true;
            winner = winningMarker === playerOne.marker ? playerOne : playerTwo;
            return true;
        }
        if (checkTie()) {
            gameOver = true;
            return true;
        }

        switchPlayer();
        return true;
    };

    const startGame = () => {
        gameStarted = true;
        resetGame();
    };

    const resetGame = () => {
        GameBoard.resetBoard();
        currentPlayer = playerOne;
        gameOver = false;
        winner = null;
    };

    const setPlayerNames = (name1, name2) => {
        playerOne = Player(name1 || "Player 1", "X");
        playerTwo = Player(name2 || "Player 2", "O");
        currentPlayer = playerOne;
    };
    
    return { 
        playRound, 
        getCurrentPlayer, 
        resetGame,
        startGame,
        getGameOver,
        getWinner,
        setPlayerNames,
        isGameStarted,
        checkTie
    };
})();

const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const gameInfo = document.getElementById("gameInfo");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");
    const winnerMessage = document.getElementById("winnerMessage");
    const container = document.querySelector(".container");

    const createBoard = () => {
        gameboardDiv.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener("click", handleCellClick);
            gameboardDiv.appendChild(cell);
        }
    };

    const renderBoard = () => {
        const board = GameBoard.getBoard();
        const cells = document.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove('x', 'o', 'taken');
            if (board[index] === 'X') {
                cell.classList.add('x', 'taken');
            } else if (board[index] === 'O') {
                cell.classList.add('o', 'taken');
            }
    });
    };

    const updateGameInfo = () => {
        if (!GameController.isGameStarted()) {
            gameInfo.textContent = "Click Start to begin!";
            return;
        }
        if (GameController.getGameOver()) {
            const winner = GameController.getWinner();
            if (winner) {
                gameInfo.textContent = `${winner.name} wins!`;
                winnerMessage.textContent = `🎉 ${winner.name} (${winner.marker}) is the winner!`;
                winnerMessage.classList.remove('tie-message');
            } else if (GameController.checkTie()) {
                gameInfo.textContent = "It's a tie!";
                winnerMessage.textContent = "😐 It's a tie! Good game!";
                winnerMessage.classList.add('tie-message');
            }
            winnerMessage.classList.add('show');
        } else {
            const currentPlayer = GameController.getCurrentPlayer();
            gameInfo.textContent = `${currentPlayer.name}'s turn (${currentPlayer.marker})`;
            winnerMessage.classList.remove('show');
        }
 };

    const handleCellClick = (e) => {
        const index = e.target.dataset.index;
        const played = GameController.playRound(index);

        if (played) {
            renderBoard();
            updateGameInfo();
        }
    };
     const handleStart = () => {
                const name1 = player1Input.value.trim();
                const name2 = player2Input.value.trim();
                
                GameController.setPlayerNames(name1, name2);
                GameController.startGame();
                
                startBtn.disabled = true;
                restartBtn.disabled = false;
                container.classList.add('game-active');
                
                renderBoard();
                updateGameInfo();
            };
            
            // Handle restart button
            const handleRestart = () => {
                GameController.resetGame();
                renderBoard();
                updateGameInfo();
            };
            
            // Initialize event listeners
            const init = () => {
                createBoard();
                startBtn.addEventListener('click', handleStart);
                restartBtn.addEventListener('click', handleRestart);
            };
            
            return { init };
})();

DisplayController.init();