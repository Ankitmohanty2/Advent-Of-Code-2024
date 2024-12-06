const fs = require('fs');
const path = require('path');

function main() {
    const filePath = path.join(__dirname, './input.txt'); 
    const data = fs.readFileSync(filePath, 'utf8').trim();
    const grid = data.split('\n');
    const R = grid.length;
    const C = grid[0].length;

    let startRow, startCol;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (grid[r][c] === '^') {
                startRow = r;
                startCol = c;
            }
        }
    }

    let p1 = 0;
    let p2 = 0;

    for (let o_r = 0; o_r < R; o_r++) {
        for (let o_c = 0; o_c < C; o_c++) {
            let r = startRow;
            let c = startCol;
            let d = 0; 
            const SEEN = new Set();
            const SEEN_RC = new Set();

            while (true) {
                const state = `${r},${c},${d}`;
                if (SEEN.has(state)) {
                    p2 += 1;
                    break;
                }
                SEEN.add(state);
                SEEN_RC.add(`${r},${c}`);

                const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                const [dr, dc] = directions[d];
                const rr = r + dr;
                const cc = c + dc;

                if (!(0 <= rr && rr < R && 0 <= cc && cc < C)) {
                    if (grid[o_r][o_c] === '#') {
                        p1 = SEEN_RC.size;
                    }
                    break;
                }

                if (grid[rr][cc] === '#' || (rr === o_r && cc === o_c)) {
                    d = (d + 1) % 4;
                } else {
                    r = rr;
                    c = cc;
                }
            }
        }
    }

    console.log("Distinct positions visited (p1):", p1);
    console.log("Number of loops detected (p2):", p2);
}

main();