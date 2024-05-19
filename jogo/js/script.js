const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

const width = 8;
const gemTypes = ['gem1', 'gem2', 'gem3', 'gem4'];
let score = 0;
let gems = [];

// Initialize the game board
function createBoard() {
    gems = [];
    gameBoard.innerHTML = '';
    for (let i = 0; i < width * width; i++) {
        const gem = document.createElement('div');
        gem.setAttribute('draggable', true);
        gem.setAttribute('id', i);
        let randomGem = Math.floor(Math.random() * gemTypes.length);
        gem.className = `gem ${gemTypes[randomGem]}`;
        gameBoard.appendChild(gem);
        gems.push(gem);
    }
}

// Dragging functions
let gemBeingDragged, gemBeingReplaced, gemIdBeingDragged, gemIdBeingReplaced;

gems.forEach(gem => gem.addEventListener('dragstart', dragStart));
gems.forEach(gem => gem.addEventListener('dragend', dragEnd));
gems.forEach(gem => gem.addEventListener('dragover', dragOver));
gems.forEach(gem => gem.addEventListener('dragenter', dragEnter));
gems.forEach(gem => gem.addEventListener('dragleave', dragLeave));
gems.forEach(gem => gem.addEventListener('drop', dragDrop));

function dragStart() {
    gemBeingDragged = this;
    gemIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    gemBeingReplaced = this;
    gemIdBeingReplaced = parseInt(this.id);
}

function dragEnd() {
    let validMoves = [
        gemIdBeingDragged - 1,
        gemIdBeingDragged + 1,
        gemIdBeingDragged - width,
        gemIdBeingDragged + width
    ];

    let validMove = validMoves.includes(gemIdBeingReplaced);

    if (gemIdBeingReplaced && validMove) {
        gems[gemIdBeingReplaced].className = gemBeingDragged.className;
        gems[gemIdBeingDragged].className = gemBeingReplaced.className;

        gemBeingReplaced = null;
        gemBeingDragged = null;
        checkForMatches();
    } else {
        gems[gemIdBeingReplaced].className = gemBeingReplaced.className;
        gems[gemIdBeingDragged].className = gemBeingDragged.className;
    }
}

// Check for matches
function checkForMatches() {
    // Check for row matches
    for (let i = 0; i < 64; i++) {
        let rowOfThree = [i, i + 1, i + 2];
        let decidedGem = gems[i].className;
        const isBlank = gems[i].className === '';

        if (rowOfThree.every(index => gems[index].className === decidedGem && !isBlank)) {
            score += 3;
            rowOfThree.forEach(index => {
                gems[index].className = '';
            });
        }
    }
    // Check for column matches
    for (let i = 0; i < 48; i++) {
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedGem = gems[i].className;
        const isBlank = gems[i].className === '';

        if (columnOfThree.every(index => gems[index].className === decidedGem && !isBlank)) {
            score += 3;
            columnOfThree.forEach(index => {
                gems[index].className = '';
            });
        }
    }
    scoreDisplay.textContent = score;
    moveDownGems();
}

// Move gems down after match
function moveDownGems() {
    for (let i = 0; i < 55; i++) {
        if (gems[i + width].className === '') {
            gems[i + width].className = gems[i].className;
            gems[i].className = '';
        }
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && gems[i].className === '') {
            let randomGem = Math.floor(Math.random() * gemTypes.length);
            gems[i].className = `gem ${gemTypes[randomGem]}`;
        }
    }
}

// Event Listeners
resetButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = score;
    createBoard();
});

// Initialize the game
createBoard();