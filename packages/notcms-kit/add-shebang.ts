const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "dist", "index.js");
const fileContent = fs.readFileSync(filePath, "utf8");

if (!fileContent.startsWith("#!/usr/bin/env node")) {
  fs.writeFileSync(filePath, `#!/usr/bin/env node\n${fileContent}`);
  console.log("Shebang added to dist/index.js");
}
