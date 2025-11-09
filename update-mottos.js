#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_TRACKS = 500;
const DEFAULT_ARTIST = 'DAREMON Radio';
const COVER_COLORS = [
  '4CAF50',
  '2196F3',
  'FF9800',
  'E91E63',
  '9C27B0',
  '673AB7',
  '3F51B5',
  '03A9F4',
  '00BCD4',
  '009688',
  '8BC34A',
  'CDDC39',
  'FFEB3B',
  'FFC107',
  'FF5722',
  '795548',
  '9E9E9E',
  '607D8B'
];
const COVER_COLOR_OFFSET = 1;
const MOTTOS_FILE_NAME = 'mottos.json';

function loadMottos() {
  const mottosPath = path.join(__dirname, MOTTOS_FILE_NAME);

  let rawContent;
  try {
    rawContent = fs.readFileSync(mottosPath, 'utf-8');
  } catch (error) {
    throw new Error(`Unable to read ${MOTTOS_FILE_NAME}: ${error.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`Unable to parse ${MOTTOS_FILE_NAME} as JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${MOTTOS_FILE_NAME} must contain an array of mottos.`);
  }

  const normalized = parsed.map((entry, index) => {
    if (typeof entry !== 'string') {
      throw new Error(`Motto at index ${index} must be a string.`);
    }

    const trimmed = entry.trim();
    if (!trimmed) {
      throw new Error(`Motto at index ${index} is empty after trimming.`);
    }

    return trimmed;
  });

  if (normalized.length !== TOTAL_TRACKS) {
    throw new Error(`Expected exactly ${TOTAL_TRACKS} mottos, but received ${normalized.length}.`);
  }

  return normalized;
}

function loadJson(filePath, description) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    throw new Error(`Unable to read ${description}: ${error.message}`);
  }
}

const mottos = loadMottos();

function resolveCoverUrl(index) {
  const paletteIndex = (index + COVER_COLOR_OFFSET) % COVER_COLORS.length;
  const paletteColor = COVER_COLORS[paletteIndex];
  const trackNumber = index + 1;
  return `https://placehold.co/120x120/${paletteColor}/ffffff?text=${trackNumber}`;
}

function ensurePlaylistTracks(playlistData) {
  const existingById = new Map(
    Array.isArray(playlistData?.tracks)
      ? playlistData.tracks.map(track => [track.id, track])
      : []
  );

  const normalizedTracks = mottos.map((motto, index) => {
    const trackNumber = index + 1;
    const trackId = `track-${trackNumber}`;
    const defaultTrack = {
      id: trackId,
      title: motto,
      artist: DEFAULT_ARTIST,
      src: `/music/Utwor%20(${trackNumber}).mp3`,
      cover: resolveCoverUrl(index),
      tags: ['music'],
      weight: 1,
      type: 'song',
      golden: false
    };

    const existingTrack = existingById.get(trackId) || {};

    return {
      ...defaultTrack,
      ...existingTrack,
      id: trackId,
      title: motto
    };
  });

  playlistData.tracks = normalizedTracks;
  return normalizedTracks.length;
}

function ensureTrackMetadata(metadata) {
  const existingByFile = new Map(
    Array.isArray(metadata?.tracks)
      ? metadata.tracks.map(entry => [entry.file, entry])
      : []
  );

  const normalizedMetadata = mottos.map((motto, index) => {
    const trackNumber = index + 1;
    const fileName = `Utwor (${trackNumber}).mp3`;
    const existingRecord = existingByFile.get(fileName);

    return {
      ...existingRecord,
      file: fileName,
      title: motto,
      artist: existingRecord?.artist || DEFAULT_ARTIST
    };
  });

  metadata.tracks = normalizedMetadata;
  return normalizedMetadata.length;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function main() {
  const playlistPath = path.join(__dirname, 'playlist.json');
  const tracksPath = path.join(__dirname, 'tracks.json');

  const playlist = loadJson(playlistPath, 'playlist.json');
  const tracksMetadata = loadJson(tracksPath, 'tracks.json');

  const updatedPlaylistCount = ensurePlaylistTracks(playlist);
  const updatedMetadataCount = ensureTrackMetadata(tracksMetadata);

  writeJson(playlistPath, playlist);
  writeJson(tracksPath, tracksMetadata);

  console.log(`✅ Updated ${updatedPlaylistCount} track titles in playlist.json`);
  console.log(`✅ Updated ${updatedMetadataCount} track titles in tracks.json`);
  console.log('📻 Radio DAREMON now plays with motivational mottos!');
}

main();
