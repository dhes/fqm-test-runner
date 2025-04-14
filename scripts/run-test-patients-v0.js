// scripts/run-test-patients.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const measureId = process.argv[2];
if (!measureId) {
  console.error('❌ Please provide a measure directory name, e.g. cms69-bmi');
  process.exit(1);
}

const measureBundlePath = path.join(__dirname, `../measure-bundles/${measureId}/measure-bundle.json`);
const patientsRootDir = path.join(__dirname, `../measure-bundles/${measureId}/patient-bundles`);
const outputDir = path.join(__dirname, `../output/${measureId}`);

if (!fs.existsSync(measureBundlePath)) {
  console.error(`❌ Measure bundle not found at ${measureBundlePath}`);
  process.exit(1);
}

if (!fs.existsSync(patientsRootDir)) {
  console.error(`❌ Patient bundles directory not found at ${patientsRootDir}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function findPatientBundles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPatientBundles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

const patientFiles = findPatientBundles(patientsRootDir);

for (const file of patientFiles) {
  const id = path.basename(path.dirname(file));
  const label = path.basename(file, '.json');
  const outputFile = path.join(outputDir, `${id}-${label}-MeasureReport.json`);
  console.log(`▶️ Running fqm-execution on ${label}`);
  try {
    execSync(`fqm-execution reports -m "${measureBundlePath}" -p "${file}" -o "${outputFile}"`, { stdio: 'inherit' });
    console.log(`✅ Output written to ${outputFile}\n`);
  } catch (err) {
    console.error(`❌ Failed to process ${label}:`, err.message);
  }
}
