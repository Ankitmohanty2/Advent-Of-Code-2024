const fs = require('fs');
const path = require('path');

function print(s) {
    console.log(s);
}

const DIRS = [[-1,0], [0,1], [1,0], [0,-1]]; // up right down left

function ints(s) {
    return [...s.matchAll(/-?\d+/g)].map(x => parseInt(x[0]));
}

const inputPath = path.join(__dirname, 'input.txt');
const D = fs.readFileSync(inputPath, 'utf8').trim();

const X = 101;
const Y = 103;
let q1 = 0;
let q2 = 0;
let q3 = 0;
let q4 = 0;

let robots = [];

// Parse input
for (const line of D.split('\n')) {
    const [px, py, vx, vy] = ints(line);
    robots.push([px, py, vx, vy]);
}

for (let t = 1; t < 1000000; t++) {
    let G = Array(Y).fill().map(() => Array(X).fill('.'));
    
    if (t === 100) {
        q1 = 0;
        q2 = 0;
        q3 = 0;
        q4 = 0;
        const mx = Math.floor(X/2);
        const my = Math.floor(Y/2);
    }

    // Update robot positions
    for (let i = 0; i < robots.length; i++) {
        let [px, py, vx, vy] = robots[i];
        px = (px + vx) % X;
        py = (py + vy) % Y;
        if (px < 0) px += X;
        if (py < 0) py += Y;
        
        robots[i] = [px, py, vx, vy];
        G[py][px] = '#';

        if (t === 100) {
            const mx = Math.floor(X/2);
            const my = Math.floor(Y/2);
            if (px < mx && py < my) q1++;
            if (px > mx && py < my) q2++;
            if (px < mx && py > my) q3++;
            if (px > mx && py > my) q4++;
        }
    }

    if (t === 100) {
        // Part 1
        print(q1 * q2 * q3 * q4);
    }

    // Find components
    let components = 0;
    const SEEN = new Set();
    
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            if (G[y][x] === '#' && !SEEN.has(`${x},${y}`)) {
                const sx = x;
                const sy = y;
                components++;
                
                const Q = [[sx, sy]];
                while (Q.length > 0) {
                    const [x2, y2] = Q.shift();
                    if (SEEN.has(`${x2},${y2}`)) continue;
                    
                    SEEN.add(`${x2},${y2}`);
                    for (const [dx, dy] of DIRS) {
                        const xx = x2 + dx;
                        const yy = y2 + dy;
                        if (xx >= 0 && xx < X && yy >= 0 && yy < Y && G[yy][xx] === '#') {
                            Q.push([xx, yy]);
                        }
                    }
                }
            }
        }
    }

    if (components <= 200) {
        print(t);
        const gstr = G.map(row => row.join('')).join('\n');
        print(gstr);
        break;
    }
}