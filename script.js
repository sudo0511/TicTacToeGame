var origBoard;
const humanPlayer = "⭕";
const aiPlayer = "❌";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];
const cells = document.querySelectorAll(".cell");
// console.log(cells);
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none"; //to set endgame message display to none when hit replay
  origBoard = Array.from(Array(9).keys()); //will create an array with values 0 to 8
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    //as currently players can click on already filled spots also hence we check if origBoard has number (which means not filled) but string when filled as 'O' and 'X'
    turn(square.target.id, humanPlayer);
    if (!checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareID, player) {
  origBoard[squareID] = player;
  document.getElementById(squareID).innerText = player;

  //console.log(origBoard);
  let gameWon = checkWinner(origBoard, player);
  //   console.log(gameWon);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWinner(boardArr, player) {
  let plays = boardArr.reduce((a, e, i) => {
    // to find places on board already played in, where a is initial value , e is current array element, i is index of current element
    if (e === player) {
      return a.concat(i);
    } else {
      return a;
    }
  }, []); // [] means that out initail value of a is empty array
  //console.log(plays);
  let gameWon = null;

  for (let [index, win] of winCombos.entries()) {
    // Array.entries ==> it returns an iterator object that contains [key,value] pairs of each array element

    if (
      win.every((elem) => {
        //console.log(plays.indexOf(elem));
        return plays.indexOf(elem) > -1;
      })
    ) {
      //   console.log(index, win);
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    if (gameWon.player == humanPlayer) {
      document.getElementById(index).style.backgroundColor = "blue";
      declareWinner("You Win 💯");
    } else {
      document.getElementById(index).style.backgroundColor = "red";
      declareWinner("AI Won 💯");
    }
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
}

function emptySquares() {
  return origBoard.filter((v) => typeof v == "number");
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
    }
    declareWinner("Game Tie 🤪");
    return true;
  } else {
    return false;
  }
}

function bestSpot() {
  return minMax(origBoard, aiPlayer).index;
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function minMax(newBoard, player) {
  //console.log(newBoard);
  let availSpaces = emptySquares();
  //console.log(availSpaces);
  if (checkWinner(newBoard, humanPlayer)) return { score: -10 };
  else if (checkWinner(newBoard, aiPlayer)) return { score: 10 };
  else if (availSpaces.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (var i = 0; i < availSpaces.length; i++) {
    var move = {};
    move.index = newBoard[availSpaces[i]];
    newBoard[availSpaces[i]] = player;

    if (player == aiPlayer) {
      var result = minMax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minMax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpaces[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player == aiPlayer) {
    var bestScore = -1000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 1000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
