// scripts/process-bundle.js
const fs = require('fs');
const path = require('path');

const measureId = process.argv[2];
if (!measureId) {
  console.error('❌ Please provide a measure directory name, e.g. cms69-bmi');
  process.exit(1);
}

const resourcesDir = path.join(__dirname, `../measure-bundles/${measureId}/resources`);
const outputPath = path.join(__dirname, `../measure-bundles/${measureId}/measure-bundle.json`);

function isJsonFile(filename) {
  return filename.endsWith('.json');
}

function buildBundle(resources) {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: resources.map(resource => ({ resource }))
  };
}

async function main() {
  if (!fs.existsSync(resourcesDir)) {
    console.error(`❌ Directory not found: ${resourcesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(resourcesDir).filter(isJsonFile);

  const resources = files.map(file => {
    const content = fs.readFileSync(path.join(resourcesDir, file), 'utf8');
    try {
      return JSON.parse(content);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
      process.exit(1);
    }
  });

  const bundle = buildBundle(resources);

  fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));
  console.log(`✅ Created measure bundle: ${outputPath}`);
}

main();
