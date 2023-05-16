const createElement = (element, innerHTML, ...classes) => {
    const node = document.createElement(element);
    node.classList.add(...classes);
    node.innerHTML = innerHTML;
    return node;
};
const {body} = document;


let field = [];
let rows = 10;
let columns = 10;

let minesAmount = 20;
let minesArr = []; // "2-2", "3-4", "2-1"

let cellsClicked = 0; //goal to click all cells except the ones containing mines
let gameOver = false;
let DELIMETER = ":";

window.onload = function () {
    generateGame();
}


function generateGame() {

    const minesweeper = createElement('div', '', 'minesweeper');

    for (let row = 0; row < rows; row++) {
        let rowCells = [];
        for (let column = 0; column < columns; column++) {

            const cell = createElement('div', '', 'minesweeper__cell');
            cell.id = "" + row + DELIMETER + column;
            cell.addEventListener("click", () => {
                clickCell(cell)
            });
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                setFlag(cell)
            });

            minesweeper.append(cell);
            rowCells.push(cell);
        }
        field.push(rowCells);
    }
    body.append(minesweeper);
}

function generateMines(cell) {
    for (let i = 0; i < minesAmount; i++) {
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);
        let id = "" + row + DELIMETER + column;
        if (!minesArr.includes(id) && cell.id !== id) {
            minesArr.push(id);
        } else i -= 1
    }
}

function clickCell(cell) {

    if (gameOver || cell.classList.contains("clicked") || cell.innerText === '🔺') {
        return;
    }

    if (cellsClicked === 0) {
        generateMines(cell);
    }

    if (minesArr.includes(cell.id)) {
        gameOver = true;
        showMines();
        alert("GAME OVER");
        return;
    }

    let coords = cell.id.split(DELIMETER); // "0-0" -> ["0", "0"]
    let row = Number(coords[0]);
    let column = Number(coords[1]);
    openPieceField(row, column);
}

function showMines() {
    for (let i = minesArr.length - 1; i >= 0; i--) {
        let coords = minesArr[i].split(DELIMETER);
        let row = parseInt(coords[0]);
        let column = parseInt(coords[1]);

        field[row][column].innerText = "💣";
        field[row][column].style.backgroundColor = "red";
    }
}

function setFlag(cell) {

    if (cell.innerText === '🔺') {
        cell.innerText = '';
    } else if (!cell.classList.contains("clicked")) {
        cell.innerText = '🔺';
    }
}

function openPieceField(row, column) {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
        return;
    }
    if (field[row][column].classList.contains("clicked")) {
        return;
    }
    if (field[row][column].innerText !== '🔺') {
        field[row][column].classList.add("clicked");
    }

    cellsClicked += 1;


    let countMines = countFoundMines(row, column);

    if (countMines > 0) {
        field[row][column].innerText = countMines;
        if (countMines === 1) field[row][column].style.color = "blue";
        if (countMines === 2) field[row][column].style.color = "green";
        if (countMines === 3) field[row][column].style.color = "red";
        if (countMines === 4) field[row][column].style.color = "navy";
        if (countMines === 5) field[row][column].style.color = "brown";
        if (countMines === 6) field[row][column].style.color = "teal";
        if (countMines === 7) field[row][column].style.color = "black";
        if (countMines === 8) field[row][column].style.color = "gray";

    } else {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                openPieceField(row + x, column + y);
            }
        }
    }

    if (cellsClicked === rows * columns - minesAmount) {
        // alert("You win!");
        gameOver = true;
    }

}

function countFoundMines(row, column) {
    let countMines = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            countMines += checkCell(row + x, column + y);
        }
    }
    return countMines;
}

function checkCell(row, column) {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
        return 0;
    }
    return minesArr.includes("" + row + DELIMETER + column) ? 1 : 0;
}
