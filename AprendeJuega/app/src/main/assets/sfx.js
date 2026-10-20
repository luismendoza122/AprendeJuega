// Sonidos divertidos hechos con sintetizador (sin archivos de audio)
let actx = null;
function AC() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
const SFX = (() => {
  let muted = false;
  try { muted = localStorage.getItem('aj_mute') === '1'; } catch (e) {}

  function tone(f, t, dur, type = 'sine', vol = .25, slideTo = null) {
    const c = AC(), o = c.createOscillator(), g = c.createGain(), s = c.currentTime + t;
    o.type = type; o.frequency.setValueAtTime(f, s);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, s + dur);
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(vol, s + .01); g.gain.exponentialRampToValueAtTime(.001, s + dur);
    o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + dur + .05);
  }
  function noise(t, dur, vol = .2, freq = 1200, q = .8) {
    const c = AC(), b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), s = c.currentTime + t;
    src.buffer = b; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, s); g.gain.exponentialRampToValueAtTime(.001, s + dur);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(s);
  }
  const S = {
    click: () => tone(900, 0, .05, 'triangle', .08),
    ok: () => { tone(660, 0, .12, 'triangle', .22); tone(880, .1, .12, 'triangle', .22); tone(1320, .2, .25, 'triangle', .2); },
    bad: () => { tone(260, 0, .35, 'sawtooth', .12, 120); tone(200, .15, .3, 'square', .06, 90); },
    boing: () => tone(180, 0, .45, 'sine', .3, 600),
    win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * .12, i === 5 ? .6 : .15, 'square', .1)),
    star: () => [1568, 2093, 2637].forEach((f, i) => tone(f, i * .07, .2, 'sine', .15)),
    pop: () => { tone(500, 0, .08, 'sine', .3, 1400); noise(0, .05, .15, 3000); },
    slide: () => noise(0, .09, .12, 700, 2),
    flip: () => tone(600, 0, .07, 'triangle', .12, 900),
    munch: () => [0, .12, .24].forEach(t => noise(t, .08, .25, 400, 1.5)),
    splash: () => { noise(0, .5, .25, 2500, .5); tone(1200, .05, .1, 'sine', .1, 2400); tone(900, .2, .1, 'sine', .1, 1800); },
    snore: () => { tone(110, 0, .7, 'sawtooth', .07, 90); tone(140, .9, .6, 'sine', .08, 300); },
    happy: () => [700, 900, 1100, 900, 1300].forEach((f, i) => tone(f, i * .07, .1, 'sine', .15)),
    levelup: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .09, .2, 'triangle', .14)),
    tick: () => tone(1500, 0, .03, 'square', .05),
    note: (f, d = .4) => tone(f, 0, d, 'triangle', .3)
  };
  const api = {};
  Object.keys(S).forEach(k => api[k] = (...a) => { if (muted) return; try { S[k](...a); } catch (e) {} });
  api.isMuted = () => muted;
  api.toggle = () => { muted = !muted; try { localStorage.setItem('aj_mute', muted ? '1' : '0'); } catch (e) {} return muted; };
  return api;
})();
