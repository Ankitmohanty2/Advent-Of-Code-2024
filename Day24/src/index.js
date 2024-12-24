const fs = require('fs');

function getFurthestMade(opList) {
    const ops = new Map();
    for (const [x1, x2, res, op] of opList) {
        ops.set(JSON.stringify([x1, x2].sort()) + op, res);
    }

    function getRes(x1, x2, op) {
        return ops.get(JSON.stringify([x1, x2].sort()) + op);
    }

    const carries = new Map();
    const correct = new Set();
    let prevIntermediates = new Set();

    for (let i = 0; i < 45; i++) {
        const pos = i < 10 ? `0${i}` : `${i}`;
        const predigit = getRes(`x${pos}`, `y${pos}`, 'XOR');
        const precarry1 = getRes(`x${pos}`, `y${pos}`, 'AND');

        if (i === 0) {
            if (predigit !== 'z00') return [i - 1, correct];
            carries.set(i, precarry1);
            continue;
        }

        const digit = getRes(carries.get(i - 1), predigit, 'XOR');
        if (digit !== `z${pos}`) {
            return [i - 1, correct];
        }

        correct.add(carries.get(i - 1));
        correct.add(predigit);
        for (const wire of prevIntermediates) {
            correct.add(wire);
        }

        const precarry2 = getRes(carries.get(i - 1), predigit, 'AND');
        const carryOut = getRes(precarry1, precarry2, 'OR');
        carries.set(i, carryOut);
        prevIntermediates = new Set([precarry1, precarry2]);
    }

    return [45, correct];
}

function* combinations(arr, r) {
    if (r === 1) {
        for (let i = 0; i < arr.length; i++) {
            yield [arr[i]];
        }
        return;
    }

    for (let i = 0; i < arr.length - r + 1; i++) {
        for (const comb of combinations(arr.slice(i + 1), r - 1)) {
            yield [arr[i], ...comb];
        }
    }
}

try {
    const text = fs.readFileSync('./src/input.txt', 'utf8');
    const [inputs, gates] = text.split('\n\n');

    const finished = new Map();
    const inputPattern = /([xy]\d\d): ([10])/;
    for (const line of inputs.split('\n')) {
        const match = line.match(inputPattern);
        if (!match) continue;
        const [_, inputName, val] = match;
        finished.set(inputName, parseInt(val));
    }

    const gatePattern = /([a-z0-9]{3}) ([XORAND]+) ([a-z0-9]{3}) -> ([a-z0-9]{3})/;
    const ops = new Set();
    const opList = [];
    for (const line of gates.split('\n')) {
        const match = line.match(gatePattern);
        if (!match) continue;
        const [_, x1, op, x2, res] = match;
        ops.add([x1, x2, res, op]);
        opList.push([x1, x2, res, op]);
    }

    // Part 1
    const parents = new Map();
    const opMap = new Map();
    for (const [x1, x2, res, op] of ops) {
        parents.set(res, [x1, x2]);
        opMap.set(res, op);
    }

    const memoGetDepth = new Map();
    function getDepth(reg) {
        if (memoGetDepth.has(reg)) return memoGetDepth.get(reg);
        if (finished.has(reg)) return 0;
        if (!parents.has(reg)) throw new Error(`Register ${reg} not found`);

        const [x1, x2] = parents.get(reg);
        const depth = Math.max(getDepth(x1), getDepth(x2)) + 1;
        memoGetDepth.set(reg, depth);
        return depth;
    }

    const vars = Array.from(ops).map(([,, res]) => [res, getDepth(res)]);
    vars.sort((a, b) => a[1] - b[1]);

    for (const [reg] of vars) {
        const [x1, x2] = parents.get(reg);
        const v1 = finished.get(x1);
        const v2 = finished.get(x2);
        const op = opMap.get(reg);
        
        const operations = {
            'XOR': (a, b) => a ^ b,
            'OR': (a, b) => a | b,
            'AND': (a, b) => a & b
        };
        
        finished.set(reg, operations[op](v1, v2));
    }

    const regs = Array.from(finished.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const numOut = parseInt(regs[regs.length - 1][0].slice(-2)) + 1;
    const binStr = regs.slice(-numOut).map(([, val]) => val).join('');
    const ans1 = parseInt([...binStr].reverse().join(''), 2);

    // Part 2
    const swaps = new Set();
    let [base, baseUsed] = getFurthestMade(opList);

    for (let attempt = 0; attempt < 4; attempt++) {
        let found = false;
        for (const [i, j] of combinations([...Array(opList.length).keys()], 2)) {
            const [x1_i, x2_i, res_i, op_i] = opList[i];
            const [x1_j, x2_j, res_j, op_j] = opList[j];

            if (res_i === 'z00' || res_j === 'z00') continue;
            if (baseUsed.has(res_i) || baseUsed.has(res_j)) continue;

            opList[i] = [x1_i, x2_i, res_j, op_i];
            opList[j] = [x1_j, x2_j, res_i, op_j];

            const [attemptNum, attemptUsed] = getFurthestMade(opList);
            if (attemptNum > base) {
                console.log(`Found a good swap. Got to a higher iteration number: ${attemptNum}`);
                swaps.add([res_i, res_j]);
                base = attemptNum;
                baseUsed = attemptUsed;
                found = true;
                break;
            }

            opList[i] = [x1_i, x2_i, res_i, op_i];
            opList[j] = [x1_j, x2_j, res_j, op_j];
        }
        if (!found) break;
    }

    const ans2 = Array.from(swaps).flat().sort().join(',');

    console.log(`Part 1 answer: ${ans1}`);
    console.log(`Part 2 answer: ${ans2}`);

} catch (err) {
    console.error('Error:', err);
}