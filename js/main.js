// Define global variables
let cardDeck = [
    "anchor", "anchor", "beer", "beer",
    "bomb", "bomb", "heart", "heart",
    "leaf", "leaf", "paw", "paw",
    "rocket", "rocket", "umbrella", "umbrella"
];
let openCards = [];
let movesTaken = 0;
let timer = 0;
    let minutes = 0;
    let seconds = 0;

let clock = document.querySelector(".clock");
let container = document.querySelector(".container");
let deck = document.querySelector(".deck");
let moves = document.querySelector(".moves");
let restart = document.querySelector(".restart");
let stars = document.querySelector(".stars");


// Create card HTML from template
function createCard(card) {
    return `<li class="card" data-type="${card}">
                <i class="fa fa-${card}"></i>
            </li>`;
}

// Create star HTML from template
function createStar(num) {
    return `<li><i class="fa fa-star"></i></li>`.repeat(num);
}

// Initialize game board and reset counters
function dealCards() {
    
    // Clear previous game board
    while (deck.firstChild) deck.removeChild(deck.firstChild);

    // Create new, randomized game board
    let shuffledDeck = shuffle(cardDeck);
    let cardHTML = shuffledDeck.map(function(card) {
        return createCard(card);
    })
    deck.innerHTML = cardHTML.join(``);
    stars.innerHTML = createStar(3);
    addGameInteractions();

    // Reset counters
    openCards.splice(0, openCards.length);
    movesTaken = 0;
    moves.textContent = `${movesTaken}`;
    stopTimer();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Add event listeners to board creation
function addGameInteractions() {

    // Add single event listener for gameboard interactions
    deck.addEventListener("click", function(evt) {

        // Check if event target is a face-down card
        if (openCards.length < 2
                && evt.target.classList.contains("card")
                && !evt.target.classList.contains("match")
                && !evt.target.classList.contains("open")) {

            // If so, turn card face-up
            evt.target.classList.add("open", "show");
            openCards.push(evt.target);

            // Start timer
            if (timer == 0) {
                startTimer();
            }

            // Once two are shown...
            if (openCards.length == 2) {processMatch()}
        }
    })

    // Add single event listener for re-initializing game
    container.addEventListener("click", function(evt) {
        if (evt.target.classList.contains("restart")) {
            dealCards();
        }
    })
}

// Confirm match and clear non-match
function processMatch() {

    // Set match to remain open
    if (openCards[0].dataset.type
        == openCards[1].dataset.type) {
        openCards[0].classList.add("match");
        openCards[1].classList.add("match");
        openCards[0].classList.remove("open", "show");
        openCards[1].classList.remove("open", "show");

        // Empty array without hoisting
        openCards.splice(0, openCards.length);

        // Increment move counter and adjust rating
        countMoves();

    // Set non-match to flip over after delay
    } else {
        setTimeout(function() {
            openCards[0].classList.remove("open", "show");
            openCards[1].classList.remove("open", "show");
            openCards.splice(0, openCards.length);
        }, 500);
        countMoves();
    }
}

function countMoves() {
    movesTaken += 1;
    moves.textContent = `${movesTaken}`;

    // Remove stars after 12/18 moves are taken
    if (movesTaken == 12) {
        stars.childNodes[2].firstChild.classList.remove("fa-star");
        stars.childNodes[2].firstChild.classList.add("fa-star-o");
    }
    if (movesTaken == 18) {
        stars.childNodes[1].firstChild.classList.remove("fa-star");
        stars.childNodes[1].firstChild.classList.add("fa-star-o");
    }
}

function startTimer() {
    timer = setInterval(function() {
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
        if (seconds < 10) {
            clock.textContent = `${minutes}:0${seconds}`;
        } else {
        clock.textContent = `${minutes}:${seconds}`;
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = 0;
            minutes = 0;
            seconds = 0;
        clock.textContent = `${minutes}:0${seconds}`;
    }
}

dealCards();