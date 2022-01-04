// Globals
const board = document.querySelector(".board");
const clock = document.querySelector(".clock");
const modal = document.querySelector(".modal");
const moves = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const stars = document.querySelector(".stars");
let deck = [
	"anchor",
	"anchor",
	"beer",
	"beer",
	"bomb",
	"bomb",
	"heart",
	"heart",
	"leaf",
	"leaf",
	"paw",
	"paw",
	"rocket",
	"rocket",
	"umbrella",
	"umbrella",
];
let faceup = [];
let matchCounter = 0;
let minutes = 0;
let moveCounter = 0;
let seconds = 0;
let timer = 0;

// Create win modal and add to DOM
function announceWin() {
	// Copy children from `star` element to create banner
	let children = stars.childNodes;
	let ul = document.createElement("ul");
	ul.classList.add("stars");
	children.forEach((child) => {
		ul.appendChild(child.cloneNode(true));
	});
	modal.appendChild(ul);

	// Add modal text content
	let li1 = document.createElement("li");
	li1.textContent = "You finished in";
	modal.appendChild(li1);
	let li2 = document.createElement("li");
	if (seconds < 10) {
		li2.textContent = `${minutes}:0${seconds}`;
	} else {
		li2.textContent = `${minutes}:${seconds}`;
	}
	modal.appendChild(li2);
	let li3 = document.createElement("li");
	li3.textContent = "Congratulations!";
	modal.appendChild(li3);

	// Add replay button
	let li4 = document.createElement("li");
	let button = document.createElement("button");
	button.addEventListener("click", dealCards);
	button.textContent = "Play Again";
	li4.appendChild(button);
	modal.appendChild(li4);
}

// Increment moveCounter and update score
function countMoves() {
	moveCounter += 1;
	moves.textContent = `${moveCounter}`;
	if (moveCounter == 12) {
		stars.childNodes[2].classList.remove("fa-star");
		stars.childNodes[2].classList.add("fa-star-o");
	}
	if (moveCounter == 18) {
		stars.childNodes[1].classList.remove("fa-star");
		stars.childNodes[1].classList.add("fa-star-o");
	}
}

// Clear previous game and start new one
function dealCards() {
	// Clear previous game
	while (modal.firstChild) modal.removeChild(modal.firstChild);
	while (board.firstChild) board.removeChild(board.firstChild);
	faceup.splice(0, faceup.length);
	matchCounter = 0;
	moveCounter = 0;
	moves.textContent = 0;
	resetTimer();
	resetStars();

	// Shuffle deck and start new one
	let shuffledDeck = shuffle(deck);
	shuffledDeck.forEach((card) => {
		let elem = document.createElement("li");
		elem.classList.add("fa", `fa-${card}`, "card");
		elem.setAttribute("data-type", card);
		board.appendChild(elem);
	});
}

// Check for match and handle result
function processMatch() {
	if (faceup[0].dataset.type == faceup[1].dataset.type) {
		// Keep matches faceup
		faceup[0].classList.add("match");
		faceup[1].classList.add("match");
		faceup[0].classList.remove("faceup");
		faceup[1].classList.remove("faceup");
		faceup.splice(0, faceup.length);

		// Update state and check for win
		countMoves();
		matchCounter++;
		if (matchCounter == 8) {
			stopTimer();
			announceWin();
		}

		// Put non-matches facedown after brief delay
	} else {
		setTimeout(function () {
			faceup[0].classList.remove("faceup");
			faceup[1].classList.remove("faceup");
			faceup.splice(0, faceup.length);
		}, 500);
		countMoves();
	}
}

function resetStars() {
	while (stars.firstChild) stars.removeChild(stars.firstChild);
	for (let i = 0; i < 3; i++) {
		let star = document.createElement("li");
		star.classList.add("fa", "fa-star", "star");
		stars.appendChild(star);
	}
}

function resetTimer() {
	if (timer) {
		clearInterval(timer);
		timer = 0;
		minutes = 0;
		seconds = 0;
		clock.textContent = `${minutes}:0${seconds}`;
	}
}

// Shuffle deck using Fisher-Yates shuffle
// Source: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
	let current = array.length,
		temp,
		rand;

	while (current) {
		rand = Math.floor(Math.random() * current);
		current -= 1;
		temp = array[current];
		array[current] = array[rand];
		array[rand] = temp;
	}
	return array;
}

function startTimer() {
	timer = setInterval(function () {
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
	}
}

// AddEventListeners
board.addEventListener("click", function (e) {
	if (
		faceup.length < 2 &&
		e.target.classList.contains("card") &&
		!e.target.classList.contains("match") &&
		!e.target.classList.contains("faceup")
	) {
		e.target.classList.add("faceup");
		faceup.push(e.target);
		if (timer == 0) {
			startTimer();
		}
		if (faceup.length == 2) {
			processMatch();
		}
	}
});
restart.addEventListener("click", dealCards);

// Initial state
dealCards();
