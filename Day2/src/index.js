const fs = require('fs');

let safeCount = 0;


function parseInput(input) {
    return input.trim().split('\n').map(line =>
        line.trim().split(/\s+/).map(Number)
    );
}


function isArraySafe(array) {
    let increasing = true;
    let decreasing = true;

    for (let i = 0; i < array.length - 1; i++) {
        const diff = array[i + 1] - array[i];


        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
            return false;
        }


        if (diff < 0) increasing = false;
        if (diff > 0) decreasing = false;
    }


    return increasing || decreasing;
}


function processInput(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        const arrays = parseInput(data);

        arrays.forEach((array, index) => {
            console.log(`Processing array ${index + 1}:`, array);

            if (isArraySafe(array)) {
                safeCount++;
                console.log(`Array ${index + 1} is safe.`);
            } else {
                console.log(`Array ${index + 1} is not safe.`);
            }
        });

        console.log(`Total number of safe arrays: ${safeCount}`);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
    }
}

processInput('./src/input.txt');
