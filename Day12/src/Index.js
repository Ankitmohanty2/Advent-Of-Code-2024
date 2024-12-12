const fs = require('fs');
const path = require('path');

// Helper function for printing and copying (you might want to implement copying separately)
function print(s) {
    console.log(s);
}

// Directions: up, right, down, left
const DIRECTIONS = [[-1,0], [0,1], [1,0], [0,-1]];

// Read and process input
const inputPath = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(inputPath, 'utf8').trim();
const grid = input.split('\n');
const ROWS = grid.length;
const COLS = grid[0].length;

// Main calculation
function calculateLagoonMetrics() {
    let part1 = 0;
    let part2 = 0;
    const seen = new Set();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (seen.has(`${row},${col}`)) continue;

            const queue = [[row, col]];
            let area = 0;
            let perimeter = 0;
            const perimeterMap = new Map();

            // BFS to explore connected regions
            while (queue.length > 0) {
                const [r2, c2] = queue.shift();
                if (seen.has(`${r2},${c2}`)) continue;

                seen.add(`${r2},${c2}`);
                area++;

                for (const [dr, dc] of DIRECTIONS) {
                    const newRow = r2 + dr;
                    const newCol = c2 + dc;

                    if (isValidPosition(newRow, newCol) && grid[newRow][newCol] === grid[r2][c2]) {
                        queue.push([newRow, newCol]);
                    } else {
                        perimeter++;
                        const key = `${dr},${dc}`;
                        if (!perimeterMap.has(key)) {
                            perimeterMap.set(key, new Set());
                        }
                        perimeterMap.get(key).add(`${r2},${c2}`);
                    }
                }
            }

            // Calculate sides
            let sides = 0;
            for (const [_, positions] of perimeterMap) {
                const seenPerimeter = new Set();
                
                for (const pos of positions) {
                    if (seenPerimeter.has(pos)) continue;

                    sides++;
                    const perimQueue = [pos];

                    while (perimQueue.length > 0) {
                        const current = perimQueue.shift();
                        if (seenPerimeter.has(current)) continue;

                        seenPerimeter.add(current);
                        const [cr, cc] = current.split(',').map(Number);

                        for (const [dr, dc] of DIRECTIONS) {
                            const newPos = `${cr + dr},${cc + dc}`;
                            if (positions.has(newPos)) {
                                perimQueue.push(newPos);
                            }
                        }
                    }
                }
            }

            part1 += area * perimeter;
            part2 += area * sides;
        }
    }

    return { part1, part2 };
}

function isValidPosition(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

// Calculate and output results
const { part1, part2 } = calculateLagoonMetrics();
print(part1);
print(part2);