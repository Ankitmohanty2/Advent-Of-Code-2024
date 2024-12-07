const fs = require('fs');
const path = require('path');

function isValid(target, numbers, p2) {
    if (numbers.length === 1) {
        return numbers[0] === target;
    }
    if (isValid(target, [numbers[0] + numbers[1], ...numbers.slice(2)], p2)) {
        return true;
    }
    if (isValid(target, [numbers[0] * numbers[1], ...numbers.slice(2)], p2)) {
        return true;
    }
    if (p2 && isValid(target, [parseInt('' + numbers[0] + numbers[1]), ...numbers.slice(2)], p2)) {
        return true;
    }
    return false;
}

function main() {
    const filePath = path.join(__dirname, './input.txt');
    const data = fs.readFileSync(filePath, 'utf8').trim();
    const lines = data.split('\n');

    let puzzle1 = 0;
    let puzzle2 = 0;

    for (const line of lines) {
        const [targetStr, numbersStr] = line.split(':');
        const target = parseInt(targetStr.trim());
        const numbers = numbersStr.trim().split(' ').map(Number);

        if (isValid(target, numbers, false)) {
            puzzle1 += target;
        }
        if (isValid(target, numbers, true)) {
            puzzle2 += target;
        }
    }

    console.log("First puzzle output:", puzzle1);
    console.log("Second puzzle output:", puzzle2);
}

main();