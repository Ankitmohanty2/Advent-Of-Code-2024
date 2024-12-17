const fs = require('fs');
const path = require('path');

const DAY_NUM = 17;
const DAY_DESC = 'Day 17: Chronospatial Computer';

function decode(a, b, c, val) {
    if (val <= 3) return val;
    else if (val === 4) return a;
    else if (val === 5) return b;
    else if (val === 6) return c;
    else throw new Error('Invalid decode value');
}

function runProgram(a, b, c, prog) {
    const ret = [];
    let i = 0;
    while (i < prog.length) {
        let next_i = i + 2;
        const opcode = prog[i];
        const operand = prog[i + 1];

        switch (opcode) {
            case 0:
                a = Math.floor(a / Math.pow(2, decode(a, b, c, operand)));
                break;
            case 1:
                b = b ^ operand;
                break;
            case 2:
                b = decode(a, b, c, operand) % 8;
                break;
            case 3:
                if (a !== 0) {
                    next_i = operand;
                }
                break;
            case 4:
                b = b ^ c;
                break;
            case 5:
                ret.push(decode(a, b, c, operand) % 8);
                break;
            case 6:
                b = Math.floor(a / Math.pow(2, decode(a, b, c, operand)));
                break;
            case 7:
                c = Math.floor(a / Math.pow(2, decode(a, b, c, operand)));
                break;
        }
        i = next_i;
    }
    return ret;
}

function calc(values, mode) {
    const a = parseInt(values[0].split(": ")[1]);
    const b = parseInt(values[1].split(": ")[1]);
    const c = parseInt(values[2].split(": ")[1]);
    const prog = values[4].split(": ")[1].split(",").map(x => parseInt(x));

    if (mode === 1) {
        const ret = runProgram(a, b, c, prog);
        return ret.join(",");
    } else {
        const todo = [[prog, prog.length - 1, 0]];
        while (todo.length > 0) {
            const [currentProg, off, val] = todo.shift();
            for (let cur = 0; cur < 8; cur++) {
                const next_val = (val << 3) + cur;
                const result = runProgram(next_val, 0, 0, currentProg);
                if (arraysEqual(result, currentProg.slice(off))) {
                    if (off === 0) {
                        return next_val;
                    }
                    todo.push([currentProg, off - 1, next_val]);
                }
            }
        }
    }
    return null;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

function test() {
    const test1 = [
        "Register A: 729",
        "Register B: 0",
        "Register C: 0",
        "",
        "Program: 0,1,5,4,3,0"
    ];
    console.log("Test 1:", calc(test1, 1) === '4,6,3,5,6,3,5,2,1,0');

    const test2 = [
        "Register A: 2024",
        "Register B: 0",
        "Register C: 0",
        "",
        "Program: 0,3,5,4,3,0"
    ];
    console.log("Test 2:", calc(test2, 2) === 117440);
}

function run(values) {
    console.log("Part 1:", calc(values, 1));
    console.log("Part 2:", calc(values, 2));
}

try {
    const inputPath = path.join(__dirname, 'input.txt');
    console.log(`Using '${inputPath}' as input file:`);
    
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Unable to find input file: ${inputPath}`);
    }

    const values = fs.readFileSync(inputPath, 'utf8')
        .trim()
        .split('\n')
        .map(x => x.replace(/\r$/, ''));

    console.log(`Running day ${DAY_DESC}:`);
    
    if (process.argv.includes('--test')) {
        test();
    } else {
        run(values);
    }

} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}