// ===== Paquete de inglés para niños =====
// Cada tema: palabras {e: dibujo, en: inglés, es: español, alt: otras respuestas válidas}
// y frases {en, es} para armar y pronunciar. "tip" es el consejo de Teacher Owl.
const INGLES = [
  {id: 'abc', t: 'The alphabet', es: 'El abecedario', e: '🔤', c: '#E9E1FF', solo: ['aprender', 'escucha'],
    tip: 'Las vocales en inglés se dicen distinto: A (ei), E (i), I (ai), O (ou), U (iu).',
    palabras: 'A:ei B:bi C:si D:di E:i F:ef G:yi H:eich I:ai J:yei K:kei L:el M:em N:en O:ou P:pi Q:kiu R:ar S:es T:ti U:iu V:vi W:dábliu X:ex Y:uai Z:zi'
      .split(' ').map(p => { const [l, s] = p.split(':'); return {e: l, en: l, es: 'se dice “' + s + '”'}; }),
    frases: []},

  {id: 'saludos', t: 'Greetings', es: 'Saludos', e: '👋', c: '#FFE3D8',
    tip: 'Good morning se usa hasta el mediodía, good afternoon por la tarde y good night para despedirte en la noche.',
    palabras: [
      {e: '🙋', en: 'hello', es: 'hola', alt: ['hi']},
      {e: '👋', en: 'goodbye', es: 'adiós', alt: ['bye', 'good bye']},
      {e: '🌅', en: 'good morning', es: 'buenos días'},
      {e: '🌇', en: 'good afternoon', es: 'buenas tardes'},
      {e: '🌙', en: 'good night', es: 'buenas noches'},
      {e: '🙏', en: 'please', es: 'por favor'},
      {e: '💐', en: 'thank you', es: 'gracias', alt: ['thanks']},
      {e: '😔', en: 'sorry', es: 'lo siento'},
      {e: '✅', en: 'yes', es: 'sí'},
      {e: '❌', en: 'no', es: 'no'}
    ],
    frases: [
      {en: 'My name is Ana', es: 'Mi nombre es Ana'},
      {en: 'How are you', es: '¿Cómo estás?'},
      {en: 'I am fine thank you', es: 'Estoy bien, gracias'},
      {en: 'Good morning teacher', es: 'Buenos días, profesora'}
    ]},

  {id: 'colores', t: 'Colors', es: 'Colores', e: '🎨', c: '#FFF1CC',
    tip: 'En inglés el color va ANTES de la cosa: a red car = un carro rojo.',
    palabras: [
      {e: '🔴', en: 'red', es: 'rojo'},
      {e: '🔵', en: 'blue', es: 'azul'},
      {e: '🟡', en: 'yellow', es: 'amarillo'},
      {e: '🟢', en: 'green', es: 'verde'},
      {e: '🟠', en: 'orange', es: 'naranja'},
      {e: '🟣', en: 'purple', es: 'morado'},
      {e: '🩷', en: 'pink', es: 'rosado'},
      {e: '🟤', en: 'brown', es: 'café'},
      {e: '⚫', en: 'black', es: 'negro'},
      {e: '⚪', en: 'white', es: 'blanco'},
      {e: '🩶', en: 'gray', es: 'gris', alt: ['grey']}
    ],
    frases: [
      {en: 'The sky is blue', es: 'El cielo es azul'},
      {en: 'I like red', es: 'Me gusta el rojo'},
      {en: 'The banana is yellow', es: 'El banano es amarillo'},
      {en: 'I have a green ball', es: 'Tengo una pelota verde'}
    ]},

  {id: 'numeros', t: 'Numbers', es: 'Números', e: '🔢', c: '#DDF5E8',
    tip: 'Del 13 al 19 terminan en -teen: thirteen, fourteen, fifteen… ¡y 20 es twenty!',
    palabras: [
      {e: '1', en: 'one', es: 'uno'}, {e: '2', en: 'two', es: 'dos'}, {e: '3', en: 'three', es: 'tres'},
      {e: '4', en: 'four', es: 'cuatro'}, {e: '5', en: 'five', es: 'cinco'}, {e: '6', en: 'six', es: 'seis'},
      {e: '7', en: 'seven', es: 'siete'}, {e: '8', en: 'eight', es: 'ocho'}, {e: '9', en: 'nine', es: 'nueve'},
      {e: '10', en: 'ten', es: 'diez'}, {e: '11', en: 'eleven', es: 'once'}, {e: '12', en: 'twelve', es: 'doce'},
      {e: '13', en: 'thirteen', es: 'trece'}, {e: '14', en: 'fourteen', es: 'catorce'}, {e: '15', en: 'fifteen', es: 'quince'},
      {e: '16', en: 'sixteen', es: 'dieciséis'}, {e: '17', en: 'seventeen', es: 'diecisiete'}, {e: '18', en: 'eighteen', es: 'dieciocho'},
      {e: '19', en: 'nineteen', es: 'diecinueve'}, {e: '20', en: 'twenty', es: 'veinte'}
    ],
    frases: [
      {en: 'I have two dogs', es: 'Tengo dos perros'},
      {en: 'I am eight years old', es: 'Tengo ocho años'},
      {en: 'I can see five birds', es: 'Puedo ver cinco pájaros'}
    ]},

  {id: 'animales', t: 'Animals', es: 'Animales', e: '🐶', c: '#DCEFFF',
    tip: 'Para decir más de uno se agrega -s: one cat, two cats. ¡Ojo! fish no cambia: one fish, two fish.',
    palabras: [
      {e: '🐶', en: 'dog', es: 'perro'}, {e: '🐱', en: 'cat', es: 'gato'}, {e: '🐦', en: 'bird', es: 'pájaro'},
      {e: '🐟', en: 'fish', es: 'pez'}, {e: '🐴', en: 'horse', es: 'caballo'}, {e: '🐮', en: 'cow', es: 'vaca'},
      {e: '🐷', en: 'pig', es: 'cerdo'}, {e: '🦆', en: 'duck', es: 'pato'}, {e: '🐰', en: 'rabbit', es: 'conejo'},
      {e: '🦁', en: 'lion', es: 'león'}, {e: '🐘', en: 'elephant', es: 'elefante'}, {e: '🐵', en: 'monkey', es: 'mono'},
      {e: '🐸', en: 'frog', es: 'rana'}, {e: '🐻', en: 'bear', es: 'oso'}
    ],
    frases: [
      {en: 'The cat is small', es: 'El gato es pequeño'},
      {en: 'I have a dog', es: 'Tengo un perro'},
      {en: 'The lion is big', es: 'El león es grande'},
      {en: 'Fish can swim', es: 'Los peces pueden nadar'}
    ]},

  {id: 'familia', t: 'Family', es: 'La familia', e: '👨‍👩‍👧', c: '#FFDDEE',
    tip: 'my = mi y your = tu: my mother (mi mamá), your father (tu papá).',
    palabras: [
      {e: '👩', en: 'mother', es: 'mamá', alt: ['mom', 'mum']},
      {e: '👨', en: 'father', es: 'papá', alt: ['dad']},
      {e: '👧', en: 'sister', es: 'hermana'},
      {e: '👦', en: 'brother', es: 'hermano'},
      {e: '👵', en: 'grandmother', es: 'abuela', alt: ['grandma']},
      {e: '👴', en: 'grandfather', es: 'abuelo', alt: ['grandpa']},
      {e: '👶', en: 'baby', es: 'bebé'},
      {e: '👩‍🦱', en: 'aunt', es: 'tía'},
      {e: '👨‍🦱', en: 'uncle', es: 'tío'},
      {e: '🧒', en: 'cousin', es: 'primo o prima'},
      {e: '👨‍👩‍👧‍👦', en: 'family', es: 'familia'}
    ],
    frases: [
      {en: 'This is my mother', es: 'Esta es mi mamá'},
      {en: 'I love my family', es: 'Amo a mi familia'},
      {en: 'My brother is tall', es: 'Mi hermano es alto'}
    ]},

  {id: 'cuerpo', t: 'My body', es: 'El cuerpo', e: '🧍', c: '#FFE3D8',
    tip: 'Algunas palabras cambian en plural: one foot → two feet, one tooth → many teeth.',
    palabras: [
      {e: '🙂', en: 'face', es: 'cara'}, {e: '👀', en: 'eyes', es: 'ojos'}, {e: '👂', en: 'ear', es: 'oreja'},
      {e: '👃', en: 'nose', es: 'nariz'}, {e: '👄', en: 'mouth', es: 'boca'}, {e: '🦷', en: 'teeth', es: 'dientes'},
      {e: '✋', en: 'hand', es: 'mano'}, {e: '🦶', en: 'foot', es: 'pie'}, {e: '🦵', en: 'leg', es: 'pierna'},
      {e: '💪', en: 'arm', es: 'brazo'}, {e: '💇', en: 'hair', es: 'pelo', alt: []}
    ],
    frases: [
      {en: 'I have two eyes', es: 'Tengo dos ojos'},
      {en: 'Wash your hands', es: 'Lávate las manos'},
      {en: 'Touch your nose', es: 'Tócate la nariz'}
    ]},

  {id: 'comida', t: 'Food', es: 'Comida', e: '🍎', c: '#DDF5E8',
    tip: 'I like = me gusta. I don’t like = no me gusta. I like apples, I don’t like onions.',
    palabras: [
      {e: '🍎', en: 'apple', es: 'manzana'}, {e: '🍌', en: 'banana', es: 'banano'}, {e: '🍊', en: 'orange', es: 'naranja'},
      {e: '🍇', en: 'grapes', es: 'uvas'}, {e: '🍓', en: 'strawberry', es: 'fresa'}, {e: '🍞', en: 'bread', es: 'pan'},
      {e: '🥛', en: 'milk', es: 'leche'}, {e: '💧', en: 'water', es: 'agua'}, {e: '🥚', en: 'egg', es: 'huevo'},
      {e: '🍚', en: 'rice', es: 'arroz'}, {e: '🧀', en: 'cheese', es: 'queso'}, {e: '🍗', en: 'chicken', es: 'pollo'},
      {e: '🧃', en: 'juice', es: 'jugo'}, {e: '🍦', en: 'ice cream', es: 'helado'}
    ],
    frases: [
      {en: 'I like apples', es: 'Me gustan las manzanas'},
      {en: 'I drink milk', es: 'Yo tomo leche'},
      {en: 'Can I have water please', es: '¿Me das agua, por favor?'},
      {en: 'I do not like cheese', es: 'No me gusta el queso'}
    ]},

  {id: 'ropa', t: 'Clothes', es: 'La ropa', e: '👕', c: '#DCEFFF',
    tip: 'pants (pantalón) y glasses (gafas) siempre van en plural: my pants are blue.',
    palabras: [
      {e: '👕', en: 'shirt', es: 'camisa', alt: ['t-shirt', 'tshirt']},
      {e: '👖', en: 'pants', es: 'pantalón', alt: ['jeans', 'trousers']},
      {e: '👗', en: 'dress', es: 'vestido'}, {e: '👟', en: 'shoes', es: 'zapatos', alt: ['sneakers']},
      {e: '🧢', en: 'cap', es: 'gorra'}, {e: '🧦', en: 'socks', es: 'medias'}, {e: '🧥', en: 'jacket', es: 'chaqueta', alt: ['coat']},
      {e: '🧣', en: 'scarf', es: 'bufanda'}, {e: '🧤', en: 'gloves', es: 'guantes'}, {e: '👓', en: 'glasses', es: 'gafas'}
    ],
    frases: [
      {en: 'I wear a red shirt', es: 'Uso una camisa roja'},
      {en: 'My shoes are new', es: 'Mis zapatos son nuevos'},
      {en: 'Put on your jacket', es: 'Ponte tu chaqueta'}
    ]},

  {id: 'escuela', t: 'School', es: 'La escuela', e: '🎒', c: '#FFF1CC',
    tip: 'this = esto (cerca) y that = eso (lejos): this is my book, that is your pencil.',
    palabras: [
      {e: '📕', en: 'book', es: 'libro'}, {e: '✏️', en: 'pencil', es: 'lápiz'}, {e: '🖊️', en: 'pen', es: 'lapicero'},
      {e: '📏', en: 'ruler', es: 'regla'}, {e: '✂️', en: 'scissors', es: 'tijeras'}, {e: '🎒', en: 'backpack', es: 'maleta', alt: ['bag', 'schoolbag']},
      {e: '📓', en: 'notebook', es: 'cuaderno'}, {e: '🖍️', en: 'crayon', es: 'crayola'}, {e: '🧑‍🏫', en: 'teacher', es: 'profesor'},
      {e: '🧑‍🎓', en: 'student', es: 'estudiante'}, {e: '🪑', en: 'chair', es: 'silla'}, {e: '💻', en: 'computer', es: 'computador'}
    ],
    frases: [
      {en: 'This is my book', es: 'Este es mi libro'},
      {en: 'I have a pencil', es: 'Tengo un lápiz'},
      {en: 'Open your notebook', es: 'Abre tu cuaderno'}
    ]},

  {id: 'casa', t: 'My house', es: 'La casa', e: '🏠', c: '#E9E1FF',
    tip: 'in = en o dentro de: in the kitchen (en la cocina), in my bed (en mi cama).',
    palabras: [
      {e: '🏠', en: 'house', es: 'casa', alt: ['home']}, {e: '🚪', en: 'door', es: 'puerta'}, {e: '🪟', en: 'window', es: 'ventana'},
      {e: '🛏️', en: 'bed', es: 'cama'}, {e: '🍳', en: 'kitchen', es: 'cocina'}, {e: '🛁', en: 'bathroom', es: 'baño'},
      {e: '🛋️', en: 'sofa', es: 'sofá', alt: ['couch']}, {e: '💡', en: 'light', es: 'luz', alt: ['lamp']}, {e: '🔑', en: 'key', es: 'llave'},
      {e: '⏰', en: 'clock', es: 'reloj'}, {e: '📺', en: 'television', es: 'televisor', alt: ['tv']}
    ],
    frases: [
      {en: 'Close the door', es: 'Cierra la puerta'},
      {en: 'I sleep in my bed', es: 'Duermo en mi cama'},
      {en: 'My house is big', es: 'Mi casa es grande'}
    ]},

  {id: 'dias', t: 'Days and months', es: 'Días y meses', e: '📅', c: '#FFDDEE',
    tip: 'Los días y los meses en inglés se escriben con MAYÚSCULA: Monday, May.',
    palabras: [
      {e: 'LUN', en: 'Monday', es: 'lunes'}, {e: 'MAR', en: 'Tuesday', es: 'martes'}, {e: 'MIÉ', en: 'Wednesday', es: 'miércoles'},
      {e: 'JUE', en: 'Thursday', es: 'jueves'}, {e: 'VIE', en: 'Friday', es: 'viernes'}, {e: 'SÁB', en: 'Saturday', es: 'sábado'},
      {e: 'DOM', en: 'Sunday', es: 'domingo'},
      {e: 'ENE', en: 'January', es: 'enero'}, {e: 'FEB', en: 'February', es: 'febrero'}, {e: 'MAR·', en: 'March', es: 'marzo'},
      {e: 'ABR', en: 'April', es: 'abril'}, {e: 'MAY', en: 'May', es: 'mayo'}, {e: 'JUN', en: 'June', es: 'junio'},
      {e: 'JUL', en: 'July', es: 'julio'}, {e: 'AGO', en: 'August', es: 'agosto'}, {e: 'SEP', en: 'September', es: 'septiembre'},
      {e: 'OCT', en: 'October', es: 'octubre'}, {e: 'NOV', en: 'November', es: 'noviembre'}, {e: 'DIC', en: 'December', es: 'diciembre'}
    ],
    frases: [
      {en: 'Today is Monday', es: 'Hoy es lunes'},
      {en: 'My birthday is in May', es: 'Mi cumpleaños es en mayo'},
      {en: 'I go to school on Friday', es: 'Voy a la escuela el viernes'}
    ]},

  {id: 'clima', t: 'Weather', es: 'El clima', e: '🌦️', c: '#DCEFFF',
    tip: 'Para hablar del clima usamos It is: It is sunny (está soleado), It is cold (hace frío).',
    palabras: [
      {e: '☀️', en: 'sun', es: 'sol'}, {e: '🌧️', en: 'rain', es: 'lluvia'}, {e: '☁️', en: 'cloud', es: 'nube'},
      {e: '🌬️', en: 'wind', es: 'viento'}, {e: '❄️', en: 'snow', es: 'nieve'}, {e: '🌈', en: 'rainbow', es: 'arcoíris'},
      {e: '⛈️', en: 'storm', es: 'tormenta'}, {e: '🥵', en: 'hot', es: 'caliente'}, {e: '🥶', en: 'cold', es: 'frío'}
    ],
    frases: [
      {en: 'It is sunny', es: 'Está soleado'},
      {en: 'It is raining', es: 'Está lloviendo'},
      {en: 'It is cold today', es: 'Hoy hace frío'}
    ]},

  {id: 'acciones', t: 'Actions', es: 'Acciones', e: '🏃', c: '#DDF5E8',
    tip: 'I can = yo puedo: I can swim (yo puedo nadar). Para negar: I can’t.',
    palabras: [
      {e: '🏃', en: 'run', es: 'correr'}, {e: '🦘', en: 'jump', es: 'saltar'}, {e: '🏊', en: 'swim', es: 'nadar'},
      {e: '🍽️', en: 'eat', es: 'comer'}, {e: '🥤', en: 'drink', es: 'beber'}, {e: '😴', en: 'sleep', es: 'dormir'},
      {e: '📖', en: 'read', es: 'leer'}, {e: '✍️', en: 'write', es: 'escribir'}, {e: '🎤', en: 'sing', es: 'cantar'},
      {e: '💃', en: 'dance', es: 'bailar'}, {e: '⚽', en: 'play', es: 'jugar'}, {e: '🚶', en: 'walk', es: 'caminar'}
    ],
    frases: [
      {en: 'I can swim', es: 'Yo puedo nadar'},
      {en: 'We play together', es: 'Jugamos juntos'},
      {en: 'She likes to dance', es: 'A ella le gusta bailar'}
    ]},

  {id: 'sentimientos', t: 'Feelings', es: 'Sentimientos', e: '😀', c: '#FFF1CC',
    tip: 'I am = yo estoy o yo soy: I am happy (estoy feliz). Para preguntar: Are you happy?',
    palabras: [
      {e: '😀', en: 'happy', es: 'feliz'}, {e: '😢', en: 'sad', es: 'triste'}, {e: '😠', en: 'angry', es: 'enojado'},
      {e: '😨', en: 'scared', es: 'asustado', alt: ['afraid']}, {e: '😫', en: 'tired', es: 'cansado'}, {e: '😮', en: 'surprised', es: 'sorprendido'},
      {e: '🤤', en: 'hungry', es: 'con hambre'}, {e: '😪', en: 'sleepy', es: 'con sueño'}, {e: '🤒', en: 'sick', es: 'enfermo'},
      {e: '🤩', en: 'excited', es: 'emocionado'}
    ],
    frases: [
      {en: 'I am happy', es: 'Estoy feliz'},
      {en: 'Are you sad', es: '¿Estás triste?'},
      {en: 'I am hungry', es: 'Tengo hambre'}
    ]},

  {id: 'opuestos', t: 'Opposites', es: 'Opuestos', e: '↔️', c: '#E9E1FF',
    tip: 'Los opuestos se aprenden en pareja: big ↔ small, fast ↔ slow, open ↔ closed.',
    palabras: [
      {e: '🐘', en: 'big', es: 'grande'}, {e: '🐭', en: 'small', es: 'pequeño', alt: ['little']},
      {e: '🐆', en: 'fast', es: 'rápido'}, {e: '🐢', en: 'slow', es: 'lento'},
      {e: '🦒', en: 'tall', es: 'alto'}, {e: '🐁', en: 'short', es: 'bajo'},
      {e: '👴', en: 'old', es: 'viejo'}, {e: '👶', en: 'young', es: 'joven'},
      {e: '📂', en: 'open', es: 'abierto'}, {e: '📁', en: 'closed', es: 'cerrado'},
      {e: '🌞', en: 'day', es: 'día'}, {e: '🌜', en: 'night', es: 'noche'}
    ],
    frases: [
      {en: 'The elephant is big', es: 'El elefante es grande'},
      {en: 'The turtle is slow', es: 'La tortuga es lenta'},
      {en: 'The giraffe is tall', es: 'La jirafa es alta'}
    ]},

  {id: 'lugares', t: 'Places', es: 'Lugares', e: '🏙️', c: '#FFDDEE',
    tip: 'go to the… = ir a la/al…: I go to the park (voy al parque).',
    palabras: [
      {e: '🏫', en: 'school', es: 'escuela', alt: ['colegio']}, {e: '🏞️', en: 'park', es: 'parque'}, {e: '🏥', en: 'hospital', es: 'hospital'},
      {e: '🏪', en: 'store', es: 'tienda', alt: ['shop']}, {e: '⛪', en: 'church', es: 'iglesia'}, {e: '🏦', en: 'bank', es: 'banco'},
      {e: '📚', en: 'library', es: 'biblioteca'}, {e: '🏖️', en: 'beach', es: 'playa'}, {e: '🚜', en: 'farm', es: 'granja'},
      {e: '🦓', en: 'zoo', es: 'zoológico'}
    ],
    frases: [
      {en: 'I go to the park', es: 'Voy al parque'},
      {en: 'The library has many books', es: 'La biblioteca tiene muchos libros'},
      {en: 'We play at the beach', es: 'Jugamos en la playa'}
    ]},

  {id: 'transporte', t: 'Transport', es: 'Transporte', e: '🚌', c: '#DCEFFF',
    tip: 'by = en (para transporte): by bus, by car. ¡Pero a pie se dice on foot!',
    palabras: [
      {e: '🚗', en: 'car', es: 'carro'}, {e: '🚌', en: 'bus', es: 'bus'}, {e: '🚲', en: 'bike', es: 'bicicleta', alt: ['bicycle']},
      {e: '🚆', en: 'train', es: 'tren'}, {e: '✈️', en: 'plane', es: 'avión', alt: ['airplane']}, {e: '⛵', en: 'boat', es: 'barco', alt: ['ship']},
      {e: '🏍️', en: 'motorcycle', es: 'moto', alt: ['motorbike']}, {e: '🚚', en: 'truck', es: 'camión'}, {e: '🚕', en: 'taxi', es: 'taxi'},
      {e: '🚁', en: 'helicopter', es: 'helicóptero'}
    ],
    frases: [
      {en: 'I go to school by bus', es: 'Voy a la escuela en bus'},
      {en: 'The plane is fast', es: 'El avión es rápido'},
      {en: 'I ride my bike', es: 'Monto mi bicicleta'}
    ]}
];
