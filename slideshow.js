const createNumberedMediaList = (basePath, prefix, count, extension) => Array.from(
    { length: count },
    (_, index) => `${basePath}/${prefix} (${index + 1}).${extension}`
);

const mediaFiles = [
    ...createNumberedMediaList('https://daremon.nl/images', 'image', 61, 'jpg'),
    'https://daremon.nl/images/logo.jpg',
    ...createNumberedMediaList('https://daremon.nl/video', 'video', 47, 'mp4'),
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

    const container = document.getElementById('slideshow-container');
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
    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        mediaElement = document.createElement('img');
        mediaElement.src = mediaPath;
        mediaElement.alt = 'Multimedialny slajd radia ETS';
        mediaElement.setAttribute('role', 'img');
        mediaElement.setAttribute('aria-label', 'Grafika z pokazu slajdów radia ETS');
    } else if (['mp4'].includes(fileExtension)) {
        mediaElement = document.createElement('video');
        mediaElement.src = mediaPath;
        mediaElement.autoplay = true;
        mediaElement.muted = true;
        mediaElement.loop = true;
        mediaElement.playsInline = true;
        mediaElement.setAttribute('aria-label', 'Materiały wideo z pokazu slajdów radia ETS');
        mediaElement.setAttribute('role', 'img');
    }

    if (mediaElement) {
        container.appendChild(mediaElement);
    }
}

updateSlideshow();
setInterval(updateSlideshow, 10000);

export { getRandomMedia, updateSlideshow };
