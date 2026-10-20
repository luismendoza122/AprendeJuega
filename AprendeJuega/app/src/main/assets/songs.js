// Canciones originales para el karaoke (letra y música hechas para esta app).
// t: letra; "|" separa sílabas dentro de una palabra. n: una nota por sílaba. d: duración en tiempos. c: acordes (4 tiempos cada uno).
const CANCIONES = [
  {titulo: 'Mi perrito Sol', e: '🐶', bpm: 112, color: '#FFB020', lineas: [
    {t: 'Ten|go un pe|rri|to que se lla|ma Sol', n: 'C4 C4 E4 G4 G4 E4 F4 F4 E4 D4 C4', d: '.5 .5 1 .5 .5 1 .5 .5 1 .5 1.5', c: 'C G'},
    {t: 'mue|ve la co|li|ta can|tan|do es|ta can|ción', n: 'D4 D4 F4 A4 A4 F4 G4 G4 F4 E4 D4 E4 C4', d: '.5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 2', c: 'F C'},
    {t: 'Guau guau guau, sal|ta a|quí', n: 'G4 G4 G4 E4 F4 G4 A4', d: '1 1 1 .5 .5 1 3', c: 'C F'},
    {t: 'guau guau guau, sal|ta a|llá', n: 'A4 A4 A4 F4 G4 A4 G4', d: '1 1 1 .5 .5 1 3', c: 'F G'},
    {t: 'mi pe|rri|to Sol es mi a|mi|go fiel', n: 'E4 E4 F4 G4 C5 B4 A4 G4 F4 D4 C4', d: '.5 .5 .5 .5 1 .5 .5 .5 .5 1 2', c: 'G C'}
  ]},
  {titulo: 'Las vocales', e: '🔤', bpm: 100, color: '#EC4899', lineas: [
    {t: 'A de a|vión que va por el cie|lo', n: 'C4 E4 G4 G4 A4 G4 E4 E4 D4 C4', d: '1 .5 .5 1 .5 .5 1 .5 .5 2', c: 'C G'},
    {t: 'E de e|le|fan|te gran|de y bue|no', n: 'D4 F4 A4 A4 G4 F4 E4 E4 D4 E4 C4', d: '.5 .5 .5 .5 .5 .5 1 .5 .5 1 2', c: 'F C'},
    {t: 'I de i|gua|na que to|ma el sol', n: 'E4 G4 C5 C5 B4 A4 G4 A4 G4 E4', d: '1 .5 .5 1 .5 .5 1 .5 .5 2', c: 'C G'},
    {t: 'O de o|so dor|mi|lón', n: 'F4 F4 A4 G4 E4 D4 C4', d: '1 1 1 1 1 1 2', c: 'F G'},
    {t: 'U de u|vas pa|ra com|par|tir', n: 'G4 G4 A4 G4 E4 D4 E4 D4 C4', d: '1 .5 .5 1 1 1 .5 .5 2', c: 'G C'}
  ]},
  {titulo: 'Los números saltan', e: '🔢', bpm: 120, color: '#2BB673', lineas: [
    {t: 'U|no, dos, tres, sal|ta|mos al re|vés', n: 'C4 D4 E4 F4 G4 G4 G4 A4 G4 E4', d: '.5 .5 .5 .5 1 .5 .5 1 .5 2.5', c: 'C G'},
    {t: 'cua|tro, cin|co, seis, a|plau|di|mos o|tra vez', n: 'D4 E4 F4 G4 A4 A4 A4 G4 F4 E4 D4 C4', d: '.5 .5 .5 .5 1 .5 .5 .5 .5 .5 .5 2', c: 'F G'},
    {t: 'sie|te, o|cho, nue|ve, ya ca|si se a|ca|bó', n: 'E4 E4 G4 G4 A4 A4 G4 F4 E4 D4 E4 D4 C4', d: '.5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 2', c: 'C G'},
    {t: '¡y con el diez gri|ta|mos to|dos: yo!', n: 'G4 G4 A4 B4 C5 C5 B4 A4 G4 C5', d: '.5 .5 .5 .5 1 .5 .5 .5 .5 3', c: 'G C'}
  ]},
  {titulo: 'El río Guatapurí', e: '🪗', bpm: 104, color: '#1E9BF0', lineas: [
    {t: 'Ba|ja el rí|o can|tan|do en|tre pie|dras', n: 'E4 E4 G4 A4 G4 E4 E4 D4 C4 D4 E4 D4', d: '.5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 2.5', c: 'C G'},
    {t: 'con mi a|cor|deón yo le can|to a mi tie|rra', n: 'D4 E4 F4 F4 A4 G4 F4 E4 D4 C4 D4 E4 C4', d: '.5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 2', c: 'F C'},
    {t: 'Gua|ta|pu|rí, a|gua cla|ri|ta', n: 'G4 A4 G4 E4 G4 A4 C5 A4 G4', d: '.5 .5 .5 1.5 .5 .5 .5 .5 3', c: 'C G'},
    {t: 'can|ta con|mi|go to|da la tar|de', n: 'A4 G4 E4 D4 C4 D4 E4 G4 D4 C4', d: '.5 .5 .5 .5 1 .5 .5 1 1 2', c: 'F C'}
  ]}
];
