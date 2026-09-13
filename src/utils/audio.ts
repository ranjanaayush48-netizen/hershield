/**
 * Web Audio API synthesizer for emergency siren and realistic phone ringtones.
 * Safe, client-side, zero external assets required.
 */

let audioCtx: AudioContext | null = null;
let activeSirenOsc: OscillatorNode | null = null;
let activeSirenGain: GainNode | null = null;
let activeRingInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playEmergencySiren() {
  try {
    const ctx = getAudioContext();
    if (activeSirenOsc) {
      stopEmergencySiren();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    
    // Siren wobble
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(1.5, ctx.currentTime); // 1.5 Hz wobble
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(osc.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0.08, ctx.currentTime); // gentle, not ear-piercing

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    activeSirenOsc = osc;
    activeSirenGain = gain;

    // Mobile vibration if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 500]);
    }
  } catch (err) {
    console.warn('Audio playback not supported or user blocked', err);
  }
}

export function stopEmergencySiren() {
  try {
    if (activeSirenOsc) {
      activeSirenOsc.stop();
      activeSirenOsc.disconnect();
      activeSirenOsc = null;
    }
    if (activeSirenGain) {
      activeSirenGain.disconnect();
      activeSirenGain = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  } catch {
    // ignore
  }
}

export function startPhoneRing() {
  try {
    const ctx = getAudioContext();
    stopPhoneRing();

    const ringOnce = () => {
      try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Standard US/UK dual-tone phone ring (440Hz + 480Hz)
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.8);
        osc2.stop(ctx.currentTime + 1.8);

        if ('vibrate' in navigator) {
          navigator.vibrate([400, 200, 400]);
        }
      } catch {
        // ignore
      }
    };

    ringOnce();
    activeRingInterval = window.setInterval(ringOnce, 3200);
  } catch (err) {
    console.warn('Ring tone error', err);
  }
}

export function stopPhoneRing() {
  if (activeRingInterval !== null) {
    clearInterval(activeRingInterval);
    activeRingInterval = null;
  }
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }
}
