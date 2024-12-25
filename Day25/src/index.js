const fs = require('fs');

function fits(key, lock) {
    const R = key.length;
    if (R !== lock.length) return false;
    
    const C = key[0].length;
    if (C !== lock[0].length) return false;

    let hasOverlap = false;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (key[r][c] === '#' && lock[r][c] === '#') {
                return false;
            }
            if (key[r][c] === '#' || lock[r][c] === '#') {
                hasOverlap = true;
            }
        }
    }
    return hasOverlap;
}

try {
    const input = fs.readFileSync('./src/input.txt', 'utf8').trim();
    const shapes = input.split('\n\n');
    
    const keys = [];
    const locks = [];

    for (const shape of shapes) {
        const lines = shape.split('\n');
        let isKey = true;
        
        for (let c = 0; c < lines[0].length; c++) {
            if (lines[0][c] === '#') {
                isKey = false;
                break;
            }
        }

        if (isKey) {
            keys.push(lines);
        } else {
            locks.push(lines);
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