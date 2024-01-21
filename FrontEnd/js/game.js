// Sélectionnez la div wrapper
const wrapper = document.querySelector('.wrapper');
const cells = [];
let activePlayer = 'playerA';
var nbWallPlayerA = 10;
var nbWallPlayerB = 10;
let isClickedCell = false;
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

    if (!(newDiv.classList.contains('odd-row') || newDiv.classList.contains('odd-col'))) {
        if (i > 0 && i <= 119) {
            newDiv.setAttribute('visibility', '-1');
        } else if (i >= 137 && i <= 153) {
            newDiv.setAttribute('visibility', '0');
        } else if (i >= 171 && i <= 289) {
            newDiv.setAttribute('visibility', '1');
        }
    }

    cells.push(newDiv);
    wrapper.appendChild(newDiv);

}


let player1Position = 8;
let player2Position = 280;
cells[player1Position].classList.add('playerA');
cells[player2Position].classList.add('playerB');


var lanePlayerA = document.getElementsByClassName('top-row');
var lanePlayerB = document.getElementsByClassName('bot-row');


activateFog();
changeVisibilityPlayer(false, player1Position, "playerA");
changeVisibilityPlayer(false, player2Position, "playerB");

var tour = 200;
var dernierTourB = false;

cells.forEach((cell, index) => {
    if (cell.classList.contains('odd-row') || cell.classList.contains('odd-col'))
        cell.addEventListener('click', () => handleWall(index));
    else
        cell.addEventListener('click', () => movePlayer(index));
});

function removeWallTmp(){

    var bougerMur = false;
    for (let i in murAPose) {
        const tmpcell = cells[murAPose[i]];
        if(tmpcell.classList.contains('wallTMP')) {
            tmpcell.classList.remove('wallTMP');

            bougerMur = true;
        }
    }
    return bougerMur;
}

function rotationWall(cellIndex) {
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];
    const upCell = cells[cellIndex + 17];
    const downCell = cells[cellIndex - 17];
        if((rightCell.classList.contains('wallTMP') ||leftCell.classList.contains('wallTMP') )&& !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/)){
            murAPose[0] = cellIndex;
            murAPose[1] = cellIndex-17;
            murAPose[2] = cellIndex+17;
            rightCell.classList.remove('wallTMP');
            leftCell.classList.remove('wallTMP');
            upCell.classList.add('wallTMP');
            downCell.classList.add('wallTMP');
        }
        else if((upCell.classList.contains('wallTMP') ||downCell.classList.contains('wallTMP') )&& !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/)){

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
    if (isClickedCell) {
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    }
    if ((activePlayer === 'playerA' && nbWallPlayerA === 0) || (activePlayer === 'playerB' && nbWallPlayerB === 0)) {
        alert("Vous n'avez plus de murs !")
        return;
    }

    const row = Math.floor(cellIndex / 17);
    const col = cellIndex % 17;

    const clickedCell = cells[cellIndex];
    const rightCell = cells[cellIndex + 1];
    const leftCell = cells[cellIndex - 1];

    const upCell = cells[cellIndex - 17];
    const downCell = cells[cellIndex + 17];
    if(clickedCell.classList.contains("wallTMP") && clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col')){
        return rotationWall(cellIndex);
    }

        var bougerMur = removeWallTmp(clickedCell);
        if (bougerMur && activePlayer === 'playerA') nbWallPlayerA++;
        else if (bougerMur && activePlayer === 'playerB') nbWallPlayerB++;

    var poser = false;
    //pour placer a l'horizontale

    if( (clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && !clickedCell.classList.value.match(/\bwall[AB]\b/) && !rightCell.classList.value.match(/\bwall[AB]\b/)&& !leftCell.classList.value.match(/\bwall[AB]\b/))
    ||
        (clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && ( upCell.classList.value.match(/\bwall[AB]\b/) || downCell.classList.value.match(/\bwall[AB]\b/)) && !rightCell.classList.value.match(/\bwall[AB]\b/) && !leftCell.classList.value.match(/\bwall[AB]\b/))){// soit cliquer a cote d'un mur horizontale


        clickedCell.classList.add('wallTMP');
        murAPose[0] = cellIndex;
        if (col < 16 && !rightCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.contains('odd-row') || rightCell.classList.contains('odd-col')))
            rightCell.classList.add('wallTMP');
        murAPose[1] = cellIndex + 1;
        if (col > 0 && !leftCell.classList.value.match(/\bwall[AB]\b/) && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col')))
            leftCell.classList.add('wallTMP');
        murAPose[2] = cellIndex - 1;
        poser = true;
    }
    //pour placer en verticale

        else if( (clickedCell.classList.value.match(/\bwall[AB]\b/) && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/))// soit cliquer au milieu d'un mur horizontale qui n'a pas de mur vertical
    ||
        (clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col') && (rightCell.classList.value.match(/\bwall[AB]\b/) || leftCell.classList.value.match(/\bwall[AB]\b/)) && !upCell.classList.value.match(/\bwall[AB]\b/) && !downCell.classList.value.match(/\bwall[AB]\b/))){// soit cliquer a cote d'un mur horizontale

            clickedCell.classList.add('wallTMP');
            murAPose[0] = cellIndex;
            if(col < 16 && !upCell.classList.value.match(/\bwall[AB]\b/) && (upCell.classList.contains('odd-row') || upCell.classList.contains('odd-col')))
                upCell.classList.add('wallTMP');
            murAPose[1] = cellIndex-17;
            if(col > 0 && !downCell.classList.value.match(/\bwall[AB]\b/) && (downCell.classList.contains('odd-row') || downCell.classList.contains('odd-col')))
                downCell.classList.add('wallTMP');
            murAPose[2] = cellIndex+17;
            poser = true;
        }

        else if(clickedCell.classList.contains('odd-row') && !clickedCell.classList.contains('odd-col')) //la cellule est une ligne
        {
            //horizontale a droite
            if(!cells[cellIndex+2].classList.value.match(/\bwall[AB]\b/)  && cells[cellIndex+2].classList.contains('odd-row') ){

                clickedCell.classList.add('wallTMP');
                murAPose[0] = cellIndex;
                if(col < 16 && !rightCell.classList.value.match(/\bwall[AB]\b/) && (rightCell.classList.contains('odd-row') || rightCell.classList.contains('odd-col')))
                    rightCell.classList.add('wallTMP');
                murAPose[1] = cellIndex+1;
                if(!cells[cellIndex+2].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex+2].classList.contains('odd-row') || cells[cellIndex+2].classList.contains('odd-col')))
                    cells[cellIndex+2].classList.add('wallTMP');
                murAPose[2] = cellIndex+2;
                poser = true;

            }
            //horizontale a gauche
            else if(!cells[cellIndex- 2].classList.value.match(/\bwall[AB]\b/) && cells[cellIndex-2].classList.contains('odd-row')){
               
                clickedCell.classList.add('wallTMP');
                murAPose[0] = cellIndex;
               if(!cells[cellIndex- 2].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex- 2].classList.contains('odd-row') || cells[cellIndex- 2].classList.contains('odd-col')))
                    cells[cellIndex- 2].classList.add('wallTMP');
                murAPose[1] = cellIndex-2;
                if(col > 0 && !leftCell.classList.value.match(/\bwall[AB]\b/) && (leftCell.classList.contains('odd-row') || leftCell.classList.contains('odd-col')))
                    leftCell.classList.add('wallTMP');
                murAPose[2] = cellIndex-1;
                poser = true;

        }
        }
        else if(!clickedCell.classList.contains('odd-row') && clickedCell.classList.contains('odd-col')) //la cellule est une colonne
        {
            if(cells[cellIndex-34] != undefined && !cells[cellIndex-34].classList.value.match(/\bwall[AB]\b/)  && cells[cellIndex-34].classList.contains('odd-col') ){
                //verticale haut
                clickedCell.classList.add('wallTMP');
                murAPose[2] = cellIndex;
                if(!cells[cellIndex- 34].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex- 34].classList.contains('odd-row') || cells[cellIndex- 34].classList.contains('odd-col')))
                    cells[cellIndex- 34].classList.add('wallTMP');
                murAPose[1] = cellIndex-34;
                if(col > 0 && !upCell.classList.value.match(/\bwall[AB]\b/) && (upCell.classList.contains('odd-row') || upCell.classList.contains('odd-col')))
                    upCell.classList.add('wallTMP');
                murAPose[0] = cellIndex-17;
                poser = true;
            }
            else if( cells[cellIndex+34] != undefined &&!cells[cellIndex+34].classList.value.match(/\bwall[AB]\b/)  && cells[cellIndex+34].classList.contains('odd-col') ){
                //verticale bas
                clickedCell.classList.add('wallTMP');
                murAPose[1] = cellIndex;
                if(!cells[cellIndex+ 34].classList.value.match(/\bwall[AB]\b/) && (cells[cellIndex+ 34].classList.contains('odd-row') || cells[cellIndex+ 34].classList.contains('odd-col')))
                    cells[cellIndex+ 34].classList.add('wallTMP');
                murAPose[2] = cellIndex+34;
                if(col > 0 && !downCell.classList.value.match(/\bwall[AB]\b/) && (downCell.classList.contains('odd-row') || downCell.classList.contains('odd-col')))
                    downCell.classList.add('wallTMP');
                murAPose[0] = cellIndex+17;
                poser = true;
            }
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

function changeVisibility(rigthCell, leftCell, player, horizontale) {
    rigthCellNumber = rigthCell.getAttribute('id');
    leftCellNumber = leftCell.getAttribute('id');
    if (horizontale) {
        topRightCell = cells[rigthCellNumber - 18];
        botRightCell = cells[parseInt(rigthCellNumber) + 16];
        topLeftCell = cells[leftCellNumber - 18];
        botLeftCell = cells[parseInt(leftCellNumber) + 16];

        topRightCellPlus1 = cells[rigthCellNumber - 52];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) + 50];
        topLeftCellPlus1 = cells[leftCellNumber - 52];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) + 50];
    } else {
        topRightCell = cells[parseInt(rigthCellNumber)]
        botRightCell = cells[parseInt(rigthCellNumber) - 2];
        topLeftCell = cells[parseInt(leftCellNumber)];
        botLeftCell = cells[parseInt(leftCellNumber) - 2];

        topRightCellPlus1 = cells[parseInt(rigthCellNumber) + 2];
        botRightCellPlus1 = cells[parseInt(rigthCellNumber) - 4];
        topLeftCellPlus1 = cells[parseInt(leftCellNumber) + 2];
        botLeftCellPlus1 = cells[parseInt(leftCellNumber) - 4];
        console.log(parseInt(rigthCellNumber) + " " + (parseInt(rigthCellNumber) - 2) +" " + parseInt(leftCellNumber))
    }
    if(player == "playerA"){

        if(topRightCell != undefined && topRightCell.hasAttribute('visibility'))
            topRightCell.setAttribute('visibility',topRightCell.getAttribute('visibility') - 2);
        if(botRightCell != undefined && botRightCell.hasAttribute('visibility'))
            botRightCell.setAttribute('visibility',botRightCell.getAttribute('visibility') - 2);
        if(topLeftCell != undefined && topLeftCell.hasAttribute('visibility'))
            topLeftCell.setAttribute('visibility',topLeftCell.getAttribute('visibility') - 2);
        if(botLeftCell != undefined && botLeftCell.hasAttribute('visibility'))
            botLeftCell.setAttribute('visibility',botLeftCell.getAttribute('visibility') - 2);

        if(topRightCellPlus1 != undefined && topRightCellPlus1.hasAttribute('visibility'))
            topRightCellPlus1.setAttribute('visibility',topRightCellPlus1.getAttribute('visibility') - 1);
        if(botRightCellPlus1 != undefined && botRightCellPlus1.hasAttribute('visibility'))
            botRightCellPlus1.setAttribute('visibility',botRightCellPlus1.getAttribute('visibility') - 1);
        if(topLeftCellPlus1 != undefined && topLeftCellPlus1.hasAttribute('visibility'))
            topLeftCellPlus1.setAttribute('visibility',topLeftCellPlus1.getAttribute('visibility') - 1);
        if(botLeftCellPlus1 != undefined && botLeftCellPlus1.hasAttribute('visibility'))
            botLeftCellPlus1.setAttribute('visibility',botLeftCellPlus1.getAttribute('visibility') - 1);

    }else if(player == "playerB"){
        if(topRightCell != undefined && topRightCell.hasAttribute('visibility'))
            topRightCell.setAttribute('visibility',parseInt(topRightCell.getAttribute('visibility')) + 2);
        if(botRightCell != undefined && botRightCell.hasAttribute('visibility'))
            botRightCell.setAttribute('visibility',parseInt(botRightCell.getAttribute('visibility')) + 2);
        if(topLeftCell != undefined && topLeftCell.hasAttribute('visibility'))
            topLeftCell.setAttribute('visibility',parseInt(topLeftCell.getAttribute('visibility')) + 2);
        if(botLeftCell != undefined && botLeftCell.hasAttribute('visibility'))
            botLeftCell.setAttribute('visibility',parseInt(botLeftCell.getAttribute('visibility')) + 2);

        if(topRightCellPlus1 != undefined && topRightCellPlus1.hasAttribute('visibility'))
            topRightCellPlus1.setAttribute('visibility',parseInt(topRightCellPlus1.getAttribute('visibility')) + 1);
        if(botRightCellPlus1 != undefined && botRightCellPlus1.hasAttribute('visibility'))
            botRightCellPlus1.setAttribute('visibility',parseInt(botRightCellPlus1.getAttribute('visibility')) + 1);
        if(topLeftCellPlus1 != undefined && topLeftCellPlus1.hasAttribute('visibility'))
            topLeftCellPlus1.setAttribute('visibility',parseInt(topLeftCellPlus1.getAttribute('visibility')) + 1);
        if(botLeftCellPlus1 != undefined && botLeftCellPlus1.hasAttribute('visibility'))
            botLeftCellPlus1.setAttribute('visibility',parseInt(botLeftCellPlus1.getAttribute('visibility')) + 1);
        }
    }


function changeVisibilityPlayer(remove,position,player){

    cellPlayer = cells[position];
    cellLeft = cells[position - 2];
    cellRight = cells[position + 2];
    cellTop = cells[position - 34];
    cellBot = cells[position + 34];
    if (remove === true) {
        if (player === 'playerA') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) + 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/))) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) + 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/))) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) + 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/))) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) + 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/))) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) + 1);
            }
        } else if (player === 'playerB') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) - 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/))) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) - 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/))) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) - 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/))) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) - 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/))) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) - 1);
            }
        }

    } else if (remove === false) {
        if (player === 'playerA') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) - 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/))) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) - 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/))) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) - 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/))) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) - 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/))) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) - 1);
            }
        } else if (player === 'playerB') {
            cellPlayer.setAttribute('visibility', parseInt(cellPlayer.getAttribute('visibility')) + 1);
            if (cellLeft !== undefined && !(cells[position - 1].classList.value.match(/\bwall[AB]\b/))) {
                cellLeft.setAttribute('visibility', parseInt(cellLeft.getAttribute('visibility')) + 1);
            }
            if (cellRight !== undefined && !(cells[position + 1].classList.value.match(/\bwall[AB]\b/))) {
                cellRight.setAttribute('visibility', parseInt(cellRight.getAttribute('visibility')) + 1);
            }
            if (cellTop !== undefined && !(cells[position - 17].classList.value.match(/\bwall[AB]\b/))) {
                cellTop.setAttribute('visibility', parseInt(cellTop.getAttribute('visibility')) + 1);
            }
            if (cellBot !== undefined && !(cells[position + 17].classList.value.match(/\bwall[AB]\b/))) {
                cellBot.setAttribute('visibility', parseInt(cellBot.getAttribute('visibility')) + 1);
            }
        }
    }
}

function handleCellClick(cellIndex, position) {
    const validMoves = getValidMoves(position);
    if (isClickedCell) {
        cells.forEach(cell => cell.classList.remove('possible-move'));
        isClickedCell = false;
    } else {
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
    const cellBackward = cells[position - 17];
    const cellLeft = cells[position - 1];
    const cellRight = cells[position + 1];


    //deplacement par dessus le joueur
    if (row > 0 && cells[position - 34].classList.value.match(/\bplayer[AB]\b/) ) moves.push(position - 68);
    if (row < 16 && cells[position + 34].classList.value.match(/\bplayer[AB]\b/)) moves.push(position + 68);
    if (col > 0 && cells[position - 2].classList.value.match(/\bplayer[AB]\b/)) moves.push(position - 4);
    if (col < 16 && cells[position + 2].classList.value.match(/\bplayer[AB]\b/)) moves.push(position + 4);


    // Déplacements horizontaux et verticaux
    if (row > 0 && !(cellBackward.classList.value.match(/\bwall[AB]\b/))) moves.push(position - 34);
    if (row < 16 && !(cellFoward.classList.value.match(/\bwall[AB]\b/))) moves.push(position + 34);
    if (col > 0 && !(cellLeft.classList.value.match(/\bwall[AB]\b/))) moves.push(position - 2);
    if (col < 16 && !(cellRight.classList.value.match(/\bwall[AB]\b/))) moves.push(position + 2);

    return moves;
}

function movePlayer(cellIndex) {
    if(murAPose[0]!=undefined){
        annulerWall();
    }

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
        changeVisibilityPlayer(true, currentPlayerPosition, activePlayer);

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
        isClickedCell = false;

        // Basculer vers l'autre joueur
        changeVisibilityPlayer(false, activePlayer === 'playerA' ? player1Position : player2Position, activePlayer);
        changeActivePlayer();
    }

}

function checkCrossing(playerAPosition, playerBPosition) {
    var gagneA = false;
    var gagneB = false;
    for (var i = 0; i < lanePlayerB.length; i++) {
        if (lanePlayerB[i].contains(cells[playerAPosition])) {

            if (dernierTourB) {
                gagneA = true;

            }
            if (!dernierTourB) {
                dernierTourB = true;
            }
        }
    }
    for (var i = 0; i < lanePlayerA.length; i++) {
        if (lanePlayerA[i].contains(cells[playerBPosition])) {
            gagneB = true;
        }
    }
    if ((gagneA && gagneB) || tour == 0) {
        alert("match nul !");
        location.reload(true);
    } else if (gagneA) {
        alert("Player A a gagné !");
        location.reload(true);
    } else if (gagneB) {
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
    if (activePlayer === 'playerA')
        id += "A";
    else
        id += "B";
    document.querySelector(id).style.display = 'grid';

}

function validerWall() {
    const clickedCell = cells[murAPose[0]];
    const rightCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    clickedCell.classList.remove('wallTMP');
    rightCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    var mur = 'wall';
    if (activePlayer === 'playerA')
        mur += 'A';
    else
        mur += 'B';
    clickedCell.classList.add(mur);
    rightCell.classList.add(mur);
    leftCell.classList.add(mur);
    var horizontale = false;
    if (murAPose[1] - murAPose[0] === 1) {
        horizontale = true;
    }

    changeVisibility(rightCell, leftCell, activePlayer, horizontale);
    changeActivePlayer();
    hideValider();
}

function annulerWall() {
    const clickedCell = cells[murAPose[0]];
    const rigthCell = cells[murAPose[1]];
    const leftCell = cells[murAPose[2]];

    clickedCell.classList.remove('wallTMP');
    rigthCell.classList.remove('wallTMP');
    leftCell.classList.remove('wallTMP');
    if (activePlayer === 'playerA') {
        nbWallPlayerA++;
        document.getElementById('nbWallPlayerA').textContent = `Murs restants : ${nbWallPlayerA}`;
    } else {
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
    if (activePlayer == "playerA") {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].getAttribute('visibility') <= "0") {
                cells[i].classList.remove('fog');
            }
            if (parseInt(cells[i].getAttribute('id')) - 1 === player1Position) {
                cells[i].classList.add('playerA');
                cells[i].classList.remove('playerAFog');
            }
            if (cells[i].getAttribute('visibility') > "0") {
                cells[i].classList.add('fog');
                if (cells[i].classList.contains('playerB') && cells[i].classList.contains('fog')) {
                    cells[i].classList.remove('playerB');
                    cells[i].classList.add('playerBFog');
                }
            }
        }
    } else if (activePlayer == "playerB") {
        for (let i = 0; i < cells.length; i++) {
            if (parseInt(cells[i].getAttribute('id')) - 1 === player2Position) {
                cells[i].classList.add('playerB');
                cells[i].classList.remove('playerBFog');
            }
            if (cells[i].getAttribute('visibility') >= "0") {
                cells[i].classList.remove('fog');
            }
            if (cells[i].getAttribute('visibility') < "0") {
                cells[i].classList.add('fog');
                if (cells[i].classList.contains('playerA') && cells[i].classList.contains('fog')) {
                    cells[i].classList.remove('playerA');
                    cells[i].classList.add('playerAFog');
                }
            }
        }
    }
}