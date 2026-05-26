import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 🔴 COMPONENTE GIOCO: MASTERMIND ORIGINAL
// ==========================================
function MastermindGame({ onBack }) {
  const MAX_ATTEMPTS = 10;
  const CODE_LENGTH = 4;
  const COLOR_PALETTE = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#e67e22', '#9b59b6'];

  const [secretCode, setSecretCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([null, null, null, null]);
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isWin, setIsWin] = useState(false);

  useEffect(() => { initGame(); }, []);

  const initGame = () => {
    const code = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
      code.push(Math.floor(Math.random() * 6));
    }
    setSecretCode(code);
    setCurrentGuess([null, null, null, null]);
    setAttemptsHistory([]);
    setGameOver(false);
    setStatusMsg('');
    setIsWin(false);
  };

  const selectColor = (colorIndex) => {
    if (gameOver) return;
    const freeIndex = currentGuess.indexOf(null);
    if (freeIndex !== -1) {
      const nextGuess = [...currentGuess];
      nextGuess[freeIndex] = colorIndex;
      setCurrentGuess(nextGuess);
    }
  };

  const clearSlot = (index) => {
    if (gameOver) return;
    const nextGuess = [...currentGuess];
    nextGuess[index] = null;
    setCurrentGuess(nextGuess);
  };

  const submitGuess = () => {
    if (gameOver || currentGuess.includes(null)) return;

    let blacks = 0;
    let whites = 0;
    let secretMatch = [false, false, false, false];
    let guessMatch = [false, false, false, false];

    for (let i = 0; i < CODE_LENGTH; i++) {
      if (currentGuess[i] === secretCode[i]) {
        blacks++;
        secretMatch[i] = true;
        guessMatch[i] = true;
      }
    }

    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessMatch[i]) continue;
      for (let j = 0; j < CODE_LENGTH; j++) {
        if (!secretMatch[j] && currentGuess[i] === secretCode[j]) {
          whites++;
          secretMatch[j] = true;
          break;
        }
      }
    }

    const newHistory = [...attemptsHistory, { guess: currentGuess, blacks, whites }];
    setAttemptsHistory(newHistory);
    setCurrentGuess([null, null, null, null]);

    if (blacks === CODE_LENGTH) {
      setGameOver(true);
      setIsWin(true);
      setStatusMsg('🏆 Vittoria! Hai decifrato il codice originale!');
    } else if (newHistory.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setIsWin(false);
      setStatusMsg('Game Over! Hai esaurito i 10 tentativi.');
    }
  };

  return (
    <div style={mStyles.wrapper}>
      <div style={tStyles.gameBar}>
        <button style={tStyles.backBtn} onClick={onBack}>◀ Home</button>
        <span style={{ fontWeight: 'bold' }}>🔴 Mastermind Classico</span>
        <button style={tStyles.playBtn} onClick={initGame}>Nuovo</button>
      </div>

      <div style={mStyles.attemptsBar}>
        <span style={mStyles.attemptsLabel}>TENTATIVI</span>
        <div style={mStyles.attemptsPips}>
          {Array(MAX_ATTEMPTS).fill().map((_, i) => (
            <div key={i} style={{
              ...mStyles.pip,
              backgroundColor: i < attemptsHistory.length
                ? (i < 4 ? '#50fa7b' : i < 7 ? '#f1c40f' : '#ff5555')
                : '#1e293b'
            }} />
          ))}
        </div>
        <span style={{ ...mStyles.attemptsCount, color: attemptsHistory.length >= 8 ? '#ff5555' : attemptsHistory.length >= 5 ? '#f1c40f' : '#50fa7b' }}>
          {attemptsHistory.length}/{MAX_ATTEMPTS}
        </span>
      </div>

      <div style={mStyles.container}>
        <div style={mStyles.secretRow}>
          {secretCode.map((colorIdx, i) => (
            <div key={i} style={{...mStyles.peg, backgroundColor: gameOver ? COLOR_PALETTE[colorIdx] : '#44475a'}}>
              {gameOver ? '' : '?'}
            </div>
          ))}
        </div>

        <div style={mStyles.board}>
          {attemptsHistory.map((att, i) => (
            <div key={i} style={mStyles.row}>
              <div style={mStyles.slots}>
                {att.guess.map((cIdx, j) => <div key={j} style={{...mStyles.peg, backgroundColor: COLOR_PALETTE[cIdx]}} />)}
              </div>
              <div style={mStyles.hints}>
                {Array(4).fill().map((_, j) => {
                  const color = j < att.blacks ? '#000' : j < att.blacks + att.whites ? '#fff' : '#6b7280';
                  return <div key={j} style={{...mStyles.hintDot, backgroundColor: color}} />;
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={mStyles.controls}>
          <div style={{...mStyles.row, border: '1px solid #50fa7b', background: '#282a36', padding: '8px'}}>
            <div style={mStyles.slots}>
              {currentGuess.map((cIdx, i) => (
                <div key={i} style={{...mStyles.peg, backgroundColor: cIdx !== null ? COLOR_PALETTE[cIdx] : '#111217'}} onClick={() => clearSlot(i)} />
              ))}
            </div>
            <button style={mStyles.submitBtn} disabled={currentGuess.includes(null) || gameOver} onClick={submitGuess}>Verifica</button>
          </div>

          <div style={mStyles.picker}>
            {COLOR_PALETTE.map((hex, i) => (
              <div key={i} style={{...mStyles.pickerPeg, backgroundColor: hex}} onClick={() => selectColor(i)} />
            ))}
          </div>
        </div>
        {statusMsg && <div style={{...mStyles.status, color: isWin ? '#50fa7b' : '#ff5555'}}>{statusMsg}</div>}
      </div>
    </div>
  );
}

// ==========================================
// 🧱 COMPONENTE GIOCO: TETRIS ARCADE
// ==========================================
function TetrisGame({ onBack }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const nextCanvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const stateRef = useRef({
    arena: Array(20).fill(null).map(() => Array(10).fill(0)),
    player: { pos: { x: 0, y: 0 }, matrix: null, nextMatrix: null },
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0,
    gameOver: false,
    blockSize: 24,
    score: 0
  });

  const COLORS = [null, '#00f0f0', '#f0a000', '#0000f0', '#f0f000', '#00f0f0', '#a000f0', '#f00000'];
  
  const SHAPES = [
    [],
    [[1, 1, 1, 1]], // I
    [[2, 0, 0], [2, 2, 2]], // L
    [[0, 0, 3], [3, 3, 3]], // J
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0]], // S
    [[0, 6, 0], [6, 6, 6]], // T
    [[7, 7, 0], [0, 7, 7]]  // Z
  ];

  const collide = (arena, player) => {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
      }
    }
    return false;
  };

  const merge = (arena, player) => {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
      });
    });
  };

  const randomShape = () => SHAPES[Math.floor(Math.random() * 7) + 1].map(row => [...row]);

  const playerReset = () => {
    const state = stateRef.current;
    if (!state.player.nextMatrix) state.player.nextMatrix = randomShape();
    state.player.matrix = state.player.nextMatrix;
    state.player.nextMatrix = randomShape();
    state.player.pos.y = 0;
    state.player.pos.x = Math.floor(state.arena[0].length / 2) - Math.floor(state.player.matrix[0].length / 2);

    drawNext();

    if (collide(state.arena, state.player)) {
      setIsRunning(false);
      alert(`Game Over! Punteggio Finale: ${state.score}`);
      state.arena.forEach(row => row.fill(0));
      state.score = 0;
      setScore(0);
      setLevel(1);
      state.dropInterval = 1000;
    }
  };

  const arenaSweep = () => {
    const state = stateRef.current;
    let rowCount = 1;
    outer: for (let y = state.arena.length - 1; y > 0; --y) {
      for (let x = 0; x < state.arena[y].length; ++x) {
        if (state.arena[y][x] === 0) continue outer;
      }
      state.arena.splice(y, 1);
      state.arena.unshift(Array(10).fill(0));
      ++y;
      state.score += rowCount * 10;
      setScore(state.score);
      const newLevel = Math.floor(state.score / 100) + 1;
      setLevel(newLevel);
      state.dropInterval = Math.max(100, 1000 - (newLevel - 1) * 100);
      rowCount *= 2;
    }
  };

  const playerDrop = () => {
    const state = stateRef.current;
    state.player.pos.y++;
    if (collide(state.arena, state.player)) {
      state.player.pos.y--;
      merge(state.arena, state.player);
      playerReset();
      arenaSweep();
    }
    state.dropCounter = 0;
    draw();
  };

  const playerMove = (dir) => {
    const state = stateRef.current;
    state.player.pos.x += dir;
    if (collide(state.arena, state.player)) state.player.pos.x -= dir;
    draw();
  };

  const rotateMatrix = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    // rotazione 90° oraria corretta per matrici non quadrate
    return Array.from({ length: cols }, (_, x) =>
      Array.from({ length: rows }, (_, y) => matrix[rows - 1 - y][x])
    );
  };

  const playerRotate = () => {
    const state = stateRef.current;
    const originalMatrix = state.player.matrix;
    const originalPos = state.player.pos.x;
    const rotated = rotateMatrix(originalMatrix);

    state.player.matrix = rotated;
    let offset = 1;
    while (collide(state.arena, state.player)) {
      state.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (Math.abs(offset) > rotated[0].length) {
        state.player.matrix = originalMatrix;
        state.player.pos.x = originalPos;
        return;
      }
    }
    draw();
  };

  const dropInstant = () => {
    const state = stateRef.current;
    while (!collide(state.arena, state.player)) state.player.pos.y++;
    state.player.pos.y--;
    merge(state.arena, state.player);
    playerReset();
    arenaSweep();
    draw();
  };

  const drawMatrix = (matrix, offset, ctx, size) => {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = COLORS[value];
          ctx.fillRect((x + offset.x) * size, (y + offset.y) * size, size, size);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = size * 0.05;
          ctx.strokeRect((x + offset.x) * size, (y + offset.y) * size, size, size);
        }
      });
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = stateRef.current.blockSize;
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(stateRef.current.arena, { x: 0, y: 0 }, ctx, size);
    if (stateRef.current.player.matrix) drawMatrix(stateRef.current.player.matrix, stateRef.current.player.pos, ctx, size);
  };

  const drawNext = () => {
    const canvas = nextCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const boxSize = canvas.width / 4;
    if (stateRef.current.player.nextMatrix) drawMatrix(stateRef.current.player.nextMatrix, { x: 0.5, y: 0.5 }, ctx, boxSize);
  };

  const resizeGame = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const availableHeight = window.innerHeight - 240;
    const availableWidth = container.clientWidth - 130;
    let size = Math.floor(availableHeight / 20);
    if (size * 10 > availableWidth) size = Math.floor(availableWidth / 10);
    size = Math.max(16, size);
    stateRef.current.blockSize = size;
    canvas.width = size * 10;
    canvas.height = size * 20;
    draw();
    drawNext();
  };

  useEffect(() => {
    playerReset();
    resizeGame();
    window.addEventListener('resize', resizeGame);
    
    const handleKeyDown = (e) => {
      if (!isRunning) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') playerMove(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') playerMove(1);
      if (e.key === 'ArrowDown' || e.key === 's') playerDrop();
      if (e.key === 'ArrowUp' || e.key === 'w') playerRotate();
      if (e.key === ' ') dropInstant();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', resizeGame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning]);

  useEffect(() => {
    let animationFrameId;
    const updateLoop = (time = 0) => {
      const state = stateRef.current;
      if (isRunning) {
        const deltaTime = time - state.lastTime;
        state.lastTime = time;
        state.dropCounter += deltaTime;
        if (state.dropCounter > state.dropInterval) playerDrop();
        draw();
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };
    if (isRunning) {
      stateRef.current.lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updateLoop);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  return (
    <div style={tStyles.wrapper}>
      <div style={tStyles.gameBar}>
        <button style={tStyles.backBtn} onClick={onBack}>◀ Home</button>
        <span style={{ fontWeight: 'bold' }}>🧱 Tetris Arcade</span>
        <button style={tStyles.playBtn} onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pausa' : 'Gioca'}</button>
      </div>
      <div ref={containerRef} style={tStyles.container}>
        <canvas ref={canvasRef} style={tStyles.board} />
        <div style={tStyles.sidebar}>
          <div style={tStyles.box}><h5>Punti</h5><div style={tStyles.value}>{score}</div></div>
          <div style={tStyles.box}><h5>Livello</h5><div style={tStyles.value}>{level}</div></div>
          <div style={tStyles.box}><h5>Next</h5><canvas ref={nextCanvasRef} width="70" height="70" style={{background:'#05050a', borderRadius:'4px'}} /></div>
        </div>
      </div>
      <div style={tStyles.touchPanel}>
        <button style={tStyles.touchBtn} onClick={() => playerMove(-1)}>◀</button>
        <button style={tStyles.touchBtn} onClick={playerRotate}>↻</button>
        <button style={tStyles.touchBtn} onClick={() => playerMove(1)}>▶</button>
        <button style={{...tStyles.touchBtn, gridColumn: 'span 2'}} onClick={dropInstant}>Spazio (Giù)</button>
        <button style={tStyles.touchBtn} onClick={playerDrop}>▼</button>
      </div>
    </div>
  );
}

// ==========================================
// 🖼️ COMPONENTE GENERICO: IFRAME GAME
// ==========================================
function IframeGame({ onBack, src, title, icon }) {
  return (
    <div style={iStyles.wrapper}>
      <div style={tStyles.gameBar}>
        <button style={tStyles.backBtn} onClick={onBack}>◀ Home</button>
        <span style={{ fontWeight: 'bold' }}>{icon} {title}</span>
        <div style={{ width: '60px' }} />
      </div>
      <iframe
        src={src}
        title={title}
        style={iStyles.frame}
      />
    </div>
  );
}

// ==========================================
// 📱 COMPONENTE PRINCIPALE (PORTALE)
// ==========================================
const GAMES = [
  { id: 'mastermind',  icon: '🔴', title: 'Mastermind',    desc: 'Indovina il codice segreto di 4 colori. Valgono le ripetizioni!',           color: '#e74c3c' },
  { id: 'tetris',      icon: '🧱', title: 'Tetris Arcade', desc: 'Incastra i mattoncini geometrici e distruggi le linee a tutto schermo.',    color: '#3498db' },
  { id: 'lightsout',   icon: '💡', title: 'Lights Out',    desc: 'Spegni tutte le luci: ogni click cambia la cella e i 4 vicini.',             color: '#f1c40f' },
  { id: 'yahtzee',     icon: '🎲', title: 'Yahtzee',       desc: 'Lancia 5 dadi fino a 3 volte per comporre le migliori combinazioni!',        color: '#9b59b6' },
  { id: 'minesweeper', icon: '💣', title: 'Minesweeper',   desc: 'Scopri tutte le celle senza far esplodere le mine nascoste!',               color: '#6b7280' },
  { id: 'sudoku',      icon: '🔢', title: 'Sudoku',        desc: 'Riempi la griglia 9×9 con i numeri da 1 a 9 senza ripetizioni.',            color: '#0ea5e9' },
];

export default function App() {
  const [schermata, setSchermata] = useState('home');

  return (
    <div style={styles.container}>
      <a
        href="https://github.com/massimilianopetra/retro-arcade"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.githubLink}
        title="Visualizza il codice sorgente su GitHub"
      >
        <svg height="28" viewBox="0 0 16 16" width="28" style={{ fill: '#94a3b8', transition: 'fill 0.2s' }} onMouseOver={(e) => e.currentTarget.style.fill = '#38bdf8'} onMouseOut={(e) => e.currentTarget.style.fill = '#94a3b8'}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>

      {schermata === 'home' && (
        <div style={styles.contentWrapper}>
          <header style={styles.header}>
            <h1 style={styles.title}>🎮 Retro Arcade Portal</h1>
            <p style={styles.subtitle}>Scegli un grande classico e inizia a giocare</p>
          </header>
          <div style={styles.grid}>
            {GAMES.map((g) => (
              <div key={g.id} style={{ ...styles.card, '--accent': g.color }}>
                <div style={styles.cardIcon}>{g.icon}</div>
                <h2 style={styles.cardTitle}>{g.title}</h2>
                <p style={styles.cardDesc}>{g.desc}</p>
                <button
                  style={{ ...styles.cardBtn, backgroundColor: g.color }}
                  onClick={() => setSchermata(g.id)}
                >
                  Gioca Ora
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {schermata === 'mastermind' && <MastermindGame onBack={() => setSchermata('home')} />}
      {schermata === 'tetris'     && <TetrisGame     onBack={() => setSchermata('home')} />}
      {schermata === 'lightsout'  && (
        <IframeGame onBack={() => setSchermata('home')} src={`${import.meta.env.BASE_URL}giochi/lightsout.html`} title="Lights Out" icon="💡" />
      )}
      {schermata === 'yahtzee'     && (
        <IframeGame onBack={() => setSchermata('home')} src={`${import.meta.env.BASE_URL}giochi/yatzee.html`}       title="Yahtzee"    icon="🎲" />
      )}
      {schermata === 'minesweeper' && (
        <IframeGame onBack={() => setSchermata('home')} src={`${import.meta.env.BASE_URL}giochi/mInesweeper.html`}  title="Minesweeper" icon="💣" />
      )}
      {schermata === 'sudoku'      && (
        <IframeGame onBack={() => setSchermata('home')} src={`${import.meta.env.BASE_URL}giochi/sodku.html`}        title="Sudoku"      icon="🔢" />
      )}
    </div>
  );
}

// === FILE STILI CONFIGURATI E RESPONSIVI ===
const styles = {
  container: { fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', width: '100vw', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  githubLink: { position: 'absolute', top: '20px', right: '20px', textDecoration: 'none', zIndex: 1000, display: 'flex', alignItems: 'center' },
  contentWrapper: { width: '100%', maxWidth: '560px', textAlign: 'center' },
  header: { marginBottom: '25px' },
  title: { fontSize: '2.2rem', margin: '0 0 8px 0', color: '#38bdf8', fontWeight: 'bold' },
  subtitle: { margin: '0', color: '#94a3b8', fontSize: '0.95rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%' },
  card: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '22px 18px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  cardIcon: { fontSize: '2.6rem', marginBottom: '10px' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: 'bold' },
  cardDesc: { color: '#94a3b8', fontSize: '0.8rem', marginBottom: '18px', lineHeight: '1.5', flexGrow: 1 },
  cardBtn: { color: '#0f172a', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }
};

const iStyles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '520px', height: 'calc(100vh - 40px)', boxSizing: 'border-box' },
  frame: { flex: 1, border: 'none', borderRadius: '14px', width: '100%', overflow: 'auto' },
};

const tStyles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '500px', boxSizing: 'border-box' },
  gameBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '10px 15px', borderRadius: '10px', border: '1px solid #334155' },
  backBtn: { backgroundColor: '#475569', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  playBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  container: { display: 'flex', gap: '15px', backgroundColor: '#161d31', padding: '15px', borderRadius: '14px', border: '1px solid #334155', justifyContent: 'center', width: '100%', boxSizing: 'border-box' },
  board: { border: '2px solid #4e4e6a', backgroundColor: '#05050a', borderRadius: '6px', display: 'block' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100px' },
  box: { backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 4px', borderRadius: '8px', textAlign: 'center' },
  value: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' },
  touchPanel: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%', marginTop: '5px' },
  touchBtn: { backgroundColor: '#2e374d', border: '1px solid #47536e', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }
};

const mStyles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '420px', boxSizing: 'border-box' },
  container: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' },
  secretRow: { display: 'flex', justifyContent: 'center', gap: '12px', paddingBottom: '15px', borderBottom: '2px dashed #334155' },
  board: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111217', padding: '6px 12px', borderRadius: '8px' },
  slots: { display: 'flex', gap: '10px' },
  peg: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', cursor: 'pointer' },
  hints: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', background: '#6b7280', padding: '4px', borderRadius: '4px' },
  hintDot: { width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #9ca3af' },
  controls: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a', padding: '10px', borderRadius: '10px' },
  picker: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
  pickerPeg: { width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #000', cursor: 'pointer' },
  submitBtn: { backgroundColor: '#50fa7b', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  status: { textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' },
  attemptsBar: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155' },
  attemptsLabel: { fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px', whiteSpace: 'nowrap' },
  attemptsPips: { display: 'flex', gap: '4px', flex: 1 },
  pip: { flex: 1, height: '8px', borderRadius: '3px', border: '1px solid #334155', transition: 'background-color 0.3s' },
  attemptsCount: { fontSize: '0.85rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'right' }
};
