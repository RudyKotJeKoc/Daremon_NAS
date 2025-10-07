/**
 * Music Scanner - Automatyczne tworzenie playlisty z folderu music
 * Skanuje folder music i tworzy dynamiczną playlistę
 */

export class MusicScanner {
    constructor() {
        this.musicFolder = './music';
        this.supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a'];
    }

    /**
     * Skanuje folder music i generuje playlistę
     * @returns {Promise<Array>} Lista utworów
     */
    async scanMusicFolder() {
        try {
            // W przeglądarce nie możemy bezpośrednio skanować folderów
            // Musimy użyć alternatywnych metod
            
            // Metoda 1: Próba odczytu znanej struktury (numerowanych plików)
            const tracks = await this.scanNumberedTracks();
            
            if (tracks.length > 0) {
                console.log(`🎵 Znaleziono ${tracks.length} utworów w folderze music`);
                return tracks;
            }

            // Metoda 2: Fallback do playlist.json jeśli nie ma plików
            console.warn('⚠️ Nie znaleziono plików w folderze music, używam playlist.json');
            return await this.loadFallbackPlaylist();
            
        } catch (error) {
            console.error('❌ Błąd skanowania folderu music:', error);
            return await this.loadFallbackPlaylist();
        }
    }

    /**
     * Skanuje numerowane pliki muzyczne (Utwor (1).mp3, etc.)
     */
    async scanNumberedTracks() {
        const tracks = [];
        let trackNumber = 1;
        
        while (trackNumber <= 200) { // Maksymalnie 200 utworów
            try {
                const filename = `Utwor (${trackNumber}).mp3`;
                const src = `${this.musicFolder}/${filename}`;
                
                // Sprawdź czy plik istnieje
                const exists = await this.checkFileExists(src);
                if (!exists) {
                    trackNumber++;
                    continue;
                }
                
                const track = {
                    id: `utwor-${trackNumber}`,
                    title: await this.extractTitle(src) || `Utwór ${trackNumber}`,
                    artist: await this.extractArtist(src) || 'Nieznany wykonawca',
                    src: src,
                    cover: `https://placehold.co/120x120/222/fff?text=${trackNumber}`,
                    tags: ['auto-scanned'],
                    weight: 1,
                    type: 'song',
                    golden: false
                };
                
                tracks.push(track);
                trackNumber++;
                
            } catch (error) {
                trackNumber++;
                if (trackNumber > 10 && tracks.length === 0) {
                    // Jeśli nie znaleźliśmy nic w pierwszych 10, przerywamy
                    break;
                }
            }
        }
        
        return tracks;
    }

    /**
     * Sprawdza czy plik istnieje
     */
    async checkFileExists(src) {
        try {
            const response = await fetch(src, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Próbuje wyekstraktować tytuł z metadanych lub nazwy pliku
     */
    async extractTitle(src) {
        // W przyszłości można dodać Web Audio API do odczytu metadanych
        const filename = src.split('/').pop().replace('.mp3', '');
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
        try {
            const response = await fetch('./playlist.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.tracks || [];
        } catch (error) {
            console.error('❌ Nie można załadować playlist.json:', error);
            return this.getEmergencyPlaylist();
        }
    }

    /**
     * Minimalna playlista awarjna
     */
    getEmergencyPlaylist() {
        return [
            {
                id: 'demo-1',
                title: 'Demo Track 1',
                artist: 'System',
                src: './music/demo.mp3',
                cover: 'https://placehold.co/120x120/333/fff?text=DEMO',
                tags: ['demo'],
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