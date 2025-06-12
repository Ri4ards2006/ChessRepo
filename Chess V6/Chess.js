// ===================================================================
// SCHACHSPIEL MIT VOLLSTÄNDIGEN KOMMENTAREN
// ===================================================================

// === DOM-ELEMENT REFERENZEN ===
// getElementById() sucht HTML-Elemente anhand ihrer ID und gibt eine Referenz zurück
// const = Konstante Variable, die nicht neu zugewiesen werden kann
const chessboard = document.getElementById("chessboard");     // Referenz zum Schachbrett-Container
const coordinatesY = document.getElementById("coordinates-y"); // Referenz zu den Y-Achsen Koordinaten (1-8)
const coordinatesX = document.getElementById("coordinates-x"); // Referenz zu den X-Achsen Koordinaten (A-H)
const statusDisplay = document.getElementById("status");       // Referenz zur Statusanzeige

// === GLOBALE SPIELVARIABLEN ===
// let = Variable, die verändert werden kann (im Gegensatz zu const)
let selectedPiece = null;    // Speichert die aktuell ausgewählte Figur (null = keine Auswahl)
let isWhiteTurn = true;      // Boolean: true = Weiß ist dran, false = Schwarz ist dran
let moveHistory = [];        // Array: Speichert alle bisherigen Züge für Undo-Funktion
let gameBoard = [];          // 2D-Array: Repräsentiert das aktuelle Spielbrett

// === INITIALES SCHACHBRETT SETUP ===
// Zweidimensionales Array [Zeile][Spalte] - Zeile 0 = oben, Zeile 7 = unten
// Unicode-Zeichen für Schachfiguren:
// Schwarz: ♜=Turm, ♞=Springer, ♝=Läufer, ♛=Dame, ♚=König, ♟=Bauer
// Weiß: ♖=Turm, ♘=Springer, ♗=Läufer, ♕=Dame, ♔=König, ♙=Bauer
// "" = leeres Feld
const initialBoard = [
    // Zeile 0 (Rang 8): Schwarze Grundfiguren
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    // Zeile 1 (Rang 7): Schwarze Bauern
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    // Zeilen 2-5 (Ränge 6-3): Leere Felder
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    // Zeile 6 (Rang 2): Weiße Bauern
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    // Zeile 7 (Rang 1): Weiße Grundfiguren
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

// ===================================================================
// HAUPTFUNKTIONEN
// ===================================================================

/**
 * Initialisiert das Spiel und setzt alle Werte zurück
 * Funktion ohne Parameter und ohne Rückgabewert
 */
function initializeGame() {
    // map() erstellt ein neues Array basierend auf dem originalen
    // [...row] = Spread-Operator: Erstellt eine Kopie des Arrays
    // Dadurch wird eine tiefe Kopie des 2D-Arrays erstellt
    gameBoard = initialBoard.map(row => [...row]);
    
    // Spielzustand zurücksetzen
    isWhiteTurn = true;           // Weiß beginnt immer
    selectedPiece = null;         // Keine Figur ausgewählt
    moveHistory = [];             // Leere Zughistorie
    
    // UI-Funktionen aufrufen
    addCoordinates();             // Koordinaten A-H und 1-8 hinzufügen
    createChessboard();           // Schachbrett visuell erstellen
    updateStatus();               // Statuszeile aktualisieren
}

/**
 * Erstellt die Koordinaten-Beschriftung (A-H und 1-8)
 */
function addCoordinates() {
    // innerHTML = "" leert den Inhalt des Elements
    coordinatesY.innerHTML = "";
    coordinatesX.innerHTML = "";
    
    // Y-Koordinaten (Zahlen 8 bis 1, von oben nach unten)
    // for-Schleife: for(Startwert; Bedingung; Inkrement/Dekrement)
    for (let i = 8; i >= 1; i--) {  // i-- bedeutet i = i - 1
        // createElement() erstellt ein neues HTML-Element
        const coord = document.createElement("div");
        // textContent setzt den Textinhalt des Elements
        coord.textContent = i;
        // appendChild() fügt das Element als Kind hinzu
        coordinatesY.appendChild(coord);
    }

    // X-Koordinaten (Buchstaben A bis H)
    for (let i = 0; i < 8; i++) {   // i < 8 bedeutet: solange i kleiner als 8 ist
        const coord = document.createElement("div");
        // String.fromCharCode() konvertiert ASCII-Code zu Buchstaben
        // 65 = 'A', 66 = 'B', usw. | + = Addition
        coord.textContent = String.fromCharCode(65 + i);
        coordinatesX.appendChild(coord);
    }
}

/**
 * Erstellt das visuelle Schachbrett mit allen Feldern
 */
function createChessboard() {
    // Schachbrett leeren
    chessboard.innerHTML = "";
    
    // Doppelte Schleife für 8x8 Felder
    // Äußere Schleife: Zeilen (rows)
    for (let row = 0; row < 8; row++) {
        // Innere Schleife: Spalten (columns)
        for (let col = 0; col < 8; col++) {
            // Neues div-Element für ein Schachfeld erstellen
            const cell = document.createElement("div");
            
            // CSS-Klassen hinzufügen
            // classList.add() fügt CSS-Klassen hinzu
            cell.classList.add("cell");
            
            // Schachbrettmuster: Wechselnde Farben
            // (row + col) % 2 === 0 : Modulo-Operator % gibt Rest der Division zurück
            // Wenn Rest = 0, dann weißes Feld, sonst schwarzes Feld
            // === = Strenger Vergleich (Wert UND Typ müssen gleich sein)
            // ? : = Ternärer Operator (Kurzform von if-else)
            cell.classList.add((row + col) % 2 === 0 ? "white" : "black");
            
            // Data-Attribute für Position speichern
            // dataset = Zugriff auf data-* Attribute
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Schachfigur auf dem Feld anzeigen
            // gameBoard[row][col] = Zugriff auf 2D-Array
            cell.textContent = gameBoard[row][col];
            
            // Event-Listener für Klicks hinzufügen
            // addEventListener() registriert eine Funktion für ein Event
            // Arrow-Function: () => ist Kurzform für function()
            cell.addEventListener("click", () => handleCellClick(cell));
            
            // Feld zum Schachbrett hinzufügen
            chessboard.appendChild(cell);
        }
    }
}

/**
 * Behandelt Klicks auf Schachfelder
 * @param {HTMLElement} cell - Das geklickte HTML-Element
 */
function handleCellClick(cell) {
    // parseInt() konvertiert String zu Integer (Ganzzahl)
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    // Figur auf dem geklickten Feld
    const piece = gameBoard[row][col];

    // Verzweigung: Ist bereits eine Figur ausgewählt?
    if (selectedPiece) {
        // === ZUGVERSUCH ===
        // Prüfen ob der Zug gültig ist
        if (isValidMove(selectedPiece, { row, col })) {
            // Zug ausführen
            makeMove(selectedPiece.row, selectedPiece.col, row, col);
            // Spieler wechseln: ! = Negation (Umkehrung)
            isWhiteTurn = !isWhiteTurn;
            // Status aktualisieren
            updateStatus();
        }
        // Auswahl zurücksetzen
        clearSelection();
        selectedPiece = null;
    } 
    // && = Logisches UND - beide Bedingungen müssen wahr sein
    else if (piece && isCorrectTurn(piece)) {
        // === FIGURAUSWAHL ===
        // Neue Figur auswählen
        // Object-Literal: { key: value, key2: value2 }
        selectedPiece = { row, col, piece };
        // CSS-Klasse für visuelle Hervorhebung
        cell.classList.add("selected");
        // Gültige Züge anzeigen
        showValidMoves(selectedPiece);
    }
}

/**
 * Prüft ob die Figur zum aktuellen Spieler gehört
 * @param {string} piece - Die Schachfigur (Unicode-Zeichen)
 * @returns {boolean} - true wenn der Spieler an der Reihe ist
 */
function isCorrectTurn(piece) {
    // String mit allen weißen Figuren
    const whitePieces = "♔♕♖♗♘♙";
    // String mit allen schwarzen Figuren
    const blackPieces = "♚♛♜♝♞♟";
    
    // includes() prüft ob ein String ein Zeichen enthält
    // || = Logisches ODER - eine der Bedingungen muss wahr sein
    // Rückgabe: true wenn Spieler an der Reihe ist
    return (isWhiteTurn && whitePieces.includes(piece)) || 
           (!isWhiteTurn && blackPieces.includes(piece));
}

/**
 * Zeigt alle gültigen Züge für die ausgewählte Figur an
 * @param {Object} selectedPiece - Object mit row, col, piece
 */
function showValidMoves(selectedPiece) {
    // Vorherige Hervorhebungen entfernen
    clearSelection();
    
    // Destructuring: Extrahiert Werte aus Object
    const { row, col, piece } = selectedPiece;
    
    // Alle gültigen Züge berechnen
    const validMoves = calculateValidMoves(row, col, piece);

    // Ausgewählte Figur hervorheben
    // Template-String: `text ${variable} text`
    // querySelector() findet das erste Element mit diesem CSS-Selektor
    const selectedCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    selectedCell.classList.add("selected");

    // Alle gültigen Züge hervorheben
    // forEach() führt Funktion für jedes Array-Element aus
    validMoves.forEach(({ row: moveRow, col: moveCol, isCapture }) => {
        // Destructuring mit Umbenennung: row wird zu moveRow
        const cell = document.querySelector(`.cell[data-row='${moveRow}'][data-col='${moveCol}']`);
        
        if (cell) {  // Prüfung ob Element existiert
            if (isCapture) {
                // Rote Hervorhebung für Angriffszüge
                cell.classList.add("capture");
            } else {
                // Grüne Hervorhebung für normale Züge
                cell.classList.add("valid-move");
            }
        }
    });
}

/**
 * Berechnet alle gültigen Züge für eine Figur
 * @param {number} row - Zeile der Figur
 * @param {number} col - Spalte der Figur  
 * @param {string} piece - Die Schachfigur
 * @returns {Array} - Array mit gültigen Zügen
 */
function calculateValidMoves(row, col, piece) {
    // Leeres Array für die Züge
    const moves = [];
    const whitePieces = "♔♕♖♗♘♙";
    // Prüfen ob es eine weiße Figur ist
    const isWhite = whitePieces.includes(piece);

    // Switch-Statement: Verzweigung basierend auf dem Wert
    switch (piece) {
        case "♙": // Weißer Bauer
        case "♟": // Schwarzer Bauer
            // Spread-Operator: Fügt alle Elemente eines Arrays hinzu
            moves.push(...getPawnMoves(row, col, isWhite));
            break; // Beendet den switch-case
        case "♖": // Weißer Turm
        case "♜": // Schwarzer Turm
            moves.push(...getRookMoves(row, col, isWhite));
            break;
        case "♘": // Weißer Springer
        case "♞": // Schwarzer Springer
            moves.push(...getKnightMoves(row, col, isWhite));
            break;
        case "♗": // Weißer Läufer
        case "♝": // Schwarzer Läufer
            moves.push(...getBishopMoves(row, col, isWhite));
            break;
        case "♕": // Weiße Dame
        case "♛": // Schwarze Dame
            moves.push(...getQueenMoves(row, col, isWhite));
            break;
        case "♔": // Weißer König
        case "♚": // Schwarzer König
            moves.push(...getKingMoves(row, col, isWhite));
            break;
    }

    return moves; // Array mit allen gültigen Zügen zurückgeben
}

// ===================================================================
// FIGURSPEZIFISCHE ZUGBERECHNUNGEN
// ===================================================================

/**
 * Berechnet Bauernzüge
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - true für weiße Bauern
 * @returns {Array} - Array mit möglichen Zügen
 */
function getPawnMoves(row, col, isWhite) {
    const moves = [];
    // Bewegungsrichtung: Weiß nach oben (-1), Schwarz nach unten (+1)
    const direction = isWhite ? -1 : 1;
    // Startzeile für Doppelzug
    const startRow = isWhite ? 6 : 1;

    // === VORWÄRTS BEWEGEN ===
    // && = Logisches UND - beide Bedingungen müssen erfüllt sein
    if (isValidPosition(row + direction, col) && gameBoard[row + direction][col] === "") {
        // Normaler Zug nach vorne
        moves.push({ row: row + direction, col, isCapture: false });
        
        // Doppelzug vom Startplatz
        if (row === startRow && gameBoard[row + 2 * direction][col] === "") {
            moves.push({ row: row + 2 * direction, col, isCapture: false });
        }
    }

    // === DIAGONAL SCHLAGEN ===
    // Array mit Offset-Werten für links (-1) und rechts (+1)
    [-1, 1].forEach(offset => {
        const newRow = row + direction;
        const newCol = col + offset;
        
        // Prüfen: Gültige Position UND Gegnerische Figur vorhanden
        if (isValidPosition(newRow, newCol) && 
            gameBoard[newRow][newCol] !== "" && 
            isOpponentPiece(gameBoard[newRow][newCol], isWhite)) {
            moves.push({ row: newRow, col: newCol, isCapture: true });
        }
    });

    return moves;
}

/**
 * Berechnet Turmzüge (horizontal und vertikal)
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - Farbe der Figur
 * @returns {Array} - Array mit möglichen Zügen
 */
function getRookMoves(row, col, isWhite) {
    // Richtungsvektoren: [Zeile, Spalte]
    // [0,1] = rechts, [0,-1] = links, [1,0] = unten, [-1,0] = oben
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return getLinearMoves(row, col, isWhite, directions);
}

/**
 * Berechnet Läuferzüge (diagonal)
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - Farbe der Figur
 * @returns {Array} - Array mit möglichen Zügen
 */
function getBishopMoves(row, col, isWhite) {
    // Diagonale Richtungsvektoren
    // [1,1] = rechts-unten, [1,-1] = links-unten, [-1,1] = rechts-oben, [-1,-1] = links-oben
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    return getLinearMoves(row, col, isWhite, directions);
}

/**
 * Berechnet Damenzüge (Turm + Läufer)
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - Farbe der Figur
 * @returns {Array} - Array mit möglichen Zügen
 */
function getQueenMoves(row, col, isWhite) {
    // Alle 8 Richtungen: horizontal, vertikal und diagonal
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    return getLinearMoves(row, col, isWhite, directions);
}

/**
 * Berechnet lineare Züge (für Turm, Läufer, Dame)
 * @param {number} row - Startzeile
 * @param {number} col - Startspalte
 * @param {boolean} isWhite - Farbe der Figur
 * @param {Array} directions - Array mit Richtungsvektoren
 * @returns {Array} - Array mit möglichen Zügen
 */
function getLinearMoves(row, col, isWhite, directions) {
    const moves = [];
    
    // Für jede Richtung
    directions.forEach(([dx, dy]) => {
        // Destructuring: [dx, dy] extrahiert die beiden Werte
        let newRow = row + dx;
        let newCol = col + dy;
        
        // Solange Position gültig ist
        while (isValidPosition(newRow, newCol)) {
            if (gameBoard[newRow][newCol] === "") {
                // Leeres Feld: Zug möglich, weitermachen
                moves.push({ row: newRow, col: newCol, isCapture: false });
            } else if (isOpponentPiece(gameBoard[newRow][newCol], isWhite)) {
                // Gegnerische Figur: Schlagen möglich, dann stoppen
                moves.push({ row: newRow, col: newCol, isCapture: true });
                break; // Schleife beenden
            } else {
                // Eigene Figur: Stoppen
                break;
            }
            // Zur nächsten Position in dieser Richtung
            newRow += dx;
            newCol += dy;
        }
    });
    
    return moves;
}

/**
 * Berechnet Springerzüge (L-förmig)
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - Farbe der Figur
 * @returns {Array} - Array mit möglichen Zügen
 */
function getKnightMoves(row, col, isWhite) {
    const moves = [];
    // Alle 8 möglichen Springer-Züge (L-Form: 2+1 oder 1+2)
    const knightMoves = [
        [-2, -1], [-2, 1],   // 2 nach oben, 1 links/rechts
        [-1, -2], [-1, 2],   // 1 nach oben, 2 links/rechts
        [1, -2],  [1, 2],    // 1 nach unten, 2 links/rechts
        [2, -1],  [2, 1]     // 2 nach unten, 1 links/rechts
    ];

    knightMoves.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        
        if (isValidPosition(newRow, newCol)) {
            if (gameBoard[newRow][newCol] === "") {
                // Leeres Feld
                moves.push({ row: newRow, col: newCol, isCapture: false });
            } else if (isOpponentPiece(gameBoard[newRow][newCol], isWhite)) {
                // Gegnerische Figur
                moves.push({ row: newRow, col: newCol, isCapture: true });
            }
            // Eigene Figur: Kein Zug möglich (implizit durch fehlende else-Klausel)
        }
    });

    return moves;
}

/**
 * Berechnet Königszüge (ein Feld in alle Richtungen)
 * @param {number} row - Aktuelle Zeile
 * @param {number} col - Aktuelle Spalte
 * @param {boolean} isWhite - Farbe der Figur
 * @returns {Array} - Array mit möglichen Zügen
 */
function getKingMoves(row, col, isWhite) {
    const moves = [];
    // Alle 8 angrenzenden Felder
    const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],  // Obere Reihe
        [0, -1],           [0, 1],   // Mittlere Reihe (links und rechts)
        [1, -1],  [1, 0],  [1, 1]    // Untere Reihe
    ];

    kingMoves.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        
        if (isValidPosition(newRow, newCol)) {
            if (gameBoard[newRow][newCol] === "") {
                moves.push({ row: newRow, col: newCol, isCapture: false });
            } else if (isOpponentPiece(gameBoard[newRow][newCol], isWhite)) {
                moves.push({ row: newRow, col: newCol, isCapture: true });
            }
        }
    });

    return moves;
}

// ===================================================================
// HILFSFUNKTIONEN
// ===================================================================

/**
 * Prüft ob eine Position auf dem Schachbrett gültig ist
 * @param {number} row - Zeile (0-7)
 * @param {number} col - Spalte (0-7)
 * @returns {boolean} - true wenn Position gültig ist
 */
function isValidPosition(row, col) {
    // >= = größer oder gleich, < = kleiner als
    // && = alle Bedingungen müssen erfüllt sein
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Prüft ob eine Figur dem Gegner gehört
 * @param {string} piece - Die zu prüfende Figur
 * @param {boolean} isWhite - true wenn der aktuelle Spieler weiß ist
 * @returns {boolean} - true wenn es eine gegnerische Figur ist
 */
function isOpponentPiece(piece, isWhite) {
    const whitePieces = "♔♕♖♗♘♙";
    const blackPieces = "♚♛♜♝♞♟";
    
    // Ternärer Operator: Bedingung ? Wert_wenn_wahr : Wert_wenn_falsch
    return isWhite ? blackPieces.includes(piece) : whitePieces.includes(piece);
}

/**
 * Prüft ob ein Zug gültig ist
 * @param {Object} from - Startposition {row, col, piece}
 * @param {Object} to - Zielposition {row, col}
 * @returns {boolean} - true wenn Zug gültig ist
 */
function isValidMove(from, to) {
    const validMoves = calculateValidMoves(from.row, from.col, from.piece);
    // some() prüft ob mindestens ein Element die Bedingung erfüllt
    return validMoves.some(move => move.row === to.row && move.col === to.col);
}

// ===================================================================
// SPIELMECHANIK
// ===================================================================

/**
 * Führt einen Zug aus
 * @param {number} fromRow - Startzeile
 * @param {number} fromCol - Startspalte
 * @param {number} toRow - Zielzeile
 * @param {number} toCol - Zielspalte
 */
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = gameBoard[fromRow][fromCol];           // Bewegte Figur
    const capturedPiece = gameBoard[toRow][toCol];       // Geschlagene Figur (oder "")
    
    // Zug in Historie für Undo-Funktion speichern
    moveHistory.push({
        from: { row: fromRow, col: fromCol },    // Startposition
        to: { row: toRow, col: toCol },          // Zielposition
        piece: piece,                            // Bewegte Figur
        capturedPiece: capturedPiece             // Geschlagene Figur
    });
    
    // Zug auf dem Spielbrett ausführen
    gameBoard[fromRow][fromCol] = "";            // Startfeld leeren
    gameBoard[toRow][toCol] = piece;             // Figur auf Zielfeld setzen
    
    // Visuelles Schachbrett aktualisieren
    updateChessboard();
}

/**
 * Aktualisiert die visuelle Darstellung des Schachbretts
 */
function updateChessboard() {
    // Alle Schachfelder auswählen
    const cells = document.querySelectorAll(".cell");
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        // Figur aus dem Datenmodell in die Anzeige übertragen
        cell.textContent = gameBoard[row][col];
    });
}

/**
 * Aktualisiert die Statusanzeige
 */
function updateStatus() {
    // flat() wandelt 2D-Array in 1D-Array um
    // filter() erstellt neues Array mit Elementen, die Bedingung erfüllen
    const whitePieces = gameBoard.flat().filter(piece => "♔♕♖♗♘♙".includes(piece)).length;
    const blackPieces = gameBoard.flat().filter(piece => "♚♛♜♝♞♟".includes(piece)).length;
    
    // Template-String für Statustext
    statusDisplay.textContent = `${isWhiteTurn ? "Zug: Weiß" : "Zug: Schwarz"} | Weiß: ${whitePieces} Figuren, Schwarz: ${blackPieces} Figuren`;
}

/**
 * Entfernt alle visuellen Hervorhebungen
 */
function clearSelection() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        // Alle Hervorhebungs-Klassen entfernen
        cell.classList.remove("selected", "valid-move", "capture");
    });
}

/**
 * Setzt das Spiel komplett zurück
 */
function resetGame() {
    initializeGame();  // Spiel neu initialisieren
}

/**
 * Macht den letzten Zug rückgängig
 */
function undoMove() {
    // Prüfen ob überhaupt Züge vorhanden sind
    if (moveHistory.length === 0) return;  // Frühes Return wenn keine Züge
    
    // Letzten Zug aus Historie entfernen und gleichzeitig zurückgeben
    const lastMove = moveHistory.pop();
    
    // Zug rückgängig machen
    gameBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;          // Figur zurücksetzen
    gameBoard[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;      // Geschlagene Figur wiederherstellen
    
    // Spieler zurückwechseln
    isWhiteTurn = !isWhiteTurn;
    
    // UI aktualisieren
    updateChessboard();
    updateStatus();
    clearSelection();
}

// ===================================================================
// SPIELINITIALISIERUNG
// ===================================================================

// Spiel beim Laden der Seite automatisch starten
// Diese Zeile wird ausgeführt, sobald das JavaScript-File geladen ist
initializeGame();

// ===================================================================
// ZUSÄTZLICHE ERKLÄRUNGEN ZU WICHTIGEN KONZEPTEN
// ===================================================================

/*
WICHTIGE JAVASCRIPT-OPERATOREN UND KONZEPTE:

1. VERGLEICHSOPERATOREN:
   === : Strenger Vergleich (Wert UND Typ müssen gleich sein)
   == : Lockerer Vergleich (nur Wert, Typ wird konvertiert)
   !== : Streng ungleich
   != : Locker ungleich
   > : Größer als
   < : Kleiner als
   >= : Größer oder gleich
   <= : Kleiner oder gleich

2. LOGISCHE OPERATOREN:
   && : UND (beide Bedingungen müssen wahr sein)
   || : ODER (mindestens eine Bedingung muss wahr sein)
   ! : NICHT (Negation, kehrt boolean um)

3. ARITHMETISCHE OPERATOREN:
   + : Addition
   - : Subtraktion
   * : Multiplikation
   / : Division
   % : Modulo (Rest der Division)
   ++ : Inkrement (um 1 erhöhen)
   -- : Dekrement (um 1 verringern)

4. ZUWEISUNGSOPERATOREN:
   = : Zuweisung
   += : Addition und Zuweisung (x += 5 entspricht x = x + 5)
   -= : Subtraktion und Zuweisung
   *= : Multiplikation und Zuweisung
   /= : Division und Zuweisung

5. ARRAY-METHODEN:
   push() : Element am Ende hinzufügen
   pop() : Letztes Element entfernen und zurückgeben
   forEach() : Funktion für jedes Element ausführen
   map() : Neues Array mit transformierten Elementen erstellen
   filter() : Neues Array mit gefilterten Elementen erstellen
   some() : Prüft ob mindestens ein Element Bedingung erfüllt
   includes() : Prüft ob Element im Array vorhanden ist
   flat() : Mehrdimensionales Array in eindimensionales umwandeln

6. STRING-METHODEN:
   includes() : Prüft ob Teilstring enthalten ist
   charAt() : Zeichen an bestimmter Position
   String.fromCharCode() : ASCII-Code zu Zeichen konvertieren

7. DOM-METHODEN:
   getElementById() : Element anhand ID finden
   querySelector() : Erstes Element mit CSS-Selektor finden
   querySelectorAll() : Alle Elemente mit CSS-Selektor finden
   createElement() : Neues HTML-Element erstellen
   appendChild() : Element als Kind hinzufügen
   addEventListener() : Event-Handler registrieren
   classList.add() : CSS-Klasse hinzufügen
   classList.remove() : CSS-Klasse entfernen

8. DATENTYPEN:
   string : Text ("Hallo" oder 'Hallo')
   number : Zahlen (42, 3.14)
   boolean : Wahrheitswerte (true, false)
   null : Explizit leerer Wert
   undefined : Variable existiert, hat aber keinen Wert
   object : Komplexe Datenstrukturen ({ key: value })
   array : Geordnete Liste von Werten ([1, 2, 3])

9. KONTROLLSTRUKTUREN:
   if/else : Bedingte Ausführung
   switch/case : Mehrfachverzweigung
   for : Schleife mit Zähler
   while : Schleife mit Bedingung
   forEach : Schleife über Array-Elemente
   break : Schleife/Switch verlassen
   continue : Nächste Iteration
   return : Funktion verlassen und Wert zurückgeben

10. FUNKTIONSTYPEN:
    function name() {} : Normale Funktionsdeklaration
    const name = function() {} : Funktionsausdruck
    const name = () => {} : Arrow-Function (Pfeilfunktion)
    
11. MODERNE JAVASCRIPT-FEATURES:
    const/let : Block-scoped Variablen (statt var)
    Template-Strings : `Text ${variable} mehr Text`
    Destructuring : const {a, b} = object
    Spread-Operator : ...array
    Arrow-Functions : () => {}
    
12. SCHACHSPIEL-SPEZIFISCHE LOGIK:
    - 2D-Array für Spielbrett: gameBoard[row][col]
    - Unicode-Zeichen für Schachfiguren
    - Koordinatensystem: Zeile 0-7, Spalte 0-7
    - Bewegungslogik: Richtungsvektoren [dx, dy]
    - Validierung: Grenzen prüfen, Figurenregeln anwenden
    - Spielzustand: Aktueller Spieler, Zughistorie, Selektion
*/

// ===================================================================
// PROGRAMMABLAUF ZUSAMMENFASSUNG:
// ===================================================================

/*
1. INITIALISIERUNG:
   - Globale Variablen werden deklariert
   - initializeGame() wird aufgerufen
   - Spielbrett wird erstellt und angezeigt

2. BENUTZERINTERAKTION:
   - Benutzer klickt auf ein Feld
   - handleCellClick() wird ausgeführt
   - Entweder Figur auswählen oder Zug ausführen

3. FIGURAUSWAHL:
   - Prüfung ob Figur dem aktuellen Spieler gehört
   - Berechnung aller gültigen Züge
   - Visuelle Hervorhebung der möglichen Züge

4. ZUGAUSFÜHRUNG:
   - Validierung des gewählten Zugs
   - Aktualisierung des Spielbretts
   - Spielerwechsel
   - Statusupdate

5. HILFSFUNKTIONEN:
   - Positionsvalidierung
   - Figurenerkennung
   - Bewegungsberechnung
   - UI-Updates

Das Programm verwendet ereignisgesteuerte Programmierung:
- Benutzeraktionen lösen Events aus
- Event-Handler verarbeiten die Eingaben
- Spielzustand wird entsprechend aktualisiert
- UI wird neu gerendert




# Schachspiel - Event Listener und Funktionalität

## Event Listener im Projekt

### 1. Zell-Klick Event Listener
```javascript
cell.addEventListener("click", () => handleCellClick(cell));
```

**Beschreibung:** Wird auf jede Schachbrett-Zelle angewendet (64 Event Listener insgesamt)

**Event-Typ:** `click`

**Funktion:** `handleCellClick(cell)`

**Zweck:** 
- Registriert Klicks auf Schachfelder
- Ermöglicht Figurauswahl und Zugausführung
- Zentrale Steuerung der Spielinteraktion

**Parameter:** Das geklickte HTML-Element (Schachfeld)

---

## Hauptfunktionalitäten der JavaScript-Datei

### Initialisierung und Setup

#### `initializeGame()`
- **Zweck:** Startet das Spiel und setzt alle Werte zurück
- **Aktionen:**
  - Kopiert das initiale Schachbrett-Array
  - Setzt Spielzustand auf "Weiß beginnt"
  - Leert Zughistorie und Auswahl
  - Ruft Setup-Funktionen auf

#### `addCoordinates()`
- **Zweck:** Erstellt die Koordinaten-Beschriftung (A-H, 1-8)
- **Funktionalität:**
  - Generiert Y-Achse: Zahlen 8-1 (von oben nach unten)
  - Generiert X-Achse: Buchstaben A-H (von links nach rechts)
  - Verwendet ASCII-Codes für Buchstabengenerierung

#### `createChessboard()`
- **Zweck:** Baut das visuelle 8x8 Schachbrett auf
- **Funktionalität:**
  - Erstellt 64 div-Elemente
  - Wendet Schachbrettmuster an (abwechselnd hell/dunkel)
  - Setzt Figuren aus dem Datenmodell
  - Registriert Event Listener für jedes Feld

### Spiellogik und Interaktion

#### `handleCellClick(cell)`
- **Zweck:** Zentrale Steuerung aller Spieleraktionen
- **Zwei Hauptmodi:**
  1. **Figurauswahl-Modus:** Keine Figur ausgewählt
     - Prüft ob geklickte Figur dem aktuellen Spieler gehört
     - Berechnet und zeigt gültige Züge an
  2. **Zug-Modus:** Figur bereits ausgewählt
     - Validiert den gewünschten Zug
     - Führt Zug aus wenn gültig
     - Wechselt den Spieler

#### `isCorrectTurn(piece)`
- **Zweck:** Überprüft Spieler-Berechtigung
- **Logik:** 
  - Identifiziert Figurenfarbe anhand Unicode-Zeichen
  - Vergleicht mit aktuellem Spieler
  - Verhindert Züge außerhalb der Reihe

### Zugberechnung und Validierung

#### `calculateValidMoves(row, col, piece)`
- **Zweck:** Hauptfunktion für Zugberechnung
- **Funktionalität:**
  - Switch-Statement für figurspezifische Berechnung
  - Delegiert an spezialisierte Funktionen
  - Gibt Array mit gültigen Zügen zurück

#### Figurspezifische Bewegungsfunktionen

##### `getPawnMoves(row, col, isWhite)`
- **Bauern-Spezialregeln:**
  - Ein Feld vorwärts (wenn frei)
  - Zwei Felder vorwärts (nur vom Startplatz)
  - Diagonal schlagen (nur bei Gegnerfigur)
  - Richtungsabhängig: Weiß nach oben, Schwarz nach unten

##### `getRookMoves(row, col, isWhite)`
- **Turm-Bewegung:** Horizontal und vertikal
- **Verwendung:** Ruft `getLinearMoves()` mit 4 Richtungen auf

##### `getBishopMoves(row, col, isWhite)`
- **Läufer-Bewegung:** Diagonal in alle 4 Richtungen
- **Verwendung:** Ruft `getLinearMoves()` mit diagonalen Richtungen auf

##### `getQueenMoves(row, col, isWhite)`
- **Dame-Bewegung:** Kombination aus Turm und Läufer
- **Verwendung:** Ruft `getLinearMoves()` mit allen 8 Richtungen auf

##### `getLinearMoves(row, col, isWhite, directions)`
- **Universelle lineare Bewegung:**
  - Arbeitet mit Richtungsvektoren
  - Bewegt sich schrittweise in jede Richtung
  - Stoppt bei Hindernissen oder Brettrand
  - Unterscheidet zwischen normalen Zügen und Schlagzügen

##### `getKnightMoves(row, col, isWhite)`
- **Springer-Bewegung:** L-förmige Sprünge
- **8 mögliche Positionen:** 2+1 oder 1+2 Felderkombinationen
- **Besonderheit:** Kann über andere Figuren springen

##### `getKingMoves(row, col, isWhite)`
- **König-Bewegung:** Ein Feld in alle 8 Richtungen
- **Einschränkung:** Nur auf angrenzende Felder

### Hilfsfunktionen

#### `isValidPosition(row, col)`
- **Zweck:** Überprüft Brettgrenzen
- **Logik:** Koordinaten müssen zwischen 0-7 liegen

#### `isOpponentPiece(piece, isWhite)`
- **Zweck:** Identifiziert gegnerische Figuren
- **Methode:** Vergleich mit Figuren-Zeichensätzen

#### `isValidMove(from, to)`
- **Zweck:** Finale Zugvalidierung
- **Prozess:** Berechnet gültige Züge und prüft Zielposition

### Spielmechanik

#### `makeMove(fromRow, fromCol, toRow, toCol)`
- **Zweck:** Führt validierten Zug aus
- **Aktionen:**
  - Speichert Zug in Historie (für Undo)
  - Bewegt Figur im Datenmodell
  - Aktualisiert visuelle Darstellung

#### `showValidMoves(selectedPiece)`
- **Zweck:** Visuelle Zugvorschau
- **Funktionalität:**
  - Hebt ausgewählte Figur hervor
  - Markiert mögliche Züge grün
  - Markiert Angriffszüge rot

### Update und Status

#### `updateChessboard()`
- **Zweck:** Synchronisiert Anzeige mit Datenmodell
- **Prozess:** Überträgt gameBoard-Array in HTML-Darstellung

#### `updateStatus()`
- **Zweck:** Aktualisiert Spielinformationen
- **Anzeige:**
  - Aktueller Spieler
  - Anzahl verbliebener Figuren je Farbe

#### `clearSelection()`
- **Zweck:** Entfernt visuelle Hervorhebungen
- **Aktionen:** Löscht CSS-Klassen für Markierungen

### Zusatzfunktionen

#### `resetGame()`
- **Zweck:** Kompletter Spielneustart
- **Aktion:** Ruft `initializeGame()` auf

#### `undoMove()`
- **Zweck:** Macht letzten Zug rückgängig
- **Funktionalität:**
  - Liest letzten Eintrag aus moveHistory
  - Stellt ursprüngliche Positionen wieder her
  - Wechselt Spieler zurück
  - Aktualisiert Anzeige

---

## Datenstrukturen

### Globale Variablen
- `gameBoard`: 2D-Array (8x8) für aktuelles Spielbrett
- `selectedPiece`: Object mit ausgewählter Figur oder null
- `isWhiteTurn`: Boolean für Spielerwechsel
- `moveHistory`: Array mit allen ausgeführten Zügen

### Move-Objects
```javascript
{
  row: number,      // Zielzeile
  col: number,      // Zielspalte  
  isCapture: boolean // true bei Schlagzug
}
```

### History-Objects
```javascript
{
  from: {row, col},     // Startposition
  to: {row, col},       // Zielposition
  piece: string,        // Bewegte Figur
  capturedPiece: string // Geschlagene Figur
}
```

---

## Programmfluss

1. **Initialisierung:** Setup von Datenmodell und UI
2. **Benutzeraktion:** Klick auf Schachfeld löst Event aus
3. **Entscheidung:** Figur auswählen oder Zug ausführen
4. **Validierung:** Prüfung der Schachregeln
5. **Ausführung:** Spielbrett-Update und Spielerwechsel
6. **Feedback:** Visuelle Rückmeldung an Benutzer

Das System arbeitet vollständig ereignisgesteuert und reagiert ausschließlich auf Benutzerinteraktionen.




*/