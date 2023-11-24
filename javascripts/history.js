var btn = document.querySelector('#goBc');
btn.onclick = function(){
    window.location.pathname = 'main.html'
}


function loadHistory(){
    var highScoreDiv = document.querySelector('#Hs');
    var highScore = window.localStorage.getItem('best');
    if(highScore == null) return;
    highScoreDiv.innerHTML = highScore;


    var history = JSON.parse(window.localStorage.getItem('history'));
    if(history == null) return;


    var prevGamesDiv = document.querySelector('#prevGames');
    prevGamesDiv.innerHTML = "";
    var curTime = (new Date()).getTime();
    for(let i = 0; i < history.length; i++){
        var lastTime = history[i].lastTime;
        var timeDiff = curTime - lastTime;
        timeDiff = timeDiff/1000;

        var timeSince = timeSinceLast(timeDiff);
        var tmpStr = getOutputStr(timeSince);

        var row = document.createElement('div');
        row.classList.add('row');

        var time = document.createElement('div');
        time.classList.add('time');

        var score = document.createElement('div');
        score.classList.add('score');

        time.innerHTML = tmpStr;
        score.innerHTML = history[i].streak;

        row.appendChild(time);
        row.appendChild(score);
        prevGamesDiv.appendChild(row);
    }
}

function getOutputStr(timeSince){
    var outputString = "";
    for(var timeType in timeSince){
        if(timeSince[timeType] != 0){
            outputString = String(timeSince[timeType]) + " " + timeType;
            if(timeSince[timeType] > 1){
                outputString += "s ";
            }
            else{
                outputString += " ";
            }
            outputString +=  "ago";
            break;
        }
    }

    if(outputString == ""){
        outputString = "not long ago";
    }


    return outputString;
}

function timeSinceLast(timeDiff){
    var minutes = Math.floor(timeDiff / 60);
    var hours = 0;
    if(minutes >= 60){
        hours = Math.floor(minutes / 60);
        minutes = minutes - (60 * hours);
    }

    var days = 0;
    if(hours >= 24){
        days = Math.floor(hours / 24);
        hours = hours - (24 * days);
    }

    var months = 0;
    if(days >= 30){
        months = Math.floor(days / 30);
        days = days - (30 * months);
    }

    var years = 0;
    if(months >= 12){
        years = Math.floor(months / 12);
        months = months - (12 * years);
    }

    return {"year":years,"month":months,"day":days,"hour":hours,"minute":minutes};
};