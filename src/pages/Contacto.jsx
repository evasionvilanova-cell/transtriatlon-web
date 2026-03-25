import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles.css";

const LOGO = "https://lh3.googleusercontent.com/d/1k4Vbce4KpniDHESGgsp-FJ-9k1WIX8Iy";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", movil: "", asunto: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre || !form.email || !form.mensaje) {
      setError("Por favor, rellena nombre, email y mensaje."); return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "mensajes"), { ...form, leido: false, createdAt: serverTimestamp() });
      // Send email notification
      try {
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: "service_izil5gw",
            template_id: "template_7x13b34",
            user_id: "5ij6Os2ZEaSZ2PWHb",
            template_params: {
              tipo: "Mensaje de Contacto",
              nombre: form.nombre,
              email: form.email,
              movil: form.movil || "No indicado",
              detalle: `Asunto: ${form.asunto || "General"}\n\nMensaje:\n${form.mensaje}`,
            },
          }),
        });
      } catch (e) { /* email failed silently */ }
      setSent(true);
    } catch (e) { setError("Error al enviar: " + e.message); }
    setSending(false);
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: 42, letterSpacing: 2, marginBottom: 12 }}>¡MENSAJE ENVIADO!</h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible.
          </p>
          <Link to="/" style={{ padding: "14px 32px", borderRadius: 100, background: "var(--red)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Volver a la web
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)" }}>
      <style>{`
        .ct-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.95);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .ct-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .ct-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .ct-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .ct-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:12px;text-decoration:none;transition:all .2s}
        .ct-back:hover{border-color:var(--red);color:var(--red-l)}

        .ct-layout{display:grid;grid-template-columns:1fr 1fr;gap:64px;max-width:1000px;margin:0 auto;padding:clamp(48px,8vw,80px) clamp(16px,4vw,48px) 80px;align-items:start}

        .ct-info h1{font-family:var(--display);font-size:clamp(36px,5vw,52px);letter-spacing:2px;line-height:1;margin-bottom:16px}
        .ct-info>p{color:rgba(255,255,255,.4);font-size:15px;line-height:1.7;margin-bottom:32px}
        .ct-detail{display:flex;flex-direction:column;gap:20px}
        .ct-detail-item{display:flex;gap:14px;align-items:flex-start}
        .ct-detail-icon{width:40px;height:40px;border-radius:10px;background:rgba(232,30,30,.1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .ct-detail-item h4{font-size:14px;font-weight:600;margin-bottom:2px}
        .ct-detail-item p{font-size:13px;color:rgba(255,255,255,.4)}
        .ct-detail-item a{color:var(--red-l);text-decoration:none}
        .ct-detail-item a:hover{text-decoration:underline}
        .ct-social{display:flex;gap:10px;margin-top:28px}
        .ct-social a{width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);font-size:14px;font-weight:700;transition:all .25s}
        .ct-social a:hover{background:var(--red);color:#fff;border-color:var(--red)}

        .ct-form{padding:36px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)}
        .ct-form h2{font-family:var(--display);font-size:24px;letter-spacing:1.5px;margin-bottom:24px}
        .ct-field{margin-bottom:18px}
        .ct-field label{display:block;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px}
        .ct-field .req{color:var(--red)}
        .ct-field input,.ct-field textarea,.ct-field select{width:100%;padding:13px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:14px;font-family:var(--font);outline:none;transition:border .25s}
        .ct-field input:focus,.ct-field textarea:focus{border-color:var(--red)}
        .ct-field textarea{min-height:120px;resize:vertical}
        .ct-field select option{background:#1a1a1a;color:#fff}
        .ct-submit{width:100%;padding:16px;border-radius:12px;background:var(--red);color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;font-family:var(--font);transition:all .25s;letter-spacing:.5px}
        .ct-submit:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 8px 24px var(--red-glow)}
        .ct-submit:disabled{opacity:.5;cursor:not-allowed}
        .ct-error{color:var(--red-l);font-size:13px;margin-top:12px;text-align:center}

        @media(max-width:768px){
          .ct-layout{grid-template-columns:1fr;gap:40px}
        }
      `}</style>

      <div className="ct-hdr">
        <Link to="/" className="ct-hdr-logo">
          <img src={LOGO} alt="T" />
          <span>TRANSTRIATLON</span>
        </Link>
        <Link to="/" className="ct-back">← Volver</Link>
      </div>

      <div className="ct-layout">
        <div className="ct-info">
          <h1>CONTACTA CON NOSOTROS</h1>
          <p>¿Tienes alguna pregunta? ¿Quieres más información sobre entrenamientos, cuotas o eventos? Escríbenos y te responderemos lo antes posible.</p>

          <div className="ct-detail">
            <div className="ct-detail-item">
              <div className="ct-detail-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p><a href="mailto:info@transtriatlon.com">info@transtriatlon.com</a></p>
              </div>
            </div>
            <div className="ct-detail-item">
              <div className="ct-detail-icon">📱</div>
              <div>
                <h4>Teléfono</h4>
                <p><a href="tel:683542061">683 542 061</a> (Nico Saenz)</p>
              </div>
            </div>
            <div className="ct-detail-item">
              <div className="ct-detail-icon">📍</div>
              <div>
                <h4>Ubicación</h4>
                <p>Vilanova i la Geltrú, Barcelona</p>
              </div>
            </div>
          </div>

          <div className="ct-social">
            <a href="https://www.facebook.com/entrenosdetriatlon.nicosaenz" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="https://www.instagram.com/transtriatlon/" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a href="https://www.strava.com/athletes/8167392" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg></a>
          </div>
        </div>

        <div className="ct-form">
          <h2>ENVÍANOS UN MENSAJE</h2>
          <div className="ct-field">
            <label>Nombre <span className="req">*</span></label>
            <input type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="ct-field">
            <label>Email <span className="req">*</span></label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" />
          </div>
          <div className="ct-field">
            <label>Móvil</label>
            <input type="tel" value={form.movil} onChange={(e) => set("movil", e.target.value)} placeholder="600 000 000" />
          </div>
          <div className="ct-field">
            <label>Asunto</label>
            <select value={form.asunto} onChange={(e) => set("asunto", e.target.value)}>
              <option value="">Selecciona un tema</option>
              <option>Información general</option>
              <option>Inscripción</option>
              <option>Entrenamientos</option>
              <option>Eventos / Competiciones</option>
              <option>Cuotas y tarifas</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="ct-field">
            <label>Mensaje <span className="req">*</span></label>
            <textarea value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} placeholder="Escribe tu mensaje aquí..." />
          </div>
          <button className="ct-submit" onClick={handleSubmit} disabled={sending}>
            {sending ? "Enviando..." : "ENVIAR MENSAJE"}
          </button>
          {error && <div className="ct-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
