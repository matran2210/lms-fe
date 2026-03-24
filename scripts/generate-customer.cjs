/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

// =======================
// FEATURE MAP
// =======================

const FEATURE_MODULE_MAP = {
  // example: @ops/feature-user => "feature-name": "nameModule"
  // Optional features
  "feature-calendar": "calendarModule",
  "feature-test": "testModule",

  // Core features
  "feature-auth": "authModule",
  "feature-class": "classModule",
  "feature-courses": "coursesModule",
  "feature-dashboard": "dashboardModule",
  "feature-notifications": "notificationsModule",
  "feature-user": "userModule",
};

const FEATURE_FOLDER_MAP = {
  // example: @ops/feature-user => "feature-name": "folder-name"
  // Optional features
  "feature-calendar": "calendar",
  "feature-test": "test",

  // Core features
  "feature-auth": "auth",
  "feature-class": "class",
  "feature-courses": "courses",
  "feature-dashboard": "dashboard",
  "feature-notifications": "notifications",
  "feature-user": "user",
};

// =======================
// 1.INPUT CUSTOMER
// =======================

const customer = process.argv[2];

if (!customer) {
  console.error("Please provide customer name");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "configs", `${customer}.json`);

if (!fs.existsSync(configPath)) {
  console.error("Customer config not found:", configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

if (!Array.isArray(config.features)) {
  console.error("Invalid config: features must be an array");
  process.exit(1);
}

// validate mapping
config.features.forEach((f) => {
  if (!FEATURE_MODULE_MAP[f]) {
    console.error(`Missing module mapping: ${f}`);
    process.exit(1);
  }
  if (!FEATURE_FOLDER_MAP[f]) {
    console.error(`Missing folder mapping: ${f}`);
    process.exit(1);
  }
});

// =======================
// 2️. DEFINE OUTPUT
// =======================

const outputDir = path.resolve(rootDir, "..", `lms-pro-${config.name}`);

console.log("================================");
console.log(`Generating: ${config.name}`);
console.log(`Output: ${outputDir}`);
console.log("Features:", config.features);
console.log("================================");

if (fs.existsSync(outputDir)) {
  console.log("🧹 Removing existing project...");
  fse.removeSync(outputDir);
}

// =======================
// 3️. COPY PROJECT
// =======================

fse.copySync(rootDir, outputDir, {
  filter: (src) => {
    if (
      src.includes("node_modules") ||
      src.includes(".git") ||
      src.includes("lms-pro-") ||
      src.includes("dist") ||
      src.endsWith(".env") ||
      src.endsWith(".npmrc") ||
      src.includes("scripts") ||
      src.includes("configs")
    ) {
      return false;
    }

    const appsPath = path.join(rootDir, "apps");
    if (src.startsWith(appsPath) && src !== appsPath) {
      const relative = path.relative(appsPath, src);
      const appNameFolder = relative.split(path.sep)[0];
      if (appNameFolder && appNameFolder !== "lms-pro") {
        return false;
      }
    }

    return true;
  },
});

console.log("Project copied");

// =======================
// 4️. REMOVE UNUSED FEATURES
// =======================

const featuresDir = path.join(outputDir, "features");

if (fs.existsSync(featuresDir)) {
  const enabledFolders = config.features.map((f) => FEATURE_FOLDER_MAP[f]);

  fs.readdirSync(featuresDir).forEach((folderName) => {
    if (!enabledFolders.includes(folderName)) {
      fse.removeSync(path.join(featuresDir, folderName));
      console.log(`Removed feature: ${folderName}`);
    }
  });
}

// =======================
// 5️. FIND APP
// =======================

const appsDir = path.join(outputDir, "apps");
const appsFolders = fs.readdirSync(appsDir).filter((f) => !f.startsWith("."));
const appName = appsFolders[0];

if (!appName) {
  console.error("No app found");
  process.exit(1);
}

const appRoot = path.join(appsDir, appName);
console.log(`App: ${appName}`);

// =======================
// 6. UPDATE PACKAGE.JSON
// =======================

const appPackagePath = path.join(appRoot, "package.json");

if (fs.existsSync(appPackagePath)) {
  const appPkg = JSON.parse(fs.readFileSync(appPackagePath, "utf-8"));

  Object.keys(appPkg.dependencies || {}).forEach((dep) => {
    if (dep.startsWith("@lms/feature-")) {
      const featureName = dep.replace("@lms/", "");

      if (!config.features.includes(featureName)) {
        delete appPkg.dependencies[dep];
        console.log(`Removed dependency: ${dep}`);
      }
    }
  });

  fs.writeFileSync(appPackagePath, JSON.stringify(appPkg, null, 2));
}

// =======================
// 7️. REWRITE MODULE REGISTRY
// =======================

const registryPath = path.join(appRoot, "src/app", "module-registry.ts");

if (fs.existsSync(registryPath)) {
  const imports = [];
  const modulesList = [];

  config.features.forEach((feature) => {
    const moduleVar = FEATURE_MODULE_MAP[feature];
    const folderName = FEATURE_FOLDER_MAP[feature];
    if (!["calendar", "test", "certificate"].includes(folderName)) return;

    if (fs.existsSync(path.join(featuresDir, folderName))) {
      imports.push(`import { ${moduleVar} } from "@lms/${feature}"`);
      modulesList.push(moduleVar);
    }
  });

  const content = `
// AUTO-GENERATED FILE - DO NOT EDIT

import { AppModule } from "@lms/core"
${imports.join("\n")}

export const modules: AppModule[] = [
  ${modulesList.join(",\n  ")}
]
`;

  fs.writeFileSync(registryPath, content);
  console.log("module-registry updated");
}

// =======================
// 8️. REMOVE LOCK
// =======================

const lockPath = path.join(outputDir, "pnpm-lock.yaml");
if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);

// =======================
// 9️. REMOVE ENV (QUÉT TOÀN BỘ)
// =======================

const removeEnvRecursive = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      removeEnvRecursive(fullPath);
    } else if (
      file === ".env" ||
      file === ".env.local" ||
      file === ".env.development" ||
      file === ".env.production" ||
      file === ".npmrc"
    ) {
      fs.unlinkSync(fullPath);
      console.log(`🗑 Removed env: ${fullPath}`);
    }
  });
};

removeEnvRecursive(outputDir);

// =======================
// 10. CLEAN INTERNAL
// =======================
["scripts", "configs", ".git", ".vscode"].forEach((folder) => {
  const p = path.join(outputDir, folder);
  if (fs.existsSync(p)) {
    fse.removeSync(p);
    console.log(`Removed: ${folder}`);
  }
});

console.log("================================");
console.log(" DONE!");
console.log(` cd ../lms-fe-${config.name}`);
console.log(" pnpm install");
console.log(` pnpm --filter ${appName} dev`);
console.log("================================");
