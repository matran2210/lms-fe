#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const isCleanAll = process.argv.includes("--all");

function rimraf(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
      console.log(`✓ Removed ${dir}`);
    }
  } catch (error) {
    console.warn(`⚠ Could not remove ${dir}: ${error.message}`);
  }
}

console.log(
  `🧹 Cleaning build artifacts${isCleanAll ? " (including node_modules)" : ""}...\n`,
);

// Stop Turbo daemon first
try {
  console.log("Stopping Turbo daemon...");
  execSync("turbo daemon stop", { stdio: "ignore" });
} catch (error) {
  // Ignore if daemon is not running
}

// Clean root
console.log("\nCleaning root...");
rimraf(path.join(__dirname, "..", ".turbo"));
rimraf(path.join(__dirname, "..", "node_modules", ".cache"));

if (isCleanAll) {
  console.log("\nRemoving root node_modules...");
  rimraf(path.join(__dirname, "..", "node_modules"));
}

// Clean all packages
console.log("\nCleaning packages...");

// Get all package directories
const rootDir = path.join(__dirname, "..");
const packageDirs = [
  path.join(rootDir, "apps", "lms-pro"),
  path.join(rootDir, "apps", "lms-finhub"),
  path.join(rootDir, "apps", "lms-zoom"),
  path.join(rootDir, "libs"),
  path.join(rootDir, "features"),
  path.join(rootDir, "tools"),
];

// Clean each package directory
packageDirs.forEach((pkgDir) => {
  if (fs.existsSync(pkgDir)) {
    const dirs = fs.readdirSync(pkgDir, { withFileTypes: true });
    dirs.forEach((dir) => {
      if (dir.isDirectory()) {
        const fullPath = path.join(pkgDir, dir.name);

        // Clean .next
        if (dir.name === ".next") {
          rimraf(fullPath);
        }

        // Clean .turbo
        if (dir.name === ".turbo") {
          rimraf(fullPath);
        }

        // Clean node_modules/.cache or node_modules (if clean:all)
        if (dir.name === "node_modules") {
          if (isCleanAll) {
            rimraf(fullPath);
          } else {
            const cachePath = path.join(fullPath, ".cache");
            rimraf(cachePath);
          }
        }
      }
    });
  }
});

console.log("\n✅ Clean completed!");
