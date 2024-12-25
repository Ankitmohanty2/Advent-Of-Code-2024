const fs = require('fs');

function fits(key, lock) {
    const R = key.length;
    if (R !== lock.length) return false;
    
    const C = key[0].length;
    if (C !== lock[0].length) return false;

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (key[r][c] === '#' && lock[r][c] === '#') {
                return false;
            }
        }
    }
    return true;
}

try {
    const input = fs.readFileSync('./src/input.txt', 'utf8').trim();
    const shapes = input.split('\n\n');
    
    const keys = [];
    const locks = [];

    for (const shape of shapes) {
        const G = shape.split('\n');
        const R = G.length;
        const C = G[0].length;
        
        const grid = Array(R).fill().map((_, r) => 
            Array(C).fill().map((_, c) => G[r][c])
        );

        let isKey = true;
        for (let c = 0; c < C; c++) {
            if (grid[0][c] === '#') {
                isKey = false;
                break;
            }
        }

        if (isKey) {
            keys.push(G);
        } else {
            locks.push(G);
        }
    }

    let ans = 0;
    for (const key of keys) {
        for (const lock of locks) {
            if (fits(key, lock)) {
                ans++;
            }
        }
    }

    console.log(ans);

} catch (err) {
    console.error('Error:', err);
}