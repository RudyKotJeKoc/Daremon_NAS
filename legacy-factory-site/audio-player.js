/**
 * Audio Player Component
 * Uniwersalny komponent do odtwarzania audio/video w różnych sekcjach strony
 */

class SectionAudioPlayer {
    constructor(containerId, audioConfig) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} nie został znaleziony`);
            return;
        }

        this.audioConfig = audioConfig;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();

        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.loadTrack(0);
    }

    render() {
        const tracksHTML = this.audioConfig.tracks.map((track, index) => `
            <div class="audio-track-item ${index === 0 ? 'active' : ''}" data-track-index="${index}">
                <span class="track-number">${index + 1}</span>
                <span class="track-name">${track.title}</span>
                <span class="track-duration">${track.duration || '--:--'}</span>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="section-audio-player">
                <div class="audio-player-header">
                    <h4 class="audio-section-title">${this.audioConfig.sectionTitle}</h4>
                    <p class="audio-section-description">${this.audioConfig.description || ''}</p>
                </div>

                <div class="audio-player-main">
                    <div class="audio-cover">
                        <img src="${this.audioConfig.coverImage || '/images/audio-placeholder.svg'}"
                             alt="${this.audioConfig.sectionTitle}"
                             class="audio-cover-img"
                             loading="lazy">
                    </div>

                    <div class="audio-info">
                        <div class="current-track-info">
                            <h5 class="current-track-title">Wybierz utwór</h5>
                            <p class="current-track-subtitle">${this.audioConfig.sectionTitle}</p>
                        </div>

                        <div class="audio-controls">
                            <button class="audio-btn audio-prev" aria-label="Poprzedni">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                                </svg>
                            </button>
                            <button class="audio-btn audio-play-pause" aria-label="Odtwórz/Pauza">
                                <svg class="play-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="pause-icon hidden" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                                </svg>
                            </button>
                            <button class="audio-btn audio-next" aria-label="Następny">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 18h2V6h-2zm-11-6l8.5-6v12z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="audio-progress-container">
                            <div class="audio-progress-bar">
                                <div class="audio-progress-fill"></div>
                                <div class="audio-progress-handle"></div>
                            </div>
                            <div class="audio-time">
                                <span class="audio-current-time">0:00</span>
                                <span class="audio-total-time">0:00</span>
                            </div>
                        </div>

                        <div class="audio-volume-container">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                            <input type="range" class="audio-volume-slider" min="0" max="100" value="70" aria-label="Głośność">
                        </div>
                    </div>
                </div>

                <div class="audio-playlist">
                    <h5 class="playlist-title">Lista utworów</h5>
                    <div class="audio-tracks-list">
                        ${tracksHTML}
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Play/Pause button
        const playPauseBtn = this.container.querySelector('.audio-play-pause');
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Previous/Next buttons
        this.container.querySelector('.audio-prev').addEventListener('click', () => this.previousTrack());
        this.container.querySelector('.audio-next').addEventListener('click', () => this.nextTrack());

        // Track items
        this.container.querySelectorAll('.audio-track-item').forEach(item => {
            item.addEventListener('click', () => {
                const trackIndex = parseInt(item.dataset.trackIndex);
                this.loadTrack(trackIndex);
                this.play();
            });
        });

        // Progress bar
        const progressBar = this.container.querySelector('.audio-progress-bar');
        progressBar.addEventListener('click', (e) => this.seek(e));

        // Volume control
        const volumeSlider = this.container.querySelector('.audio-volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }

    loadTrack(index) {
        if (index < 0 || index >= this.audioConfig.tracks.length) return;

        this.currentTrackIndex = index;
        const track = this.audioConfig.tracks[index];

        this.audio.src = track.src;

        // Update UI
        const titleElement = this.container.querySelector('.current-track-title');
        titleElement.textContent = track.title;

        // Update active track in playlist
        this.container.querySelectorAll('.audio-track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Update cover if track has specific cover
        if (track.coverImage) {
            const coverImg = this.container.querySelector('.audio-cover-img');
            coverImg.src = track.coverImage;
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
        this.container.querySelector('.play-icon').classList.add('hidden');
        this.container.querySelector('.pause-icon').classList.remove('hidden');
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.container.querySelector('.play-icon').classList.remove('hidden');
        this.container.querySelector('.pause-icon').classList.add('hidden');
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.audioConfig.tracks.length;
        this.loadTrack(nextIndex);
        this.play();
    }

    previousTrack() {
        const prevIndex = this.currentTrackIndex === 0
            ? this.audioConfig.tracks.length - 1
            : this.currentTrackIndex - 1;
        this.loadTrack(prevIndex);
        this.play();
    }

    seek(e) {
        const progressBar = this.container.querySelector('.audio-progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }

    updateProgress() {
        if (!this.audio.duration) return;

        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = this.container.querySelector('.audio-progress-fill');
        const progressHandle = this.container.querySelector('.audio-progress-handle');

        progressFill.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;

        // Update time display
        const currentTime = this.container.querySelector('.audio-current-time');
        currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        const totalTime = this.container.querySelector('.audio-total-time');
        totalTime.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Export dla użycia jako moduł
export default SectionAudioPlayer;

// Globalna funkcja dla łatwego dostępu
window.SectionAudioPlayer = SectionAudioPlayer;
