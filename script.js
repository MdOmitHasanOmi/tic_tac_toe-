
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let mode = localStorage.mode || "cpu";         
let level = localStorage.level || "simple";
let p1 = localStorage.p1 || "You";
let p2 = mode === "cpu" ? "Computer" : (localStorage.p2 || "Player O");

const statusEl = document.getElementById("status");
const playersEl = document.getElementById("players");

statusEl.textContent = `${p1} Turn`;
playersEl.innerHTML = `
  <div class="active">${p1} (X)</div>
  <div>${p2} (O)</div>
`;

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]          
];

let winningCells = [];

function play(index){
  if(board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  document.getElementsByClassName("cell")[index].textContent = currentPlayer;

  if(checkWinner()){
    gameActive = false;
    highlightWinningCells();
    statusEl.textContent = `${currentPlayer==="X"?p1:p2} Wins 🎉`;
    saveStat(currentPlayer);
    return;
  }

  if(!board.includes("")){
    gameActive = false;
    statusEl.textContent = "Draw 🤝";
    localStorage.d = (+localStorage.d || 0) + 1;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `${currentPlayer==="X"?p1:p2} Turn`;

  if(mode === "cpu" && currentPlayer === "O" && gameActive){
    setTimeout(aiMove, 300);
  }
}

function checkWinner(){
  winningCells = [];
  for(let [a,b,c] of winningCombinations){
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      winningCells = [a,b,c];
      return true;
    }
  }
  return false;
}

function highlightWinningCells(){
  const cells = document.getElementsByClassName("cell");
  for(let i of winningCells){
    cells[i].classList.add("win");
  }
}

function aiMove(){
  let move;
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);

  if(level === "simple"){
    move = empty[Math.floor(Math.random()*empty.length)];
  } else if(level === "normal"){
    // Block or win
    move = normalMove();
  } else if(level === "hard"){
    move = minimax(board, "O").index;
  }

  play(move);
}


function normalMove(){
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  for(let i of empty){
    board[i] = "O";
    if(checkWinner()){ board[i]=""; return i; }
    board[i] = "";
  }
  for(let i of empty){
    board[i] = "X";
    if(checkWinner()){ board[i]=""; return i; }
    board[i] = "";
  }
  return empty[Math.floor(Math.random()*empty.length)];
}

// Hard AI: Minimax
function minimax(newBoard, player){
  const empty = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  if(checkStaticWinner(newBoard,"X")) return {score:-10};
  if(checkStaticWinner(newBoard,"O")) return {score:10};
  if(empty.length===0) return {score:0};

  let moves = [];
  for(let i of empty){
    let move = {index:i};
    newBoard[i] = player;
    let result = minimax(newBoard, player==="O"?"X":"O");
    move.score = result.score;
    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if(player==="O"){
    let bestScore=-Infinity;
    for(let m of moves) if(m.score>bestScore){ bestScore=m; bestScore=m; }
  } else {
    let bestScore=Infinity;
    for(let m of moves) if(m.score<bestScore){ bestScore=m; bestScore=m; }
  }
  return bestMove;
}

function checkStaticWinner(bd, player){
  for(let [a,b,c] of winningCombinations){
    if(bd[a]===player && bd[b]===player && bd[c]===player) return true;
  }
  return false;
}

function reset(){
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusEl.textContent = `${p1} Turn`;
  const cells = document.getElementsByClassName("cell");
  for(let cell of cells){ cell.textContent=""; cell.classList.remove("win"); }
  winningCells = [];
  const line = document.querySelector(".win-line");
  if(line) line.remove();
}

function goBack(){
  window.history.back();
}

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

function saveStat(player){
  const key = player==="X"?"x":"o";
  localStorage[key] = (+localStorage[key]||0)+1;
}
function updatePlayersDisplay(){
  const nameO = (mode === "cpu") ? "Computer" : p2;
  playersEl.innerHTML = `
    <div class="${currentPlayer==='X'?'active':''}">${p1} (X)</div>
    <div class="${currentPlayer==='O'?'active':''}">${nameO} (O)</div>
  `;
}


updatePlayersDisplay();
statusEl.textContent = `${p1} Turn`;


currentPlayer = currentPlayer === "X" ? "O" : "X";
statusEl.textContent = `${currentPlayer==="X"?p1:(mode==="cpu"?"Computer":p2)} Turn`;
updatePlayersDisplay();
