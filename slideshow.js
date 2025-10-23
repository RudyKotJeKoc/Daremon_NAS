const createNumberedMediaList = (basePath, prefix, count, extension) => Array.from(
    { length: count },
    (_, index) => `${basePath}/${prefix} (${index + 1}).${extension}`
);

const mediaFiles = [

    ...createNumberedMediaList('https://daremon.nl/images', 'image', 64, 'png'),
    'https://daremon.nl/images/logo.png',

    ...createNumberedMediaList('https://daremon.nl/video', 'video', 50, 'mp4'),
];

function getRandomMedia(files = mediaFiles) {
    if (!Array.isArray(files) || files.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const filePath = files[randomIndex];

    if (typeof filePath !== 'string') {
        return filePath;
    }

    return encodeURI(filePath);
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
        mediaElement.setAttribute('aria-label', 'Grafika wyświetlana jako okładka utworu');
    } else if (['mp4'].includes(fileExtension)) {
        mediaElement = document.createElement('video');
        mediaElement.src = mediaPath;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.loop = true;
        mediaElement.playsInline = true;
        mediaElement.className = 'track-cover-media';
        mediaElement.setAttribute('aria-label', 'Wideo wyświetlane jako okładka utworu');
        mediaElement.setAttribute('role', 'img');
    }

    if (mediaElement) {
        container.appendChild(mediaElement);
    }
}

updateSlideshow();
setInterval(updateSlideshow, 10000);

export { getRandomMedia, updateSlideshow };
