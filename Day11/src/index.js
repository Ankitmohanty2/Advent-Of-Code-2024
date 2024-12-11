// src/index.js

const fs = require('fs');
const path = require('path');

function pr(s) {
    console.log(s);
}

// Read input file
const inputPath = path.join(__dirname, './input.txt');
const D = fs.readFileSync(inputPath, 'utf8')
           .trim()
           .split(/\s+/)
           .map(Number);

const DP = new Map();

function solve(x, t) {
    const key = `${x},${t}`;
    
    if (DP.has(key)) {
        return DP.get(key);
    }

    let ret;
    if (t === 0) {
        ret = 1;
    } else if (x === 0) {
        ret = solve(1, t-1);
    } else {
        const dstr = x.toString();
        if (dstr.length % 2 === 0) {
            const mid = Math.floor(dstr.length / 2);
            const left = parseInt(dstr.slice(0, mid));
            const right = parseInt(dstr.slice(mid));
            ret = solve(left, t-1) + solve(right, t-1);
        } else {
            ret = solve(x * 2024, t-1);
        }
    }

    DP.set(key, ret);
    return ret;
}

function solve_all(t) {
    return D.reduce((sum, x) => sum + solve(x, t), 0);
}

// Calculate both parts
pr(solve_all(25));  // Part 1
pr(solve_all(75));  // Part 2