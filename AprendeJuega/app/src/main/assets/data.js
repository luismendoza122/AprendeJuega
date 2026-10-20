// Contenido de Aprende y Juega (todo funciona sin internet)

const CIUDADES = [
  ["Bogotá","Colombia","🇨🇴","América","7,9 millones","Está a unos 2.600 metros sobre el nivel del mar, por eso hace fresco todo el año."],
  ["Medellín","Colombia","🇨🇴","América","2,6 millones","La llaman la ciudad de la eterna primavera y tiene metro desde 1995."],
  ["Cali","Colombia","🇨🇴","América","2,3 millones","Es famosa en el mundo como la capital de la salsa."],
  ["Barranquilla","Colombia","🇨🇴","América","1,3 millones","Su Carnaval fue declarado Patrimonio de la Humanidad por la UNESCO."],
  ["Cartagena","Colombia","🇨🇴","América","1 millón","Está rodeada de murallas de piedra construidas hace siglos para protegerla de piratas."],
  ["Valledupar","Colombia","🇨🇴","América","550 mil","Cada año celebra el Festival de la Leyenda Vallenata y la cruza el río Guatapurí."],
  ["Santa Marta","Colombia","🇨🇴","América","550 mil","Fundada en 1525, es una de las ciudades más antiguas de Sudamérica."],
  ["Bucaramanga","Colombia","🇨🇴","América","600 mil","Le dicen la ciudad de los parques porque tiene muchísimos."],
  ["Leticia","Colombia","🇨🇴","América","50 mil","Está en plena selva amazónica, donde se juntan Colombia, Brasil y Perú."],
  ["Ciudad de México","México","🇲🇽","América","9,2 millones","Fue construida sobre Tenochtitlan, la antigua capital de los mexicas, que estaba sobre un lago."],
  ["Lima","Perú","🇵🇪","América","10 millones","Fue fundada en 1535 y casi nunca llueve allí."],
  ["Quito","Ecuador","🇪🇨","América","2,8 millones","Su centro histórico fue de los primeros lugares del mundo en ser Patrimonio de la Humanidad."],
  ["La Paz","Bolivia","🇧🇴","América","800 mil","Es la sede de gobierno más alta del mundo, a unos 3.600 metros de altura."],
  ["Santiago","Chile","🇨🇱","América","6 millones","Desde sus calles se ven las montañas nevadas de la cordillera de los Andes."],
  ["Buenos Aires","Argentina","🇦🇷","América","3 millones","Su avenida 9 de Julio es una de las más anchas del mundo."],
  ["Montevideo","Uruguay","🇺🇾","América","1,3 millones","Tiene una rambla de más de 20 kilómetros junto al río de la Plata."],
  ["Río de Janeiro","Brasil","🇧🇷","América","6,2 millones","Sobre un cerro está el Cristo Redentor, una de las nuevas maravillas del mundo."],
  ["Caracas","Venezuela","🇻🇪","América","2 millones","Está al pie de la montaña El Ávila, también llamada Waraira Repano."],
  ["Ciudad de Panamá","Panamá","🇵🇦","América","900 mil","Muy cerca pasa el Canal de Panamá, que une el océano Atlántico con el Pacífico."],
  ["La Habana","Cuba","🇨🇺","América","2,1 millones","Es famosa por sus carros antiguos de colores y su malecón junto al mar."],
  ["Nueva York","Estados Unidos","🇺🇸","América","8,3 millones","En su puerto está la Estatua de la Libertad, regalo de Francia."],
  ["Toronto","Canadá","🇨🇦","América","2,8 millones","Su torre CN mide 553 metros y tiene un piso de vidrio."],
  ["Madrid","España","🇪🇸","Europa","3,3 millones","Allí está el Museo del Prado, con pinturas de Velázquez y Goya."],
  ["París","Francia","🇫🇷","Europa","2,1 millones","La Torre Eiffel se construyó en 1889 y al principio a mucha gente no le gustaba."],
  ["Roma","Italia","🇮🇹","Europa","2,8 millones","Tiene el Coliseo y dentro de la ciudad hay otro país: el Vaticano."],
  ["Venecia","Italia","🇮🇹","Europa","250 mil","Está construida sobre más de 100 islas y en vez de calles tiene canales."],
  ["Londres","Reino Unido","🇬🇧","Europa","8,9 millones","Big Ben no es la torre: es el nombre de su gran campana."],
  ["Berlín","Alemania","🇩🇪","Europa","3,7 millones","Estuvo dividida por un muro que cayó en 1989."],
  ["Atenas","Grecia","🇬🇷","Europa","650 mil","Sobre la Acrópolis está el Partenón, un templo de hace unos 2.400 años."],
  ["Moscú","Rusia","🇷🇺","Europa","13 millones","En su Plaza Roja está la catedral de San Basilio, con cúpulas de colores."],
  ["Reikiavik","Islandia","🇮🇸","Europa","140 mil","Es la capital de un país más al norte del mundo; en invierno casi no hay sol."],
  ["Estambul","Turquía","🇹🇷","Europa y Asia","15,5 millones","Es una ciudad que está en dos continentes, separados por el estrecho del Bósforo."],
  ["El Cairo","Egipto","🇪🇬","África","10 millones","Muy cerca están las pirámides de Guiza, de más de 4.500 años."],
  ["Nairobi","Kenia","🇰🇪","África","4,4 millones","Tiene un parque nacional con jirafas y leones al lado de la ciudad."],
  ["Ciudad del Cabo","Sudáfrica","🇿🇦","África","4,8 millones","Detrás de la ciudad está la Montaña de la Mesa, plana como una mesa."],
  ["Marrakech","Marruecos","🇲🇦","África","1 millón","Su plaza Jemaa el-Fna se llena de cuentacuentos, músicos y mercados."],
  ["Tokio","Japón","🇯🇵","Asia","14 millones","Su área metropolitana es la más poblada del mundo."],
  ["Pekín","China","🇨🇳","Asia","21 millones","Allí está la Ciudad Prohibida, el palacio de los antiguos emperadores."],
  ["Delhi","India","🇮🇳","Asia","16 millones","Muy cerca, en Agra, está el Taj Mahal, hecho de mármol blanco."],
  ["Seúl","Corea del Sur","🇰🇷","Asia","9,4 millones","Mezcla palacios antiguos con edificios llenos de tecnología."],
  ["Bangkok","Tailandia","🇹🇭","Asia","10 millones","Su nombre completo en tailandés es uno de los más largos del mundo."],
  ["Dubái","Emiratos Árabes Unidos","🇦🇪","Asia","3,6 millones","Allí está el Burj Khalifa, el edificio más alto del mundo, de 828 metros."],
  ["Sídney","Australia","🇦🇺","Oceanía","5,3 millones","Su Ópera tiene techos que parecen velas de barco."],
  ["Auckland","Nueva Zelanda","🇳🇿","Oceanía","1,7 millones","Está construida sobre unos 50 volcanes dormidos."]
].map(c => ({nombre:c[0], pais:c[1], bandera:c[2], continente:c[3], poblacion:c[4], dato:c[5]}));

const HISTORIAS = [
  {t:"Francisco el Hombre", lugar:"Caribe colombiano", e:"🪗", txt:[
    "Hace mucho tiempo, en las tierras del Magdalena Grande, vivía un acordeonero llamado Francisco. Iba de pueblo en pueblo con su acordeón, llevando noticias y canciones.",
    "Una noche, volviendo a casa por un camino solitario, escuchó otro acordeón que le respondía desde la oscuridad. Quien tocaba era el mismísimo diablo, que lo retaba a un duelo de piquería: el que tocara mejor ganaría.",
    "El diablo tocaba notas tan fuertes que los árboles temblaban. Francisco, sin miedo, respiró hondo y tocó el Credo con tanta fuerza y alegría que el diablo no pudo soportarlo y huyó para siempre.",
    "Desde entonces dicen que la música vallenata nació para contar historias y vencer el miedo."],
    sabias:"En Valledupar se celebra cada año el Festival de la Leyenda Vallenata, inspirado en historias como esta."},
  {t:"El Hombre Caimán", lugar:"Plato, Magdalena", e:"🐊", txt:[
    "En el pueblo de Plato, a orillas del río Magdalena, vivía un pescador muy curioso llamado Saúl.",
    "Un brujo de la Guajira le dio dos pociones: una lo convertía en caimán y otra lo devolvía a ser hombre. Con ellas, Saúl nadaba por el río como un caimán.",
    "Un día, su amigo que lo ayudaba se asustó y la poción para volver a ser hombre se derramó. Solo cayeron unas gotas en la cabeza de Saúl, y quedó con cabeza de hombre y cuerpo de caimán.",
    "Desde entonces, dicen, el Hombre Caimán recorre el río hasta el mar, y su mamá lo cuidó siempre con mucho cariño."],
    sabias:"En Plato hay un festival y una estatua dedicados al Hombre Caimán, y existe una canción muy famosa sobre él."},
  {t:"La leyenda de El Dorado", lugar:"Laguna de Guatavita, Cundinamarca", e:"✨", txt:[
    "Los muiscas vivían en las montañas del centro de Colombia. Cuando escogían un nuevo jefe, hacían una gran ceremonia en la laguna de Guatavita.",
    "Cubrían el cuerpo del nuevo cacique con polvo de oro y lo subían a una balsa de juncos. En el centro de la laguna ofrecía figuras de oro y esmeraldas a los dioses.",
    "Cuando llegaron los europeos y escucharon esta historia, imaginaron que existía una ciudad entera hecha de oro y la llamaron El Dorado. La buscaron durante muchos años, pero nunca la encontraron.",
    "El verdadero tesoro era la cultura y el arte de los muiscas."],
    sabias:"La Balsa Muisca, una figura de oro que muestra esta ceremonia, está en el Museo del Oro de Bogotá."},
  {t:"Bachué, la madre de los muiscas", lugar:"Laguna de Iguaque, Boyacá", e:"🌄", txt:[
    "Al principio del mundo, de la laguna de Iguaque salió una mujer llamada Bachué, llevando de la mano a un niño.",
    "Bachué y el niño bajaron a las montañas, construyeron una casa y, cuando él creció, formaron una gran familia. Sus hijos poblaron la tierra.",
    "Bachué les enseñó a cultivar, a respetar la naturaleza y a vivir en paz.",
    "Cuando fue anciana, regresó a la laguna con su compañero y ambos se convirtieron en serpientes que se hundieron en el agua."],
    sabias:"El Santuario de Fauna y Flora de Iguaque protege hoy esa laguna y sus bosques."},
  {t:"El caballo de Troya", lugar:"Antigua Grecia", e:"🐴", txt:[
    "Hace más de 3.000 años, los griegos y los troyanos estuvieron en guerra durante diez años. Troya tenía murallas tan altas que nadie podía entrar.",
    "Entonces el astuto Ulises tuvo una idea: construir un enorme caballo de madera y esconder soldados dentro.",
    "Los griegos fingieron irse y dejaron el caballo como regalo. Los troyanos, felices, lo metieron en su ciudad.",
    "Por la noche, los soldados salieron del caballo y abrieron las puertas. Así terminó la guerra."],
    sabias:"Hoy decimos 'caballo de Troya' a algo que parece un regalo pero esconde una trampa, como algunos virus de computador."},
  {t:"Ícaro y las alas de cera", lugar:"Antigua Grecia", e:"🪶", txt:[
    "Dédalo era un inventor genial que estaba encerrado con su hijo Ícaro en una isla.",
    "Para escapar, fabricó dos pares de alas con plumas pegadas con cera. Antes de volar le dijo a Ícaro: 'No vueles muy bajo, porque el mar mojará tus alas, ni muy alto, porque el sol derretirá la cera'.",
    "Ícaro, emocionado, voló cada vez más alto. El sol derritió la cera, las plumas se soltaron y cayó al mar.",
    "Dédalo llegó a salvo, pero muy triste por no haber sido escuchado."],
    sabias:"Esta historia nos recuerda escuchar los buenos consejos y no exagerar, aunque algo nos emocione mucho."},
  {t:"Teseo y el laberinto", lugar:"Isla de Creta", e:"🧶", txt:[
    "En la isla de Creta había un laberinto donde vivía el Minotauro, una criatura mitad hombre y mitad toro.",
    "El joven Teseo decidió entrar para vencerlo. La princesa Ariadna le regaló un ovillo de hilo y le dijo: 'Ata la punta en la entrada y ve soltándolo'.",
    "Teseo encontró al Minotauro, lo venció y luego siguió el hilo de regreso hasta la salida.",
    "Gracias a una idea sencilla, logró salir de un laberinto del que nadie había salido."],
    sabias:"Por eso decimos 'el hilo de Ariadna' a una pista que nos ayuda a resolver un problema difícil."},
  {t:"Los volcanes enamorados", lugar:"México", e:"🌋", txt:[
    "Cuenta una leyenda mexica que el guerrero Popocatépetl amaba a la princesa Iztaccíhuatl.",
    "Él tuvo que ir a una guerra lejana. Mientras tanto, alguien le dijo a la princesa que el guerrero había caído, y ella se durmió de tristeza para siempre.",
    "Cuando Popocatépetl volvió, la llevó a una montaña y se quedó a su lado con una antorcha encendida para cuidarla.",
    "Con el tiempo, los dos se convirtieron en volcanes. El Popocatépetl todavía echa humo, como la antorcha del guerrero."],
    sabias:"Al volcán Iztaccíhuatl lo llaman 'la mujer dormida' porque su forma parece una persona acostada."},
  {t:"La liebre y la tortuga", lugar:"Fábula de Esopo, antigua Grecia", e:"🐢", txt:[
    "Una liebre muy veloz se burlaba de la tortuga porque caminaba despacio. La tortuga, tranquila, la retó a una carrera.",
    "La liebre salió corriendo y, al ver que iba muy adelante, se acostó a dormir bajo un árbol.",
    "La tortuga siguió paso a paso, sin detenerse nunca.",
    "Cuando la liebre despertó, corrió con todas sus fuerzas, pero la tortuga ya estaba cruzando la meta."],
    sabias:"Esopo vivió hace unos 2.600 años y sus fábulas siempre terminan con una enseñanza: ¡la constancia vence!"},
  {t:"La caja de Pandora", lugar:"Antigua Grecia", e:"📦", txt:[
    "Los dioses le dieron a Pandora una caja muy bonita con una advertencia: 'Nunca la abras'.",
    "Pero Pandora tenía tanta curiosidad que un día levantó la tapa. De la caja salieron volando la tristeza, las enfermedades y los problemas, y se esparcieron por el mundo.",
    "Asustada, cerró la caja rápidamente. Dentro solo quedó algo pequeño y brillante: la esperanza.",
    "Por eso, dicen, aunque haya problemas, la esperanza siempre nos acompaña."],
    sabias:"Hoy 'abrir la caja de Pandora' significa hacer algo que causa muchos problemas inesperados."}
];

const ACERTIJOS = [
  ["Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.","La pera"],
  ["Oro parece, plata no es. ¿Qué es?","El plátano"],
  ["Tengo agujas y no sé coser, tengo números y no sé leer.","El reloj"],
  ["Vuela sin alas, silba sin boca, empuja sin manos y nadie lo toca.","El viento"],
  ["Cuanto más le quitas, más grande se hace.","El hueco (agujero)"],
  ["Tiene dientes y no come, tiene cabeza y no es hombre.","El ajo"],
  ["Agua pasa por mi casa, cate de mi corazón.","El aguacate"],
  ["Tengo hojas sin ser árbol, te hablo sin tener voz. Si me abres no me quejo.","El libro"],
  ["Siempre quietas, siempre inquietas; dormidas de día, de noche despiertas.","Las estrellas"],
  ["Redondo, redondo, barril sin fondo.","El anillo"],
  ["Lleva años en el mar y todavía no sabe nadar.","La arena"],
  ["Mientras más grande es, menos se ve.","La oscuridad"],
  ["Tiene ojos y no ve, tiene agua y no la bebe, tiene carne y no la come.","El coco"],
  ["Cien amigos tengo, todos en una tabla; si no los tocas, no te hablan.","Las teclas del piano"],
  ["Te sigue a todas partes cuando hay sol, pero desaparece en la oscuridad.","La sombra"],
  ["Sale al campo de noche, tiene grandes ojos, cara seria y mucho saber.","El búho"],
  ["Me rascan las cuerdas y canto feliz; mi cuerpo es de madera.","La guitarra"],
  ["Sube llena y baja vacía; si no se da prisa, la sopa se enfría.","La cuchara"],
  ["Tiene cuello y no tiene cabeza, tiene brazos y no tiene manos.","La camisa"],
  ["Cae de una torre y no se mata, cae al agua y se desbarata.","El papel"]
];

const RETOS = [
  {p:"¿Qué número sigue? 2, 4, 8, 16, ...", o:["18","24","32","20"], r:2, e:"Cada número es el doble del anterior: 16 × 2 = 32."},
  {p:"¿Qué número sigue? 1, 1, 2, 3, 5, 8, ...", o:["11","13","12","16"], r:1, e:"Cada número es la suma de los dos anteriores: 5 + 8 = 13."},
  {p:"¿Cuál NO pertenece al grupo? Perro, gato, águila, vaca", o:["Perro","Gato","Águila","Vaca"], r:2, e:"El águila es un ave; los otros son mamíferos."},
  {p:"Si hoy es lunes, ¿qué día será dentro de 10 días?", o:["Miércoles","Jueves","Viernes","Martes"], r:1, e:"7 días después es lunes otra vez; 3 días más: jueves."},
  {p:"Un granjero tiene 17 ovejas. Se escapan todas menos 9. ¿Cuántas le quedan?", o:["8","9","17","0"], r:1, e:"'Todas menos 9' quiere decir que quedan 9."},
  {p:"¿Cuántos meses del año tienen 28 días?", o:["1","6","12","2"], r:2, e:"¡Todos los meses tienen por lo menos 28 días!"},
  {p:"Pedro es más alto que Ana. Ana es más alta que Luis. ¿Quién es el más bajo?", o:["Pedro","Ana","Luis","No se sabe"], r:2, e:"Pedro > Ana > Luis, así que Luis es el más bajo."},
  {p:"Si 3 gatos atrapan 3 ratones en 3 minutos, ¿cuánto tardan 100 gatos en atrapar 100 ratones?", o:["100 minutos","3 minutos","33 minutos","1 minuto"], r:1, e:"Cada gato atrapa un ratón en 3 minutos, sin importar cuántos gatos haya."},
  {p:"¿Qué número sigue? 1, 4, 9, 16, ...", o:["20","25","24","32"], r:1, e:"Son números al cuadrado: 1×1, 2×2, 3×3, 4×4, 5×5 = 25."},
  {p:"En una carrera adelantas al que va de segundo. ¿En qué puesto vas ahora?", o:["Primero","Segundo","Tercero","Último"], r:1, e:"Tomaste su lugar: ahora vas de segundo."},
  {p:"La mamá de María tiene 4 hijas: Lala, Lele, Lili y...", o:["Lolo","Lulu","María","Lola"], r:2, e:"¡La cuarta hija es la misma María!"},
  {p:"¿Qué pesa más: un kilo de algodón o un kilo de hierro?", o:["El hierro","El algodón","Pesan igual","Depende"], r:2, e:"Los dos pesan un kilo."},
  {p:"¿Qué número sigue? 100, 90, 81, 73, ...", o:["66","65","64","70"], r:0, e:"Se resta 10, luego 9, luego 8, luego 7: 73 − 7 = 66."},
  {p:"Tienes 3 manzanas y tomas 2. ¿Cuántas tienes tú?", o:["1","2","3","5"], r:1, e:"Las 2 que tomaste son tuyas."},
  {p:"¿Qué letra sigue? Z, X, V, T, ...", o:["S","R","Q","P"], r:1, e:"Se salta una letra hacia atrás: T, (S), R."},
  {p:"Un ladrillo pesa 1 kilo más medio ladrillo. ¿Cuánto pesa el ladrillo?", o:["1,5 kilos","2 kilos","1 kilo","3 kilos"], r:1, e:"Si medio ladrillo pesa 1 kilo, el ladrillo completo pesa 2 kilos."}
];

const SOPAS = {
  "Animales": ["PERRO","GATO","LEON","TIGRE","CEBRA","JIRAFA","MONO","PATO","OSO","LORO"],
  "Frutas": ["MANGO","PERA","UVA","PIÑA","LIMON","FRESA","GUAYABA","COCO","MORA","KIWI"],
  "Colombia": ["CAFE","CUMBIA","CONDOR","CARIBE","ANDES","VALLENATO","ORQUIDEA","AREPA","MAGDALENA","GUAJIRA"],
  "Planetas": ["MERCURIO","VENUS","TIERRA","MARTE","JUPITER","SATURNO","URANO","NEPTUNO"],
  "Colores": ["ROJO","AZUL","VERDE","NEGRO","BLANCO","ROSADO","MORADO","GRIS","CAFE","AMARILLO"],
  "Cuerpo": ["MANO","PIE","OJO","BOCA","NARIZ","CODO","RODILLA","HOMBRO","DEDO","OREJA"]
};

const BIBLIOTECAS = [
  {cat:"📚 Libros gratis", items:[
    ["Biblioteca Virtual Miguel de Cervantes","Miles de libros clásicos en español, gratis.","https://www.cervantesvirtual.com"],
    ["Proyecto Gutenberg (en español)","Más de 70.000 libros libres; filtra por idioma español.","https://www.gutenberg.org/browse/languages/es"],
    ["Open Library","Biblioteca abierta para leer y pedir prestados libros digitales.","https://openlibrary.org"],
    ["Internet Archive","Libros, audios y videos antiguos de todo el mundo.","https://archive.org"],
    ["Elejandría","Libros gratis en PDF y ePub de dominio público.","https://www.elejandria.com"],
    ["Ciudad Seva","Cuentos clásicos y fábulas para leer en línea.","https://ciudadseva.com"]]},
  {cat:"🇨🇴 Colombia", items:[
    ["Biblioteca Nacional de Colombia","Biblioteca digital con libros, mapas y música colombiana.","https://bibliotecanacional.gov.co"],
    ["Biblioteca Virtual del Banco de la República","Enciclopedia y artículos sobre historia, arte y cultura de Colombia.","https://www.banrepcultural.org/biblioteca-virtual"],
    ["Colombia Aprende","Portal del Ministerio de Educación con recursos para estudiar.","https://www.colombiaaprende.edu.co"],
    ["Maguaré","Juegos, canciones y cuentos para niños, del Ministerio de Cultura.","https://maguare.gov.co"]]},
  {cat:"🔎 Enciclopedias", items:[
    ["Vikidia","Enciclopedia en español escrita para niños de 8 a 13 años.","https://es.vikidia.org"],
    ["Wikipedia en español","La enciclopedia libre más grande del mundo.","https://es.wikipedia.org"],
    ["Biblioteca Digital Mundial","Mapas, manuscritos y libros antiguos de todos los países.","https://www.loc.gov/collections/world-digital-library/"]]},
  {cat:"🎓 Aprender", items:[
    ["Khan Academy en español","Clases gratis de matemáticas, ciencias y más, con ejercicios.","https://es.khanacademy.org"],
    ["Duolingo","Aprende inglés y otros idiomas jugando.","https://www.duolingo.com"],
    ["GeoGebra","Matemáticas y geometría interactivas.","https://www.geogebra.org"]]},
  {cat:"🔬 Ciencia y espacio", items:[
    ["Simulaciones PhET","Experimentos de física, química y matemáticas en español.","https://phet.colorado.edu/es/"],
    ["NASA Space Place en español","Juegos y datos del espacio para niños.","https://spaceplace.nasa.gov/sp/"],
    ["National Geographic Kids","Animales, ciencia y geografía (en inglés).","https://kids.nationalgeographic.com"]]},
  {cat:"🎨 Arte y museos", items:[
    ["Google Arts & Culture","Visita museos del mundo y mira obras de arte de cerca.","https://artsandculture.google.com"],
    ["Europeana","Millones de obras de arte y documentos de museos europeos.","https://www.europeana.eu/es"]]},
  {cat:"💻 Programación", items:[
    ["Scratch","Crea juegos y animaciones con bloques de colores.","https://scratch.mit.edu"],
    ["Code.org","Cursos gratis de programación para niños.","https://code.org"]]}
];

const MASCOTAS = [["🐶","Perrito"],["🐱","Gatito"],["🐰","Conejo"],["🐼","Panda"],["🦊","Zorro"],["🐸","Rana"],["🐧","Pingüino"],["🐲","Dragón"]];
