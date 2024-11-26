const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 3;
const cols = 3;

let playground = Array.from({ length: rows }, () => Array(cols).fill(null));
let currentPlayer = 'X';

const winningCombinations = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
];

function Size() {
    if (window.innerWidth < 600) {
        canvas.width = canvas.height = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
    } else {
        canvas.width = canvas.height = 400;
    }
    cellSize = canvas.width / 3;
    Field();
    CheckField();
}

function Field() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }

    for (let i = 1; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

function CheckField() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (playground[row][col]) { 
                Symbol(row, col, playground[row][col]); // проверяет наличие символа
            }
        }
    }
}

function Symbol(row, col, mark) {
    var x = col * cellSize + cellSize / 2; //определяем середину клетки для отрисовки
    var y = row * cellSize + cellSize / 2;

    ctx.font = `${cellSize / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = mark === 'X' ? 'blue' : 'red';
    ctx.fillText(mark, x, y);
}

function WinLine(combination) {
    var [[startRow, startCol], [endRow, endCol]] = [combination[0], combination[2]];

    var startX = startCol * cellSize + cellSize / 2;
    var startY = startRow * cellSize + cellSize / 2;
    var endX = endCol * cellSize + cellSize / 2;
    var endY = endRow * cellSize + cellSize / 2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            playground[a[0]][a[1]] && // проверяем на соответствие 1,2,3 клетку
            playground[a[0]][a[1]] === playground[b[0]][b[1]] &&
            playground[a[0]][a[1]] === playground[c[0]][c[1]]
        ) {
            return { winner: playground[a[0]][a[1]], combination };
        }
    }
    return null;
}

function CheckSymbol() {
    return playground.flat().every(cell => cell !== null);
}

canvas.addEventListener('click', (event) => {
    var rect = canvas.getBoundingClientRect(); // вычисление позиций клика
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    var col = Math.floor(mouseX / cellSize); // определение по чему кликнули
    var row = Math.floor(mouseY / cellSize);

    if (!playground[row][col]) { // пустая ли клетка
        playground[row][col] = currentPlayer;
        Symbol(row, col, currentPlayer);

        var result = checkWinner();
        if (result) {
            WinLine(result.combination);
            setTimeout(() => alert(`Победитель: ${result.winner}`), 10);
            setTimeout(reset, 1500);
            return;
        }

        if (CheckSymbol()) {
            setTimeout(() => alert('Ничья!'), 10);
            setTimeout(reset, 1500);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
});

function reset() {
    playground = Array.from({ length: rows }, () => Array(cols).fill(null));
    currentPlayer = 'X';
    Field();
}

window.addEventListener('resize', Size);

Size();
