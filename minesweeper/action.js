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

let minesArr = []; // "2-2", "3-4", "2-1"
let minesAmount = 15;
let cellsClicked = 0; //goal to click all cells except the ones containing mines
let gameOver = false;
let DELIMETER = ":";

const header = createElement('div', '', 'header');
const btnNewGame = createElement('button', 'New game', 'btn-new-game');
const easyLevel = createElement('div', 'easy 10x10', 'level-text');
const middleLevel = createElement('div', 'medium 15x15', 'level-text');
const hardLevel = createElement('div', 'hard 25x25', 'level-text');

let chooseLevel = '';


header.append(btnNewGame, easyLevel, middleLevel, hardLevel)
body.append(header);

document.addEventListener('DOMContentLoaded', function () {

    btnNewGame.addEventListener('click', () => {
        deleteMinesweeper();
        generateGame();
    })

    easyLevel.addEventListener('click', () => {
        deleteMinesweeper();
        chooseLevel = 'easy';
        rows = 10;
        columns = 10;
        minesAmount = 15;
        generateGame();
    })

    middleLevel.addEventListener('click', () => {
        deleteMinesweeper();
        chooseLevel = 'middle';
        rows = 15;
        columns = 15;
        minesAmount = 37;
        generateGame();
    })

    hardLevel.addEventListener('click', () => {
        deleteMinesweeper();
        chooseLevel = 'hard';
        rows = 25;
        columns = 25;
        minesAmount = 89;
        generateGame();
    })

})

function deleteMinesweeper() {
    let minesweeperQuery = document.querySelector('.minesweeper');
    let modalQuery = document.querySelector('.modal');
    if (modalQuery !== null) {
        body.removeChild(modalQuery);
    }
    body.removeChild(minesweeperQuery);
    field = [];
    minesArr = []
}

function generateGame() {

    cellsClicked = 0;
    const minesweeper = createElement('div', '', 'minesweeper');
    minesweeper.style.width = "300px";
    minesweeper.style.height = "300px";

    if (chooseLevel === 'easy') {
        minesweeper.style.width = "300px";
        minesweeper.style.height = "300px";
    }

    if (chooseLevel === 'middle') {
        minesweeper.style.width = "450px";
        minesweeper.style.height = "450px";
    }

    if (chooseLevel === 'hard') {
        minesweeper.style.width = "750px";
        minesweeper.style.height = "750px";
    }

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

generateGame();

function generateMines(rows, columns, minesAmount, cell) {
    for (let i = 0; i < minesAmount; i++) {
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);
        let id = "" + row + DELIMETER + column;
        if (!minesArr.includes(id) && cell.id !== id) {
            minesArr.push(id);
        } else i -= 1
    }
}

function clickCell(cellule) {

    if (cellule.classList.contains("clicked") || cellule.innerText === '🔺') {
        return;
    }

    if (cellsClicked === 0) {
        generateMines(rows, columns, minesAmount, cellule);
    }

    if (minesArr.includes(cellule.id)) {
        gameOver = true;
        showMines();
        endGame(false)
        return;
    }

    let coords = cellule.id.split(DELIMETER); // "0-0" -> ["0", "0"]
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
    console.log(cellsClicked)

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
        gameOver = true;
        endGame(true)
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

function endGame(youWin) {
    let messageEndGame = youWin ? 'You win' : 'You lose';
    const modal = createElement('div', messageEndGame, 'modal', 'hidden');
    const crossModal = createElement('div', '❌', 'cross-modal');
    modal.append(crossModal);
    body.append(modal);
    modal.classList.remove("hidden");

    crossModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

