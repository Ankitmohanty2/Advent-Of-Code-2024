const fs = require('fs');
const path = require('path');

function print(s) {
    console.log(s);
}

const DIRS = [[-1,0], [0,1], [1,0], [0,-1]]; // up right down left

const inputPath = path.join(__dirname, 'input.txt');
const D = fs.readFileSync(inputPath, 'utf8').trim();

let [G, instrs] = D.split('\n\n');
G = G.split('\n');

function solve(G, part2) {
    const R = G.length;
    const C = G[0].length;
    G = G.map(row => [...row]);

    if (part2) {
        let BIG_G = [];
        for (let r = 0; r < R; r++) {
            let row = [];
            for (let c = 0; c < C; c++) {
                if (G[r][c] === '#') {
                    row.push('#', '#');
                } else if (G[r][c] === 'O') {
                    row.push('[', ']');
                } else if (G[r][c] === '.') {
                    row.push('.', '.');
                } else if (G[r][c] === '@') {
                    row.push('@', '.');
                }
            }
            BIG_G.push(row);
        }
        G = BIG_G;
        C *= 2;
    }

    let sr = 0, sc = 0;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (G[r][c] === '@') {
                [sr, sc] = [r, c];
                G[r][c] = '.';
            }
        }
    }

    let [r, c] = [sr, sc];
    const directions = {
        '^': [-1, 0],
        '>': [0, 1],
        'v': [1, 0],
        '<': [0, -1]
    };

    for (const inst of instrs) {
        if (inst === '\n') continue;

        const [dr, dc] = directions[inst];
        let rr = r + dr, cc = c + dc;

        if (G[rr][cc] === '#') {
            continue;
        } else if (G[rr][cc] === '.') {
            [r, c] = [rr, cc];
        } else if (['[', ']', 'O'].includes(G[rr][cc])) {
            const Q = [[r, c]];
            const SEEN = new Set();
            let ok = true;

            while (Q.length > 0) {
                const [rr, cc] = Q.shift();
                const key = `${rr},${cc}`;
                if (SEEN.has(key)) continue;
                SEEN.add(key);

                const rrr = rr + dr, ccc = cc + dc;
                if (G[rrr][ccc] === '#') {
                    ok = false;
                    break;
                }
                if (G[rrr][ccc] === 'O') {
                    Q.push([rrr, ccc]);
                }
                if (G[rrr][ccc] === '[') {
                    Q.push([rrr, ccc]);
                    if (G[rrr][ccc + 1] !== ']') throw new Error('Invalid state');
                    Q.push([rrr, ccc + 1]);
                }
                if (G[rrr][ccc] === ']') {
                    Q.push([rrr, ccc]);
                    if (G[rrr][ccc - 1] !== '[') throw new Error('Invalid state');
                    Q.push([rrr, ccc - 1]);
                }
            }

            if (!ok) continue;

            while (SEEN.size > 0) {
                const seenArray = Array.from(SEEN).map(s => s.split(',').map(Number));
                seenArray.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

                for (const [rr, cc] of seenArray) {
                    const rrr = rr + dr, ccc = cc + dc;
                    const newKey = `${rrr},${ccc}`;
                    if (!SEEN.has(newKey)) {
                        if (G[rrr][ccc] !== '.') throw new Error('Invalid move');
                        G[rrr][ccc] = G[rr][cc];
                        G[rr][cc] = '.';
                        SEEN.delete(`${rr},${cc}`);
                        break;
                    }
                }
            }
            r = r + dr;
            c = c + dc;
        }
    }

    let ans = 0;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (['[', 'O'].includes(G[r][c])) {
                ans += 100 * r + c;
            }
        }
    }
    return ans;
}

print(solve(G, false));
print(solve(G, true));