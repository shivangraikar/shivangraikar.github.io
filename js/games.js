// ============================================
// GAMES — Minesweeper & Solitaire
// ============================================

// ===== MINESWEEPER =====
(function () {
  "use strict";

  var ROWS = 9;
  var COLS = 9;
  var MINES = 10;

  var gridEl = document.getElementById("mineGrid");
  if (!gridEl) return;

  var countEl = document.getElementById("mineCount");
  var timerEl = document.getElementById("mineTimer");
  var faceEl = document.getElementById("mineFace");
  var flagToggleEl = document.getElementById("mineFlagToggle");
  var newGameEl = document.getElementById("mineNewGame");

  var board, revealed, flagged, gameOver, gameWon, started, minesPlaced;
  var flagMode = false;
  var timer = 0;
  var timerInterval = null;

  function pad3(n) {
    n = Math.max(0, Math.min(999, n));
    return String(n).padStart(3, "0");
  }

  function neighbors(r, c) {
    var out = [];
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = r + dr;
        var nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
      }
    }
    return out;
  }

  function reset() {
    board = [];
    revealed = [];
    flagged = [];
    for (var r = 0; r < ROWS; r++) {
      board.push(new Array(COLS).fill(0));
      revealed.push(new Array(COLS).fill(false));
      flagged.push(new Array(COLS).fill(false));
    }
    gameOver = false;
    gameWon = false;
    started = false;
    minesPlaced = false;
    timer = 0;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    timerEl.textContent = pad3(0);
    faceEl.textContent = "\u{1F642}";
    render();
  }

  // Mines are placed after the first click so it's never a mine
  function placeMines(safeR, safeC) {
    var placed = 0;
    while (placed < MINES) {
      var r = Math.floor(Math.random() * ROWS);
      var c = Math.floor(Math.random() * COLS);
      if (board[r][c] === -1) continue;
      if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
      board[r][c] = -1;
      placed++;
    }
    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLS; j++) {
        if (board[i][j] === -1) continue;
        var count = 0;
        neighbors(i, j).forEach(function (n) {
          if (board[n[0]][n[1]] === -1) count++;
        });
        board[i][j] = count;
      }
    }
    minesPlaced = true;
  }

  function startTimer() {
    if (started) return;
    started = true;
    timerInterval = setInterval(function () {
      timer++;
      timerEl.textContent = pad3(timer);
    }, 1000);
  }

  function flagCount() {
    var n = 0;
    for (var r = 0; r < ROWS; r++)
      for (var c = 0; c < COLS; c++) if (flagged[r][c]) n++;
    return n;
  }

  function reveal(r, c) {
    if (revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (board[r][c] === 0) {
      neighbors(r, c).forEach(function (n) {
        reveal(n[0], n[1]);
      });
    }
  }

  function checkWin() {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (board[r][c] !== -1 && !revealed[r][c]) return false;
      }
    }
    return true;
  }

  function endGame(won) {
    gameOver = true;
    gameWon = won;
    if (timerInterval) clearInterval(timerInterval);
    faceEl.textContent = won ? "\u{1F60E}" : "\u{1F635}";
  }

  function handleReveal(r, c) {
    if (gameOver || flagged[r][c]) return;
    if (!minesPlaced) placeMines(r, c);
    startTimer();
    if (board[r][c] === -1) {
      revealed[r][c] = true;
      endGame(false);
    } else {
      reveal(r, c);
      if (checkWin()) endGame(true);
    }
    render();
  }

  function handleFlag(r, c) {
    if (gameOver || revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    render();
  }

  function render() {
    countEl.textContent = pad3(MINES - flagCount());
    gridEl.innerHTML = "";
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var cell = document.createElement("button");
        cell.className = "mine-cell";
        if (revealed[r][c]) {
          cell.classList.add("open");
          if (board[r][c] === -1) {
            cell.classList.add("boom");
            cell.textContent = "\u{1F4A3}";
          } else if (board[r][c] > 0) {
            cell.textContent = board[r][c];
            cell.classList.add("n" + board[r][c]);
          }
        } else if (gameOver && !gameWon && board[r][c] === -1) {
          cell.textContent = "\u{1F4A3}";
        } else if (flagged[r][c]) {
          cell.textContent = "\u{1F6A9}";
        }
        (function (r, c) {
          cell.addEventListener("click", function () {
            if (flagMode) handleFlag(r, c);
            else handleReveal(r, c);
          });
          cell.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            handleFlag(r, c);
          });
        })(r, c);
        gridEl.appendChild(cell);
      }
    }
  }

  faceEl.addEventListener("click", reset);
  newGameEl.addEventListener("click", reset);
  flagToggleEl.addEventListener("click", function () {
    flagMode = !flagMode;
    flagToggleEl.textContent = "\u{1F6A9} Flag mode: " + (flagMode ? "ON" : "OFF");
    flagToggleEl.classList.toggle("on", flagMode);
  });

  reset();
})();

// ===== SOLITAIRE (Klondike, draw-1) =====
(function () {
  "use strict";

  var stockEl = document.getElementById("solStock");
  if (!stockEl) return;

  var wasteEl = document.getElementById("solWaste");
  var foundationsEl = document.getElementById("solFoundations");
  var tableauEl = document.getElementById("solTableau");
  var newGameEl = document.getElementById("solNewGame");

  var SUITS = ["♠", "♥", "♦", "♣"];
  var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  var stock, waste, foundations, tableau;
  // selection: {source: 'waste'|'tableau', pile: idx, index: idx-in-pile}
  var selection = null;

  function isRed(card) {
    return card.suit === "♥" || card.suit === "♦";
  }

  function newGame() {
    var deck = [];
    SUITS.forEach(function (suit) {
      RANKS.forEach(function (rank, i) {
        deck.push({ suit: suit, rank: rank, value: i + 1, faceUp: false });
      });
    });
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = deck[i];
      deck[i] = deck[j];
      deck[j] = t;
    }
    tableau = [];
    for (var p = 0; p < 7; p++) {
      var pile = deck.splice(0, p + 1);
      pile[pile.length - 1].faceUp = true;
      tableau.push(pile);
    }
    stock = deck;
    waste = [];
    foundations = [[], [], [], []];
    selection = null;
    render();
  }

  function drawCard() {
    selection = null;
    if (stock.length === 0) {
      // Recycle waste back into stock
      while (waste.length) {
        var c = waste.pop();
        c.faceUp = false;
        stock.push(c);
      }
    } else {
      var card = stock.pop();
      card.faceUp = true;
      waste.push(card);
    }
    render();
  }

  function canPlaceOnTableau(card, pile) {
    if (pile.length === 0) return card.value === 13;
    var top = pile[pile.length - 1];
    return top.faceUp && top.value === card.value + 1 && isRed(top) !== isRed(card);
  }

  function canPlaceOnFoundation(card, f) {
    if (f.length === 0) return card.value === 1;
    var top = f[f.length - 1];
    return top.suit === card.suit && card.value === top.value + 1;
  }

  function getSelectedCards() {
    if (!selection) return [];
    if (selection.source === "waste") return waste.slice(-1);
    return tableau[selection.pile].slice(selection.index);
  }

  function removeSelectedCards() {
    if (selection.source === "waste") {
      waste.pop();
    } else {
      tableau[selection.pile].splice(selection.index);
      var pile = tableau[selection.pile];
      if (pile.length && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1].faceUp = true;
      }
    }
  }

  function tryMoveToFoundation(cards) {
    if (cards.length !== 1) return false;
    for (var f = 0; f < 4; f++) {
      if (canPlaceOnFoundation(cards[0], foundations[f])) {
        removeSelectedCards();
        foundations[f].push(cards[0]);
        return true;
      }
    }
    return false;
  }

  function checkWin() {
    var total = foundations.reduce(function (s, f) {
      return s + f.length;
    }, 0);
    if (total === 52) {
      setTimeout(function () {
        alert("You win! \u{1F3C6} All 52 cards home.");
      }, 100);
    }
  }

  function clickFoundation(fIdx) {
    if (!selection) return;
    var cards = getSelectedCards();
    if (cards.length === 1 && canPlaceOnFoundation(cards[0], foundations[fIdx])) {
      removeSelectedCards();
      foundations[fIdx].push(cards[0]);
      selection = null;
      render();
      checkWin();
    } else {
      selection = null;
      render();
    }
  }

  function clickTableau(pIdx, cardIdx) {
    var pile = tableau[pIdx];

    if (selection) {
      // Try to move selection onto this pile
      var cards = getSelectedCards();
      var isSameSpot =
        selection.source === "tableau" && selection.pile === pIdx;
      if (!isSameSpot && cards.length && canPlaceOnTableau(cards[0], pile)) {
        removeSelectedCards();
        tableau[pIdx] = pile.concat(cards);
        selection = null;
        render();
        return;
      }
      selection = null;
      render();
      return;
    }

    // No selection: select if face-up card
    if (cardIdx === null || !pile.length) return;
    var card = pile[cardIdx];
    if (!card.faceUp) {
      // Clicking a face-down top card flips it (shouldn't normally happen)
      if (cardIdx === pile.length - 1) {
        card.faceUp = true;
        render();
      }
      return;
    }
    selection = { source: "tableau", pile: pIdx, index: cardIdx };
    render();
  }

  function dblClickCard(source, pIdx, cardIdx) {
    if (source === "waste") {
      if (!waste.length) return;
      selection = { source: "waste" };
    } else {
      var pile = tableau[pIdx];
      if (cardIdx !== pile.length - 1 || !pile[cardIdx].faceUp) return;
      selection = { source: "tableau", pile: pIdx, index: cardIdx };
    }
    var cards = getSelectedCards();
    if (tryMoveToFoundation(cards)) {
      selection = null;
      render();
      checkWin();
    } else {
      selection = null;
      render();
    }
  }

  function cardEl(card, extraClass) {
    var el = document.createElement("div");
    el.className = "sol-card " + (extraClass || "");
    if (!card.faceUp) {
      el.classList.add("face-down");
      return el;
    }
    el.classList.add(isRed(card) ? "red" : "black");
    var corner = document.createElement("span");
    corner.className = "sol-corner";
    corner.textContent = card.rank + card.suit;
    var center = document.createElement("span");
    center.className = "sol-center";
    center.textContent = card.suit;
    el.appendChild(corner);
    el.appendChild(center);
    return el;
  }

  function isSelected(source, pIdx, cardIdx) {
    if (!selection) return false;
    if (selection.source !== source) return false;
    if (source === "waste") return true;
    return selection.pile === pIdx && cardIdx >= selection.index;
  }

  function render() {
    // Stock
    stockEl.innerHTML = "";
    stockEl.classList.toggle("empty", stock.length === 0);
    if (stock.length) {
      var back = document.createElement("div");
      back.className = "sol-card face-down";
      stockEl.appendChild(back);
    } else {
      stockEl.innerHTML = "<span class='sol-recycle'>↻</span>";
    }

    // Waste
    wasteEl.innerHTML = "";
    if (waste.length) {
      var top = waste[waste.length - 1];
      var el = cardEl(top);
      if (isSelected("waste")) el.classList.add("selected");
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        selection =
          selection && selection.source === "waste"
            ? null
            : { source: "waste" };
        render();
      });
      el.addEventListener("dblclick", function (e) {
        e.stopPropagation();
        dblClickCard("waste");
      });
      wasteEl.appendChild(el);
    }

    // Foundations
    foundationsEl.innerHTML = "";
    foundations.forEach(function (f, fIdx) {
      var pileEl = document.createElement("div");
      pileEl.className = "sol-pile sol-foundation";
      if (f.length) {
        pileEl.appendChild(cardEl(f[f.length - 1]));
      } else {
        pileEl.innerHTML = "<span class='sol-ace'>A</span>";
      }
      pileEl.addEventListener("click", function () {
        clickFoundation(fIdx);
      });
      foundationsEl.appendChild(pileEl);
    });

    // Tableau
    tableauEl.innerHTML = "";
    tableau.forEach(function (pile, pIdx) {
      var pileEl = document.createElement("div");
      pileEl.className = "sol-pile sol-tab-pile";
      if (!pile.length) {
        pileEl.classList.add("empty");
        pileEl.addEventListener("click", function () {
          clickTableau(pIdx, null);
        });
      }
      pile.forEach(function (card, cardIdx) {
        var el = cardEl(card);
        el.style.top = cardIdx * 22 + "px";
        if (isSelected("tableau", pIdx, cardIdx)) el.classList.add("selected");
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          clickTableau(pIdx, cardIdx);
        });
        el.addEventListener("dblclick", function (e) {
          e.stopPropagation();
          dblClickCard("tableau", pIdx, cardIdx);
        });
        pileEl.appendChild(el);
      });
      // Reserve height for the stacked cards
      pileEl.style.minHeight = 96 + (pile.length ? (pile.length - 1) * 22 : 0) + "px";
      tableauEl.appendChild(pileEl);
    });
  }

  stockEl.addEventListener("click", drawCard);
  newGameEl.addEventListener("click", newGame);

  newGame();
})();
