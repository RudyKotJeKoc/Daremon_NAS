import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Plugin to copy static assets that are not automatically handled by Vite
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      
      // Files to copy to dist root
      const filesToCopy = [
        'playlist.json',
        'tracks.json',
        'mottos.json',
        'sw.js',
        'template_config.json',
        '.htaccess'
      ];
      
      // Copy individual files
      filesToCopy.forEach(file => {
        const src = resolve(__dirname, file);
        const dest = resolve(distDir, file);
        try {
          copyFileSync(src, dest);
          console.log(`✓ Copied ${file}`);
        } catch (err) {
          console.warn(`⚠ Could not copy ${file}:`, err.message);
        }
      });
      
      // Copy entire directories
      const dirsToCopy = ['locales', 'music', 'images', 'video', 'visualizer', 'scripts', 'daremon'];
      
      dirsToCopy.forEach(dir => {
        const srcDir = resolve(__dirname, dir);
        const destDir = resolve(distDir, dir);
        
        try {
          copyDir(srcDir, destDir);
          console.log(`✓ Copied ${dir}/ directory`);
        } catch (err) {
          console.warn(`⚠ Could not copy ${dir}/:`, err.message);
        }
      });
    }
  };
}

// Recursive directory copy function
function copyDir(src, dest) {
  try {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  } catch (err) {
    // Directory might not exist, that's okay
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'granulate-survey': resolve(__dirname, 'granulate-survey.html'),
        polls: resolve(__dirname, 'polls.html'),
        'vso-calculator': resolve(__dirname, 'vso-calculator.html')
      }
    }
  },
  plugins: [copyStaticAssets()]
});
