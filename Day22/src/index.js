function mix(x, y) {
    return x ^ y;
}

function prune(x) {
    return x % 16777216;
}

function prices(x) {
    let ans = [x];
    for (let i = 0; i < 2000; i++) {
        let newX = x;
        newX = prune(mix(newX, 64 * newX));
        newX = prune(mix(newX, Math.floor(newX / 32)));
        newX = prune(mix(newX, newX * 2048));
        ans.push(newX);
        x = newX;
    }
    return ans;
}

function changes(P) {
    let result = [];
    for (let i = 0; i < P.length - 1; i++) {
        result.push(P[i + 1] - P[i]);
    }
    return result;
}

function getScores(P, C) {
    let ANS = {};
    for (let i = 0; i < C.length - 3; i++) {
        let pattern = `${C[i]},${C[i + 1]},${C[i + 2]},${C[i + 3]}`;
        if (!(pattern in ANS)) {
            ANS[pattern] = P[i + 4];
        }
    }
    return ANS;
}

function solve(input) {
    let p1 = 0;
    let SCORE = {};
    
    const lines = input.trim().split('\n');
    for (let line of lines) {
        let P = prices(parseInt(line));
        p1 += P[P.length - 1];
        P = P.map(x => x % 10);
        let C = changes(P);
        let S = getScores(P, C);
        
        for (let k in S) {
            SCORE[k] = (SCORE[k] || 0) + S[k];
        }
    }
    
    console.log(p1);
    console.log(Math.max(...Object.values(SCORE)));
}

const fs = require('fs');
try {
    const input = fs.readFileSync('./src/input.txt', 'utf8');
    solve(input);
} catch (err) {
    console.error('Error reading input file:', err);
    process.exit(1);
}