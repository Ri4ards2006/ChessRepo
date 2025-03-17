const chessboard = document.getElementById("chessboard");
const coordinatesY = document.getElementById("coordinates-y");
const coordinatesX = document.getElementById("coordinates-x");
const statusDisplay = document.getElementById("status");
const movesDisplay = document.getElementById("moves");  // Box für Züge oben
const movesBox = document.getElementById("moves-box");  // Box für Züge unten
let selectedPiece = null;
let isWhiteTurn = true; // Weiß beginnt
let moveHistory = [];  // Historie der Züge

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

// Koordinaten hinzufügen
function addCoordinates() {
    // Vertikale Koordinaten (1–8)
    for (let i = 8; i >= 1; i--) {
        const coord = document.createElement("div");
        coord.textContent = i;
        coordinatesY.appendChild(coord);
    }

    // Horizontale Koordinaten (A–H)
    for (let i = 0; i < 8; i++) {
        const coord = document.createElement("div");
        coord.textContent = String.fromCharCode(65 + i); // A bis H
        coordinatesX.appendChild(coord);
    }
}

// Züge auf der Seite anzeigen
function updateMovesDisplay() {
    movesDisplay.innerHTML = moveHistory.map(move => `${move}`).join("<br>");
}

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
        // Versuche, die ausgewählte Figur zu bewegen
        if (isValidMove(selectedPiece, { row, col })) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            isWhiteTurn = !isWhiteTurn; // Wechsel zwischen den Spielern
            updateStatus();
        }
        selectedPiece = null;
        clearSelection();
    } else if (piece && isCorrectTurn(piece)) {
        // Wähle die Figur aus
        selectedPiece = { row, col, piece };
        cell.classList.add("selected");
        showValidMoves(selectedPiece);
    }
}

// Überprüfen, ob die Figur zum aktuellen Spieler gehört
function isCorrectTurn(piece) {
    return (isWhiteTurn && piece === piece.toUpperCase()) || 
           (!isWhiteTurn && piece === piece.toLowerCase());
}

// Zeige mögliche Züge
function showValidMoves(selectedPiece) {
    clearSelection();
    const { row, col, piece } = selectedPiece;
    const validMoves = calculateValidMoves(row, col, piece);

    validMoves.forEach(({ row, col }) => {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        if (cell) {
            cell.classList.add("valid-move");
        }
    });
}

// Berechne mögliche Züge (vereinfachte Logik für den Bauern)
function calculateValidMoves(row, col, piece) {
    const moves = [];
    if (piece === "♙") {
        if (row > 0 && initialBoard[row - 1][col] === "") {
            moves.push({ row: row - 1, col });
        }
    } else if (piece === "♟") {
        if (row < 7 && initialBoard[row + 1][col] === "") {
            moves.push({ row: row + 1, col });
        }
    }
    return moves;
}

// Überprüfe, ob ein Zug gültig ist
function isValidMove(from, to) {
    const validMoves = calculateValidMoves(from.row, from.col, from.piece);
    return validMoves.some(move => move.row === to.row && move.col === to.col);
}

// Bewege die Figur
function movePiece(fromRow, fromCol, toRow, toCol) {
    initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = "";

    // Züge protokollieren
    const move = `${String.fromCharCode(65 + fromCol)}${8 - fromRow} → ${String.fromCharCode(65 + toCol)}${8 - toRow}`;
    moveHistory.push(move);
    updateMovesDisplay();
}

// Auswahl aufheben
function clearSelection() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.remove("selected", "valid-move"));
}

// Status aktualisieren
function updateStatus() {
    statusDisplay.textContent = `Zug: ${isWhiteTurn ? "Weiß" : "Schwarz"}`;
}

// Initialisierung
addCoordinates();
createChessboard();
updateStatus();
