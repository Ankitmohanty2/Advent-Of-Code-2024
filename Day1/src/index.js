const fs = require('fs').promises;
const path = require('path');

const getPuzzleValues = async () => {
  try {
    const filePath = path.join(__dirname, "index.txt");
    const data = await fs.readFile(filePath, "utf-8");

    const left = [];
    const right = [];

    const numbers = data.split("\n");

    for (let i = 0; i < numbers.length; i++) {
      const [firstNum, secondNum] = numbers[i].split(/\s+/);
      left.push(parseInt(firstNum, 10));
      right.push(parseInt(secondNum, 10));
    }

    return { left, right };
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
};

const getSmallestValue = (array) => {
  let smallestValue = Infinity;
  let smallestIndex = -1;

  for (let i = 0; i < array.length; i++) {
    if (array[i] < smallestValue && array[i] !== -1) {
      smallestValue = array[i];
      smallestIndex = i;
    }
  }

  if (smallestIndex !== -1) {
    array[smallestIndex] = -1;
  }

  return smallestValue;
};

const calculateDistance = async () => {
  try {
    const { left, right } = await getPuzzleValues();

    const distance = [];

    for (let i = 0; i < right.length; i++) {
      const smallestLeft = getSmallestValue(left);
      const smallestRight = getSmallestValue(right);

      if (smallestLeft !== Infinity && smallestRight !== Infinity) {
        distance.push(Math.abs(smallestRight - smallestLeft));
      }
    }

    const sum = distance.reduce((total, currentValue) => total + currentValue, 0);
    console.log("Sum of distances:", sum);
  } catch (err) {
    console.error("Error in calculation:", err);
  }
};

calculateDistance();
