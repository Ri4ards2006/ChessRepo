const chessboard = document.getElementById("chessboard");
const statusDisplay = document.getElementById("status");
let selectedPiece = null;
let isWhiteTurn = true;

// Initiales Schachbrett
const initialBoard = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

// Schachbrett erstellen
function createChessboard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = initialBoard[row][col];
            cell.addEventListener("click", () => handleCellClick(cell));
            chessboard.appendChild(cell);
        }
    }
}

// Zellenklick behandeln
function handleCellClick(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const piece = initialBoard[row][col];

    if (selectedPiece) {
        if (isValidMove(selectedPiece, { row, col })) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            toggleTurn();
        }
        selectedPiece = null;
        clearSelection();
    } else if (piece && isCorrectTurn(piece)) {
        selectedPiece = { row, col, piece };
        cell.classList.add("selected");
        showValidMoves(selectedPiece);
    }
}

// Zeige mögliche Züge
function showValidMoves(selectedPiece) {
    clearSelection();
    const { row, col, piece } = selectedPiece;
    const validMoves = calculateValidMoves(row, col, piece);

    validMoves.forEach(({ row, col }) => {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        if (cell) cell.classList.add("valid-move");
    });
}

// Bewegungslogik (nur Bauern als Beispiel)
function calculateValidMoves(row, col, piece) {
    const moves = [];
    if (piece === "♙") {
        // Weißer Bauer
        if (row > 0 && initialBoard[row - 1][col] === "") {
            moves.push({ row: row - 1, col });
        }
        if (row > 0 && col > 0 && initialBoard[row - 1][col - 1] !== "" && isEnemyPiece(row - 1, col - 1)) {
            moves.push({ row: row - 1, col: col - 1 });
        }
        if (row > 0 && col < 7 && initialBoard[row - 1][col + 1] !== "" && isEnemyPiece(row - 1, col + 1)) {
            moves.push({ row: row - 1, col: col + 1 });
        }
    } else if (piece === "♟") {
        // Schwarzer Bauer
        if (row < 7 && initialBoard[row + 1][col] === "") {
            moves.push({ row: row + 1, col });
        }
        if (row < 7 && col > 0 && initialBoard[row + 1][col - 1] !== "" && isEnemyPiece(row + 1, col - 1)) {
            moves.push({ row: row + 1, col: col - 1 });
        }
        if (row < 7 && col < 7 && initialBoard[row + 1][col + 1] !== "" && isEnemyPiece(row + 1, col + 1)) {
            moves.push({ row: row + 1, col: col + 1 });
        }
    }
    return moves;
}

// Überprüfe, ob ein Zug gültig ist
function isValidMove(from, to) {
    const validMoves = calculateValidMoves(from.row, from.col, from.piece);
    return validMoves.some(move => move.row === to.row && move.col === to.col);
}

// Überprüfe, ob das angeklickte Teil dem aktuellen Spieler gehört
function isCorrectTurn(piece) {
    return (isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase());
}

// Überprüfe, ob die Zielzelle eine gegnerische Figur enthält
function isEnemyPiece(row, col) {
    const piece = initialBoard[row][col];
    return (isWhiteTurn && piece === piece.toLowerCase()) || (!isWhiteTurn && piece === piece.toUpperCase());
}

// Figur bewegen
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = "";
    initialBoard[toRow][toCol] = piece;
    updateChessboard();
}

// Schachbrett aktualisieren
function updateChessboard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.textContent = initialBoard[row][col];
    });
}

// Spielerzug wechseln
function toggleTurn() {
    isWhiteTurn = !isWhiteTurn;
    statusDisplay.textContent = `Zug: ${isWhiteTurn ? "Weiß" : "Schwarz"}`;
}

// Auswahl zurücksetzen
function clearSelection() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.remove("selected", "valid-move"));
}

// Spiel starten
createChessboard();
