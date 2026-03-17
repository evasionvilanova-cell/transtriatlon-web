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

const FAQS = [
  { q: "¿Cómo me hago socio de Transtriatlon?", a: "Es muy sencillo, tan sólo debes rellenar este formulario con todos tus datos y en breve recibirás respuesta." },
  { q: "¿Se realizan entrenamientos personalizados?", a: "Sí, los entrenamientos dirigidos en grupo son personalizados a cada disciplina o tratando todas a la vez. Según el número de participantes, el club posee un equipo técnico que llevará cada grupo de nivel." },
  { q: "¿Se hace larga distancia o corta distancia?", a: "Los entrenamientos son variados y todos los atletas podrán optar a unos planes de entrenamiento según su disciplina. En los grupales los atletas entrenan por nivel." },
  { q: "¿Dónde se realizan los entrenamientos de natación?", a: "Los entrenamientos de natación se realizan en el Complejo Esportiu La Piscina." },
];

const EMPTY = {
  nombre: "", apellidos: "", fechaNacimiento: "", dni: "",
  menorDatos: "", direccion: "", email: "", movil: "",
  redes: "", aptoFisico: "", tipoCuota: "", numeroCuenta: "",
  formaPago: "Mensual", autorizaImagenes: false,
};

export default function Inscripcion() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre || !form.apellidos || !form.fechaNacimiento || !form.dni || !form.direccion || !form.email || !form.movil || !form.aptoFisico || !form.tipoCuota) {
      setError("Por favor, rellena todos los campos obligatorios (*)"); return;
    }
    if (!form.autorizaImagenes) { setError("Debes aceptar la política de privacidad"); return; }
    setSending(true);
    try {
      await addDoc(collection(db, "inscripciones"), { ...form, estado: "pendiente", createdAt: serverTimestamp() });
      setSent(true);
    } catch (e) { setError("Error al enviar: " + e.message); }
    setSending(false);
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontFamily: "var(--display)", fontSize: 42, letterSpacing: 2, marginBottom: 12, color: "#fff" }}>¡INSCRIPCIÓN ENVIADA!</h1>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tu solicitud ha sido enviada correctamente. El equipo de Transtriatlon se pondrá en contacto contigo pronto.
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
        .i-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.94);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .i-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .i-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .i-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .i-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:12px;text-decoration:none;transition:all .2s}
        .i-back:hover{border-color:var(--red);color:var(--red-l)}

        .i-hero{text-align:center;padding:clamp(40px,6vw,64px) 24px 0;position:relative}
        .i-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(232,30,30,.08) 0%,transparent 70%)}
        .i-hero h1{font-family:var(--display);font-size:clamp(36px,6vw,56px);letter-spacing:2px;position:relative}
        .i-hero p{color:rgba(255,255,255,.4);font-size:15px;margin-top:8px;max-width:500px;margin-inline:auto;position:relative}

        .i-layout{display:grid;grid-template-columns:1fr 380px;gap:40px;max-width:1140px;margin:0 auto;padding:48px clamp(16px,4vw,48px) 80px;align-items:start}

        .i-form{padding:36px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(8px)}
        .i-section{margin-bottom:28px}
        .i-section h3{font-family:var(--display);font-size:18px;letter-spacing:1.5px;color:var(--red);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.06)}
        .i-field{margin-bottom:14px}
        .i-field label{display:block;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:5px}
        .i-field .req{color:var(--red)}
        .i-field input,.i-field select,.i-field textarea{width:100%;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;font-size:14px;font-family:var(--font);outline:none;transition:border .25s}
        .i-field input:focus,.i-field select:focus,.i-field textarea:focus{border-color:var(--red)}
        .i-field select option{background:#1a1a1a;color:#fff}
        .i-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}

        .i-radio-group{display:flex;gap:10px;flex-wrap:wrap}
        .i-radio{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);cursor:pointer;transition:all .25s;font-size:14px;color:rgba(255,255,255,.6)}
        .i-radio:hover{border-color:rgba(255,255,255,.15)}
        .i-radio.sel{border-color:var(--red);background:rgba(232,30,30,.1);color:var(--red-l)}
        .i-radio input{display:none}

        .i-check{display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);cursor:pointer;transition:all .25s}
        .i-check:hover{border-color:rgba(255,255,255,.15)}
        .i-check.sel{border-color:var(--red);background:rgba(232,30,30,.08)}
        .i-check-box{width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;transition:all .25s}
        .i-check.sel .i-check-box{background:var(--red);border-color:var(--red);color:#fff}
        .i-check p{font-size:12px;color:rgba(255,255,255,.4);line-height:1.5}
        .i-check p a{color:var(--red-l)}

        .i-submit{width:100%;padding:16px;border-radius:12px;background:var(--red);color:#fff;font-size:16px;font-weight:700;border:none;cursor:pointer;font-family:var(--font);transition:all .25s;letter-spacing:.5px}
        .i-submit:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 8px 24px var(--red-glow)}
        .i-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .i-error{color:var(--red-l);font-size:13px;margin-top:10px;text-align:center}

        .i-faq{position:sticky;top:100px}
        .i-faq h2{font-family:var(--display);font-size:26px;letter-spacing:2px;margin-bottom:20px}
        .i-faq-item{margin-bottom:10px;border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.03);overflow:hidden;cursor:pointer;transition:all .3s}
        .i-faq-item:hover{background:rgba(255,255,255,.05)}
        .i-faq-item.open{border-color:rgba(232,30,30,.2);background:rgba(232,30,30,.05)}
        .i-faq-q{display:flex;align-items:center;gap:12px;padding:16px 18px}
        .i-faq-num{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .3s}
        .i-faq-num.closed{background:rgba(255,255,255,.06);color:rgba(255,255,255,.35)}
        .i-faq-num.opened{background:var(--red);color:#fff}
        .i-faq-q span{flex:1;font-size:14px;font-weight:600}
        .i-faq-q .plus{font-size:18px;color:rgba(255,255,255,.3);transition:transform .3s}
        .i-faq-q .plus.open{transform:rotate(45deg);color:var(--red)}
        .i-faq-a{padding:0 18px 16px 60px;font-size:13px;line-height:1.7;color:rgba(255,255,255,.45)}

        .i-contact{margin-top:24px;padding:24px;border-radius:14px;background:rgba(232,30,30,.05);border:1px solid rgba(232,30,30,.1)}
        .i-contact h3{font-family:var(--display);font-size:18px;letter-spacing:1.5px;margin-bottom:12px}
        .i-contact p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
        .i-contact a{color:var(--red-l);font-weight:600;text-decoration:none}

        @media(max-width:860px){
          .i-layout{grid-template-columns:1fr}
          .i-faq{position:static}
          .i-row{grid-template-columns:1fr}
        }
      `}</style>

      <div className="i-hdr">
        <Link to="/" className="i-hdr-logo"><img src={LOGO} alt="T" /><span>TRANSTRIATLON</span></Link>
        <Link to="/" className="i-back">← Volver</Link>
      </div>

      <div className="i-hero">
        <h1>FORMULARIO DE INSCRIPCIÓN</h1>
        <p>Rellena el formulario para unirte a Transtriatlon. Los campos con * son obligatorios.</p>
      </div>

      <div className="i-layout">
        <div className="i-form">
          <div className="i-section">
            <h3>DATOS PERSONALES</h3>
            <div className="i-row">
              <div className="i-field"><label>Nombre <span className="req">*</span></label><input type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" /></div>
              <div className="i-field"><label>Apellidos <span className="req">*</span></label><input type="text" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} placeholder="Tus apellidos" /></div>
            </div>
            <div className="i-row">
              <div className="i-field"><label>Fecha de Nacimiento <span className="req">*</span></label><input type="date" value={form.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)} /></div>
              <div className="i-field"><label>DNI / NIE <span className="req">*</span></label><input type="text" value={form.dni} onChange={(e) => set("dni", e.target.value)} placeholder="12345678A" /></div>
            </div>
            <div className="i-field"><label>Para menores de 18 años (nombre y DNI del tutor legal)</label><input type="text" value={form.menorDatos} onChange={(e) => set("menorDatos", e.target.value)} placeholder="Nombre tutor, DNI tutor" /></div>
          </div>

          <div className="i-section">
            <h3>CONTACTO</h3>
            <div className="i-field"><label>Dirección <span className="req">*</span></label><input type="text" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Calle, número, ciudad, CP" /></div>
            <div className="i-row">
              <div className="i-field"><label>Email <span className="req">*</span></label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" /></div>
              <div className="i-field"><label>Móvil <span className="req">*</span></label><input type="tel" value={form.movil} onChange={(e) => set("movil", e.target.value)} placeholder="600 000 000" /></div>
            </div>
            <div className="i-field"><label>Redes sociales (Facebook, Strava, Instagram)</label><input type="text" value={form.redes} onChange={(e) => set("redes", e.target.value)} placeholder="@tu_usuario" /></div>
          </div>

          <div className="i-section">
            <h3>SALUD Y CUOTA</h3>
            <div className="i-field">
              <label>Manifiesto estar apto para realizar actividad física <span className="req">*</span></label>
              <div className="i-radio-group">
                {["Sí", "No"].map(v => (
                  <div key={v} className={`i-radio ${form.aptoFisico === v ? "sel" : ""}`} onClick={() => set("aptoFisico", v)}>
                    <input type="radio" name="apto" /> {v}
                  </div>
                ))}
              </div>
            </div>
            <div className="i-field">
              <label>Tipo de Cuota <span className="req">*</span></label>
              <select value={form.tipoCuota} onChange={(e) => set("tipoCuota", e.target.value)}>
                <option value="">Selecciona una cuota</option>
                {CUOTA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="i-section">
            <h3>DATOS DE PAGO</h3>
            <div className="i-field"><label>Número de cuenta (IBAN)</label><input type="text" value={form.numeroCuenta} onChange={(e) => set("numeroCuenta", e.target.value)} placeholder="ES00 0000 0000 0000 0000 0000" /></div>
            <div className="i-field">
              <label>Forma de Pago</label>
              <div className="i-radio-group">
                {["Mensual", "Trimestral"].map(v => (
                  <div key={v} className={`i-radio ${form.formaPago === v ? "sel" : ""}`} onClick={() => set("formaPago", v)}>
                    <input type="radio" name="pago" /> {v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`i-check ${form.autorizaImagenes ? "sel" : ""}`} onClick={() => set("autorizaImagenes", !form.autorizaImagenes)}>
            <div className="i-check-box">{form.autorizaImagenes ? "✓" : ""}</div>
            <p>Autorizo a Transtriatlon al uso de las imágenes aceptando la <a href="https://transtriatlon.com/politica-de-privacidad/" target="_blank" rel="noreferrer">política de privacidad</a>. <span className="req">*</span></p>
          </div>

          <button className="i-submit" onClick={handleSubmit} disabled={sending} style={{ marginTop: 20 }}>
            {sending ? "Enviando..." : "ENVIAR INSCRIPCIÓN"}
          </button>
          {error && <div className="i-error">{error}</div>}
        </div>

        <div className="i-faq">
          <h2>PREGUNTAS FRECUENTES</h2>
          {FAQS.map((faq, i) => <FaqItem key={i} num={i + 1} q={faq.q} a={faq.a} />)}
          <div className="i-contact">
            <h3>¿TIENES DUDAS?</h3>
            <p>Contacta con nosotros:<br /><a href="mailto:info@transtriatlon.com">info@transtriatlon.com</a><br /><a href="tel:683542061">683 542 061</a> (Nico Saenz)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ num, q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`i-faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="i-faq-q">
        <div className={`i-faq-num ${open ? "opened" : "closed"}`}>{num}</div>
        <span>{q}</span>
        <span className={`plus ${open ? "open" : ""}`}>+</span>
      </div>
      {open && <div className="i-faq-a">{a}</div>}
    </div>
  );
}
