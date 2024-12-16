const fs = require('fs');
const path = require('path');

function print(s) {
    console.log(s);
}

const DIRS = [[-1,0], [0,1], [1,0], [0,-1]];  // up right down left

// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    
    push(element) {
        this.values.push(element);
        this.sort();
    }
    
    pop() {
        return this.values.shift();
    }
    
    sort() {
        this.values.sort((a, b) => a[0] - b[0]);
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

const inputPath = path.join(__dirname, 'input.txt');
const D = fs.readFileSync(inputPath, 'utf8').trim();

let G = D.split('\n');
const R = G.length;
const C = G[0].length;
G = G.map(row => [...row]);

// Find start and end positions
let sr, sc, er, ec;
for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
        if (G[r][c] === 'S') {
            [sr, sc] = [r, c];
        }
        if (G[r][c] === 'E') {
            [er, ec] = [r, c];
        }
    }
}

// Forward search from start
const Q = new PriorityQueue();
const SEEN = new Set();
Q.push([0, sr, sc, 1]);  // Start facing east
const DIST = new Map();
let best = null;

while (!Q.isEmpty()) {
    const [d, r, c, dir] = Q.pop();
    const key = `${r},${c},${dir}`;
    
    if (!DIST.has(key)) {
        DIST.set(key, d);
    }
    if (r === er && c === ec && best === null) {
        best = d;
    }
    if (SEEN.has(key)) {
        continue;
    }
    SEEN.add(key);
    
    // Try moving forward
    const [dr, dc] = DIRS[dir];
    const [rr, cc] = [r + dr, c + dc];
    if (cc >= 0 && cc < C && rr >= 0 && rr < R && G[rr][cc] !== '#') {
        Q.push([d + 1, rr, cc, dir]);
    }
    // Try turning left/right
    Q.push([d + 1000, r, c, (dir + 1) % 4]);
    Q.push([d + 1000, r, c, (dir + 3) % 4]);
}

print(best);

// Backward search from end
const Q2 = new PriorityQueue();
const SEEN2 = new Set();
for (let dir = 0; dir < 4; dir++) {
    Q2.push([0, er, ec, dir]);
}
const DIST2 = new Map();

while (!Q2.isEmpty()) {
    const [d, r, c, dir] = Q2.pop();
    const key = `${r},${c},${dir}`;
    
    if (!DIST2.has(key)) {
        DIST2.set(key, d);
    }
    if (SEEN2.has(key)) {
        continue;
    }
    SEEN2.add(key);
    
    // Going backwards
    const [dr, dc] = DIRS[(dir + 2) % 4];
    const [rr, cc] = [r + dr, c + dc];
    if (cc >= 0 && cc < C && rr >= 0 && rr < R && G[rr][cc] !== '#') {
        Q2.push([d + 1, rr, cc, dir]);
    }
    Q2.push([d + 1000, r, c, (dir + 1) % 4]);
    Q2.push([d + 1000, r, c, (dir + 3) % 4]);
}

// Find tiles on optimal paths
const OK = new Set();
for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
        for (let dir = 0; dir < 4; dir++) {
            const key = `${r},${c},${dir}`;
            if (DIST.has(key) && DIST2.has(key) && 
                DIST.get(key) + DIST2.get(key) === best) {
                OK.add(`${r},${c}`);
            }
        }
    }
}

print(OK.size);