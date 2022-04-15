import  {startGame, createGamer, asegurarPlayers, createStartButton,displayPlayers, displayFullTableCards, updateCardInGame, updateDeskCard, displayFirstTurn, updateTurn  } from './node_modules/prueba_cards/uno.js'

let turn = 0;
const mainElement = document.querySelector("main");

//form: Numero de jugadores
const formNumPlayers = document.querySelector("form");
formNumPlayers.addEventListener("submit", (event) => {
  event.preventDefault();
  let numPlayers = asegurarPlayers(); //arreglar que si no poses res no et deixi avançar

  let gamers = [];
  //form: Nombre de jugadores
  const formPlayer = document.querySelector("form");
  formPlayer.addEventListener("submit", (event) => {
    event.preventDefault();
    gamers = createGamer(gamers); //arreglar que si no poses res no doni error
    displayPlayers(gamers, turn); //mostrar el nombre de los gamers en pantalla

    if (gamers.length != numPlayers) {
      console.log(">> Waiting for players...");
    } else {
      let startButton = createStartButton(); //create the button: start game
      mainElement.appendChild(startButton); //afegir el button:start game
      formPlayer.remove(); //eliminar el form para no añadir más jugadores
      //button: Start Game
      startButton.addEventListener("click", (event) => {
        event.preventDefault();
        startButton.remove(); //eliminar el boton: start game!

        let t = startGame(gamers); //poner los datos para empezar el juego
        displayPlayers(t.gamers, turn); //mostrar las cartas de todos los jugadores
        displayFullTableCards(
          t.cardsInGame,
          "Card in game:",
          t.table,
          "Deck of cards to take:"
        ); //mostrar la carta en juego
        console.log(">> The initial table is:");
        console.log(t);

        //button: turnButton
        let turnButton = displayFirstTurn(t); //dar el turno al primer gamer
        turnButton.addEventListener("click", (event) => {
          displayPlayers(t.gamers, turn);

          //card: comprovar si la ultima carta que hay en CardsInGame (la que acaban de tirar) es especial (+4, +2, forbbiden, direction)
          if(t.cardsInGame[t.cardsInGameLength()-1].cardName.includes("multicolor") || 
          t.cardsInGame[t.cardsInGameLength()-1].cardName.includes("+4") ||
          t.cardsInGame[t.cardsInGameLength()-1].cardName.includes("+2") ||
          t.cardsInGame[t.cardsInGameLength()-1].cardName.includes("Forbbiden") ||
          t.cardsInGame[t.cardsInGameLength()-1].cardName.includes("Direction")){
            console.log("Han tirat una carta especial!!!!!!!!!!!"); //fer casos especials per cada carta 
          }

          //card: detectar si el jugador quiere tirar una carta
          let cardImages = document.getElementById("players").querySelectorAll("img");
          for (let i = 0; i < cardImages.length; i++) {
            cardImages[i].addEventListener("click", (event) => {
              touchCard(t, cardImages, i);
            });
          }

          //card: detectar si el jugador quiere robar una carta
          let pickCards = document.getElementById("table").querySelector("img");
          pickCards.addEventListener("click", (event) => {
            touchInGameCard(t, pickCards);
          }); //card: detectar si alguien quiere robar una carta
        }); //button: turnButton
      }); //button: Start Game
    } // if else: hay suficientes jugadores
  }); //form: Nombre de jugadores
}); //form: Numero de jugadores

//event functions
function touchCard(t, cardImages, i) {
  let gamerTurn = t.gamers[turn];
  for (let j = 0; j < gamerTurn.numCards(); j++) {
    if (gamerTurn.cards[j].cardName == cardImages[i].className) {
      t.throwCard(gamerTurn.cards[j], t.gamers[turn], j); //un jugador tira una carta

      //actualizar las cartas de cardsInGame(monton de cartas en jugada)
      let cardPreGame = document.getElementById("cardsInGame").querySelector("img");
      updateCardInGame(cardPreGame, cardImages[i]);

      //comprovar si hay un ganador
      let ganador = t.score();
      if (ganador == true) {
        let turnInfo = document.getElementById("turn-info");
        turnInfo.remove();
        let divUnoPlayers = document.getElementById("unoPlayers");
        if (divUnoPlayers != null) {
          divUnoPlayers.remove();
        }
        console.log(t);
      } else {
        turn = updateTurn(t, turn, t.gamers.length); //actualizamos para que le toque al siguiente cuando ha tirado el anterior
        //console.log(t);
      }
    }
  }
} //end touchCard

function touchInGameCard(t, pickCards) {
  let gamerTurn = t.gamers[turn];
  if (t.table[t.table.length - 1].cardName == pickCards.className) {
    t.pickCard(gamerTurn); //un jugador roba una carta
    displayPlayers(t.gamers, turn); //actualizar los jugadores
    updateDeskCard(pickCards, t.table[t.table.length - 1]); //actualizar las cartas de table (el monton de robar)

    //card: detectar si un jugador quiere tirar una carta
    let cardImages = document.getElementById("players").querySelectorAll("img");
    for (let i = 0; i < cardImages.length; i++) {
      cardImages[i].addEventListener("click", (event) => {
        touchCard(t, cardImages, i);
      });
    }

    //button: detectar si un jugador quiere pasar de turno porque no tiene cartas y ya ha robado
    let player = document.getElementsByTagName("li")[turn];
    let p = document.createElement("p");
    p.setAttribute("id", "skip");
    let pasarButton = document.createElement("button"); //boton para despues de robar, poder pasar
    pasarButton.textContent = "SKIP";
    p.append(pasarButton);
    player.append(p);
    pasarButton.addEventListener("click", (event) => {
      console.log(">> " + gamerTurn.name + " passes the turn");
      turn = updateTurn(t, turn, t.gamers.length); //actualizamos para que le toque al siguiente cuando ha tirado el anterior
    });

    //console.log(t);
  }
} //end touchInGameCard