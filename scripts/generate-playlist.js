import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Configuration
const MUSIC_DIR = path.join(ROOT_DIR, 'music');
const OUTPUT_FILE = path.join(ROOT_DIR, 'playlist.json');
const SUPPORTED_FORMATS = ['.mp3', '.wav', '.ogg', '.m4a'];

// Playlist configuration
const PLAYLIST_CONFIG = {
  quietHours: { start: "22:00", end: "06:00" },
  jingle: {
    enabled: true,
    everySongs: 4,
    orMinutes: 15,
    cover: "https://placehold.co/120x120/ff00ff/ffffff?text=RETRO"
  },
  recentMemory: 15,
  crossfadeSeconds: 2
};

/**
 * Encode media path for URL usage
 * Spaces become %20, parentheses are preserved but encoded
 */
function encodeMediaPath(filePath) {
  if (typeof filePath !== 'string') {
    return filePath;
  }

  // Split path into segments
  const segments = filePath.split('/');

  // Encode each segment (except the protocol part)
  const encodedSegments = segments.map((segment, index) => {
    // Don't encode empty segments or protocol (http:, https:)
    if (!segment || segment.endsWith(':')) {
      return segment;
    }

    // Encode the segment
    // This will encode spaces as %20 and special chars properly
    return encodeURIComponent(segment)
      // But we want to keep parentheses readable in the encoded form
      .replace(/%20/g, '%20')  // spaces
      .replace(/%28/g, '%28')  // (
      .replace(/%29/g, '%29'); // )
  });

  return encodedSegments.join('/');
}

/**
 * Extract title from filename
 * Removes extension and cleans up the name
 */
function extractTitle(filename) {
  const withoutExt = filename.replace(/\.(mp3|wav|ogg|m4a)$/i, '');

  // Clean up common patterns
  return withoutExt
    .replace(/[-_]/g, ' ')  // Replace dashes and underscores with spaces
    .replace(/\s+/g, ' ')   // Normalize multiple spaces
    .trim();
}

/**
 * Generate a nice color for the cover placeholder
 */
function generateCoverColor(index) {
  const colors = [
    '4CAF50', // Green
    '2196F3', // Blue
    'FF9800', // Orange
    '9C27B0', // Purple
    'F44336', // Red
    '00BCD4', // Cyan
    'FFEB3B', // Yellow
    '795548', // Brown
    '607D8B', // Blue Grey
    'E91E63', // Pink
  ];

  return colors[index % colors.length];
}

/**
 * Scan music directory and collect all audio files
 */
async function scanMusicDirectory(directory) {
  const tracks = [];
  let entries;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Music directory not found: ${directory}`);
      return tracks;
    }
    throw error;
  }

  // Sort entries for consistent ordering
  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  let trackIndex = 0;

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const nestedTracks = await scanMusicDirectory(fullPath);
      tracks.push(...nestedTracks);
      continue;
    }

    // Check if file has supported extension
    const ext = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      continue;
    }

    // Calculate relative path from root
    const relativePath = './' + path.relative(ROOT_DIR, fullPath).split(path.sep).join('/');

    // Encode path for URL usage
    const encodedPath = encodeMediaPath(relativePath);

    // Extract title from filename
    const title = extractTitle(entry.name);

    // Create track object
    const track = {
      id: `track-${trackIndex + 1}`,
      title: title,
      artist: "DAREMON Radio",
      src: encodedPath,
      cover: `https://placehold.co/120x120/${generateCoverColor(trackIndex)}/ffffff?text=${trackIndex + 1}`,
      tags: ["music"],
      weight: 1,
      type: "song",
      golden: false
    };

    tracks.push(track);
    trackIndex++;
  }

  return tracks;
}

/**
 * Generate complete playlist.json
 */
async function generatePlaylist() {
  console.log('🎵 Generowanie playlisty...');
  console.log(`📁 Skanowanie katalogu: ${MUSIC_DIR}`);

  // Scan music directory
  const tracks = await scanMusicDirectory(MUSIC_DIR);

  if (tracks.length === 0) {
    console.warn('⚠️  Nie znaleziono żadnych utworów!');
    return;
  }

  console.log(`✅ Znaleziono ${tracks.length} utworów`);

  // Create playlist object
  const playlist = {
    config: PLAYLIST_CONFIG,
    tracks: tracks
  };

  // Write to file
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(playlist, null, 2), 'utf-8');

  console.log(`✅ Zapisano playlistę do: ${OUTPUT_FILE}`);
  console.log(`📊 Statystyki:`);
  console.log(`   - Utworów: ${tracks.length}`);
  console.log(`   - Pierwszy: ${tracks[0]?.title}`);
  console.log(`   - Ostatni: ${tracks[tracks.length - 1]?.title}`);

  // Show some examples
  console.log('\n📋 Przykładowe wpisy:');
  tracks.slice(0, 5).forEach(track => {
    console.log(`   ${track.id}: ${track.title} -> ${track.src}`);
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    await generatePlaylist();
  } catch (error) {
    console.error('❌ Błąd podczas generowania playlisty:', error);
    process.exitCode = 1;
  }
}

// Run if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}

export { generatePlaylist, scanMusicDirectory, encodeMediaPath };
