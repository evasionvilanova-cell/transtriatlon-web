import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles.css";

const LOGO = "https://transtriatlon.com/wp-content/uploads/2017/11/Transtriatlón-fondo-blanco.png";

const CUOTA_OPTIONS = [
  "1 ACTIVIDAD (JÓVEN O ADULTO)",
  "2 ACTIVIDADES (JÓVEN O ADULTO)",
  "3 ACTIVIDADES (JÓVEN O ADULTO)",
  "4 ACTIVIDADES (JÓVEN O ADULTO)",
  "ACADEMY (1 ACTIVIDAD)",
  "ACADEMY (2 ACTIVIDADES)",
  "EXTERNO NO PRESENCIAL",
  "CAMPUS JOVE",
];

const EMPTY_FORM = {
  nombre: "", apellidos: "", fechaNacimiento: "", dni: "",
  menorDatos: "", direccion: "", email: "", movil: "",
  redes: "", aptoFisico: "", tipoCuota: "", numeroCuenta: "",
  formaPago: "Mensual", autorizaImagenes: false,
};

export default function Inscripcion() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre || !form.apellidos || !form.fechaNacimiento || !form.dni || !form.direccion || !form.email || !form.movil || !form.aptoFisico || !form.tipoCuota) {
      setError("Por favor, rellena todos los campos obligatorios (*)"); return;
    }
    if (!form.autorizaImagenes) {
      setError("Debes aceptar la política de privacidad e imágenes"); return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "inscripciones"), {
        ...form,
        estado: "pendiente",
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } catch (e) {
      setError("Error al enviar: " + e.message);
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: 42, letterSpacing: 2, marginBottom: 12 }}>¡INSCRIPCIÓN ENVIADA!</h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tu solicitud de inscripción ha sido enviada correctamente. El equipo de Transtriatlon se pondrá en contacto contigo pronto.
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
        .ins-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.95);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .ins-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .ins-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .ins-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}

        .ins-form{max-width:680px;margin:0 auto;padding:48px clamp(16px,4vw,48px) 80px}
        .ins-form h1{font-family:var(--display);font-size:clamp(32px,5vw,48px);letter-spacing:2px;margin-bottom:8px}
        .ins-form>p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:40px;line-height:1.6}

        .ins-section{margin-bottom:32px}
        .ins-section h3{font-family:var(--display);font-size:20px;letter-spacing:1.5px;color:var(--red);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.06)}

        .ins-field{margin-bottom:18px}
        .ins-field label{display:block;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px}
        .ins-field .req{color:var(--red)}
        .ins-field input,.ins-field select,.ins-field textarea{width:100%;padding:13px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:15px;font-family:var(--font);outline:none;transition:border .25s}
        .ins-field input:focus,.ins-field select:focus,.ins-field textarea:focus{border-color:var(--red)}
        .ins-field select option{background:#1a1a1a;color:#fff}
        .ins-field textarea{min-height:60px;resize:vertical}

        .ins-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:600px){.ins-row{grid-template-columns:1fr}}

        .ins-radio-group{display:flex;gap:12px;flex-wrap:wrap;margin-top:4px}
        .ins-radio{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);cursor:pointer;transition:all .25s;font-size:14px}
        .ins-radio:hover{border-color:rgba(255,255,255,.2)}
        .ins-radio.sel{border-color:var(--red);background:rgba(232,30,30,.1);color:var(--red-l)}
        .ins-radio input{display:none}

        .ins-check{display:flex;align-items:flex-start;gap:12px;padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);cursor:pointer;transition:all .25s;margin-top:4px}
        .ins-check:hover{border-color:rgba(255,255,255,.2)}
        .ins-check.sel{border-color:var(--red);background:rgba(232,30,30,.08)}
        .ins-check-box{width:22px;height:22px;border-radius:6px;border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .25s;font-size:13px}
        .ins-check.sel .ins-check-box{background:var(--red);border-color:var(--red)}
        .ins-check p{font-size:13px;color:rgba(255,255,255,.5);line-height:1.5}
        .ins-check p a{color:var(--red-l)}

        .ins-submit{width:100%;padding:16px;border-radius:12px;background:var(--red);color:#fff;font-size:16px;font-weight:700;border:none;cursor:pointer;font-family:var(--font);transition:all .25s;letter-spacing:.5px;margin-top:8px}
        .ins-submit:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 8px 24px var(--red-glow)}
        .ins-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
        .ins-error{color:var(--red-l);font-size:13px;margin-top:12px;text-align:center}
      `}</style>

      <div className="ins-hdr">
        <Link to="/" className="ins-hdr-logo">
          <img src={LOGO} alt="T" />
          <span>TRANSTRIATLON</span>
        </Link>
      </div>

      <div className="ins-form">
        <h1>FORMULARIO DE INSCRIPCIÓN</h1>
        <p>Rellena el formulario para inscribirte en Transtriatlon. Los campos marcados con * son obligatorios.</p>

        <div className="ins-section">
          <h3>DATOS PERSONALES</h3>
          <div className="ins-row">
            <div className="ins-field">
              <label>Nombre <span className="req">*</span></label>
              <input type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="ins-field">
              <label>Apellidos <span className="req">*</span></label>
              <input type="text" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} placeholder="Tus apellidos" />
            </div>
          </div>
          <div className="ins-row">
            <div className="ins-field">
              <label>Fecha de Nacimiento <span className="req">*</span></label>
              <input type="date" value={form.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)} />
            </div>
            <div className="ins-field">
              <label>DNI / NIE <span className="req">*</span></label>
              <input type="text" value={form.dni} onChange={(e) => set("dni", e.target.value)} placeholder="12345678A" />
            </div>
          </div>
          <div className="ins-field">
            <label>Para menores de 18 años (nombre y DNI del tutor legal)</label>
            <input type="text" value={form.menorDatos} onChange={(e) => set("menorDatos", e.target.value)} placeholder="Nombre tutor, DNI tutor" />
          </div>
        </div>

        <div className="ins-section">
          <h3>CONTACTO</h3>
          <div className="ins-field">
            <label>Dirección <span className="req">*</span></label>
            <input type="text" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Calle, número, ciudad, CP" />
          </div>
          <div className="ins-row">
            <div className="ins-field">
              <label>Email <span className="req">*</span></label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" />
            </div>
            <div className="ins-field">
              <label>Móvil <span className="req">*</span></label>
              <input type="tel" value={form.movil} onChange={(e) => set("movil", e.target.value)} placeholder="600 000 000" />
            </div>
          </div>
          <div className="ins-field">
            <label>Redes sociales (Facebook, Strava, Instagram)</label>
            <input type="text" value={form.redes} onChange={(e) => set("redes", e.target.value)} placeholder="@tu_usuario" />
          </div>
        </div>

        <div className="ins-section">
          <h3>SALUD Y CUOTA</h3>
          <div className="ins-field">
            <label>Manifiesto estar apto para realizar actividad física <span className="req">*</span></label>
            <div className="ins-radio-group">
              {["Sí", "No"].map(v => (
                <div key={v} className={`ins-radio ${form.aptoFisico === v ? "sel" : ""}`} onClick={() => set("aptoFisico", v)}>
                  <input type="radio" name="apto" /> {v}
                </div>
              ))}
            </div>
          </div>
          <div className="ins-field">
            <label>Tipo de Cuota <span className="req">*</span></label>
            <select value={form.tipoCuota} onChange={(e) => set("tipoCuota", e.target.value)}>
              <option value="">Selecciona una cuota</option>
              {CUOTA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="ins-section">
          <h3>DATOS DE PAGO</h3>
          <div className="ins-field">
            <label>Número de cuenta (IBAN)</label>
            <input type="text" value={form.numeroCuenta} onChange={(e) => set("numeroCuenta", e.target.value)} placeholder="ES00 0000 0000 0000 0000 0000" />
          </div>
          <div className="ins-field">
            <label>Forma de Pago</label>
            <div className="ins-radio-group">
              {["Mensual", "Trimestral"].map(v => (
                <div key={v} className={`ins-radio ${form.formaPago === v ? "sel" : ""}`} onClick={() => set("formaPago", v)}>
                  <input type="radio" name="pago" /> {v}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ins-section">
          <div className={`ins-check ${form.autorizaImagenes ? "sel" : ""}`} onClick={() => set("autorizaImagenes", !form.autorizaImagenes)}>
            <div className="ins-check-box">{form.autorizaImagenes ? "✓" : ""}</div>
            <p>
              Autorizo a Transtriatlon al uso de las imágenes aceptando la <a href="https://transtriatlon.com/politica-de-privacidad/" target="_blank" rel="noreferrer">política de privacidad</a>. <span className="req">*</span>
            </p>
          </div>
        </div>

        <button className="ins-submit" onClick={handleSubmit} disabled={sending}>
          {sending ? "Enviando..." : "ENVIAR INSCRIPCIÓN"}
        </button>
        {error && <div className="ins-error">{error}</div>}
      </div>
    </div>
  );
}
