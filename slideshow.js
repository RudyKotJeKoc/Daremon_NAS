import { encodeMediaPath } from './media-utils.js';
import { mediaFiles as generatedMediaFiles } from './slideshow-media.js';

const createNumberedMediaList = (basePath, prefix, count, extension) => Array.from(
    { length: count },
    (_, index) => `${basePath}/${prefix} (${index + 1}).${extension}`
);


const externalMediaFiles = [
    ...createNumberedMediaList('https://daremon.nl/images', 'image', 61, 'png'),
    'https://daremon.nl/images/logo.png',
    ...createNumberedMediaList('https://daremon.nl/video', 'video', 47, 'mp4'),
];

// Combine locally generated media files with external URLs for more variety
const mediaFiles = [...generatedMediaFiles, ...externalMediaFiles];

// Slideshow state management
let slideshowInterval = null;
let currentMediaElement = null;
let currentWrapper = null;
let errorCount = 0;
const MAX_RETRIES = 3;

function getRandomMedia(files = mediaFiles) {
    if (!Array.isArray(files) || files.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const filePath = files[randomIndex];

    if (typeof filePath !== 'string') {
        return filePath;
    }

    return encodeMediaPath(filePath);
}

function updateSlideshow(files = mediaFiles) {
    if (typeof document === 'undefined') {
        return;
    }

    // Render to track-cover instead of slideshow-container
    const container = document.getElementById('track-cover');
    if (!container || !Array.isArray(files) || files.length === 0) {
        return;
    }

    const mediaPath = getRandomMedia(files);
    if (!mediaPath) {
        return;
    }

    const fileExtension = decodeURI(mediaPath).split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension);

    // Create wrapper on first run
    if (!currentWrapper) {
        currentWrapper = document.createElement('div');
        currentWrapper.classList.add('media-wrapper');
        container.appendChild(currentWrapper);
    }

    const applyOrientation = (width, height) => {
        currentWrapper.classList.remove('is-portrait', 'is-landscape');
        if (!width || !height) {
            return;
        }
        currentWrapper.classList.add(width >= height ? 'is-landscape' : 'is-portrait');
    };

    // Check if we need to create a new element
    const needsNewElement = !currentMediaElement ||
        (isImage && currentMediaElement.tagName !== 'IMG') ||
        (isVideo && currentMediaElement.tagName !== 'VIDEO');

    if (needsNewElement) {
        // Cleanup old element
        if (currentMediaElement) {
            // Pause video if it's playing
            if (currentMediaElement.tagName === 'VIDEO') {
                currentMediaElement.pause();
                currentMediaElement.src = '';
            }
            currentMediaElement.remove();
            currentMediaElement = null;
        }

        // Create new element
        if (isImage) {
            currentMediaElement = document.createElement('img');
            currentMediaElement.alt = 'Okładka utworu - obraz z pokazu slajdów';
            currentMediaElement.className = 'track-cover-media';
            currentMediaElement.setAttribute('role', 'img');
            currentMediaElement.loading = 'lazy';
            currentMediaElement.setAttribute('aria-label', 'Grafika z pokazu slajdów radia ETS');

            // Error handler with retry limit
            currentMediaElement.addEventListener('error', () => {
                errorCount++;
                if (errorCount >= MAX_RETRIES) {
                    console.error(`Max retries (${MAX_RETRIES}) reached for slideshow`);
                    errorCount = 0;
                    return;
                }
                console.warn(`Failed to load image (attempt ${errorCount}/${MAX_RETRIES})`);
                setTimeout(() => updateSlideshow(files), 1000 * errorCount);
            }, { once: true });

            const handleImageOrientation = () => {
                applyOrientation(currentMediaElement.naturalWidth, currentMediaElement.naturalHeight);
                errorCount = 0; // Reset on success
            };

            if (currentMediaElement.complete && currentMediaElement.naturalWidth && currentMediaElement.naturalHeight) {
                handleImageOrientation();
            } else {
                currentMediaElement.addEventListener('load', handleImageOrientation, { once: true });
            }

            currentMediaElement.src = mediaPath;
        } else if (isVideo) {
            currentMediaElement = document.createElement('video');
            currentMediaElement.autoplay = true;
            currentMediaElement.muted = true;
            currentMediaElement.loop = true;
            currentMediaElement.playsInline = true;
            currentMediaElement.className = 'track-cover-media';
            currentMediaElement.setAttribute('aria-label', 'Wideo wyświetlane jako okładka utworu');
            currentMediaElement.setAttribute('role', 'img');

            // Error handler with retry limit
            currentMediaElement.addEventListener('error', () => {
                errorCount++;
                if (errorCount >= MAX_RETRIES) {
                    console.error(`Max retries (${MAX_RETRIES}) reached for slideshow`);
                    errorCount = 0;
                    return;
                }
                console.warn(`Failed to load video (attempt ${errorCount}/${MAX_RETRIES})`);
                setTimeout(() => updateSlideshow(files), 1000 * errorCount);
            }, { once: true });

            const handleVideoOrientation = () => {
                applyOrientation(currentMediaElement.videoWidth, currentMediaElement.videoHeight);
                errorCount = 0; // Reset on success
            };

            currentMediaElement.addEventListener('loadedmetadata', handleVideoOrientation, { once: true });
            currentMediaElement.src = mediaPath;
        }

        if (currentMediaElement) {
            currentWrapper.appendChild(currentMediaElement);
        }
    } else {
        // Reuse existing element, just change src
        if (currentMediaElement.tagName === 'VIDEO') {
            currentMediaElement.pause();
        }
        currentMediaElement.src = mediaPath;

        if (currentMediaElement.tagName === 'VIDEO') {
            currentMediaElement.play().catch(err => {
                console.warn('Video autoplay failed:', err);
            });
        }
    }
}

// Start slideshow with cleanup support
function startSlideshow(files = mediaFiles) {
    if (slideshowInterval) {
        return; // Already running
    }

    updateSlideshow(files);
    slideshowInterval = setInterval(() => updateSlideshow(files), 10000);
}

// Stop slideshow and cleanup
function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// Cleanup function for page unload
function cleanupSlideshow() {
    stopSlideshow();

    if (currentMediaElement) {
        if (currentMediaElement.tagName === 'VIDEO') {
            currentMediaElement.pause();
            currentMediaElement.src = '';
        }
        currentMediaElement.remove();
        currentMediaElement = null;
    }

    if (currentWrapper) {
        currentWrapper.remove();
        currentWrapper = null;
    }
}

// Auto-start with visibility control
if (typeof document !== 'undefined') {
    // Start on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => startSlideshow());
    } else {
        startSlideshow();
    }

    // Pause when tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cleanupSlideshow();
    });
}

export { getRandomMedia, updateSlideshow, startSlideshow, stopSlideshow, cleanupSlideshow };
