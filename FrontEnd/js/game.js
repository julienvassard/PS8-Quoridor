// Sélectionnez la div wrapper
const wrapper = document.querySelector('.wrapper');
const cells = [];
let activePlayer = 'playerA';
var nbWallPlayerA = 10;
var nbWallPlayerB = 10;
let isClickedCell = false;
hideAntiCheat();

// Générez les 81 div et ajoutez-les à la div wrapper
for (var i = 1; i <= 289; i++) {
    var newDiv = document.createElement('div');
    newDiv.textContent = ' ';
    if (i > 0 && i < 18) {
        if (!(i % 2 === 0))
            newDiv.classList.add('top-row');
    } else if (i > 272 && i <= 289) {
        if (!(i % 2 === 0))
            newDiv.classList.add('bot-row');
    }
    if (!(Math.floor((i - 1) / 17) % 2 === 0)) {
        newDiv.classList.add('odd-row');
    }
    if (!(Math.floor((i - 1) % 17) % 2 === 0)) {
        newDiv.classList.add('odd-col');
    } else if (!(newDiv.classList.contains('odd-row'))) {
        newDiv.classList.add('cell');
    }
    newDiv.setAttribute('id', i);

    if(!(newDiv.classList.contains('odd-row') || newDiv.classList.contains('odd-col'))){
        if(i > 0 && i <= 119){
            newDiv.setAttribute('visibility','-1');
        }else if(i>=137 && i<= 153){
            newDiv.setAttribute('visibility','0');
        }else if (i>=171 && i<= 289){
            newDiv.setAttribute('visibility','1');
        }
    }

    cells.push(newDiv);
    wrapper.appendChild(newDiv);

}

activateFog();

let player1Position = 8;
let player2Position = 280;
cells[player1Position].classList.add('playerA');
cells[player2Position].classList.add('playerB');

var lanePlayerA = document.getElementsByClassName('top-row');
var lanePlayerB = document.getElementsByClassName('bot-row');

cells.forEach((cell, index) => {
    if (cell.classList.contains('odd-row') || cell.classList.contains('odd-col'))
        cell.addEventListener('click', () => handleWall(index));
    else
        cell.addEventListener('click', () => movePlayer(index));
});

function handleWall(cellIndex) {
    if(isClickedCell){
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    }
    if((activePlayer === 'playerA' && nbWallPlayerA === 0) || (activePlayer === 'playerB' && nbWallPlayerB === 0)){
        alert("Vous n'avez plus de murs !")
        return;
    }
    cellIndex = cellIndex;
    const row = Math.floor(cellIndex / 17);
    const col = cellIndex % 17;

    const clickedCell = cells[cellIndex];
    const rigthCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];

    if(clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col')){
        clickedCell.classList.add('wall');
        if(col < 16 && !rigthCell.classList.contains('wall') && (rigthCell.classList.contains('odd-row') || rigthCell.classList.contains('odd-col')))
            rigthCell.classList.add('wall');
        if(col > 0 && !leftCell.classList.contains('wall') && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col')))
            leftCell.classList.add('wall');
        if(activePlayer === 'playerA'){
            nbWallPlayerA--;
            document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
            changeVisibility(rigthCell,leftCell,"playerA");
            changeActivePlayer();
        }else if(activePlayer === 'playerB'){
            nbWallPlayerB--;
            document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
            changeVisibility(rigthCell,leftCell,"playerB");
            changeActivePlayer();
        }

    }

}

function changeVisibility(rigthCell,leftCell,player){
    rigthCellNumber = rigthCell.getAttribute('id');
    leftCellNumber = leftCell.getAttribute('id');
    topRightCell = cells[rigthCellNumber - 18];
    botRightCell = cells[parseInt(rigthCellNumber) + 16];
    topLeftCell = cells[leftCellNumber - 18];
    botLeftCell = cells[parseInt(leftCellNumber) + 16];

    topRightCellPlus1 = cells[rigthCellNumber - 52];
    botRightCellPlus1 = cells[parseInt(rigthCellNumber) + 50];
    topLeftCellPlus1 = cells[leftCellNumber - 52];
    botLeftCellPlus1 = cells[parseInt(leftCellNumber) + 50];

    if(player == "playerA"){
        topRightCell.setAttribute('visibility',topRightCell.getAttribute('visibility') - 2);
        botRightCell.setAttribute('visibility',botRightCell.getAttribute('visibility') - 2);
        topLeftCell.setAttribute('visibility',topLeftCell.getAttribute('visibility') - 2);
        botLeftCell.setAttribute('visibility',botLeftCell.getAttribute('visibility') - 2);

        topRightCellPlus1.setAttribute('visibility',topRightCellPlus1.getAttribute('visibility') - 1);
        botRightCellPlus1.setAttribute('visibility',botRightCellPlus1.getAttribute('visibility') - 1);
        topLeftCellPlus1.setAttribute('visibility',topLeftCellPlus1.getAttribute('visibility') - 1);
        botLeftCellPlus1.setAttribute('visibility',botLeftCellPlus1.getAttribute('visibility') - 1);
    }else if(player == "playerB"){
        topRightCell.setAttribute('visibility',parseInt(topRightCell.getAttribute('visibility')) + 2);
        botRightCell.setAttribute('visibility',parseInt(botRightCell.getAttribute('visibility')) + 2);
        topLeftCell.setAttribute('visibility',parseInt(topLeftCell.getAttribute('visibility')) + 2);
        botLeftCell.setAttribute('visibility',parseInt(botLeftCell.getAttribute('visibility')) + 2);

        topRightCellPlus1.setAttribute('visibility',parseInt(topRightCellPlus1.getAttribute('visibility')) + 1);
        botRightCellPlus1.setAttribute('visibility',parseInt(botRightCellPlus1.getAttribute('visibility')) + 1);
        topLeftCellPlus1.setAttribute('visibility',parseInt(topLeftCellPlus1.getAttribute('visibility')) + 1);
        botLeftCellPlus1.setAttribute('visibility',parseInt(botLeftCellPlus1.getAttribute('visibility')) + 1);
    }
}

function handleCellClick(cellIndex, position) {
    const validMoves = getValidMoves(position);
    if(isClickedCell){
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    }
    else{
        validMoves.forEach(move => {
            const moveCell = cells[move];
            if (!moveCell.classList.contains('playerA') && !moveCell.classList.contains('playerB')) {
                moveCell.classList.add('possible-move');
                isClickedCell = true;
            }
        });
    }
}

function getValidMoves(position) {
    const row = Math.floor(position / 17);
    const col = position % 17;
    const moves = [];

    console.log("Row : " + row);
    console.log("Col : " + col);

    const cellFoward = cells[position + 17];


    // Déplacements horizontaux et verticaux
    if (row > 0) moves.push(position - 34);
    if (row < 16 && !(cellFoward.classList.contains('wall'))) moves.push(position + 34);
    if (col > 0) moves.push(position - 2);
    if (col < 16) moves.push(position + 2);

    return moves;
}

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
        changeActivePlayer();

    }
    checkCrossing(player1Position, player2Position);
}

function checkCrossing(playerAPosition, playerBPosition) {
    for (var i = 0; i < lanePlayerB.length; i++) {
        if (lanePlayerB[i].contains(cells[playerAPosition])) {
            alert("Player A a gagné !")
        }
    }
    for (var i = 0; i < lanePlayerA.length; i++) {
        if (lanePlayerA[i].contains(cells[playerBPosition])) {
            alert("Player B a gagné !")
        }
    }
}

function changeActivePlayer() {
    activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
    document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
    showAntiCheat();
    activateFog();
}

function hideAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'none';
    wrapper.style.display = 'grid';
}

function showAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'grid';
    wrapper.style.display = 'none';
}

function activateFog() {
    if(activePlayer == "playerA"){
        for (let i= 0;i<cells.length;i++){
            if(cells[i].getAttribute('visibility') <= "0"){
                cells[i].classList.remove('fog');
            }
            if(cells[i].getAttribute('visibility') > "0"){
                cells[i].classList.add('fog');
            }
        }
    }else if(activePlayer == "playerB"){
        for (let i= 0;i<cells.length;i++){
            if(cells[i].getAttribute('visibility') >= "0"){
                cells[i].classList.remove('fog');
            }
            if(cells[i].getAttribute('visibility') < "0"){
                cells[i].classList.add('fog');
            }
        }
    }
}


