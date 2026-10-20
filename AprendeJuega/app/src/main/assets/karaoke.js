// ===== Karaoke =====
const NOTE_IDX = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
const freqOf = n => { const m = n.match(/^([A-G])(#?)(\d)$/); const midi = 12 * (+m[3] + 1) + NOTE_IDX[m[1]] + (m[2] ? 1 : 0); return 440 * Math.pow(2, (midi - 69) / 12); };
const ACORDES = {C: ['C3', 'E3', 'G3'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'], Am: ['A3', 'C4', 'E4']};

function prepararCancion(song) {
  const beat = 60 / song.bpm; let t = 0;
  const lineas = song.lineas.map((l, li) => {
    const sil = [];
    l.t.split(' ').forEach(w => { const parts = w.split('|'); parts.forEach((p, k) => sil.push({txt: p, fin: k === parts.length - 1})); });
    const notas = l.n.split(' '), durs = l.d.split(' ').map(Number);
    if (notas.length !== sil.length || durs.length !== sil.length) console.warn('Canción descuadrada', song.titulo, li, sil.length, notas.length, durs.length);
    const start = t; let tt = t;
    sil.forEach((s, i) => { s.t = tt; s.f = freqOf(notas[i]); s.dur = durs[i] * beat; tt += s.dur; });
    t = start + 8 * beat;
    return {sil, start, end: t, acordes: l.c.split(' ')};
  });
  return {beat, lineas, total: t};
}

// Programa toda la música (acompañamiento + melodía guía) en un contexto de audio
function programarMusica(ctx, dest, song, prep, t0, guia) {
  const {beat} = prep;
  const osc = (f, s, d, type, vol, filtro) => {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(vol, s + .015); g.gain.setValueAtTime(vol, s + Math.max(.02, d - .06)); g.gain.exponentialRampToValueAtTime(.001, s + d);
    if (filtro) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = filtro; o.connect(lp); lp.connect(g); } else o.connect(g);
    g.connect(dest); o.start(s); o.stop(s + d + .05);
  };
  const kick = s => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, s); o.frequency.exponentialRampToValueAtTime(45, s + .15); g.gain.setValueAtTime(.55, s); g.gain.exponentialRampToValueAtTime(.001, s + .2); o.connect(g); g.connect(dest); o.start(s); o.stop(s + .25); };
  const nb = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .06), ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const hat = (s, v) => { const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); src.buffer = nb; f.type = 'highpass'; f.frequency.value = 6000; g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.001, s + .05); src.connect(f); f.connect(g); g.connect(dest); src.start(s); };
  // Cuenta regresiva
  for (let i = 0; i < 4; i++) osc(i === 0 ? 1320 : 990, t0 + i * beat, .08, 'square', .12);
  const s0 = t0 + 4 * beat;
  prep.lineas.forEach(l => {
    l.acordes.forEach((ac, ci) => {
      const notas = ACORDES[ac] || ACORDES.C, base = s0 + l.start + ci * 4 * beat;
      for (let b = 0; b < 4; b++) {
        const s = base + b * beat;
        if (b % 2 === 0) { kick(s); osc(freqOf(notas[0]) / 2, s, beat * .9, 'triangle', .35); }
        else notas.forEach(n => osc(freqOf(n), s, beat * .45, 'square', .045, 1800));
        hat(s, .05); hat(s + beat / 2, .03);
      }
    });
    if (guia) l.sil.forEach(sl => { osc(sl.f, s0 + sl.t, sl.dur * .92, 'triangle', .2); osc(sl.f * 2, s0 + sl.t, sl.dur * .9, 'sine', .04); });
  });
  // Acorde final
  const fin = s0 + prep.total; kick(fin); ACORDES.C.forEach(n => osc(freqOf(n), fin, 2, 'triangle', .12)); osc(freqOf('C2'), fin, 2, 'triangle', .3);
  return fin + 2.2; // momento en que termina todo
}

R.karaoke = function () {
  view.innerHTML = `<div class="card"><h2>🎤 Karaoke</h2><p class="muted">Elige una canción. La letra se ilumina mientras suena la música. Usa audífonos para que tu grabación quede mejor.</p></div>
    <div class="grid">${CANCIONES.map((c, i) => `<button class="tile" onclick="karaoke(${i})"><span class="em" style="background:${c.color}33">${c.e}</span>${c.titulo}<small>${c.lineas.length} versos</small></button>`).join('')}</div>`;
};

function karaoke(idx) {
  const song = CANCIONES[idx], prep = prepararCancion(song);
  let master = null, raf = 0, sesion = 0, mr = null, stream = null, chunks = [], recStart = 0, songStart = 0, mezcla = null, fuente = null;
  view.innerHTML = `<div class="card" style="text-align:center;background:linear-gradient(160deg,${song.color}22,#fff)">
      <div style="font-size:48px">${song.e}</div><h2 style="margin:0">${song.titulo}</h2><p class="muted" style="margin:4px 0 0">Canción original · ${song.bpm} pulsos por minuto</p>
      <div id="kbox" style="min-height:150px;margin:16px 0;padding:16px;border-radius:16px;background:#1F1B3A;color:#fff;display:flex;flex-direction:column;justify-content:center;gap:10px">
        <div id="kl" style="font-size:26px;font-weight:800;line-height:1.35"></div><div id="kn" style="font-size:16px;opacity:.55"></div></div>
      <div class="bar" style="height:8px"><i id="kp" style="width:0;background:${song.color}"></i></div>
      <label class="row" style="justify-content:center;margin:12px 0;gap:6px"><input type="checkbox" id="guia" checked style="width:auto"> Voz guía (la melodía suena para ayudarte)</label>
      <div class="row" style="justify-content:center"><button id="kplay">▶️ Cantar</button><button id="krec" style="background:var(--bad)">🎤 Cantar y grabar</button><button class="sec" id="kstop" disabled>⏹️ Parar</button></div>
      <div id="kres" style="margin-top:12px"></div>
      <p><button class="sec sm" onclick="go('karaoke')">← Otras canciones</button></p></div>`;
  const kl = $('#kl'), kn = $('#kn');
  const pintarLinea = (li, si) => {
    const l = prep.lineas[li]; if (!l) { kl.innerHTML = ''; kn.innerHTML = ''; return; }
    kl.innerHTML = l.sil.map((s, i) => `<span style="color:${i < si ? song.color : i === si ? '#FFE600' : '#fff'};${i === si ? 'text-shadow:0 0 12px #FFE600' : ''}">${esc(s.txt)}</span>${s.fin ? ' ' : ''}`).join('');
    const n = prep.lineas[li + 1]; kn.textContent = n ? n.sil.map(s => s.txt + (s.fin ? ' ' : '')).join('') : '';
  };
  pintarLinea(0, -1);

  function parar(final) {
    sesion++; cancelAnimationFrame(raf);
    if (master) { try { master.disconnect(); } catch (e) {} master = null; }
    if (mr && mr.state === 'recording') mr.stop();
    $('#kplay').disabled = $('#krec').disabled = false; $('#kstop').disabled = true;
    if (!final) pintarLinea(0, -1);
  }
  async function empezar(grabar) {
    parar(); mezcla = null; $('#kres').innerHTML = '';
    const ctx = AC();
    if (grabar) {
      try { stream = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: false, autoGainControl: true}}); }
      catch (e) { $('#kres').innerHTML = '<p class="muted">No tengo permiso para usar el micrófono. Actívalo en los ajustes de la app.</p>'; return; }
      chunks = []; mr = new MediaRecorder(stream); mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = terminarGrabacion; mr.start(); recStart = ctx.currentTime;
    }
    const mi = ++sesion;
    master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination);
    const t0 = ctx.currentTime + .15; songStart = t0 + 4 * prep.beat;
    const fin = programarMusica(ctx, master, song, prep, t0, $('#guia').checked);
    $('#kplay').disabled = $('#krec').disabled = true; $('#kstop').disabled = false;
    kl.innerHTML = '¡Prepárate! 4... 3... 2... 1...';
    const loop = () => {
      if (mi !== sesion) return;
      if (!kl.isConnected) { parar(true); return; }
      const t = ctx.currentTime - songStart;
      $('#kp').style.width = Math.max(0, Math.min(100, t / prep.total * 100)) + '%';
      if (t >= 0) {
        let li = prep.lineas.findIndex(l => t < l.end); if (li < 0) li = prep.lineas.length - 1;
        const l = prep.lineas[li]; let si = -1; l.sil.forEach((s, i) => { if (t >= s.t) si = i; });
        pintarLinea(li, si);
      } else kl.textContent = '¡Prepárate! ' + Math.ceil(-t / prep.beat) + '...';
      if (ctx.currentTime > fin) {
        kl.innerHTML = '🎉 ¡Bravo! 👏👏👏'; kn.textContent = ''; SFX.win();
        if (!grabar) stars(1);
        parar(true); return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  async function terminarGrabacion() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    $('#kres').innerHTML = '<p class="muted">Mezclando tu voz con la música...</p>';
    try {
      const voz = await AC().decodeAudioData(await new Blob(chunks, {type: mr.mimeType || 'audio/webm'}).arrayBuffer());
      const sr = 44100, offset = Math.max(0, songStart - recStart - 4 * prep.beat);
      const dur = Math.max(voz.duration, offset + 4 * prep.beat + prep.total + 2.3);
      const off = new OfflineAudioContext(2, Math.ceil(dur * sr), sr);
      const mg = off.createGain(); mg.gain.value = .55; mg.connect(off.destination);
      programarMusica(off, mg, song, prep, offset, false);
      const vs = off.createBufferSource(), vg = off.createGain(); vs.buffer = voz; vg.gain.value = 1.4;
      const d = off.createDelay(1), dg = off.createGain(); d.delayTime.value = .12; dg.gain.value = .18; // un poquito de eco de estudio
      vs.connect(vg); vg.connect(off.destination); vg.connect(d); d.connect(dg); dg.connect(off.destination); vs.start(0);
      mezcla = await off.startRendering();
      stars(2);
      $('#kres').innerHTML = `<h3>🎧 ¡Tu canción está lista!</h3><div class="row" style="justify-content:center"><button class="sm" id="kesc">▶️ Escuchar mi canción</button><button class="sec sm" id="kguar">💾 Guardar</button></div>`;
      $('#kesc').onclick = () => { if (fuente) try { fuente.stop(); } catch (e) {} const c = AC(); fuente = c.createBufferSource(); fuente.buffer = mezcla; fuente.connect(c.destination); fuente.start(); };
      $('#kguar').onclick = () => saveBlob(wavFromBuffer(mezcla), 'karaoke_' + song.titulo.replace(/\s+/g, '_') + '_' + stamp() + '.wav');
    } catch (e) { $('#kres').innerHTML = '<p class="muted">No se pudo preparar la grabación. Intenta otra vez.</p>'; }
  }
  $('#kplay').onclick = () => empezar(false);
  $('#krec').onclick = () => empezar(true);
  $('#kstop').onclick = () => parar(false);
  cleanup = () => { parar(false); if (fuente) try { fuente.stop(); } catch (e) {} if (stream) stream.getTracks().forEach(t => t.stop()); };
}
