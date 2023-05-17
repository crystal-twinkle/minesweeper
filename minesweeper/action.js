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

let minesArr = [];
let minesAmount = 15;
let countFlag = minesAmount;
let cellsClicked = 0;
let numberClicks = 0;
let gameOver = false;
let DELIMETER = ":";
let chooseLevel = '';
let timerId;
let game;

let audioClick = new Audio('audio/effect.mp3');
let audioBombClick = new Audio('audio/classic_hurt.mp3');
let audioWin = new Audio('audio/triumphal_trumpet.mp3');


let chooseTeam = '';

const container = createElement('div', '', 'container');

const textContainer = createElement('div', '', 'texts-container');
let clickedContainer = createElement('div', '', 'text-content');
const clickedText = createElement('p', 'Количество кликов:', 'text');
const clickedAmountText = createElement('p', numberClicks, 'text');

let stopwatchContainer = createElement('div', '', 'text-content');
const stopwatchText = createElement('p', 'Секудомер:', 'text');
const stopwatchAmountText = createElement('p', '00 : 00', 'text');

let flagContainer = createElement('div', '', 'text-content');
const flagText = createElement('p', 'Флаги:', 'text');
const flagAmountText = createElement('p', minesAmount, 'text');

const teamContainer = createElement('div', '', 'just-container');
const chooseTeamText = createElement('p', 'Выбор темы:', 'text');
const lightTeam = createElement('button', 'Светлая', 'btn-team__text');
const darkTeam = createElement('button', 'Тёмная', 'btn-team__text');

const header = createElement('div', '', 'header');
const btnNewGame = createElement('button', 'New game', 'btn-new-game');
const levelsContainer = createElement('div', '', 'just-container');
const chooseLevelText = createElement('p', 'Choose level:', 'text');
const easyLevel = createElement('button', 'easy 10x10', 'btn-text');
const middleLevel = createElement('button', 'medium 15x15', 'btn-text');
const hardLevel = createElement('button', 'hard 25x25', 'btn-text');
const modal = createElement('div', '', 'modal', 'hidden');
const modalCross = createElement('div', '❌', 'cross-modal');
const modalText = createElement('p', '', 'modal-text');

flagContainer.append(flagText, flagAmountText);
stopwatchContainer.append(stopwatchText, stopwatchAmountText)
clickedContainer.append(clickedText, clickedAmountText)
textContainer.append(clickedContainer, stopwatchContainer, flagContainer)
container.append(textContainer);

teamContainer.append(chooseTeamText, lightTeam, darkTeam);
levelsContainer.append(chooseLevelText, easyLevel, middleLevel, hardLevel);
header.append(btnNewGame, levelsContainer, teamContainer)
modal.append(modalCross, modalText);
body.append(header, modal, container);

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
        flagAmountText.innerHTML = minesAmount;
        generateGame();
    })

    middleLevel.addEventListener('click', () => {
        deleteMinesweeper();
        chooseLevel = 'middle';
        rows = 15;
        columns = 15;
        minesAmount = 37;
        flagAmountText.innerHTML = minesAmount;
        generateGame();
    })

    hardLevel.addEventListener('click', () => {
        deleteMinesweeper();
        chooseLevel = 'hard';
        rows = 25;
        columns = 25;
        minesAmount = 89;
        flagAmountText.innerHTML = minesAmount;
        generateGame();
    })

    modalCross.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    lightTeam.addEventListener("click", () => {
        chooseTeam = 'light'
        teamClick();
    });
    darkTeam.addEventListener("click", () => {
        chooseTeam = 'dark'
        teamClick()
    });
})

function deleteMinesweeper() {
    let minesweeperQuery = document.querySelector('.minesweeper');
    container.removeChild(minesweeperQuery);
    field = [];
    minesArr = [];
    numberClicks = 0;
    cellsClicked = 0;
    gameOver = false;
    modal.classList.add("hidden");
    clickedAmountText.innerText = numberClicks;
    stopTimer();
}

function generateGame() {
    // saveGame();
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
                if (gameOver || cell.classList.contains("clicked") || cell.innerText === '🔺') {
                    return;
                }
                (async function () {
                    if (!minesArr.includes(cell.id)) {
                        await audioClick.play();
                    } else {
                        await audioBombClick.play();
                    }
                    clickCell(cell);
                })();
            })

            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                setFlag(cell)
            });

            minesweeper.append(cell);
            rowCells.push(cell);
        }
        field.push(rowCells);
    }
    container.append(minesweeper);
    teamClick();
}

generateGame();

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
    if (cellsClicked === 0) {
        generateMines(cell);
        timer();
    }

    if (minesArr.includes(cell.id)) {
        gameOver = true;
        showMines();
        clearInterval(timerId);
        endGame(false)
        return;
    }

    let coords = cell.id.split(DELIMETER); // "0-0" -> ["0", "0"]
    let row = Number(coords[0]);
    let column = Number(coords[1]);

    numberClicks += 1;
    clickedAmountText.innerText = numberClicks;
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
    flagAmountText.innerHTML = countFlag;
    if (cell.innerText === '🔺') {
        cell.innerText = '';
    } else if (!cell.classList.contains("clicked")) {
        cell.innerText = '🔺';
    }
    countFlag -= 1;
    flagAmountText.innerHTML = countFlag;
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
        gameOver = true;
        (async function () {
            await audioWin.play();})();
        endGame(true);
        clearInterval(timerId)
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
    modalText.textContent = youWin ? 'You win!' : 'You lose';
    modal.classList.remove("hidden");
}

function timer() {
    let time = 0;
    timerId = setInterval(() => {
        time += 1;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        if (minutes < 10 && seconds < 10) {
            stopwatchAmountText.innerHTML = `0${minutes} : 0${seconds}`;
        } else {
            stopwatchAmountText.innerHTML = `${minutes} : ${seconds}`;
        }
        if (minutes < 10 && seconds >= 10) {
            stopwatchAmountText.innerHTML = `0${minutes} : ${seconds}`;
        }
        if (minutes >= 10 && seconds < 10) {
            stopwatchAmountText.innerHTML = `${minutes} : 0${seconds}`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    stopwatchAmountText.innerHTML = `00 : 00`;
}

function teamClick() {
    let texts = document.querySelectorAll('.text');
    let minesweeperQuery = document.querySelector('.minesweeper');
    if (chooseTeam === 'dark') {
        header.classList.add("header-dark");
        body.classList.add('body-dark');
        minesweeperQuery.classList.add('minesweeper-dark');
        modal.classList.add('modal-dark');
        modalText.classList.add('modal-text-dark')
        for (let text of texts) {
            text.classList.add("text-dark");
        }
    }
    if (chooseTeam === 'light') {
        header.classList.remove("header-dark");
        body.classList.remove('body-dark');
        minesweeperQuery.classList.remove('minesweeper-dark');
        modal.classList.remove('modal-dark');
        modalText.classList.remove('modal-text-dark')
        for (let text of texts) {
            text.classList.remove("text-dark");
        }
    }
}

// function saveGame() {
//     if (localStorage.getItem('game')) {
//         game = localStorage.getItem('game');
//     } else {
//         localStorage.setItem('game', chooseLevel);
//     }
// }
