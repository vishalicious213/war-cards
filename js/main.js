let deckId = ""

document.querySelector('#deal').addEventListener('click', drawTwo)
document.querySelector('#over').addEventListener('click', newGame)

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

function drawTwo(){
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      document.querySelector("#player1").src = data.cards[0].image
      document.querySelector("#player2").src = data.cards[1].image
      let player1Val = convertToNum(data.cards[0].value)
      let player2Val = convertToNum(data.cards[1].value)

      if (player1Val > player2Val) {
        document.querySelector("h2").innerText = `Player 1 Wins`
      } else if (player1Val < player2Val) {
        document.querySelector("h2").innerText = `Player 2 Wins`
      } else document.querySelector("h2").innerText = `Time for WAR!`

      document.querySelector("#cards-left").innerText = `${data.remaining}`

      if (data.remaining === 0) {
        document.querySelector("#over").innerHTML = `<button>New Game</button>`
        document.querySelector("#deal").classList.add("no-click")
      }
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
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