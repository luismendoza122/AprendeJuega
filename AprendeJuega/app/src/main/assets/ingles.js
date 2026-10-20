// ===== Inglés para niños con Teacher Owl 🦉 =====
// Teacher Owl es un tutor que funciona sin internet: revisa lo que el niño escribe y dice,
// explica el error en español, da pistas, y recuerda qué palabras le cuestan para repasarlas.

SECCIONES.unshift({id: 'ingles', t: 'Inglés con Teacher Owl', e: '🦉', c: '#E3F8EE', d: `${INGLES.length} temas · palabras, frases y voz`});

const limpiar = () => { if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; } stopSpeak(); window.scrollTo(0, 0); };
const enTemas = () => `<button class="sec" onclick="go('ingles')">← Temas</button>`;
const todasPalabras = () => INGLES.flatMap(u => u.palabras.map(p => ({...p, u: u.id})));

// ---------- Voz en inglés ----------
function speakEn(text, lento) {
  if (hasAndroid() && Android.speakLang) { Android.speakLang(text, 'en-US', lento ? 0.6 : 0.9); return; }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = lento ? .6 : .9;
    const v = speechSynthesis.getVoices().find(x => /^en(-|_)US/i.test(x.lang)) || speechSynthesis.getVoices().find(x => /^en/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } else toast('Tu teléfono no tiene lectura en voz alta');
}
const puedeEscuchar = () => hasAndroid() && Android.canListen && Android.canListen();
function escucharEn(alOir, alFallar, idioma = 'en-US') {
  window.onVozResultado = json => { let l = []; try { l = JSON.parse(json); } catch (e) {} alOir(l); };
  window.onVozError = msg => alFallar(msg || 'No te escuché bien');
  try { Android.listen(idioma); } catch (e) { alFallar('No se pudo usar el micrófono'); }
}

// ---------- Memoria de Teacher Owl (repaso espaciado) ----------
const hoy = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
const SRS = {
  data() { return store.get('en_srs', {}); },
  key: p => p.u + ':' + p.en,
  marcar(p, bien) {
    const d = this.data(), k = this.key(p), r = d[k] || {b: 0, n: 0, ok: 0, bad: 0};
    if (bien) { r.ok++; r.b = Math.min(r.b + 1, 5); r.n = hoy() + [0, 1, 2, 4, 7, 15][r.b]; }
    else { r.bad++; r.b = 0; r.n = hoy(); }
    d[k] = r; store.set('en_srs', d);
  },
  pendientes() {
    const d = this.data();
    return todasPalabras().filter(p => { const r = d[this.key(p)]; return r && r.n <= hoy(); })
      .sort((a, b) => (d[this.key(a)].b - d[this.key(b)].b) || (d[this.key(b)].bad - d[this.key(a)].bad));
  },
  aprendidas() { const d = this.data(); return Object.values(d).filter(r => r.b >= 2).length; },
  dificiles(n) {
    const d = this.data();
    return todasPalabras().filter(p => (d[this.key(p)] || {}).bad > 0)
      .sort((a, b) => d[this.key(b)].bad - d[this.key(a)].bad).slice(0, n);
  }
};
const PROG = {
  get(u) { return (store.get('en_prog', {})[u]) || {}; },
  set(u, act, val) {
    const all = store.get('en_prog', {}); all[u] = all[u] || {};
    if (typeof val === 'number') all[u][act] = Math.max(all[u][act] || 0, val); else all[u][act] = val;
    store.set('en_prog', all);
  },
  estrellasTema(u) { const p = this.get(u); return ['escucha', 'escribe', 'habla', 'conversa', 'frases'].reduce((s, a) => s + (p[a] || 0), 0) + (p.examen >= 80 ? 3 : 0); }
};

// ---------- El cerebro de Teacher Owl ----------
const normEn = s => String(s).toLowerCase().replace(/[’'`´]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const vozNorm = s => normEn(s).split(' ').map(w => /^\d+$/.test(w) && +w <= 20 ? NUM[+w] : w).join(' ');

function lev(a, b) {
  const d = Array.from({length: a.length + 1}, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d;
}
// Lista de pasos para convertir lo escrito (a) en la palabra correcta (b)
function pasos(a, b) {
  const d = lev(a, b), out = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && d[i][j] === d[i - 1][j - 1]) { out.push({t: 'ok', a: a[i - 1], b: b[j - 1], j: j - 1}); i--; j--; }
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { out.push({t: 'sub', a: a[i - 1], b: b[j - 1], j: j - 1}); i--; j--; }
    else if (j > 0 && d[i][j] === d[i][j - 1] + 1) { out.push({t: 'falta', b: b[j - 1], j: j - 1}); j--; }
    else { out.push({t: 'sobra', a: a[i - 1], j}); i--; }
  }
  out.reverse();
  // Detectar letras cambiadas de orden (ej: "freind" → "friend")
  for (let k = 0; k < out.length - 1; k++) {
    const x = out[k], y = out[k + 1];
    if (x.t === 'sub' && y.t === 'sub' && x.a === y.b && y.a === x.b) { out.splice(k, 2, {t: 'orden', a: x.a + y.a, b: x.b + y.b, j: x.j}); }
  }
  return out;
}
const donde = (j, n) => j === 0 ? 'al principio' : j >= n - 1 ? 'al final' : 'en el medio';

const OWL = {
  bien: ['¡Excelente! 🌟', '¡Perfecto! 🎉', '¡Muy bien! 👏', '¡Lo lograste! 💪', '¡Eres un crack! 🦉', '¡Great job! 🏆', '¡Fantástico! ✨'],
  animo: ['¡Casi! Tú puedes 💪', 'Vamos otra vez, estás cerca 🦉', 'Equivocarse es parte de aprender 🌱'],
  azar(l) { return l[rand(l.length)]; },

  // Pistas de ortografía inglesa que confunden a los niños que hablan español
  pistas(escrito, palabra) {
    const t = [];
    const tiene = (p) => palabra.includes(p) && !escrito.includes(p);
    if (tiene('th')) t.push('«th» se escribe con t y h juntas: {three}, {mother}, {the}.');
    if (tiene('ee')) t.push('El sonido «i» largo muchas veces se escribe «ee»: {green}, {three}, {sheep}.');
    if (tiene('ea')) t.push('Aquí el sonido «i» se escribe «ea»: {eat}, {read}, {beach}.');
    if (tiene('oo')) t.push('«oo» suena como «u»: {book}, {school}, {foot}.');
    if (tiene('sh')) t.push('«sh» suena como cuando pides silencio: {shirt}, {fish}, {shoes}.');
    if (tiene('gh')) t.push('«gh» casi no suena, ¡pero sí se escribe!: {eight}, {night}, {light}.');
    if (tiene('wh') || (palabra.startsWith('wr') && !escrito.startsWith('wr'))) t.push('Aquí la «w» se escribe aunque no suene mucho: {write}, {white}.');
    if (tiene('ph')) t.push('«ph» suena como «f», pero se escribe con p y h: {elephant}, {phone}.');
    if (tiene('ck')) t.push('Después de una vocal corta el sonido «k» se escribe «ck»: {duck}, {black}, {jacket}.');
    if (/y/.test(palabra) && escrito.includes(palabra.replace(/y/g, 'i'))) t.push('Aquí va «y», no «i»: {yellow}, {monkey}, {happy}.');
    if (palabra.endsWith('e') && escrito === palabra.slice(0, -1)) t.push('Termina en una «e» que no suena: {five}, {nose}, {orange}.');
    if (/(.)\1/.test(palabra) && escrito === palabra.replace(/(.)\1/, '$1')) t.push('Lleva una letra doble: ' + palabra.match(/(.)\1/)[0] + ' (como en {apple}, {rabbit}, {green}).');
    return t;
  },

  // Revisa una palabra escrita. Devuelve {ok, casi, html, msgs}
  revisarEscritura(escritoOriginal, p) {
    const escrito = normEn(escritoOriginal), opciones = [p.en, ...(p.alt || [])].map(normEn);
    const html = [], msgs = [];
    if (!escrito) return {ok: false, casi: false, html: '', msgs: ['Escribe la palabra en inglés 😉']};
    if (opciones.includes(escrito)) {
      if (/^[A-Z]/.test(p.en) && escritoOriginal.trim()[0] !== p.en[0]) msgs.push(`Recuerda: «{${p.en}}» se escribe con mayúscula.`);
      return {ok: true, html: `<b style="color:var(--ok)">${esc(escritoOriginal.trim())}</b>`, msgs};
    }
    if (opciones.includes(escrito.replace(/ /g, '')) || opciones.map(o => o.replace(/ /g, '')).includes(escrito.replace(/ /g, ''))) {
      return {ok: true, html: `<b style="color:var(--ok)">${esc(p.en)}</b>`, msgs: [`Ojo con los espacios: se escribe «{${p.en}}».`]};
    }
    if (norm(escrito) === norm(p.es) || p.es.split(' o ').some(x => norm(x) === norm(escrito))) {
      return {ok: false, casi: false, html: esc(escrito), msgs: [`«${escrito}» es en español 😉. Escríbelo en inglés.`]};
    }
    const otra = todasPalabras().find(x => normEn(x.en) === escrito);
    if (otra) return {ok: false, casi: false, html: esc(escrito), msgs: [`«{${otra.en}}» es otra palabra: significa «${otra.es}» ${otra.e}. Buscamos la de ${p.e}.`]};

    const objetivo = opciones.reduce((m, o) => lev(escrito, o)[escrito.length][o.length] < lev(escrito, m)[escrito.length][m.length] ? o : m, opciones[0]);
    const ps = pasos(escrito, objetivo), errores = ps.filter(x => x.t !== 'ok');
    for (const x of ps) {
      if (x.t === 'ok') html.push(`<span style="color:var(--ok)">${esc(x.a)}</span>`);
      else if (x.t === 'falta') html.push(`<span style="color:var(--warn)">_</span>`);
      else if (x.t === 'sobra') html.push(`<span style="color:var(--bad);text-decoration:line-through">${esc(x.a)}</span>`);
      else html.push(`<span style="color:var(--bad)">${esc(x.a)}</span>`);
    }
    for (const x of errores.slice(0, 2)) {
      if (x.t === 'falta') msgs.push(x.b === ' ' ? 'Te faltó un espacio entre las dos palabras.' : `Te faltó la letra «${x.b}» ${donde(x.j, objetivo.length)}.`);
      else if (x.t === 'sobra') msgs.push(x.a === ' ' ? 'Te sobra un espacio.' : `Te sobra la letra «${x.a}».`);
      else if (x.t === 'sub') msgs.push(x.b === ' ' ? `Ahí va un espacio, no «${x.a}».` : `Escribiste «${x.a}» donde va «${x.b}» (${donde(x.j, objetivo.length)}).`);
      else if (x.t === 'orden') msgs.push(`Cambiaste el orden de «${x.a}»: mira bien esas dos letras.`);
    }
    if (errores.length > 2) msgs.push(`Hay ${errores.length} letras por arreglar.`);
    msgs.push(...this.pistas(escrito, objetivo).slice(0, 1));
    return {ok: false, casi: errores.length <= 1, html: html.join(''), msgs};
  },

  // Revisa lo que dijo el niño (lista de lo que entendió el reconocedor de voz)
  revisarVoz(oidos, objetivo) {
    const meta = vozNorm(objetivo), palabras = meta.split(' ');
    const lista = oidos.map(vozNorm).filter(Boolean);
    if (!lista.length) return {ok: false, msgs: ['No te escuché. Toca el micrófono y habla cerca del teléfono 🎤']};
    if (lista.some(o => o === meta || (palabras.length === 1 && o.split(' ').includes(meta)))) return {ok: true, oido: lista[0], msgs: []};
    // La mejor coincidencia por palabras
    let mejor = lista[0], faltan = palabras;
    for (const o of lista) {
      const ow = o.split(' '), f = palabras.filter(w => !ow.includes(w));
      if (f.length < faltan.length) { faltan = f; mejor = o; }
    }
    const msgs = [`Te escuché: «{${mejor}}»`];
    if (palabras.length > 1 && faltan.length && faltan.length < palabras.length) msgs.push(`Te faltó decir bien: «{${faltan.join(' ')}}».`);
    const d = lev(mejor, meta)[mejor.length][meta.length], sim = 1 - d / Math.max(meta.length, mejor.length);
    if (meta.includes('th') && !mejor.includes('th')) msgs.push('Para «th» pon la punta de la lengua entre los dientes y sopla suave.');
    if (/^s[^aeiou]/.test(meta) && /^(e|i)s/.test(mejor)) msgs.push(`No digas «es» al comienzo: es «{${meta.split(' ')[0]}}», directo con la s.`);
    if (meta.includes('v') && mejor.includes('b') && !meta.includes('b')) msgs.push('La «v» en inglés se hace con los dientes de arriba tocando el labio de abajo.');
    if (/^h/.test(meta) && !/^h/.test(mejor)) msgs.push('La «h» en inglés suena como una «j» suave: {hello}, {house}.');
    if (palabras.length === 1 && /[dtkgs]$/.test(meta) && mejor.length < meta.length && meta.startsWith(mejor.slice(0, -1))) msgs.push(`No olvides el sonido del final: «…${meta.slice(-2)}».`);
    return {ok: false, casi: sim >= .7 || faltan.length === 1, oido: mejor, msgs};
  },

  // Revisa una frase armada con fichas
  revisarFrase(armada, correcta) {
    const c = correcta.split(' ');
    if (armada.join(' ') === correcta) return {ok: true, msgs: []};
    let k = 0; while (k < armada.length && armada[k] === c[k]) k++;
    const msgs = [];
    if (armada.length < c.length) msgs.push(`Te faltan ${c.length - armada.length} palabra(s).`);
    else if (k === 0) msgs.push(`La frase empieza con «{${c[0]}}».`);
    else msgs.push(`Vas bien hasta «{${c.slice(0, k).join(' ')}}». Después va otra palabra.`);
    if (c.indexOf('not') > 0 || c.includes('do')) msgs.push('Para negar en inglés: {I do not like} = no me gusta.');
    return {ok: false, k, msgs};
  }
};

// Burbuja de Teacher Owl
// {palabra} en un mensaje = palabra en inglés (se ve en negrita y se lee con voz inglesa)
const marcarIngles = h => String(h).replace(/\{([^{}<>]+)\}/g, '<b>$1</b>');
function owl(html, tipo, op = {}) {
  const el = $('#owl'); if (!el) return;
  const color = tipo === 'ok' ? '#E3F8EE' : tipo === 'bad' ? '#FFF4E0' : '#F3F0FF';
  el.style.background = color;
  el.innerHTML = marcarIngles(html);
  if (!op.mudo) owlHabla(el.innerHTML, op.despues, op.lento);
}

// ---------- Teacher Owl habla en español (y dice las palabras en inglés con voz inglesa) ----------
const OWL_VOZ = {
  on() { return store.get('owl_voz', true); },
  cambiar() { store.set('owl_voz', !this.on()); return this.on(); }
};
function textoParaVoz(h) {
  return String(h).replace(/<button[\s\S]*?<\/button>/g, ' ').replace(/<br\s*\/?>/g, '. ').replace(/<[^>]+>/g, ' ')
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu, ' ').replace(/[«»“”"]/g, '')
    .replace(/_( _)*/g, ' ').replace(/=/g, ', ').replace(/\s+([.,:;!?])/g, '$1').replace(/([.!?])\.+/g, '$1').replace(/\s+/g, ' ').replace(/^[,.\s]+/, '').trim();
}
function hablarSecuencia(segs) {
  segs = segs.filter(x => x.t && /[\p{L}\d]/u.test(x.t));
  if (!segs.length) return;
  if (hasAndroid() && Android.speakSeq) { Android.speakSeq(JSON.stringify(segs)); return; }
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const voces = speechSynthesis.getVoices();
  for (const x of segs) {
    const u = new SpeechSynthesisUtterance(x.t); u.lang = x.l; u.rate = x.v;
    const v = voces.find(y => y.lang.replace('_', '-').toLowerCase() === x.l.toLowerCase()) || voces.find(y => y.lang.slice(0, 2) === x.l.slice(0, 2));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
}
function owlHabla(html, despues, lento) {
  if (!OWL_VOZ.on()) { if (despues) speakEn(despues, lento); return; }
  const segs = [];
  String(html).replace(/<button[\s\S]*?<\/button>/g, ' ').split(/(<b(?:\s[^>]*)?>[\s\S]*?<\/b>)/).forEach(parte => {
    const en = /^<b[\s>]/.test(parte), t = textoParaVoz(parte);
    if (t) segs.push({t, l: en ? 'en-US' : 'es-CO', v: en ? .85 : 1});
  });
  if (despues) segs.push({t: despues, l: 'en-US', v: lento ? .6 : .85});
  hablarSecuencia(segs);
}
const owlBox = (txt) => `<div class="owlb"><div class="owli">🦉</div><div class="owlm" id="owl">${txt}</div></div>`;

// ---------- Pantalla principal de inglés ----------
R.ingles = function () {
  const pend = SRS.pendientes().length, aprend = SRS.aprendidas();
  view.innerHTML = `
    <div class="card" style="background:linear-gradient(135deg,#E3F8EE,#fff)">
      ${owlBox(`<b>Hello! I am Teacher Owl.</b><br>Soy tu profe de inglés. Te ayudo a escuchar, escribir y hablar. Ya aprendiste <b>${aprend}</b> palabras.`)}
      <div class="row" style="margin-top:10px">
        <button onclick="enRepaso()">📝 Repaso del día${pend ? ` (${pend})` : ''}</button>
        <button class="sec" onclick="enChat()">💬 Pregúntale</button>
        <button class="sec" onclick="enProgreso()">🏅 Mi progreso</button>
        <button class="sec" id="vozowl" onclick="this.textContent = OWL_VOZ.cambiar() ? '🔊 Búho habla: Sí' : '🔇 Búho habla: No'">${OWL_VOZ.on() ? '🔊 Búho habla: Sí' : '🔇 Búho habla: No'}</button>
      </div>
    </div>
    <div class="grid">${INGLES.map(u => {
      const st = PROG.estrellasTema(u.id), ex = PROG.get(u.id).examen;
      return `<button class="tile" onclick="enTema('${u.id}')"><span class="em" style="background:${u.c}">${u.e}</span>${u.t}<small>${u.es} · ${ex >= 80 ? '🏅' : '⭐ ' + st}</small></button>`;
    }).join('')}</div>`;
  if (!window.__owlSaludo) { window.__owlSaludo = 1; owlHabla(`<b>Hello!</b> Soy Teacher Owl, tu profe de inglés. ${pend ? 'Hoy tienes ' + pend + ' palabras para repasar.' : '¿Qué quieres aprender hoy?'}`); }
};

// ---------- Conversa con Owl: te pregunta en español y respondes en inglés ----------
function en_conversa(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id), items = shuffle(u.palabras).slice(0, Math.min(6, u.palabras.length)).map(p => ({...p, u: id}));
  const voz = puedeEscuchar();
  let i = 0, ok = 0, intentos = 0;
  function pintar() {
    const p = items[i]; intentos = 0;
    const pregunta = `¿Cómo se dice «${esc(p.es)}» en inglés?`;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="pill">${i + 1} / ${items.length} · ✅ ${ok}</div>
      ${tarjeta(p, true)}<div class="big" style="font-size:24px">${pregunta}</div>
      ${voz ? `<button id="mic" class="micbtn">🎤 Responder</button>`
            : `<input id="resp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en inglés" style="text-align:center;font-size:22px;margin-top:8px"><p><button id="rev">✔ Responder</button></p>`}
      ${owlBox(pregunta)}
      <div class="row" style="justify-content:space-between;margin-top:10px"><button class="sec sm" id="rep">🔁 Repetir pregunta</button><button class="sec sm" id="saltar">Saltar ▶</button></div></div><p>${backTema(id)}</p>`;
    owlHabla(pregunta);
    $('#rep').onclick = () => owlHabla(pregunta);
    const sig = () => { i++; i < items.length ? pintar() : finActividad(id, 'conversa', ok, items.length); };
    const resultado = (bien, msgs) => {
      intentos++;
      if (bien) {
        SFX.ok(); if (intentos === 1) ok++; SRS.marcar(p, intentos === 1);
        owl(`${OWL.azar(OWL.bien)} «${esc(p.es)}» en inglés es <b>${esc(p.en)}</b>.`, 'ok');
        setTimeout(() => $('#saltar') && sig(), 3200);
      } else if (intentos >= 3) {
        SFX.bad(); SRS.marcar(p, false);
        owl(`Se dice <b>${esc(p.en)}</b>. Repítelo conmigo y la practicamos en tu repaso 📝`, 'bad', {despues: p.en, lento: true});
        setTimeout(() => $('#saltar') && sig(), 4500);
      } else { SFX.bad(); owl(`${OWL.azar(OWL.animo)}<br>${msgs.map(esc).join('<br>')}`, 'bad'); }
    };
    $('#saltar').onclick = () => { SRS.marcar(p, false); sig(); };
    if (voz) $('#mic').onclick = () => {
      stopSpeak(); const b = $('#mic'); b.disabled = true; b.textContent = '👂 Te escucho…'; b.classList.add('rec-on');
      owl('Dilo en inglés…', '', {mudo: true});
      escucharEn(oidos => {
        b.disabled = false; b.textContent = '🎤 Responder'; b.classList.remove('rec-on');
        // Si respondió en español, Owl se lo dice
        if (oidos.some(o => norm(o) === norm(p.es))) return resultado(false, [`«${p.es}» es en español 😉. ¿Cómo se dice en inglés?`]);
        const r = OWL.revisarVoz(oidos, p.en); resultado(r.ok, r.msgs);
      }, msg => { b.disabled = false; b.textContent = '🎤 Responder'; b.classList.remove('rec-on'); owl(esc(msg) + '. Intenta otra vez.', 'bad'); });
    };
    else {
      const resp = () => { const r = OWL.revisarEscritura($('#resp').value, p); resultado(r.ok, r.msgs); };
      $('#rev').onclick = resp; $('#resp').onkeydown = e => { if (e.key === 'Enter') resp(); };
    }
  }
  pintar();
}

function enTema(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id), act = u.solo || ['aprender', 'escucha', 'escribe', 'habla', 'conversa', 'frases', 'examen'];
  const p = PROG.get(id);
  const A = {
    aprender: ['📖', 'Aprende', 'Mira, escucha y repite', p.aprender ? '✔' : ''],
    escucha: ['👂', 'Escucha y elige', 'Toca el dibujo correcto', p.escucha ? '⭐'.repeat(p.escucha) : ''],
    escribe: ['✍️', 'Escribe', 'Teacher Owl te corrige', p.escribe ? '⭐'.repeat(p.escribe) : ''],
    habla: ['🎤', 'Habla', 'Di la palabra en voz alta', p.habla ? '⭐'.repeat(p.habla) : ''],
    conversa: ['🗣️', 'Conversa con Owl', 'Te pregunta en español', p.conversa ? '⭐'.repeat(p.conversa) : ''],
    frases: ['🧱', 'Arma la frase', 'Ordena las palabras', p.frases ? '⭐'.repeat(p.frases) : ''],
    examen: ['🏆', 'Examen', 'Gana tu medalla', p.examen != null ? p.examen + '%' : '']
  };
  view.innerHTML = `<div class="card"><h2>${u.e} ${u.t} <span class="muted" style="font-size:16px">· ${u.es}</span></h2>
      ${owlBox('💡 ' + esc(u.tip))}</div>
    <div class="grid">${act.map(a => `<button class="tile" onclick="en_${a}('${id}')"><span class="em" style="background:${u.c}">${A[a][0]}</span>${A[a][1]}<small>${A[a][2]}${A[a][3] ? ' · ' + A[a][3] : ''}</small></button>`).join('')}</div>
    <p>${enTemas()}</p>`;
}

const backTema = id => `<button class="sec" onclick="enTema('${id}')">← ${INGLES.find(x => x.id === id).t}</button>`;
const tarjeta = (p, grande) => `<div class="enpic" style="font-size:${/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(p.e) ? (grande ? 96 : 64) : (grande ? 64 : 40)}px">${esc(p.e)}</div>`;
const notaFinal = (ok, n) => ok / n >= .9 ? 3 : ok / n >= .7 ? 2 : ok / n >= .4 ? 1 : 0;
function finActividad(u, act, ok, n, extra) {
  const e = notaFinal(ok, n); PROG.set(u, act, e); if (e) stars(e); if (e === 3) SFX.win();
  view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:64px">${['🌱', '⭐', '🌟', '🏆'][e]}</div>
    <h2>${ok} de ${n} correctas</h2>${owlBox(e === 3 ? '¡Wow! Lo hiciste perfecto. You are amazing! 🦉' : e >= 1 ? 'Muy bien. Las que fallaste quedan en tu <b>Repaso del día</b>.' : 'Sigue practicando. Mira primero <b>Aprende</b> y vuelve a intentar.')}
    ${extra || ''}<div class="row" style="justify-content:center;margin-top:10px"><button onclick="en_${act}('${u}')">Otra vez</button>${backTema(u)}</div></div>`;
}

// ---------- 1. Aprende ----------
function en_aprender(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id); let i = 0;
  PROG.set(id, 'aprender', true);
  function pintar() {
    const p = u.palabras[i];
    view.innerHTML = `<div class="card" style="text-align:center">
      <div class="pill">${i + 1} / ${u.palabras.length}</div>
      ${tarjeta(p, true)}
      <div class="big" style="font-size:40px">${esc(p.en)}</div>
      <div class="muted" style="font-size:18px">${esc(p.es)}</div>
      <div class="row" style="justify-content:center;margin:12px 0">
        <button onclick="speakEn('${esc(p.en)}')">🔊 Escuchar</button>
        <button class="sec" onclick="speakEn('${esc(p.en)}', true)">🐢 Despacio</button>
        ${puedeEscuchar() ? `<button class="sec" id="dilo">🎤 Dilo</button>` : ''}
      </div>
      ${owlBox(i === 0 ? 'Toca 🔊 y repite en voz alta. ' + (puedeEscuchar() ? 'Con 🎤 te digo si lo dijiste bien.' : '') : 'Repite: <b>' + esc(p.en) + '</b>')}
      <div class="row" style="justify-content:space-between;margin-top:12px">
        <button class="sec" id="ant" ${i === 0 ? 'disabled' : ''}>◀ Anterior</button>
        <button id="sig">${i === u.palabras.length - 1 ? '✔ Terminé' : 'Siguiente ▶'}</button>
      </div></div><p>${backTema(id)}</p>`;
    speakEn(p.en);
    $('#ant').onclick = () => { i--; pintar(); };
    $('#sig').onclick = () => { if (i === u.palabras.length - 1) { stars(1); enTema(id); } else { i++; pintar(); } };
    const d = $('#dilo');
    if (d) d.onclick = () => practicarVoz({...p, u: id}, d, () => {});
  }
  pintar();
}

// Pronunciación con el micrófono (usada en Aprende y Habla)
function practicarVoz(p, boton, alTerminar) {
  boton.disabled = true; boton.textContent = '👂 Te escucho…'; boton.classList.add('rec-on');
  owl('Habla ahora: <b>' + esc(p.en) + '</b>', '', {mudo: true});
  escucharEn(oidos => {
    boton.disabled = false; boton.textContent = '🎤 Otra vez'; boton.classList.remove('rec-on');
    const r = OWL.revisarVoz(oidos, p.en);
    if (r.ok) { SFX.ok(); owl(`${OWL.azar(OWL.bien)} Dijiste <b>${esc(p.en)}</b> muy bien.`, 'ok'); alTerminar(true, r); }
    else { SFX.bad(); owl(`${r.casi ? '¡Casi! ' : ''}${r.msgs.map(esc).join('<br>')}<br><button class="sm" onclick="speakEn('${esc(p.en)}', true)">🐢 Escúchalo despacio</button>`, 'bad'); alTerminar(false, r); }
  }, msg => {
    boton.disabled = false; boton.textContent = '🎤 Intenta otra vez'; boton.classList.remove('rec-on');
    owl(esc(msg) + '. Habla un poco más fuerte y cerca del teléfono.', 'bad'); alTerminar(null);
  });
}

// ---------- 2. Escucha y elige ----------
function en_escucha(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id), ronda = shuffle(u.palabras).slice(0, Math.min(10, u.palabras.length));
  let i = 0, ok = 0, fallo = false;
  function pintar() {
    const p = ronda[i], ops = shuffle([p, ...shuffle(u.palabras.filter(x => x !== p)).slice(0, 3)]);
    fallo = false;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="pill">${i + 1} / ${ronda.length} · ✅ ${ok}</div>
      <h2>👂 ¿Cuál escuchaste?</h2>
      <div class="row" style="justify-content:center"><button id="oir">🔊 Escuchar</button><button class="sec" id="lento">🐢 Despacio</button></div>
      <div class="engrid">${ops.map((o, k) => `<button class="enop" data-k="${k}">${tarjeta(o)}</button>`).join('')}</div>
      ${owlBox('Escucha con atención y toca el dibujo.')}</div><p>${backTema(id)}</p>`;
    const oir = () => speakEn(p.en); oir();
    $('#oir').onclick = oir; $('#lento').onclick = () => speakEn(p.en, true);
    view.querySelectorAll('.enop').forEach(b => b.onclick = () => {
      const o = ops[+b.dataset.k];
      if (o === p) {
        b.classList.add('ok'); SFX.ok(); if (!fallo) ok++;
        SRS.marcar({...p, u: id}, !fallo);
        owl(`${OWL.azar(OWL.bien)} <b>${esc(p.en)}</b> = ${esc(p.es)}`, 'ok');
        view.querySelectorAll('.enop').forEach(x => x.disabled = true);
        setTimeout(() => { if (!$('#oir')) return; i++; i < ronda.length ? pintar() : finActividad(id, 'escucha', ok, ronda.length); }, 1300);
      } else {
        b.classList.add('bad'); b.disabled = true; SFX.bad(); fallo = true;
        owl(`Ese es <b>${esc(o.en)}</b> (${esc(o.es)}). Escucha otra vez 👂`, 'bad', {despues: p.en, lento: true});
      }
    });
  }
  pintar();
}

// ---------- 3. Escribe (Teacher Owl corrige letra por letra) ----------
function en_escribe(id, lista) {
  limpiar();
  const u = INGLES.find(x => x.id === id) || {palabras: []};
  const ronda = lista || shuffle(u.palabras).slice(0, Math.min(8, u.palabras.length)).map(p => ({...p, u: id}));
  let i = 0, ok = 0, intento = 0;
  function terminar() {
    if (!lista) return finActividad(id, 'escribe', ok, ronda.length);
    const e = notaFinal(ok, ronda.length); if (e) stars(e);
    view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:64px">📝</div><h2>Repaso: ${ok} de ${ronda.length}</h2>
      ${owlBox(SRS.pendientes().length ? 'Todavía quedan palabras para hoy. ¿Seguimos?' : '¡Terminaste el repaso de hoy! Mañana te tengo nuevas palabras 🦉')}
      <div class="row" style="justify-content:center;margin-top:10px">${SRS.pendientes().length ? '<button onclick="enRepaso()">Seguir repasando</button>' : ''}${enTemas()}</div></div>`;
  }
  function pintar() {
    const p = ronda[i]; intento = 0;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="pill">${i + 1} / ${ronda.length} · ✅ ${ok}</div>
      ${tarjeta(p, true)}<div class="muted" style="font-size:18px">${esc(p.es)}</div>
      <div class="row" style="justify-content:center;margin:8px 0"><button class="sec sm" id="oir">🔊 Escuchar</button></div>
      <input id="resp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en inglés" style="text-align:center;font-size:24px;font-weight:700">
      <div id="diff" class="diff"></div>
      <div class="row" style="justify-content:center;margin-top:10px"><button id="rev">✔ Revisar</button><button class="sec" id="pista">💡 Pista</button></div>
      ${owlBox('¿Cómo se escribe en inglés? Si no sabes, toca 🔊 o 💡.')}</div><p>${lista ? enTemas() : backTema(id)}</p>`;
    const inp = $('#resp'); inp.focus();
    $('#oir').onclick = () => speakEn(p.en);
    $('#pista').onclick = () => { const n = Math.max(1, Math.ceil(p.en.length / 3) + intento); owl(`Empieza así: <b>${esc(p.en.slice(0, n))}</b>${'_ '.repeat(Math.max(0, p.en.length - n))}`); };
    const revisar = () => {
      const r = OWL.revisarEscritura(inp.value, p);
      $('#diff').innerHTML = r.html;
      if (r.ok) {
        SFX.ok(); if (intento === 0) ok++; SRS.marcar(p, intento === 0);
        owl(`${OWL.azar(OWL.bien)} ${r.msgs.map(esc).join(' ')}`, 'ok', {despues: p.en});
        $('#rev').disabled = true; inp.disabled = true;
        setTimeout(() => { if (!$('#rev')) return; i++; i < ronda.length ? pintar() : terminar(); }, 1600);
        return;
      }
      intento++; SFX.bad();
      if (intento >= 3) {
        SRS.marcar(p, false);
        owl(`Se escribe <b>${esc(p.en)}</b>. La guardo en tu repaso para practicarla otra vez 📝`, 'bad', {despues: p.en, lento: true});
        $('#diff').innerHTML = `<b style="color:var(--ok)">${esc(p.en)}</b>`;
        $('#rev').textContent = 'Siguiente ▶'; $('#rev').onclick = () => { i++; i < ronda.length ? pintar() : terminar(); };
        return;
      }
      owl(`${r.casi ? '¡Casi! ' : OWL.azar(OWL.animo) + '<br>'}${r.msgs.map(esc).join('<br>')}`, 'bad');
    };
    $('#rev').onclick = revisar;
    inp.onkeydown = e => { if (e.key === 'Enter' && !$('#rev').disabled) $('#rev').click(); };
  }
  pintar();
}

// ---------- 4. Habla ----------
function en_habla(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id);
  const items = shuffle([...u.palabras.map(p => ({...p, u: id})), ...u.frases.slice(0, 2).map(f => ({e: '💬', en: f.en, es: f.es, u: id, frase: true}))]).slice(0, 6);
  let i = 0, ok = 0, intentos = 0;
  const voz = puedeEscuchar();
  function pintar() {
    const p = items[i]; intentos = 0;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="pill">${i + 1} / ${items.length} · ✅ ${ok}</div>
      ${tarjeta(p, !p.frase)}<div class="big" style="font-size:${p.frase ? 26 : 36}px">${esc(p.en)}</div><div class="muted">${esc(p.es)}</div>
      <div class="row" style="justify-content:center;margin:12px 0"><button class="sec" id="oir">🔊 Escuchar</button><button class="sec" id="lento">🐢 Despacio</button></div>
      ${voz ? `<button id="mic" class="micbtn">🎤 Hablar</button>` : `<div class="row" style="justify-content:center"><button id="si">👍 Lo dije bien</button></div>`}
      ${owlBox(voz ? 'Primero escucha, luego toca 🎤 y dilo en voz alta.' : 'Tu teléfono no tiene reconocimiento de voz. Escucha, repite en voz alta y toca 👍.')}
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="sec sm" id="saltar">Saltar ▶</button></div></div><p>${backTema(id)}</p>`;
    speakEn(p.en);
    $('#oir').onclick = () => speakEn(p.en); $('#lento').onclick = () => speakEn(p.en, true);
    const sig = () => { i++; i < items.length ? pintar() : finActividad(id, 'habla', ok, items.length); };
    $('#saltar').onclick = () => { if (!p.frase) SRS.marcar(p, false); sig(); };
    if (voz) $('#mic').onclick = () => practicarVoz(p, $('#mic'), bien => {
      if (bien === null) return;
      intentos++;
      if (bien) { if (intentos === 1) ok++; if (!p.frase) SRS.marcar(p, intentos === 1); setTimeout(() => $('#mic') && sig(), 1500); }
      else if (intentos >= 3) { if (!p.frase) SRS.marcar(p, false); owl('La practicamos luego en tu repaso 📝. ¡Sigamos!', 'bad'); setTimeout(() => $('#mic') && sig(), 2200); }
    });
    else $('#si').onclick = () => { ok++; SFX.ok(); sig(); };
  }
  pintar();
}

// ---------- 5. Arma la frase ----------
function en_frases(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id), ronda = shuffle(u.frases);
  let i = 0, ok = 0, fallo = false;
  function pintar() {
    const f = ronda[i], correcta = f.en.split(' '); let armada = [], fichas = shuffle(correcta.map((w, k) => ({w, k}))); fallo = false;
    view.innerHTML = `<div class="card" style="text-align:center"><div class="pill">${i + 1} / ${ronda.length} · ✅ ${ok}</div>
      <h2>🧱 Arma la frase</h2><div class="muted" style="font-size:18px">«${esc(f.es)}»</div>
      <div id="armada" class="armada"></div><div id="fichas" class="fichas"></div>
      <div class="row" style="justify-content:center;margin-top:10px"><button id="rev">✔ Revisar</button><button class="sec" id="borrar">↩ Borrar</button><button class="sec" id="oir">🔊</button></div>
      ${owlBox('Toca las palabras en orden para armar la frase en inglés.')}</div><p>${backTema(id)}</p>`;
    const dibujar = () => {
      $('#armada').innerHTML = armada.map(x => `<span class="ficha on">${esc(x.w)}</span>`).join('') || '<span class="muted">…</span>';
      $('#fichas').innerHTML = fichas.map((x, k) => `<button class="ficha" data-k="${k}" ${armada.includes(x) ? 'disabled' : ''}>${esc(x.w)}</button>`).join('');
      $('#fichas').querySelectorAll('button').forEach(b => b.onclick = () => { SFX.click(); armada.push(fichas[+b.dataset.k]); dibujar(); });
    };
    dibujar();
    $('#borrar').onclick = () => { armada.pop(); dibujar(); };
    $('#oir').onclick = () => speakEn(f.en);
    $('#rev').onclick = () => {
      const r = OWL.revisarFrase(armada.map(x => x.w), f.en);
      if (r.ok) {
        SFX.ok(); if (!fallo) ok++; owl(`${OWL.azar(OWL.bien)} «<b>${esc(f.en)}</b>» = «${esc(f.es)}»`, 'ok');
        $('#rev').disabled = true;
        setTimeout(() => { if (!$('#rev')) return; i++; i < ronda.length ? pintar() : finActividad(id, 'frases', ok, ronda.length); }, 2200);
      } else {
        fallo = true; SFX.bad(); owl(r.msgs.map(esc).join('<br>'), 'bad');
        armada = armada.slice(0, r.k || 0); dibujar();
      }
    };
  }
  pintar();
}

// ---------- 6. Examen del tema ----------
function en_examen(id) {
  limpiar();
  const u = INGLES.find(x => x.id === id), pal = shuffle(u.palabras).slice(0, 10);
  const tipos = ['oir', 'significa', 'escribe'];
  const preguntas = pal.map((p, k) => ({p, t: tipos[k % 3]}));
  let i = 0, ok = 0;
  function sig(bien) {
    SRS.marcar({...preguntas[i].p, u: id}, bien); if (bien) ok++;
    i++;
    if (i < preguntas.length) return setTimeout(pintar, 1100);
    const pct = Math.round(ok * 100 / preguntas.length); PROG.set(id, 'examen', pct);
    if (pct >= 80) { stars(5); SFX.levelup(); }
    view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:72px">${pct >= 80 ? '🏅' : '📚'}</div><h2>${pct}%</h2>
      ${owlBox(pct >= 80 ? `¡Ganaste la medalla de <b>${esc(u.t)}</b>! Congratulations! 🎉` : 'Necesitas 80% para la medalla. Repasa con <b>Aprende</b> y <b>Escribe</b>, ¡tú puedes!')}
      <div class="row" style="justify-content:center;margin-top:10px"><button onclick="en_examen('${id}')">Otra vez</button>${backTema(id)}</div></div>`;
  }
  function pintar() {
    const {p, t} = preguntas[i];
    const encab = `<div class="pill">Pregunta ${i + 1} / ${preguntas.length} · ✅ ${ok}</div>`;
    if (t === 'escribe') {
      view.innerHTML = `<div class="card" style="text-align:center">${encab}${tarjeta(p, true)}<div class="muted">${esc(p.es)}</div>
        <input id="resp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Escribe en inglés" style="text-align:center;font-size:22px;margin-top:8px">
        <div id="diff" class="diff"></div><p><button id="rev">✔ Responder</button></p>${owlBox('En el examen tienes un solo intento. ¡Concéntrate!')}</div>`;
      const inp = $('#resp'); inp.focus();
      const resp = () => {
        const r = OWL.revisarEscritura(inp.value, p); $('#diff').innerHTML = r.html; $('#rev').disabled = true; inp.disabled = true;
        r.ok ? (SFX.ok(), owl(OWL.azar(OWL.bien), 'ok')) : (SFX.bad(), owl(`Era <b>${esc(p.en)}</b>.`, 'bad'));
        sig(r.ok);
      };
      $('#rev').onclick = resp; inp.onkeydown = e => { if (e.key === 'Enter' && !$('#rev').disabled) resp(); };
      return;
    }
    const ops = shuffle([p, ...shuffle(u.palabras.filter(x => x !== p)).slice(0, 3)]);
    view.innerHTML = `<div class="card" style="text-align:center">${encab}
      ${t === 'oir' ? `<h2>👂 ¿Cuál escuchaste?</h2><button class="sec" id="oir">🔊 Escuchar</button>` : `<h2>¿Qué significa?</h2><div class="big" style="font-size:36px">${esc(p.en)}</div>`}
      <div class="${t === 'oir' ? 'engrid' : 'opts'}">${ops.map((o, k) => `<button class="${t === 'oir' ? 'enop' : ''}" data-k="${k}">${t === 'oir' ? tarjeta(o) : esc(o.es)}</button>`).join('')}</div>
      ${owlBox('Un solo intento por pregunta.')}</div>`;
    if (t === 'oir') { speakEn(p.en); $('#oir').onclick = () => speakEn(p.en); }
    view.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const bien = ops[+b.dataset.k] === p;
      view.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (ops[+x.dataset.k] === p) x.classList.add('ok'); });
      if (!bien) b.classList.add('bad');
      bien ? (SFX.ok(), owl(OWL.azar(OWL.bien), 'ok')) : (SFX.bad(), owl(`Era <b>${esc(p.en)}</b> = ${esc(p.es)}`, 'bad'));
      sig(bien);
    });
  }
  pintar();
}

// ---------- Repaso del día ----------
function enRepaso() {
  limpiar();
  let lista = SRS.pendientes();
  if (lista.length < 5) lista = [...lista, ...SRS.dificiles(10).filter(p => !lista.some(x => x.u === p.u && x.en === p.en))];
  if (!lista.length) {
    const inicio = shuffle(todasPalabras().filter(p => ['saludos', 'colores', 'animales', 'numeros'].includes(p.u))).slice(0, 6);
    view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:60px">🦉</div>
      ${owlBox('Todavía no tienes palabras para repasar. Te preparé 6 palabras fáciles para empezar.')}
      <p><button onclick="enRepasoCon()">Empezar ▶</button> ${enTemas()}</p></div>`;
    window.enRepasoCon = () => en_escribe(null, inicio);
    return;
  }
  en_escribe(null, shuffle(lista.slice(0, 8)));
}

// ---------- Pregúntale a Teacher Owl ----------
function enChat() {
  limpiar();
  const hist = [];
  view.innerHTML = `<div class="card"><h2>💬 Pregúntale a Teacher Owl</h2>
    <div id="chat" class="chatbox"></div>
    <div class="row" style="flex-wrap:nowrap;margin-top:8px">${puedeEscuchar() ? '<button class="sec" id="pmic" aria-label="Preguntar hablando">🎤</button>' : ''}<input id="pq" placeholder="Ej: ¿cómo se dice perro?" autocomplete="off"><button id="env">Enviar</button></div>
    <div class="row" style="margin-top:8px">${['¿Cómo se dice gato?', '¿Qué significa yellow?', 'Deletrea elephant', 'Dime una frase', '¿Qué palabras me cuestan?'].map(s => `<button class="sec sm sug">${s}</button>`).join('')}</div>
    </div><p>${enTemas()}</p>`;
  const caja = $('#chat');
  const decir = (quien, html) => { caja.insertAdjacentHTML('beforeend', `<div class="msg ${quien}">${quien === 'owl' ? '🦉 ' : ''}${html}</div>`); caja.scrollTop = caja.scrollHeight; };
  const saludo = `<b>Hello!</b> Pregúntame cómo se dice una palabra en inglés, qué significa, o pídeme que deletree.${puedeEscuchar() ? ' También me puedes preguntar hablando: toca el micrófono 🎤.' : ''}`;
  decir('owl', saludo); owlHabla(saludo);
  const responder = q => {
    decir('yo', esc(q));
    const r = OWL_CHAT(q);
    setTimeout(() => { decir('owl', r.html); if (OWL_VOZ.on()) owlHabla(r.html); else if (r.voz) speakEn(r.voz); }, 350);
  };
  $('#env').onclick = () => { const q = $('#pq').value.trim(); if (q) { $('#pq').value = ''; responder(q); } };
  $('#pq').onkeydown = e => { if (e.key === 'Enter') $('#env').click(); };
  view.querySelectorAll('.sug').forEach(b => b.onclick = () => responder(b.textContent));
  const mic = $('#pmic');
  if (mic) mic.onclick = () => {
    stopSpeak(); mic.disabled = true; mic.textContent = '👂'; mic.classList.add('rec-on');
    const listo = () => { mic.disabled = false; mic.textContent = '🎤'; mic.classList.remove('rec-on'); };
    escucharEn(oidos => { listo(); if (oidos[0]) responder(oidos[0]); else decir('owl', 'No te escuché. Toca 🎤 y habla cerca del teléfono.'); },
      msg => { listo(); decir('owl', esc(msg) + '. Puedes escribir tu pregunta.'); }, 'es-CO');
  };
}

function OWL_CHAT(q) {
  const t = norm(q).replace(/[¿?¡!.,]/g, ' ').replace(/\s+/g, ' ').trim();
  const todas = todasPalabras().filter(p => p.u !== 'abc');
  const fichaHtml = p => `<b>${esc(p.en)}</b> ${esc(p.e)} = ${esc(p.es)} <button class="sm sec" onclick="speakEn('${esc(p.en)}')">🔊</button>`;
  const cercana = (w, campo) => {
    let mejor = null, dmin = 99;
    for (const p of todas) for (const v of String(p[campo]).split(' o ')) { const a = norm(v), d = lev(w, a)[w.length][a.length]; if (d < dmin) { dmin = d; mejor = p; } }
    return dmin <= Math.max(1, Math.floor(w.length / 4)) ? mejor : null;
  };
  let m;
  if (/(me cuestan|dificiles|errores|fallo)/.test(t)) {
    const d = SRS.dificiles(6);
    return {html: d.length ? 'Estas son las que más te cuestan:<br>' + d.map(fichaHtml).join('<br>') + '<br>Practícalas en <b>Repaso del día</b> 📝' : '¡Todavía no tienes palabras difíciles! Sigue practicando 🌟'};
  }
  if (/(frase|oracion)/.test(t)) {
    const u = shuffle(INGLES.filter(x => x.frases.length))[0], f = shuffle(u.frases)[0];
    return {html: `«<b>${esc(f.en)}</b>» = «${esc(f.es)}» <button class="sm sec" onclick="speakEn('${esc(f.en)}')">🔊</button>`, voz: f.en};
  }
  if ((m = t.match(/deletrea (.+)/))) {
    const w = m[1].trim();
    return {html: `${esc(w)}: <b>${esc(w.toUpperCase().split('').join(' - '))}</b>`, voz: w.toUpperCase().split('').join(', ')};
  }
  if ((m = t.match(/(?:como se dice|como digo|como se escribe) (?:en ingles )?(.+?)(?: en ingles)?$/)) || (m = t.match(/^(.+) en ingles$/))) {
    const w = m[1].replace(/^(el|la|los|las|un|una) /, '').trim();
    const p = todas.find(x => x.es.split(' o ').some(s => norm(s) === w)) || cercana(w, 'es');
    return p ? {html: `«${esc(w)}» en inglés es ${fichaHtml(p)}`, voz: p.en} : {html: `Todavía no conozco «${esc(w)}». Prueba con animales, colores, comida, ropa… 📚`};
  }
  if ((m = t.match(/(?:que significa|que es|que quiere decir) (.+)$/))) {
    const w = m[1].trim();
    const p = todas.find(x => [x.en, ...(x.alt || [])].some(s => normEn(s) === w)) || cercana(w, 'en');
    return p ? {html: `${fichaHtml(p)}`, voz: p.en} : {html: `No encontré «${esc(w)}» en mis temas. ¿Lo escribiste bien?`};
  }
  // Una sola palabra: buscar en los dos idiomas
  const pe = todas.find(x => [x.en, ...(x.alt || [])].some(s => normEn(s) === t));
  if (pe) return {html: fichaHtml(pe), voz: pe.en};
  const ps = todas.find(x => x.es.split(' o ').some(s => norm(s) === t));
  if (ps) return {html: `«${esc(t)}» en inglés es ${fichaHtml(ps)}`, voz: ps.en};
  if (/^(hola|hello|hi)\b/.test(t)) return {html: 'Hello! 👋 ¿Qué palabra quieres aprender hoy?', voz: 'Hello!'};
  if (/(gracias|thank)/.test(t)) return {html: 'You are welcome! = ¡De nada! 🦉', voz: 'You are welcome!'};
  const c = cercana(t, 'es') || cercana(t, 'en');
  if (c) return {html: `¿Quisiste decir esta? ${fichaHtml(c)}`, voz: c.en};
  return {html: 'Puedo ayudarte con: «¿cómo se dice ___?», «¿qué significa ___?», «deletrea ___», «dime una frase» o «¿qué palabras me cuestan?».'};
}

// ---------- Progreso ----------
function enProgreso() {
  limpiar();
  const d = SRS.data(), total = todasPalabras().length, aprend = SRS.aprendidas();
  const medallas = INGLES.filter(u => PROG.get(u.id).examen >= 80);
  const nivel = aprend >= 150 ? ['🦅', 'Experto'] : aprend >= 80 ? ['🦉', 'Avanzado'] : aprend >= 30 ? ['🐥', 'Explorador'] : ['🥚', 'Principiante'];
  view.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:64px">${nivel[0]}</div><h2>Nivel: ${nivel[1]}</h2>
    <div class="bar"><i style="width:${Math.round(aprend * 100 / total)}%;background:var(--ok)"></i></div>
    <p class="muted">${aprend} de ${total} palabras aprendidas · ${Object.keys(d).length} practicadas · ${medallas.length} medallas</p></div>
    <div class="card"><h3>🏅 Medallas</h3><div style="font-size:30px">${medallas.map(u => u.e).join(' ') || '<span class="muted" style="font-size:15px">Gana medallas pasando el examen de cada tema con 80% o más.</span>'}</div></div>
    <div class="card"><h3>Temas</h3>${INGLES.map(u => { const p = PROG.get(u.id); return `<div class="lib"><span>${u.e} ${u.t}</span><span class="muted">${p.examen != null ? 'Examen ' + p.examen + '%' : (p.aprender ? 'En curso' : 'Sin empezar')} · ⭐ ${PROG.estrellasTema(u.id)}</span></div>`; }).join('')}</div>
    <p>${enTemas()}</p>`;
}
