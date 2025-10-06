const FALLBACK_COVER = 'https://placehold.co/120x120/1A1A1A/FFFFFF?text=DAREMON';

function buildSubtitle(subtitle) {
    return typeof subtitle === 'string' ? subtitle.trim() : '';
}

export function createTrackListItem(track, options = {}) {
    if (!track) {
        throw new Error('Track details are required to build a list item');
    }

    const { subtitle = '', interactive = false, onActivate } = options;

    const listItem = document.createElement('li');
    listItem.classList.add('track-list-item');
    if (track.id) {
        listItem.dataset.trackId = track.id;
    }

    const cover = document.createElement('img');
    cover.classList.add('track-list-cover');
    cover.src = track.cover || FALLBACK_COVER;
    cover.alt = `${track.artist} – ${track.title}`;
    cover.loading = 'lazy';
    cover.decoding = 'async';

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('track-list-info');

    const title = document.createElement('span');
    title.classList.add('track-list-title');
    title.textContent = `${track.artist} - ${track.title}`;
    infoWrapper.appendChild(title);

    const subtitleText = buildSubtitle(subtitle);
    if (subtitleText) {
        const meta = document.createElement('span');
        meta.classList.add('track-list-meta');
        meta.textContent = subtitleText;
        infoWrapper.appendChild(meta);
    }

    listItem.appendChild(cover);
    listItem.appendChild(infoWrapper);

    if (interactive && typeof onActivate === 'function') {
        const activate = () => onActivate(track);
        listItem.setAttribute('role', 'button');
        listItem.tabIndex = 0;

        listItem.addEventListener('click', (event) => {
            event.preventDefault();
            activate();
        });

        listItem.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    }

    return listItem;
}
