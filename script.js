const queenInput = document.querySelector('#queenInput');
const addQueenBtn = document.querySelector('#addQueenBtn');
const fillSampleBtn = document.querySelector('#fillSampleBtn');
const clearBtn = document.querySelector('#clearBtn');
const startBtn = document.querySelector('#startBtn');
const nextEpisodeBtn = document.querySelector('#nextEpisodeBtn');
const queenList = document.querySelector('#queenList');
const episodeLog = document.querySelector('#episodeLog');
const seasonState = document.querySelector('#seasonState');
const episodeTemplate = document.querySelector('#episodeTemplate');

const sampleQueens = [
  'Bianca Del Rio',
  'Sasha Velour',
  'Jinkx Monsoon',
  'Aquaria',
  'Bob the Drag Queen',
  'Symone',
  'Shea Couleé',
  'Anetra',
  'Willow Pill',
  'Trixie Mattel',
];

const challenges = [
  'Girl Group Performance',
  'Snatch Game',
  'Rusical',
  'Design Challenge',
  'Acting Challenge',
  'Roast',
  'Improv Comedy',
  'Ball Challenge',
];

const state = {
  queens: [],
  seasonStarted: false,
  episode: 0,
};

function addQueen(name) {
  const cleanName = name.trim();
  if (!cleanName) return;
  if (state.queens.some((queen) => queen.name.toLowerCase() === cleanName.toLowerCase())) return;

  state.queens.push({ name: cleanName, trackRecord: [] });
  renderQueens();
}

function renderQueens() {
  queenList.innerHTML = '';
  for (const queen of state.queens) {
    const li = document.createElement('li');
    const wins = queen.trackRecord.filter((entry) => entry === 'WIN').length;
    li.textContent = queen.name;

    if (wins) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `${wins} WIN`;
      li.appendChild(badge);
    }

    queenList.appendChild(li);
  }

  startBtn.disabled = state.seasonStarted || state.queens.length < 6;

  if (!state.seasonStarted) {
    seasonState.textContent = state.queens.length >= 6
      ? 'Ready to start!'
      : 'Add at least 6 queens to begin.';
  }
}

function weightedScore() {
  return Math.random() * 100;
}

function runEpisode() {
  if (!state.seasonStarted || state.queens.length <= 1) return;

  state.episode += 1;
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];

  const ranked = state.queens
    .map((queen) => ({ queen, score: weightedScore() }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0].queen;
  const bottomTwo = ranked.slice(-2).map((entry) => entry.queen);
  const eliminated = bottomTwo[Math.floor(Math.random() * bottomTwo.length)];

  winner.trackRecord.push('WIN');
  bottomTwo.forEach((queen) => queen.trackRecord.push('BTM'));

  const elimIndex = state.queens.findIndex((queen) => queen.name === eliminated.name);
  state.queens.splice(elimIndex, 1);

  const node = episodeTemplate.content.cloneNode(true);
  node.querySelector('h3').textContent = `Episode ${state.episode}: ${challenge}`;

  const lines = [
    `Winner: ${winner.name}`,
    `Bottom 2: ${bottomTwo[0].name} & ${bottomTwo[1].name}`,
    `Eliminated: ${eliminated.name}`,
    `${state.queens.length} queens remain.`,
  ];

  for (const line of lines) {
    const li = document.createElement('li');
    li.textContent = line;
    node.querySelector('ul').appendChild(li);
  }

  episodeLog.prepend(node);
  renderQueens();

  if (state.queens.length === 1) {
    nextEpisodeBtn.disabled = true;
    const champion = state.queens[0];
    seasonState.textContent = `${champion.name} wins the crown! 👑`;
  }
}

addQueenBtn.addEventListener('click', () => {
  addQueen(queenInput.value);
  queenInput.value = '';
  queenInput.focus();
});

queenInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addQueen(queenInput.value);
    queenInput.value = '';
  }
});

fillSampleBtn.addEventListener('click', () => {
  if (state.seasonStarted) return;
  state.queens = [];
  sampleQueens.forEach(addQueen);
  renderQueens();
});

clearBtn.addEventListener('click', () => {
  if (state.seasonStarted) return;
  state.queens = [];
  renderQueens();
});

startBtn.addEventListener('click', () => {
  state.seasonStarted = true;
  state.episode = 0;
  seasonState.textContent = 'Season started. Let the games begin!';
  episodeLog.innerHTML = '';
  nextEpisodeBtn.disabled = false;
  startBtn.disabled = true;
});

nextEpisodeBtn.addEventListener('click', runEpisode);

renderQueens();
