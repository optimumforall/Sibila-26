import { NextResponse } from 'next/server';

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sibila 26 · Tarot y Reiki en Cunit · Acompañamiento Holístico</title>
  <meta name="description" content="Sibila 26, tarotista y terapeuta holística en Cunit. Lecturas de tarot personalizadas, reiki, limpieza energética y acompañamiento holístico. Sesiones online y presenciales.">
  <meta name="keywords" content="tarot Cunit, tarot online, reiki Cunit, acompañamiento holístico, lectura de cartas, limpieza energética, chakras, numerología, terapia holística">
  <meta name="author" content="Sibila 26">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://sibila26.vercel.app/">
  <meta property="og:title" content="Sibila 26 · Tarot y Reiki en Cunit">
  <meta property="og:description" content="Sibila 26, tarotista y terapeuta holística. Lecturas de tarot personalizadas, reiki y acompañamiento holístico en Cunit.">
  <meta property="og:url" content="https://sibila26.vercel.app/">
  <meta property="og:site_name" content="Sibila 26">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:image" content="https://sibila26.vercel.app/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Sibila 26 · Tarot y Reiki en Cunit">
  <meta name="twitter:description" content="Lecturas de tarot personalizadas, reiki y acompañamiento holístico. Sesiones online y presenciales en Cunit.">
  <meta name="geo.region" content="ES-CT">
  <meta name="geo.placename" content="Cunit, Tarragona">
  <meta name="geo.position" content="41.2167;1.6333">
  <meta name="ICBM" content="41.2167, 1.6333">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --ocre:       #8B6F47;
      --ocre-light: #C4956A;
      --crema:      #F5EDD8;
      --crema-deep: #EDE0C4;
      --surface:    #fbf9f8;
      --surface-lo: #f6f3f2;
      --surface-md: #f0eded;
      --on-surface: #1b1c1c;
      --on-variant: #4d453e;
      --outline:    #7f756d;
      --outline-lt: #d0c4bb;
      --primary:    #695c4f;
      --terracota:  #C4956A;
      --radius-sm:  0.25rem;
      --radius:     0.5rem;
      --radius-md:  0.75rem;
      --radius-lg:  1rem;
      --radius-xl:  1.5rem;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--surface);
      color: var(--on-surface);
      line-height: 1.6;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }

    /* ── TIPOGRAFÍA ── */
    .t-display {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.8rem, 8vw, 5.5rem);
      font-weight: 500;
      line-height: 1.05;
      letter-spacing: -0.02em;
    }
    .t-display em {
      font-style: italic;
      color: var(--ocre-light);
    }
    .t-headline {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      font-weight: 500;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
    .t-headline em {
      font-style: italic;
      color: var(--ocre-light);
    }
    .t-headline-sm {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 500;
      line-height: 1.3;
    }
    .t-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ocre);
    }
    .t-body { font-size: 1rem; line-height: 1.7; color: var(--on-variant); }
    .t-body-sm { font-size: 0.875rem; line-height: 1.6; color: var(--on-variant); }

    /* ── LAYOUT ── */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
    @media (max-width: 640px) { .container { padding: 0 20px; } }

    /* ── NAV ── */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(251,249,248,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--outline-lt);
      padding: 1rem 0;
    }
    .nav-inner {
      display: flex; justify-content: space-between; align-items: center;
      max-width: 1100px; margin: 0 auto; padding: 0 40px;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 0.6rem;
    }
    .nav-logo-icon {
      width: 32px; height: 32px; opacity: 0.85;
    }
    .nav-logo-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; font-weight: 500;
      color: var(--on-surface);
      letter-spacing: 0.02em;
    }
    .nav-links {
      display: flex; gap: 2rem; align-items: center;
    }
    .nav-links a {
      font-size: 0.8rem; font-weight: 500;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--outline); transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--ocre); }
    .nav-cta {
      background: var(--ocre); color: #fff;
      padding: 0.5rem 1.2rem;
      border-radius: var(--radius);
      font-size: 0.78rem; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: background 0.2s;
    }
    .nav-cta:hover { background: var(--primary); color: #fff; }
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .nav-inner { padding: 0 20px; }
    }

    /* ── HERO ── */
    .hero {
      min-height: 92vh;
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      text-align: center;
      padding: 6rem 20px 4rem;
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 70% 60% at 50% 30%, rgba(196,149,106,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-ornament {
      width: 48px; height: 1px;
      background: var(--ocre-light);
      margin: 0 auto 2rem;
      opacity: 0.6;
    }
    .hero-tag { margin-bottom: 1.5rem; }
    .hero-title { margin-bottom: 1.5rem; max-width: 700px; }
    .hero-sub {
      font-size: 1.05rem; color: var(--on-variant);
      max-width: 460px; margin: 0 auto 2.5rem;
      line-height: 1.8;
    }
    .hero-buttons {
      display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
      margin-bottom: 4rem;
    }
    .btn-primary {
      background: var(--ocre); color: #fff;
      padding: 0.85rem 2rem; border-radius: var(--radius);
      font-size: 0.85rem; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-primary:hover { background: var(--primary); transform: translateY(-1px); }
    .btn-secondary {
      border: 1.5px solid var(--outline-lt); color: var(--on-variant);
      padding: 0.85rem 2rem; border-radius: var(--radius);
      font-size: 0.85rem; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      border-color: var(--ocre); color: var(--ocre);
      transform: translateY(-1px);
    }
    .hero-quote {
      max-width: 380px; margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid var(--outline-lt);
    }
    .hero-quote p {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem; font-style: italic;
      color: var(--outline); line-height: 1.7;
    }
    .hero-quote cite {
      display: block; margin-top: 0.8rem;
      font-style: normal; font-size: 0.7rem;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--ocre); opacity: 0.7;
    }

    /* ── DIVIDER ── */
    .section-divider {
      width: 40px; height: 2px;
      background: var(--ocre-light);
      margin-bottom: 1.5rem; opacity: 0.5;
    }

    /* ── QUIEN SOY ── */
    .quien-section { padding: 7rem 0; }
    .quien-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5rem; align-items: start;
    }
    .quien-text .t-headline { margin-bottom: 1.5rem; }
    .quien-text p { margin-bottom: 1rem; }
    .quien-link {
      display: inline-flex; align-items: center; gap: 0.5rem;
      margin-top: 1.5rem; color: var(--ocre);
      font-size: 0.85rem; font-weight: 500;
      letter-spacing: 0.08em; text-transform: uppercase;
      border-bottom: 1px solid var(--ocre-light);
      padding-bottom: 2px; transition: opacity 0.2s;
    }
    .quien-link:hover { opacity: 0.7; }
    .quien-list {
      display: flex; flex-direction: column; gap: 1rem;
      padding-top: 0.5rem;
    }
    .quien-list-item {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem 1.2rem;
      background: var(--surface-lo);
      border-radius: var(--radius-md);
      border: 1px solid var(--outline-lt);
    }
    .quien-list-dot {
      width: 6px; height: 6px; min-width: 6px;
      border-radius: 50%; background: var(--ocre-light);
      margin-top: 0.45rem;
    }
    .quien-list-text { font-size: 0.9rem; color: var(--on-variant); line-height: 1.5; }
    @media (max-width: 768px) {
      .quien-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    }

    /* ── SERVICIOS ── */
    .servicios-section {
      background: var(--crema);
      padding: 7rem 0;
    }
    .servicios-header { margin-bottom: 3.5rem; }
    .servicios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .servicio-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: 1.8rem;
      border: 1px solid rgba(208,196,187,0.5);
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .servicio-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.07);
    }
    .servicio-icon {
      font-size: 1.6rem; margin-bottom: 1rem;
      display: block;
    }
    .servicio-card h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem; font-weight: 500;
      margin-bottom: 0.6rem; color: var(--on-surface);
    }
    .servicio-card p { font-size: 0.875rem; color: var(--on-variant); margin-bottom: 1rem; }
    .servicio-tag {
      display: inline-block;
      font-size: 0.7rem; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--ocre);
      background: rgba(139,111,71,0.08);
      padding: 0.25rem 0.7rem;
      border-radius: var(--radius-sm);
    }

    /* ── FORMA DE TRABAJAR ── */
    .metodo-section { padding: 7rem 0; }
    .metodo-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem; margin-top: 3.5rem;
    }
    .metodo-item { display: flex; flex-direction: column; gap: 0.8rem; }
    .metodo-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem; font-weight: 400;
      color: var(--outline-lt); line-height: 1;
      font-style: italic;
    }
    .metodo-item h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; font-weight: 500;
      color: var(--on-surface);
    }
    .metodo-item p { font-size: 0.875rem; color: var(--on-variant); }

    /* ── PROCESO ── */
    .proceso-section {
      background: var(--surface-lo);
      padding: 7rem 0;
    }
    .proceso-steps {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem; margin-top: 3.5rem; position: relative;
    }
    .proceso-step { display: flex; flex-direction: column; gap: 0.8rem; }
    .proceso-step-num {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 1.5px solid var(--ocre-light);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem; color: var(--ocre);
    }
    .proceso-step h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.15rem; font-weight: 500;
    }
    .proceso-step p { font-size: 0.875rem; color: var(--on-variant); }

    /* ── RESERVA ── */
    .reserva-section {
      background: var(--primary);
      padding: 7rem 0; text-align: center;
    }
    .reserva-section .t-label { color: rgba(245,237,216,0.6); margin-bottom: 1rem; }
    .reserva-section .t-headline { color: var(--crema); margin-bottom: 1rem; }
    .reserva-section p { color: rgba(245,237,216,0.75); margin-bottom: 2.5rem; font-size: 1rem; }
    .reserva-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn-crema {
      background: var(--crema); color: var(--primary);
      padding: 0.9rem 2rem; border-radius: var(--radius);
      font-size: 0.85rem; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn-crema:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-outline-crema {
      border: 1.5px solid rgba(245,237,216,0.5); color: var(--crema);
      padding: 0.9rem 2rem; border-radius: var(--radius);
      font-size: 0.85rem; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      transition: all 0.2s;
    }
    .btn-outline-crema:hover {
      background: rgba(245,237,216,0.1);
      border-color: var(--crema);
      transform: translateY(-1px);
    }

    /* ── FOOTER ── */
    footer {
      background: #1a1714; color: var(--outline);
      padding: 3.5rem 0; text-align: center;
    }
    .footer-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.3rem; color: var(--crema-deep);
      margin-bottom: 0.4rem;
    }
    .footer-sub { font-size: 0.8rem; margin-bottom: 2rem; letter-spacing: 0.05em; }
    .footer-cta { font-size: 0.85rem; margin-bottom: 1.5rem; }
    .footer-cta a { color: var(--ocre-light); transition: opacity 0.2s; }
    .footer-cta a:hover { opacity: 0.7; }
    .footer-links {
      display: flex; gap: 2rem; justify-content: center;
      margin-bottom: 2rem; flex-wrap: wrap;
    }
    .footer-links a { font-size: 0.78rem; transition: color 0.2s; }
    .footer-links a:hover { color: var(--crema-deep); }
    .footer-copy { font-size: 0.75rem; color: #4a4540; }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <div class="nav-inner">
      <a href="#" class="nav-logo">
        <img src="/sibila-logo.png" alt="Sibila 26" style="height:40px;">
      </a>
      <div class="nav-links">
        <a href="#quien">Quién soy</a>
        <a href="#servicios">Servicios</a>
        <a href="#reserva" class="nav-cta">Reservar</a>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-ornament"></div>
    <p class="t-label hero-tag">Tarot · Reiki · Acompañamiento Holístico</p>
    <h1 class="t-display hero-title">
      Sibila <em>26</em>
    </h1>
    <p class="hero-sub">
      El espacio sagrado donde te cuidan de verdad.<br>
      Aquí no hay respuestas mágicas.<br>Solo presencia real y escucha genuina.
    </p>
    <div class="hero-buttons">
      <a href="#reserva" class="btn-primary">Reservar sesión</a>
      <a href="#servicios" class="btn-secondary">Ver servicios</a>
    </div>
    <blockquote class="hero-quote">
      <p>"Las cartas no responden. Acompañan a quien ya sabe lo que necesita."</p>
      <cite>Sibila 26</cite>
    </blockquote>
  </section>

  <!-- QUIEN SOY -->
  <section class="quien-section" id="quien">
    <div class="container">
      <div class="quien-grid">
        <div class="quien-text">
          <div class="section-divider"></div>
          <p class="t-label" style="margin-bottom:1rem;">Quién soy</p>
          <h2 class="t-headline">Un espacio de <em>escucha</em> y presencia real</h2>
          <p class="t-body">Soy Sibila 26, tarotista y terapeuta holística. Llevo años acompañando a mujeres en momentos de cambio, duda y transformación personal.</p>
          <p class="t-body">No trabajo con predicciones ni certezas. Trabajo con presencia, con escucha y con herramientas como el tarot, el reiki y los cuencos tibetanos — espejos de tu propia sabiduría.</p>
          <a href="#reserva" class="quien-link">Hablamos →</a>
        </div>
        <div class="quien-list">
          <div class="quien-list-item">
            <div class="quien-list-dot"></div>
            <span class="quien-list-text">Escucha sin juicio — cada sesión es un espacio seguro y confidencial</span>
          </div>
          <div class="quien-list-item">
            <div class="quien-list-dot"></div>
            <span class="quien-list-text">Herramientas holísticas con base energética real</span>
          </div>
          <div class="quien-list-item">
            <div class="quien-list-dot"></div>
            <span class="quien-list-text">Sesiones online y presenciales en Cunit</span>
          </div>
          <div class="quien-list-item">
            <div class="quien-list-dot"></div>
            <span class="quien-list-text">A tu ritmo — sin prisas ni guiones prefabricados</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICIOS -->
  <section class="servicios-section" id="servicios">
    <div class="container">
      <div class="servicios-header">
        <div class="section-divider"></div>
        <p class="t-label" style="margin-bottom:1rem;">Lo que ofrezco</p>
        <h2 class="t-headline">Servicios de <em>acompañamiento</em></h2>
      </div>
      <div class="servicios-grid">
        <div class="servicio-card">
          <span class="servicio-icon">🃏</span>
          <h3>Tarot</h3>
          <p>Lectura personalizada para explorar tu situación presente, tomar decisiones y conectar con tu intuición interior.</p>
          <span class="servicio-tag">Sesión 30 min · Videollamada</span>
        </div>
        <div class="servicio-card">
          <span class="servicio-icon">✋</span>
          <h3>Reiki</h3>
          <p>Armonización energética profunda. Alivia el estrés, libera bloqueos y restaura el equilibrio en cuerpo y mente.</p>
          <span class="servicio-tag">Presencial · Cunit</span>
        </div>
        <div class="servicio-card">
          <span class="servicio-icon">🕯️</span>
          <h3>Limpieza energética</h3>
          <p>Purificación del aura y el espacio personal. Cuencos tibetanos, cristales y técnicas de limpieza profunda.</p>
          <span class="servicio-tag">Sesión personalizada</span>
        </div>
        <div class="servicio-card">
          <span class="servicio-icon">🫶</span>
          <h3>Escucha activa</h3>
          <p>Un espacio sin juicio para quien necesita ser escuchado de verdad. Presencia plena y confidencialidad total.</p>
          <span class="servicio-tag">Online o presencial</span>
        </div>
        <div class="servicio-card">
          <span class="servicio-icon">✨</span>
          <h3>Chakras y masaje energético</h3>
          <p>Detección y armonización de los centros energéticos. Recupera vitalidad, creatividad y bienestar general.</p>
          <span class="servicio-tag">Sesión integrada</span>
        </div>
        <div class="servicio-card">
          <span class="servicio-icon">🔢</span>
          <h3>Numerología</h3>
          <p>Lectura del mapa numérico de tu vida. Ciclos, talentos y el significado de los números que te acompañan.</p>
          <span class="servicio-tag">Informe personalizado</span>
        </div>
      </div>
    </div>
  </section>

  <!-- FORMA DE TRABAJAR -->
  <section class="metodo-section">
    <div class="container">
      <div class="section-divider"></div>
      <p class="t-label" style="margin-bottom:1rem;">Mi forma de trabajar</p>
      <h2 class="t-headline" style="max-width:500px;">Sin recetas. <em>Con presencia real.</em></h2>
      <div class="metodo-grid">
        <div class="metodo-item">
          <span class="metodo-num">1</span>
          <h3>Sin predicciones vacías</h3>
          <p class="t-body-sm">El tarot muestra lo que ya existe en ti y lo que estás lista para ver. Trabajo desde la honestidad, no desde el teatro.</p>
        </div>
        <div class="metodo-item">
          <span class="metodo-num">2</span>
          <h3>Tu ritmo, tu proceso</h3>
          <p class="t-body-sm">No hay prisa. No hay agenda oculta. Cada sesión dura lo que necesita durar y va donde necesitas ir.</p>
        </div>
        <div class="metodo-item">
          <span class="metodo-num">3</span>
          <h3>Herramientas reales</h3>
          <p class="t-body-sm">Tarot, reiki, cuencos, cristales, escucha activa. Cada herramienta tiene su propósito y la elijo contigo, no para ti.</p>
        </div>
        <div class="metodo-item">
          <span class="metodo-num">4</span>
          <h3>Confidencialidad absoluta</h3>
          <p class="t-body-sm">Todo lo que se comparte en sesión queda en sesión. Sin excepciones. El espacio que creo es sagrado porque tú lo mereces.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PROCESO -->
  <section class="proceso-section">
    <div class="container">
      <div class="section-divider"></div>
      <p class="t-label" style="margin-bottom:1rem;">El proceso</p>
      <h2 class="t-headline">Cómo es <em>una sesión</em></h2>
      <div class="proceso-steps">
        <div class="proceso-step">
          <div class="proceso-step-num">1</div>
          <h3>Me escribes</h3>
          <p class="t-body-sm">Por WhatsApp o Instagram. Sin formularios. Solo un mensaje con lo que necesitas. Te respondo personalmente.</p>
        </div>
        <div class="proceso-step">
          <div class="proceso-step-num">2</div>
          <h3>Encontramos el momento</h3>
          <p class="t-body-sm">Buscamos el día y la hora que encaje contigo. Sin urgencias ni presiones.</p>
        </div>
        <div class="proceso-step">
          <div class="proceso-step-num">3</div>
          <h3>La sesión</h3>
          <p class="t-body-sm">Videollamada o presencial. Un espacio seguro, sin prisa y sin guión fijo. Tú traes lo que quieras compartir.</p>
        </div>
        <div class="proceso-step">
          <div class="proceso-step-num">4</div>
          <h3>Te llevas algo real</h3>
          <p class="t-body-sm">Claridad, un mensaje concreto, o simplemente la calma de haber sido escuchada de verdad.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- RESERVA -->
  <section class="reserva-section" id="reserva">
    <div class="container">
      <p class="t-label">Reserva</p>
      <h2 class="t-headline">¿Hablamos <em>cuando quieras?</em></h2>
      <p>Sin compromiso. Solo escríbeme y buscamos el momento que mejor encaje contigo.</p>
      <div class="reserva-buttons">
        <a href="https://wa.me/34635920940?text=Hola,%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20tus%20sesiones" class="btn-crema">WhatsApp</a>
        <a href="https://instagram.com/sibila26.tarot" class="btn-outline-crema">Instagram</a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-logo"><img src="/sibila-logo.png" alt="Sibila 26" style="height:40px;"></div>
      <div class="footer-sub">Tarot · Reiki · Acompañamiento Holístico · Cunit</div>
      <div class="footer-cta">¿Te gustaría una presencia digital como esta? <a href="https://optimumforall.es">Contactar con Optimum for All →</a></div>
      <div class="footer-links">
        <a href="/privacidad">Privacidad</a>
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/dashboard">Área privada</a>
      </div>
      <div class="footer-copy">© 2026 Sibila 26 · Todos los derechos reservados · Powered by Optimum for All</div>
    </div>
  </footer>

</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
