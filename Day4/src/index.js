const fs = require('fs');

function countXMAS(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;
    let count = 0;

    function isValid(x, y) {
        return x >= 0 && x < numRows && y >= 0 && y < numCols;
    }

    function checkMAS(x, y, dx1, dy1, dx2, dy2) {
        // Check first MAS
        const mas1 = [];
        for (let i = 0; i < 3; i++) {
            const newX = x + i * dx1;
            const newY = y + i * dy1;
            if (!isValid(newX, newY)) return false;
            mas1.push(grid[newX][newY]);
        }

        // Check second MAS
        const mas2 = [];
        for (let i = 0; i < 3; i++) {
            const newX = x + i * dx2;
            const newY = y + i * dy2;
            if (!isValid(newX, newY)) return false;
            mas2.push(grid[newX][newY]);
        }

        // Check if both form MAS (forward or backward)
        const isValidMAS = str => str.join('') === 'MAS' || str.join('') === 'SAM';
        return isValidMAS(mas1) && isValidMAS(mas2);
    }

    // Check each position as potential center of X
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j] === 'A') {  // Center must be 'A'
                // Check all possible X configurations
                const directions = [
                    // Upper-left to lower-right and upper-right to lower-left
                    [[-1, -1], [1, 1], [-1, 1], [1, -1]],
                    // Upper to lower and left to right
                    [[-1, 0], [1, 0], [0, -1], [0, 1]]
                ];

                for (const [dir1, dir2, dir3, dir4] of directions) {
                    // Check both possible orientations for each X configuration
                    if (checkMAS(i, j, dir1[0], dir1[1], dir3[0], dir3[1]) ||
                        checkMAS(i, j, dir2[0], dir2[1], dir4[0], dir4[1])) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}

function main() {
    try {
        const input = fs.readFileSync("./src/input.txt", "utf8")
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);  // Remove empty lines
        
        console.log("Number of X-MAS occurrences:", countXMAS(input));
    } catch (err) {
        console.error("Error reading input file:", err.message);
    }
}

main();