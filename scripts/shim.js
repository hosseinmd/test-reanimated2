const fs = require("fs");
const path = require("path");

/**
 * @param {string} dir
 * @param {{
 *   replace?: number;
 *   insert?: number;
 *   toEnd?: number;
 *   from?: number;
 *   to?: number;
 *   value: string;
 * }[]} lines
 */
function shimFile(dir, lines) {
  const filePath = path.resolve(__dirname, dir);
  const code = fs.readFileSync(filePath).toString();
  if (code.endsWith("/*shim-added*/")) {
    return;
  }
  let fileArray = code.split("\n");
  lines.forEach(({ replace, insert, toEnd, value, from, to = from }) => {
    if (replace !== undefined) {
      fileArray[replace - 1] = value;
      return;
    }

    if (insert !== undefined) {
      fileArray.splice(insert - 1, 0, value);
      return;
    }

    if (toEnd !== undefined) {
      fileArray.push(value);
      return;
    }

    if (from !== undefined) {
      fileArray.splice(from - 1, to - from + 1, value);
      return;
    }
    fileArray = value.split("\n");
  });

  fs.writeFileSync(filePath, `${fileArray.join("\n")}\n/*shim-added*/`);
}

exports.shimFile = shimFile;
