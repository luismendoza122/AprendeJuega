# Aprende y Juega 2.1

## Novedades de la versión 2.1
- **Teacher Owl habla en español**: lee en voz alta sus explicaciones y correcciones en español, y dice las palabras
  en inglés con voz inglesa. Se puede apagar con el botón «🔊 Búho habla» en la pantalla de Inglés.
- **Conversa con Owl** 🗣️ (nueva actividad en cada tema): el búho pregunta en voz alta en español
  («¿Cómo se dice tres en inglés?») y el niño responde hablando en inglés.
- **Pregúntale por voz**: en el chat hay un micrófono para preguntarle en español («¿cómo se dice perro?»).

App educativa para niños de 6 a 12 años. Casi todo funciona sin internet.

## Novedades de la versión 2.0
- **Inglés con Teacher Owl 🦉**: 18 temas (abecedario, saludos, colores, números, animales, familia, cuerpo, comida,
  ropa, escuela, casa, días y meses, clima, acciones, sentimientos, opuestos, lugares y transporte).
  Son 232 palabras y 55 frases, con 6 actividades: Aprende, Escucha y elige, Escribe, Habla, Arma la frase y Examen con medalla.
- **Teacher Owl**, un tutor que corrige sin internet:
  - Revisa lo que el niño escribe letra por letra y le explica el error en español (letra que falta, que sobra,
    letras al revés, doble letra, «th», «ee», «oo», «gh», «ph», «e» muda…).
  - Escucha lo que el niño dice con el micrófono, le dice qué entendió y le da consejos de pronunciación
    («th», la «v», la «h», no decir «es-» antes de la s). El reconocimiento de voz usa el de Google del teléfono.
  - Recuerda qué palabras le cuestan y arma un **Repaso del día** (repaso espaciado).
  - Responde preguntas: «¿cómo se dice perro?», «¿qué significa yellow?», «deletrea elephant», «dime una frase».
  - Muestra el progreso, el nivel y las medallas.
- **8 juegos nuevos** (16 en total): ¿Qué hora es?, Cuenta el dinero (pesos colombianos), Fracciones con pizza,
  Completa el patrón, Mayor o menor, Toca en orden, Encuentra el diferente y Serpiente ABC.
- La app ahora se firma siempre con la misma llave (`app/aprendejuega.keystore`). Desde esta versión, las
  actualizaciones se instalan encima sin borrar estrellas ni progreso.

## Dónde está cada cosa
- Todo el contenido está en `app/src/main/assets/`:
  - `ingles-datos.js`: temas, palabras y frases de inglés (para agregar más, copia una línea y cámbiala).
  - `ingles.js`: Teacher Owl y las actividades de inglés.
  - `juegos3.js`: los 8 juegos nuevos.
  - `data.js`, `songs.js`, `app.js`, `juegos2.js`, `karaoke.js`: el resto de la app.
- `MainActivity.java` agrega lo que el WebView no trae: guardar archivos, leer en voz alta en español e inglés,
  y el reconocimiento de voz.
- Los dibujos se guardan en Galería › Pictures/AprendeYJuega y los audios en Música › AprendeYJuega.
- El APK se compila solo en GitHub Actions al subir `AprendeJuega.zip`.
