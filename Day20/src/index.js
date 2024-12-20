function findDistances(grid, start) {
    const R = grid.length;
    const C = grid[0].length;
    const DIRS = [[0,1], [1,0], [0,-1], [-1,0]];
    
    const dist = new Map();
    const Q = [[start, 0]];
    dist.set(start.toString(), 0);
    
    while (Q.length > 0) {
        const [pos, d] = Q.shift();
        const [r, c] = pos;
        
        for (const [dr, dc] of DIRS) {
            const nr = r + dr;
            const nc = c + dc;
            const newPos = [nr, nc].toString();
            
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && 
                grid[nr][nc] !== '#' && 
                !dist.has(newPos)) {
                dist.set(newPos, d + 1);
                Q.push([[nr, nc], d + 1]);
            }
        }
    }
    
    return dist;
}

function findReachablePoints(grid, start, maxSteps) {
    const R = grid.length;
    const C = grid[0].length;
    const DIRS = [[0,1], [1,0], [0,-1], [-1,0]];
    
    const points = new Set();
    const Q = [[start, 0]];
    const seen = new Set([start.toString()]);
    
    while (Q.length > 0) {
        const [[r, c], steps] = Q.shift();
        if (steps > maxSteps) continue;
        
        points.add([r, c].toString());
        
        for (const [dr, dc] of DIRS) {
            const nr = r + dr;
            const nc = c + dc;
            const newPos = [nr, nc].toString();
            
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && 
                !seen.has(newPos)) {
                seen.add(newPos);
                Q.push([[nr, nc], steps + 1]);
            }
        }
    }
    
    return points;
}

function countCheats(grid, startDist, endDist, normalPath, maxCheatLength) {
    const R = grid.length;
    const C = grid[0].length;
    let count = 0;
    const seen = new Set();
    
    for (let r1 = 0; r1 < R; r1++) {
        for (let c1 = 0; c1 < C; c1++) {
            if (!startDist.has([r1, c1].toString())) continue;
            
            const reachable = findReachablePoints(grid, [r1, c1], maxCheatLength);
            
            for (const pos2 of reachable) {
                const [r2, c2] = pos2.split(',').map(Number);
                if (!endDist.has([r2, c2].toString())) continue;
                
                const cheatDist = Math.abs(r2 - r1) + Math.abs(c2 - c1);
                if (cheatDist > maxCheatLength) continue;
                
                const total = startDist.get([r1, c1].toString()) + 
                            cheatDist + 
                            endDist.get([r2, c2].toString());
                
                if (total < normalPath) {
                    const saved = normalPath - total;
                    const key = [[r1, c1], [r2, c2]].toString();
                    if (saved >= 100 && !seen.has(key)) {
                        count++;
                        seen.add(key);
                    }
                }
            }
        }
    }
    
    return count;
}

function calc(values) {

    const grid = values.filter(line => line.trim()).map(line => line.trim().split(''));
    const R = grid.length;
    const C = grid[0].length;
    
   
    let start, end;
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (grid[r][c] === 'S') {
                start = [r, c];
                grid[r][c] = '.';
            } else if (grid[r][c] === 'E') {
                end = [r, c];
                grid[r][c] = '.';
            }
        }
    }
    
  
    const startDist = findDistances(grid, start);
    const endDist = findDistances(grid, end);
    const normalPath = startDist.get(end.toString()) ?? Infinity;
    
    const part1 = countCheats(grid, startDist, endDist, normalPath, 2);
    
    const part2 = countCheats(grid, startDist, endDist, normalPath, 20);
    
    return [part1, part2];
}

function main() {
    const fs = require('fs');
    const infile = process.argv[2] || './src/input.txt';
    const values = fs.readFileSync(infile, 'utf8').split('\n');
    
    const [part1, part2] = calc(values);
    console.log(`Part 1 - Cheats saving ≥100 ps (2-step limit): ${part1}`);
    console.log(`Part 2 - Cheats saving ≥100 ps (20-step limit): ${part2}`);
}

if (require.main === module) {
    main();
}