const fs = require('fs');
const { resolve } = require('path');

const mainPackage = require('../package.json');
const examplePackage = require('../example/package.json');

/** Build the write path */
const writePath = resolve(__dirname, '..', 'example', 'package.json');

/** Sync data */
examplePackage.name = `${mainPackage.name}-examples`;
[
  'version',
  'description',
  'keyword',
  'author',
  'repository',
  'bugs',
  'homepage',
  'license'
].forEach((field) => {
  examplePackage[field] = mainPackage[field]
});

/** Save */
fs.writeFileSync(writePath, JSON.stringify(examplePackage, null, 2));
