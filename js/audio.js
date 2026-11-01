/**
 * PlaySQL Soothing Audio Synthesizer
 * Relaxed, elegant, soft acoustic/digital sound design:
 * - Gentle melodic chimes
 * - Soft tactile button feedback
 * - Non-stressful subtle timer ticks
 * - Uplifting orchestral/ambient completion fanfare
 */
class PlaySQLAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('playsql_muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('playsql_volume') || '0.6');
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        localStorage.setItem('playsql_muted', muted);
    }

    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        localStorage.setItem('playsql_volume', this.volume);
    }

    playTone(frequency, type = 'sine', duration = 0.15, gainVal = 0.15, pitchDecay = 0) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, now);
            if (pitchDecay !== 0) {
                osc.frequency.exponentialRampToValueAtTime(
                    Math.max(20, frequency + pitchDecay),
                    now + duration
                );
            }

            const effectiveGain = gainVal * this.volume;
            gain.gain.setValueAtTime(effectiveGain, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    }

    playClick() {
        // Soft rounded click
        this.playTone(600, 'sine', 0.05, 0.1, -150);
    }

    playSelect() {
        // Warm marimba-like soft blip
        this.playTone(523.25, 'triangle', 0.08, 0.15, 80); // C5
    }

    playLaunch() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Gentle ascending major chord sweep (C - E - G - C)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);

            gain.gain.setValueAtTime(0.001, now + idx * 0.09);
            gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + idx * 0.09 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.5);
        });
    }

    playTick() {
        // Very subtle, gentle woodblock tick
        this.playTone(800, 'sine', 0.02, 0.03, -200);
    }

    playUrgentTick() {
        // Soft double tap
        this.playTone(650, 'sine', 0.03, 0.06, -100);
    }

    playCodeRun() {
        this.playTone(440, 'sine', 0.12, 0.12, 220);
    }

    playVictory() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Uplifting warm chime fanfare
        const notes = [
            { f: 392.00, d: 0.15 }, // G4
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.15 }, // E5
            { f: 783.99, d: 0.45 }  // G5
        ];
        let offset = 0;
        notes.forEach((n) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + offset);

            gain.gain.setValueAtTime(0.22 * this.volume, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + n.d);
            offset += n.d * 0.8;
        });
    }
}

window.cyberAudio = new PlaySQLAudioEngine();
