/*
 * i18n.js
 *
 * English / Spanish switch. English lives in the HTML; this file only
 * holds the Spanish strings, keyed by the data-i18n attribute of each
 * element. English is the default; a choice made with the toggle is
 * remembered per browser.
 *
 * Version: 1.0
 * Author: Adrian Berenguer-Agustí (I2SysBio-CSIC)
 * Date: 2026-10-18
 */
(() => {
  "use strict";

  // Key under which the chosen language is remembered. Renamed from
  // "lang", which also stored languages picked automatically.
  const STORAGE_KEY = "lang_choice";

  const ES = {
    "role": "— Bioinformático",
    "nav.home": "Inicio",
    "nav.work": "Proyectos",
    "nav.approach": "Enfoque",
    "nav.toolbox": "Herramientas",
    "nav.education": "Formación",
    "nav.wetlab": "Laboratorio",
    "nav.publications": "Publicaciones",
    "nav.awards": "Premios",
    "nav.outreach": "Divulgación",
    "nav.contact": "Contacto",
    "nav.about": "Sobre mí",
    "motto": `<span class="line">Transformo</span>
        <span class="line motto__data mono">datos</span>
        <span class="line">en</span>
        <span class="line motto__results">Resultados.</span>`,
    "scroll": "Desliza",
    "place": "Valencia, España, Europa",
    "place.k": "Ubicación",
    "cv.download": "Descarga mi CV (PDF)",
    "cv.pdf": "Descargar PDF",

    "intro.hello": "¡Hola! Soy Adrián.",
    "intro.lead": `Bioinformático especializado en <strong>transcriptómica y
      genómica de lecturas largas</strong> dentro del ecosistema SQANTI, en
      el Genomics of Gene Expression Lab (I2SysBio, UV-CSIC). Puedo hacer
      <strong>cualquier tipo de análisis bioinformático</strong>, desde las
      lecturas de secuenciación en bruto hasta resultados listos para
      publicar.`,
    "stat.release.k": "Contribuidor de SQANTI3",
    "stat.msc.k": "Máster en Bioinformática",
    "stat.papers.k": "Artículos en revisión",
    "stat.awards.k": "Premios",

    "work.title": "Proyectos",
    "work.sub": "Herramientas de código abierto, de la transcriptómica de lecturas largas a la estructura de proteínas, y lo que construyo en hackatones.",
    "work.bio": "Proyectos de bioinformática",
    "work.hack": "Hackatones",
    "f1.cat": "Software libre · RNA-seq de lecturas largas",
    "f1.desc": `Módulo de filtrado multimuestra para el control de calidad
      de isoformas de lecturas largas en SQANTI3, la herramienta de
      referencia para curar transcriptomas de lecturas largas. Lo
      desarrollé durante mis prácticas en el Conesa Lab y se integró en la
      versión oficial.`,
    "f1.title": "SQANTI3 — Filtro multimuestra",
    "f1.metric": "versión oficial",
    "f1.link": "Ver en GitHub",
    "f2.cat": "Trabajo fin de máster · En curso",
    "f2.title": "SQANTI sin referencia",
    "f2.desc": `Herramienta de anotación de SQANTI independiente de la
      referencia, pensada para organismos no modelo, que permite curar
      transcriptomas de lecturas largas aunque no exista una buena
      anotación del genoma.`,
    "f2.metric": "TFM · Conesa Lab",
    "f3.caption": "adenilato quinasa · familia 4AKE",
    "f3.cat": "Software libre · Bioinformática estructural",
    "f3.desc": `Pseudodinámica molecular a partir de estructuras resueltas
      experimentalmente. Con un solo código PDB, busca con BLAST otras
      estructuras depositadas de la misma proteína, las superpone en PyMOL
      y genera una animación en la que la proteína se mueve entre sus
      conformaciones reales: cierre de dominios, movimientos de bisagra o
      el reordenamiento que sigue a la unión de un ligando.`,
    "f3.metric": "un solo comando",
    "f3.site": "Web del proyecto",
    "f4.cat": "Hackathon INCUBA2 · 1.er puesto · 2026",
    "f4.place": "1.er puesto",
    "f4.desc": `Una web app sin descarga que te muestra la cultura que tienes
      cerca, según tus intereses y tu tiempo libre, y premia que vuelvas.
      La creamos un equipo de cuatro para el reto «Cultura y Creatividad»
      de la Universitat de València, su Parque Científico y el Ministerio
      de Cultura, con datos abiertos sobre los espacios y eventos
      culturales de la Comunitat Valenciana.`,
    "f4.metric": "equipo de cuatro · 2026",
    "f4.code": "Código",
    "soon": "pronto público",
    "tag.opendata": "Datos abiertos",
    "tag.maps": "Mapas",
    "tag.longreads": "Lecturas largas",
    "tag.isoqc": "Calidad de isoformas",
    "tag.nonmodel": "Organismos no modelo",
    "tag.annotation": "Anotación",

    "approach.title": "De las lecturas a los resultados",
    "approach.sub": "Lo que aporto a un proyecto, de principio a fin. Especializado en lecturas largas, también trabajo con lecturas cortas.",
    "a1.title": "Datos de secuenciación",
    "a1.desc": "Mi especialidad son las lecturas largas, de PacBio Iso-Seq a Oxford Nanopore, y también trabajo con lecturas cortas de Illumina. Datos públicos o tus propias carreras, de ARN o de ADN.",
    "a1.t1": "Lecturas largas · especialidad",
    "a1.t2": "Lecturas cortas",
    "a2.title": "Control de calidad",
    "a2.desc": "Control de calidad y filtrado de lecturas, y control de calidad a nivel de isoforma con SQANTI3 para separar los tránscritos reales de los artefactos técnicos.",
    "a2.t1": "Eliminación de artefactos",
    "a3.title": "Mapeo, anotación y cuantificación",
    "a3.desc": "Alineamiento contra un genoma de referencia, o estrategias sin referencia cuando el organismo no la tiene, seguido de la anotación de tránscritos y la cuantificación de la expresión.",
    "a3.t1": "Anotación de isoformas",
    "a3.t2": "Organismos no modelo",
    "a4.title": "Pipelines y HPC",
    "a4.desc": "Pipelines reproducibles en Python, Bash y R sobre Linux, versionados con Git y escalados en clústeres HPC con SLURM.",
    "a5.title": "Estadística y aprendizaje automático",
    "a5.desc": "Expresión diferencial, análisis de supervivencia y modelos predictivos, con R (DESeq2, survival) y Python (scikit-learn, PyTorch, TensorFlow).",
    "a6.title": "Resultados",
    "a6.desc": "Figuras claras, una interpretación honesta y un informe que responde a la pregunta biológica de partida.",
    "a6.t1": "Informes",

    "toolbox.title": "Herramientas",
    "toolbox.sub": "Lenguajes, librerías y entornos que uso a diario.",
    "tb.prog": "Programación",
    "tb.py": "Librerías de Python",
    "tb.r": "Librerías de R",
    "tb.ml": "Aprendizaje automático",
    "tb.env": "Entornos y HPC",
    "tb.shell": "Scripts de shell",
    "tb.tx": "Transcriptómica",
    "tb.lrqc": "QC de RNA-seq de lecturas largas",
    "tb.iso": "Anotación de isoformas",
    "lvl.adv": "avanzado",
    "lvl.mid": "intermedio",
    "lvl.basic": "básico",

    "edu.sub": "Biología, computación y matemáticas.",
    "edu.msc": "Máster",
    "edu.bsc": "Grado",
    "edu.now": "En curso",
    "edu.more": "Formación completa",
    "edu1.short": "Nota media 9,09 / 10, segunda mejor de la promoción. TFM: herramienta SQANTI sin referencia para organismos no modelo.",
    "edu2.short": "Nota media 8,05 / 10, con matrícula de honor en 11 asignaturas. TFG: reducción del contenido de etanol en levaduras vínicas mediante ALE y CRISPR-Cas9.",
    "edu4.title": "Grado en Matemáticas",
    "edu4.org": "En paralelo al máster",
    "edu4.short": "La base matemática y estadística de los análisis que hago.",
    "edu4.p1": "Cursado en paralelo al máster.",

    "wetlab.title": "Experiencia en laboratorio",
    "wetlab.sub": "Sé de dónde vienen los datos: también los he generado yo.",
    "w1.type": "Beca JAE Intro",
    "w1.org": "Instituto de Agroquímica y Tecnología de Alimentos (IATA-CSIC)",
    "w2.org": "Instituto de Biología Integrativa de Sistemas (I2SysBio, UV-CSIC)",
    "w1.title": "Envejecimiento en <em>C. elegans</em> alimentado con postbióticos",
    "w1.desc": "Fenotipado del envejecimiento y la función neuromuscular en un modelo de <em>C. elegans</em>: ensayos de longevidad, motilidad y fertilidad, con análisis estadístico de curvas de supervivencia.",
    "w2.type": "Trabajo fin de grado",
    "w2.title": "Levaduras vínicas con menos etanol",
    "w2.desc": "Mutaciones puntuales con CRISPR-Cas9 y evolución adaptativa en laboratorio para obtener una levadura vínica que produce menos etanol y ácido acético y más glicerol. Docking de proteínas con Python y PyMOL para evaluar mutaciones que afectan a interacciones proteína-proteína.",
    "w3.type": "Estudiante investigador · a tiempo parcial",
    "w3.title": "Bacterias lácticas contra <em>Brettanomyces</em>",
    "w3.org": "Instituto de Biotecnología y Biomedicina (BIOTECMED, UV). Laboratorio de Enología de Sergi Ferrer e Isabel Pardo.",
    "w3.desc": "Extractos de bacterias lácticas contra <em>Brettanomyces bruxellensis</em>, la levadura que causa malos olores en el vino.",
    "w4.type": "Prácticas",
    "w4.title": "Biología molecular de plantas y microscopía confocal",
    "w4.org": "Instituto de Biología Molecular y Celular de Plantas (IBMCP, UPV-CSIC).",
    "w4.desc": "Prácticas curriculares como técnico de laboratorio en biología molecular de plantas y microscopía confocal.",
    "tag.survival": "Análisis de supervivencia",
    "tag.pheno": "Fenotipado",
    "tag.docking": "Docking de proteínas",
    "tag.micro": "Microbiología",
    "tag.biofilm": "Biofilms",
    "tag.metab": "Metabolitos secundarios",
    "tag.plant": "Biología molecular de plantas",
    "tag.confocal": "Microscopía confocal",

    "pubs.title": "Publicaciones y charlas",
    "pubs.sub": "Software que lidero o al que contribuyo, artículos, pósteres y charlas.",
    "pg.lead": "Software — líder",
    "pg.contrib": "Software — contribuidor",
    "pg.papers": "Artículos",
    "pg.posters": "Pósteres",
    "pg.talks": "Charlas",
    "p.sim": "Animaciones de pseudodinámica molecular a partir de estructuras PDB experimentales. Python, Biopython, BLAST y PyMOL.",
    "p.aprop": "Web app en equipo, 1.er puesto en el Hackathon INCUBA2, creada para acercar a los jóvenes a los espacios culturales de su entorno. Next.js, Supabase y datos abiertos.",
    "p.poster.venue": "XIV Congreso de Investigación Biomédica, Valencia, España.",
    "pt.review": "En revisión",
    "pt.prep": "En preparación",
    "p1.venue": "Contribuidor de la versión 6.1. Módulo de filtrado multimuestra para el control de calidad de isoformas de lecturas largas.",

    "awards.title": "Premios",
    "awards.sub": "Innovación, emprendimiento y reconocimientos académicos.",
    "aw.incuba": "Hackathon INCUBA2, Parque Científico de la Universitat de València",
    "aw.openinn": "Competición nacional Open Innovation",
    "aw.bisce": "BISC-E Challenge nacional",
    "place.1": '<span class="rank__n">1</span>.º',
    "place.2": '<span class="rank__n">2</span>.º',
    "place.6": '<span class="rank__n">6</span>.º',
    "place.23": '<span class="rank__n">2</span>.º–<span class="rank__n">3</span>.º',
    "aw.finalist": "Finalista",
    "aw.bisceeu": "BISC-E Challenge europeo",
    "aw.santander": "Premios Santander X Valencia",
    "aw.tfg": "Mejor TFG nacional en sostenibilidad",
    "aw.selected": "Seleccionado",
    "aw.fpdg": "Programa Generación Propósito, Fundación Princesa de Girona",
    "aw.ybt": "Valencian Young Biotech Talent",
    "aw.agro": "Concurso de Agrotecnología, Universitat de València",
    "aw.motivem": "Premios Motivem de Ciencias",
    "aw.preinc": "Preincubadoras, Universitat de València",
    "aw.preinceco": "Preincubadora de economía, Universitat de València",
    "aw.startup": "Premio Startup de la Universitat de València",
    "aw.olymp": "Olimpiada de Biología",
    "aw.sapiencia": "Premios Sapiencia de la Comunitat Valenciana",

    "outreach.title": "Divulgación científica",
    "outreach.sub": "Sacar la ciencia del laboratorio.",
    "o1.desc": "La Noche Europea de los Investigadores.",
    "o2.title": "Charla sobre el microbioma",
    "o3.title": "Voluntario",
    "o3.desc": "International Society for Computational Biology, Regional Student Group de España.",

    "contact.title": "¿Hablamos de ciencia?",
    "contact.sub": "Abierto a colaboraciones, oportunidades de doctorado y problemas con muchos datos.",

    "about.kicker": "Sobre mí",
    "about.title": "Del laboratorio<br>a la terminal.",
    "about.p1": `Soy bioinformático en Valencia y vengo de la biotecnología.
      Empecé en el laboratorio, editando levaduras vínicas con CRISPR-Cas9
      y haciendo ensayos de envejecimiento en <em>C. elegans</em>, y pasé a
      la biología computacional para trabajar con los datos que generan
      esos experimentos.`,
    "about.p2": `Hoy desarrollo <strong>herramientas de transcriptómica de
      lecturas largas</strong> en el ecosistema SQANTI, en el Genomics of
      Gene Expression Lab de Ana Conesa (I2SysBio, UV-CSIC), y puedo hacer
      cualquier tipo de análisis bioinformático, de lecturas largas o
      cortas, desde los datos en bruto hasta los resultados.`,
    "edu.title": "Formación",
    "uv": "Universitat de València",
    "edu1.title": "Máster en Bioinformática",
    "edu1.p1": "Nota media 9,09 / 10, segunda mejor de la promoción. 90 ECTS. Matrícula de honor en Ordenadores y sistemas operativos, Bioinformática estructural, y Medicina y ensayos clínicos.",
    "edu1.p2": "<strong>TFM:</strong> herramienta SQANTI independiente de la referencia para organismos no modelo.",
    "edu2.title": "Grado en Biotecnología",
    "edu2.p1": "Nota media 8,05 / 10. Matrícula de honor en 11 asignaturas, entre ellas Bioinformática, Biología molecular, Genética molecular, Metabolismo, Inmunología y Biorreactores.",
    "edu2.p2": "<strong>TFG:</strong> reducción del contenido de etanol en levaduras vínicas mediante ALE y sistemas CRISPR-Cas9.",
    "edu3.title": "Bachillerato",
    "edu3.org": "IES Benicalap, Valencia",
    "edu3.p1": "Nota media 10 / 10, con matrícula de honor.",
    "exp.title": "Experiencia investigadora",
    "exp1.date": "06/2026 – Actualidad",
    "exp1.title": "Prácticas y trabajo fin de máster",
    "exp1.org": "Genomics of Gene Expression Lab, I2SysBio (UV-CSIC). IP: Ana Conesa.",
    "exp1.p1": "Desarrollo de un filtro multimuestra para la herramienta de lecturas largas SQANTI, integrado en la versión oficial, y de una herramienta de anotación de SQANTI sin referencia. Python y R.",
    "exp2.title": "Beca JAE Intro",
    "exp2.org": "Instituto de Agroquímica y Tecnología de Alimentos (IATA-CSIC).",
    "exp2.p1": "Fenotipado del envejecimiento y la función neuromuscular en un modelo de <em>C. elegans</em> alimentado con postbióticos: ensayos de longevidad, motilidad y fertilidad. Análisis estadístico de curvas de supervivencia.",
    "exp3.title": "Trabajo fin de grado",
    "exp3.org": "Instituto de Biología Integrativa de Sistemas (I2SysBio, UV-CSIC).",
    "exp3.p1": "Mutaciones puntuales con CRISPR-Cas9 en levaduras vínicas de baja producción de etanol, evolución dirigida de una nueva cepa con más glicerol y menos ácido acético, y docking de proteínas con Python y PyMOL.",
    "train.title": "Formación complementaria",
    "train1.org": "Universidad de Granada",
    "train1.title": "Machine Learning y Big Data para Bioinformática",
    "train2.org": "Universidad de Helsinki",
    "lang.title": "Idiomas",
    "lang.native": "Nativo",
    "lang.es": "Español",
    "lang.en": "Inglés",
    "lang.ca": "Catalán",
    "lang.fr": "Francés",
    "lang.eoi": "Escuela Oficial de Idiomas",
    "lang.jqcv": "Junta Qualificadora de Coneixements de Valencià",
    "footer.contact": "Contacto →",
  };

  const elements = document.querySelectorAll("[data-i18n]");
  // Original English markup, captured once so it can be restored.
  const english = new Map();
  elements.forEach((el) => english.set(el, el.innerHTML));

  /**
   * Read the language chosen with the toggle, falling back to English.
   * @returns {string} "en" or "es".
   */
  function initial_language() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      stored = null;
    }
    let result = "en";
    if (stored === "en" || stored === "es") {
      result = stored;
    }
    return result;
  }

  /**
   * Apply a language to every translatable element.
   * @param {string} lang "en" or "es".
   * @returns {void}
   */
  function apply_language(lang) {
    document.documentElement.lang = lang;
    elements.forEach((el) => {
      const key = el.dataset.i18n;
      el.innerHTML = lang === "es" && key in ES ? ES[key] : english.get(el);
    });
    document.querySelectorAll(".lang-toggle [data-lang]").forEach((span) => {
      span.classList.toggle("is-current", span.dataset.lang === lang);
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  apply_language(initial_language());

  document.querySelectorAll(".lang-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = document.documentElement.lang === "es" ? "en" : "es";
      apply_language(lang);
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        // Storage may be blocked; the page still works without it.
      }
    });
  });
})();
