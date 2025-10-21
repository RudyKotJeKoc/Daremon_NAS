import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MEDIA_DIRECTORIES = ['images', 'video'];

/**
 * Fixes filenames by adding space before parentheses
 * Example: image(27).jpg -> image (27).jpg
 */
function shouldRenameFile(filename) {
  // Pattern: anything followed by opening parenthesis without space before it
  return /\S\(\d+\)\./i.test(filename);
}

function getFixedFilename(filename) {
  // Add space before (number) pattern
  return filename.replace(/(\S)\((\d+)\)\./g, '$1 ($2).');
}

async function fixFilenamesInDirectory(directoryPath) {
  const renamedFiles = [];
  let entries;

  try {
    entries = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️ Directory not found: ${directoryPath}`);
      return renamedFiles;
    }
    throw error;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Recursively fix nested directories
      const nestedPath = path.join(directoryPath, entry.name);
      const nestedRenamed = await fixFilenamesInDirectory(nestedPath);
      renamedFiles.push(...nestedRenamed);
      continue;
    }

    if (shouldRenameFile(entry.name)) {
      const oldPath = path.join(directoryPath, entry.name);
      const newFilename = getFixedFilename(entry.name);
      const newPath = path.join(directoryPath, newFilename);

      try {
        await fs.rename(oldPath, newPath);
        const relativePath = path.relative(ROOT_DIR, oldPath);
        console.log(`✅ Renamed: ${relativePath} -> ${newFilename}`);
        renamedFiles.push({
          old: relativePath,
          new: path.relative(ROOT_DIR, newPath)
        });
      } catch (error) {
        console.error(`❌ Failed to rename ${entry.name}:`, error.message);
      }
    }
  }

  return renamedFiles;
}

async function main() {
  console.log('🔍 Scanning for files with incorrect naming...\n');

  const allRenamed = [];

  for (const directory of MEDIA_DIRECTORIES) {
    const absoluteDir = path.join(ROOT_DIR, directory);
    console.log(`Checking: ${directory}/`);
    const renamed = await fixFilenamesInDirectory(absoluteDir);
    allRenamed.push(...renamed);
  }

  console.log(`\n📊 Summary: ${allRenamed.length} files renamed`);

  if (allRenamed.length > 0) {
    console.log('\n💡 Don\'t forget to run: npm run generate-manifest');
    console.log('   to update slideshow-media.js with the new filenames');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { shouldRenameFile, getFixedFilename, fixFilenamesInDirectory };
