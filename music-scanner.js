import { filterUnavailableTracks } from './media-availability.js';
import { CONFIG } from './config.js';
import { encodeMediaPath } from './media-utils.js';

/**
 * Music Scanner - Automatyczne tworzenie playlisty z folderu music
 * Skanuje folder music i tworzy dynamiczną playlistę
 */

export class MusicScanner {
    constructor(options = {}) {
        this.musicFolder = './music';
        this.supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a'];
        this.trackSource = options.trackSource ?? CONFIG.MUSIC_TRACKS_ENDPOINT ?? null;
        this.fetchImpl = options.fetchImpl ?? (typeof fetch === 'function' ? fetch : null);
        this.logger = options.logger ?? console;
        this.availabilityStrategy = options.availabilityStrategy ?? CONFIG.MEDIA_AVAILABILITY_STRATEGY ?? 'lazy';
        this.availabilityChunkSize = options.availabilityChunkSize ?? CONFIG.MEDIA_AVAILABILITY_CHUNK_SIZE ?? 50;
    }

    /**
     * Skanuje folder music i generuje playlistę
     * @returns {Promise<Array>} Lista utworów
     */
    async scanMusicFolder() {
        try {
            const tracks = await this.fetchTracksFromSource();

            if (tracks.length > 0) {
                this.logger.log(`🎵 Znaleziono ${tracks.length} utworów w źródle muzyki`);
                return tracks;
            }

            this.logger.warn('⚠️ Nie znaleziono utworów w źródle muzyki, używam playlist.json');
            return await this.loadFallbackPlaylist();

        } catch (error) {
            this.logger.error('❌ Błąd skanowania źródła muzyki:', error);
            return await this.loadFallbackPlaylist();
        }
    }

    async fetchTracksFromSource() {
        if (!this.trackSource || !this.fetchImpl) {
            return [];
        }

        try {
            const response = await this.fetchImpl(this.trackSource, { method: 'GET' });
            if (!response || !response.ok) {
                throw new Error(`HTTP ${response ? response.status : 'brak odpowiedzi'}`);
            }

            const payload = await response.json();
            const rawTracks = Array.isArray(payload) ? payload : Array.isArray(payload?.tracks) ? payload.tracks : [];

            if (!Array.isArray(rawTracks) || rawTracks.length === 0) {
                return [];
            }

            const normalizedTracks = [];
            for (let index = 0; index < rawTracks.length; index++) {
                const normalized = await this.normalizeTrack(rawTracks[index], index);
                if (normalized) {
                    normalizedTracks.push(normalized);
                }
            }

            if (normalizedTracks.length === 0) {
                return [];
            }

            const availability = await filterUnavailableTracks(normalizedTracks, {
                fetchImpl: this.fetchImpl,
                logger: this.logger,
                strategy: this.availabilityStrategy,
                chunkSize: this.availabilityChunkSize,
            });

            return availability.playableTracks || [];

        } catch (error) {
            this.logger.error('❌ Błąd pobierania listy utworów:', error);
            return [];
        }
    }

    async normalizeTrack(track, index = 0) {
        if (!track || typeof track !== 'object') {
            return null;
        }

        const rawSrc = typeof track.src === 'string' ? track.src.trim() : '';
        if (!rawSrc) {
            return null;
        }

        const src = encodeMediaPath(rawSrc);

        const fallbackTitle = await this.extractTitle(src);
        const id = track.id ?? `remote-track-${index + 1}`;
        const title = track.title ?? fallbackTitle ?? `Utwór ${index + 1}`;
        const artist = track.artist ?? (typeof track.performer === 'string' ? track.performer : await this.extractArtist(src));
        const weight = typeof track.weight === 'number' && Number.isFinite(track.weight) ? track.weight : 1;
        const tags = Array.isArray(track.tags)
            ? track.tags
            : typeof track.tags === 'string'
                ? [track.tags]
                : [];
        const type = track.type || 'song';
        const golden = typeof track.golden === 'boolean' ? track.golden : Boolean(track.gold);
        const cover = track.cover || track.artwork || track.thumbnail || `https://placehold.co/120x120/222/fff?text=${index + 1}`;

        return {
            ...track,
            id,
            title,
            artist: artist || 'Nieznany wykonawca',
            src,
            cover,
            tags,
            weight,
            type,
            golden,
        };
    }

    /**
     * Próbuje wyekstraktować tytuł z metadanych lub nazwy pliku
     */
    async extractTitle(src) {
        // W przyszłości można dodać Web Audio API do odczytu metadanych
        const lastSegment = src.split('/').pop() || '';
        let decoded = lastSegment;

        try {
            decoded = decodeURI(lastSegment);
        } catch (error) {
            // If decoding fails, use the original segment
        }

        const filename = decoded.replace('.mp3', '');
        return this.cleanupTitle(filename);
    }

    /**
     * Próbuje wyekstraktować artystę z metadanych
     */
    async extractArtist(src) {
        // Placeholder - można rozszerzyć o Web Audio API metadata
        return 'Nieznany wykonawca';
    }

    /**
     * Czyści nazwę pliku żeby była ładnym tytułem
     */
    cleanupTitle(filename) {
        return filename
            .replace(/^Utwór\s*\(\d+\)/, 'Utwór')
            .replace(/[-_]/g, ' ')
            .trim();
    }

    /**
     * Fallback do playlist.json
     */
    async loadFallbackPlaylist() {
        const fetcher = this.fetchImpl ?? (typeof fetch === 'function' ? fetch : null);

        if (!fetcher) {
            this.logger.error('❌ Brak implementacji fetch do pobrania playlisty awaryjnej');
            return this.getEmergencyPlaylist();
        }

        try {
            const response = await fetcher('./playlist.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return (data.tracks || []).map(track => ({
                ...track,
                src: typeof track?.src === 'string' ? encodeMediaPath(track.src) : track?.src
            }));
        } catch (error) {
            this.logger.error('❌ Nie można załadować playlist.json:', error);
            return this.getEmergencyPlaylist();
        }
    }

    /**
     * Minimalna playlista awarjna
     */
    getEmergencyPlaylist() {
        return [
            {
                id: 'emergency-1',
                title: 'Utwór 1',
                artist: 'DAREMON Radio',
                src: encodeMediaPath('./music/Utwor (1).mp3'),
                cover: 'https://placehold.co/120x120/333/fff?text=1',
                tags: ['emergency'],
                weight: 1,
                type: 'song',
                golden: false
            }
        ];
    }

    /**
     * Generuje playlistę z ocenami użytkowników
     * Utwory z wyższymi ocenami mają większą wagę
     */
    applyRatingWeights(tracks, reviews) {
        return tracks.map(track => {
            const trackReviews = reviews[track.id];
            if (!trackReviews || trackReviews.length === 0) {
                return { ...track, weight: track.weight || 1 };
            }

            // Oblicz średnią ocenę
            const avgRating = trackReviews.reduce((sum, r) => sum + r.rating, 0) / trackReviews.length;
            
            // Przekształć ocenę na wagę (1-5 gwiazdek → 1-10 waga)
            const ratingWeight = Math.max(1, Math.floor(avgRating * 2));
            
            // Dodatkowy boost dla utworów z dużą liczbą ocen
            const popularityBoost = Math.min(3, Math.floor(trackReviews.length / 5));
            
            const finalWeight = (track.weight || 1) + ratingWeight + popularityBoost;
            
            return {
                ...track,
                weight: finalWeight,
                avgRating: avgRating,
                reviewCount: trackReviews.length
            };
        });
    }
}

// Export dla modułów ES
export default MusicScanner;

// Backup dla globalnego scope
if (typeof window !== 'undefined') {
    window.MusicScanner = MusicScanner;
}