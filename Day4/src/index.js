const fs = require('fs');

function countXMAS(grid) {
    const word = "XMAS";
    const directions = [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 },
        { x: -1, y: 1 }
    ];

    const numRows = grid.length;
    const numCols = grid[0].length;
    let count = 0;

    function isValid(x, y) {
        return x >= 0 && x < numRows && y >= 0 && y < numCols;
    }

    function search(x, y, dir) {
        for (let i = 0; i < word.length; i++) {
            const newX = x + i * dir.x;
            const newY = y + i * dir.y;
            if (!isValid(newX, newY) || grid[newX][newY] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            for (const dir of directions) {
                if (search(i, j, dir)) {
                    count++;
                }
            }
        }
    }

    return count;
}

function main() {
    try {
        const input = fs.readFileSync("input.txt", "utf8").split('\n').map(line => line.trim());
        console.log("Number of XMAS occurrences:", countXMAS(input));
    } catch (err) {
        console.error("Error reading input file:", err.message);
    }
}

main();