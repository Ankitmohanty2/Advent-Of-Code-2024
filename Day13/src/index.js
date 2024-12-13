const fs = require('fs');
const path = require('path');

class Equation {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}

function parseData(data) {
    const regVal = /\+(\d+)/g;
    const regEq = /=(\d+)/g;
    
    const values = [...data.matchAll(regVal)].map(m => parseInt(m[1]));
    const equates = [...data.matchAll(regEq)].map(m => parseInt(m[1]));
    const equations = [];
    
    for (let i = 0, j = 0; j < equates.length; i += 4, j += 2) {
        const e1 = new Equation(values[i], values[i + 2], -equates[j]);
        const e2 = new Equation(values[i + 1], values[i + 3], -equates[j + 1]);
        equations.push({ e1, e2 });
    }
    
    return equations;
}

function intersection(e1, e2) {
    const denominator = e1.a * e2.b - e2.a * e1.b;
    const xnumerator = e1.b * e2.c - e2.b * e1.c;
    const ynumerator = e2.a * e1.c - e1.a * e2.c;
    
    if (denominator === 0) {
        return [-1, -1];
    }
    
    if (xnumerator % denominator === 0 && ynumerator % denominator === 0) {
        const x = xnumerator / denominator;
        const y = ynumerator / denominator;
        return [x, y];
    }
    return [-1, -1];
}

function solve1(equations) {
    let count = 0;
    for (const eq of equations) {
        const [x, y] = intersection(eq.e1, eq.e2);
        if (x === -1 && y === -1) continue;
        if (x > 100 || y > 100 || x < 0 || y < 0) continue;
        count += (x * 3) + y;
    }
    return count;
}

function solve2(equations) {
    let count = 0;
    const P2 = Math.pow(10, 13);
    
    for (const eq of equations) {
        const e1 = new Equation(eq.e1.a, eq.e1.b, eq.e1.c - P2);
        const e2 = new Equation(eq.e2.a, eq.e2.b, eq.e2.c - P2);
        
        const [x, y] = intersection(e1, e2);
        if (x === -1 && y === -1) continue;
        if (x < 0 || y < 0) continue;
        count += (x * 3) + y;
    }
    return count;
}

function main() {
    const startTime = Date.now();
    
    const inputPath = path.join(__dirname, 'input.txt');
    const data = fs.readFileSync(inputPath, 'utf8').trim();
    
    const equations = parseData(data);
    console.log(solve1(equations));
    console.log(solve2(equations));
    
    const endTime = Date.now();
    console.log("Time taken:", endTime - startTime, "ms");
}

main();