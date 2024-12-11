const fs = require('fs');
const path = require('path');

function getInput(filename = '9.in') {
    const data = fs.readFileSync(filename, 'utf8');
    return data.trim().split('\n').map(line => 
        line.trim().split('').map(x => parseInt(x))
    );
}

function findTrailheads(grid) {
    const R = grid.length;
    const C = grid[0].length;
    const trailheads = [];
    
    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            if (grid[r][c] === 0) {
                trailheads.push([r, c]);
            }
        }
    }
    return trailheads;
}

function solveTrailhead(grid, start_r, start_c) {
    const R = grid.length;
    const C = grid[0].length;
    const visited = new Set();
    const endPoints = new Set();
    let totalPaths = 0;
    
    function dfs(r, c, height) {
        if (grid[r][c] === 9) {
            endPoints.add(`${r},${c}`);
            totalPaths++;
            return;
        }
        
        const directions = [[r+1,c], [r-1,c], [r,c+1], [r,c-1]];
        for (const [nr, nc] of directions) {
            const key = `${nr},${nc}`;
            if (nr >= 0 && nr < R && 
                nc >= 0 && nc < C && 
                !visited.has(key) && 
                grid[nr][nc] === height + 1) {
                visited.add(key);
                dfs(nr, nc, height + 1);
                visited.delete(key);
            }
        }
    }
    
    visited.add(`${start_r},${start_c}`);
    dfs(start_r, start_c, 0);
    return [endPoints.size, totalPaths]; 
}

function main() {
    try {
        const infile = process.argv[2] || './src/input.txt';
        const grid = getInput(infile);
        
        let part1Total = 0;
        let part2Total = 0;
        const trailheads = findTrailheads(grid);
        
        for (const [r, c] of trailheads) {
            const [reachableNines, distinctPaths] = solveTrailhead(grid, r, c);
            part1Total += reachableNines;
            part2Total += distinctPaths;
        }
        
        console.log(`Part 1: ${part1Total}`);
        console.log(`Part 2: ${part2Total}`);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

main();