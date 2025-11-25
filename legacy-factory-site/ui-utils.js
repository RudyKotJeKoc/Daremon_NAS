const FALLBACK_COVER = '/images/fallback-cover.svg';

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
    const coverTitle = typeof track.title === 'string' && track.title.trim() ? track.title.trim() : 'Nieznany utwór';
    const coverArtist = typeof track.artist === 'string' && track.artist.trim() ? track.artist.trim() : '';
    cover.alt = coverArtist ? `Okładka utworu ${coverTitle} – ${coverArtist}` : `Okładka utworu ${coverTitle}`;
    cover.loading = 'lazy';
    cover.decoding = 'async';

    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('track-list-info');

    const title = document.createElement('span');
    title.classList.add('track-list-title');
    title.textContent = coverTitle;
    infoWrapper.appendChild(title);

    const subtitleText = buildSubtitle(subtitle);
    const subtitleParts = [];

    if (coverArtist) {
        subtitleParts.push(coverArtist);
    }

    if (subtitleText) {
        subtitleParts.push(subtitleText);
    }

    if (subtitleParts.length > 0) {
        const meta = document.createElement('span');
        meta.classList.add('track-list-meta');
        meta.textContent = subtitleParts.join(' • ');
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

export function updatePlayStateVisuals(target, isPlaying, icons = {}) {
    if (!target || typeof target !== 'object') return;

    const button = target.button;
    const iconUse = target.iconUse;
    const playing = Boolean(isPlaying);
    const playIcon = icons.play || '#icon-play';
    const pauseIcon = icons.pause || '#icon-pause';
    const iconId = playing ? pauseIcon : playIcon;

    if (button && button.classList && typeof button.classList.toggle === 'function') {
        button.classList.toggle('is-playing', playing);
    }

    if (iconUse && typeof iconUse.setAttribute === 'function') {
        iconUse.setAttribute('href', iconId);
        if (typeof iconUse.setAttributeNS === 'function') {
            iconUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', iconId);
        } else {
            iconUse.setAttribute('xlink:href', iconId);
        }
    }
}
