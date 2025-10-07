export function createInitialState() {
    return {
        // Radio State
        playlist: [],
        config: {},
        history: [],
        messages: [],
        songDedications: [],
        reviews: {},
        currentTrack: null,
        nextTrack: null,
        nextTrackReady: false,
        isPlaying: false,
        isInitialized: false,
        lastMessageTimestamp: 0,
        lastSongDedicationTimestamp: 0,
        songsSinceJingle: 0,
        likes: {},
        tempBoosts: {},
        failedTracks: [],
        nextGroupPreference: 'recent',
        recentRotation: [],
        recentTrackSet: new Set(),
        // App State
        language: 'nl',
        translations: {},
    };
}
