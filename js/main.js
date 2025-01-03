let deckId = ""
let player1Score = 0
let player2Score = 0
let isWar = false
let remaining = 52

// ⬇️ EVENT LISTENERS ⬇️

document.querySelector('#deal').addEventListener('click', drawTwo)
document.querySelector('#over').addEventListener('click', newGame)
document.querySelector('#war-btn').addEventListener('click', drawWar)

// ⬇️ EVENT HANDLERS ⬇️

// get a deckID from API to manage cards for game
function getDeckId() {
  fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    .then(res => res.json())
    .then(data => {
      deckId = data.deck_id
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
}

// draw a card for each player and play a round
function drawTwo(){
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      renderCards(data.cards[0].image, data.cards[1].image)
      
      let player1Val = convertToNum(data.cards[0].value)
      let player2Val = convertToNum(data.cards[1].value)
      remaining = data.remaining

      if (isWar) {
        hideWarCards()
        isWar = false
      }

      renderGame(player1Val, player2Val)
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
}

// draw 4 cards for each player and play a round
function drawWar(){
  if (remaining < 8) {
    renderEndGame()
  } else {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`)
      .then(res => res.json())
      .then(data => {
        let cards = data.cards.map(card => card.image)
        document.querySelector("#war").classList.add("hide")
        renderWarCards(cards)
        
        let player1Val = convertToNum(data.cards[3].value)
        let player2Val = convertToNum(data.cards[7].value)
        remaining = data.remaining
        isWar = true
  
        renderGame(player1Val, player2Val)
      })
      .catch(err => {
        console.log(`error ${err}`)
      })
  }
}

// ⬇️ RENDER FUNCTIONS ⬇️

// display cards in player areas
function renderCards(player1card, player2card) {
  document.querySelector("#player1").src = player1card
  document.querySelector("#player2").src = player2card
}

function renderWarPrompt() {
  document.querySelector("#war").classList.remove("hide")
}

function renderWarCards(cards) {
  document.querySelector("#player1-war").classList.remove("hide")
  document.querySelector("#player2-war").classList.remove("hide")

  document.querySelector("#player1-war").innerHTML = `
    <img id="player1-war1" src=${cards[3]} alt="Playing card">
    <img id="player1-war2" src="/img/red.jpg" alt="Playing card">
    <img id="player1-war3" src="/img/red.jpg" alt="Playing card">
    <img id="player1-war4" src="/img/red.jpg" alt="Playing card">
  `
  
  document.querySelector("#player2-war").innerHTML = `
    <img id="player2-war1" src=${cards[7]} alt="Playing card">
    <img id="player2-war2" src="/img/blue.jpg" alt="Playing card">
    <img id="player2-war3" src="/img/blue.jpg" alt="Playing card">
    <img id="player2-war4" src="/img/blue.jpg" alt="Playing card">
  `
}

// use card values to render game updates per round
function renderGame(player1Val, player2Val) {
  if (player1Val > player2Val) {
    isWar ? player1Score += 8 : player1Score +=2
    document.querySelector("h2").innerText = `Player 1 Wins Round`
    document.querySelector("#player1-cards").innerText = player1Score
  } else if (player1Val < player2Val) {
    isWar ? player2Score += 8 : player2Score +=2
    document.querySelector("h2").innerText = `Player 2 Wins Round`
    document.querySelector("#player2-cards").innerText = player2Score
  } else {
    document.querySelector("h2").innerText = `Time for WAR!`
    renderWarPrompt()
  }

  document.querySelector("#cards-left").innerText = `${remaining}`

  if (remaining === 0) {
    renderEndGame()
  }
}

function renderEndGame() {
  if (isWar) {
    hideWarCards()
  }

  document.querySelector("#over").classList.remove("hide")
  document.querySelector("#over").innerHTML = `
    ${player1Score > player2Score ? `<h2>Player 1 Wins WAR!</h2>` : `<h2>Player 2 Wins WAR!</h2>`}
    <section class="totals">
      <section id="player1-end" class="end-score">
        <p>Player 1 score:</p>
        <p>${player1Score}</p>
      </section>
      <section id="player2-end" class="end-score">
        <p>Player 2 score:</p>
        <p>${player2Score}</p>
      </section>
    </section>
    <button>New Game</button>
  `
}

// ⬇️ HELPER FUNCTIONS ⬇️

function hideWarCards() {
  document.querySelector("#player1-war").classList.add("hide")
  document.querySelector("#player2-war").classList.add("hide")
}

function convertToNum(val) {
  if (val === "ACE") {
    return 14
  } else if (val === "KING") {
    return 13
  } else if (val === "QUEEN") {
    return 12
  } else if (val === "JACK") {
    return 11
  } else {
    return Number(val)
  }
}

function newGame() {
  location.reload()
}

getDeckId()