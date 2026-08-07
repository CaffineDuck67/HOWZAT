// HOWZAT?! — game logic

const STAT_CATEGORIES = [
  { key: "matches",      label: "Test Matches Played", unit: "matches" },
  { key: "runs",         label: "Career Runs",          unit: "runs"    },
  { key: "average",      label: "Batting Average",      unit: "average" },
  { key: "hundreds",     label: "Centuries (100s)",      unit: "hundreds"},
  { key: "highestScore", label: "Highest Score",        unit: "runs"    },
  { key: "wickets",      label: "Wickets Taken",        unit: "wickets" },
];

const LB_KEY = "howzat-leaderboard";
const BEST_KEY = "howzat-best";

let deck = [];
let currentPlayer = null;
let challenger = null;
let category = null;
let streak = 0;
let best = Number(localStorage.getItem(BEST_KEY) || 0);
let roundLocked = false;

const el = (id) => document.getElementById(id);

function shuffledDeck() {
  const arr = [...PLAYERS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawPlayer(exclude) {
  if (deck.length === 0) deck = shuffledDeck();
  // avoid drawing the same player twice in a row
  let tries = 0;
  let p = deck.pop();
  while (exclude && p.name === exclude.name && deck.length > 0 && tries < 10) {
    deck.unshift(p);
    p = deck.pop();
    tries++;
  }
  return p;
}

function pickCategory() {
  return STAT_CATEGORIES[Math.floor(Math.random() * STAT_CATEGORIES.length)];
}

function formatValue(value, key) {
  if (key === "average") return value.toFixed(2);
  return String(value);
}

function renderCard(prefix, player) {
  el(`name${prefix}`).textContent = player.name;
  el(`country${prefix}`).textContent = player.country;
  el(`era${prefix}`).textContent = player.era;
}

function startRound({ freshCurrent } = {}) {
  roundLocked = false;
  category = pickCategory();
  el("statCategory").textContent = category.label;

  if (freshCurrent || !currentPlayer) {
    currentPlayer = drawPlayer();
  }
  challenger = drawPlayer(currentPlayer);

  renderCard("A", currentPlayer);
  renderCard("B", challenger);

  el("valueA").textContent = formatValue(currentPlayer[category.key], category.key);
  el("unitA").textContent = category.unit;

  el("valueB").textContent = "?";
  el("unitB").textContent = "";

  el("cardA").classList.remove("correct", "wrong");
  el("cardB").classList.remove("correct", "wrong");

  el("higherBtn").disabled = false;
  el("lowerBtn").disabled = false;
}

function handleGuess(direction) {
  if (roundLocked) return;
  roundLocked = true;
  el("higherBtn").disabled = true;
  el("lowerBtn").disabled = true;

  const a = currentPlayer[category.key];
  const b = challenger[category.key];
  const actual = b === a ? "tie" : b > a ? "higher" : "lower";
  const correct = actual === "tie" || actual === direction;

  const valueB = el("valueB");
  valueB.textContent = formatValue(b, category.key);
  el("unitB").textContent = category.unit;
  valueB.classList.remove("flip");
  void valueB.offsetWidth; // restart animation
  valueB.classList.add("flip");

  if (correct) {
    streak += 1;
    el("streak").textContent = streak;
    if (streak > best) {
      best = streak;
      el("best").textContent = best;
      localStorage.setItem(BEST_KEY, String(best));
    }
    el("cardB").classList.add("correct");
    setTimeout(() => {
      currentPlayer = challenger;
      startRound();
    }, 950);
  } else {
    el("cardB").classList.add("wrong");
    showOutStamp();
    setTimeout(() => endGame(), 1000);
  }
}

function showOutStamp() {
  const stamp = el("outStamp");
  stamp.classList.remove("hidden");
  requestAnimationFrame(() => stamp.classList.add("show"));
}

function hideOutStamp() {
  const stamp = el("outStamp");
  stamp.classList.remove("show");
  setTimeout(() => stamp.classList.add("hidden"), 200);
}

function endGame() {
  el("finalStreak").textContent = streak;
  el("modalSub").textContent =
    streak === 0
      ? "No runs on the board this time — have another go."
      : `You correctly compared ${streak} stat${streak === 1 ? "" : "s"} in a row.`;
  el("gameOverModal").classList.remove("hidden");
  el("playerNameInput").value = "";
  el("playerNameInput").focus();
}

function resetRound() {
  hideOutStamp();
  el("gameOverModal").classList.add("hidden");
  streak = 0;
  el("streak").textContent = "0";
  currentPlayer = null;
  startRound({ freshCurrent: true });
}

function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLeaderboard(list) {
  localStorage.setItem(LB_KEY, JSON.stringify(list));
}

function renderLeaderboard() {
  const list = getLeaderboard().sort((a, b) => b.score - a.score).slice(0, 10);
  const ol = el("leaderboardList");
  const empty = el("leaderboardEmpty");
  ol.innerHTML = "";
  if (list.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  list.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="lb-name">${escapeHtml(entry.name)}</span><span class="lb-score">${entry.score}</span>`;
    ol.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function submitScore() {
  const input = el("playerNameInput");
  const name = input.value.trim() || "Anonymous";
  const list = getLeaderboard();
  list.push({ name: name.slice(0, 18), score: streak, date: new Date().toISOString() });
  saveLeaderboard(list);
  renderLeaderboard();
  el("submitScoreBtn").disabled = true;
  input.disabled = true;
}

// ---------- wire up events ----------
el("higherBtn").addEventListener("click", () => handleGuess("higher"));
el("lowerBtn").addEventListener("click", () => handleGuess("lower"));
el("submitScoreBtn").addEventListener("click", submitScore);
el("playerNameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitScore();
});
el("playAgainBtn").addEventListener("click", () => {
  el("submitScoreBtn").disabled = false;
  el("playerNameInput").disabled = false;
  resetRound();
});
el("clearBoardBtn").addEventListener("click", () => {
  if (confirm("Reset the leaderboard? This can't be undone.")) {
    saveLeaderboard([]);
    renderLeaderboard();
  }
});

// ---------- init ----------
el("best").textContent = best;
renderLeaderboard();
startRound({ freshCurrent: true });
