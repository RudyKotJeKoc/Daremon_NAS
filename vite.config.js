import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'granulate-survey': resolve(__dirname, 'granulate-survey.html'),
        polls: resolve(__dirname, 'polls.html')
      }
    }
  }
});
