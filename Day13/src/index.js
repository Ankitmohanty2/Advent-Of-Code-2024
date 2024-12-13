const fs = require('fs');
const path = require('path');

function print(s) {
    console.log(s);
}

function solveLinearSystem(A, B) {
    const [[a11, a12], [a21, a22]] = A;
    const [b1, b2] = B;
    const det = a11 * a22 - a12 * a21;
    
    if (Math.abs(det) < 1e-10) throw new Error('Singular matrix');
    
    const x1 = (b1 * a22 - b2 * a12) / det;
    const x2 = (a11 * b2 - a21 * b1) / det;
    
    return [x1, x2];
}

function solve(ax, ay, bx, by, px, py, part2) {
    const P2 = part2 ? BigInt(10000000000000) : BigInt(0);
    
    try {
        const A = [[ax, bx], [ay, by]];
        const B = [Number(BigInt(px) + P2), Number(BigInt(py) + P2)];
        const [t1, t2] = solveLinearSystem(A, B);
        
        if (t1 >= 0 && t2 >= 0 && 
            Math.abs(t1 - Math.round(t1)) < 1e-10 && 
            Math.abs(t2 - Math.round(t2)) < 1e-10) {
            return 3 * Math.round(t1) + Math.round(t2);
        }
    } catch (e) {
        print(`Linear system failed: ${e.message}`);
    }
    
    let best = null;
    for (let t1 = 0; t1 < 100; t1++) {
        for (let t2 = 0; t2 < 100; t2++) {
            const cost = 3 * t1 + t2;
            const dx = ax * t1 + bx * t2;
            const dy = ay * t1 + by * t2;
            
            if (dx === dy && dx > 0) {
                const score = dx / cost;
                if (best === null || score < best[0]) {
                    best = [score, t1, t2, cost, dx];
                }
            }
        }
    }
    
    if (!best) return 0;
    
    const [_score, _t1, _t2, cost, dx] = best;
    if (dx === 0) return 0;
    
    const amt = Number((P2 - BigInt(40000)) / BigInt(dx));
    const rem_x = Number(BigInt(px) + P2 - BigInt(amt) * BigInt(dx));
    const rem_y = Number(BigInt(py) + P2 - BigInt(amt) * BigInt(dx));
    
    try {
        const A = [[ax, bx], [ay, by]];
        const B = [rem_x, rem_y];
        const [t1, t2] = solveLinearSystem(A, B);
        
        if (t1 >= 0 && t2 >= 0 && 
            Math.abs(t1 - Math.round(t1)) < 1e-10 && 
            Math.abs(t2 - Math.round(t2)) < 1e-10) {
            return 3 * Math.round(t1) + Math.round(t2) + amt * cost;
        }
    } catch (e) {
        print(`Second linear system failed: ${e.message}`);
    }
    
    return 0;
}

const inputPath = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(inputPath, 'utf8').trim();

let part1 = 0;
let part2 = 0;
const machines = input.split('\n\n');

machines.forEach((machine, i) => {
    const [a, b, prize] = machine.split('\n');
    
    const aw = a.split(' ');
    const ax = parseInt(aw[2].split('+')[1].split(',')[0]);
    const ay = parseInt(aw[3].split('+')[1].split(',')[0]);
    
    const bw = b.split(' ');
    const bx = parseInt(bw[2].split('+')[1].split(',')[0]);
    const by = parseInt(bw[3].split('+')[1].split(',')[0]);
    
    const pw = prize.split(' ');
    const px = parseInt(pw[1].split('=')[1].split(',')[0]);
    const py = parseInt(pw[2].split('=')[1]);
    
    print(`Processing machine ${i + 1}:`);
    print(`Input values: ax=${ax}, ay=${ay}, bx=${bx}, by=${by}, px=${px}, py=${py}`);
    
    const p1Result = solve(ax, ay, bx, by, px, py, false);
    const p2Result = solve(ax, ay, bx, by, px, py, true);
    
    part1 += p1Result;
    part2 += p2Result;
    
    print(`Machine ${i + 1}: Part1=${p1Result}, Part2=${p2Result}\n`);
});

print(`Final Part1: ${part1}`);
print(`Final Part2: ${part2}`);