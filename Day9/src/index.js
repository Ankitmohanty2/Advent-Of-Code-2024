const fs = require("fs");
const clipboardy = require("clipboardy");

function pr(s) {
  console.log(s);
  clipboardy.writeSync(String(s));
}

const infile = process.argv[2] || "9.in";
const D = fs.readFileSync(infile, "utf-8").trim();

function solve(part2) {
  let A = [];
  let SPACE = [];
  let file_id = 0;
  let FINAL = [];
  let pos = 0;

  for (let i = 0; i < D.length; i++) {
    const c = D[i];
    if (i % 2 === 0) {
      if (part2) {
        A.push({ pos, size: parseInt(c, 10), file_id });
      }
      for (let j = 0; j < parseInt(c, 10); j++) {
        FINAL.push(file_id);
        if (!part2) {
          A.push({ pos, size: 1, file_id });
        }
        pos++;
      }
      file_id++;
    } else {
      SPACE.push({ pos, size: parseInt(c, 10) });
      for (let j = 0; j < parseInt(c, 10); j++) {
        FINAL.push(null);
        pos++;
      }
    }
  }

  for (let i = A.length - 1; i >= 0; i--) {
    const { pos, size, file_id } = A[i];
    for (let j = 0; j < SPACE.length; j++) {
      const { pos: space_pos, size: space_size } = SPACE[j];
      if (space_pos < pos && size <= space_size) {
        for (let k = 0; k < size; k++) {
          if (FINAL[pos + k] !== file_id) {
            throw new Error(`Assertion failed: FINAL[${pos + k}] = ${FINAL[pos + k]}`);
          }
          FINAL[pos + k] = null;
          FINAL[space_pos + k] = file_id;
        }
        SPACE[j] = { pos: space_pos + size, size: space_size - size };
        break;
      }
    }
  }

  let ans = 0;
  for (let i = 0; i < FINAL.length; i++) {
    const c = FINAL[i];
    if (c !== null) {
      ans += i * c;
    }
  }
  return ans;
}

const p1 = solve(false);
const p2 = solve(true);
pr(p1);
pr(p2);
