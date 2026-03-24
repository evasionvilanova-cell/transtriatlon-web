import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import "../styles.css";

const LOGO = "https://transtriatlon.com/wp-content/uploads/2017/11/Transtriatlón-fondo-blanco.png";
const DEFAULT_IMG = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop";

export default function TransEventos() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Handle ISO format: 2025-12-28
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr + "T00:00:00");
    // Handle text format
    const months = { enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,setembre:8,octubre:9,noviembre:10,diciembre:11 };
    const parts = dateStr.toLowerCase().replace(/de /g, "").trim().split(/\s+/);
    for (const [name, idx] of Object.entries(months)) {
      for (const p of parts) {
        if (p.startsWith(name.substring(0, 3))) {
          const year = parts.find(x => /^\d{4}$/.test(x));
          return new Date(year ? parseInt(year) : new Date().getFullYear(), idx, parts.find(x => /^\d{1,2}$/.test(x)) || 1);
        }
      }
    }
    return null;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    }
    return dateStr;
  };

  const now = new Date();
  now.setHours(0,0,0,0);
  const upcoming = events.filter(e => { const d = parseDate(e.date); return !d || d >= now; });
  const past = events.filter(e => { const d = parseDate(e.date); return d && d < now; }).reverse();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{`
        .te-hdr{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.06)}
        .te-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .te-hdr-logo img{height:32px}
        .te-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:var(--text)}
        .te-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(0,0,0,.1);background:transparent;color:var(--text2);font-size:12px;font-weight:500;cursor:pointer;font-family:var(--font);transition:all .2s;text-decoration:none}
        .te-back:hover{border-color:var(--red);color:var(--red)}

        .te-hero{padding:clamp(48px,8vw,80px) clamp(16px,4vw,48px) 32px;text-align:center}
        .te-hero-label{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:10px}
        .te-hero h1{font-family:var(--display);font-size:clamp(42px,7vw,80px);letter-spacing:2px;line-height:1}
        .te-hero p{font-size:16px;color:var(--text2);margin-top:12px;max-width:500px;margin-inline:auto}

        .te-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;padding:0 clamp(16px,4vw,48px) 80px;max-width:1200px;margin:0 auto}
        .te-card{border-radius:var(--r);overflow:hidden;background:#fff;border:1px solid rgba(0,0,0,.06);transition:all .35s;cursor:pointer}
        .te-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.08);border-color:rgba(232,30,30,.15)}
        .te-card-img{aspect-ratio:4/3;overflow:hidden;position:relative}
        .te-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
        .te-card:hover .te-card-img img{transform:scale(1.05)}
        .te-card-type{position:absolute;top:12px;left:12px;padding:4px 12px;border-radius:100px;background:var(--red);color:#fff;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
        .te-card-body{padding:20px}
        .te-card-body h3{font-family:var(--display);font-size:24px;letter-spacing:1.5px}
        .te-card-body .date{font-size:13px;color:var(--text2);margin-top:4px}

        /* DETAIL VIEW */
        .te-detail{max-width:800px;margin:0 auto;padding:0 clamp(16px,4vw,48px) 80px}
        .te-detail-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text2);cursor:pointer;margin-bottom:24px;transition:color .2s}
        .te-detail-back:hover{color:var(--red)}
        .te-detail-img{width:100%;max-width:500px;border-radius:var(--r);overflow:hidden;margin-bottom:32px}
        .te-detail-img img{width:100%;height:auto;display:block}
        .te-detail h1{font-family:var(--display);font-size:clamp(36px,5vw,56px);letter-spacing:2px;line-height:1;margin-bottom:8px}
        .te-detail-meta{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:28px}
        .te-detail-tag{padding:6px 16px;border-radius:100px;font-size:12px;font-weight:600;letter-spacing:1px}
        .te-detail-tag.type{background:rgba(232,30,30,.08);color:var(--red)}
        .te-detail-tag.date{background:rgba(0,0,0,.04);color:var(--text2)}
        .te-detail-desc{font-size:16px;line-height:1.8;color:var(--text2);margin-bottom:32px;white-space:pre-wrap}
        .te-detail-docs{display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
        .te-detail-docs h3{font-family:var(--display);font-size:22px;letter-spacing:1.5px;margin-bottom:8px;color:var(--text)}
        .te-doc-link{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:12px;background:rgba(232,30,30,.06);border:1px solid rgba(232,30,30,.1);color:var(--red);font-size:14px;font-weight:600;text-decoration:none;transition:all .25s}
        .te-doc-link:hover{background:var(--red);color:#fff;border-color:var(--red)}
        .te-inscripcion{display:inline-flex;align-items:center;gap:8px;padding:16px 32px;border-radius:100px;background:var(--red);color:#fff;font-size:15px;font-weight:700;text-decoration:none;transition:all .25s;letter-spacing:.5px}
        .te-inscripcion:hover{background:var(--red-l);transform:translateY(-2px);box-shadow:0 8px 24px var(--red-glow)}

        .te-loading{text-align:center;padding:80px;color:var(--text2)}
        .te-empty{text-align:center;padding:80px;color:var(--text2);font-size:15px}
      `}</style>

      <div className="te-hdr">
        <Link to="/" className="te-hdr-logo">
          <img src={LOGO} alt="T" />
          <span>TRANSTRIATLON</span>
        </Link>
        <Link to="/" className="te-back">← Volver</Link>
      </div>

      {!selected ? (
        <>
          <div className="te-hero">
            <div className="te-hero-label">TransEventos</div>
            <h1>COMPETICIONES Y EVENTOS</h1>
            <p>Descubre todas las competiciones organizadas por Transtriatlon en Vilanova i la Geltrú.</p>
          </div>

          {loading ? (
            <div className="te-loading">Cargando eventos...</div>
          ) : events.length === 0 ? (
            <div className="te-empty">No hay eventos disponibles.</div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 style={{ fontFamily: "var(--display)", fontSize: 28, letterSpacing: 2, padding: "0 clamp(16px,4vw,48px)", maxWidth: 1200, margin: "0 auto 20px" }}>
                    PRÓXIMOS EVENTOS
                  </h2>
                  <div className="te-grid">
                    {upcoming.map(ev => (
                      <div key={ev.id} className="te-card" onClick={() => setSelected(ev)}>
                        <div className="te-card-img">
                          <img src={ev.imgUrl || DEFAULT_IMG} alt={ev.title} />
                          <div className="te-card-type">{ev.type}</div>
                        </div>
                        <div className="te-card-body">
                          <h3>{ev.title}</h3>
                          <div className="date">{formatDate(ev.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {past.length > 0 && (
                <>
                  <h2 style={{ fontFamily: "var(--display)", fontSize: 28, letterSpacing: 2, padding: "48px clamp(16px,4vw,48px) 20px", maxWidth: 1200, margin: "0 auto", color: "var(--text2)" }}>
                    EVENTOS PASADOS
                  </h2>
                  <div className="te-grid" style={{ opacity: 0.7 }}>
                    {past.map(ev => (
                      <div key={ev.id} className="te-card" onClick={() => setSelected(ev)}>
                        <div className="te-card-img">
                          <img src={ev.imgUrl || DEFAULT_IMG} alt={ev.title} />
                          <div className="te-card-type" style={{ background: "#666" }}>{ev.type}</div>
                          {ev.resultadosUrl && <div style={{ position: "absolute", bottom: 12, right: 12, padding: "4px 12px", borderRadius: 100, background: "#fff", color: "var(--text)", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>📊 RESULTADOS</div>}
                        </div>
                        <div className="te-card-body">
                          <h3>{ev.title}</h3>
                          <div className="date">{formatDate(ev.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <div style={{ paddingTop: 40 }}>
          <div className="te-detail">
            <div className="te-detail-back" onClick={() => setSelected(null)}>← Volver a todos los eventos</div>

            {selected.imgUrl && (
              <div className="te-detail-img">
                <img src={selected.imgUrl} alt={selected.title} />
              </div>
            )}

            <h1>{selected.title}</h1>
            <div className="te-detail-meta">
              <span className="te-detail-tag type">{selected.type}</span>
              <span className="te-detail-tag date">{formatDate(selected.date)}</span>
            </div>

            {selected.description && (
              <div className="te-detail-desc">
                {selected.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                  /^https?:\/\//.test(part) ? (
                    <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: "var(--red)", wordBreak: "break-all" }}>{part}</a>
                  ) : part
                )}
              </div>
            )}

            {(selected.reglamentoUrl || selected.inscripcionUrl || selected.resultadosUrl) && (
              <div className="te-detail-docs">
                <h3>DOCUMENTOS Y ENLACES</h3>
                {selected.reglamentoUrl && (
                  <a href={selected.reglamentoUrl} target="_blank" rel="noreferrer" className="te-doc-link">
                    📄 Reglamento del evento
                  </a>
                )}
                {selected.resultadosUrl && (
                  <a href={selected.resultadosUrl} target="_blank" rel="noreferrer" className="te-doc-link" style={{ background: "rgba(0,150,0,.06)", borderColor: "rgba(0,150,0,.15)", color: "#0a8a0a" }}>
                    📊 Resultados
                  </a>
                )}
                {selected.inscripcionUrl && (
                  <a href={selected.inscripcionUrl} target="_blank" rel="noreferrer" className="te-inscripcion">
                    🏁 Inscríbete en este evento
                  </a>
                )}
              </div>
            )}

            {!selected.description && !selected.reglamentoUrl && !selected.inscripcionUrl && !selected.resultadosUrl && (
              <p style={{ color: "var(--text2)", fontSize: 15, marginTop: 16 }}>
                Próximamente más información sobre este evento. Contacta con nosotros para más detalles.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
