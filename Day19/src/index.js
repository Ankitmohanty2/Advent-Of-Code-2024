const fs = require('fs');
const path = require('path');

function countWays(target, availablePatterns, memo = null) {
    if (memo === null) {
        memo = new Map();
    }
    
   
    if (!target) {
        return 1;
    }
    
    // Check memoized results
    if (memo.has(target)) {
        return memo.get(target);
    }
    
    
    let totalWays = 0;
    for (const pattern of availablePatterns) {
        if (target.startsWith(pattern)) {
           
            totalWays += countWays(target.slice(pattern.length), availablePatterns, memo);
        }
    }
    
    memo.set(target, totalWays);
    return totalWays;
}

function calc(values) {
    // Parse input
    let patternSection = true;
    const availablePatterns = new Set();
    const designs = [];
    
    for (const line of values) {
        if (!line.trim()) {
            patternSection = false;
            continue;
        }
        
        if (patternSection) {
            
            const patterns = line.split(', ');
            patterns.forEach(pattern => availablePatterns.add(pattern));
        } else {
           
            designs.push(line.trim());
        }
    }
    

    let possibleCount = 0;
    let totalWays = 0;
    
    for (const design of designs) {
        const ways = countWays(design, availablePatterns);
        if (ways > 0) {
            possibleCount++;
        }
        totalWays += ways;
    }
    
    return [possibleCount, totalWays];
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
        .map(line => line.replace(/\r$/, ''));

    const [part1, part2] = calc(values);
    console.log(`Part 1 - Number of possible designs: ${part1}`);
    console.log(`Part 2 - Total number of different ways: ${part2}`);

} catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
}