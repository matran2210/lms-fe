import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** Folder nguồn */
const ROOT = path.resolve(__dirname, "../libs/assets");

/** Danh sách cấu hình generate */
const CONFIG = [
  {
    folder: "images",
    output: "image-generate.ts",
    suffix: "Image"
  },
  {
    folder: "animations",
    output: "animations-generate.ts",
    suffix: "Animation"
  },
];

function pascalCase(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function generateFile(folder, output, suffix) {
  const dir = path.resolve(ROOT, folder);
  const outputFile = path.resolve(ROOT, output);

  if (!fs.existsSync(dir)) {
    console.warn(`⚠ Folder not found: ${folder}`);
    return;
  }

  const files = fs.readdirSync(dir);

  const exports = files
    .map((file) => {
      const key = pascalCase(file) + suffix;
      return `export { default as ${key} } from "./${folder}/${file}";`;
    })
    .join("\n");

  const content = `// AUTO-GENERATED — DO NOT EDIT
${exports}
`;

  fs.writeFileSync(outputFile, content);

  console.log(`✔ Generated @lms/assets/${output}`);
}

function run() {
  CONFIG.forEach((cfg) => generateFile(cfg.folder, cfg.output, cfg.suffix));
}

run();
