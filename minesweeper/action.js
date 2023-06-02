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
let minesAmount = 10;
let newMinesAmount = 0;
let countFlag = minesAmount;
let cellsClicked = 0;
let numberClicks = 0;
let gameOver = false;
let DELIMETER = ":";
let chooseLevel = '';
let timerId;
let resLocal = [];
let soundOffChoose = false;

let audioClick = new Audio('audio/effect.mp3');
let audioBombClick = new Audio('audio/classic_hurt.mp3');
let audioWin = new Audio('audio/triumphal_trumpet.mp3');


let chooseTeam = '';
const blackout = createElement('div', '', 'blackout');
const container = createElement('div', '', 'container');

const textContainer = createElement('div', '', 'texts-container');
let clickedContainer = createElement('div', '', 'text-content');
const clickedText = createElement('span', 'Количество кликов :', 'text');
const clickedAmountText = createElement('span', numberClicks, 'text');

let stopwatchContainer = createElement('div', '', 'text-content');
const stopwatchText = createElement('span', 'Секудомер :', 'text');
const stopwatchAmountText = createElement('span', '00 : 00', 'text');

let flagContainer = createElement('div', '', 'text-content');
const flagText = createElement('span', '🔺 :', 'text');
const flagAmountText = createElement('span', minesAmount, 'text');

let minesContainer = createElement('div', '', 'text-content');
const minesText = createElement('span', '💣 :', 'text');
const minesAmountText = createElement('input', '', 'text-mines');
minesAmountText.value = minesAmount;
minesAmountText.type = 'number';
minesAmountText.step = '1';
minesAmountText.min = '10';
minesAmountText.max = '99';

const btnNewMines = createElement('button', 'set mines', 'btn-new-mines');

const resultBTN = createElement('button', 'Результаты', 'btn-result');
const resultContainer = createElement('div', '', 'result');
const resultTextAmount = createElement('span', '', 'text-result');
const resultCross = createElement('div', '❌', 'cross-result');

const soundContainer = createElement('div', '', 'text-content', 'sound');
const soundText = createElement('p', 'Звук:', 'text');
const soundSwitch = createElement('button', 'off', 'btn-text', 'sound-btn');

const teamContainer = createElement('div', '', 'just-container');
const chooseTeamText = createElement('span', 'Выбор темы :', 'text');
const lightTeam = createElement('button', 'Светлая', 'btn-team__text');
const darkTeam = createElement('button', 'Тёмная', 'btn-team__text');

const header = createElement('div', '', 'header');
const btnNewGame = createElement('button', 'New game', 'btn-new-game');
const levelsContainer = createElement('div', '', 'just-container');
const chooseLevelText = createElement('span', 'Choose level:', 'text');
const easyLevel = createElement('button', 'easy 10x10', 'btn-text');
const middleLevel = createElement('button', 'medium 15x15', 'btn-text');
const hardLevel = createElement('button', 'hard 25x25', 'btn-text');
const modal = createElement('div', '', 'modal', 'hidden');
const modalCross = createElement('div', '❌', 'cross-modal');
const modalText = createElement('p', '', 'modal-text');


flagContainer.append(flagText, flagAmountText);
stopwatchContainer.append(stopwatchText, stopwatchAmountText);
clickedContainer.append(clickedText, clickedAmountText);
soundContainer.append(soundText, soundSwitch);
minesContainer.append(minesText, minesAmountText);
resultContainer.append(resultCross, resultTextAmount)

textContainer.append(clickedContainer, stopwatchContainer, flagContainer, minesContainer, btnNewMines, soundContainer)
container.append(textContainer);

teamContainer.append(chooseTeamText, lightTeam, darkTeam);
levelsContainer.append(chooseLevelText, easyLevel, middleLevel, hardLevel);
header.append(btnNewGame, levelsContainer, teamContainer, resultBTN)
modal.append(modalCross, modalText);
body.append(blackout, header, modal, container, resultContainer);

document.addEventListener('DOMContentLoaded', function () {

    btnNewGame.addEventListener('click', () => {
        restartMinesweeper();
        generateGame();
        if (chooseLevel === 'easy' || chooseLevel === '') {
            newMinesAmount = 10;
            minesAmount = 10;
        }
        if (chooseLevel === 'medium') {
            newMinesAmount = 35;
            minesAmount = 35;
        }
        if (chooseLevel === 'hard') {
            newMinesAmount = 85;
            minesAmount = 85;
        }
        minesAmountText.value = minesAmount;
        flagAmountText.innerHTML = minesAmount;
    })

    easyLevel.addEventListener('click', () => {
        restartMinesweeper();
        chooseLevel = 'easy';
        rows = 10;
        columns = 10;
        minesAmount = 10;
        flagAmountText.innerHTML = minesAmount;
        minesAmountText.value = minesAmount;
        generateGame();
    })

    middleLevel.addEventListener('click', () => {
        restartMinesweeper();
        chooseLevel = 'middle';
        rows = 15;
        columns = 15;
        minesAmount = 35;
        flagAmountText.innerHTML = minesAmount;
        minesAmountText.value = minesAmount;
        generateGame();
    })

    hardLevel.addEventListener('click', () => {
        restartMinesweeper();
        chooseLevel = 'hard';
        rows = 25;
        columns = 25;
        minesAmount = 85;
        flagAmountText.innerHTML = minesAmount;
        minesAmountText.value = minesAmount;
        generateGame();
    })

    modalCross.addEventListener("click", () => {
        modal.classList.add("hidden");
        blackout.classList.remove("blackout-yes");
    });

    lightTeam.addEventListener("click", () => {
        chooseTeam = 'light'
        teamClick();
    });

    darkTeam.addEventListener("click", () => {
        chooseTeam = 'dark'
        teamClick()
    });

    soundSwitch.addEventListener("click", soundClick);

    minesAmountText.addEventListener('input', function () {
        let inputValue = this.value;
        if (inputValue < 10) {
            newMinesAmount = 10;
        } else if (inputValue > 99) {
            newMinesAmount = 99;
        } else if (parseFloat(inputValue)) {
            newMinesAmount = Math.round(inputValue);
        } else {
            newMinesAmount = inputValue;
        }
    });

    btnNewMines.addEventListener('click', () => {
        specialGame();
    });

    resultBTN.addEventListener('click', () => {
        blackout.classList.add("blackout-yes");
        resultContainer.classList.add("result-show");
    });

    resultCross.addEventListener('click', () => {
        resultContainer.classList.remove("result-show");
        blackout.classList.remove("blackout-yes");
    });

})

function generateGame() {
    const minesweeper = createElement('div', '', 'minesweeper');

    if (chooseLevel === 'easy' || chooseLevel === '') {
        minesweeper.style.width = "300px";
        minesweeper.style.minWidth = "300px";
        minesweeper.style.height = "300px";
    }

    if (chooseLevel === 'middle') {
        minesweeper.style.width = "450px";
        minesweeper.style.minWidth = "450px";
        minesweeper.style.height = "450px";
    }

    if (chooseLevel === 'hard') {
        minesweeper.style.width = "750px";
        minesweeper.style.minWidth = "750px";
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
                    if (!soundOffChoose) {
                        if (!minesArr.includes(cell.id)) {
                            await audioClick.play();
                        } else {
                            await audioBombClick.play();
                        }
                    }
                    await clickCell(cell);
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
        endGame(false);
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
        countFlag += 1;
    } else if (!cell.classList.contains("clicked")) {
        cell.innerText = '🔺';
        countFlag -= 1;
    }
    flagAmountText.innerHTML = countFlag;
}

function openPieceField(row, column) {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
        return;
    }
    if (field[row][column].classList.contains("clicked") || field[row][column].innerText === '🔺') {
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
    }
    if (countMines === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                openPieceField(row + x, column + y);
            }
        }
    }

    if (cellsClicked === rows * columns - minesAmount && !gameOver) {
        winGame();
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

function winGame() {
    gameOver = true;
    if (!soundOffChoose) {
        (async function () {
            await audioWin.play();
        })();
    }
    endGame(true);
    clearInterval(timerId)
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
        modalText.classList.add('modal-text-dark');
        blackout.classList.add('blackout-dark');
        resultContainer.classList.add('result-dark');
        for (let text of texts) {
            text.classList.add("text-dark");
        }
    }
    if (chooseTeam === 'light') {
        header.classList.remove("header-dark");
        body.classList.remove('body-dark');
        minesweeperQuery.classList.remove('minesweeper-dark');
        modal.classList.remove('modal-dark');
        modalText.classList.remove('modal-text-dark');
        blackout.classList.remove('blackout-dark');
        resultContainer.classList.remove('result-dark');
        for (let text of texts) {
            text.classList.remove("text-dark");
        }
    }
}

function soundClick() {
    if (soundSwitch.innerHTML === 'off') {
        soundSwitch.innerHTML = 'on';
        soundOffChoose = true;
    } else {
        soundSwitch.innerHTML = 'off';
        soundOffChoose = false;
    }
}

function restartMinesweeper() {
    let minesweeperQuery = document.querySelector('.minesweeper');
    countFlag = minesAmount;
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

function specialGame() {
    minesAmountText.value = newMinesAmount;
    minesAmount = minesAmountText.value;
    flagAmountText.innerHTML = newMinesAmount;
    restartMinesweeper();
    if (chooseLevel === 'easy' || chooseLevel === '') {
        rows = 10;
        columns = 10;
        generateGame();
    }
    if (chooseLevel === 'middle') {
        rows = 15;
        columns = 15;
        generateGame();
    }
    if (chooseLevel === 'hard') {
        rows = 25;
        columns = 25;
        generateGame();
    }
}

function endGame(youWin) {

    modalText.textContent = youWin ? `You win! You found all mines in ${stopwatchAmountText.textContent} time and ${clickedAmountText.textContent} click` : 'Unfortunately, you lose :(';
    modal.classList.remove("hidden");
    blackout.classList.add("blackout-yes");

    if (youWin) {
        let resOutput = `You found all mines in ${stopwatchAmountText.textContent} time and ${clickedAmountText.textContent} click`;
        saveResGame(resOutput);
    }
}

function saveResGame(resNew) {
    if (resNew) {
        resLocal.unshift(resNew);
    }
    let newArrLocal = resLocal.join(', ').split(', ');
    if (newArrLocal.length > 10) {
        let newArr = newArrLocal.slice(0, 10);
        resultTextAmount.innerHTML = newArr.join(' ');
        localStorage.setItem('result', newArr.join(', '));
    } else {
        localStorage.setItem('result', newArrLocal.join(', '));
        resultTextAmount.innerHTML = newArrLocal.join(' ');
    }
}

function loadSaveResGame() {
    let local = localStorage.getItem('result');
    if (local) {
        resLocal.push(local);
        let newResLocal = resLocal.join(', ').split(', ');
        if (newResLocal.length > 10) {
            newResLocal.shift();
        }
        resultTextAmount.innerHTML = newResLocal.join(' ');
    }
}

// let game = {};

// setTimeout(() => {
//     saveGame()
// }, 10000);
//
// function saveGame() {
//     let board = createElement('div', '', 'minesweeper');
//
//     let boardCell = document.querySelector(".minesweeper").children
//     let saveBoard = []
//     for (let i = 0; i < boardCell.length; i++) {
//         saveBoard.push(boardCell[i].outerHTML);
//     }
//     console.log(saveBoard.join(''))
//     board.innerHTML = saveBoard.join('')
//     body.append(board)
//
//     // localStorage.setItem('game', JSON.stringify(game));
// }

// saveGame()
// function loadGame() {
//     let localGame = localStorage.getItem('game');
//     if (localGame) {
//         console.log(JSON.parse(localGame))
//     }
// }
//
// loadGame()

loadSaveResGame();
window.addEventListener('resize', go);

function go() {
    let minesweeperQuery = document.querySelector('.minesweeper');
    let minesweeperCellsQuery = document.querySelectorAll('.minesweeper__cell');
    if (window.innerWidth <= 790 && chooseLevel === "hard") {
        minesweeperQuery.style.minWidth = '450px';
        minesweeperQuery.style.width = '450px';
        minesweeperQuery.style.height = '450px';
        for (let cell of minesweeperCellsQuery) {
            cell.style.width = '18px';
            cell.style.height = '18px';
        }
    }

    if (window.innerWidth >= 790 && chooseLevel === "hard") {
        minesweeperQuery.style.minWidth = '750px';
        minesweeperQuery.style.width = '750px';
        minesweeperQuery.style.height = '750px';
        for (let cell of minesweeperCellsQuery) {
            cell.style.width = '30px';
            cell.style.height = '30px';
        }
    }

}

