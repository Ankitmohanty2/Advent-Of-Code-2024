const fs = require("fs");


function convertToArrays(inputString) {
  const lines = inputString.trim().split("\n");
  return lines.map((line) => line.trim().split(/\s+/).map(Number));
}

function checkArraySafety(arr) {
  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 0; i < arr.length - 1; i++) {
    const diff = arr[i + 1] - arr[i];


    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }


    if (diff <= 0) isIncreasing = false;
    if (diff >= 0) isDecreasing = false;
  }

  return isIncreasing || isDecreasing;
}


function canBeMadeSafe(arr) {
  for (let i = 0; i < arr.length; i++) {

    const modifiedArr = [...arr.slice(0, i), ...arr.slice(i + 1)];
    if (checkArraySafety(modifiedArr)) {
      return true;
    }
  }
  return false;
}


function analyzeReports(filePath) {
  try {
    const input = fs.readFileSync(filePath, "utf8");
    const arrays = convertToArrays(input);

    let safeCount = 0;

    arrays.forEach((array, index) => {
      console.log(`Checking array ${index + 1}:`, array);

      if (checkArraySafety(array)) {
        console.log(`Array ${index + 1} is safe`);
        safeCount++;
      } else if (canBeMadeSafe(array)) {
        console.log(`Array ${index + 1} can be made safe`);
        safeCount++;
      } else {
        console.log(`Array ${index + 1} is not safe`);
      }
    });

    console.log(`Total safe arrays (including dampened): ${safeCount}`);
    return safeCount;
  } catch (err) {
    console.error("Error reading file:", err.message);
  }
}

analyzeReports('./src/input.txt');

