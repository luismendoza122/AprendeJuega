// ===== Más juegos educativos (v2.0) =====
const nuevosJuegos = [
  ['reloj()', '🕐', '#DCEFFF', '¿Qué hora es?', 'Aprende a leer el reloj'],
  ['dinero()', '💰', '#DDF5E8', 'Cuenta el dinero', 'Monedas y billetes'],
  ['fracciones()', '🍕', '#FFE3D8', 'Fracciones', 'Partes de una pizza'],
  ['patrones()', '🔷', '#E9E1FF', 'Completa el patrón', '¿Qué sigue?'],
  ['mayorMenor()', '🐊', '#DDF5E8', 'Mayor o menor', '>, < o ='],
  ['enOrden()', '⚡', '#FFF1CC', 'Toca en orden', 'Del 1 al último, ¡rápido!'],
  ['diferente()', '🔎', '#FFDDEE', 'Encuentra el diferente', 'Ojo de águila'],
  ['serpiente()', '🐍', '#DCEFFF', 'Serpiente ABC', 'Come las letras en inglés']
];
R.juegos = function () {
  const viejos = [
    ['mate()', '➕', '#FFE3D8', 'Matemática rápida', 'Sumas, restas y tablas'], ['memoria()', '🃏', '#DDF5E8', 'Memoria', 'Encuentra las parejas'],
    ['paises()', '🗺️', '#DCEFFF', '¿De qué país es?', 'Ciudades y países'], ['simon()', '🔴', '#E9E1FF', 'Simón dice', 'Repite colores y sonidos'],
    ['globos()', '🎈', '#FFDDEE', 'Revienta globos', 'Números pares, vocales...'], ['tresEnRaya()', '⭕', '#FFF1CC', 'Tres en raya', 'Contra el celular'],
    ['ahorcado()', '🌸', '#DDF5E8', 'Adivina la palabra', 'Letra por letra'], ['revueltas()', '🔀', '#FFE3D8', 'Letras revueltas', 'Ordena la palabra']
  ];
  view.innerHTML = `<div class="card"><span class="pill">🆕 ${nuevosJuegos.length} juegos nuevos</span></div>
    <div class="grid">${[...nuevosJuegos, ...viejos].map(([f, e, c, t, d], k) => `<button class="tile" onclick="limpiar();${f}"><span class="em" style="background:${c}">${e}</span>${t}${k < nuevosJuegos.length ? ' 🆕' : ''}<small>${d}</small></button>`).join('')}</div>`;
};
SECCIONES.find(s => s.id === 'juegos').d = `${nuevosJuegos.length + 8} juegos para aprender`;

// Ronda de preguntas de opción múltiple reutilizable
function rondaOpciones({titulo, total = 10, gen, record, alFinal}) {
  let n = 0, ok = 0;
  function sig() {
    if (n >= total) {
      const e = ok >= total * .9 ? 3 : ok >= total * .7 ? 2 : ok >= total * .4 ? 1 : 0;
      if (e) stars(e); if (e === 3) SFX.win();
      if (record) { const b = store.get(record, 0); if (ok > b) store.set(record, ok); }
      view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:60px">${['🌱', '⭐', '🌟', '🏆'][e]}</div><h2>${ok} de ${total}</h2>
        <p class="muted">${e === 3 ? '¡Perfecto!' : 'Sigue practicando y gana más estrellas.'}</p><div class="row" style="justify-content:center"><button onclick="${alFinal}">Jugar otra vez</button>${backJuegos}</div></div>`;
      return;
    }
    const q = gen(n);
    view.innerHTML = `<div class="card" style="text-align:center"><h2>${titulo}</h2><div class="pill">${n + 1} / ${total} · ✅ ${ok}</div>
      <div style="margin:12px 0">${q.html}</div>
      <div class="opts" style="grid-template-columns:repeat(${q.ops.length > 3 ? 2 : q.ops.length},1fr)">${q.ops.map((o, k) => `<button data-k="${k}" style="text-align:center;font-size:22px">${o}</button>`).join('')}</div>
      <p id="fb" class="muted" style="min-height:24px"></p><p>${backJuegos}</p></div>`;
    view.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
      const k = +b.dataset.k, bien = k === q.ok;
      view.querySelectorAll('.opts button').forEach(x => x.disabled = true);
      view.querySelectorAll('.opts button')[q.ok].classList.add('ok');
      if (!bien) b.classList.add('bad');
      bien ? (SFX.ok(), ok++) : SFX.bad();
      $('#fb').innerHTML = bien ? '¡Correcto! 🎉' : (q.explica || 'La respuesta era: ' + q.ops[q.ok]);
      n++; setTimeout(() => $('#fb') && sig(), bien ? 900 : 2200);
    });
  }
  sig();
}
const mezclarOpciones = (correcta, falsas) => { const ops = shuffle([correcta, ...falsas.filter((x, i, a) => x !== correcta && a.indexOf(x) === i).slice(0, 3)]); return {ops, ok: ops.indexOf(correcta)}; };

// --- ¿Qué hora es? ---
function relojSVG(h, m) {
  const ah = ((h % 12) + m / 60) * 30, am = m * 6;
  const marcas = Array.from({length: 12}, (_, i) => { const a = i * 30 * Math.PI / 180, x = 100 + 78 * Math.sin(a), y = 100 - 78 * Math.cos(a); return `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="700" fill="#1F1B3A">${i || 12}</text>`; }).join('');
  return `<svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Reloj"><circle cx="100" cy="100" r="96" fill="#fff" stroke="#6C4BF4" stroke-width="6"/>${marcas}
    <line x1="100" y1="100" x2="${100 + 45 * Math.sin(ah * Math.PI / 180)}" y2="${100 - 45 * Math.cos(ah * Math.PI / 180)}" stroke="#1F1B3A" stroke-width="7" stroke-linecap="round"/>
    <line x1="100" y1="100" x2="${100 + 68 * Math.sin(am * Math.PI / 180)}" y2="${100 - 68 * Math.cos(am * Math.PI / 180)}" stroke="#E5484D" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="6" fill="#1F1B3A"/></svg>`;
}
const horaTxt = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
function reloj(nivel) {
  if (!nivel) {
    view.innerHTML = `<div class="card"><h2>🕐 ¿Qué hora es?</h2><p class="muted">La aguja corta (negra) marca la hora y la larga (roja) los minutos.</p>
      <div class="opts"><button onclick="reloj(1)">🟢 Horas en punto</button><button onclick="reloj(2)">🟡 Y media</button><button onclick="reloj(3)">🟠 Cuartos de hora</button><button onclick="reloj(4)">🔴 De 5 en 5 minutos</button></div><p>${backJuegos}</p></div>`;
    return;
  }
  const mins = [[0], [0, 30], [0, 15, 30, 45], [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]][nivel - 1];
  rondaOpciones({titulo: '🕐 ¿Qué hora es?', alFinal: `reloj(${nivel})`, gen: () => {
    const h = rand(12) + 1, m = mins[rand(mins.length)], c = horaTxt(h, m);
    const f = [horaTxt(h % 12 + 1, m), horaTxt(h, mins[rand(mins.length)]), horaTxt((m / 5) || 12, h * 5 % 60), horaTxt(h === 1 ? 12 : h - 1, m), horaTxt(rand(12) + 1, mins[rand(mins.length)])];
    return {html: relojSVG(h, m), ...mezclarOpciones(c, f), explica: `Eran las ${c}. La aguja corta señala el ${h} y la larga el ${m ? m / 5 : 12}${m ? ` (${m} minutos)` : ' (en punto)'}.`};
  }});
}

// --- Cuenta el dinero (pesos colombianos) ---
const PLATA = [
  {v: 50, t: 'moneda', c: '#C9CCD1'}, {v: 100, t: 'moneda', c: '#D9B44A'}, {v: 200, t: 'moneda', c: '#C9CCD1'}, {v: 500, t: 'moneda', c: '#D9B44A'}, {v: 1000, t: 'moneda', c: '#D9B44A'},
  {v: 2000, t: 'billete', c: '#7FB8E6'}, {v: 5000, t: 'billete', c: '#9AD3A8'}, {v: 10000, t: 'billete', c: '#E8A3B8'}, {v: 20000, t: 'billete', c: '#F2C27B'}
];
const pesos = v => '$' + v.toLocaleString('es-CO');
const dibujaPlata = p => p.t === 'moneda'
  ? `<span class="moneda" style="background:${p.c}">${p.v >= 1000 ? '1 mil' : p.v}</span>`
  : `<span class="billete" style="background:${p.c}">${pesos(p.v)}</span>`;
function dinero(nivel) {
  if (!nivel) {
    view.innerHTML = `<div class="card"><h2>💰 Cuenta el dinero</h2><p class="muted">Suma las monedas y billetes. ¡Como cuando vas a la tienda!</p>
      <div class="opts"><button onclick="dinero(1)">🟢 Solo monedas</button><button onclick="dinero(2)">🟡 Monedas y billetes</button><button onclick="dinero(3)">🔴 ¿Cuánto me devuelven?</button></div><p>${backJuegos}</p></div>`;
    return;
  }
  rondaOpciones({titulo: '💰 Cuenta el dinero', alFinal: `dinero(${nivel})`, gen: () => {
    const fuente = nivel === 1 ? PLATA.slice(0, 5) : PLATA.slice(nivel === 3 ? 3 : 0, nivel === 3 ? 8 : 7);
    const items = Array.from({length: rand(3) + (nivel === 1 ? 3 : 2)}, () => fuente[rand(fuente.length)]).sort((a, b) => b.v - a.v);
    const total = items.reduce((s, p) => s + p.v, 0);
    if (nivel === 3) {
      const precio = Math.max(100, Math.round((total * (.3 + Math.random() * .6)) / 100) * 100), vuelto = total - precio;
      const f = [vuelto + 100, vuelto - 100, vuelto + 500, vuelto + 1000, precio].filter(x => x >= 0);
      return {html: `<p>Pagas con:</p><div class="plata">${items.map(dibujaPlata).join('')}</div><p style="font-size:20px">Compras algo de <b>${pesos(precio)}</b>. ¿Cuánto te devuelven?</p>`,
        ...mezclarOpciones(pesos(vuelto), f.map(pesos)), explica: `Pagaste ${pesos(total)} − ${pesos(precio)} = ${pesos(vuelto)}`};
    }
    const f = [total + 100, total - 100, total + 1000, total + 50, total - 50].filter(x => x > 0);
    return {html: `<div class="plata">${items.map(dibujaPlata).join('')}</div><p style="font-size:20px">¿Cuánto dinero hay?</p>`, ...mezclarOpciones(pesos(total), f.map(pesos)),
      explica: `${items.map(p => pesos(p.v)).join(' + ')} = ${pesos(total)}`};
  }});
}

// --- Fracciones con pizza ---
function pizzaSVG(n, k) {
  if (n === 1) return `<svg viewBox="0 0 200 200" width="180" height="180"><circle cx="100" cy="100" r="90" fill="${k ? '#FFB020' : '#FFF1CC'}" stroke="#B5651D" stroke-width="6"/></svg>`;
  let s = '';
  for (let i = 0; i < n; i++) {
    const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2;
    const x0 = 100 + 90 * Math.cos(a0), y0 = 100 + 90 * Math.sin(a0), x1 = 100 + 90 * Math.cos(a1), y1 = 100 + 90 * Math.sin(a1);
    s += `<path d="M100 100 L${x0} ${y0} A90 90 0 ${1 / n > .5 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${i < k ? '#FFB020' : '#FFF1CC'}" stroke="#B5651D" stroke-width="4"/>`;
    if (i < k) s += `<circle cx="${100 + 55 * Math.cos((a0 + a1) / 2)}" cy="${100 + 55 * Math.sin((a0 + a1) / 2)}" r="7" fill="#E5484D"/>`;
  }
  return `<svg viewBox="0 0 200 200" width="180" height="180" role="img" aria-label="Pizza">${s}</svg>`;
}
function fracciones() {
  rondaOpciones({titulo: '🍕 ¿Qué parte tiene queso y pepperoni?', alFinal: 'fracciones()', gen: () => {
    const n = [2, 3, 4, 5, 6, 8][rand(6)], k = rand(n - 1) + 1, c = `${k}/${n}`;
    const f = [`${n - k}/${n}`, `${k}/${n + 1}`, `${n}/${k}`, `${k + 1}/${n}`, `${k}/${n * 2}`];
    return {html: pizzaSVG(n, k), ...mezclarOpciones(c, f), explica: `La pizza tiene ${n} partes y ${k} tienen ingredientes: ${c}.`};
  }});
}

// --- Completa el patrón ---
function patrones() {
  const sets = [['🔴', '🔵', '🟢', '🟡'], ['🐶', '🐱', '🐭', '🐰'], ['⭐', '🌙', '☀️', '☁️'], ['🍎', '🍌', '🍇', '🍓'], ['▲', '■', '●', '◆']];
  const formas = ['AB', 'AAB', 'ABB', 'ABC', 'AABB', 'ABAC'];
  rondaOpciones({titulo: '🔷 ¿Qué sigue?', alFinal: 'patrones()', gen: n => {
    if (n % 3 === 2) {
      const ini = rand(10) + 1, paso = [2, 3, 5, 10][rand(4)], doble = n > 6 && Math.random() < .4;
      const sec = Array.from({length: 5}, (_, i) => doble ? ini * 2 ** i : ini + paso * i), c = String(doble ? ini * 2 ** 5 : ini + paso * 5);
      return {html: `<div class="big" style="font-size:30px;letter-spacing:4px">${sec.join(', ')}, ?</div>`, ...mezclarOpciones(c, [String(+c + 1), String(+c - 1), String(+c + paso), String(+c * 2), String(+c - paso)]),
        explica: doble ? `Cada número es el doble del anterior: el siguiente es ${c}.` : `Va sumando ${paso}: el siguiente es ${c}.`};
    }
    const s = shuffle(sets[rand(sets.length)]), forma = formas[rand(formas.length)];
    const sec = Array.from({length: forma.length * 2 + 1}, (_, i) => s['ABC'.indexOf(forma[i % forma.length])]);
    const c = sec.pop();
    return {html: `<div style="font-size:34px;letter-spacing:6px">${sec.join('')}❓</div>`, ...mezclarOpciones(c, s), explica: `El patrón se repite así: ${forma.split('').map(l => s['ABC'.indexOf(l)]).join('')}`};
  }});
}

// --- Mayor o menor (contra reloj) ---
function mayorMenor() {
  let ok = 0, malo = 0, t = 60, iv = null;
  const best = store.get('mm_best', 0);
  const expr = () => { const tipo = rand(3); if (tipo === 0) { const v = rand(100); return [String(v), v]; } const a = rand(20), b = rand(20); return tipo === 1 ? [`${a} + ${b}`, a + b] : [`${Math.max(a, b)} − ${Math.min(a, b)}`, Math.abs(a - b)]; };
  view.innerHTML = `<div class="card" style="text-align:center"><h2>🐊 Mayor o menor</h2>
    <div class="row" style="justify-content:center"><span class="pill" id="mmt">⏱ 60</span><span class="pill" id="mmok">✅ 0</span><span class="pill">Récord: ${best}</span></div>
    <div class="row" style="justify-content:center;align-items:center;gap:14px;margin:18px 0"><div class="big" id="mma"></div><div class="big" style="color:var(--p)">?</div><div class="big" id="mmb"></div></div>
    <div class="row" style="justify-content:center">${['<', '=', '>'].map(s => `<button class="mmb" data-s="${s}" style="font-size:30px;min-width:80px">${s}</button>`).join('')}</div>
    <p class="muted">El cocodrilo 🐊 siempre se come al número más grande.</p><p>${backJuegos}</p></div>`;
  let A, B;
  const nuevo = () => { const a = expr(), b = expr(); A = a[1]; B = b[1]; $('#mma').textContent = a[0]; $('#mmb').textContent = b[0]; };
  const fin = () => {
    clearInterval(iv); if (ok > best) store.set('mm_best', ok); if (ok >= 10) stars(ok >= 25 ? 3 : ok >= 18 ? 2 : 1);
    view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:60px">🐊</div><h2>${ok} correctas</h2><p class="muted">${malo} errores · Récord: ${Math.max(ok, best)}</p><div class="row" style="justify-content:center"><button onclick="limpiar();mayorMenor()">Jugar otra vez</button>${backJuegos}</div></div>`;
  };
  view.querySelectorAll('.mmb').forEach(b => b.onclick = () => {
    const s = b.dataset.s, bien = (s === '<' && A < B) || (s === '>' && A > B) || (s === '=' && A === B);
    if (bien) { ok++; SFX.pop(); } else { malo++; SFX.bad(); }
    $('#mmok').textContent = '✅ ' + ok; nuevo();
  });
  nuevo();
  iv = setInterval(() => { t--; if (!$('#mmt')) return clearInterval(iv); $('#mmt').textContent = '⏱ ' + t; if (t <= 5) SFX.tick(); if (t <= 0) fin(); }, 1000);
  cleanup = () => clearInterval(iv);
}

// --- Toca en orden (tabla de Schulte) ---
function enOrden(tam) {
  if (!tam) {
    view.innerHTML = `<div class="card"><h2>⚡ Toca en orden</h2><p class="muted">Toca los números del 1 al último lo más rápido que puedas. ¡Entrena tu atención!</p>
      <div class="opts"><button onclick="enOrden(3)">🟢 3 × 3 (1 al 9)</button><button onclick="enOrden(4)">🟡 4 × 4 (1 al 16)</button><button onclick="enOrden(5)">🔴 5 × 5 (1 al 25)</button></div><p>${backJuegos}</p></div>`;
    return;
  }
  const n = tam * tam, nums = shuffle(Array.from({length: n}, (_, i) => i + 1)), key = 'orden_' + tam, best = store.get(key, 0);
  let sig = 1, t0 = 0, iv = null;
  view.innerHTML = `<div class="card" style="text-align:center"><h2>⚡ Busca el <span id="eo">1</span></h2>
    <div class="row" style="justify-content:center"><span class="pill" id="eot">0.0 s</span><span class="pill">Récord: ${best ? (best / 10).toFixed(1) + ' s' : '—'}</span></div>
    <div class="schulte" style="grid-template-columns:repeat(${tam},1fr)">${nums.map(x => `<button data-n="${x}">${x}</button>`).join('')}</div><p>${backJuegos}</p></div>`;
  view.querySelectorAll('.schulte button').forEach(b => b.onclick = () => {
    if (+b.dataset.n !== sig) { SFX.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 300); return; }
    if (sig === 1) { t0 = Date.now(); iv = setInterval(() => $('#eot') && ($('#eot').textContent = ((Date.now() - t0) / 1000).toFixed(1) + ' s'), 100); }
    SFX.click(); b.classList.add('ok'); b.disabled = true; sig++;
    if (sig > n) {
      clearInterval(iv); const d = Math.round((Date.now() - t0) / 100), rec = !best || d < best; if (rec) store.set(key, d);
      stars(tam - 2); SFX.win();
      $('#eo').parentElement.innerHTML = `🎉 ¡${(d / 10).toFixed(1)} segundos!${rec ? ' ¡Nuevo récord!' : ''} <button class="sm" onclick="enOrden(${tam})">Otra vez</button>`;
    } else $('#eo').textContent = sig;
  });
  cleanup = () => clearInterval(iv);
}

// --- Encuentra el diferente ---
function diferente() {
  const pares = [['😀', '😃'], ['🐶', '🐕'], ['🍎', '🍅'], ['🌕', '🌝'], ['⭐', '🌟'], ['🐱', '🐈'], ['🍊', '🍑'], ['😐', '😑'], ['🌲', '🌳'], ['🔵', '🟦'], ['🐸', '🐢'], ['🙂', '🙃'], ['🍪', '🍩'], ['⚽', '🏐'], ['🐻', '🐨'], ['🥑', '🥝']];
  let nivel = 1, ok = 0, t = 45, iv = null;
  const best = store.get('dif_best', 0);
  view.innerHTML = `<div class="card" style="text-align:center"><h2>🔎 Encuentra el diferente</h2>
    <div class="row" style="justify-content:center"><span class="pill" id="dft">⏱ 45</span><span class="pill" id="dfn">Nivel 1</span><span class="pill">Récord: ${best}</span></div>
    <div id="dfg" class="difgrid"></div><p>${backJuegos}</p></div>`;
  function ronda() {
    const lado = Math.min(3 + Math.floor(nivel / 2), 8), n = lado * lado, [a, b] = shuffle(pares[rand(pares.length)]), raro = rand(n);
    $('#dfn').textContent = 'Nivel ' + nivel;
    $('#dfg').style.gridTemplateColumns = `repeat(${lado},1fr)`;
    $('#dfg').style.fontSize = Math.max(18, 44 - lado * 3) + 'px';
    $('#dfg').innerHTML = Array.from({length: n}, (_, i) => `<button data-i="${i}">${i === raro ? b : a}</button>`).join('');
    $('#dfg').querySelectorAll('button').forEach(x => x.onclick = () => {
      if (+x.dataset.i === raro) { SFX.ok(); ok++; nivel++; t = Math.min(t + 3, 60); ronda(); }
      else { SFX.bad(); t = Math.max(0, t - 3); x.style.opacity = .3; }
    });
  }
  const fin = () => {
    clearInterval(iv); if (ok > best) store.set('dif_best', ok); if (ok >= 5) stars(ok >= 15 ? 3 : ok >= 10 ? 2 : 1);
    view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:60px">🔎</div><h2>Encontraste ${ok}</h2><p class="muted">Récord: ${Math.max(ok, best)}</p><div class="row" style="justify-content:center"><button onclick="limpiar();diferente()">Jugar otra vez</button>${backJuegos}</div></div>`;
  };
  ronda();
  iv = setInterval(() => { t--; if (!$('#dft')) return clearInterval(iv); $('#dft').textContent = '⏱ ' + t; if (t <= 0) fin(); }, 1000);
  cleanup = () => clearInterval(iv);
}

// --- Serpiente ABC (deletrear palabras en inglés) ---
function serpiente() {
  const N = 12, palabras = (typeof INGLES !== 'undefined' ? INGLES.filter(u => !['abc', 'dias', 'numeros'].includes(u.id)).flatMap(u => u.palabras) : [])
    .filter(p => /^[a-z]{3,6}$/.test(p.en));
  let snake, dir, nextDir, palabra, pos, comidas, vidas = 3, puntos = 0, iv = null, vel = 260;
  const best = store.get('snake_best', 0);
  view.innerHTML = `<div class="card" style="text-align:center"><h2>🐍 Serpiente ABC</h2>
    <div class="row" style="justify-content:center"><span class="pill" id="snp">⭐ 0</span><span class="pill" id="snv">❤️❤️❤️</span><span class="pill">Récord: ${best}</span></div>
    <div id="snw" style="font-size:22px;margin:8px 0;min-height:34px"></div>
    <canvas id="snc" width="360" height="360" style="width:100%;max-width:360px;background:#fff;border-radius:14px;border:2px solid var(--line);touch-action:none"></canvas>
    <div class="dpad"><button data-d="0,-1">⬆️</button><div><button data-d="-1,0">⬅️</button><button data-d="1,0">➡️</button></div><button data-d="0,1">⬇️</button></div>
    <p class="muted">Come las letras en orden para escribir la palabra en inglés. También puedes deslizar el dedo.</p><p>${backJuegos}</p></div>`;
  const cv = $('#snc'), ctx = cv.getContext('2d'), cel = cv.width / N;
  const libre = () => { let c; do { c = [rand(N), rand(N)]; } while (snake.some(s => s[0] === c[0] && s[1] === c[1]) || comidas.some(f => f.x === c[0] && f.y === c[1])); return c; };
  function nuevaPalabra() {
    palabra = palabras.length ? palabras[rand(palabras.length)] : {en: 'cat', e: '🐱', es: 'gato'};
    pos = 0; comidas = [];
    const letras = palabra.en.split(''), extra = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !letras.includes(l))).slice(0, 2);
    [...new Set([...letras, ...extra])].forEach(l => { const [x, y] = libre(); comidas.push({x, y, l}); });
    pintarPalabra();
    if (typeof speakEn === 'function') speakEn(palabra.en);
  }
  const pintarPalabra = () => { $('#snw').innerHTML = `${esc(palabra.e)} <b>${palabra.en.split('').map((l, i) => i < pos ? `<span style="color:var(--ok)">${l.toUpperCase()}</span>` : '_').join(' ')}</b> <span class="muted">(${esc(palabra.es)})</span>`; };
  function reiniciar() { snake = [[5, 6], [4, 6], [3, 6]]; dir = [1, 0]; nextDir = dir; comidas = []; nuevaPalabra(); }
  function paso() {
    if (!cv.isConnected) return clearInterval(iv);
    dir = nextDir;
    const h = [(snake[0][0] + dir[0] + N) % N, (snake[0][1] + dir[1] + N) % N];
    if (snake.some(s => s[0] === h[0] && s[1] === h[1])) return perder('¡Te mordiste la cola!');
    snake.unshift(h);
    const f = comidas.find(c => c.x === h[0] && c.y === h[1]);
    if (f) {
      if (f.l === palabra.en[pos]) {
        SFX.munch(); pos++; comidas = comidas.filter(c => c !== f || palabra.en.indexOf(f.l, pos) >= 0);
        if (palabra.en.indexOf(f.l, pos) >= 0) { const [x, y] = libre(); f.x = x; f.y = y; }
        pintarPalabra();
        if (pos === palabra.en.length) { puntos++; $('#snp').textContent = '⭐ ' + puntos; SFX.win(); if (typeof speakEn === 'function') setTimeout(() => speakEn(palabra.en), 300); vel = Math.max(140, vel - 12); clearInterval(iv); iv = setInterval(paso, vel); setTimeout(nuevaPalabra, 900); }
      } else { snake.pop(); return perder(`La letra que sigue es «${palabra.en[pos].toUpperCase()}»`); }
    } else snake.pop();
    dibujar();
  }
  function perder(msg) {
    vidas--; SFX.bad(); $('#snv').textContent = '❤️'.repeat(Math.max(0, vidas)) || '💔'; toast(msg);
    if (vidas <= 0) {
      clearInterval(iv); if (puntos > best) store.set('snake_best', puntos); if (puntos >= 2) stars(Math.min(4, puntos));
      $('#snw').innerHTML = `Fin del juego: ${puntos} palabra(s) <button class="sm" onclick="limpiar();serpiente()">Otra vez</button>`;
      return;
    }
    snake = snake.slice(0, 3); dibujar();
  }
  function dibujar() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#F4F1FF'; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) ctx.fillRect(i * cel, j * cel, cel, cel);
    ctx.font = `bold ${cel * .62}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    comidas.forEach(c => { ctx.fillStyle = '#FFB020'; ctx.beginPath(); ctx.arc(c.x * cel + cel / 2, c.y * cel + cel / 2, cel * .45, 0, 7); ctx.fill(); ctx.fillStyle = '#1F1B3A'; ctx.fillText(c.l.toUpperCase(), c.x * cel + cel / 2, c.y * cel + cel / 2 + 1); });
    snake.forEach((s, i) => { ctx.fillStyle = i ? '#2BB673' : '#1E8C57'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(s[0] * cel + 2, s[1] * cel + 2, cel - 4, cel - 4, 8) : ctx.rect(s[0] * cel + 2, s[1] * cel + 2, cel - 4, cel - 4); ctx.fill(); });
    const h = snake[0]; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(h[0] * cel + cel / 2 + dir[0] * 5 - dir[1] * 5, h[1] * cel + cel / 2 + dir[1] * 5 - dir[0] * 5, 4, 0, 7); ctx.fill();
  }
  const girar = d => { if (d[0] === -dir[0] && d[1] === -dir[1]) return; nextDir = d; };
  view.querySelectorAll('.dpad button').forEach(b => b.onpointerdown = e => { e.preventDefault(); girar(b.dataset.d.split(',').map(Number)); });
  let tx = 0, ty = 0;
  cv.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, {passive: true});
  cv.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return; girar(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); });
  const teclas = e => { const m = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]}[e.key]; if (m) { e.preventDefault(); girar(m); } };
  document.addEventListener('keydown', teclas);
  reiniciar(); dibujar();
  iv = setInterval(paso, vel);
  cleanup = () => { clearInterval(iv); document.removeEventListener('keydown', teclas); };
}

// Volver a dibujar el inicio con las secciones nuevas
if ((history.state || 'home') === 'home') R.home();
