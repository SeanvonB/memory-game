// Globals
const board = document.querySelector(".board");
const clock = document.querySelector(".clock");
const moves = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const score = document.querySelector(".score");
let deck;
let deckAnimal = [
	"🐭",
	"🐭",
	"🐮",
	"🐮",
	"🐯",
	"🐯",
	"🐵",
	"🐵",
	"🐷",
	"🐷",
	"🐸",
	"🐸",
	"🐺",
	"🐺",
	"🐻",
	"🐻",
];
let deckFruit = [
	"🍅",
	"🍅",
	"🍆",
	"🍆",
	"🍇",
	"🍇",
	"🍈",
	"🍈",
	"🍊",
	"🍊",
	"🍌",
	"🍌",
	"🍑",
	"🍑",
	"🍒",
	"🍒",
];
let deckMoon = [
	"🌑",
	"🌑",
	"🌒",
	"🌒",
	"🌓",
	"🌓",
	"🌔",
	"🌔",
	"🌕",
	"🌕",
	"🌖",
	"🌖",
	"🌗",
	"🌗",
	"🌘",
	"🌘",
];
let faceup = [];
let lastDeck;
let matchCounter = 0;
let minutes = 0;
let moveCounter = 0;
let seconds = 0;
let timer = 0;

// Create win modal and add to DOM
function announceWin() {
	const modal = document.createElement("div");
	modal.classList.add("modal");

	// Copy children from `star` element to create banner
	const ul = document.createElement("ul");
	let children = score.childNodes;
	ul.classList.add("score");
	children.forEach((child) => {
		ul.appendChild(child.cloneNode(true));
	});
	modal.appendChild(ul);

	// Add modal text content
	const li1 = document.createElement("li");
	li1.textContent = "You finished in";
	modal.appendChild(li1);
	let li2 = document.createElement("li");
	li2.classList.add("clock");
	if (seconds < 10) {
		li2.textContent = `${minutes}:0${seconds}`;
	} else {
		li2.textContent = `${minutes}:${seconds}`;
	}
	modal.appendChild(li2);
	const li3 = document.createElement("li");
	li3.textContent = "Congratulations!";
	modal.appendChild(li3);

	// Add replay button
	const li4 = document.createElement("li");
	const button = document.createElement("button");
	button.addEventListener("click", dealCards);
	button.textContent = "Play Again";
	li4.appendChild(button);
	modal.appendChild(li4);
	board.appendChild(modal);
}

// Increment moveCounter and update score
function countMoves() {
	moveCounter += 1;
	moves.textContent = `${moveCounter}`;
	if (moveCounter == 12) {
		score.removeChild(score.lastElementChild);
	}
	if (moveCounter == 18) {
		score.removeChild(score.lastElementChild);
	}
}

// Clear previous game and start new one
function dealCards() {
	// Clear previous game
	while (board.firstChild) board.removeChild(board.firstChild);
	faceup.splice(0, faceup.length);
	matchCounter = 0;
	moveCounter = 0;
	moves.textContent = 0;
	resetTimer();
	resetStars();

	// Choose deck, shuffle it, and create cards
	let decks = ["animal", "fruit", "moon"];
	let selection;
	while (deck === lastDeck) {
		deck = decks[Math.floor(Math.random() * decks.length)];
	}
	switch (deck) {
		case "animal":
			selection = deckAnimal;
			break;
		case "fruit":
			selection = deckFruit;
			break;
		case "moon":
			selection = deckMoon;
			break;
	}
	lastDeck = deck;
	let shuffledDeck = shuffle(selection);
	shuffledDeck.forEach((suit) => {
		const card = document.createElement("li");
		const inner = document.createElement("div");
		const front = document.createElement("div");
		const back = document.createElement("div");

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
		//			<div class="card-front deck suit" data-suit="suit"></div>
		//			<div class="card-back deck"></div>
		//		</div>
		// </li>
		card.classList.add("card");
		inner.classList.add("card-inner");
		front.classList.add("card-front", `${deck}`, `${suit}`);
		front.dataset.suit = suit;
		front.textContent = suit;
		back.classList.add("card-back", `${deck}`);
		inner.appendChild(front);
		inner.appendChild(back);
		card.appendChild(inner);
		board.appendChild(card);

		// Apply individual card styles
		switch (suit) {
			case "🐭":
				front.style.backgroundColor = "#cdd";
				break;
			case "🐮":
				front.style.backgroundColor = "#9ab";
				break;
			case "🐯":
				front.style.backgroundColor = "#7a5";
				break;
			case "🐵":
				front.style.backgroundColor = "#eab";
				break;
			case "🐷":
				front.style.backgroundColor = "#b65";
				break;
			case "🐸":
				front.style.backgroundColor = "#fc4";
				break;
			case "🐺":
				front.style.backgroundColor = "#b64";
				break;
			case "🐻":
				front.style.backgroundColor = "#678";
				break;
			case "🌑":
				front.style.backgroundColor = "#567";
				break;
			case "🌒":
				front.style.backgroundImage =
					"linear-gradient(to right, #567 75%, #fc4 75%)";
				break;
			case "🌓":
				front.style.backgroundImage =
					"linear-gradient(to right, #567 50%, #fc4 50%)";
				break;
			case "🌔":
				front.style.backgroundImage =
					"linear-gradient(to right, #567 25%, #fc4 25%)";
				break;
			case "🌕":
				front.style.backgroundColor = "#fc4";
				break;
			case "🌖":
				front.style.backgroundImage =
					"linear-gradient(to right, #fc4 75%, #567 75%)";
				break;
			case "🌗":
				front.style.backgroundImage =
					"linear-gradient(to right, #fc4 50%, #567 50%)";
				break;
			case "🌘":
				front.style.backgroundImage =
					"linear-gradient(to right, #fc4 25%, #567 25%)";
				break;
			default:
				front.style.backgroundImage =
					"linear-gradient(to bottom, #777 60%, #333 60%, #777 180%)";
		}
	});

	// Convert emojis to Twemojis for consistency across devices
	twemoji.parse(document.body);
}

// Check for match and handle result
function processMatch() {
	if (
		faceup[0].firstChild.dataset.suit == faceup[1].firstChild.dataset.suit
	) {
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
		}, 1000);
		countMoves();
	}
}

function resetStars() {
	while (score.firstChild) score.removeChild(score.firstChild);
	for (let i = 0; i < 3; i++) {
		let star = document.createElement("li");
		star.classList.add("star");
		star.textContent = "⭐";
		score.appendChild(star);
	}
}

function resetTimer() {
	if (timer) {
		clearInterval(timer);
		timer = 0;
		minutes = 0;
		seconds = 0;
		clock.textContent = `${minutes} : 0${seconds}`;
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
			clock.textContent = `${minutes} : 0${seconds}`;
		} else {
			clock.textContent = `${minutes} : ${seconds}`;
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
