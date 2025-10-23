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

    container.innerHTML = '';
    const mediaPath = getRandomMedia(files);
    if (!mediaPath) {
        return;
    }

    const fileExtension = decodeURI(mediaPath).split('.').pop().toLowerCase();

    let mediaElement = null;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension)) {
        mediaElement = document.createElement('img');
        mediaElement.src = mediaPath;
        mediaElement.alt = 'Okładka utworu - obraz z pokazu slajdów';
        mediaElement.className = 'track-cover-media';
        mediaElement.setAttribute('role', 'img');


        mediaElement.setAttribute('aria-label', 'Grafika z pokazu slajdów radia ETS');
        
        // Add error handler for images
        mediaElement.addEventListener('error', () => {
            console.warn(`Failed to load image: ${mediaPath}`);
            // Try to load another media on error
            setTimeout(() => updateSlideshow(files), 1000);
        });
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
        mediaElement = document.createElement('video');
        mediaElement.src = mediaPath;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.loop = true;
        mediaElement.playsInline = true;
        mediaElement.className = 'track-cover-media';
        mediaElement.setAttribute('aria-label', 'Wideo wyświetlane jako okładka utworu');
        mediaElement.setAttribute('role', 'img');
        
        // Add error handler for videos
        mediaElement.addEventListener('error', () => {
            console.warn(`Failed to load video: ${mediaPath}`);
            // Try to load another media on error
            setTimeout(() => updateSlideshow(files), 1000);
        });
    }

    if (mediaElement) {
        container.appendChild(mediaElement);
    }
}

updateSlideshow();
setInterval(updateSlideshow, 10000);

export { getRandomMedia, updateSlideshow };
