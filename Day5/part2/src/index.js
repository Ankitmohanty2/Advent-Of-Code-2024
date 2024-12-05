const fs = require('fs');
const path = require('path');


const isValid = (nums, pairs) => {
  const seenSet = new Set();
  for (let num of nums) {
    for (let [a, b] of pairs) {
      if (a === num && seenSet.has(b)) {
        return false;
      }
    }
    seenSet.add(num);
  }
  return true;
};


const solve = async (filePath) => {
  let ans = 0;
  const data = fs.readFileSync(filePath, 'utf-8').split('\n');
  let pairs = [];


  let i = 0;
  while (i < data.length && data[i].trim() !== '') {
    const line = data[i].trim();
    if (line) {
      const [a, b] = line.split('|').map(num => parseInt(num, 10));
      pairs.push([a, b]);
    }
    i++;
  }

  
  while (i < data.length) {
    const line = data[i].trim();
    if (line) {
      let nums = line.split(',').map(num => parseInt(num, 10));

      if (!isValid(nums, pairs)) {
      
        nums.sort((a, b) => {
          for (let [pairFirst, pairSecond] of pairs) {
            if (b === pairFirst && a === pairSecond) {
              return -1;
            }
          }
          return 0;
        });

        
        const midIdx = Math.floor((nums.length - 1) / 2);
        ans += nums[midIdx];
      }
    }
    i++;
  }

  return ans;
};

const main = async () => {
  const filePath = path.join(__dirname, 'input.txt');
  const start = Date.now();
  
  try {
    const result = await solve(filePath);
    const duration = Date.now() - start;

    console.log(result);
    console.log(`Time taken: ${duration} ms`);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
