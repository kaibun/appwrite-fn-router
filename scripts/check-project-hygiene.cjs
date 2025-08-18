#!/usr/bin/env node
// Utility script to check project hygiene issues (empty files, etc.)
// All comments in English. Max line length: 80 chars.

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all files in a directory.
 * @param {string} dir - Directory to search.
 * @returns {string[]} - Array of file paths.
 */
// Memoized file list for performance
let _allFilesCache = null;
function getAllFiles(dir) {
  if (_allFilesCache) return _allFilesCache;
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  });
  _allFilesCache = results;
  return results;
}

/**
 * Check for empty files in the project.
 * @param {string} rootDir - Root directory to check.
 * @returns {string[]} - Array of empty file paths.
 */
function findEmptyFiles(rootDir) {
  const files = getAllFiles(rootDir);
  return files.filter((file) => {
    const stat = fs.statSync(file);
    return stat.size === 0;
  });
}

// Utility function array: each returns { label, files }
const hygieneChecks = [
  {
    label: 'Empty files',
    fn: findEmptyFiles,
  },
  // Add more checks here as { label, fn }
];

// Main entry point
function main() {
  const rootDir = process.cwd();
  let hasIssues = false;
  hygieneChecks.forEach(({ label, fn }) => {
    const files = fn(rootDir);
    if (files.length > 0) {
      hasIssues = true;
      console.log(`${label} found:`);
      files.forEach((file) => console.log('  -', file));
    } else {
      console.log(`No ${label.toLowerCase()} found.`);
    }
  });
  process.exitCode = hasIssues ? 1 : 0;
}

main();
