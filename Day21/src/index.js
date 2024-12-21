function steps(G, s, i = 1) {
    let [px, py] = G['A'];
    let [bx, by] = G[' '];
    let res = new Map();
    
    for (let c of s) {
        if (!G[c]) continue;
        let [npx, npy] = G[c];
        let f = (npx === bx && py === by) || (npy === by && px === bx);
        let key = `${npx - px},${npy - py},${f}`;
        res.set(key, (res.get(key) || 0) + i);
        [px, py] = [npx, npy];
    }
    return res;
}

function go(codes, n) {  // Add codes parameter here
    const keyp = Object.fromEntries(
        "789456123 0A".split('').map((c, i) => [
            c,
            [i % 3, Math.floor(i / 3)]
        ])
    );
    
    const dirp = Object.fromEntries(
        " ^A<v>".split('').map((c, i) => [
            c,
            [i % 3, Math.floor(i / 3)]
        ])
    );
    
    let total = 0;
    for (let code of codes) {
        let res = steps(keyp, code);
        
        for (let _ = 0; _ < n + 1; _++) {
            let newRes = new Map();
            
            for (let [key, value] of res) {
                let [x, y, f] = key.split(',').map((x, i) => i === 2 ? x === 'true' : parseInt(x));
                
                let moves = "<".repeat(-x) + 
                           "v".repeat(y) + 
                           "^".repeat(-y) + 
                           ">".repeat(x);
                           
                if (f) {
                    moves = moves.split('').reverse().join('');
                }
                moves += "A";
                
                let stepCount = steps(dirp, moves, value);
                
                for (let [k, v] of stepCount) {
                    newRes.set(k, (newRes.get(k) || 0) + v);
                }
            }
            res = newRes;
        }
        
        let complexity = Array.from(res.values()).reduce((a, b) => a + b, 0);
        total += complexity * parseInt(code.slice(0, 3));
    }
    
    return total;
}

const fs = require('fs');
try {
    const codes = fs.readFileSync('./src/input.txt', 'utf8').trim().split('\n');
    if (codes.length === 0) {
        console.error('Input file is empty');
        process.exit(1);
    }
    console.log(go(codes, 2));   // Pass codes to go()
    console.log(go(codes, 25));  // Pass codes to go()
} catch (err) {
    console.error('Error reading input file:', err);
    process.exit(1);
}