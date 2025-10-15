/**
 * Visualizer3D.js - Three.js 3D Audio Visualizer
 * 
 * Implementacja wizualizacji audio 3D z wykorzystaniem Three.js.
 * Wizualizacja obejmuje:
 * - Centralną kulę reagującą na dźwięk
 * - Cząsteczki reprezentujące różne zakresy częstotliwości
 * - Interaktywną kontrolę kamery (OrbitControls)
 * - Automatyczną rotację kamery
 * - Efekty neonowe i bloom
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Visualizer3D {
    constructor(canvasElement, analyserNode) {
        this.canvas = canvasElement;
        this.analyser = analyserNode;
        this.isActive = false;
        this.animationId = null;
        
        // Scene components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // 3D Objects
        this.centerSphere = null;
        this.particles = [];
        this.particleSystem = null;
        
        // Audio data
        this.dataArray = null;
        this.bufferLength = 0;
        
        // Auto-rotation
        this.autoRotate = true;
        this.lastInteractionTime = Date.now();
        this.interactionTimeout = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Setup Three.js scene
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupObjects();
        
        // Setup audio data buffer
        if (this.analyser) {
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Track user interaction
        this.canvas.addEventListener('mousedown', () => this.onUserInteraction());
        this.canvas.addEventListener('touchstart', () => this.onUserInteraction());
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x04132B, 10, 50);
        this.scene.background = new THREE.Color(0x04132B);
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffa500, 1);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);
        
        // Point lights for dynamic effects
        const pointLight1 = new THREE.PointLight(0xff6600, 2, 50);
        pointLight1.position.set(10, 0, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x18A0C7, 2, 50);
        pointLight2.position.set(-10, 0, -10);
        this.scene.add(pointLight2);
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;
    }
    
    setupObjects() {
        // Central sphere
        const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0xffa500,
            emissive: 0xff6600,
            emissiveIntensity: 0.5,
            shininess: 100,
            specular: 0xffffff
        });
        this.centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.centerSphere);
        
        // Create particle system
        this.createParticleSystem();
    }
    
    createParticleSystem() {
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Initialize particles in a sphere around center
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position in sphere
            const radius = 5 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Color gradient based on frequency range
            const frequency = i / particleCount;
            if (frequency < 0.33) {
                // Bass - orange/red
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.4;
                colors[i3 + 2] = 0.0;
            } else if (frequency < 0.66) {
                // Mid - yellow/orange
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.7;
                colors[i3 + 2] = 0.0;
            } else {
                // Treble - cyan/blue
                colors[i3] = 0.1;
                colors[i3 + 1] = 0.6;
                colors[i3 + 2] = 0.8;
            }
            
            sizes[i] = 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    onUserInteraction() {
        this.lastInteractionTime = Date.now();
        this.autoRotate = false;
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    start() {
        this.isActive = true;
        this.animate();
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Get audio data
        if (this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            this.updateVisualization();
        }
        
        // Update controls
        if (this.controls) {
            this.controls.update();
            
            // Auto-rotate after inactivity
            const timeSinceInteraction = Date.now() - this.lastInteractionTime;
            if (timeSinceInteraction > this.interactionTimeout) {
                this.autoRotate = true;
            }
            
            if (this.autoRotate && this.controls.autoRotate !== true) {
                this.controls.autoRotate = true;
            } else if (!this.autoRotate && this.controls.autoRotate !== false) {
                this.controls.autoRotate = false;
            }
        }
        
        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updateVisualization() {
        if (!this.dataArray || !this.centerSphere || !this.particleSystem) return;
        
        // Calculate average amplitude for different frequency ranges
        const third = Math.floor(this.bufferLength / 3);
        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;
        
        for (let i = 0; i < this.bufferLength; i++) {
            if (i < third) {
                bassSum += this.dataArray[i];
            } else if (i < third * 2) {
                midSum += this.dataArray[i];
            } else {
                trebleSum += this.dataArray[i];
            }
        }
        
        const bassAvg = bassSum / third / 255;
        const midAvg = midSum / third / 255;
        const trebleAvg = trebleSum / third / 255;
        
        // Animate center sphere
        const scale = 1 + (bassAvg * 0.5);
        this.centerSphere.scale.set(scale, scale, scale);
        
        // Update sphere emissive intensity based on overall volume
        const overallAvg = (bassAvg + midAvg + trebleAvg) / 3;
        this.centerSphere.material.emissiveIntensity = 0.5 + (overallAvg * 1.5);
        
        // Rotate sphere
        this.centerSphere.rotation.y += 0.01;
        this.centerSphere.rotation.x += 0.005;
        
        // Update particles
        const positions = this.particleSystem.geometry.attributes.position.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const frequency = i / particleCount;
            
            // Determine which frequency range this particle belongs to
            let amplitude;
            if (frequency < 0.33) {
                amplitude = bassAvg;
            } else if (frequency < 0.66) {
                amplitude = midAvg;
            } else {
                amplitude = trebleAvg;
            }
            
            // Update particle size based on amplitude
            sizes[i] = 0.1 + (amplitude * 0.5);
            
            // Subtle particle movement
            const time = Date.now() * 0.0001;
            const radius = Math.sqrt(
                positions[i3] * positions[i3] +
                positions[i3 + 1] * positions[i3 + 1] +
                positions[i3 + 2] * positions[i3 + 2]
            );
            const targetRadius = 5 + Math.random() * 10 + (amplitude * 5);
            
            // Move particles in/out based on audio
            const factor = targetRadius / radius;
            positions[i3] *= 1 + (factor - 1) * 0.01;
            positions[i3 + 1] *= 1 + (factor - 1) * 0.01;
            positions[i3 + 2] *= 1 + (factor - 1) * 0.01;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.size.needsUpdate = true;
        
        // Rotate particle system
        this.particleSystem.rotation.y += 0.001;
    }
    
    dispose() {
        this.stop();
        
        // Clean up Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
            this.scene.remove(this.particleSystem);
        }
        
        if (this.centerSphere) {
            this.centerSphere.geometry.dispose();
            this.centerSphere.material.dispose();
            this.scene.remove(this.centerSphere);
        }
        
        window.removeEventListener('resize', () => this.onWindowResize());
        this.canvas.removeEventListener('mousedown', () => this.onUserInteraction());
        this.canvas.removeEventListener('touchstart', () => this.onUserInteraction());
    }
    
    /**
     * Check if WebGL is available in the browser
     * @returns {boolean} true if WebGL is supported
     */
    static isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(
                window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            );
        } catch (e) {
            return false;
        }
    }
}
