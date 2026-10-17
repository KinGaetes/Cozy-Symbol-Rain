[Español](#espanol) · [Inglés](#english)

<a id="espanol"></a>

# Cozy Symbol Rain

Cozy Symbol Rain es un **ejemplo docente de vibe coding**, pensado para clases sobre la aplicación de inteligencia artificial a pipelines y flujos de trabajo tradicionales. Puede utilizarse en distintos cursos, principalmente de ingeniería y diseño gráfico.

El proyecto se desarrolló con IA mediante instrucciones en lenguaje natural e iteraciones sobre el resultado. Se comparte como un caso práctico de ese proceso, no como una demostración de maestría en programación, simulación o desarrollo de software.

El ejemplo concreto es una animación de lluvia con ondas, salpicaduras y pequeños símbolos que aparecen al impactar las gotas. Utiliza HTML, CSS, JavaScript y Canvas 2D, con controles de color, movimiento y profundidad que permiten proponer cambios y observar sus efectos.

## Propósito docente

La animación sirve como punto de partida para trabajar cómo se incorpora la IA a un proceso que ya tiene objetivos, criterios y herramientas propios. Permite discutir y practicar:

- Traducir una intención o un requisito en instrucciones para una herramienta de IA.
- Iterar sobre un resultado y contrastarlo con lo que se quería conseguir.
- Revisar el código generado, comprobar comportamientos y detectar errores o limitaciones.
- Organizar archivos, separar textos y documentar el resultado para que otra persona pueda utilizarlo.

En ingeniería, el ejemplo puede abordarse desde los requisitos, los parámetros, las restricciones y la validación. En diseño gráfico, desde la intención visual, las paletas, el ritmo, la profundidad y la exploración de variantes.

Que el ejemplo funcione o resulte atractivo no acredita por sí solo comprensión del código ni dominio técnico. Esa distinción forma parte de la conversación que este material busca abrir en clase.

## Qué puedes explorar

- Ajustar la cadencia, dirección, velocidad, tamaño y zona de impacto de las gotas.
- Configurar las ondas, salpicaduras y símbolos que acompañan cada impacto.
- Modificar tamaños y tintes según la profundidad de la escena.
- Ajustar el plano focal y el desenfoque del fondo y del primer plano.
- Elegir paletas para los líquidos y los símbolos, o editar sus colores por separado.
- Cargar dos presets incluidos y guardar configuraciones personales.
- Intercambiar configuraciones como JSON.

La interfaz ofrece español, inglés, chino y japonés. El selector permite elegir un idioma o seguir el del navegador.

## Cómo abrirlo

Descarga el proyecto y abre `index.html` en tu navegador. Conserva las carpetas del proyecto junto a ese archivo.

Para publicarlo en GitHub Pages, sube el contenido de esta carpeta a la raíz del repositorio. `index.html`, `css/`, `js/` y `locales/` deben quedar al mismo nivel.

## Primeros pasos

Acerca el cursor al borde izquierdo, o pulsa ese borde, para abrir el editor. El botón **⌖** fija el panel para mantenerlo abierto; **×** lo cierra. Las categorías del panel se pueden desplegar por separado.

En **Presets**, elige **01 — Actual** o **02 — Capturas** y pulsa **Cargar**. Para conservar tus ajustes, escribe un nombre y pulsa **Guardar nuevo**. **Sobrescribir** actualiza un preset personal; si está seleccionado uno incluido, crea una copia personal.

En **Color y paletas**, elige el modo de color y aplica una paleta a los líquidos o a los símbolos. Puedes copiar los seis colores de un grupo al otro y editar cada color individualmente.

**Exportar** copia el JSON de la configuración actual al portapapeles. Si el navegador no lo permite, descarga un archivo `.json`. Para recuperarlo, pulsa **Importar** y pega su contenido. La importación comprueba que los ajustes tengan el formato y los valores esperados.

**Restablecer** recupera la configuración inicial. **Limpiar partículas** elimina los efectos actuales y reinicia el arranque de la lluvia.

## Organización del proyecto

```text
index.html                 # Entrada y estructura del panel
css/
  styles.css               # Diseño y estilos
js/
  i18n.js                  # Idiomas y textos por ID
  config.js                # Configuración y presets incluidos
  colors.js                # Paletas, tintes y cálculos de profundidad
  simulation.js            # Gotas, impactos y movimiento de partículas
  renderer.js              # Dibujo, capas, desenfoque y animación
  controls.js              # Definición de categorías y controles
  presets.js               # Guardado, validación e intercambio de JSON
  panel.js                 # Apertura, cierre y fijación del editor
  interface.js             # Construcción del panel y eventos
  app.js                   # Inicio de la aplicación
locales/
  translations.csv         # Textos de los cuatro idiomas
  translations.generated.js  # Copia para la apertura local
README.md
LICENSE                    # CC0 1.0 Universal
```

Todo se ejecuta en el navegador con Canvas 2D, sin instalación, compilación ni dependencias externas. Los scripts se cargan en el orden definido en `index.html` para permitir la apertura directa del archivo.

## Editar textos e idiomas

Los textos se editan en `locales/translations.csv`. Cada fila tiene un `text_id` único y columnas para español (`es`), chino (`zh`), inglés (`en`) y japonés (`ja`). El HTML y JavaScript utilizan esos IDs para mostrar categorías, controles, ayudas, paletas y mensajes.

Guarda el CSV separado por comas y con codificación UTF-8. Conserva los IDs y los marcadores entre llaves, como `{n}`, que la aplicación sustituye por valores. Español e inglés son obligatorios; si falta una traducción de chino o japonés, se muestra la de inglés. Los nombres que escribas para tus presets se conservan tal como los guardaste.

En GitHub Pages, los cambios del CSV se leen al recargar la página. La versión descargable usa `translations.generated.js` para abrirse directamente sin restricciones de lectura de archivos locales. Esta copia se genera desde el CSV y debe actualizarse al preparar una nueva versión descargable; los textos se editan siempre en el CSV.

## Alcance y limitaciones

Este es un material docente experimental. Su utilidad está en analizar el proceso de trabajo con IA y sus resultados, incluidos los ajustes, la revisión y las decisiones que siguen dependiendo de una persona. La animación es el soporte de ese ejercicio.

El rendimiento depende del dispositivo, la resolución, la cantidad de partículas y las capas de desenfoque. La apariencia de los símbolos puede variar según las fuentes disponibles en el sistema.

Los presets personales y el idioma elegido se guardan en `localStorage` cuando está disponible. Se pueden perder al borrar los datos del navegador y no se sincronizan entre dispositivos o direcciones web. Exporta los presets que quieras conservar. Al recargar la página, la escena comienza con la configuración inicial; puedes volver a cargar un preset guardado desde el panel.

## Autor

Proyecto de [KinGaetes](https://github.com/KinGaetes), desarrollado mediante vibe coding para su uso como ejemplo docente.

## Licencia

El código y la documentación de este repositorio se comparten bajo **[CC0 1.0 Universal](LICENSE)**, una dedicación al dominio público. Puedes copiarlos, modificarlos y redistribuirlos para clases, proyectos personales o usos comerciales, sin atribución obligatoria, conforme a los términos de CC0.

El archivo `LICENSE` incluye el [texto oficial de Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/legalcode).

---

<a id="english"></a>

# Cozy Symbol Rain

Cozy Symbol Rain is a **vibe coding teaching example**, intended for classes on applying artificial intelligence to traditional pipelines and workflows. It can be used across different courses, primarily in engineering and graphic design.

The project was developed with AI through natural-language instructions and iterations on the result. It is shared as a practical example of that process, not as a demonstration of mastery in programming, simulation, or software development.

The concrete example is a rain animation with ripples, splashes, and small symbols that appear when drops land. It uses HTML, CSS, JavaScript, and Canvas 2D, with controls for color, movement, and depth that make it possible to propose changes and observe their effects.

## Teaching purpose

The animation provides a starting point for exploring how AI fits into a process that already has its own goals, criteria, and tools. It supports discussion and practice around:

- Translating an intention or requirement into instructions for an AI tool.
- Iterating on a result and comparing it with the intended outcome.
- Reviewing generated code, checking behavior, and identifying errors or limitations.
- Organizing files, separating text, and documenting the result so someone else can use it.

In engineering, the example can be approached through requirements, parameters, constraints, and validation. In graphic design, through visual intent, palettes, rhythm, depth, and the exploration of variations.

A working or visually appealing example does not, by itself, establish an understanding of the code or technical proficiency. That distinction is part of the classroom discussion this material is intended to open.

## What you can explore

- Adjust the spawn rate, direction, speed, size, and impact range of the drops.
- Configure the ripples, splashes, and symbols accompanying each impact.
- Change sizes and tints according to scene depth.
- Adjust the focus plane and background and foreground blur.
- Choose palettes for liquids and symbols, or edit their colors separately.
- Load two included presets and save personal configurations.
- Exchange settings as JSON.

The interface supports Spanish, English, Chinese, and Japanese. Use the selector to choose a language or follow your browser's language.

## How to open it

Download the project and open `index.html` in your browser. Keep the project folders alongside that file.

To publish on GitHub Pages, upload the contents of this folder to the repository root. `index.html`, `css/`, `js/`, and `locales/` must be at the same level.

## First steps

Move the cursor to the left edge, or press that edge, to open the editor. The **⌖** button pins the panel open; **×** closes it. Panel categories can be expanded separately.

In **Presets**, choose **01 — Default** or **02 — Screenshots**, then press **Load**. To keep your settings, enter a name and press **Save new**. **Overwrite** updates a personal preset; if an included preset is selected, it creates a personal copy.

In **Color and palettes**, choose the color mode and apply a palette to liquids or symbols. You can copy all six colors from one group to the other and edit individual colors.

**Export** copies the current configuration's JSON to the clipboard. If the browser does not allow this, it downloads a `.json` file. To restore it, press **Import** and paste its contents. Import checks that settings have the expected structure and values.

**Reset** restores the initial configuration. **Clear particles** removes the current effects and restarts the rain's warm-up.

## Project structure

```text
index.html                 # Entry point and panel structure
css/
  styles.css               # Design and styles
js/
  i18n.js                  # Languages and text lookup by ID
  config.js                # Settings and included presets
  colors.js                # Palettes, tints, and depth calculations
  simulation.js            # Drops, impacts, and particle movement
  renderer.js              # Drawing, layers, blur, and animation
  controls.js              # Category and control definitions
  presets.js               # Saving, validation, and JSON exchange
  panel.js                 # Opening, closing, and pinning the editor
  interface.js             # Panel construction and events
  app.js                   # Application startup
locales/
  translations.csv         # Text in all four languages
  translations.generated.js  # Copy for opening locally
README.md
LICENSE                    # CC0 1.0 Universal
```

Everything runs in the browser with Canvas 2D, without installation, compilation, or external dependencies. Scripts load in the order defined in `index.html` to support opening the file directly.

## Editing text and languages

Edit text in `locales/translations.csv`. Each row has a unique `text_id` and columns for Spanish (`es`), Chinese (`zh`), English (`en`), and Japanese (`ja`). The HTML and JavaScript use these IDs to display categories, controls, help text, palettes, and messages.

Save the CSV with commas as separators and UTF-8 encoding. Preserve IDs and placeholders in braces, such as `{n}`, which the application replaces with values. Spanish and English are required; missing Chinese or Japanese translations fall back to English. Names you enter for your presets remain as you saved them.

On GitHub Pages, CSV changes are read when the page is reloaded. The downloadable version uses `translations.generated.js` to open directly without local file reading restrictions. This copy is generated from the CSV and must be updated when preparing a new downloadable version; always edit text in the CSV.

## Scope and limitations

This is experimental teaching material. Its value lies in examining the AI-assisted workflow and its results, including the adjustments, review, and decisions that still depend on a person. The animation is the vehicle for that exercise.

Performance depends on the device, resolution, particle count, and blur layers. The appearance of symbols may vary with the fonts available on the system.

Personal presets and the language choice are saved in `localStorage` when available. They may be lost when browser data is cleared and do not sync across devices or web addresses. Export presets you want to keep. Reloading the page starts the scene with the initial settings; you can load a saved preset again from the panel.

## Author

A project by [KinGaetes](https://github.com/KinGaetes), developed through vibe coding for use as a teaching example.

## License

The code and documentation in this repository are shared under **[CC0 1.0 Universal](LICENSE)**, a public domain dedication. You may copy, modify, and redistribute them for classes, personal projects, or commercial uses without mandatory attribution, under the terms of CC0.

The `LICENSE` file contains the [official Creative Commons legal text](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
