const fs = require('fs');
const path = require('path');

function print(s) {
    console.log(s);
}

function solve(ax, ay, bx, by, px, py, part2) {
    const P2 = part2 ? 10000000000000 : 0;
    
    // Pattern finding approach
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
    
    if (best === null) {
        return 0;
    }
    
    const [_score, t1, t2, cost, dx] = best;
    if (dx === 0) {
        return 0;
    }
    
    const amt = Math.floor((P2 - 40000) / dx);
    const rem_x = px + P2 - amt * dx;
    const rem_y = py + P2 - amt * dx;
    
    // Linear equation solving for remainder
    const det = ax * by - ay * bx;
    if (det !== 0) {
        const t1_rem = (by * rem_x - bx * rem_y) / det;
        const t2_rem = (-ay * rem_x + ax * rem_y) / det;
        
        if (t1_rem >= 0 && t2_rem >= 0 && 
            Math.abs(t1_rem - Math.round(t1_rem)) < 1e-10 && 
            Math.abs(t2_rem - Math.round(t2_rem)) < 1e-10) {
            return 3 * Math.round(t1_rem) + Math.round(t2_rem) + amt * cost;
        }
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
    
    const p1Result = solve(ax, ay, bx, by, px, py, false);
    const p2Result = solve(ax, ay, bx, by, px, py, true);
    
    part1 += p1Result;
    part2 += p2Result;
    
    print(`Machine ${i + 1}: Part1=${p1Result}, Part2=${p2Result}`);
});

print(part1);
print(part2);