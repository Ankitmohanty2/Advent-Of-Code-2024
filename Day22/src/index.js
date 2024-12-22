const fs = require('fs');

function loadInput(filename) {
    return fs.readFileSync(filename, 'utf8')
        .trim()
        .split('\n')
        .map(Number);
}

function generateSecrets(num) {
    let one = num % 10;
    let changes = [];
    let consecutives = new Map();

    for (let i = 0; i < 3; i++) {
        num = (num ^ (num << 6)) & 16777215;
        num = (num ^ (num >> 5)) & 16777215;
        num = (num ^ (num << 11)) & 16777215;
        changes.push(num % 10 - one);
        one = num % 10;
        if (changes.length > 4) changes.shift();
    }

    for (let i = 0; i < 1997; i++) {
        num = (num ^ (num << 6)) & 16777215;
        num = (num ^ (num >> 5)) & 16777215;
        num = (num ^ (num << 11)) & 16777215;
        changes.push(num % 10 - one);
        one = num % 10;
        if (changes.length > 4) changes.shift();
        
        let key = changes.toString();
        if (!consecutives.has(key)) {
            consecutives.set(key, one);
        }
    }

    return [num, consecutives];
}

function main() {
    const secrets = loadInput('./src/input.txt');
    let part1 = 0;
    let part2 = new Map();

    for (let num of secrets) {
        const [newNum, consecutives] = generateSecrets(num);
        part1 += newNum;

        for (let [fourTuple, banana] of consecutives) {
            part2.set(fourTuple, (part2.get(fourTuple) || 0) + banana);
        }
    }

    console.log(`Part 1: ${part1}`);
    console.log(`Part 2: ${Math.max(...part2.values())}`);
}

main();