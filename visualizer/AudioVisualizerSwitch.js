/**
 * AudioVisualizerSwitch.js - Component for switching between 2D and 3D visualizers
 * 
 * Manages the toggle between canvas-based 2D visualizer and Three.js 3D visualizer.
 * Includes progressive enhancement with fallback to 2D when WebGL is not available.
 */

import { Visualizer3D } from './Visualizer3D.js';

export class AudioVisualizerSwitch {
    constructor(canvas2D, canvas3D, analyserNode, draw2DCallback) {
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
        this.analyser = analyserNode;
        this.draw2DCallback = draw2DCallback;
        
        this.visualizer3D = null;
        this.mode = '2d'; // '2d' or '3d'
        this.webGLAvailable = Visualizer3D.isWebGLAvailable();
        
        this.switchButton = null;
        
        this.init();
    }
    
    init() {
        // Create and inject the switch button
        this.createSwitchButton();
        
        // Load saved preference
        const savedMode = this.loadPreference();
        
        // If 3D was saved but WebGL is not available, fall back to 2D
        if (savedMode === '3d' && !this.webGLAvailable) {
            console.warn('WebGL not available, falling back to 2D visualizer');
            this.setMode('2d');
        } else if (savedMode && this.webGLAvailable) {
            this.setMode(savedMode);
        } else {
            // Default to 2D
            this.setMode('2d');
        }
    }
    
    createSwitchButton() {
        // Create button element
        this.switchButton = document.createElement('button');
        this.switchButton.id = 'visualizer-switch-btn';
        this.switchButton.className = 'control-btn visualizer-switch';
        this.switchButton.setAttribute('aria-label', 'Przełącz tryb wizualizatora');
        this.switchButton.title = 'Przełącz między 2D a 3D';
        
        // Add icon/text
        this.updateButtonText();
        
        // Add click handler
        this.switchButton.addEventListener('click', () => this.toggleMode());
        
        // Inject button into the player controls
        const playerControls = document.getElementById('player-controls');
        if (playerControls) {
            // Insert before the TV mode button or at the end
            const tvButton = document.getElementById('tv-mode-btn');
            if (tvButton) {
                playerControls.insertBefore(this.switchButton, tvButton);
            } else {
                playerControls.appendChild(this.switchButton);
            }
        }
        
        // If WebGL is not available, disable 3D option
        if (!this.webGLAvailable) {
            this.switchButton.disabled = true;
            this.switchButton.title = 'Wizualizacja 3D niedostępna (brak WebGL)';
        }
    }
    
    updateButtonText() {
        if (!this.switchButton) return;
        
        if (this.mode === '2d') {
            this.switchButton.textContent = '🎨 2D';
        } else {
            this.switchButton.textContent = '🌐 3D';
        }
    }
    
    toggleMode() {
        const newMode = this.mode === '2d' ? '3d' : '2d';
        this.setMode(newMode);
    }
    
    setMode(mode) {
        if (!this.webGLAvailable && mode === '3d') {
            console.warn('Cannot switch to 3D: WebGL not available');
            return;
        }
        
        this.mode = mode;
        this.updateButtonText();
        this.savePreference(mode);
        
        if (mode === '2d') {
            this.switch2D();
        } else {
            this.switch3D();
        }
    }
    
    switch2D() {
        // Show 2D canvas, hide 3D canvas
        if (this.canvas2D) {
            this.canvas2D.style.display = 'block';
        }
        if (this.canvas3D) {
            this.canvas3D.style.display = 'none';
        }
        
        // Stop and cleanup 3D visualizer
        if (this.visualizer3D) {
            this.visualizer3D.stop();
            this.visualizer3D.dispose();
            this.visualizer3D = null;
        }
        
        // Resume 2D visualizer if callback is provided
        if (this.draw2DCallback) {
            this.draw2DCallback();
        }
    }
    
    switch3D() {
        if (!this.webGLAvailable) {
            console.error('Cannot switch to 3D: WebGL not available');
            return;
        }
        
        // Hide 2D canvas, show 3D canvas
        if (this.canvas2D) {
            this.canvas2D.style.display = 'none';
        }
        if (this.canvas3D) {
            this.canvas3D.style.display = 'block';
        }
        
        // Initialize and start 3D visualizer
        if (!this.visualizer3D) {
            try {
                this.visualizer3D = new Visualizer3D(this.canvas3D, this.analyser);
                this.visualizer3D.start();
            } catch (error) {
                console.error('Failed to initialize 3D visualizer:', error);
                // Fall back to 2D on error
                this.setMode('2d');
            }
        } else {
            this.visualizer3D.start();
        }
    }
    
    /**
     * Update the analyser node (e.g., when audio context changes)
     */
    updateAnalyser(analyserNode) {
        this.analyser = analyserNode;
        
        if (this.visualizer3D) {
            this.visualizer3D.analyser = analyserNode;
            
            // Update buffer
            if (this.analyser) {
                this.visualizer3D.bufferLength = this.analyser.frequencyBinCount;
                this.visualizer3D.dataArray = new Uint8Array(this.visualizer3D.bufferLength);
            }
        }
    }
    
    /**
     * Start the current visualizer
     */
    start() {
        if (this.mode === '3d' && this.visualizer3D) {
            this.visualizer3D.start();
        } else if (this.mode === '2d' && this.draw2DCallback) {
            this.draw2DCallback();
        }
    }
    
    /**
     * Stop the current visualizer
     */
    stop() {
        if (this.visualizer3D) {
            this.visualizer3D.stop();
        }
    }
    
    /**
     * Save visualizer preference to localStorage
     */
    savePreference(mode) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
                window.localStorage.setItem(`${STORAGE_PREFIX}_visualizer_mode`, mode);
            }
        } catch (e) {
            console.warn('Failed to save visualizer preference:', e);
        }
    }
    
    /**
     * Load visualizer preference from localStorage
     */
    loadPreference() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const STORAGE_PREFIX = (window.CONFIG && window.CONFIG.STORAGE_PREFIX) || 'daremon';
                return window.localStorage.getItem(`${STORAGE_PREFIX}_visualizer_mode`) || '2d';
            }
        } catch (e) {
            console.warn('Failed to load visualizer preference:', e);
        }
        return '2d';
    }
    
    /**
     * Cleanup resources
     */
    dispose() {
        if (this.visualizer3D) {
            this.visualizer3D.dispose();
            this.visualizer3D = null;
        }
        
        if (this.switchButton && this.switchButton.parentNode) {
            this.switchButton.parentNode.removeChild(this.switchButton);
        }
    }
}
