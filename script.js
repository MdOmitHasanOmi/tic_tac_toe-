// ==== VARIABLES ====
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let mode = localStorage.mode || "cpu";         // cpu or 2player
let p1 = localStorage.p1 || "You";
let p2 = mode === "cpu" ? "Computer" : (localStorage.p2 || "Player O");

// DOM elements
const statusEl = document.getElementById("status");
const playersEl = document.getElementById("players");

// Initialize status and players
statusEl.textContent = `${p1} Turn`;
playersEl.innerHTML = `
  <div class="active">${p1} (X)</div>
  <div>${p2} (O)</div>
`;

// Winning combinations
const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // columns
  [0,4,8],[2,4,6]          // diagonals
];

// ==== MAIN PLAY FUNCTION ====
function play(index){
  if(board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  document.getElementsByClassName("cell")[index].textContent = currentPlayer;

  if(checkWinner()){
    saveStat(currentPlayer);
    gameActive = false;
    statusEl.textContent = `${currentPlayer==="X"?p1:p2} Wins 🎉`;
    return;
  }

  if(!board.includes("")){
    gameActive = false;
    statusEl.textContent = "Draw 🤝";
    localStorage.d = (+localStorage.d || 0) + 1;
    return;
  }

  // Switch turn
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `${currentPlayer==="X"?p1:p2} Turn`;

  // AI move if mode is CPU
  if(mode === "cpu" && currentPlayer === "O" && gameActive){
    setTimeout(aiMove, 300);
  }
}

// ==== CHECK WINNER ====
function checkWinner(){
  let roundWon = false;
  let lineIndex = -1;

  for(let i=0; i<winningCombinations.length; i++){
    const [a,b,c] = winningCombinations[i];
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      roundWon = true;
      lineIndex = i;
      drawWinLine(lineIndex);
      break;
    }
  }

  return roundWon;
}

// ==== AI MOVE ====
function aiMove(){
  let empty = board.map((v,i)=>v===" "||v===""?i:null).filter(v=>v!==null);
  let move = empty[Math.floor(Math.random()*empty.length)];
  play(move);
}

// ==== RESET GAME ====
function reset(){
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusEl.textContent = `${p1} Turn`;

  const cells = document.getElementsByClassName("cell");
  for(let cell of cells) cell.textContent = "";

  const line = document.querySelector(".win-line");
  if(line) line.remove();
}

// ==== BACK BUTTON ====
function goBack(){
  window.history.back();
}

// ==== DRAW WIN LINE ====
function drawWinLine(index){
  const line = document.createElement("div");
  line.classList.add("win-line");

  switch(index){
    case 0: case 1: case 2: line.classList.add("horizontal"); break;
    case 3: case 4: case 5: line.classList.add("vertical"); break;
    case 6: line.classList.add("diagonal1"); break;
    case 7: line.classList.add("diagonal2"); break;
  }

  document.querySelector(".board").appendChild(line);
}

// ==== SAVE STATS ====
function saveStat(player){
  const key = player === "X" ? "x" : "o";
  localStorage[key] = (+localStorage[key] || 0) + 1;
}