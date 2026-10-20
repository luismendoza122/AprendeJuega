// ===== Juegos nuevos =====
const backJuegos = `<button class="sec" onclick="go('juegos')">← Otros juegos</button>`;

// --- Simón dice ---
function simon() {
  const PADS = [['#E5484D', 329.63], ['#2BB673', 261.63], ['#1E9BF0', 220.0], ['#FFB020', 164.81]];
  let seq = [], pos = 0, busy = true, best = store.get('simon_best', 0);
  view.innerHTML = `<div class="card" style="text-align:center"><h2>🔴 Simón dice</h2>
    <p class="muted">Mira y escucha la secuencia. Luego repítela tocando los colores.</p>
    <div class="row" style="justify-content:center"><span class="pill" id="sl">Nivel 0</span><span class="pill">Récord: ${best}</span></div>
    <div class="simon" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:320px;margin:16px auto">
      ${PADS.map((p, i) => `<button data-i="${i}" style="aspect-ratio:1;background:${p[0]};opacity:.55;border-radius:${['80px 16px 16px 16px', '16px 80px 16px 16px', '16px 16px 16px 80px', '16px 16px 80px 16px'][i]}"></button>`).join('')}</div>
    <p id="smsg" class="big" style="font-size:20px">Prepárate...</p><p>${backJuegos}</p></div>`;
  const pads = [...view.querySelectorAll('.simon button')];
  const flash = (i, d = 350) => { pads[i].style.opacity = 1; SFX.note(PADS[i][1], d / 1000); setTimeout(() => pads[i].style.opacity = .55, d); };
  const vivo = () => pads[0].isConnected;
  function next() {
    if (!vivo()) return;
    seq.push(rand(4)); pos = 0; busy = true; $('#sl').textContent = 'Nivel ' + seq.length; $('#smsg').textContent = '👀 Mira...';
    const speed = Math.max(250, 600 - seq.length * 25);
    seq.forEach((v, k) => setTimeout(() => vivo() && flash(v, speed * .7), 700 + k * speed));
    setTimeout(() => { if (!vivo()) return; busy = false; $('#smsg').textContent = '👆 ¡Tu turno!'; }, 700 + seq.length * speed);
  }
  pads.forEach(b => b.onpointerdown = () => {
    if (busy) return; const i = +b.dataset.i; flash(i, 220);
    if (i !== seq[pos]) {
      busy = true; setTimeout(SFX.bad, 200); const lvl = seq.length - 1;
      if (lvl > best) { best = lvl; store.set('simon_best', best); }
      $('#smsg').innerHTML = `😅 ¡Uy! Llegaste al nivel ${lvl}<br><button style="margin-top:8px" onclick="simon()">Jugar otra vez</button>`;
      if (lvl >= 4) stars(lvl >= 10 ? 4 : lvl >= 7 ? 2 : 1);
      return;
    }
    pos++;
    if (pos === seq.length) { busy = true; if (!vivo()) return; $('#smsg').textContent = '¡Bien! 🎉'; setTimeout(SFX.ok, 250); setTimeout(next, 1100); }
  });
  setTimeout(next, 600);
}

// --- Revienta globos ---
function globos() {
  const REGLAS = [
    {t: 'números PARES', gen: () => { const n = rand(30) + 1; return [n, n % 2 === 0]; }},
    {t: 'números IMPARES', gen: () => { const n = rand(30) + 1; return [n, n % 2 === 1]; }},
    {t: 'VOCALES', gen: () => { const v = 'AEIOU', c = 'BCDFGHJKLMNPRSTVZ'; const ok = Math.random() < .45; return [ok ? v[rand(5)] : c[rand(c.length)], ok]; }},
    {t: 'múltiplos de 5', gen: () => { const ok = Math.random() < .45; const n = ok ? (rand(10) + 1) * 5 : [1, 2, 3, 4, 6, 7, 8, 9][rand(8)] + 10 * rand(5); return [n, n % 5 === 0]; }},
    {t: 'ANIMALES', gen: () => { const a = ['🐶', '🐱', '🦁', '🐸', '🐵', '🐔', '🐟', '🐘'], o = ['🍎', '🚗', '⚽', '🏠', '✏️', '🎸', '☂️', '🍕']; const ok = Math.random() < .45; return [ok ? a[rand(8)] : o[rand(8)], ok]; }},
    {t: 'resultados iguales a 10', gen: () => { const ok = Math.random() < .45; let a = rand(9) + 1, b = ok ? 10 - a : rand(9) + 1; if (!ok && a + b === 10) b = b === 9 ? 8 : b + 1; return [a + '+' + b, a + b === 10]; }}
  ];
  const regla = REGLAS[rand(REGLAS.length)];
  let pts = 0, vidas = 3, time = 40, alive = true, list = [], last = 0, raf;
  view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="pill">⏱️ <b id="gt">40</b> s</span><span class="pill">🎯 <b id="gp">0</b></span><span class="pill" id="gv">❤️❤️❤️</span></div>
    <h2 style="text-align:center;margin:10px 0">Revienta solo los <span style="color:var(--p)">${regla.t}</span></h2>
    <div id="cielo" style="position:relative;height:440px;overflow:hidden;border-radius:16px;background:linear-gradient(#BEE3FF,#EAF6FF);touch-action:none"></div>
    <p>${backJuegos}</p></div>`;
  const cielo = $('#cielo'), W = cielo.clientWidth, H = 440;
  const COL = ['#E5484D', '#FFB020', '#2BB673', '#1E9BF0', '#8B5CF6', '#EC4899'];
  function spawn() {
    const [label, ok] = regla.gen(), el = document.createElement('div');
    const x = rand(W - 70);
    el.style.cssText = `position:absolute;left:${x}px;top:0;width:66px;height:80px;border-radius:50% 50% 46% 46%;background:${COL[rand(6)]};display:grid;place-items:center;color:#fff;font-weight:800;font-size:22px;box-shadow:inset -8px -10px 0 rgba(0,0,0,.12);user-select:none`;
    el.innerHTML = `<span>${label}</span><i style="position:absolute;bottom:-18px;left:32px;width:1px;height:18px;background:#999"></i>`;
    const b = {el, ok, y: H + 10, v: 55 + rand(40) + (40 - time) * 1.2};
    el.onpointerdown = () => {
      if (!alive || b.dead) return; b.dead = true; el.remove();
      if (ok) { pts++; SFX.pop(); } else { vidas--; SFX.bad(); $('#gv').textContent = '❤️'.repeat(Math.max(0, vidas)) + '🤍'.repeat(3 - Math.max(0, vidas)); if (vidas <= 0) end(); }
      $('#gp').textContent = pts;
    };
    cielo.appendChild(el); list.push(b);
  }
  let t0 = performance.now(), acc = 0;
  function loop(t) {
    if (!alive) return;
    if (!cielo.isConnected) { alive = false; return; }
    const dt = Math.min(.05, (t - (last || t)) / 1000); last = t; acc += dt;
    if (acc > .75) { acc = 0; spawn(); }
    list.forEach(b => { b.y -= b.v * dt; b.el.style.transform = `translateY(${b.y - H}px)`; b.el.style.top = H + 'px'; if (b.y < -100 && !b.dead) { b.dead = true; b.el.remove(); } });
    list = list.filter(b => !b.dead);
    const left = Math.max(0, 40 - Math.floor((t - t0) / 1000)); if (left !== time) { time = left; $('#gt').textContent = time; if (time <= 5 && time > 0) SFX.tick(); }
    if (time === 0) return end();
    raf = requestAnimationFrame(loop);
  }
  function end() {
    if (!alive) return; alive = false; cancelAnimationFrame(raf); SFX.win();
    const best = store.get('globos_best', 0); if (pts > best) store.set('globos_best', pts);
    if (pts >= 5) stars(pts >= 20 ? 4 : pts >= 12 ? 2 : 1);
    cielo.innerHTML = `<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center"><div><div class="big">🎈 ${pts} globos</div><p class="muted">Tu récord: ${Math.max(best, pts)}</p><button onclick="globos()">Jugar otra vez</button></div></div>`;
  }
  raf = requestAnimationFrame(loop);
  cleanup = () => { alive = false; cancelAnimationFrame(raf); };
}

// --- Tres en raya ---
function tresEnRaya() {
  const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let b = Array(9).fill(''), over = false;
  const sc = store.get('ttt', {yo: 0, cel: 0, emp: 0});
  const win = (p) => L.find(l => l.every(i => b[i] === p));
  view.innerHTML = `<div class="card" style="text-align:center"><h2>⭕ Tres en raya</h2><p class="muted">Tú eres 😀 y el celular es 🤖. Haz una línea de tres.</p>
    <div class="row" style="justify-content:center"><span class="pill">😀 ${sc.yo}</span><span class="pill">🤖 ${sc.cel}</span><span class="pill">🤝 ${sc.emp}</span></div>
    <div class="ttt" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:300px;margin:16px auto">${b.map((_, i) => `<button data-i="${i}" class="sec" style="aspect-ratio:1;font-size:44px;padding:0"></button>`).join('')}</div>
    <p id="tm" class="big" style="font-size:20px">Tu turno</p><div class="row" style="justify-content:center"><button onclick="tresEnRaya()">Nueva partida</button>${backJuegos}</div></div>`;
  const cells = [...view.querySelectorAll('.ttt button')];
  const draw = l => { cells.forEach((c, i) => { c.textContent = b[i] === 'X' ? '😀' : b[i] === 'O' ? '🤖' : ''; }); if (l) l.forEach(i => cells[i].style.background = '#E3F8EE'); };
  function finish(msg, k) { over = true; sc[k]++; store.set('ttt', sc); $('#tm').textContent = msg; }
  function ai() {
    const free = b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    for (const p of ['O', 'X']) for (const i of free) { b[i] = p; const w = win(p); b[i] = ''; if (w) return i; }
    if (Math.random() < .25) return free[rand(free.length)]; // a veces se equivoca, para que los niños puedan ganar
    if (!b[4]) return 4;
    const corners = [0, 2, 6, 8].filter(i => !b[i]); if (corners.length) return corners[rand(corners.length)];
    return free[rand(free.length)];
  }
  cells.forEach(c => c.onclick = () => {
    const i = +c.dataset.i; if (over || b[i]) return;
    b[i] = 'X'; SFX.flip(); let w = win('X'); draw(w);
    if (w) { SFX.win(); stars(2); return finish('🎉 ¡Ganaste!', 'yo'); }
    if (b.every(v => v)) { SFX.boing(); return finish('🤝 ¡Empate!', 'emp'); }
    over = true; $('#tm').textContent = '🤖 Pensando...';
    setTimeout(() => {
      if (!cells[0].isConnected) return;
      over = false; b[ai()] = 'O'; SFX.tick(); w = win('O'); draw(w);
      if (w) { SFX.bad(); return finish('🤖 Ganó el celular. ¡Revancha!', 'cel'); }
      if (b.every(v => v)) { SFX.boing(); return finish('🤝 ¡Empate!', 'emp'); }
      $('#tm').textContent = 'Tu turno';
    }, 550);
  });
}

// --- Adivina la palabra ---
function ahorcado() {
  const temas = Object.keys(SOPAS), tema = temas[rand(temas.length)], palabra = SOPAS[tema][rand(SOPAS[tema].length)];
  const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  let usadas = new Set(), fallos = 0, done = false;
  const MAX = 6;
  function render() {
    const vista = [...palabra].map(ch => usadas.has(ch) ? ch : '_').join(' ');
    const ganado = [...palabra].every(ch => usadas.has(ch)), perdido = fallos >= MAX;
    view.innerHTML = `<div class="card" style="text-align:center"><h2>🌸 Adivina la palabra</h2><span class="pill">Pista: ${tema}</span>
      <div style="font-size:30px;margin:10px 0;letter-spacing:2px;white-space:nowrap">${'🌸'.repeat(MAX - fallos)}${'🥀'.repeat(fallos)}</div>
      <div class="big" style="letter-spacing:6px;margin:10px 0">${vista}</div>
      <p class="muted">Cada letra equivocada hace caer un pétalo.</p>
      <div id="kb" style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">${[...ABC].map(l => `<button class="sm" data-l="${l}" ${usadas.has(l) || ganado || perdido ? 'disabled' : ''} style="padding:10px 0;${usadas.has(l) ? (palabra.includes(l) ? 'background:var(--ok)' : 'background:var(--bad)') : ''}">${l}</button>`).join('')}</div>
      <div id="fin" style="margin-top:12px"></div><p>${backJuegos}</p></div>`;
    if (ganado && !done) { done = true; SFX.win(); stars(2); }
    if (perdido && !done) { done = true; SFX.bad(); }
    if (ganado || perdido) $('#fin').innerHTML = `<h2>${ganado ? '🎉 ¡Adivinaste!' : '😅 Era: ' + palabra}</h2><button onclick="ahorcado()">Otra palabra</button>`;
    $('#kb').onclick = e => {
      const b = e.target.closest('[data-l]'); if (!b || b.disabled) return; const l = b.dataset.l;
      usadas.add(l); if (palabra.includes(l)) SFX.ok(); else { fallos++; SFX.boing(); } render();
    };
  }
  render();
}

// --- Letras revueltas ---
function revueltas() {
  let ronda = 0, ok = 0;
  const all = Object.entries(SOPAS).flatMap(([t, ws]) => ws.map(w => [t, w])).filter(([, w]) => w.length >= 3 && w.length <= 8);
  const qs = shuffle(all).slice(0, 8);
  function show() {
    if (ronda === qs.length) { SFX.win(); stars(ok >= 7 ? 3 : ok >= 4 ? 2 : 1); view.innerHTML = `<div class="card" style="text-align:center"><div class="big">🔀</div><h2>Ordenaste ${ok} de ${qs.length} palabras</h2><button onclick="revueltas()">Jugar otra vez</button> ${backJuegos}</div>`; return; }
    const [tema, w] = qs[ronda];
    let letras = shuffle([...w].map((ch, i) => ({ch, i})));
    if (letras.map(x => x.ch).join('') === w) letras = letras.reverse();
    let elegido = [];
    function render() {
      view.innerHTML = `<div class="card" style="text-align:center"><div class="row" style="justify-content:space-between"><span class="pill">${ronda + 1} de ${qs.length}</span><span class="pill">Pista: ${tema}</span></div>
        <div class="big" style="min-height:52px;margin:18px 0;letter-spacing:6px;color:var(--p)">${elegido.map(k => letras[k].ch).join('') || '...'}</div>
        <div class="row" style="justify-content:center" id="lt">${letras.map((l, k) => `<button data-k="${k}" ${elegido.includes(k) ? 'disabled' : ''} style="font-size:24px;width:52px;height:52px;padding:0">${l.ch}</button>`).join('')}</div>
        <div class="row" style="justify-content:center;margin-top:12px"><button class="sec sm" id="del">⌫ Borrar</button><button class="sec sm" id="skip">Saltar</button></div><div id="res"></div></div>`;
      $('#lt').onclick = e => {
        const b = e.target.closest('[data-k]'); if (!b) return; elegido.push(+b.dataset.k); SFX.tick();
        if (elegido.length === w.length) {
          const intento = elegido.map(k => letras[k].ch).join('');
          if (intento === w) { ok++; SFX.ok(); render(); $('#res').innerHTML = `<h2>✅ ¡${w}!</h2>`; setTimeout(() => { if ($('#lt')) { ronda++; show(); } }, 1100); return; }
          SFX.bad(); render(); $('#res').innerHTML = `<p>Casi... ¡intenta otra vez!</p>`; setTimeout(() => { if ($('#lt')) { elegido = []; render(); } }, 900); return;
        }
        render();
      };
      $('#del').onclick = () => { elegido.pop(); render(); };
      $('#skip').onclick = () => { SFX.boing(); $('#res').innerHTML = `<p>Era <b>${w}</b></p>`; setTimeout(() => { if ($('#lt')) { ronda++; show(); } }, 1100); };
    }
    render();
  }
  show();
}
