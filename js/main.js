// Global variables
let cardDeck = [
    "anchor", "anchor", "beer", "beer",
    "bomb", "bomb", "heart", "heart",
    "leaf", "leaf", "paw", "paw",
    "rocket", "rocket", "umbrella", "umbrella"
];
let openCards = [];
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

// Initialize the game board and reset counters
function dealCards() {
    
    // Clear previous game board
    while (deck.firstChild) deck.removeChild(deck.firstChild);

    // Create new, randomized game board
    let shuffledDeck = shuffle(cardDeck);
    let cardHTML = shuffledDeck.map(function(card) {
        return createCard(card);
    })
    deck.innerHTML = cardHTML.join('');
    addGameInteractions();

    // Reset counters
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
    deck.addEventListener("click", function (evt) {
        let targetCard = evt.target;

        // Check if event target is a face-down card
        if (openCards.length < 2
                && targetCard.classList.contains("card")
                && !targetCard.classList.contains("match")
                && !targetCard.classList.contains("open")) {

            // If so, turn card face-up
            evt.target.classList.add("open", "show");
            openCards.push(evt.target);

            // Once two are shown...
            if (openCards.length == 2) {processMatch()}
        }
    })

    // Add single event listener for re-initializing game
    
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

    // Set non-match flip over after delay
    } else {
        setTimeout(function() {
            openCards[0].classList.remove("open", "show");
            openCards[1].classList.remove("open", "show");
            openCards.splice(0, openCards.length);
        }, 500);
    }
}

/* TODO:
    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) */

dealCards();