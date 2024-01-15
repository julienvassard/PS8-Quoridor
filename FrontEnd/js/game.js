// Sélectionnez la div wrapper
var wrapper = document.querySelector('.wrapper');

// Générez les 81 div et ajoutez-les à la div wrapper
for (var i = 1; i <= 81; i++) {
    var newDiv = document.createElement('div');
    newDiv.textContent = ' ';
    newDiv.classList.add('cell' + i);
    if((i >= 0 && i <= 9) || (i >= 73 && i <= 81)) {
        newDiv.style.backgroundColor = 'rgba(83,83,83,0.91)';
    }
    if(i >= 0 && i <= 36){
        newDiv.setAttribute("visibility","-1");
    }
    if(i >= 46 && i <= 81){
        newDiv.setAttribute("visibility","1");
    }
    if(i >= 37 && i <= 45){
        newDiv.setAttribute("visibility","0");
    }
    wrapper.appendChild(newDiv);
}