// Verbessertes Schachspiel mit vollständigen Bewegungsregeln und erweiterten Funktionen
const chessboard = document.getElementById("chessboard");
const coordinatesY = document.getElementById("coordinates-y");
const coordinatesX = document.getElementById("coordinates-x");
const statusDisplay = document.getElementById("status");
let selectedPiece = null;
let isWhiteTurn = true; // Weiß beginnt

// Initiales Schachbrett mit allen Figuren
const initialBoard = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

// Koordinaten hinzufügen
function addCoordinates() {
    for (let i = 8; i >= 1; i--) {
        const coord = document.createElement("div");
        coord.textContent = i;
        coordinatesY.appendChild(coord);
    }

    for (let i = 0; i < 8; i++) {
        const coord = document.createElement("div");
        coord.textContent = String.fromCharCode(65 + i);
        coordinatesX.appendChild(coord);
    }
}

// Schachbrett erstellen
function createChessboard() {
    chessboard.innerHTML = "";
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
            isWhiteTurn = !isWhiteTurn;
            updateStatus();
        }
        selectedPiece = null;
        clearSelection();
    } else if (piece && isCorrectTurn(piece)) {
        selectedPiece = { row, col, piece };
        cell.classList.add("selected");
        showValidMoves(selectedPiece);
    }
}

function isCorrectTurn(piece) {
    return (isWhiteTurn && piece === piece.toUpperCase()) || 
           (!isWhiteTurn && piece === piece.toLowerCase());
}

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

function calculateValidMoves(row, col, piece) {
    const moves = [];
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
        case "♙": // Weißer Bauer
        case "♟": // Schwarzer Bauer
            moves.push(...pawnMoves(row, col, isWhite));
            break;

        case "♖": // Turm
        case "♜":
            moves.push(...linearMoves(row, col, isWhite, [[0, 1], [1, 0], [0, -1], [-1, 0]]));
            break;

        case "♘": // Springer
        case "♞":
            moves.push(...knightMoves(row, col, isWhite));
            break;

        case "♗": // Läufer
        case "♝":
            moves.push(...linearMoves(row, col, isWhite, [[1, 1], [-1, -1], [1, -1], [-1, 1]]));
            break;

        case "♕": // Königin
        case "♛":
            moves.push(...linearMoves(row, col, isWhite, [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]));
            break;

        case "♔": // König
        case "♚":
            moves.push(...kingMoves(row, col, isWhite));
            break;
    }

    return moves;
}

function pawnMoves(row, col, isWhite) {
    const moves = [];
    const direction = isWhite ? -1 : 1;

    if (initialBoard[row + direction] && initialBoard[row + direction][col] === "") {
        moves.push({ row: row + direction, col });
        if ((isWhite && row === 6) || (!isWhite && row === 1)) {
            if (initialBoard[row + 2 * direction][col] === "") {
                moves.push({ row: row + 2 * direction, col });
            }
        }
    }

    [[-1, direction], [1, direction]].forEach(([dx, dy]) => {
        const newRow = row + dy;
        const newCol = col + dx;
        if (isInsideBoard(newRow, newCol) && initialBoard[newRow][newCol] !== "" && isOpponentPiece(initialBoard[newRow][newCol], isWhite)) {
            moves.push({ row: newRow, col: newCol });
        }
    });

    return moves;
}

function knightMoves(row, col, isWhite) {
    const moves = [];
    const directions = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, -2], [1, -2], [-1, 2], [1, 2]
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = row + dy;
        const newCol = col + dx;
        if (isInsideBoard(newRow, newCol) && (!initialBoard[newRow][newCol] || isOpponentPiece(initialBoard[newRow][newCol], isWhite))) {
            moves.push({ row: newRow, col: newCol });
        }
    });

    return moves;
}

function kingMoves(row, col, isWhite) {
    const moves = [];
    [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(([dx, dy]) => {
        const newRow = row + dy;
        const newCol = col + dx;
        if (isInsideBoard(newRow, newCol) && (!initialBoard[newRow][newCol] || isOpponentPiece(initialBoard[newRow][newCol], isWhite))) {
            moves.push({ row: newRow, col: newCol });
        }
    });
    return moves;
}

function linearMoves(row, col, isWhite, directions) {
    const moves = [];
    directions.forEach(([dx, dy]) => {
        let newRow = row + dy;
        let newCol = col + dx;
        while (isInsideBoard(newRow, newCol)) {
            if (initialBoard[newRow][newCol] === "") {
                moves.push({ row: newRow, col: newCol });
            } else if (isOpponentPiece(initialBoard[newRow][newCol], isWhite)) {
                moves.push({ row: newRow, col: newCol });
                break;
            } else {
                break;
            }
            newRow += dy;
            newCol += dx;
        }
    });
    return moves;
}

function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isOpponentPiece(piece, isWhite) {
    return (isWhite && piece !== piece.toUpperCase()) || (!isWhite && piece === piece.toUpperCase());
}

function isValidMove(from, to) {
    const validMoves = calculateValidMoves(from.row, from.col, from.piece);
    return validMoves.some(move => move.row === to.row && move.col === to.col);
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = "";
    initialBoard[toRow][toCol] = piece;
    updateChessboard();
}

function updateChessboard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.textContent = initialBoard[row][col];
    });
}

function updateStatus() {
    const whitePieces = initialBoard.flat().filter(piece => piece === piece.toUpperCase()).length;
    const blackPieces = initialBoard.flat().filter(piece => piece === piece.toLowerCase()).length;
    statusDisplay.textContent = `${isWhiteTurn ? "Zug: Weiß" : "Zug: Schwarz"} | Weiß: ${whitePieces} Stücke, Schwarz: ${blackPieces} Stücke`;
}

function clearSelection() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.remove("selected", "valid-move"));
}

addCoordinates();
createChessboard();
updateStatus();
