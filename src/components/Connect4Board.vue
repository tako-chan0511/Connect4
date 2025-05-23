<template>
  <div class="connect4">
    <p>
      現在の手番:
      <span :class="currentDisc === 'R' ? 'red' : 'yellow'">
        {{ currentDisc === 'R' ? '🔴' : '🟡' }}
      </span>
      <button @click="undo" :disabled="history.length <= 1">⏪ Undo</button>
      <button @click="reset">🔄 Restart</button>
    </p>

    <div class="board">
      <div
        class="column"
        v-for="col in cols"
        :key="col"
        @click="dropDisc(col)"
      >
        <Cell
          v-for="row in rows"
          :key="row"
          :value="board[row][col]"
        />
      </div>
    </div>

    <div v-if="winner" class="overlay">
      <p class="message">
        {{ winner === 'Draw'
          ? '引き分け！'
          : winner === 'R'
            ? '🔴 が勝利！'
            : '🟡 が勝利！' }}
      </p>
      <button @click="reset">再スタート</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import Cell from './Cell.vue';

type CellValue = 'R' | 'Y' | null;

const COLUMNS = 7;
const ROWS = 6;
const cols = Array.from({ length: COLUMNS }, (_, i) => i);
const rows = Array.from({ length: ROWS }, (_, i) => i);

// 盤面＋手番＋勝者＋履歴
const board = ref<CellValue[][]>(
  Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null))
);
const currentDisc = ref<CellValue>('R');
const winner = ref<CellValue | 'Draw' | null>(null);
const history = ref<CellValue[][][]>([]);

// 深いコピーユーティリティ
function cloneBoard(b: CellValue[][]): CellValue[][] {
  return b.map(row => [...row]);
}

// 初期化
function reset() {
  board.value = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  currentDisc.value = 'R';
  winner.value = null;
  history.value = [ cloneBoard(board.value) ];
}
reset();

// Undo
function undo() {
  if (history.value.length <= 1) return;
  history.value.pop();
  board.value = cloneBoard(history.value[history.value.length - 1]);
  // 手番を1手戻す
  currentDisc.value = currentDisc.value === 'R' ? 'Y' : 'R';
  winner.value = null;
}

// コマを落とす＆履歴保存＆勝敗判定＆手番切り替え
function doMove(color: CellValue, col: number): boolean {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board.value[r][col] === null) {
      history.value.push(cloneBoard(board.value));
      board.value[r][col] = color;
      // 勝敗チェック
      if (hasWon(board.value, color)) {
        winner.value = color;
      } else if (validColumns(board.value).length === 0) {
        winner.value = 'Draw';
      } else {
        currentDisc.value = color === 'R' ? 'Y' : 'R';
      }
      return true;
    }
  }
  return false;
}

// 人間（🔴）の一手
function dropDisc(col: number) {
  if (winner.value || currentDisc.value !== 'R') return;
  doMove('R', col);
}

// CPU（🟡）の一手
watch(currentDisc, async disc => {
  if (disc === 'Y' && !winner.value) {
    await nextTick();
    const cpuCol = computeBestMove(board.value, 'Y', 4);
    doMove('Y', cpuCol);
  }
});

// 置ける列リスト
function validColumns(b: CellValue[][]): number[] {
  const out: number[] = [];
  for (let c = 0; c < COLUMNS; c++) {
    if (b[0][c] === null) out.push(c);
  }
  return out;
}

// 4連判定
function hasWon(b: CellValue[][], v: CellValue): boolean {
  if (!v) return false;
  const dirs = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (b[y][x] !== v) continue;
      for (const [dx, dy] of dirs) {
        let cnt = 1, nx = x + dx, ny = y + dy;
        while (
          ny >= 0 && ny < ROWS &&
          nx >= 0 && nx < COLUMNS &&
          b[ny][nx] === v
        ) {
          cnt++;
          if (cnt === 4) return true;
          ny += dy;
          nx += dx;
        }
      }
    }
  }
  return false;
}

// --- ミニマックス & 評価関数 ---

function scorePosition(b: CellValue[][], ai: CellValue): number {
  // 評価ロジックを実装してください
  return 0;
}

function minimax(
  b: CellValue[][],
  depth: number,
  α: number,
  β: number,
  maximizing: boolean,
  ai: CellValue
): number {
  // 終端 or 勝敗判定
  const terminal = hasWon(b, ai) || hasWon(b, ai === 'R' ? 'Y' : 'R') || validColumns(b).length === 0;
  if (depth === 0 || terminal) {
    if (hasWon(b, ai)) return Infinity;
    if (hasWon(b, ai === 'R' ? 'Y' : 'R')) return -Infinity;
    return scorePosition(b, ai);
  }
  if (maximizing) {
    let value = -Infinity;
    for (const col of validColumns(b)) {
      const nb = cloneBoard(b);
      // クローン盤にだけ駒を置く
      for (let r = ROWS - 1; r >= 0; r--) {
        if (nb[r][col] === null) { nb[r][col] = ai; break; }
      }
      value = Math.max(value, minimax(nb, depth - 1, α, β, false, ai));
      α = Math.max(α, value);
      if (α >= β) break;
    }
    return value;
  } else {
    let value = Infinity;
    const opp = ai === 'R' ? 'Y' : 'R';
    for (const col of validColumns(b)) {
      const nb = cloneBoard(b);
      for (let r = ROWS - 1; r >= 0; r--) {
        if (nb[r][col] === null) { nb[r][col] = opp; break; }
      }
      value = Math.min(value, minimax(nb, depth - 1, α, β, true, ai));
      β = Math.min(β, value);
      if (α >= β) break;
    }
    return value;
  }
}

function computeBestMove(
  b: CellValue[][],
  ai: CellValue,
  depth: number
): number {
  let bestScore = -Infinity;
  let bestCol = validColumns(b)[0];
  for (const col of validColumns(b)) {
    const nb = cloneBoard(b);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (nb[r][col] === null) { nb[r][col] = ai; break; }
    }
    const sc = minimax(nb, depth - 1, -Infinity, Infinity, false, ai);
    if (sc > bestScore) {
      bestScore = sc;
      bestCol = col;
    }
  }
  return bestCol;
}
</script>

<style scoped>
.connect4 {
  text-align: center;
  position: relative;
}
.board {
  display: flex;
  justify-content: center;
  margin-top: 1em;
}
.column {
  display: flex;
  flex-direction: column-reverse;
  cursor: pointer;
}
.overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
}
.message {
  font-size: 2em;
  color: white;
  margin-bottom: 0.5em;
}
button {
  margin-left: 0.5em;
  padding: 0.3em 0.6em;
}
.red { color: red; }
.yellow { color: gold; }
</style>
