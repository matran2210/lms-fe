// scripts/fix-deps.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APPS_DIR = path.join(ROOT, "apps");
const LIBS_DIR = path.join(ROOT, "libs");
const FEATURES_DIR = path.join(ROOT, "features");

function readFilesRecursive(dir, fileList = [], visited = new Set()) {
  if (visited.has(dir)) return fileList;
  visited.add(dir);

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.lstatSync(fullPath);
    if (stats.isDirectory()) {
      readFilesRecursive(fullPath, fileList, visited);
    } else if (stats.isFile() && /\.(js|ts|tsx|jsx)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const deps = new Set();
  let match;
  while ((match = importRegex.exec(content))) {
    const imp = match[1];
    // Chỉ lấy package npm thật sự: không bắt đầu bằng ./, ../, / và không phải alias @lms/*
    if (
      !imp.startsWith(".") &&
      !imp.startsWith("/") &&
      !imp.startsWith("@lms/") &&
      !/[\$\?\#\:]/.test(imp)
    ) {
      deps.add(imp.split("/")[0]); // chỉ package chính
    }
  }
  return deps;
}

function addDepsToPackageJson(pkgPath) {
  console.log(`\nProcessing package: ${pkgPath}`);
  const files = readFilesRecursive(pkgPath);
  const allImports = new Set();

  files.forEach((file) => {
    extractImports(file).forEach((dep) => allImports.add(dep));
  });

  const pkgJsonPath = path.join(pkgPath, "package.json");
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  pkgJson.dependencies = pkgJson.dependencies || {};

  let added = false;
  allImports.forEach((dep) => {
    if (!pkgJson.dependencies[dep]) {
      pkgJson.dependencies[dep] = "latest";
      added = true;
    }
  });

  if (added) {
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2), "utf-8");
    console.log("Updated package.json with new dependencies.");
  } else {
    console.log("No new dependencies to add.");
  }
}

// --- MAIN ---
const packages = [APPS_DIR, LIBS_DIR, FEATURES_DIR];
packages.forEach((dir) => {
  if (fs.existsSync(dir)) {
    const subDirs = fs.readdirSync(dir);
    subDirs.forEach((sub) => {
      const pkgPath = path.join(dir, sub);
      if (fs.existsSync(path.join(pkgPath, "package.json"))) {
        addDepsToPackageJson(pkgPath);
      }
    });
  }
});
