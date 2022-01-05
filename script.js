// Globals
const board = document.querySelector(".board");
const clock = document.querySelector(".clock");
const modal = document.querySelector(".modal");
const moves = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const stars = document.querySelector(".stars");
let deck = [
	"♥",
	"♥",
	"♦",
	"♦",
	"♣",
	"♣",
	"♠",
	"♠",
	"♫",
	"♫",
	"☼",
	"☼",
	"∞",
	"∞",
	"≈",
	"≈",
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
		stars.childNodes[2].textContent = "☆";
	}
	if (moveCounter == 18) {
		stars.childNodes[1].textContent = "☆";
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
	shuffledDeck.forEach((suit) => {
		let card = document.createElement("li");
		let inner = document.createElement("div");
		let front = document.createElement("div");
		let back = document.createElement("div");

		// Add listeners to flipping element: ".card-inner"
		inner.addEventListener("click", function () {
			if (
				faceup.length < 2 &&
				!this.classList.contains("match") &&
				!this.classList.contains("faceup")
			) {
				this.classList.add("faceup");
				faceup.push(this);
				if (timer == 0) {
					startTimer();
				}
				if (faceup.length == 2) {
					processMatch();
				}
			}
		});

		// Assemble cards matching into the following template:
		// <li class="card">
		// 		<div class="card-inner">
		//			<div class="card-front">`suit`</div>
		//			<div class="card-back"></div>
		//		</div>
		// </li>
		card.classList.add("card");
		inner.classList.add("card-inner");
		front.classList.add("card-front");
		front.textContent = suit;
		back.classList.add("card-back");
		inner.appendChild(front);
		inner.appendChild(back);
		card.appendChild(inner);
		board.appendChild(card);
	});
}

// Check for match and handle result
function processMatch() {
	if (faceup[0].firstChild.textContent == faceup[1].firstChild.textContent) {
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
		}, 750);
		countMoves();
	}
}

function resetStars() {
	while (stars.firstChild) stars.removeChild(stars.firstChild);
	for (let i = 0; i < 3; i++) {
		let star = document.createElement("li");
		star.textContent = "★";
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
restart.addEventListener("click", dealCards);

// Initial state
dealCards();
