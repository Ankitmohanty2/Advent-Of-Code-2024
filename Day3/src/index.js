const fs = require('fs');


class Mul {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    run() {
        return this.x * this.y;
    }
}


const Instructions = {
    DO: "do",
    DONT: "don't",
    MUL: "mul"
};

class Instruction {
    constructor(type, value = null) {
        this.type = type;
        this.value = value; 
    }
}


function parseMul(str) {
    const match = str.match(/^mul\((\d{1,3}),(\d{1,3})\)$/);
    if (match) {
        return new Mul(parseInt(match[1], 10), parseInt(match[2], 10));
    }
    return null;
}


function parseInstruction(str) {
    if (str === "do()") {
        return new Instruction(Instructions.DO);
    } else if (str === "don't()") {
        return new Instruction(Instructions.DONT);
    } else {
        const mul = parseMul(str);
        if (mul) {
            return new Instruction(Instructions.MUL, mul);
        }
    }
    return null;
}


function findAll(regex, input) {
    let matches = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        matches.push(match[0]);
    }
    return matches;
}


function part1(input) {
    const regex = /mul\(\d{1,3},\d{1,3}\)/g;
    const matches = findAll(regex, input);
    return matches
        .map(parseMul)
        .filter(mul => mul !== null)
        .reduce((sum, mul) => sum + mul.run(), 0);
}


function part2(input) {
    const regex = /(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g;
    const matches = findAll(regex, input);

    let mode = "Enabled";
    return matches
        .map(parseInstruction)
        .filter(inst => inst !== null)
        .reduce((sum, inst) => {
            switch (inst.type) {
                case Instructions.DO:
                    mode = "Enabled";
                    break;
                case Instructions.DONT:
                    mode = "Disabled";
                    break;
                case Instructions.MUL:
                    if (mode === "Enabled") {
                        sum += inst.value.run();
                    }
                    break;
            }
            return sum;
        }, 0);
}


function main() {
    try {
        const input = fs.readFileSync("./src/input.txt", "utf8");
        console.log("Part 1:", part1(input));
        console.log("Part 2:", part2(input));
    } catch (err) {
        console.error("Error reading input file:", err.message);
    }
}

main();
