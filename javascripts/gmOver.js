const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const streak = urlParams.get('streak');
document.querySelector('#curStk').innerHTML = "Your current streak: " + streak;

var plbtn = document.querySelector('#plAgain');
var scbtn = document.querySelector('#scBoard');

plbtn.onclick = function(){
    window.location.pathname = 'main.html';
}

scbtn.onclick = function(){
    window.location.pathname = 'scoreboard.html';
}