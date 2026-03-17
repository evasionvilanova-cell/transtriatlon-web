import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles.css";

const LOGO = "https://transtriatlon.com/wp-content/uploads/2017/11/Transtriatlón-fondo-blanco.png";
const COACH_PASS = "transtriatlon2026"; // Change this!

export default function Dashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("trainings");
  const [msg, setMsg] = useState("");

  // Trainings state
  const [trainings, setTrainings] = useState([]);
  const [newWeek, setNewWeek] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCats, setNewCats] = useState("Natación,Ciclismo,Carrera,Funcional");
  const [newPdfUrl, setNewPdfUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Athlete code state
  const [athleteCode, setAthleteCode] = useState("");
  const [newCode, setNewCode] = useState("");

  // Banner state
  const [banner, setBanner] = useState({ text: "", cta: "", ctaLink: "" });

  // Events state
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "Triatlón", imgUrl: "" });

  // Ritmos state
  const [ritmos, setRitmos] = useState([]);
  const [newRitmo, setNewRitmo] = useState({ title: "", pdfUrl: "" });

  // Licencias state
  const [licencias, setLicencias] = useState([]);
  const [newLicencia, setNewLicencia] = useState({ title: "", pdfUrl: "" });

  useEffect(() => {
    const saved = sessionStorage.getItem("tt-coach-auth");
    if (saved === "true") setAuth(true);
  }, []);

  const handleLogin = () => {
    if (pass === COACH_PASS) {
      setAuth(true);
      sessionStorage.setItem("tt-coach-auth", "true");
    } else {
      setMsg("Contraseña incorrecta");
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (!auth) return;
    loadTrainings();
    loadAthleteCode();
    loadBanner();
    loadEvents();
    loadRitmos();
    loadLicencias();
  }, [auth]);

  const loadTrainings = async () => {
    try {
      const q = query(collection(db, "trainings"), orderBy("weekStart", "desc"));
      const snap = await getDocs(q);
      setTrainings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  const loadAthleteCode = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "athleteCode"));
      if (snap.exists()) { setAthleteCode(snap.data().code); setNewCode(snap.data().code); }
    } catch (e) { console.error(e); }
  };

  const loadBanner = async () => {
    try {
      const snap = await getDoc(doc(db, "settings", "banner"));
      if (snap.exists()) setBanner(snap.data());
    } catch (e) { console.error(e); }
  };

  const loadEvents = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const snap = await getDocs(q);
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  // ── TRAININGS ──
  const uploadTraining = async () => {
    if (!newWeek || !newPdfUrl) { setMsg("Selecciona semana y pega el enlace del PDF"); return; }
    setUploading(true); setMsg("");
    try {
      await addDoc(collection(db, "trainings"), {
        weekStart: newWeek,
        title: newTitle || `Semana ${newWeek}`,
        categories: newCats.split(",").map(c => c.trim()).filter(Boolean),
        pdfUrl: newPdfUrl,
        createdAt: serverTimestamp(),
      });
      setNewWeek(""); setNewTitle(""); setNewPdfUrl("");
      setMsg("✅ Entrenamiento subido correctamente!");
      loadTrainings();
    } catch (e) { setMsg("❌ Error: " + e.message); }
    setUploading(false);
  };

  const deleteTraining = async (t) => {
    if (!confirm(`¿Eliminar entrenamiento "${t.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "trainings", t.id));
      setMsg("Entrenamiento eliminado");
      loadTrainings();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  // ── ATHLETE CODE ──
  const saveAthleteCode = async () => {
    try {
      await setDoc(doc(db, "settings", "athleteCode"), { code: newCode });
      setAthleteCode(newCode);
      setMsg("✅ Código de atletas actualizado!");
    } catch (e) { setMsg("Error: " + e.message); }
  };

  // ── BANNER ──
  const saveBanner = async () => {
    try {
      await setDoc(doc(db, "settings", "banner"), banner);
      setMsg("✅ Banner actualizado!");
    } catch (e) { setMsg("Error: " + e.message); }
  };

  // ── EVENTS ──
  const addEvent = async () => {
    if (!newEvent.title) { setMsg("El evento necesita un título"); return; }
    try {
      await addDoc(collection(db, "events"), newEvent);
      setNewEvent({ title: "", date: "", type: "Triatlón", imgUrl: "" });
      setMsg("✅ Evento añadido!");
      loadEvents();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  const deleteEvent = async (ev) => {
    if (!confirm(`¿Eliminar "${ev.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "events", ev.id));
      setMsg("Evento eliminado"); loadEvents();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  // ── RITMOS ──
  const loadRitmos = async () => {
    try {
      const q = query(collection(db, "ritmos"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setRitmos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  const addRitmo = async () => {
    if (!newRitmo.title || !newRitmo.pdfUrl) { setMsg("Título y enlace del PDF son obligatorios"); return; }
    try {
      await addDoc(collection(db, "ritmos"), { ...newRitmo, createdAt: serverTimestamp() });
      setNewRitmo({ title: "", pdfUrl: "" });
      setMsg("✅ Ritmo añadido!"); loadRitmos();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  const deleteRitmo = async (r) => {
    if (!confirm(`¿Eliminar "${r.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "ritmos", r.id));
      setMsg("Ritmo eliminado"); loadRitmos();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  // ── LICENCIAS ──
  const loadLicencias = async () => {
    try {
      const q = query(collection(db, "licencias"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setLicencias(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  };

  const addLicencia = async () => {
    if (!newLicencia.title || !newLicencia.pdfUrl) { setMsg("Título y enlace del PDF son obligatorios"); return; }
    try {
      await addDoc(collection(db, "licencias"), { ...newLicencia, createdAt: serverTimestamp() });
      setNewLicencia({ title: "", pdfUrl: "" });
      setMsg("✅ Documento de licencia añadido!"); loadLicencias();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  const deleteLicencia = async (l) => {
    if (!confirm(`¿Eliminar "${l.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "licencias", l.id));
      setMsg("Documento eliminado"); loadLicencias();
    } catch (e) { setMsg("Error: " + e.message); }
  };

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{`
          .dash-login{max-width:380px;width:100%;text-align:center}
          .dash-login img{height:56px;margin:0 auto 20px;filter:brightness(0) invert(1)}
          .dash-login h1{font-family:var(--display);font-size:36px;letter-spacing:2px;margin-bottom:6px}
          .dash-login p{color:rgba(255,255,255,.35);font-size:13px;margin-bottom:28px}
          .dash-input{width:100%;padding:14px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:15px;font-family:var(--font);outline:none}
          .dash-input:focus{border-color:var(--red)}
          .dash-btn{width:100%;padding:14px;border-radius:10px;background:var(--red);color:#fff;font-size:14px;font-weight:600;border:none;cursor:pointer;margin-top:12px;font-family:var(--font)}
          .dash-msg{font-size:12px;margin-top:10px;color:var(--red-l)}
        `}</style>
        <div className="dash-login">
          <img src={LOGO} alt="T" />
          <h1>DASHBOARD</h1>
          <p>Panel de administración para entrenadores</p>
          <input className="dash-input" type="password" placeholder="Contraseña" value={pass}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          <button className="dash-btn" onClick={handleLogin}>Entrar</button>
          {msg && <div className="dash-msg">{msg}</div>}
          <Link to="/" style={{ color: "rgba(255,255,255,.3)", fontSize: 13, marginTop: 20, display: "block" }}>← Volver a la web</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "var(--white)" }}>
      <style>{`
        .d-hdr{background:rgba(11,10,9,.95);border-bottom:1px solid rgba(255,255,255,.06);padding:16px clamp(16px,3vw,32px);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
        .d-hdr-left{display:flex;align-items:center;gap:10px}
        .d-hdr-left img{height:28px;filter:brightness(0) invert(1)}
        .d-hdr-left span{font-family:var(--display);font-size:18px;letter-spacing:2px}
        .d-badge{padding:4px 12px;border-radius:100px;background:rgba(232,30,30,.15);color:var(--red-l);font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-left:10px}

        .d-layout{display:flex;min-height:calc(100vh - 61px)}
        .d-side{width:220px;background:rgba(0,0,0,.3);border-right:1px solid rgba(255,255,255,.06);padding:24px 0;flex-shrink:0}
        .d-side-item{padding:12px 24px;font-size:13px;font-weight:500;color:rgba(255,255,255,.4);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:10px;border-left:3px solid transparent}
        .d-side-item:hover{color:rgba(255,255,255,.7);background:rgba(255,255,255,.03)}
        .d-side-item.ac{color:#fff;border-left-color:var(--red);background:rgba(232,30,30,.06)}
        .d-main{flex:1;padding:32px clamp(16px,3vw,40px);max-width:900px}

        .d-title{font-family:var(--display);font-size:32px;letter-spacing:2px;margin-bottom:8px}
        .d-subtitle{font-size:13px;color:rgba(255,255,255,.35);margin-bottom:32px}
        .d-msg{padding:12px 16px;border-radius:8px;background:rgba(255,255,255,.05);font-size:13px;margin-bottom:24px;border:1px solid rgba(255,255,255,.08)}

        .d-card{padding:24px;border-radius:var(--r);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:16px}
        .d-card h3{font-family:var(--display);font-size:20px;letter-spacing:1px;margin-bottom:16px}

        .d-field{margin-bottom:16px}
        .d-field label{display:block;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px}
        .d-field select option{background:#1a1a1a;color:#fff}
        .d-field input,.d-field textarea,.d-field select{width:100%;padding:12px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:14px;font-family:var(--font);outline:none}
        .d-field input:focus,.d-field textarea:focus{border-color:var(--red)}
        .d-field textarea{min-height:80px;resize:vertical}
        .d-field input[type=file]{padding:10px;font-size:13px}
        .d-field input[type=file]::file-selector-button{background:var(--red);color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;margin-right:10px;font-family:var(--font)}

        .d-row{display:flex;gap:12px;flex-wrap:wrap}
        .d-row .d-field{flex:1;min-width:200px}

        .d-btn{padding:12px 24px;border-radius:10px;background:var(--red);color:#fff;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:var(--font);transition:all .2s}
        .d-btn:hover{background:var(--red-l)}
        .d-btn:disabled{opacity:.5;cursor:not-allowed}
        .d-btn-sm{padding:8px 16px;font-size:12px;border-radius:8px}
        .d-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5)}
        .d-btn-ghost:hover{border-color:var(--red);color:var(--red-l);background:rgba(232,30,30,.06)}
        .d-btn-danger{background:transparent;border:1px solid rgba(255,100,100,.2);color:rgba(255,100,100,.6)}
        .d-btn-danger:hover{background:rgba(255,50,50,.1);color:#ff6666}

        .d-list-item{display:flex;align-items:center;justify-content:space-between;padding:16px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);margin-bottom:10px;gap:12px;flex-wrap:wrap}
        .d-list-item:hover{background:rgba(255,255,255,.04)}
        .d-list-info{flex:1;min-width:200px}
        .d-list-info h4{font-size:14px;font-weight:600}
        .d-list-info p{font-size:12px;color:rgba(255,255,255,.35);margin-top:2px}

        .d-code-display{font-family:monospace;font-size:32px;letter-spacing:8px;color:var(--red);padding:20px;background:rgba(232,30,30,.06);border-radius:12px;text-align:center;border:1px dashed rgba(232,30,30,.2);margin-bottom:20px}

        @media(max-width:768px){
          .d-side{display:none}
          .d-layout{flex-direction:column}
          .d-mob-tabs{display:flex;gap:4px;padding:12px 16px;overflow-x:auto;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.06)}
          .d-mob-tab{padding:8px 16px;border-radius:100px;font-size:12px;font-weight:600;white-space:nowrap;background:rgba(255,255,255,.05);color:rgba(255,255,255,.4);border:none;cursor:pointer;font-family:var(--font)}
          .d-mob-tab.ac{background:var(--red);color:#fff}
        }
        @media(min-width:769px){.d-mob-tabs{display:none}}
      `}</style>

      {/* Header */}
      <div className="d-hdr">
        <div className="d-hdr-left">
          <img src={LOGO} alt="T" />
          <span>TRANSTRIATLON</span>
          <span className="d-badge">Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>Ver web</Link>
          <button className="d-btn d-btn-sm d-btn-ghost" onClick={() => { setAuth(false); sessionStorage.removeItem("tt-coach-auth"); }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="d-mob-tabs">
        {[["trainings","🏋️ Entrenos"],["code","🔑 Código"],["banner","📢 Banner"],["events","🏆 Eventos"],["ritmos","⏱️ Ritmos"],["licencias","📋 Licencias"]].map(([id,label]) => (
          <button key={id} className={`d-mob-tab ${tab===id?"ac":""}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      <div className="d-layout">
        {/* Sidebar */}
        <div className="d-side">
          {[
            { id: "trainings", icon: "🏋️", label: "Entrenamientos" },
            { id: "code", icon: "🔑", label: "Código Atletas" },
            { id: "banner", icon: "📢", label: "Banner" },
            { id: "events", icon: "🏆", label: "Eventos" },
            { id: "ritmos", icon: "⏱️", label: "Ritmos" },
            { id: "licencias", icon: "📋", label: "Licencias" },
          ].map(s => (
            <div key={s.id} className={`d-side-item ${tab === s.id ? "ac" : ""}`} onClick={() => setTab(s.id)}>
              <span>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="d-main">
          {msg && <div className="d-msg">{msg}</div>}

          {/* ── TRAININGS TAB ── */}
          {tab === "trainings" && (
            <>
              <div className="d-title">ENTRENAMIENTOS</div>
              <div className="d-subtitle">Sube los entrenamientos semanales en PDF para tus atletas</div>

              <div className="d-card">
                <h3>SUBIR NUEVO ENTRENAMIENTO</h3>
                <div className="d-row">
                  <div className="d-field">
                    <label>Semana (lunes de inicio)</label>
                    <input type="date" value={newWeek} onChange={(e) => setNewWeek(e.target.value)} />
                  </div>
                  <div className="d-field">
                    <label>Título (opcional)</label>
                    <input type="text" placeholder="Ej: Semana de carga" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>
                </div>
                <div className="d-field">
                  <label>Categorías (separadas por coma)</label>
                  <input type="text" value={newCats} onChange={(e) => setNewCats(e.target.value)} />
                </div>
                <div className="d-field">
                  <label>Enlace del PDF (Google Drive, Dropbox, etc.)</label>
                  <input type="url" placeholder="https://drive.google.com/file/d/..." value={newPdfUrl} onChange={(e) => setNewPdfUrl(e.target.value)} />
                </div>
                <button className="d-btn" onClick={uploadTraining} disabled={uploading}>
                  {uploading ? "Subiendo..." : "📤 Subir Entrenamiento"}
                </button>
              </div>

              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: 1, margin: "32px 0 16px" }}>
                ENTRENAMIENTOS SUBIDOS ({trainings.length})
              </h3>
              {trainings.map(t => (
                <div key={t.id} className="d-list-item">
                  <div className="d-list-info">
                    <h4>{t.title}</h4>
                    <p>Semana del {t.weekStart} · {(t.categories || []).join(", ")}</p>
                  </div>
                  <button className="d-btn d-btn-sm d-btn-danger" onClick={() => deleteTraining(t)}>Eliminar</button>
                </div>
              ))}
            </>
          )}

          {/* ── CODE TAB ── */}
          {tab === "code" && (
            <>
              <div className="d-title">CÓDIGO DE ACCESO ATLETAS</div>
              <div className="d-subtitle">Crea o cambia el código que los atletas usan para acceder a sus entrenamientos</div>

              <div className="d-card">
                <h3>CÓDIGO ACTUAL</h3>
                {athleteCode ? (
                  <div className="d-code-display">{athleteCode}</div>
                ) : (
                  <p style={{ color: "rgba(255,255,255,.35)", marginBottom: 16 }}>No hay código configurado todavía.</p>
                )}
                <div className="d-field">
                  <label>Nuevo código</label>
                  <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="Ej: TRANS2026" maxLength={12} style={{ letterSpacing: 4, fontSize: 18 }} />
                </div>
                <button className="d-btn" onClick={saveAthleteCode}>💾 Guardar Código</button>
              </div>

              <div className="d-card" style={{ marginTop: 16 }}>
                <h3>CÓMO FUNCIONA</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
                  1. Crea un código aquí (ej: TRANS2026)<br />
                  2. Compártelo con tus atletas registrados<br />
                  3. Los atletas van a la página "Acceso Atletas" e introducen el código<br />
                  4. Una vez autenticados, ven todos los entrenamientos que hayas subido<br />
                  5. Puedes cambiar el código cuando quieras — los atletas necesitarán el nuevo
                </p>
              </div>
            </>
          )}

          {/* ── BANNER TAB ── */}
          {tab === "banner" && (
            <>
              <div className="d-title">BANNER DE LA HOME</div>
              <div className="d-subtitle">Edita el banner rojo que aparece debajo del menú en la página principal</div>

              <div className="d-card">
                <h3>EDITAR BANNER</h3>
                <div className="d-field">
                  <label>Texto del banner</label>
                  <input type="text" value={banner.text} onChange={(e) => setBanner({ ...banner, text: e.target.value })}
                    placeholder="📣 Inscripciones abiertas..." />
                </div>
                <div className="d-row">
                  <div className="d-field">
                    <label>Texto del botón</label>
                    <input type="text" value={banner.cta} onChange={(e) => setBanner({ ...banner, cta: e.target.value })}
                      placeholder="Inscríbete" />
                  </div>
                  <div className="d-field">
                    <label>Enlace del botón</label>
                    <input type="url" value={banner.ctaLink} onChange={(e) => setBanner({ ...banner, ctaLink: e.target.value })}
                      placeholder="https://..." />
                  </div>
                </div>
                <button className="d-btn" onClick={saveBanner}>💾 Guardar Banner</button>
              </div>

              <div className="d-card" style={{ marginTop: 16 }}>
                <h3>PREVISUALIZACIÓN</h3>
                <div style={{ background: "var(--red)", padding: "14px 20px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{banner.text || "Texto del banner..."}</span>
                  <span style={{ padding: "6px 16px", borderRadius: 100, background: "#fff", color: "var(--red)", fontSize: 12, fontWeight: 700 }}>
                    {banner.cta || "BOTÓN"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ── EVENTS TAB ── */}
          {tab === "events" && (
            <>
              <div className="d-title">TRANSEVENTOS</div>
              <div className="d-subtitle">Gestiona los eventos y competiciones que aparecen en la home</div>

              <div className="d-card">
                <h3>AÑADIR EVENTO</h3>
                <div className="d-row">
                  <div className="d-field">
                    <label>Nombre del evento</label>
                    <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Ej: Travessia d'Hivern" />
                  </div>
                  <div className="d-field">
                    <label>Fecha</label>
                    <input type="text" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      placeholder="Ej: Enero 2026" />
                  </div>
                </div>
                <div className="d-row">
                  <div className="d-field">
                    <label>Tipo</label>
                    <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                      <option>Triatlón</option><option>Duatlón</option><option>Acuatlón</option>
                      <option>Natación</option><option>Aquabike</option><option>Swimrun</option>
                    </select>
                  </div>
                  <div className="d-field">
                    <label>URL imagen del cartel</label>
                    <input type="url" value={newEvent.imgUrl} onChange={(e) => setNewEvent({ ...newEvent, imgUrl: e.target.value })}
                      placeholder="https://..." />
                  </div>
                </div>
                <button className="d-btn" onClick={addEvent}>➕ Añadir Evento</button>
              </div>

              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: 1, margin: "32px 0 16px" }}>
                EVENTOS ACTUALES ({events.length})
              </h3>
              {events.map(ev => (
                <div key={ev.id} className="d-list-item">
                  <div className="d-list-info">
                    <h4>{ev.title}</h4>
                    <p>{ev.date} · {ev.type}</p>
                  </div>
                  <button className="d-btn d-btn-sm d-btn-danger" onClick={() => deleteEvent(ev)}>Eliminar</button>
                </div>
              ))}
            </>
          )}

          {/* ── RITMOS TAB ── */}
          {tab === "ritmos" && (
            <>
              <div className="d-title">RITMOS</div>
              <div className="d-subtitle">Sube tablas de ritmos y zonas de entreno en PDF para tus atletas</div>

              <div className="d-card">
                <h3>AÑADIR DOCUMENTO DE RITMOS</h3>
                <div className="d-row">
                  <div className="d-field">
                    <label>Título</label>
                    <input type="text" placeholder="Ej: Tabla de ritmos natación T1" value={newRitmo.title}
                      onChange={(e) => setNewRitmo({ ...newRitmo, title: e.target.value })} />
                  </div>
                  <div className="d-field">
                    <label>Enlace del PDF</label>
                    <input type="url" placeholder="https://drive.google.com/file/d/..." value={newRitmo.pdfUrl}
                      onChange={(e) => setNewRitmo({ ...newRitmo, pdfUrl: e.target.value })} />
                  </div>
                </div>
                <button className="d-btn" onClick={addRitmo}>📤 Añadir Ritmo</button>
              </div>

              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: 1, margin: "32px 0 16px" }}>
                DOCUMENTOS DE RITMOS ({ritmos.length})
              </h3>
              {ritmos.length === 0 && <p style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No hay documentos de ritmos todavía.</p>}
              {ritmos.map(r => (
                <div key={r.id} className="d-list-item">
                  <div className="d-list-info">
                    <h4>⏱️ {r.title}</h4>
                    <p style={{ fontSize: 11, wordBreak: "break-all" }}>{r.pdfUrl}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={r.pdfUrl} target="_blank" rel="noreferrer" className="d-btn d-btn-sm d-btn-ghost" style={{ textDecoration: "none" }}>Ver PDF</a>
                    <button className="d-btn d-btn-sm d-btn-danger" onClick={() => deleteRitmo(r)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── LICENCIAS TAB ── */}
          {tab === "licencias" && (
            <>
              <div className="d-title">TRAMITACIÓN LICENCIAS</div>
              <div className="d-subtitle">Sube documentos PDF sobre tramitación de licencias federativas para tus atletas</div>

              <div className="d-card">
                <h3>AÑADIR DOCUMENTO DE LICENCIA</h3>
                <div className="d-row">
                  <div className="d-field">
                    <label>Título</label>
                    <input type="text" placeholder="Ej: Formulario licencia federativa 2026" value={newLicencia.title}
                      onChange={(e) => setNewLicencia({ ...newLicencia, title: e.target.value })} />
                  </div>
                  <div className="d-field">
                    <label>Enlace del PDF</label>
                    <input type="url" placeholder="https://drive.google.com/file/d/..." value={newLicencia.pdfUrl}
                      onChange={(e) => setNewLicencia({ ...newLicencia, pdfUrl: e.target.value })} />
                  </div>
                </div>
                <button className="d-btn" onClick={addLicencia}>📤 Añadir Documento</button>
              </div>

              <h3 style={{ fontFamily: "var(--display)", fontSize: 22, letterSpacing: 1, margin: "32px 0 16px" }}>
                DOCUMENTOS DE LICENCIAS ({licencias.length})
              </h3>
              {licencias.length === 0 && <p style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No hay documentos de licencias todavía.</p>}
              {licencias.map(l => (
                <div key={l.id} className="d-list-item">
                  <div className="d-list-info">
                    <h4>📋 {l.title}</h4>
                    <p style={{ fontSize: 11, wordBreak: "break-all" }}>{l.pdfUrl}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={l.pdfUrl} target="_blank" rel="noreferrer" className="d-btn d-btn-sm d-btn-ghost" style={{ textDecoration: "none" }}>Ver PDF</a>
                    <button className="d-btn d-btn-sm d-btn-danger" onClick={() => deleteLicencia(l)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
