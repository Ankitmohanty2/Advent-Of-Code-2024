
const fs = require('fs');
const path = require('path');

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    push(item) {
        this.values.push(item);
        this.sort();
    }

    pop() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a[0] - b[0]);
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

function findPath(corrupted, maxSize) {
    const start = [0, 0];  // Start at top-left
    const end = [maxSize, maxSize];  // End at bottom-right
    const DIRS = [[0,1], [1,0], [0,-1], [-1,0]];  // right, down, left, up
    
    const Q = new PriorityQueue();
    Q.push([0, start]);  // [distance, position]
    
    const seen = new Set();
    seen.add(start.join(','));
    
    while (!Q.isEmpty()) {
        const [dist, [r, c]] = Q.pop();
        
        if (r === end[0] && c === end[1]) {
            return dist;  // Found shortest path
        }
        
        for (const [dr, dc] of DIRS) {
            const nr = r + dr;
            const nc = c + dc;
            const newPos = [nr, nc].join(',');
            
            if (nr >= 0 && nr <= maxSize &&
                nc >= 0 && nc <= maxSize &&
                !corrupted.has(newPos) &&
                !seen.has(newPos)) {
                seen.add(newPos);
                Q.push([dist + 1, [nr, nc]]);
            }
        }
    }
    
    return null;  // No path found
}

function calc(values) {
    // Parse coordinates
    const coords = values
        .filter(line => line.trim())
        .map(line => {
            const [x, y] = line.split(',').map(Number);
            return [x, y];
        });
    
    // Part 1: First 1024 bytes
    const maxSize = 70;
    const corrupted = new Set(
        coords.slice(0, 1024).map(coord => coord.join(','))
    );
    const part1 = findPath(corrupted, maxSize);
    
    // Part 2: Find blocking coordinate
    const corruptedSet = new Set();
    for (const coord of coords) {
        corruptedSet.add(coord.join(','));
        if (findPath(corruptedSet, maxSize) === null) {
            return [part1, coord.join(',')];
        }
    }
    
    return [part1, null];
}

try {
    const inputPath = path.join(__dirname, './input.txt');
    console.log(`Using '${inputPath}' as input file:`);
    
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Unable to find input file: ${inputPath}`);
    }

    const values = fs.readFileSync(inputPath, 'utf8')
        .trim()
        .split('\n')
        .map(line => line.replace(/\r$/, ''));

    const [part1, part2] = calc(values);
    console.log(`Part 1 - Minimum steps needed: ${part1}`);
    console.log(`Part 2 - Blocking coordinate: ${part2}`);

} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}