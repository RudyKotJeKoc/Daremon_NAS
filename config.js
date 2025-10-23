// Global and ESM-friendly config for the app
// Note: Values below are safe defaults for development/demo. Override via build-time env injection if needed.

const DEFAULT_CONFIG = {
  PROJECT_NAME: 'DAREMON Radio ETS',
  COMPANY_NAME: 'Firma',
  PREVIOUS_EMPLOYER_NAME: 'Poprzedni pracodawca',
  WHATSAPP_LINK: 'https://example.com',
  STORAGE_PREFIX: 'daremon',
  MACHINE_DOCS_KEY: 'daremon_machine_docs_v1',
  ANALYSIS_SCHEDULE_KEY: 'daremon_analysis_scheduled',
  MUSIC_TRACKS_ENDPOINT: null,
  // Media availability checking strategy
  // Options: 'lazy' (default), 'skip', 'parallel', 'sequential'
  MEDIA_AVAILABILITY_STRATEGY: 'lazy',
  // Chunk size for parallel checking (only used when strategy is 'parallel')
  MEDIA_AVAILABILITY_CHUNK_SIZE: 50,
};

// If a build system injects envs, prefer them. Fallback to defaults.
const injected = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
const CONFIG_OBJ = { ...DEFAULT_CONFIG, ...injected };

// Attach to window for non-module scripts
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG_OBJ;
}

// Export for ES modules
export const CONFIG = CONFIG_OBJ;
