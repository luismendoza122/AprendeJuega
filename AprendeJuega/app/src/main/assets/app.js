// ===== Utilidades =====
const $ = s => document.querySelector(s);
const view = $('#view');
const rand = n => Math.floor(Math.random() * n);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const store = {
  get(k, d) { try { const v = localStorage.getItem('aj_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('aj_' + k, JSON.stringify(v)); } catch (e) {} }
};

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200);
}
function stars(n) {
  const s = store.get('stars', 0) + (n || 0); store.set('stars', s);
  $('#stars').textContent = '⭐ ' + s;
  if (n) { toast('+' + n + ' ⭐ ¡Muy bien!'); SFX.star(); }
}

const hasAndroid = () => typeof window.Android !== 'undefined';
function saveDataUrl(dataUrl, name) {
  const [meta, b64] = dataUrl.split(',');
  const mime = meta.slice(5).split(';')[0];
  if (hasAndroid() && Android.saveFile) { toast(Android.saveFile(b64, name, mime)); return; }
  const a = document.createElement('a'); a.href = dataUrl; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  toast('Archivo descargado: ' + name);
}
function saveBlob(blob, name) {
  const r = new FileReader(); r.onload = () => saveDataUrl(r.result, name); r.readAsDataURL(blob);
}
function speak(text) {
  if (hasAndroid() && Android.speak) { Android.speak(text); return; }
  if ('speechSynthesis' in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; u.rate = .95; speechSynthesis.speak(u); }
  else toast('Tu teléfono no tiene lectura en voz alta');
}
function stopSpeak() {
  if (hasAndroid() && Android.stopSpeak) Android.stopSpeak();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
function stamp() { const d = new Date(); return d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '_' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0') + String(d.getSeconds()).padStart(2,'0'); }

// ===== Navegación =====
const SECCIONES = [
  {id:'juegos', t:'Juegos educativos', e:'🎮', c:'#FFE3D8', d:'8 juegos para aprender'},
  {id:'puzzle', t:'Rompecabezas', e:'🧩', c:'#FFF1CC', d:'Ordena las fichas'},
  {id:'retos', t:'Retos mentales', e:'🧠', c:'#DDF5E8', d:'Pon a prueba tu lógica'},
  {id:'dibujo', t:'Taller de dibujo', e:'🎨', c:'#DCEFFF', d:'Pinceles, figuras y más'},
  {id:'ciudades', t:'Ciudades del mundo', e:'🌎', c:'#E9E1FF', d:'Busca y aprende'},
  {id:'historias', t:'Historias antiguas', e:'📜', c:'#FFDDEE', d:'Leyendas y mitos'},
  {id:'acertijos', t:'Acertijos', e:'❓', c:'#FFE3D8', d:'¿Adivinas qué es?'},
  {id:'sopa', t:'Sopa de letras', e:'🔤', c:'#FFF1CC', d:'Encuentra las palabras'},
  {id:'karaoke', t:'Karaoke', e:'🎤', c:'#FFDDEE', d:'Canta con la letra en pantalla'},
  {id:'audios', t:'Estudio de audio', e:'🎙️', c:'#DDF5E8', d:'Graba voces y crea música'},
  {id:'mascota', t:'Mi mascota', e:'🐾', c:'#DCEFFF', d:'Cuídala cada día'},
  {id:'biblio', t:'Bibliotecas gratis', e:'📚', c:'#E9E1FF', d:'Para estudiar y leer'}
];
let cleanup = null;
function go(id) {
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  stopSpeak();
  window.scrollTo(0, 0);
  const s = SECCIONES.find(x => x.id === id);
  $('#title').textContent = s ? s.t : 'Aprende y Juega';
  $('#back').style.display = s ? 'inline-block' : 'none';
  (R[id] || R.home)();
  if (history.state !== id) history.pushState(id, '');
}
window.addEventListener('popstate', e => { const id = e.state || 'home'; if (cleanup) { cleanup(); cleanup = null; } (R[id] || R.home)(); $('#back').style.display = id === 'home' ? 'none' : 'inline-block'; const s = SECCIONES.find(x => x.id === id); $('#title').textContent = s ? s.t : 'Aprende y Juega'; });
// Botón atrás de Android
window.onAndroidBack = function () { if ((history.state || 'home') === 'home') return false; go('home'); return true; };

const R = {};
R.home = function () {
  const pet = store.get('pet', null);
  view.innerHTML = `
    <div class="card" style="background:linear-gradient(135deg,#fff,#EEE9FF)">
      <div class="row" style="justify-content:space-between">
        <div><div class="big">¡Hola! 👋</div><div class="muted">¿Qué quieres aprender hoy?</div></div>
        ${pet ? `<button class="sec sm" onclick="go('mascota')">${pet.tipo} ${esc(pet.nombre)}</button>` : ''}
      </div>
    </div>
    <div class="grid">${SECCIONES.map(s => `
      <button class="tile" onclick="go('${s.id}')">
        <span class="em" style="background:${s.c}">${s.e}</span>${s.t}<small>${s.d}</small>
      </button>`).join('')}
    </div>`;
};

// ===== Juegos educativos =====
R.juegos = function () {
  view.innerHTML = `
    <div class="grid">
      <button class="tile" onclick="mate()"><span class="em" style="background:#FFE3D8">➕</span>Matemática rápida<small>Sumas, restas y tablas</small></button>
      <button class="tile" onclick="memoria()"><span class="em" style="background:#DDF5E8">🃏</span>Memoria<small>Encuentra las parejas</small></button>
      <button class="tile" onclick="paises()"><span class="em" style="background:#DCEFFF">🗺️</span>¿De qué país es?<small>Ciudades y países</small></button>
      <button class="tile" onclick="simon()"><span class="em" style="background:#E9E1FF">🔴</span>Simón dice<small>Repite colores y sonidos</small></button>
      <button class="tile" onclick="globos()"><span class="em" style="background:#FFDDEE">🎈</span>Revienta globos<small>Números pares, vocales...</small></button>
      <button class="tile" onclick="tresEnRaya()"><span class="em" style="background:#FFF1CC">⭕</span>Tres en raya<small>Contra el celular</small></button>
      <button class="tile" onclick="ahorcado()"><span class="em" style="background:#DDF5E8">🌸</span>Adivina la palabra<small>Letra por letra</small></button>
      <button class="tile" onclick="revueltas()"><span class="em" style="background:#FFE3D8">🔀</span>Letras revueltas<small>Ordena la palabra</small></button>
    </div>`;
};

function mate(nivel) {
  if (!nivel) {
    view.innerHTML = `<div class="card"><h2>➕ Matemática rápida</h2><p class="muted">Elige tu nivel. Son 10 preguntas.</p>
      <div class="opts"><button onclick="mate(1)">🟢 Fácil: sumas y restas</button><button onclick="mate(2)">🟡 Medio: tablas de multiplicar</button><button onclick="mate(3)">🔴 Difícil: de todo</button></div>
      <p><button class="sec" onclick="go('juegos')">← Otros juegos</button></p></div>`;
    return;
  }
  let n = 0, ok = 0;
  function gen() {
    let a, b, op, r;
    const t = nivel === 1 ? rand(2) : nivel === 2 ? 2 : rand(4);
    if (t === 0) { a = rand(nivel === 3 ? 90 : 20) + 1; b = rand(nivel === 3 ? 90 : 20) + 1; op = '+'; r = a + b; }
    else if (t === 1) { a = rand(nivel === 3 ? 90 : 20) + 5; b = rand(a); op = '−'; r = a - b; }
    else if (t === 2) { a = rand(9) + 2; b = rand(9) + 2; op = '×'; r = a * b; }
    else { b = rand(9) + 2; r = rand(9) + 2; a = b * r; op = '÷'; }
    const set = new Set([r]);
    while (set.size < 4) { const d = r + (rand(11) - 5); if (d >= 0 && d !== r) set.add(d); }
    return {q: `${a} ${op} ${b} = ?`, r, o: shuffle([...set])};
  }
  function show() {
    if (n === 10) {
      const s = ok >= 9 ? 3 : ok >= 6 ? 2 : ok >= 3 ? 1 : 0; SFX.win(); if (s) setTimeout(() => stars(s), 700);
      view.innerHTML = `<div class="card" style="text-align:center"><div class="big">${ok >= 8 ? '🏆' : ok >= 5 ? '😃' : '💪'}</div><h2>Acertaste ${ok} de 10</h2>
        <div class="row" style="justify-content:center"><button onclick="mate(${nivel})">Jugar otra vez</button><button class="sec" onclick="mate()">Cambiar nivel</button></div></div>`;
      return;
    }
    const g = gen();
    view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="pill">Pregunta ${n + 1} de 10</span><span class="pill">✅ ${ok}</span></div>
      <div class="big" style="text-align:center;margin:24px 0;font-size:40px">${g.q}</div>
      <div class="opts" style="grid-template-columns:1fr 1fr">${g.o.map(v => `<button style="text-align:center;font-size:24px" data-v="${v}">${v}</button>`).join('')}</div></div>`;
    view.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
      const good = +b.dataset.v === g.r;
      view.querySelectorAll('.opts button').forEach(x => { x.disabled = true; if (+x.dataset.v === g.r) x.classList.add('ok'); });
      if (!good) { b.classList.add('bad'); SFX.bad(); } else { ok++; SFX.ok(); }
      n++; setTimeout(show, good ? 600 : 1300);
    });
  }
  show();
}

function memoria() {
  const pool = ['🦁','🐘','🦒','🐢','🦋','🐙','🦉','🐬','🌵','🍉','🚀','⚽','🎸','🌈','🍓','🐝'];
  const icons = shuffle(pool).slice(0, 8);
  const cards = shuffle(icons.concat(icons));
  let open = [], done = 0, moves = 0, lock = false;
  view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">🃏 Memoria</h2><span class="pill" id="mv">Intentos: 0</span></div>
    <p class="muted">Toca dos cartas para encontrar parejas iguales.</p><div class="mem">${cards.map((c, i) => `<div data-i="${i}">${c}</div>`).join('')}</div>
    <p><button class="sec" onclick="go('juegos')">← Otros juegos</button></p></div>`;
  view.querySelectorAll('.mem div').forEach(d => d.onclick = () => {
    if (lock || d.classList.contains('up') || d.classList.contains('done')) return;
    d.classList.add('up'); open.push(d); SFX.flip();
    if (open.length === 2) {
      moves++; $('#mv').textContent = 'Intentos: ' + moves; lock = true;
      const [a, b] = open;
      if (a.textContent === b.textContent) {
        a.classList.add('done'); b.classList.add('done'); open = []; lock = false; done++; SFX.ok();
        if (done === 8) { SFX.win(); stars(moves <= 12 ? 3 : moves <= 18 ? 2 : 1); setTimeout(() => { view.querySelector('.card').insertAdjacentHTML('beforeend', `<div style="text-align:center"><h2>🎉 ¡Lo lograste en ${moves} intentos!</h2><button onclick="memoria()">Jugar otra vez</button></div>`); }, 300); }
      } else setTimeout(() => { SFX.boing(); a.classList.remove('up'); b.classList.remove('up'); open = []; lock = false; }, 800);
    }
  });
}

function paises() {
  let n = 0, ok = 0;
  const qs = shuffle(CIUDADES).slice(0, 10);
  const all = [...new Set(CIUDADES.map(c => c.pais))];
  function show() {
    if (n === 10) {
      const s = ok >= 9 ? 3 : ok >= 6 ? 2 : ok >= 3 ? 1 : 0; SFX.win(); if (s) setTimeout(() => stars(s), 700);
      view.innerHTML = `<div class="card" style="text-align:center"><div class="big">🌍</div><h2>Acertaste ${ok} de 10</h2><button onclick="paises()">Jugar otra vez</button> <button class="sec" onclick="R.juegos()">Otros juegos</button></div>`;
      return;
    }
    const c = qs[n];
    const o = shuffle([c.pais].concat(shuffle(all.filter(p => p !== c.pais)).slice(0, 3)));
    view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="pill">${n + 1} de 10</span><span class="pill">✅ ${ok}</span></div>
      <p class="muted" style="margin-bottom:4px">¿En qué país está la ciudad de...</p><div class="big">${esc(c.nombre)}?</div>
      <div class="opts">${o.map(p => `<button data-p="${esc(p)}">${esc(p)}</button>`).join('')}</div><p id="dato" class="muted"></p></div>`;
    view.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
      const good = b.dataset.p === c.pais; if (good) { ok++; SFX.ok(); } else { b.classList.add('bad'); SFX.bad(); }
      view.querySelectorAll('.opts button').forEach(x => { x.disabled = true; if (x.dataset.p === c.pais) x.classList.add('ok'); });
      $('#dato').innerHTML = `${c.bandera} <b>Dato:</b> ${esc(c.dato)}<br><br><button>Siguiente →</button>`;
      $('#dato button').onclick = () => { n++; show(); };
    });
  }
  show();
}

// ===== Rompecabezas =====
function puzzleImage(emoji, colors) {
  const c = document.createElement('canvas'); c.width = c.height = 600; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 600, 600); g.addColorStop(0, colors[0]); g.addColorStop(1, colors[1]);
  x.fillStyle = g; x.fillRect(0, 0, 600, 600);
  x.globalAlpha = .25; x.fillStyle = '#fff';
  for (let i = 0; i < 14; i++) { x.beginPath(); x.arc(rand(600), rand(600), 20 + rand(60), 0, 7); x.fill(); }
  x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '330px serif'; x.fillText(emoji, 300, 320);
  return c.toDataURL();
}
R.puzzle = function () {
  const pics = [['🦁',['#FFB020','#FF7A59']],['🐳',['#1E9BF0','#6C4BF4']],['🦜',['#2BB673','#1E9BF0']],['🚀',['#1F1B3A','#8B5CF6']],['🦄',['#EC4899','#8B5CF6']],['🌻',['#FFB020','#2BB673']]];
  view.innerHTML = `<div class="card"><h2>🧩 Rompecabezas</h2><p class="muted">Elige un dibujo y el tamaño. Toca una ficha junto al espacio vacío para moverla.</p>
    <div class="row" id="pics">${pics.map((p, i) => `<button class="sec" style="font-size:30px;padding:8px 12px" data-i="${i}">${p[0]}</button>`).join('')}</div>
    <p class="row"><button data-n="3">3 × 3 (fácil)</button><button data-n="4">4 × 4 (difícil)</button></p></div>`;
  let sel = 0;
  const btns = view.querySelectorAll('#pics button');
  btns[0].style.borderColor = 'var(--p)';
  btns.forEach(b => b.onclick = () => { sel = +b.dataset.i; btns.forEach(x => x.style.borderColor = ''); b.style.borderColor = 'var(--p)'; });
  view.querySelectorAll('[data-n]').forEach(b => b.onclick = () => startPuzzle(+b.dataset.n, puzzleImage(pics[sel][0], pics[sel][1])));
};
function startPuzzle(n, img) {
  const N = n * n; let t = [...Array(N).keys()]; let empty = N - 1, moves = 0;
  const nb = p => { const r = Math.floor(p / n), c = p % n, a = []; if (r > 0) a.push(p - n); if (r < n - 1) a.push(p + n); if (c > 0) a.push(p - 1); if (c < n - 1) a.push(p + 1); return a; };
  let prev = -1;
  for (let i = 0; i < 200 * n; i++) { const opts = nb(empty).filter(x => x !== prev); const m = opts[rand(opts.length)]; [t[empty], t[m]] = [t[m], t[empty]]; prev = empty; empty = m; }
  view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">🧩 ${n} × ${n}</h2><span class="pill" id="pm">Movimientos: 0</span></div>
    <div class="row" style="margin:10px 0;align-items:flex-start"><div class="puz" id="pz" style="grid-template-columns:repeat(${n},1fr);flex:1"></div>
    <div style="width:70px"><p class="muted" style="font-size:12px;margin:0 0 4px">Modelo</p><img src="${img}" style="width:70px;border-radius:8px"></div></div>
    <div class="row"><button class="sec" onclick="R.puzzle()">← Cambiar</button></div></div>`;
  const pz = $('#pz');
  function draw() {
    pz.innerHTML = t.map((v, p) => {
      if (v === N - 1 && p === empty) return `<div class="empty"></div>`;
      const r = Math.floor(v / n), c = v % n;
      return `<div data-p="${p}" style="background-image:url(${img});background-size:${n * 100}% ${n * 100}%;background-position:${c * 100 / (n - 1)}% ${r * 100 / (n - 1)}%"></div>`;
    }).join('');
  }
  pz.onclick = e => {
    const d = e.target.closest('[data-p]'); if (!d) return; const p = +d.dataset.p;
    if (!nb(empty).includes(p)) return;
    [t[empty], t[p]] = [t[p], t[empty]]; empty = p; moves++; SFX.slide(); $('#pm').textContent = 'Movimientos: ' + moves; draw();
    if (t.every((v, i) => v === i)) { SFX.win(); stars(n === 3 ? 2 : 4); pz.insertAdjacentHTML('afterend', ''); setTimeout(() => { pz.parentElement.insertAdjacentHTML('afterend', `<div style="text-align:center"><h2>🎉 ¡Completado en ${moves} movimientos!</h2></div>`); }, 200); }
  };
  draw();
}

// ===== Retos mentales =====
R.retos = function () {
  const qs = shuffle(RETOS); let n = 0, ok = 0;
  function show() {
    if (n === qs.length) { SFX.win(); stars(ok >= 13 ? 4 : ok >= 9 ? 2 : 1);
      view.innerHTML = `<div class="card" style="text-align:center"><div class="big">🧠</div><h2>Resolviste ${ok} de ${qs.length} retos</h2><button onclick="R.retos()">Empezar de nuevo</button></div>`; return; }
    const q = qs[n];
    view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="pill">Reto ${n + 1} de ${qs.length}</span><span class="pill">✅ ${ok}</span></div>
      <h2 style="margin-top:14px">${esc(q.p)}</h2><div class="opts">${q.o.map((o, i) => `<button data-i="${i}">${esc(o)}</button>`).join('')}</div><div id="ex"></div></div>`;
    view.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
      const good = +b.dataset.i === q.r; if (good) { ok++; SFX.ok(); } else { b.classList.add('bad'); SFX.bad(); }
      view.querySelectorAll('.opts button').forEach(x => { x.disabled = true; if (+x.dataset.i === q.r) x.classList.add('ok'); });
      $('#ex').innerHTML = `<p><b>${good ? '¡Correcto! 🎉' : 'Casi 😉'}</b> ${esc(q.e)}</p><button>Siguiente →</button>`;
      $('#ex button').onclick = () => { n++; show(); };
    });
  }
  show();
};

// ===== Taller de dibujo =====
R.dibujo = function () {
  const COLORS = ['#1F1B3A','#FFFFFF','#E5484D','#FF7A59','#FFB020','#FFE600','#2BB673','#0E7C66','#1E9BF0','#6C4BF4','#EC4899','#8B5A2B'];
  const TOOLS = [['pincel','🖌️ Pincel'],['marcador','🖍️ Marcador'],['spray','💨 Spray'],['borrador','🧽 Borrador'],['linea','📏 Línea'],['rect','⬛ Rectángulo'],['circulo','⚪ Círculo'],['relleno','🪣 Relleno']];
  view.innerHTML = `<div class="card" style="padding:12px">
    <div class="tools" id="tl">${TOOLS.map(t => `<button data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="row" id="cols" style="gap:6px">${COLORS.map(c => `<button class="sw" data-c="${c}" style="background:${c}"></button>`).join('')}<input type="color" id="cc" value="#6C4BF4" style="width:44px;height:34px;padding:0;border:0"></div>
    <div class="row" style="margin:8px 0"><span class="muted">Tamaño</span><input type="range" id="sz" min="1" max="60" value="8" style="flex:1;padding:0"><span id="szv" class="pill">8</span>
      <label class="row muted" style="gap:4px"><input type="checkbox" id="fillsh" style="width:auto"> Figuras rellenas</label></div>
    <canvas id="cv"></canvas>
    <div class="row" style="margin-top:10px"><button class="sec sm" id="undo">↩️ Deshacer</button><button class="sec sm" id="redo">↪️ Rehacer</button><button class="sec sm" id="clr">🗑️ Limpiar</button><button class="sm" id="save">💾 Guardar dibujo</button></div></div>`;
  const cv = $('#cv'), x = cv.getContext('2d', {willReadFrequently: true});
  const W = Math.min(cv.parentElement.clientWidth - 28, 900), H = Math.round(W * 1.2);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
  x.scale(dpr, dpr); x.lineCap = 'round'; x.lineJoin = 'round';
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  let tool = 'pincel', color = '#1F1B3A', size = 8, drawing = false, start = null, snap = null, last = null;
  const undo = [], redo = [];
  const push = () => { undo.push(x.getImageData(0, 0, cv.width, cv.height)); if (undo.length > 25) undo.shift(); redo.length = 0; };
  const setTool = t => { tool = t; view.querySelectorAll('#tl button').forEach(b => b.classList.toggle('on', b.dataset.t === t)); };
  const setColor = c => { color = c; view.querySelectorAll('.sw').forEach(b => b.classList.toggle('on', b.dataset.c === c)); };
  setTool('pincel'); setColor(color);
  $('#tl').onclick = e => { const b = e.target.closest('button'); if (b) setTool(b.dataset.t); };
  $('#cols').onclick = e => { const b = e.target.closest('.sw'); if (b) setColor(b.dataset.c); };
  $('#cc').oninput = e => setColor(e.target.value);
  $('#sz').oninput = e => { size = +e.target.value; $('#szv').textContent = size; };
  const pos = e => { const r = cv.getBoundingClientRect(); return {x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height}; };
  function stroke(a, b) {
    x.save();
    if (tool === 'borrador') { x.strokeStyle = '#fff'; x.lineWidth = size * 2; }
    else if (tool === 'marcador') { x.globalAlpha = .35; x.strokeStyle = color; x.lineWidth = size * 2.2; x.lineCap = 'square'; }
    else { x.strokeStyle = color; x.lineWidth = size; }
    x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); x.restore();
  }
  function spray(p) { x.fillStyle = color; for (let i = 0; i < size * 2; i++) { const a = Math.random() * 6.283, r = Math.random() * size * 1.6; x.fillRect(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 1.4, 1.4); } }
  function shape(a, b) {
    x.save(); x.strokeStyle = color; x.fillStyle = color; x.lineWidth = size; x.beginPath();
    if (tool === 'linea') { x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    else if (tool === 'rect') { x.rect(a.x, a.y, b.x - a.x, b.y - a.y); $('#fillsh').checked ? x.fill() : x.stroke(); }
    else { x.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, 6.2832); $('#fillsh').checked ? x.fill() : x.stroke(); }
    x.restore();
  }
  function fill(p) {
    const img = x.getImageData(0, 0, cv.width, cv.height), d = img.data, w = cv.width, h = cv.height;
    const sx = Math.floor(p.x * dpr), sy = Math.floor(p.y * dpr); if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    const i0 = (sy * w + sx) * 4, t = [d[i0], d[i0 + 1], d[i0 + 2]];
    const c = parseInt(color.slice(1), 16), nc = [c >> 16 & 255, c >> 8 & 255, c & 255];
    if (Math.abs(t[0] - nc[0]) + Math.abs(t[1] - nc[1]) + Math.abs(t[2] - nc[2]) < 10) return;
    const match = i => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) < 90;
    const seen = new Uint8Array(w * h), st = [sx, sy];
    while (st.length) {
      const yy = st.pop(), xx0 = st.pop(); let xx = xx0;
      while (xx >= 0 && !seen[yy * w + xx] && match((yy * w + xx) * 4)) xx--;
      xx++; let up = false, dn = false;
      while (xx < w && !seen[yy * w + xx] && match((yy * w + xx) * 4)) {
        const k = yy * w + xx, i = k * 4; seen[k] = 1; d[i] = nc[0]; d[i + 1] = nc[1]; d[i + 2] = nc[2]; d[i + 3] = 255;
        if (yy > 0) { const m = !seen[k - w] && match((k - w) * 4); if (m && !up) { st.push(xx, yy - 1); up = true; } else if (!m) up = false; }
        if (yy < h - 1) { const m = !seen[k + w] && match((k + w) * 4); if (m && !dn) { st.push(xx, yy + 1); dn = true; } else if (!m) dn = false; }
        xx++;
      }
    }
    x.putImageData(img, 0, 0);
  }
  cv.onpointerdown = e => {
    cv.setPointerCapture(e.pointerId); const p = pos(e); push();
    if (tool === 'relleno') { fill(p); return; }
    drawing = true; start = last = p;
    if (['linea','rect','circulo'].includes(tool)) snap = x.getImageData(0, 0, cv.width, cv.height);
    else if (tool === 'spray') spray(p); else stroke(p, {x: p.x + .1, y: p.y + .1});
  };
  cv.onpointermove = e => {
    if (!drawing) return; const p = pos(e);
    if (snap) { x.putImageData(snap, 0, 0); shape(start, p); }
    else if (tool === 'spray') spray(p); else stroke(last, p);
    last = p;
  };
  cv.onpointerup = cv.onpointercancel = () => { drawing = false; snap = null; };
  $('#undo').onclick = () => { if (!undo.length) return; redo.push(x.getImageData(0, 0, cv.width, cv.height)); x.putImageData(undo.pop(), 0, 0); };
  $('#redo').onclick = () => { if (!redo.length) return; undo.push(x.getImageData(0, 0, cv.width, cv.height)); x.putImageData(redo.pop(), 0, 0); };
  $('#clr').onclick = () => { if (!confirm('¿Borrar todo el dibujo?')) return; push(); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); };
  $('#save').onclick = () => { saveDataUrl(cv.toDataURL('image/png'), 'dibujo_' + stamp() + '.png'); stars(1); };
};

// ===== Ciudades =====
R.ciudades = function () {
  view.innerHTML = `<div class="card"><h2>🌎 Ciudades del mundo</h2>
    <input id="q" placeholder="Escribe una ciudad, país o continente..." autocomplete="off">
    <div class="row" style="margin-top:8px" id="conts"></div></div><div id="res"></div>`;
  const conts = ['Todas','América','Europa','Asia','África','Oceanía'];
  $('#conts').innerHTML = conts.map(c => `<button class="sec sm" data-c="${c}">${c}</button>`).join('');
  let cont = 'Todas';
  function render() {
    const q = norm($('#q').value.trim());
    const list = CIUDADES.filter(c => (cont === 'Todas' || c.continente.includes(cont)) && (!q || norm(c.nombre + ' ' + c.pais + ' ' + c.continente).includes(q)));
    $('#res').innerHTML = list.map((c, i) => `<div class="card"><div class="row" style="justify-content:space-between"><h3>${c.bandera} ${esc(c.nombre)}</h3><span class="pill">${esc(c.continente)}</span></div>
      <div class="muted">${esc(c.pais)} · ${esc(c.poblacion)} de habitantes aprox.</div><p>💡 ${esc(c.dato)}</p>
      <button class="sec sm" data-w="${esc(c.nombre)}">🔎 Saber más (internet)</button><div class="wk"></div></div>`).join('') +
      (q ? `<div class="card"><p>¿No está la que buscas?</p><button class="sm" data-w="${esc($('#q').value.trim())}">🔎 Buscar "${esc($('#q').value.trim())}" en Wikipedia</button><div class="wk"></div></div>` : '') ||
      `<div class="card muted">No hay resultados.</div>`;
  }
  $('#q').oninput = render;
  $('#conts').onclick = e => { const b = e.target.closest('button'); if (!b) return; cont = b.dataset.c; view.querySelectorAll('#conts button').forEach(x => x.style.borderColor = x === b ? 'var(--p)' : ''); render(); };
  $('#res').onclick = async e => {
    const b = e.target.closest('[data-w]'); if (!b) return;
    const box = b.nextElementSibling; box.innerHTML = '<p class="muted">Buscando...</p>';
    try {
      const r = await fetch('https://es.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(b.dataset.w.replace(/ /g, '_')));
      if (!r.ok) throw new Error('nf');
      const j = await r.json();
      box.innerHTML = `${j.thumbnail ? `<img src="${j.thumbnail.source}" style="width:100%;max-height:220px;object-fit:cover;border-radius:12px;margin-top:10px">` : ''}
        <p>${esc(j.extract || 'Sin resumen.')}</p><p class="muted" style="font-size:12px">Fuente: Wikipedia</p>`;
      stars(1);
    } catch (err) { box.innerHTML = `<p class="muted">${err.message === 'nf' ? 'No encontré esa página. Revisa cómo está escrita.' : 'Necesitas conexión a internet para esta búsqueda.'}</p>`; }
  };
  render();
};

// ===== Historias =====
R.historias = function () {
  view.innerHTML = `<h2>📜 Historias antiguas</h2><div class="grid">${HISTORIAS.map((h, i) => `<button class="tile" onclick="historia(${i})"><span class="em" style="background:#FFDDEE">${h.e}</span>${esc(h.t)}<small>${esc(h.lugar)}</small></button>`).join('')}</div>`;
};
function historia(i) {
  const h = HISTORIAS[i];
  view.innerHTML = `<div class="card story"><div style="font-size:60px;text-align:center">${h.e}</div><h2>${esc(h.t)}</h2><span class="pill">${esc(h.lugar)}</span>
    <div class="row" style="margin:12px 0"><button class="sm" id="lee">🔊 Escuchar</button><button class="sec sm" id="para">⏹️ Parar</button></div>
    ${h.txt.map(p => `<p>${esc(p)}</p>`).join('')}
    <div class="card" style="background:#FFF7E0;box-shadow:none"><b>💡 ¿Sabías que...?</b><br>${esc(h.sabias)}</div>
    <div class="row">${i > 0 ? `<button class="sec" onclick="historia(${i - 1})">← Anterior</button>` : ''}<button class="sec" onclick="R.historias()">Todas</button>${i < HISTORIAS.length - 1 ? `<button onclick="historia(${i + 1})">Siguiente →</button>` : ''}</div></div>`;
  $('#lee').onclick = () => speak(h.t + '. ' + h.txt.join(' ') + ' ¿Sabías que? ' + h.sabias);
  $('#para').onclick = stopSpeak;
  const read = store.get('leidas', []); if (!read.includes(i)) { read.push(i); store.set('leidas', read); stars(1); }
  window.scrollTo(0, 0);
}

// ===== Acertijos =====
R.acertijos = function () {
  const qs = shuffle(ACERTIJOS); let n = 0;
  function show() {
    const [q, a] = qs[n % qs.length];
    view.innerHTML = `<div class="card" style="text-align:center"><span class="pill">Acertijo ${n % qs.length + 1} de ${qs.length}</span>
      <div style="font-size:56px;margin:10px 0">🤔</div><h2 style="line-height:1.4">${esc(q)}</h2>
      <div id="ans" style="min-height:60px"></div>
      <div class="row" style="justify-content:center"><button class="sec" id="ver">👀 Ver respuesta</button><button id="sig">Siguiente →</button></div>
      <p class="muted" style="font-size:13px">Piénsalo bien antes de ver la respuesta.</p></div>`;
    $('#ver').onclick = () => {
      $('#ans').innerHTML = `<div class="big" style="color:var(--p)">${esc(a)}</div><div class="row" style="justify-content:center;margin-top:8px"><button class="sm" id="si">✅ ¡Lo adiviné!</button><button class="sec sm" id="no">😅 No lo sabía</button></div>`;
      $('#ver').disabled = true;
      $('#si').onclick = () => { stars(1); n++; show(); };
      $('#no').onclick = () => { SFX.boing(); n++; show(); };
    };
    $('#sig').onclick = () => { n++; show(); };
  }
  show();
};

// ===== Sopa de letras =====
R.sopa = function (tema) {
  const temas = Object.keys(SOPAS);
  tema = tema || temas[0];
  const N = 10, ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  let grid, placed;
  for (let tries = 0; tries < 30; tries++) {
    grid = Array.from({length: N}, () => Array(N).fill('')); placed = [];
    for (const w of shuffle(SOPAS[tema].filter(w => w.length <= N))) {
      if (placed.length >= 7) break;
      for (let k = 0; k < 120; k++) {
        const [dr, dc] = DIRS[rand(DIRS.length)], r0 = rand(N), c0 = rand(N);
        const cells = [...w].map((ch, i) => [r0 + dr * i, c0 + dc * i]);
        if (cells.every(([r, c], i) => r >= 0 && c >= 0 && r < N && c < N && (grid[r][c] === '' || grid[r][c] === w[i]))) {
          cells.forEach(([r, c], i) => grid[r][c] = w[i]); placed.push({w, cells, f: false}); break;
        }
      }
    }
    if (placed.length >= 6) break;
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) grid[r][c] = ABC[rand(ABC.length)];
  const COLS = ['#E5484D','#2BB673','#1E9BF0','#8B5CF6','#FF7A59','#EC4899','#0E7C66'];
  view.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">🔤 ${esc(tema)}</h2>
      <select id="tema" style="width:auto">${temas.map(t => `<option ${t === tema ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <p class="muted">Arrastra el dedo desde la primera hasta la última letra de cada palabra.</p>
    <div class="sopa" id="sp" style="grid-template-columns:repeat(${N},1fr)">${grid.flat().map((ch, i) => `<div data-i="${i}">${ch}</div>`).join('')}</div>
    <div class="words" id="wl" style="margin-top:10px">${placed.map(p => `<span>${p.w}</span>`).join('')}</div>
    <p><button class="sec" onclick="R.sopa($('#tema').value)">🔄 Nueva sopa</button></p></div>`;
  $('#tema').onchange = e => R.sopa(e.target.value);
  const sp = $('#sp'), cells = [...sp.children];
  let a = null, line = [];
  const at = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.parentElement === sp ? +el.dataset.i : null; };
  function lineCells(i, j) {
    const r1 = Math.floor(i / N), c1 = i % N, r2 = Math.floor(j / N), c2 = j % N, dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
    const len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1));
    if (!(r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1))) return [i];
    return Array.from({length: len + 1}, (_, k) => (r1 + dr * k) * N + c1 + dc * k);
  }
  const paint = () => cells.forEach((c, i) => c.classList.toggle('sel', line.includes(i)));
  sp.onpointerdown = e => { const i = at(e); if (i == null) return; sp.setPointerCapture(e.pointerId); a = i; line = [i]; paint(); };
  sp.onpointermove = e => { if (a == null) return; const i = at(e); if (i == null) return; line = lineCells(a, i); paint(); };
  sp.onpointerup = sp.onpointercancel = () => {
    if (a == null) return;
    const word = line.map(i => grid[Math.floor(i / N)][i % N]).join('');
    const p = placed.find(p => !p.f && (p.w === word || p.w === [...word].reverse().join('')) && p.w.length === line.length);
    if (p) {
      p.f = true; const col = COLS[placed.indexOf(p) % COLS.length];
      line.forEach(i => { cells[i].classList.add('f'); cells[i].style.background = col; });
      $('#wl').children[placed.indexOf(p)].classList.add('f');
      SFX.pop();
      if (placed.every(p => p.f)) { SFX.win(); stars(3); setTimeout(() => $('#wl').insertAdjacentHTML('afterend', '<h2 style="text-align:center">🎉 ¡Encontraste todas!</h2>'), 200); }
      else toast('¡Encontraste ' + p.w + '!');
    }
    a = null; line = []; paint();
  };
};

// ===== Estudio de audio =====
function wavFromBuffer(buf) {
  const ch = buf.numberOfChannels, sr = buf.sampleRate, len = buf.length, out = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const ws = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); out.setUint32(4, 36 + len * ch * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true);
  out.setUint16(22, ch, true); out.setUint32(24, sr, true); out.setUint32(28, sr * ch * 2, true); out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true);
  ws(36, 'data'); out.setUint32(40, len * ch * 2, true);
  const data = []; for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
  let o = 44; for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, data[c][i])); out.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true); o += 2; }
  return new Blob([out], {type: 'audio/wav'});
}
const EFECTOS = {normal: ['🙂 Normal', 1, 0], ardilla: ['🐿️ Ardilla', 1.7, 0], monstruo: ['👹 Monstruo', .65, 0], eco: ['🏔️ Eco', 1, .32], robot: ['🤖 Robot', 1, .03]};
function connectEffect(ctx, src, fx, dest) {
  src.playbackRate.value = EFECTOS[fx][1];
  const delay = EFECTOS[fx][2];
  src.connect(dest);
  if (delay) {
    const d = ctx.createDelay(1); d.delayTime.value = delay; const g = ctx.createGain(); g.gain.value = fx === 'robot' ? .8 : .45;
    src.connect(d); d.connect(g); g.connect(d); g.connect(dest);
  }
}
async function renderEffect(buf, fx) {
  const rate = EFECTOS[fx][1], tail = EFECTOS[fx][2] ? 2 : 0;
  const len = Math.ceil((buf.duration / rate + tail) * buf.sampleRate);
  const off = new OfflineAudioContext(buf.numberOfChannels, len, buf.sampleRate);
  const s = off.createBufferSource(); s.buffer = buf; connectEffect(off, s, fx, off.destination); s.start();
  return off.startRendering();
}
R.audios = function () {
  view.innerHTML = `<div class="card" style="text-align:center"><h2>🎙️ Grabadora de voz</h2><p class="muted">Graba tu voz y escúchala con efectos divertidos.</p>
      <button class="rec" id="rec">🎤</button><div id="rst" class="muted">Toca el micrófono para grabar</div>
      <div id="fx" class="row" style="justify-content:center;margin-top:12px"></div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="sm" id="play" disabled>▶️ Escuchar</button><button class="sec sm" id="savev" disabled>💾 Guardar audio</button></div></div>
    <div class="card"><h2>🎹 Crea tu melodía</h2>
      <div class="row" style="margin-bottom:8px"><select id="inst" style="width:auto"><option value="triangle">🎹 Piano suave</option><option value="sine">🪈 Flauta</option><option value="square">🤖 Videojuego</option><option value="sawtooth">🎺 Trompeta</option></select>
        <button class="sm" id="mrec">⏺️ Grabar melodía</button><button class="sec sm" id="mplay" disabled>▶️ Tocar</button><button class="sec sm" id="msave" disabled>💾 Guardar</button></div>
      <div class="piano" id="pn"></div><p class="muted" id="mst" style="font-size:13px">Toca las teclas. Para guardar tu canción, primero toca "Grabar melodía".</p></div>`;
  // Grabadora
  let mr = null, chunks = [], buf = null, fx = 'normal', stream = null, playing = null;
  $('#fx').innerHTML = Object.entries(EFECTOS).map(([k, v]) => `<button class="sec sm" data-f="${k}">${v[0]}</button>`).join('');
  const markFx = () => view.querySelectorAll('#fx button').forEach(b => b.style.borderColor = b.dataset.f === fx ? 'var(--p)' : '');
  markFx();
  $('#fx').onclick = e => { const b = e.target.closest('button'); if (b) { fx = b.dataset.f; markFx(); } };
  $('#rec').onclick = async () => {
    if (mr && mr.state === 'recording') { mr.stop(); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio: true});
      chunks = []; mr = new MediaRecorder(stream);
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop()); $('#rec').classList.remove('on'); $('#rec').textContent = '🎤';
        const blob = new Blob(chunks, {type: mr.mimeType || 'audio/webm'});
        try { buf = await AC().decodeAudioData(await blob.arrayBuffer()); $('#rst').textContent = `Grabación lista (${buf.duration.toFixed(1)} s). Elige un efecto y escúchala.`; $('#play').disabled = $('#savev').disabled = false; }
        catch (e) { $('#rst').textContent = 'No se pudo leer la grabación. Intenta otra vez.'; }
      };
      mr.start(); $('#rec').classList.add('on'); $('#rec').textContent = '⏹️'; $('#rst').textContent = 'Grabando... toca otra vez para parar';
    } catch (e) { $('#rst').textContent = 'No tengo permiso para usar el micrófono. Actívalo en los ajustes de la app.'; }
  };
  $('#play').onclick = () => { if (!buf) return; if (playing) try { playing.stop(); } catch (e) {} const c = AC(), s = c.createBufferSource(); s.buffer = buf; connectEffect(c, s, fx, c.destination); s.start(); playing = s; };
  $('#savev').onclick = async () => { if (!buf) return; toast('Preparando audio...'); const out = await renderEffect(buf, fx); saveBlob(wavFromBuffer(out), 'voz_' + fx + '_' + stamp() + '.wav'); stars(1); };
  // Piano
  const NOTAS = [['Do', 261.63], ['Re', 293.66], ['Mi', 329.63], ['Fa', 349.23], ['Sol', 392.0], ['La', 440.0], ['Si', 493.88], ['Do²', 523.25]];
  $('#pn').innerHTML = NOTAS.map((n, i) => `<button data-i="${i}" style="border-bottom:6px solid ${['#E5484D','#FF7A59','#FFB020','#2BB673','#1E9BF0','#6C4BF4','#EC4899','#E5484D'][i]}">${n[0]}</button>`).join('');
  let song = [], recMel = false, t0 = 0;
  function note(ctx, f, when, type, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(type === 'sine' || type === 'triangle' ? .5 : .18, when + .02); g.gain.exponentialRampToValueAtTime(.001, when + .9);
    o.connect(g); g.connect(dest); o.start(when); o.stop(when + 1);
  }
  $('#pn').onpointerdown = e => {
    const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i, c = AC();
    note(c, NOTAS[i][1], c.currentTime, $('#inst').value, c.destination);
    b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 150);
    if (recMel) song.push([i, performance.now() - t0]);
  };
  $('#mrec').onclick = () => {
    if (!recMel) { song = []; recMel = true; t0 = performance.now(); $('#mrec').textContent = '⏹️ Terminar'; $('#mst').textContent = 'Grabando melodía... toca las teclas'; }
    else { recMel = false; $('#mrec').textContent = '⏺️ Grabar melodía'; $('#mst').textContent = song.length ? `Melodía de ${song.length} notas lista.` : 'No tocaste ninguna nota.'; $('#mplay').disabled = $('#msave').disabled = !song.length; }
  };
  $('#mplay').onclick = () => { const c = AC(), st = c.currentTime + .1, f = song.length ? song[0][1] : 0; song.forEach(([i, t]) => note(c, NOTAS[i][1], st + (t - f) / 1000, $('#inst').value, c.destination)); };
  $('#msave').onclick = async () => {
    const f = song[0][1], dur = (song[song.length - 1][1] - f) / 1000 + 1.5, sr = 44100;
    const off = new OfflineAudioContext(1, Math.ceil(dur * sr), sr);
    song.forEach(([i, t]) => note(off, NOTAS[i][1], (t - f) / 1000, $('#inst').value, off.destination));
    saveBlob(wavFromBuffer(await off.startRendering()), 'melodia_' + stamp() + '.wav'); stars(1);
  };
  cleanup = () => { if (mr && mr.state === 'recording') mr.stop(); if (stream) stream.getTracks().forEach(t => t.stop()); };
};

// ===== Mascota =====
function petTick(p) {
  const now = Date.now(), min = (now - p.ts) / 60000;
  if (min > 0) {
    p.comida = Math.max(0, p.comida - min * .5); p.feliz = Math.max(0, p.feliz - min * .4);
    p.energia = Math.max(0, p.energia - min * .3); p.limpio = Math.max(0, p.limpio - min * .3); p.ts = now;
  }
  return p;
}
R.mascota = function () {
  let p = store.get('pet', null);
  if (!p) {
    view.innerHTML = `<div class="card"><h2>🐾 Adopta una mascota</h2><p class="muted">Elige tu mascota y ponle nombre. Tendrás que alimentarla, jugar con ella, bañarla y dejarla dormir.</p>
      <div class="grid" id="tipos">${MASCOTAS.map(m => `<button class="tile" data-e="${m[0]}"><span style="font-size:48px">${m[0]}</span>${m[1]}</button>`).join('')}</div>
      <p><input id="nom" placeholder="Nombre de tu mascota" maxlength="16"></p><button id="ok">¡Adoptar! 💜</button></div>`;
    let tipo = MASCOTAS[0][0];
    const ts = view.querySelectorAll('#tipos .tile'); ts[0].style.outline = '3px solid var(--p)';
    ts.forEach(t => t.onclick = () => { tipo = t.dataset.e; ts.forEach(x => x.style.outline = ''); t.style.outline = '3px solid var(--p)'; });
    $('#ok').onclick = () => {
      const nombre = $('#nom').value.trim(); if (!nombre) { toast('Escribe un nombre'); return; }
      store.set('pet', {tipo, nombre, comida: 80, feliz: 80, energia: 80, limpio: 80, xp: 0, ts: Date.now()}); stars(2); R.mascota();
    };
    return;
  }
  function render(anim) {
    p = petTick(p); store.set('pet', p);
    const avg = (p.comida + p.feliz + p.energia + p.limpio) / 4, lvl = Math.floor(p.xp / 50) + 1;
    const mood = avg > 70 ? ['😄', '¡Estoy súper feliz!'] : avg > 40 ? ['🙂', 'Estoy bien'] : avg > 15 ? ['😟', 'Necesito que me cuides'] : ['😢', '¡Por favor ayúdame!'];
    const need = p.comida < 30 ? 'Tengo hambre 🍎' : p.energia < 30 ? 'Tengo sueño 😴' : p.limpio < 30 ? 'Necesito un baño 🛁' : p.feliz < 30 ? 'Quiero jugar ⚽' : mood[1];
    const acc = (lvl >= 5 ? '👑' : lvl >= 3 ? '🎩' : lvl >= 2 ? '🎀' : '');
    const bar = (n, v, c) => `<div class="stat"><span>${n}</span><div class="bar"><i style="width:${v}%;background:${v < 30 ? 'var(--bad)' : c}"></i></div><b>${Math.round(v)}</b></div>`;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="row" style="justify-content:space-between"><span class="pill">Nivel ${lvl}</span><span class="pill">${mood[0]}</span></div>
      <div style="font-size:40px;height:44px">${acc}</div><div class="pet ${anim ? 'bounce' : ''}" id="pt">${p.tipo}</div>
      <h2 style="margin:6px 0 0">${esc(p.nombre)}</h2><p class="muted" style="margin:4px 0 12px">"${need}"</p>
      ${bar('🍎 Comida', p.comida, 'var(--c1)')}${bar('😊 Felicidad', p.feliz, 'var(--c6)')}${bar('⚡ Energía', p.energia, 'var(--c2)')}${bar('🛁 Limpieza', p.limpio, 'var(--c4)')}
      <div class="bar" style="margin:12px 0 4px;height:8px"><i style="width:${p.xp % 50 * 2}%;background:var(--p)"></i></div><div class="muted" style="font-size:12px">${50 - p.xp % 50} puntos para el nivel ${lvl + 1}${lvl < 5 ? ' · ¡Desbloquea accesorios!' : ''}</div>
      <div class="grid" style="margin-top:14px;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px">
        <button style="padding:10px 2px" data-a="comer">🍎<br>Comer</button><button style="padding:10px 2px" data-a="jugar">⚽<br>Jugar</button><button style="padding:10px 2px" data-a="dormir">😴<br>Dormir</button><button style="padding:10px 2px" data-a="banar">🛁<br>Bañar</button></div>
      <p><button class="sec sm" id="rst">Adoptar otra mascota</button></p></div>`;
    view.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const a = b.dataset.a, c = v => Math.min(100, v);
      if (a === 'comer') { if (p.comida > 95) return toast('¡Ya está lleno!'); p.comida = c(p.comida + 25); p.limpio = Math.max(0, p.limpio - 5); SFX.munch(); }
      if (a === 'jugar') { if (p.energia < 15) return toast('Está muy cansado, déjalo dormir'); p.feliz = c(p.feliz + 25); p.energia -= 15; p.comida = Math.max(0, p.comida - 10); SFX.happy(); }
      if (a === 'dormir') { if (p.energia > 95) return toast('No tiene sueño'); p.energia = c(p.energia + 40); SFX.snore(); }
      if (a === 'banar') { if (p.limpio > 95) return toast('¡Ya está limpiecito!'); p.limpio = c(p.limpio + 40); SFX.splash(); }
      const before = Math.floor(p.xp / 50); p.xp += 5; if (Math.floor(p.xp / 50) > before) { SFX.levelup(); stars(2); toast('🎉 ¡' + p.nombre + ' subió de nivel!'); }
      render(true);
    });
    $('#rst').onclick = () => { if (confirm('¿Seguro? Perderás a ' + p.nombre)) { store.set('pet', null); R.mascota(); } };
  }
  render();
  const iv = setInterval(() => render(), 30000); cleanup = () => clearInterval(iv);
};

// ===== Bibliotecas =====
R.biblio = function () {
  view.innerHTML = `<div class="card"><h2>📚 Bibliotecas y recursos gratis</h2><p class="muted">Sitios gratuitos para leer y estudiar. Se abren en el navegador (necesitas internet).</p>
    <input id="bq" placeholder="Buscar: libros, ciencia, inglés..."></div><div id="bl"></div>`;
  function render() {
    const q = norm($('#bq').value);
    $('#bl').innerHTML = BIBLIOTECAS.map(g => {
      const its = g.items.filter(i => !q || norm(i[0] + ' ' + i[1] + ' ' + g.cat).includes(q));
      return its.length ? `<div class="card"><h3>${g.cat}</h3>${its.map(i => `<div class="lib"><div><b>${esc(i[0])}</b><div class="muted" style="font-size:14px">${esc(i[1])}</div></div><a class="link" href="${i[2]}" target="_blank" rel="noopener">Abrir ↗</a></div>`).join('')}</div>` : '';
    }).join('') || '<div class="card muted">No encontré nada con esa palabra.</div>';
  }
  $('#bq').oninput = render; render();
};

// ===== Sonido de botones y silencio =====
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('button'); if (!b || b.closest('#pn,.simon,.opts,.mem,.puz,.ttt')) return; SFX.click();
}, true);
function toggleMute() { const m = SFX.toggle(); $('#mute').textContent = m ? '🔇' : '🔊'; toast(m ? 'Sonidos apagados' : 'Sonidos encendidos'); if (!m) SFX.happy(); }

// ===== Inicio =====
$('#mute').textContent = SFX.isMuted() ? '🔇' : '🔊';
history.replaceState('home', '');
stars(0);
R.home();
