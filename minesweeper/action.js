const createElement = (element, innerHTML, ...classes) => {
    const node = document.createElement(element);
    node.classList.add(...classes);
    node.innerHTML = innerHTML;
    return node;
};
const { body } = document;

    const minesweeper = createElement('div', '', 'minesweeper');
    for (let i = 0; i < 9; i += 1) {
        const row = createElement('div', '', 'minesweeper__row');
        for (let i = 0; i < 9; i += 1) {
            const cell = createElement('button', '', 'minesweeper__cell');
            row.append(cell);
        }
        minesweeper.append(row);
    }
    body.append(minesweeper);
