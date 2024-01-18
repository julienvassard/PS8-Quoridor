// Sélectionnez la div wrapper
const wrapper = document.querySelector('.wrapper');
const cells = [];
let activePlayer = 'playerA';
var nbWallPlayerA = 10;
var nbWallPlayerB = 10;
let murAPose = new Array(3);
hideAntiCheat();
hideValider();
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
var tour = 200;
var dernierTourB = false;
cells.forEach((cell, index) => {
    if (cell.classList.contains('odd-row') || cell.classList.contains('odd-col'))
        cell.addEventListener('click', () => handleWall(index));
    else
        cell.addEventListener('click', () => movePlayer(index));
});

function removeWallTmp(clickedCell){
    var bougerMur = false;
    for(let i in murAPose){
        const tmpcell = cells[murAPose[i]];
        tmpcell.classList.remove('wallTMP');
        if(clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col'))
            bougerMur = true;
    }
    return bougerMur;
}

function rotationWall(cellIndex){
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];
    const upCell = cells[cellIndex + 17];
    const downCell = cells[cellIndex - 17];
        if((rightCell.classList.contains('wallTMP') ||leftCell.classList.contains('wallTMP') )&& !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/)){
            murAPose[0] = cellIndex;
            murAPose[1] = cellIndex+17;
            murAPose[2] = cellIndex-17;
            rightCell.classList.remove('wallTMP');
            leftCell.classList.remove('wallTMP');
            upCell.classList.add('wallTMP');
            downCell.classList.add('wallTMP');
        }
        else if((upCell.classList.contains('wallTMP') ||downCell.classList.contains('wallTMP') )&& !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/)){
            console.log('horizontale');
            murAPose[0] = cellIndex;
            murAPose[1] = cellIndex+1;
            murAPose[2] = cellIndex-1;
            upCell.classList.remove('wallTMP');
            downCell.classList.remove('wallTMP');
            rightCell.classList.add('wallTMP');
            leftCell.classList.add('wallTMP');
        }
}
function handleWall(cellIndex) {

    if((activePlayer === 'playerA' && nbWallPlayerA === 0) || (activePlayer === 'playerB' && nbWallPlayerB === 0)){
        alert("Vous n'avez plus de murs !")
        return;
    }

    const row = Math.floor(cellIndex / 17);
    const col = cellIndex % 17;

    const clickedCell = cells[cellIndex];
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];
    const upCell = cells[cellIndex + 17];
    const downCell = cells[cellIndex - 17];
    if(clickedCell.classList.contains("wallTMP") && clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col')){
        return rotationWall(cellIndex);
    }
    var bougerMur = removeWallTmp(clickedCell);
    if(bougerMur && activePlayer === 'playerA') nbWallPlayerA++;
    else if(bougerMur && activePlayer === 'playerB') nbWallPlayerB++;
    var poser = false;

    if( clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && !clickedCell.classList.value.match(/\bwall[AB]\b/) && !rightCell.classList.value.match(/\bwall[AB]\b/)&& !leftCell.classList.value.match(/\bwall[AB]\b/)){
        clickedCell.classList.add('wallTMP');
        murAPose[0] = cellIndex;
        if(col < 16 && !rightCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.contains('odd-row') || rightCell.classList.contains('odd-col')))
            rightCell.classList.add('wallTMP');
        murAPose[1] = cellIndex+1;
        if(col > 0 && !leftCell.classList.value.match(/\bwall[AB]\b/) && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col')))
            leftCell.classList.add('wallTMP');
        murAPose[2] = cellIndex-1;
        poser = true;
    }
    //pour placer en verticale
        else if( (clickedCell.classList.value.match(/\bwall[AB]\b/) && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/))// soit cliquer au milieu d'un mur horizontale qui n'a pas de mur vertical
    ||
        ((rightCell.classList.value.match(/\bwall[AB]\b/) || leftCell.classList.value.match(/\bwall[AB]\b/)) && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/))){// soit cliquer a cote d'un mur horizontale
            clickedCell.classList.add('wallTMP');
            murAPose[0] = cellIndex;
            if(col < 16 && !upCell.classList.value.match(/\bwall[AB]\b/) && (upCell.classList.contains('odd-row') || upCell.classList.contains('odd-col')))
                upCell.classList.add('wallTMP');
            murAPose[1] = cellIndex+17;
            if(col > 0 && !downCell.classList.value.match(/\bwall[AB]\b/) && (downCell.classList.contains('odd-row') || downCell.classList.contains('odd-col')))
                downCell.classList.add('wallTMP');
            murAPose[2] = cellIndex-17;
            poser = true;
        }
        if(poser) {
            showValider();
            if (activePlayer === 'playerA') {
                nbWallPlayerA--;
                document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
            } else if (activePlayer === 'playerB') {
                nbWallPlayerB--;
                document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
            }
        }

}

function changeVisibility(rigthCell,leftCell,player, horizontale){
    rigthCellNumber = rigthCell.getAttribute('id');
    leftCellNumber = leftCell.getAttribute('id');
    if(horizontale) {
        topRightCell = cells[rigthCellNumber - 18];
        botRightCell = cells[parseInt(rigthCellNumber) + 16];
        topLeftCell = cells[leftCellNumber - 18];
        botLeftCell = cells[parseInt(leftCellNumber) + 16];

        topRightCellPlus1 = cells[rigthCellNumber - 52];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) + 50];
        topLeftCellPlus1 = cells[leftCellNumber - 52];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) + 50];
    }
    else{
        topRightCell = cells[parseInt(rigthCellNumber) ]
       botRightCell = cells[parseInt(rigthCellNumber) - 2];
        topLeftCell = cells[parseInt(leftCellNumber) ];
        botLeftCell = cells[parseInt(leftCellNumber) - 2];

        topRightCellPlus1 = cells[parseInt(rigthCellNumber) + 2];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) - 4];
        topLeftCellPlus1 = cells[parseInt(leftCellNumber) + 2];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) - 4];
    }
    if(player == "playerA"){
        topRightCell.setAttribute('visibility',topRightCell.getAttribute('visibility') - 2);
        botRightCell.setAttribute('visibility',botRightCell.getAttribute('visibility') - 2);
        topLeftCell.setAttribute('visibility',topLeftCell.getAttribute('visibility') - 2);
        botLeftCell.setAttribute('visibility',botLeftCell.getAttribute('visibility') - 2);

        if(topRightCellPlus1 != undefined)
            topRightCellPlus1.setAttribute('visibility',topRightCellPlus1.getAttribute('visibility') - 1);
        if(botRightCellPlus1 != undefined)
            botRightCellPlus1.setAttribute('visibility',botRightCellPlus1.getAttribute('visibility') - 1);
        if(topLeftCellPlus1 != undefined)
            topLeftCellPlus1.setAttribute('visibility',topLeftCellPlus1.getAttribute('visibility') - 1);
        if(botLeftCellPlus1 != undefined)
            botLeftCellPlus1.setAttribute('visibility',botLeftCellPlus1.getAttribute('visibility') - 1);
    }else if(player == "playerB"){
        topRightCell.setAttribute('visibility',parseInt(topRightCell.getAttribute('visibility')) + 2);
        botRightCell.setAttribute('visibility',parseInt(botRightCell.getAttribute('visibility')) + 2);
        topLeftCell.setAttribute('visibility',parseInt(topLeftCell.getAttribute('visibility')) + 2);
        botLeftCell.setAttribute('visibility',parseInt(botLeftCell.getAttribute('visibility')) + 2);

        if(topRightCellPlus1 != undefined)
            topRightCellPlus1.setAttribute('visibility',parseInt(topRightCellPlus1.getAttribute('visibility')) + 1);
        if(botRightCellPlus1 != undefined)
            botRightCellPlus1.setAttribute('visibility',parseInt(botRightCellPlus1.getAttribute('visibility')) + 1);
        if(topLeftCellPlus1 != undefined)
            topLeftCellPlus1.setAttribute('visibility',parseInt(topLeftCellPlus1.getAttribute('visibility')) + 1);
        if(botLeftCellPlus1 != undefined)
            botLeftCellPlus1.setAttribute('visibility',parseInt(botLeftCellPlus1.getAttribute('visibility')) + 1);
    }
}

function handleCellClick(cellIndex, position) {
    const validMoves = getValidMoves(position);

    validMoves.forEach(move => {
        const moveCell = cells[move];
        if (!moveCell.classList.contains('playerA') && !moveCell.classList.contains('playerB')) {
            moveCell.classList.add('possible-move');
        }
    });
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
    if (row < 16 && !(cellFoward.classList.value.match(/\bwall[AB]\b/))) moves.push(position + 34);
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

}

function checkCrossing(playerAPosition, playerBPosition) {
    var gagneA =false;
    var gagneB =false;
    for (var i = 0; i < lanePlayerB.length; i++) {
        if (lanePlayerB[i].contains(cells[playerAPosition])) {

            if(dernierTourB) {
                gagneA = true;

            }
            if(!dernierTourB){
                dernierTourB = true;
            }
        }
    }
    for (var i = 0; i < lanePlayerA.length; i++) {
        if (lanePlayerA[i].contains(cells[playerBPosition])) {
                gagneB = true;
        }
    }
    if((gagneA && gagneB )||tour==0) {
        alert("match nul !");
        location.reload(true);
    }
    else if(gagneA){
        alert("Player A a gagné !");
        location.reload(true);
    }
    else if(gagneB){
        alert("Player B a gagné !");
        location.reload(true);
    }
}

function changeActivePlayer() {
    activePlayer = activePlayer === 'playerA' ? 'playerB' : 'playerA';
    document.getElementById('currentPlayer').textContent = `Tour : ${activePlayer}`;
    showAntiCheat();
    activateFog();
    checkCrossing(player1Position, player2Position);
    tour--;
}

function hideAntiCheat() {
    document.querySelector('.anti-cheat').style.display = 'none';
    wrapper.style.display = 'grid';

}
function hideValider() {
    document.querySelector('#validerA').style.display = 'none';
    document.querySelector('#validerB').style.display = 'none';
   murAPose = new Array(3);
}
function showValider() {
    var id = "#valider";
    if(activePlayer === 'playerA')
        id +="A";
    else
        id +="B";
    document.querySelector(id).style.display = 'grid';

}
function validerWall(){
    const clickedCell = cells[murAPose[0]];
    const rightCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    clickedCell.classList.remove('wallTMP');
    rightCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    var mur = 'wall';
    if(activePlayer === 'playerA')
        mur +='A';
    else
        mur +='B';
    clickedCell.classList.add(mur);
    rightCell.classList.add(mur);
    leftCell.classList.add(mur);
    var horizontale = false;
    if(murAPose[1] - murAPose[0] === 1){
        horizontale = true;
    }

    changeVisibility(rightCell, leftCell, activePlayer, horizontale);
    changeActivePlayer();
    hideValider();
}
function annulerWall(){
    const clickedCell = cells[murAPose[0]];
    const rigthCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    clickedCell.classList.remove('wallTMP');
    rigthCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    if(activePlayer === 'playerA'){
        nbWallPlayerA++;
        document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
    }else{
        nbWallPlayerB++;
        document.getElementById('nbWallPlayerB').textContent = `Murs restants : ${nbWallPlayerB}`;
    }

    hideValider();
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


