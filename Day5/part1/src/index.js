const fs = require('fs');
const path = require('path');

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
      const nums = line.split(',').map(num => parseInt(num, 10));
      const seenSet = new Set();
      let valid = true;

  
      for (let num of nums) {
        for (let [a, b] of pairs) {
          if (a === num && seenSet.has(b)) {
            valid = false;
            break;
          }
        }
        if (!valid) break;
        seenSet.add(num);
      }


      if (valid) {
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
