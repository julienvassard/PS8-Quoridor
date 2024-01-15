// Sélectionnez la div wrapper
const wrapper = document.querySelector('.wrapper');
const cells = [];
let activePlayer = 'playerA';

// Générez les 81 div et ajoutez-les à la div wrapper
for (var i = 1; i <= 81; i++) {
    var newDiv = document.createElement('div');
    newDiv.textContent = ' ';
    newDiv.classList.add('cell' + i);
    cells.push(newDiv);
    wrapper.appendChild(newDiv);

}

let player1Position = 4;
let player2Position = 76;
cells[player1Position].classList.add('playerA');
cells[player2Position].classList.add('playerB');

function handleCellClick(cellIndex,position) {
    const validMoves = getValidMoves(position);

    validMoves.forEach(move => {
        const moveCell = cells[move];
        if (!moveCell.classList.contains('playerA') && !moveCell.classList.contains('playerB')) {
            moveCell.classList.add('possible-move');
        }
    });
}

function getValidMoves(position) {
    const row = Math.floor(position / 9);
    const col = position % 9;
    const moves = [];


    // Déplacements horizontaux et verticaux
    if (row > 0) moves.push(position - 9);
    if (row < 8) moves.push(position + 9);
    if (col > 0) moves.push(position - 1);
    if (col < 8) moves.push(position + 1);


    return moves;
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => movePlayer(index));
});

function movePlayer(cellIndex) {
    const clickedCell = cells[cellIndex];

    if (cellIndex === player1Position && activePlayer === 'playerA') {
        handleCellClick(cellIndex, player1Position);
    }
    if (cellIndex === player2Position && activePlayer === 'playerB') {
        handleCellClick(cellIndex, player2Position);
    }

    // Vérifier si la cellule cliquée a la classe 'possible-move'
    if (clickedCell.classList.contains('possible-move')) {
        // Retirer le joueur actif de sa position actuelle
        const currentPlayerPosition = activePlayer === 'playerA' ? player1Position : player2Position;
        cells[currentPlayerPosition].classList.remove(activePlayer);

        // Mettre à jour la position du joueur actif
        if (activePlayer === 'playerA') {
            player1Position = cellIndex;
        } else {
            player2Position = cellIndex;
        }

        // Ajouter le joueur actif à sa nouvelle position
        clickedCell.classList.add(activePlayer);

        // Réinitialiser les classes 'possible-move'
        cells.forEach(cell => cell.classList.remove('possible-move'));

        // Basculer vers l'autre joueur
        activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
        document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
    }
}
