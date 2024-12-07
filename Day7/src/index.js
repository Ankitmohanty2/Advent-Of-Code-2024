const fs = require('fs');
const path = require('path');

function isValid(target, numbers, p2) {
    if (numbers.length === 1) {
        return numbers[0] === target;
    }
    // Check addition
    if (isValid(target, [numbers[0] + numbers[1], ...numbers.slice(2)], p2)) {
        return true;
    }
    // Check multiplication
    if (isValid(target, [numbers[0] * numbers[1], ...numbers.slice(2)], p2)) {
        return true;
    }
    // Check concatenation if p2 is true
    if (p2 && isValid(target, [parseInt('' + numbers[0] + numbers[1]), ...numbers.slice(2)], p2)) {
        return true;
    }
    return false;
}

function main() {
    const filePath = path.join(__dirname, './input.txt'); // Use input.txt
    const data = fs.readFileSync(filePath, 'utf8').trim();
    const lines = data.split('\n');

    let p1 = 0;
    let p2 = 0;

    for (const line of lines) {
        const [targetStr, numbersStr] = line.split(':');
        const target = parseInt(targetStr.trim());
        const numbers = numbersStr.trim().split(' ').map(Number);

        if (isValid(target, numbers, false)) {
            p1 += target;
        }
        if (isValid(target, numbers, true)) {
            p2 += target;
        }
    }

    console.log("p1:", p1);
    console.log("p2:", p2);
}

main();