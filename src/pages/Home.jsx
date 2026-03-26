import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import "../styles.css";
import T from "../translations.js";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Eventos", id: "events" },
  { label: "Programas", id: "programs" },
  { label: "Cuotas", id: "cuotas" },
  { label: "Tarifas", id: "tarifas" },
  { label: "Contacto", id: "contacto-link" },
];

const BANNER_DEFAULT = {
  text: "📣 Inscripciones abiertas temporada 2025–2026 — ¡Únete a Transtriatlon!",
  cta: "Inscríbete",
  ctaLink: "https://transtriatlon.com/formulario-de-inscripcion/",
};

const EVENTS_DEFAULT = [
  { title: "Travessia d'Hivern", date: "Enero 2026", type: "Natación", img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop" },
  { title: "Travessia de Natació", date: "Junio 2026", type: "Natación", img: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop" },
  { title: "Triatlón Vilanova", date: "Septiembre 2026", type: "Triatlón", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop" },
  { title: "Duatlón de Tardor", date: "Noviembre 2026", type: "Duatlón", img: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop" },
];

const PROGRAMS = [
  {
    name: "Transtriatlon Academy",
    tag: "6 – 12 años",
    desc: "Formación deportiva de base para niños y niñas. Ciclismo y carrera a pie en un entorno seguro, divertido y educativo con el objetivo de crear hábitos deportivos saludables.",
    icon: "⭐",
    accent: "#FF8C00", 
  },
  {
    name: "Transtriatlon Joven",
    tag: "12 – 17 años",
    desc: "Programa para jóvenes que quieren iniciarse o progresar en triatlón. Natación, ciclismo, carrera a pie y funcional con entrenadores titulados especializados en formación juvenil.",
    icon: "🚴",
    accent: "#FF4444",
  },
  {
    name: "Transtriatlon Adulto",
    tag: "18+ años (Junior en adelante)",
    desc: "Entrenamientos personalizados y grupales para adultos de todos los niveles. Natación, ciclismo, carrera a pie y funcional. Planificaciones adaptadas a tus objetivos y disponibilidad.",
    icon: "🏃",
    accent: "#C41414",
  },
  {
    name: "Transtriatlon Funcional",
    tag: "Todos los niveles",
    desc: "Entrenamientos de musculación y funcional orientados a mejorar fuerza, resistencia, coordinación y agilidad específica del triatlón y duatlón. Sesiones grupales adaptadas a cada persona.",
    icon: "💪",
    accent: "#E81E1E",
   },
];

const CUOTAS = [
  {
    name: "Adulto",
    age: "A partir de 18 años",
    activities: ["Natación", "Ciclismo", "Carrera a pie", "Funcional"],
    includes: [
      "Entrenamientos semanales en grupo dirigidos",
      "Acceso a instalaciones (15' antes y después)",
      "Pautas de entrenamiento semanales",
      "Camiseta técnica de regalo",
      "Descuentos en eventos y tiendas colaboradoras",
    ],
   
  },
  {
    name: "Joven",
    age: "12 – 17 años",
    activities: ["Natación", "Ciclismo", "Carrera a pie", "Funcional"],
    includes: [
      "Entrenamientos semanales en grupo dirigidos",
      "Acceso a instalaciones (15' antes y después)",
      "Pautas de entrenamiento semanales",
      "Camiseta técnica de regalo",
      "Descuentos en eventos y tiendas colaboradoras",
    ],
    note: "*Mismas condiciones que Adulto.",
    featured: false,
  },
  {
    name: "Academy",
    age: "6 – 12 años",
    activities: ["Ciclismo", "Carrera a pie"],
    includes: [
      "2 entrenamientos semanales en grupo dirigidos",
      "Acceso a instalaciones (15' antes y después)",
      "Camiseta técnica de regalo",
      "Descuentos en eventos y tiendas colaboradoras",
    ],
    note: null,
    featured: false,
  },
  {
    name: "Externo No Presencial",
    age: "Adulto",
    activities: ["1 entreno mensual presencial"],
    includes: [
      "1 entrenamiento mensual en grupo dirigido",
      "Pautas de entrenamiento semanales",
      "Camiseta técnica de regalo",
      "Descuentos en eventos y tiendas",
    ],
    note: "No acumulable, personal e intransferible.",
    featured: false,
  },
];

const TARIFAS = {
  adulto: [
    { act: "4 actividades", trim: "90€", mes: "34€" },
    { act: "3 actividades", trim: "80€", mes: "31€" },
    { act: "2 actividades", trim: "75€", mes: "30€" },
    { act: "1 actividad", trim: "66€", mes: "28€" },
    { act: "Externo no presencial", trim: "—", mes: "99€/año" },
  ],
  joven: [
    { act: "4 actividades", trim: "80€", mes: "31€" },
    { act: "3 actividades", trim: "75€", mes: "30€" },
    { act: "2 actividades", trim: "71€", mes: "29€" },
    { act: "1 actividad", trim: "66€", mes: "28€" },
  ],
  academy: [
    { act: "2 actividades (bici + carrera)", trim: "71€", mes: "29€", anual: "200€" },
    { act: "1 actividad", trim: "66€", mes: "28€", anual: "190€" },
  ],
};

const SPONSORS = [
  { name: "Federació Catalana de Triatló", logo: "https://lh3.googleusercontent.com/d/1Ul-KXDLGGYxPxh6ekkIW-2_BxCZb5hh-" },
  { name: "El Surtidor", logo: "https://lh3.googleusercontent.com/d/1QBfqycLOlXhwNrkZddZlKzoju9sYk0Oj" },
  { name: "Ajuntament de Vilanova i la Geltrú", logo: "https://lh3.googleusercontent.com/d/1eRjJKEXklTDaGUGQ4nI93NM2j5TLac0C" },
  { name: "Evasion Running", logo: "https://lh3.googleusercontent.com/d/1k0XmWDxtt51yIaAPTy2qZkmvDpc0hdOP" },
  { name: "Escuela de la memoria", logo: "https://lh3.googleusercontent.com/d/1-kYrZnKdfF0KxevXu25-6B2oP1PfedJt" },
  { name: "Alfaro", logo: "https://lh3.googleusercontent.com/d/1jKm2hKgdt5EfdWV0QlICw9UlQDZzqEh6" },
  { name: "TransNaigo", logo: "https://lh3.googleusercontent.com/d/11FN4xETw_jX2KqtyA6Y_t5Nhv4fE7E8S" },
];

const LOGO = "https://lh3.googleusercontent.com/d/1k4Vbce4KpniDHESGgsp-FJ-9k1WIX8Iy";

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */
function useInView(th = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return [ref, v];
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function Home() {
  const [menu, setMenu] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("tt-lang") || "es");
  const t = T[lang];
  const [banner, setBanner] = useState(BANNER_DEFAULT);
  const [sy, setSy] = useState(0);
  const [tarifaTab, setTarifaTab] = useState("adulto");
  const [events, setEvents] = useState(EVENTS_DEFAULT);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "banner"));
        if (snap.exists() && snap.data().text) setBanner(snap.data());
      } catch (e) { /* use default */ }
    };
    const loadEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setEvents(snap.docs.map(d => {
            const data = d.data();
            return { title: data.title, date: data.date, type: data.type, img: data.imgUrl || "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop" };
          }));
        }
      } catch (e) { /* use defaults */ }
    };
    loadBanner();
    loadEvents();
  }, []);

  useEffect(() => {
    const fn = () => setSy(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenu(false); };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    }
    return dateStr;
  };

  return (
    <div>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

:root{
  --bg:#FAFAF8;--bg2:#F1F0EC;--dark:#0B0A09;--text:#1A1A1A;--text2:#666;--white:#F5F5F0;
  --red:#E81E1E;--red-l:#FF4444;--red-d:#B91616;--red-glow:rgba(232,30,30,.2);
  --r:14px;--rs:8px;
  --font:'DM Sans',sans-serif;--display:'Bebas Neue',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--font);background:var(--bg);color:var(--text);overflow-x:hidden}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}

/* ── HEADER ── */
.hdr{position:fixed;top:0;left:0;right:0;z-index:100;height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,48px);transition:all .35s}
.hdr-s{background:rgba(255,255,255,.92);backdrop-filter:blur(16px);box-shadow:0 1px 0 rgba(0,0,0,.06)}
.hdr-t{background:transparent}
.hdr-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.hdr-logo img{height:38px}
.hdr-logo span{font-family:var(--display);font-size:22px;letter-spacing:3px;color:var(--text)}
.hdr-nav{display:flex;align-items:center;gap:20px;list-style:none}
.hdr-nav li{font-size:15px;font-weight:500;letter-spacing:.5px;color:var(--text2);cursor:pointer;transition:color .25s;position:relative;white-space:nowrap}
.hdr-nav li:hover{color:var(--red)}
.hdr-cta{padding:10px 24px;border-radius:100px;background:var(--red);color:#fff;font-size:13px;font-weight:600;letter-spacing:.5px;border:none;cursor:pointer;transition:all .25s;font-family:var(--font)}
.hdr-cta:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 6px 20px var(--red-glow)}

.hb{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;z-index:200}
.hb span{width:22px;height:2px;background:var(--text);transition:all .3s;border-radius:1px}
.hb.op span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.hb.op span:nth-child(2){opacity:0}
.hb.op span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.mm{display:none;position:fixed;inset:0;z-index:150;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center;gap:24px}
.mm.op{display:flex}
.mm li{list-style:none;font-family:var(--display);font-size:32px;letter-spacing:3px;color:var(--text);cursor:pointer;transition:color .2s}
.mm li:hover{color:var(--red)}
@media(max-width:860px){.hdr-nav{display:none}.hb{display:flex}}

/* ── BANNER ── */
.bnr{margin-top:68px;background:var(--red);padding:14px 24px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
.bnr-txt{color:#fff;font-size:14px;font-weight:500;letter-spacing:.3px}
.bnr-btn{padding:7px 20px;border-radius:100px;background:#fff;color:var(--red);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;border:none;cursor:pointer;transition:all .2s;font-family:var(--font)}
.bnr-btn:hover{transform:scale(1.04);box-shadow:0 4px 12px rgba(0,0,0,.15)}

/* ── SECTIONS ── */
.sec{padding:clamp(64px,10vw,120px) clamp(16px,4vw,48px)}
.sec-dark{background:var(--dark);color:var(--white)}
.sec-alt{background:var(--bg2)}
.ctn{max-width:1140px;margin:0 auto}
.sec-label{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:10px}
.sec-title{font-family:var(--display);font-size:clamp(36px,5.5vw,64px);letter-spacing:2px;line-height:1}
.sec-desc{font-size:16px;font-weight:400;line-height:1.7;color:var(--text2);max-width:560px;margin-top:14px}
.sec-dark .sec-desc{color:rgba(255,255,255,.45)}

/* ── EVENTS CARDS ── */
.ev-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:48px}
.ev-card{border-radius:var(--r);overflow:hidden;position:relative;cursor:pointer;aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:flex-end}
.ev-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1)}
.ev-card:hover img{transform:scale(1.06)}
.ev-card::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8) 0%,rgba(0,0,0,.15) 50%,transparent 100%)}
.ev-info{position:relative;z-index:2;padding:28px;color:#fff}
.ev-type{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--red-l);margin-bottom:6px}
.ev-info h3{font-family:var(--display);font-size:28px;letter-spacing:2px;line-height:1.1}
.ev-date{font-size:13px;opacity:.6;margin-top:6px}

/* ── PROGRAMS ── */
.pr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:48px}
.pr-card{padding:36px 32px;border-radius:var(--r);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);transition:all .4s;position:relative;overflow:hidden}
.pr-card:hover{transform:translateY(-3px);background:rgba(255,255,255,.08);border-color:rgba(232,30,30,.2)}
.pr-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pa);transform:scaleX(0);transition:transform .4s;transform-origin:left}
.pr-card:hover::before{transform:scaleX(1)}
.pr-icon{font-size:32px;margin-bottom:16px}
.pr-card h3{font-family:var(--display);font-size:26px;letter-spacing:1.5px}
.pr-tag{display:inline-block;margin-top:6px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(255,255,255,.08);color:rgba(255,255,255,.5)}
.pr-card p{font-size:13px;line-height:1.65;opacity:.5;margin-top:14px}

/* ── CUOTAS ── */
.cu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:48px}
.cu-card{padding:32px 28px;border-radius:var(--r);background:#fff;border:1px solid rgba(0,0,0,.06);transition:all .35s;position:relative}
.cu-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.06)}
.cu-card.ft{border-color:var(--red);box-shadow:0 0 0 1px var(--red)}
.cu-card.ft::after{content:'POPULAR';position:absolute;top:14px;right:14px;padding:3px 10px;border-radius:100px;background:var(--red);color:#fff;font-size:9px;font-weight:700;letter-spacing:1.5px}
.cu-name{font-family:var(--display);font-size:26px;letter-spacing:2px;color:var(--red)}
.cu-age{font-size:12px;color:var(--text2);margin-top:2px}
.cu-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.cu-act{padding:4px 12px;border-radius:100px;background:rgba(232,30,30,.06);color:var(--red);font-size:11px;font-weight:600;letter-spacing:.5px}
.cu-list{margin-top:18px;display:flex;flex-direction:column;gap:8px}
.cu-item{font-size:13px;color:var(--text2);line-height:1.5;padding-left:18px;position:relative}
.cu-item::before{content:'✓';position:absolute;left:0;color:var(--red);font-weight:700;font-size:12px}
.cu-note{margin-top:14px;font-size:11px;color:var(--text2);opacity:.7;font-style:italic;line-height:1.5}

/* ── TARIFAS ── */
.tf-tabs{display:flex;gap:8px;margin-top:32px;flex-wrap:wrap}
.tf-tab{padding:10px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;transition:all .25s;letter-spacing:.5px}
.tf-tab.ac{background:var(--red);color:#fff;border-color:var(--red)}
.tf-table{margin-top:28px;width:100%;border-collapse:collapse}
.tf-table th{text-align:left;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.tf-table td{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:14px;color:rgba(255,255,255,.6)}
.tf-table td:last-child{font-weight:700;color:var(--red-l)}
.tf-table tr:last-child td{border:none}
.tf-mat{margin-top:20px;text-align:center;font-size:12px;color:rgba(255,255,255,.3);letter-spacing:.5px}
.tf-personal{margin-top:48px;padding:32px;border-radius:var(--r);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.tf-personal h4{font-family:var(--display);font-size:24px;letter-spacing:2px;margin-bottom:10px}
.tf-personal p{font-size:14px;line-height:1.7;color:rgba(255,255,255,.45)}
.tf-personal a{color:var(--red-l);font-weight:600}

/* ── SPONSORS ── */
.sp-sec{padding:64px 32px;background:#fff;border-top:1px solid rgba(0,0,0,.05)}
.sp-title{font-family:var(--display);font-size:clamp(28px,4vw,40px);letter-spacing:3px;text-align:center;margin-bottom:40px}
.sp-track{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.sp-inner{display:flex;align-items:center;gap:56px;animation:mq 24s linear infinite;width:max-content}
.sp-logo{height:44px;width:auto;max-width:130px;object-fit:contain;filter:grayscale(100%) opacity(.4);transition:all .4s;flex-shrink:0}
.sp-logo:hover{filter:grayscale(0%) opacity(1)}
@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── FOOTER ── */
.ftr{background:var(--dark);color:var(--white);padding:72px clamp(16px,4vw,48px) 32px}
.ftr-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;max-width:1140px;margin:0 auto}
.ftr-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.ftr-logo img{height:30px;filter:brightness(0) invert(1)}
.ftr-logo span{font-family:var(--display);font-size:20px;letter-spacing:3px}
.ftr-desc{font-size:13px;opacity:.35;line-height:1.7;max-width:300px}
.ftr h5{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--red);margin-bottom:16px}
.ftr-links{list-style:none;display:flex;flex-direction:column;gap:10px}
.ftr-links li{font-size:13px;opacity:.4;cursor:pointer;transition:all .2s}
.ftr-links li:hover{opacity:1;color:var(--red-l)}
.ftr-social{display:flex;gap:10px;margin-top:20px}
.ftr-social a{width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:13px;font-weight:700;transition:all .25s}
.ftr-social a:hover{background:var(--red);color:#fff;border-color:var(--red)}
.ftr-bottom{max-width:1140px;margin:48px auto 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;font-size:11px;opacity:.25}

@media(max-width:768px){
  .ev-grid{grid-template-columns:repeat(2,1fr)}
  .pr-grid,.cu-grid{grid-template-columns:1fr}
  .ftr-grid{grid-template-columns:1fr;gap:28px}
  .ftr-bottom{flex-direction:column;gap:6px;text-align:center}
  .tf-table{font-size:13px}
}
@media(max-width:500px){
  .ev-grid{grid-template-columns:1fr}
}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className={`hdr ${sy > 40 ? "hdr-s" : "hdr-t"}`}>
        <div className="hdr-logo" onClick={() => go("hero")}>
          <img src={LOGO} alt="Transtriatlon" />
          <span>TRANSTRIATLON</span>
        </div>
        <ul className="hdr-nav">
          {t.nav.map(n => (
            n.id === "contacto-link" ? (
              <li key={n.id} onClick={() => { window.location.hash = "/contacto"; }}>{n.label}</li>
            ) : n.id === "quienes-somos-link" ? (
              <li key={n.id} onClick={() => { window.location.hash = "/quienes-somos"; }}>{n.label}</li>
            ) : (
              <li key={n.id} onClick={() => go(n.id)}>{n.label}</li>
            )
          ))}
          <li>
            <a href="https://tienda.austral.es/transtriatlon/index.php" target="_blank" rel="noreferrer" style={{ color: "var(--red-l)", textDecoration: "none", fontWeight: 600 }}>{t.equipaciones}</a>
          </li>
          <li>
            <Link to="/atletas" style={{ color: "inherit", textDecoration: "none" }}>{t.accesoAtletas}</Link>
          </li>
          <li>
            <Link to="/inscripcion" className="hdr-cta" style={{ textDecoration: "none" }}>{t.inscribete}</Link>
          </li>
          <li style={{ display: "flex", gap: 4 }}>
            {["es","ca","en"].map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem("tt-lang", l); }}
                style={{ padding: "4px 8px", borderRadius: 6, border: lang === l ? "1px solid var(--red)" : "1px solid rgba(0,0,0,.1)", background: lang === l ? "var(--red)" : "transparent", color: lang === l ? "#fff" : "var(--text2)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", textTransform: "uppercase", transition: "all .2s" }}>{l}</button>
            ))}
          </li>
        </ul>
        <div className={`hb ${menu ? "op" : ""}`} onClick={() => setMenu(!menu)}><span /><span /><span /></div>
      </header>

      <ul className={`mm ${menu ? "op" : ""}`}>
        {t.nav.map(n => (
          n.id === "contacto-link" ? (
            <li key={n.id} onClick={() => { setMenu(false); window.location.hash = "/contacto"; }}>{n.label}</li>
          ) : n.id === "quienes-somos-link" ? (
            <li key={n.id} onClick={() => { setMenu(false); window.location.hash = "/quienes-somos"; }}>{n.label}</li>
          ) : (
            <li key={n.id} onClick={() => go(n.id)}>{n.label}</li>
          )
        ))}
        <li><a href="https://tienda.austral.es/transtriatlon/index.php" target="_blank" rel="noreferrer" style={{ color: "var(--red-l)", textDecoration: "none" }}>{t.equipaciones}</a></li>
        <li onClick={() => { setMenu(false); window.location.hash = "/atletas"; }}>{t.accesoAtletas}</li>
        <li onClick={() => { setMenu(false); window.location.hash = "/inscripcion"; }} style={{ color: "var(--red)" }}>{t.inscribete}</li>
        <li style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
          {["es","ca","en"].map(l => (
            <button key={l} onClick={() => { setLang(l); localStorage.setItem("tt-lang", l); setMenu(false); }}
              style={{ padding: "8px 16px", borderRadius: 8, border: lang === l ? "2px solid var(--red)" : "2px solid rgba(0,0,0,.1)", background: lang === l ? "var(--red)" : "transparent", color: lang === l ? "#fff" : "var(--text)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--display)", letterSpacing: 2, textTransform: "uppercase" }}>{l}</button>
          ))}
        </li>
      </ul>

      {/* ═══ BANNER ═══ */}
      <div className="bnr" id="hero">
        <span className="bnr-txt">{banner.text}</span>
        <a href={banner.ctaLink} target="_blank" rel="noreferrer">
          <button className="bnr-btn">{banner.cta}</button>
        </a>
      </div>

      {/* ═══ HERO VISUAL ═══ */}
      <section style={{
        background: `var(--dark)`,
        padding: "clamp(48px,8vw,100px) clamp(16px,4vw,48px)",
        position: "relative", overflow: "hidden", minHeight: "70vh", display: "flex", alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://lh3.googleusercontent.com/d/1p1WMVEo_0c2QnhP44G3dQHloQ4PaPIYC)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(11,10,9,.75) 0%, rgba(11,10,9,.6) 40%, rgba(11,10,9,.8) 100%)",
        }} />
        <div className="ctn" style={{ position: "relative", zIndex: 2 }}>
          <Reveal>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "var(--red-l)", marginBottom: 12 }}>
              {t.hero.label}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(48px,10vw,110px)", lineHeight: .9, letterSpacing: -1, color: "#fff" }}>
              {t.hero.title1}<br /><span style={{ color: "var(--red)" }}>{t.hero.title2}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", fontWeight: 300, color: "rgba(255,255,255,.4)", marginTop: 20, lineHeight: 1.7, maxWidth: 480 }}>
              {t.hero.sub}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              <button className="hdr-cta" style={{ padding: "14px 32px", fontSize: 14 }} onClick={() => go("cuotas")}>{t.hero.cta1}</button>
              <button style={{
                padding: "14px 32px", borderRadius: 100, border: "1px solid rgba(255,255,255,.2)",
                background: "transparent", color: "#fff", fontFamily: "var(--font)", fontSize: 14,
                fontWeight: 500, cursor: "pointer", transition: "all .25s",
              }} onClick={() => window.location.hash = "/contacto"}>{t.hero.cta2}</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TRANSEVENTS ═══ */}
      <section className="sec" id="events">
        <div className="ctn">
          <Reveal><div className="sec-label">{t.events.label}</div></Reveal>
          <Reveal delay={0.05}><div className="sec-title">{t.events.title}</div></Reveal>
          <Reveal delay={0.1}><p className="sec-desc">Competiciones organizadas por Transtriatlon.</p></Reveal>
          <div className="ev-grid">
            {events.filter(e => {
              if (!e.date) return true;
              const d = /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? new Date(e.date + "T00:00:00") : null;
              if (!d) return true;
              const now = new Date(); now.setHours(0,0,0,0);
              return d >= now;
            }).map((e, i) => (
              <Reveal key={e.title} delay={0.1 + i * 0.08}>
                <Link to="/eventos" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="ev-card">
                    <img src={e.img} alt={e.title} />
                    <div className="ev-info">
                      <div className="ev-type">{e.type}</div>
                      <h3>{e.title}</h3>
                      <div className="ev-date">{formatDate(e.date)}</div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/eventos" style={{ padding: "12px 28px", borderRadius: 100, border: "1px solid rgba(0,0,0,.12)", color: "var(--text)", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all .25s", display: "inline-block" }}>
              {t.events.all}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section className="sec sec-dark" id="programs">
        <div className="ctn">
          <Reveal><div className="sec-label">{t.programs.label}</div></Reveal>
          <Reveal delay={0.05}><div className="sec-title">{t.programs.title}</div></Reveal>
          <Reveal delay={0.1}><p className="sec-desc">{t.programs.desc}</p></Reveal>
          <div className="pr-grid">
            {t.programs.items.map((p, i) => (
              <Reveal key={p.name} delay={0.1 + i * 0.07}>
                <div className="pr-card" style={{ "--pa": p.accent }}>
                  <div className="pr-icon">{p.icon}</div>
                  <h3>{p.name}</h3>
                  <div className="pr-tag">{p.tag}</div>
                  <p>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ENTRENAMIENTOS ═══ */}
      <section className="sec sec-dark" id="entrenamientos">
        <div className="ctn">
          <Reveal><div className="sec-label">Entrenamientos</div></Reveal>
          <Reveal delay={0.05}><div className="sec-title">CÓMO ENTRENAMOS</div></Reveal>
          <Reveal delay={0.1}><p className="sec-desc">Entrenamientos personalizados y grupales adaptados a cada deportista.</p></Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
            <Reveal delay={0.15}>
              <div style={{ padding: 28, borderRadius: 14, background: "rgba(232,30,30,.04)", border: "1px solid rgba(232,30,30,.1)" }}>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 20, letterSpacing: 1, marginBottom: 14, color: "var(--red)" }}>🎯 PERSONALES</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,.5)" }}>
                  Planificaciones de entrenamientos personales adaptados individualmente a cada deportista, dependiendo de su nivel deportivo, objetivos, disponibilidad para entrenar, etc.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ padding: 28, borderRadius: 14, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}>
                <h3 style={{ fontFamily: "var(--display)", fontSize: 20, letterSpacing: 1, marginBottom: 14, color: "#fff" }}>👥 GRUPALES</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,.5)", marginBottom: 8 }}>
                  Son optativos. Los deportistas vienen cuando quieren y cuando pueden.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginTop: 24 }}>
              {[
                { icon: "🏊", title: "Natación en mar", desc: "En épocas que el clima lo permite, entrenamos en aguas abiertas simulando situaciones reales de competición." },
                { icon: "🏊‍♂️", title: "Natación en piscina", desc: "Trabajamos técnica, resistencia y series." },
                { icon: "🚴", title: "Ciclismo", desc: "Entrenamientos de técnica de pedaleo, rodajes en grupo y series." },
                { icon: "🏃", title: "Carrera a pie", desc: "Entrenos en pistas de atletismo y Paseo Marítimo." },
                { icon: "🔄", title: "Transiciones", desc: "Entrenamientos específicos para cambiar de un deporte a otro con la máxima eficacia." },
                { icon: "💪", title: "Musculación", desc: "Entrenamientos generales y funcionales orientados a mejorar fuerza, resistencia, coordinación y agilidad." },
                { icon: "🏅", title: "Combinados", desc: "Natación y carrera, bici y carrera, simulaciones de triatlones, duatlones y acuatlones." },
              ].map((item) => (
                <div key={item.title} style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", transition: "all .25s" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "var(--display)", fontSize: 15, letterSpacing: 1, marginBottom: 8 }}>{item.title}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.4)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", marginTop: 20, lineHeight: 1.7, fontStyle: "italic" }}>
              Los contenidos de los entrenos grupales los pauta el Cuerpo Técnico, siguiendo una planificación según la época de la temporada, el clima y la luz solar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ CUOTAS ═══ */}
      <section className="sec" id="cuotas">
        <div className="ctn">
          <Reveal><div className="sec-label">{t.cuotas.label}</div></Reveal>
          <Reveal delay={0.05}><div className="sec-title">{t.cuotas.title}</div></Reveal>
          <Reveal delay={0.1}><p className="sec-desc">{t.cuotas.desc}</p></Reveal>
          <div className="cu-grid">
            {t.cuotas.items.map((c, i) => (
              <Reveal key={c.name} delay={0.1 + i * 0.07}>
                <div className={`cu-card ${c.featured ? "ft" : ""}`}>
                  <div className="cu-name">{c.name}</div>
                  <div className="cu-age">{c.age}</div>
                  <div className="cu-acts">
                    {c.activities.map(a => <span key={a} className="cu-act">{a}</span>)}
                  </div>
                  <div className="cu-list">
                    {c.includes.map(item => <div key={item} className="cu-item">{item}</div>)}
                  </div>
                  {c.note && <div className="cu-note">{c.note}</div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TARIFAS ═══ */}
      <section className="sec sec-dark" id="tarifas">
        <div className="ctn">
          <Reveal><div className="sec-label">{t.tarifas.label}</div></Reveal>
          <Reveal delay={0.05}><div className="sec-title">{t.tarifas.title}</div></Reveal>
          <Reveal delay={0.1}><p className="sec-desc">{t.tarifas.desc}</p></Reveal>
          <Reveal delay={0.15}>
            <div className="tf-tabs">
              {["adulto", "joven", "academy"].map(t => (
                <button key={t} className={`tf-tab ${tarifaTab === t ? "ac" : ""}`} onClick={() => setTarifaTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <table className="tf-table">
              <thead>
                <tr>
                  <th>{t.tarifas.actividades}</th>
                  <th>{t.tarifas.trimestre}</th>
                  <th>{t.tarifas.mes}</th>
                  {tarifaTab === "academy" && <th>{t.tarifas.anual}</th>}
                </tr>
              </thead>
              <tbody>
                {TARIFAS[tarifaTab].map(r => (
                  <tr key={r.act}>
                    <td>{r.act}</td>
                    <td>{r.trim}</td>
                    <td>{r.mes}</td>
                    {tarifaTab === "academy" && <td>{r.anual || "—"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="tf-mat">{t.tarifas.matricula}</div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="tf-personal">
              <h4>{t.tarifas.personal.title}</h4>
              <p>
                {t.tarifas.personal.desc}
                <br /><br />
                {t.tarifas.personal.contact} <a href="mailto:info@transtriatlon.com">info@transtriatlon.com</a> o
                <a href="tel:683542061"> 683 542 061</a> (Nico Saenz)
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SPONSORS ═══ */}
      <div className="sp-sec">
        <div className="sp-title">{t.sponsors}</div>
        <div className="sp-track">
          <div className="sp-inner">
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <img key={i} className="sp-logo" src={s.logo} alt={s.name} title={s.name} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="ftr" id="contact">
        <div className="ftr-grid">
          <div>
            <div className="ftr-logo">
              <img src={LOGO} alt="Logo" />
              <span>TRANSTRIATLON</span>
            </div>
            <p className="ftr-desc">{t.footer.desc}</p>
            <div className="ftr-social">
              <a href="https://www.facebook.com/entrenosdetriatlon.nicosaenz" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://www.instagram.com/transtriatlon/" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="https://www.strava.com/athletes/8167392" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg></a>
            </div>
          </div>
          <div>
            <h5>{t.footer.programas}</h5>
            <ul className="ftr-links">
              <li onClick={() => go("programs")}>Funcional</li>
              <li onClick={() => go("programs")}>Joven</li>
              <li onClick={() => go("programs")}>Academy</li>
              <li onClick={() => go("programs")}>Adulto</li>
            </ul>
          </div>
          <div>
            <h5>{t.footer.eventos}</h5>
            <ul className="ftr-links">
              <li>Travessia d'Hivern</li>
              <li>Travessia de Natació</li>
              <li>Triatlón</li>
              <li>Duatlón</li>
              <li>Acuatlón</li>
            </ul>
          </div>
          <div>
            <h5>{t.footer.contacto}</h5>
            <ul className="ftr-links">
              <li><a href="mailto:info@transtriatlon.com">info@transtriatlon.com</a></li>
              <li><a href="tel:683542061">683 542 061</a></li>
              <li>Vilanova i la Geltrú</li>
              <li onClick={() => window.location.hash = "/inscripcion"}>Formulario de Inscripción</li>
            </ul>
          </div>
        </div>
        <div className="ftr-bottom">
          <span>{t.footer.derechos}</span>
          <Link to="/dashboard" style={{ color: "#fff", fontSize: 13, textDecoration: "none", padding: "8px 20px", borderRadius: 100, border: "1px solid rgba(255,255,255,.25)", fontWeight: 600 }}>🔒 Dashboard</Link>
          <span>📍 Vilanova i la Geltrú, Barcelona</span>
        </div>
      </footer>
    </div>
  );
}
