import { describe, it, expect, vi } from 'vitest';
import { Visualizer3D } from '../visualizer/Visualizer3D.js';
import { AudioVisualizerSwitch } from '../visualizer/AudioVisualizerSwitch.js';

describe('Visualizer3D', () => {
  it('should have static method to detect WebGL availability', () => {
    expect(typeof Visualizer3D.isWebGLAvailable).toBe('function');
    const available = Visualizer3D.isWebGLAvailable();
    // This may be false in test environment, but the method should exist
    expect(typeof available).toBe('boolean');
  });

  it('should be a constructible class', () => {
    expect(typeof Visualizer3D).toBe('function');
    expect(Visualizer3D.prototype.init).toBeDefined();
    expect(Visualizer3D.prototype.start).toBeDefined();
    expect(Visualizer3D.prototype.stop).toBeDefined();
    expect(Visualizer3D.prototype.animate).toBeDefined();
    expect(Visualizer3D.prototype.dispose).toBeDefined();
  });
});

describe('AudioVisualizerSwitch', () => {
  it('should have required methods', () => {
    // Check that the class has the expected methods
    expect(typeof AudioVisualizerSwitch).toBe('function');
    const proto = AudioVisualizerSwitch.prototype;
    expect(typeof proto.toggleMode).toBe('function');
    expect(typeof proto.start).toBe('function');
    expect(typeof proto.stop).toBe('function');
    expect(typeof proto.savePreference).toBe('function');
    expect(typeof proto.loadPreference).toBe('function');
    expect(typeof proto.switch2D).toBe('function');
    expect(typeof proto.switch3D).toBe('function');
  });

  it('should handle localStorage operations safely', () => {
    // Mock a minimal AudioVisualizerSwitch instance without calling init
    const switcher = Object.create(AudioVisualizerSwitch.prototype);
    
    // Mock localStorage
    const mockStorage = {
      getItem: vi.fn(() => '2d'),
      setItem: vi.fn()
    };
    
    // Temporarily replace global localStorage
    const originalWindow = global.window;
    global.window = { localStorage: mockStorage };
    
    // Test savePreference
    switcher.savePreference('2d');
    expect(mockStorage.setItem).toHaveBeenCalled();
    
    // Test loadPreference
    const loaded = switcher.loadPreference();
    expect(loaded).toBe('2d');
    
    // Restore
    global.window = originalWindow;
  });
});


