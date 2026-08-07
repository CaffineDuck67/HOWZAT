// HOWZAT?! — game logic

const STAT_CATEGORIES = [
  { key: "matches",      label: "Test Matches Played", unit: "matches" },
  { key: "runs",         label: "Career Runs",          unit: "runs"    },
  { key: "average",      label: "Batting Average",      unit: "average" },
  { key: "hundreds",     label: "Centuries (100s)",      unit: "hundreds"},
  { key: "highestScore", label: "Highest Score",        unit: "runs"    },
  { key: "wickets",      label: "Wickets Taken",        unit: "wickets" },
];

const MILESTONES = {
  3: "WARMING UP!",
  5: "ON FIRE! 🔥",
  8: "UNSTOPPABLE!",
  12: "LEGENDARY STREAK!",
  16: "CENTURY-MAKER FORM!",
  20: "ALL-TIME GREAT!",
};

const LB_KEY = "howzat-leaderboard";
const BEST_KEY = "howzat-best";
const SOUND_KEY = "howzat-sound";

let deck = [];
let currentPlayer = null;
let challenger = null;
let category = null;
let streak = 0;
let best = Number(localStorage.getItem(BEST_KEY) || 0);
let roundLocked = false;
let soundOn = localStorage.getItem(SOUND_KEY) !== "off";
let lastEntryKey = null;

const el = (id) => document.getElementById(id);

/* ============================================================
   Sound — tiny synthesized effects via Web Audio API.
   No external audio files needed, and it respects a mute toggle.
   ============================================================ */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs, { duration = 0.14, type = "sine", gain = 0.08 } = {}) {
  if (!soundOn) return;
  try {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + duration);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + duration + 0.02);
    });
  } catch {
    // Web Audio unavailable — fail silently, sound is a nice-to-have
  }
}

const sfx = {
  correct: () => playTone([523.25, 659.25, 783.99], { type: "triangle", gain: 0.09 }),
  wrong: () => playTone([196, 130.81], { type: "sawtooth", duration: 0.3, gain: 0.07 }),
  milestone: () => playTone([523.25, 659.25, 783.99, 1046.5], { type: "triangle", duration: 0.16, gain: 0.1 }),
  click: () => playTone([392], { type: "square", duration: 0.05, gain: 0.04 }),
};

/* ============================================================
   Deck management
   ============================================================ */
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

/* ============================================================
   Round flow
   ============================================================ */
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

  const barA = el("barA");
  const barB = el("barB");
  barA.classList.remove("wrong-bar");
  barB.classList.remove("wrong-bar");
  const maxVal = Math.max(currentPlayer[category.key], 1);
  barA.style.width = "0%";
  barB.style.width = "0%";
  requestAnimationFrame(() => {
    barA.style.width = Math.min(100, (currentPlayer[category.key] / maxVal) * 100) + "%";
  });

  el("higherBtn").disabled = false;
  el("lowerBtn").disabled = false;
}

function handleGuess(direction) {
  if (roundLocked) return;
  roundLocked = true;
  sfx.click();
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

  const barB = el("barB");
  const maxVal = Math.max(a, b, 1);
  el("barA").style.width = Math.min(100, (a / maxVal) * 100) + "%";
  requestAnimationFrame(() => {
    barB.style.width = Math.min(100, (b / maxVal) * 100) + "%";
    if (!correct) barB.classList.add("wrong-bar");
  });

  if (correct) {
    sfx.correct();
    streak += 1;
    el("streak").textContent = streak;
    pulseStreakBox();
    if (MILESTONES[streak]) showMilestone(MILESTONES[streak]);
    if (streak > best) {
      best = streak;
      el("best").textContent = best;
      localStorage.setItem(BEST_KEY, String(best));
      if (streak >= 3) burstConfetti();
    }
    el("cardB").classList.add("correct");
    setTimeout(() => {
      currentPlayer = challenger;
      startRound();
    }, 950);
  } else {
    sfx.wrong();
    el("cardB").classList.add("wrong");
    showOutStamp();
    setTimeout(() => endGame(), 1000);
  }
}

function pulseStreakBox() {
  const box = el("streak").closest(".score-box");
  box.classList.remove("pulse");
  void box.offsetWidth;
  box.classList.add("pulse");
}

function showMilestone(text) {
  sfx.milestone();
  const banner = el("milestoneBanner");
  banner.textContent = text;
  banner.classList.remove("hidden");
  requestAnimationFrame(() => banner.classList.add("show"));
  setTimeout(() => {
    banner.classList.remove("show");
    setTimeout(() => banner.classList.add("hidden"), 300);
  }, 1400);
}

function burstConfetti() {
  const layer = el("confettiLayer");
  const colors = ["#D8B144", "#F1ECDA", "#8C2F24", "#4C7A4F"];
  const pieces = 40;
  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
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

/* ============================================================
   Leaderboard (local, per-browser via localStorage)
   ============================================================ */
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
  list.forEach((entry, i) => {
    const li = document.createElement("li");
    const key = `${entry.name}-${entry.score}-${entry.date}`;
    if (i < 3) li.classList.add(`medal-${i + 1}`);
    if (key === lastEntryKey) li.classList.add("new-entry");
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
  const entry = { name: name.slice(0, 18), score: streak, date: new Date().toISOString() };
  list.push(entry);
  saveLeaderboard(list);
  lastEntryKey = `${entry.name}-${entry.score}-${entry.date}`;
  renderLeaderboard();
  el("submitScoreBtn").disabled = true;
  input.disabled = true;
  const top3 = getLeaderboard().sort((a, b) => b.score - a.score).slice(0, 3);
  if (top3.some((e) => e.date === entry.date && e.name === entry.name)) burstConfetti();
}

/* ============================================================
   Sound toggle
   ============================================================ */
function setSound(on) {
  soundOn = on;
  localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  const btn = el("soundToggle");
  btn.textContent = on ? "🔊" : "🔇";
  btn.setAttribute("aria-pressed", String(on));
}

/* ============================================================
   Wire up events
   ============================================================ */
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
    lastEntryKey = null;
    renderLeaderboard();
  }
});
el("soundToggle").addEventListener("click", () => setSound(!soundOn));

document.addEventListener("keydown", (e) => {
  const modalOpen = !el("gameOverModal").classList.contains("hidden");
  if (modalOpen) return; // let the modal's own controls handle input while it's open
  const key = e.key.toLowerCase();
  if (key === "arrowup" || key === "h") {
    e.preventDefault();
    handleGuess("higher");
  } else if (key === "arrowdown" || key === "l") {
    e.preventDefault();
    handleGuess("lower");
  }
});

/* ============================================================
   Init
   ============================================================ */
setSound(soundOn);
el("best").textContent = best;
renderLeaderboard();
startRound({ freshCurrent: true });
