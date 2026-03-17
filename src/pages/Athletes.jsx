import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import "../styles.css";

const LOGO = "https://transtriatlon.com/wp-content/uploads/2017/11/Transtriatlón-fondo-blanco.png";

export default function Athletes() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [trainings, setTrainings] = useState([]);
  const [ritmos, setRitmos] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if already authenticated in session
  useEffect(() => {
    const saved = sessionStorage.getItem("tt-athlete-auth");
    if (saved === "true") setAuthenticated(true);
  }, []);

  const handleLogin = async () => {
    setError("");
    try {
      const snap = await getDoc(doc(db, "settings", "athleteCode"));
      if (snap.exists() && snap.data().code === code) {
        setAuthenticated(true);
        sessionStorage.setItem("tt-athlete-auth", "true");
      } else {
        setError("Código incorrecto. Contacta con tu entrenador.");
      }
    } catch (e) {
      setError("Error de conexión. Inténtalo de nuevo.");
    }
  };

  // Load trainings once authenticated
  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    const load = async () => {
      try {
        const q = query(collection(db, "trainings"), orderBy("weekStart", "desc"));
        const snap = await getDocs(q);
        const items = [];
        for (const d of snap.docs) {
          const data = d.data();
          items.push({ id: d.id, ...data });
        }
        setTrainings(items);

        // Load ritmos
        const qr = query(collection(db, "ritmos"), orderBy("createdAt", "desc"));
        const snapR = await getDocs(qr);
        setRitmos(snapR.docs.map(d => ({ id: d.id, ...d.data() })));

        // Load licencias
        const ql = query(collection(db, "licencias"), orderBy("createdAt", "desc"));
        const snapL = await getDocs(ql);
        setLicencias(snapL.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [authenticated]);

  const formatWeek = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const end = new Date(d); end.setDate(end.getDate() + 6);
    const opts = { day: "numeric", month: "short" };
    return `${d.toLocaleDateString("es-ES", opts)} — ${end.toLocaleDateString("es-ES", opts)} ${d.getFullYear()}`;
  };

  const isCurrentWeek = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    const end = new Date(d); end.setDate(end.getDate() + 6);
    return now >= d && now <= end;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)" }}>
      <style>{`
        .ath-login{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .ath-login-box{max-width:400px;width:100%;text-align:center}
        .ath-login-box img{height:64px;margin:0 auto 24px}
        .ath-login-box h1{font-family:var(--display);font-size:42px;letter-spacing:2px;margin-bottom:8px}
        .ath-login-box p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:32px;line-height:1.6}
        .ath-input{width:100%;padding:16px 20px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:18px;font-family:var(--font);text-align:center;letter-spacing:6px;outline:none;transition:border .3s}
        .ath-input:focus{border-color:var(--red)}
        .ath-input::placeholder{letter-spacing:2px;color:rgba(255,255,255,.2)}
        .ath-btn{width:100%;padding:16px;border-radius:12px;background:var(--red);color:#fff;font-size:15px;font-weight:600;border:none;cursor:pointer;margin-top:16px;font-family:var(--font);transition:all .25s}
        .ath-btn:hover{background:var(--red-l);transform:translateY(-1px)}
        .ath-error{color:var(--red-l);font-size:13px;margin-top:12px}
        .ath-back{color:rgba(255,255,255,.3);font-size:13px;margin-top:24px;display:block}
        .ath-back:hover{color:var(--red-l)}

        .ath-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.94);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .ath-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .ath-hdr-logo img{height:32px}
        .ath-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .ath-hdr-badge{padding:6px 14px;border-radius:100px;background:rgba(232,30,30,.12);color:var(--red-l);font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
        .ath-logout{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer;font-family:var(--font);transition:all .2s}
        .ath-logout:hover{border-color:var(--red);color:var(--red-l)}

        .ath-welcome{padding:48px clamp(16px,4vw,48px) 0;max-width:1140px;margin:0 auto}
        .ath-welcome h1{font-family:var(--display);font-size:clamp(32px,5vw,52px);letter-spacing:2px}
        .ath-welcome p{color:rgba(255,255,255,.4);font-size:15px;margin-top:8px}

        .ath-sections{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:32px clamp(16px,4vw,48px);max-width:1140px;margin:0 auto}
        .ath-sec-card{padding:28px;border-radius:var(--r);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);text-align:center;transition:all .3s;cursor:pointer}
        .ath-sec-card:hover{background:rgba(232,30,30,.06);border-color:rgba(232,30,30,.2);transform:translateY(-2px)}
        .ath-sec-icon{font-size:36px;margin-bottom:12px}
        .ath-sec-card h3{font-family:var(--display);font-size:20px;letter-spacing:2px}
        .ath-sec-card p{font-size:12px;color:rgba(255,255,255,.35);margin-top:4px}

        .ath-trainings{padding:24px clamp(16px,4vw,48px) 80px;max-width:1140px;margin:0 auto}
        .ath-trainings h2{font-family:var(--display);font-size:32px;letter-spacing:2px;margin-bottom:24px}
        .ath-week{padding:28px;border-radius:var(--r);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:16px;transition:all .3s;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .ath-week:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1)}
        .ath-week.current{border-color:var(--red);background:rgba(232,30,30,.06)}
        .ath-week-info{flex:1;min-width:200px}
        .ath-week-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--red);margin-bottom:4px}
        .ath-week-date{font-family:var(--display);font-size:22px;letter-spacing:1px}
        .ath-week-title{font-size:14px;color:rgba(255,255,255,.45);margin-top:4px}
        .ath-week-tags{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
        .ath-week-tag{padding:3px 10px;border-radius:100px;background:rgba(255,255,255,.06);font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.4)}
        .ath-dl{padding:12px 24px;border-radius:12px;background:var(--red);color:#fff;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .25s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:var(--font);flex-shrink:0}
        .ath-dl:hover{background:var(--red-l);transform:translateY(-1px)}
        .ath-empty{text-align:center;padding:60px 20px;color:rgba(255,255,255,.3);font-size:15px}
        .ath-loading{text-align:center;padding:60px;color:rgba(255,255,255,.3)}
        .ath-loading .spinner{width:32px;height:32px;border:3px solid rgba(255,255,255,.1);border-top-color:var(--red);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:768px){
          .ath-sections{grid-template-columns:1fr}
          .ath-week{flex-direction:column;align-items:flex-start}
        }
      `}</style>

      {!authenticated ? (
        /* ── LOGIN SCREEN ── */
        <div className="ath-login">
          <div className="ath-login-box">
            <img src={LOGO} alt="Transtriatlon" style={{ filter: "brightness(0) invert(1)" }} />
            <h1>ACCESO ATLETAS</h1>
            <p>Bienvenido/a Atleta! Introduce el código que te ha proporcionado tu entrenador para acceder a los entrenamientos.</p>
            <input
              className="ath-input"
              type="text"
              placeholder="Código de acceso"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              maxLength={12}
            />
            <button className="ath-btn" onClick={handleLogin}>Acceder</button>
            {error && <div className="ath-error">{error}</div>}
            <Link to="/" className="ath-back">← Volver a la web</Link>
          </div>
        </div>
      ) : (
        /* ── AUTHENTICATED AREA ── */
        <>
          <div className="ath-hdr">
            <Link to="/" className="ath-hdr-logo">
              <img src={LOGO} alt="T" style={{ filter: "brightness(0) invert(1)" }} />
              <span>TRANSTRIATLON</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="ath-hdr-badge">Zona Atletas</div>
              <button className="ath-logout" onClick={() => { setAuthenticated(false); sessionStorage.removeItem("tt-athlete-auth"); }}>
                Salir
              </button>
            </div>
          </div>

          <div className="ath-welcome">
            <h1>BIENVENIDO, ATLETA!</h1>
            <p>Aquí encontrarás tus entrenamientos semanales, documentación y recursos.</p>
          </div>

          {/* Quick access sections */}
          <div className="ath-sections">
            <div className="ath-sec-card" onClick={() => document.getElementById("trainings")?.scrollIntoView({ behavior: "smooth" })}>
              <div className="ath-sec-icon">🏋️</div>
              <h3>ENTRENAMIENTOS</h3>
              <p>Planes semanales en PDF</p>
            </div>
            <div className="ath-sec-card" onClick={() => document.getElementById("licencias")?.scrollIntoView({ behavior: "smooth" })}>
              <div className="ath-sec-icon">📋</div>
              <h3>TRAMITACIÓN LICENCIA</h3>
              <p>Federació Catalana de Triatló</p>
            </div>
            <div className="ath-sec-card" onClick={() => document.getElementById("ritmos")?.scrollIntoView({ behavior: "smooth" })}>
              <div className="ath-sec-icon">⏱️</div>
              <h3>RITMOS</h3>
              <p>Tablas y zonas de entreno</p>
            </div>
          </div>

          {/* Training cards */}
          <div className="ath-trainings" id="trainings">
            <h2>ENTRENAMIENTOS SEMANALES</h2>
            {loading ? (
              <div className="ath-loading">
                <div className="spinner" />
                Cargando entrenamientos...
              </div>
            ) : trainings.length === 0 ? (
              <div className="ath-empty">No hay entrenamientos disponibles todavía.</div>
            ) : (
              trainings.map((t) => (
                <div key={t.id} className={`ath-week ${isCurrentWeek(t.weekStart) ? "current" : ""}`}>
                  <div className="ath-week-info">
                    {isCurrentWeek(t.weekStart) && <div className="ath-week-label">Semana actual</div>}
                    <div className="ath-week-date">{formatWeek(t.weekStart)}</div>
                    {t.title && <div className="ath-week-title">{t.title}</div>}
                    <div className="ath-week-tags">
                      {(t.categories || []).map((c) => <span key={c} className="ath-week-tag">{c}</span>)}
                    </div>
                  </div>
                  {t.pdfUrl && (
                    <a href={t.pdfUrl} target="_blank" rel="noreferrer" className="ath-dl">
                      📄 Descargar PDF
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Licencias section */}
          <div className="ath-trainings" id="licencias">
            <h2>TRAMITACIÓN LICENCIA</h2>
            {licencias.length === 0 ? (
              <div className="ath-empty">No hay documentos de licencias disponibles todavía.</div>
            ) : (
              licencias.map((l) => (
                <div key={l.id} className="ath-week">
                  <div className="ath-week-info">
                    <div className="ath-week-date">📋 {l.title}</div>
                  </div>
                  <a href={l.pdfUrl} target="_blank" rel="noreferrer" className="ath-dl">
                    📄 Ver PDF
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Ritmos section */}
          <div className="ath-trainings" id="ritmos" style={{ paddingBottom: 80 }}>
            <h2>RITMOS</h2>
            {ritmos.length === 0 ? (
              <div className="ath-empty">No hay documentos de ritmos disponibles todavía.</div>
            ) : (
              ritmos.map((r) => (
                <div key={r.id} className="ath-week">
                  <div className="ath-week-info">
                    <div className="ath-week-date">⏱️ {r.title}</div>
                  </div>
                  <a href={r.pdfUrl} target="_blank" rel="noreferrer" className="ath-dl">
                    📄 Ver PDF
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
