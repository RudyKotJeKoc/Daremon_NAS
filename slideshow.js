const mediaFiles = [
    'https://daremon.nl/images/image(1).jpg', 'https://daremon.nl/images/image(2).jpg', 'https://daremon.nl/images/image(3).jpg', 'https://daremon.nl/images/image(4).jpg',
    'https://daremon.nl/images/image(5).jpg', 'https://daremon.nl/images/image(6).jpg', 'https://daremon.nl/images/image(7).jpg', 'https://daremon.nl/images/image(8).jpg',
    'https://daremon.nl/images/image(9).jpg', 'https://daremon.nl/images/image(10).jpg', 'https://daremon.nl/images/image(11).jpg', 'https://daremon.nl/images/image(12).jpg',
    'https://daremon.nl/images/image(13).jpg', 'https://daremon.nl/images/image(14).jpg', 'https://daremon.nl/images/image(15).jpg', 'https://daremon.nl/images/image(16).jpg',
    'https://daremon.nl/images/image(17).jpg', 'https://daremon.nl/images/image(18).jpg', 'https://daremon.nl/images/image(19).jpg', 'https://daremon.nl/images/image(20).jpg',
    'https://daremon.nl/images/image(21).jpg', 'https://daremon.nl/images/image(22).jpg', 'https://daremon.nl/images/image(23).jpg', 'https://daremon.nl/images/image(24).jpg',
    'https://daremon.nl/images/image(25).jpg', 'https://daremon.nl/images/image(26).jpg', 'https://daremon.nl/images/image(27).jpg', 'https://daremon.nl/images/image(28).jpg',
    'https://daremon.nl/images/image(29).jpg', 'https://daremon.nl/images/image(30).jpg', 'https://daremon.nl/images/image(31).jpg', 'https://daremon.nl/images/image(32).jpg',
    'https://daremon.nl/images/image(33).jpg', 'https://daremon.nl/images/image(34).jpg', 'https://daremon.nl/images/image(35).jpg', 'https://daremon.nl/images/image(36).jpg',
    'https://daremon.nl/images/image(37).jpg', 'https://daremon.nl/images/image(38).jpg', 'https://daremon.nl/images/image(39).jpg', 'https://daremon.nl/images/image(40).jpg',
    'https://daremon.nl/images/image(41).jpg', 'https://daremon.nl/images/image(42).jpg', 'https://daremon.nl/images/image(43).jpg', 'https://daremon.nl/images/image(44).jpg',
    'https://daremon.nl/images/image(45).jpg', 'https://daremon.nl/images/image(46).jpg', 'https://daremon.nl/images/image(47).jpg', 'https://daremon.nl/images/image(48).jpg',
    'https://daremon.nl/images/image(49).jpg', 'https://daremon.nl/images/image(50).jpg', 'https://daremon.nl/images/image(51).jpg', 'https://daremon.nl/images/image(52).jpg',
    'https://daremon.nl/images/image(53).jpg', 'https://daremon.nl/images/image(54).jpg', 'https://daremon.nl/images/image(55).jpg', 'https://daremon.nl/images/image(56).jpg',
    'https://daremon.nl/images/image(57).jpg', 'https://daremon.nl/images/image(58).jpg', 'https://daremon.nl/images/image(59).jpg', 'https://daremon.nl/images/image(60).jpg',
    'https://daremon.nl/images/image(61).jpg', 'https://daremon.nl/images/logo.jpg',
    'https://daremon.nl/video/video(1).mp4', 'https://daremon.nl/video/video(2).mp4', 'https://daremon.nl/video/video(3).mp4', 'https://daremon.nl/video/video(4).mp4',
    'https://daremon.nl/video/video(5).mp4', 'https://daremon.nl/video/video(6).mp4', 'https://daremon.nl/video/video(7).mp4', 'https://daremon.nl/video/video(8).mp4',
    'https://daremon.nl/video/video(9).mp4', 'https://daremon.nl/video/video(10).mp4', 'https://daremon.nl/video/video(11).mp4', 'https://daremon.nl/video/video(12).mp4',
    'https://daremon.nl/video/video(13).mp4', 'https://daremon.nl/video/video(14).mp4', 'https://daremon.nl/video/video(15).mp4', 'https://daremon.nl/video/video(16).mp4',
    'https://daremon.nl/video/video(17).mp4', 'https://daremon.nl/video/video(18).mp4', 'https://daremon.nl/video/video(19).mp4', 'https://daremon.nl/video/video(20).mp4',
    'https://daremon.nl/video/video(21).mp4', 'https://daremon.nl/video/video(22).mp4', 'https://daremon.nl/video/video(23).mp4', 'https://daremon.nl/video/video(24).mp4',
    'https://daremon.nl/video/video(25).mp4', 'https://daremon.nl/video/video(26).mp4', 'https://daremon.nl/video/video(27).mp4', 'https://daremon.nl/video/video(28).mp4',
    'https://daremon.nl/video/video(29).mp4', 'https://daremon.nl/video/video(30).mp4', 'https://daremon.nl/video/video(31).mp4', 'https://daremon.nl/video/video(32).mp4',
    'https://daremon.nl/video/video(33).mp4', 'https://daremon.nl/video/video(34).mp4', 'https://daremon.nl/video/video(35).mp4', 'https://daremon.nl/video/video(36).mp4',
    'https://daremon.nl/video/video(37).mp4', 'https://daremon.nl/video/video(38).mp4', 'https://daremon.nl/video/video(39).mp4', 'https://daremon.nl/video/video(40).mp4',
    'https://daremon.nl/video/video(41).mp4', 'https://daremon.nl/video/video(42).mp4', 'https://daremon.nl/video/video(43).mp4', 'https://daremon.nl/video/video(44).mp4',
    'https://daremon.nl/video/video(45).mp4', 'https://daremon.nl/video/video(46).mp4', 'https://daremon.nl/video/video(47).mp4'
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
