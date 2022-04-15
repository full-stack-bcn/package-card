const NUMCARDS = 56;
const NUMCARDS_GAMER = 7;

class Card {
  constructor(cardName) {
    this.cardName = cardName;
    this.isVisible = false;
  }

  flip() {
    this.isVisible = !this.isVisible;
  }

  showImage(name) {
    //mostrar la imagen de la carta (solo las que sean visibles)
    if (this.isVisible == true) {
      return "./images/cards/" + name + ".png";
    } else {
      return "./images/cards/" + "uno-reves" + ".png";
    }
  }
} //end Card

class Gamer {
  constructor(gamerNum, name) {
    this.name = name;
    this.gamerNum = gamerNum;
    this.cards = [];
    this.isMyTurn = false;
  }

  numCards() {
    return this.cards.length;
  }

  isEmpty() {
    return this.cards.length == 0;
  }

  myTurn() {
    for (let card of this.cards) {
      card.flip();
    }
    this.isMyTurn = !this.isMyTurn;
    if (this.isMyTurn == true) {
      console.log(">> It's the turn of " + this.name);
    }
  }

  pickCard(card) {
    this.cards.push(card);
    console.log(">> " + this.name + " pick the card: " + card.cardName);
  }

  throwCard(index) {
    let card = this.cards.splice(index, 1)[0];
    console.log(">> " + this.name + " throws the card: " + card.cardName);
    return card;
  }

  printCards() {
    console.log(">> " + this.name + " has " + this.numCards() + " cards:");
    console.log(this.cards);
  }
} //end Gamer

class Table {
  constructor() {
    this.table = [];
    this.cardsInGame = [];
    this.gamers = [];
  }

  startCards() {
    //inicializar las cartas de juego
    this.table = [];
    const values = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "+2",
      "Direction",
      "Forbbiden",
    ];
    const colors = ["red", "green", "blue", "yellow"];
    const specials = ["multicolor_1", "multicolor_2", "+4_1", "+4_2"];

    //añadimos cartas de colores
    for (let color in colors) {
      for (let value in values) {
        this.table.push(new Card(colors[color] + "" + values[value]));
      }
    }
    //añadimos 2 multicolor, 2 plus4
    for (let special in specials) {
      //for (let i = 0; i < 1; i++) {
        this.table.push(new Card(specials[special]));
      //}
    }
    this.table.sort(function () {
      return Math.random() - 0.5;
    });
  }

  dealCards() {
    //Repartir 7 cartas random a cada jugador
    for (let gamer of this.gamers) {
      console.log(">> Dealing " + NUMCARDS_GAMER + " cards to " + gamer.name);
      for (let i = 0; i < NUMCARDS_GAMER; i++) {
        let randomNum = getRandomNumber(0, this.tableLength());
        let card = this.table.splice(randomNum, 1)[0];
        gamer.cards.push(card); //gamer.pickCard(card);
      }
      console.log(gamer.cards);
    }
  }

  cardToStart() {
    let randomNum = getRandomNumber(0, this.tableLength());
    let startCard = this.table.splice(randomNum, 1)[0]; //quitamos carta de la tabla
    while (
      startCard.cardName.includes("multicolor") ||
      startCard.cardName.includes("+4") ||
      startCard.cardName.includes("+2") ||
      startCard.cardName.includes("Forbbiden") ||
      startCard.cardName.includes("Direction")
    ) {
      this.table.splice(randomNum, 0, startCard); //volvemos a añadir la carta en la tabla
      randomNum = getRandomNumber(0, this.tableLength());
      startCard = this.table.splice(randomNum, 1)[0]; //sacamos otra carta
    }
    startCard.flip(); //cambiar la visibilidad de la carta a: visible
    this.cardsInGame.push(startCard);
    console.log(">> Start card: " + startCard.cardName);
  }

  addGamer(gamer) {
    this.gamers.push(gamer);
  }

  pickCard(gamer) {
    //jugador coge una carta del monton de robar
    let card = this.table.pop(); //quitar la carta de la table
    card.flip(); //cambiar la visibilidad de la carta a: visible
    gamer.pickCard(card); //poner la carta en el jugador
    return card;
  }

  throwCard(card, gamer, i) {
    //jugador tira una carta al monton de jugar
    if (gamer.isMyTurn == true) {
      gamer.throwCard(i); //quita la carta de las cartas del jugador
      this.cardsInGame.push(card); //pone la carta en cardsInGame
    } else {
      console.log(">> No es mi turno, por eso no puedo tirar");
    }
  }

  tableLength() {
    return this.table.length;
  }

  cardsInGameLength() {
    return this.cardsInGame.length;
  }

  printTable() {
    console.log("Deck of cards to take: ");
    console.log(this.table);
  }

  printCardsInGame() {
    console.log("Cards in game: ");
    console.log(this.cardsInGame);
  }

  printPlayersCards() {
    for (let gamer of this.gamers) {
      gamer.printCards();
    }
  }

  score() {
    //comprobar si alguien ha ganado
    let ganador = false;
    for (let gamer of this.gamers) {
      if (gamer.isEmpty()) {
        ganador = true;
        let divInfo = document.getElementById("info");
        let pGanador = document.createElement("p");
        pGanador.setAttribute("id", "ganador");
        pGanador.textContent = gamer.name + " wins the game!!";

        divInfo.appendChild(pGanador);
        console.log(">> " + gamer.name + " wins the game!!");
      }
    }
    return ganador;
  }
} //end Table

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function startGame(gamers) {
  let t = new Table();

  //Iniciar la mesa con NUMCARDS cartas disponibles
  t.startCards();
  if (t.tableLength() == NUMCARDS) {
    console.log(">> The table are ready");
  } else {
    console.log(">> The table doesn't have " + NUMCARDS + " dealCards");
  }
  console.log(">> Number of cards in game: " + t.tableLength());
  console.log(">> Number of gamers: " + gamers.length);

  //Añadir gamers a la table
  for (let gamer of gamers) {
    t.addGamer(gamer);
  }
  //Repartir 7 cartas random a cada jugador
  t.dealCards();

  //Coger una carta para empezar a jugar
  t.cardToStart();

  return t;
}

function createGamer(gamers) {
  //crear jugador y ponerlo en el array gamers
  const input = document.querySelector("input");
  let g;
  if (input.value !== "") {
    g = new Gamer(gamers.length, input.value);
    console.log(">> Player " + gamers.length + " : " + g.name);
    input.value = ""; //borrar el input del form una vez creado el jugador
    gamers.push(g);
    return gamers;
  }
}

function asegurarPlayers() {
  //asegurar que haya el num de jugadores indicado
  const mainElement = document.querySelector("main");
  const inputNumPlayers = document.querySelector("input");
  let numPlayers = inputNumPlayers.value;
  console.log("Number of players: " + numPlayers);

  let info = document.getElementById("info");
  let pNumPlayers = document.createElement("p");
  pNumPlayers.textContent = "Number of players: " + numPlayers;
  info.appendChild(pNumPlayers);

  document.querySelector("form").remove();

  const formPlayer = document.createElement("form");
  const buttonPlayer = document.createElement("button");
  const inputPlayer = document.createElement("input");

  buttonPlayer.innerText = "Add";
  inputPlayer.type = "text";
  inputPlayer.name = "player";
  inputPlayer.placeholder = " Type your username....";
  inputPlayer.autofocus = "true";

  mainElement.appendChild(formPlayer);
  formPlayer.appendChild(inputPlayer);
  formPlayer.appendChild(buttonPlayer);

  return numPlayers;
}

function createStartButton() {
  //creamos el boton: start game!
  const startButton = document.createElement("button");
  startButton.setAttribute("id", "start-game");
  startButton.textContent = "Start game!";

  return startButton;
}

function displayPlayers(gamers, turn) {
  //mostrar por pantalla los jugadores y sus cartas
  const players = document.getElementById("players");
  players.textContent = "";
  for (let gamer of gamers) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = "Player " + gamer.gamerNum + " : " + gamer.name;
    players.appendChild(li);
    li.append(p);
    li.setAttribute("player", gamer.gamerNum);
    for (let i = 0; i < gamer.numCards(); i++) {
      const img = document.createElement("img");
      img.src = gamer.cards[i].showImage(gamer.cards[i].cardName);
      img.setAttribute("class", gamer.cards[i].cardName);
      li.append(img);
    }
  }
  showUnoButton(turn, gamers);
}

function displayFullTableCards(cardsInGame, nameCardsInGame, table, nameTable) {
  //mostrar las cartas de cardsInGame y table
  const mainElement = document.querySelector("main");
  const divFullTable = document.getElementById("fullTable");
  divFullTable.textContent = "";
  const divCardsInGame = document.createElement("div");
  const divTable = document.createElement("div");
  divCardsInGame.setAttribute("id", "cardsInGame");
  divTable.setAttribute("id", "table");

  const imgCardsInGame = document.createElement("img");
  const imgTable = document.createElement("img");
  const pCardsInGame = document.createElement("p");
  const pTable = document.createElement("p");
  imgCardsInGame.src = cardsInGame[cardsInGame.length - 1].showImage(
    cardsInGame[cardsInGame.length - 1].cardName
  );
  imgTable.setAttribute("class", cardsInGame[cardsInGame.length - 1].cardName);
  imgTable.src = table[table.length - 1].showImage(
    table[table.length - 1].cardName
  );
  imgTable.setAttribute("class", table[table.length - 1].cardName);
  pCardsInGame.textContent = nameCardsInGame;
  pTable.textContent = nameTable;

  divCardsInGame.append(pCardsInGame);
  divTable.append(pTable);
  divCardsInGame.append(imgCardsInGame);
  divTable.append(imgTable);

  divFullTable.appendChild(divCardsInGame);
  divFullTable.appendChild(divTable);
  mainElement.appendChild(divFullTable);
}

function updateCardInGame(cardPreGame, cardGame) {
  //actualizar: muestra la ultima carta que se acaba de tirar a cardsInGame
  let divTable = document.getElementById("cardsInGame");
  divTable.replaceChild(cardGame, cardPreGame);
}

function updateDeskCard(cardsPreGame, card) {
  //actualizar: muestra la siguiente carta del monton de robar
  let divTable = document.getElementById("table");
  const imgCardGame = document.createElement("img");
  imgCardGame.src = card.showImage(card.cardName);
  imgCardGame.setAttribute("class", card.cardName);
  divTable.replaceChild(imgCardGame, cardsPreGame);
}

function displayFirstTurn(t) {
  //dar el turno al primer jugador
  const turnDiv = document.createElement("div");
  turnDiv.setAttribute("id", "turn-info");
  const turnp = document.createElement("p");
  turnp.textContent = "It's your turn: ";
  const turnButton = document.createElement("button");
  turnButton.textContent = t.gamers[0].name;
  turnButton.setAttribute("id", "turnButton");

  const info = document.getElementById("info");
  info.appendChild(turnDiv);
  turnDiv.appendChild(turnp);
  turnDiv.appendChild(turnButton);

  t.gamers[0].myTurn();

  return turnButton;
}

function updateTurn(t, turn, numPlayers) {
  //actualizar: dar el turno al siguiente jugador
  t.gamers[turn].myTurn();
  turn = (turn + 1) % numPlayers;

  let turnButton = document.getElementById("turnButton");
  turnButton.textContent = t.gamers[turn].name;

  t.gamers[turn].myTurn();
  return turn;
}

function showUnoButton(turn, gamers) {
  //mostrar el boton de Uno
  let pUno = document.getElementById("playerUno_" + gamers[turn].name);
  if (gamers[turn].numCards() == 2 && pUno != undefined) {
    pUno.remove();
  }
  if (gamers[turn].numCards() == 2) {
    let player = document.getElementsByTagName("li")[turn];

    let p = document.createElement("p");
    p.setAttribute("id", "uno");
    let buttonUno = document.createElement("button");
    buttonUno.textContent = "UNO";
    p.append(buttonUno);
    player.append(p);

    buttonUno.addEventListener("click", (event) => {
      let divUno = document.getElementById("unoPlayers");
      console.log(">> A " + gamers[turn].name + " le queda UNO!");
      if (divUno == null) {
        let divUno = document.createElement("div");
        divUno.setAttribute("id", "unoPlayers");
        let info = document.getElementById("info");
        let p = document.createElement("p");
        p.setAttribute("id", "playerUno_" + gamers[turn].name);
        p.textContent = "A " + gamers[turn].name + " le queda UNO!";
        divUno.appendChild(p);
        info.appendChild(divUno);
      } else {
        let p = document.createElement("p");
        p.setAttribute("id", "playerUno_" + gamers[turn].name);
        p.textContent = "A " + gamers[turn].name + " le queda UNO!";
        divUno.appendChild(p);
      }
    });
  }
}

export {startGame, createGamer, asegurarPlayers, createStartButton,displayPlayers, displayFullTableCards, updateCardInGame, updateDeskCard, displayFirstTurn, updateTurn  };

