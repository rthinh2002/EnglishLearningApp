class Card {
    constructor ({
        wordInformation,
        isErase,
    }) {
        this.isErase = isErase;
        this.wordInformation = wordInformation;
        this.init();
    }

    // Private Properties
    startPoint; offsetX; offsetY; currentCorrectDefinitionDirection;

    // Method to generate a new card
    init = () => {
        var rand = Math.floor(Math.random() * 2);

        const left_card = document.querySelector('#text-box-left');
        const right_card = document.querySelector('#text-box-right');
        if(rand === 1) {
            left_card.innerHTML = this.wordInformation.definition;
            right_card.innerHTML = this.wordInformation.decoy_definition;
            this.currentCorrectDefinitionDirection = 1;
        } else {
            right_card.innerHTML = this.wordInformation.definition;
            left_card.innerHTML = this.wordInformation.decoy_definition;
            this.currentCorrectDefinitionDirection = -1;
        }
        const card = document.createElement('div');
        card.classList.add('card');

        const header = document.createElement('h1');
        header.classList.add('word');
        header.innerHTML = this.wordInformation.word;

        const wordInfo = document.createElement('div');
        wordInfo.classList.add('word-information');

        if(this.wordInformation.example != undefined) {
            const example = document.createElement('p');
            example.innerHTML = 'Example:';
            const example_detail = document.createElement('p');
            example_detail.classList.add('text-indent');
            example_detail.innerHTML = this.wordInformation.example;
            wordInfo.append(example, example_detail, document.createElement('br'));
        }

        if(this.wordInformation.origin != undefined) {
            const origin = document.createElement('p');
            origin.innerHTML = 'Origin:';
            const origin_detail = document.createElement('p');
            origin_detail.classList.add('text-indent');
            origin_detail.innerHTML = this.wordInformation.origin;
            wordInfo.append(origin, origin_detail, document.createElement('br'));
        }

        if(this.wordInformation.synonym != "NULL") {
            const synonym = document.createElement('p');
            synonym.innerHTML = 'Synonym:';
            const synonym_detail = document.createElement('p');
            synonym_detail.classList.add('text-indent');
            synonym_detail.innerHTML = this.wordInformation.synonym;
            wordInfo.append(synonym, synonym_detail, document.createElement('br'));
        }

        if(this.wordInformation.antonym != "NULL") {
            const antonym = document.createElement('p');
            antonym.innerHTML = 'Antonym:';
            const antonym_detail = document.createElement('p');
            antonym_detail.classList.add('text-indent');
            antonym_detail.innerHTML = this.wordInformation.antonym;
            wordInfo.append(antonym, antonym_detail, document.createElement('br'));
        }

        const synonyms = document.createElement('p');
        synonyms.innerHTML = 'Synonyms:';

        // JSON information words
        const reading = document.createElement('p');
        reading.innerHTML = this.wordInformation.phonetic;

        const origin_detail = document.createElement('p');
        origin_detail.classList.add('text-indent');
        origin_detail.innerHTML = this.wordInformation.origin;

        // Append
        card.append(header, reading, document.createElement('br'),
        wordInfo);
        this.element = card;
        this.listenToMouseEvents();
    }

    // Mouse down
    listenToMouseEvents = () => {
        this.element.addEventListener('mousedown', (e) => {
        const { clientX, clientY } = e;
        this.startPoint = { x: clientX, y: clientY }
        document.addEventListener('mousemove', this.handleMouseMove);
        this.element.style.transition = 'transform 0s';
        });

        document.addEventListener('mouseup', this.handleMoveUp);

        // Stop card dragging
        this.element.addEventListener('dragstart', (e) => {
        e.preventDefault();
        });
    }

    // Dragging card
    handleMove = (x, y) => {
        this.offsetX = x - this.startPoint.x;
        this.offsetY = y - this.startPoint.y;
        const rotate = this.offsetX * 0.1;
        this.element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${rotate}deg)`;
        // clear card when users drag too far
        if (Math.abs(this.offsetX) > this.element.clientWidth * 1.2) {
        this.clearCard(this.offsetX > 0 ? 1 : -1);
        }
    }

    // handling mouse movement
    handleMouseMove = (e) => {
        e.preventDefault();
        if (!this.startPoint) return;
        const { clientX, clientY } = e;
        this.handleMove(clientX, clientY);
    }

    // When mouse clicked up
    handleMoveUp = () => {
        this.startPoint = null;
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.element.style.transform = '';
    }

    // Functions to erase cards
    clearCard = (direction) => {
        this.startPoint = null;
        document.removeEventListener('mouseup', this.handleMoveUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('touchmove', this.handleTouchMove);
        this.element.style.transition = 'transform 1s';
        this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.offsetY}px) rotate(${90 * direction}deg)`;
        this.element.classList.add('dismissing');
        setTimeout(() => {
        this.element.remove();
        }, 1000);

        if(typeof this.isErase === 'function') {
            this.isErase();
        }

        if(direction != this.currentCorrectDefinitionDirection) { // Trigger swiping to the left
            console.log("Correct");
            document.querySelector('#streak-content').innerHTML++;
            var curStreak = document.querySelector('#streak-content').innerHTML;
            var maxStreak = document.querySelector('#mxStk').innerHTML;
            if(parseInt(curStreak) > parseInt(maxStreak)){
                document.querySelector('#mxStk').innerHTML = curStreak;
            }
        } else {
            console.log("Incorrect");
            document.querySelector('#streak-content').innerHTML = 0;
            document.querySelector('#cross' + document.querySelector('#life').innerHTML).remove();
            document.querySelector('#life').innerHTML--;
            console.log(document.querySelector('#life').innerHTML);
            if(document.querySelector('#life').innerHTML == '0') {
                console.log('Game Over');
                var maxStreak = document.querySelector('#mxStk').innerHTML;
                newStreak(parseInt(maxStreak));
            }
            
        }
    }
}



function newStreak(streak){
    var lastTime = (new Date()).getTime();
    var history = JSON.parse(window.localStorage.getItem('history'));

    if(history != null && history.length >= 10){
        history.shift();
    }

    var savedJson = {"streak":streak, "lastTime":lastTime};
    if(history == null) history = [];

    history.push(savedJson);

    window.localStorage.setItem('history', JSON.stringify(history));

    var bestScore = window.localStorage.getItem('best');
    if(bestScore == null|| streak > parseInt(bestScore)){
        window.localStorage.setItem('best', JSON.stringify(streak));
    }

    window.location = '/GameOver.html?streak=' + encodeURIComponent(streak);
};
