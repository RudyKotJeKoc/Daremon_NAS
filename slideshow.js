import { mediaFiles } from './slideshow-media.js';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov'];

const SLIDESHOW_INTERVAL_MS = 10_000;
let slideshowTimerId = null;

function getMediaType(filePath) {
  const extension = filePath.split('.').pop()?.toLowerCase();
  if (!extension) {
    return null;
  }
  if (IMAGE_EXTENSIONS.includes(extension)) {
    return 'image';
  }
  if (VIDEO_EXTENSIONS.includes(extension)) {
    return 'video';
  }
  return null;
}

function createMediaElement(filePath, mediaType) {
  if (mediaType === 'image') {
    const imageElement = document.createElement('img');
    imageElement.src = filePath;
    imageElement.alt = 'Slajd pokazujący wizualizację radia ETS';
    imageElement.loading = 'lazy';
    imageElement.setAttribute('role', 'img');
    imageElement.setAttribute('aria-label', 'Kolejny obraz w pokazie slajdów');
    return imageElement;
  }

  if (mediaType === 'video') {
    const videoElement = document.createElement('video');
    videoElement.src = filePath;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.setAttribute('aria-label', 'Krótkie wideo w pokazie slajdów');
    videoElement.setAttribute('role', 'img');
    return videoElement;
  }

  return null;
}

function renderEmptyState(container) {
  const placeholder = document.createElement('p');
  placeholder.className = 'slideshow-placeholder';
  placeholder.textContent = 'Brak dostępnych multimediów do wyświetlenia.';
  placeholder.setAttribute('role', 'status');
  placeholder.setAttribute('aria-live', 'polite');
  container.replaceChildren(placeholder);
}

function updateSlideshow(container, availableMedia) {
  if (!container || availableMedia.length === 0) {
    if (container) {
      renderEmptyState(container);
    }
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableMedia.length);
  const { filePath, mediaType } = availableMedia[randomIndex];
  const mediaElement = createMediaElement(filePath, mediaType);

  if (!mediaElement) {
    return;
  }

  container.replaceChildren(mediaElement);
}

function prepareMediaManifest() {
  if (!Array.isArray(mediaFiles)) {
    return [];
  }

  const seen = new Set();

  return mediaFiles
    .filter((filePath) => typeof filePath === 'string' && filePath.trim() !== '')
    .map((filePath) => {
      const normalisedPath = filePath.trim();
      const mediaType = getMediaType(normalisedPath);
      return { filePath: normalisedPath, mediaType };
    })
    .filter((entry) => {
      if (entry.mediaType === null || seen.has(entry.filePath)) {
        return false;
      }
      seen.add(entry.filePath);
      return true;
    });
}

function initialiseSlideshow() {
  const container = document.getElementById('slideshow-container');
  const manifest = prepareMediaManifest();

  if (!container || manifest.length === 0) {
    if (container) {
      renderEmptyState(container);
    }
    return;
  }

  updateSlideshow(container, manifest);

  if (slideshowTimerId !== null) {
    clearInterval(slideshowTimerId);
  }

  slideshowTimerId = window.setInterval(() => {
    updateSlideshow(container, manifest);
  }, SLIDESHOW_INTERVAL_MS);
}

document.addEventListener('DOMContentLoaded', initialiseSlideshow);
