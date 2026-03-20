import { Link } from "react-router-dom";
import "../styles.css";

const LOGO = "https://transtriatlon.com/wp-content/uploads/2017/11/Transtriatlón-fondo-blanco.png";
const NICO_IMG = "https://lh3.googleusercontent.com/d/1NdMFTayjzy9-O1vjQPgWD1i8Ftypi9z2";
const JUDITH_IMG = "https://lh3.googleusercontent.com/d/1m6Y8TRgV8ipObiyzMbzn7aszCW4tTtPN";

const DISCIPLINES = ["Triatlón", "Duatlón", "Acuatlón", "Transtriatlon Academy", "Transtriatlon Joven", "Swimrun", "Aquabike"];

export default function QuienesSomos() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)" }}>
      <style>{`
        .qs-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.94);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .qs-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .qs-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .qs-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .qs-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:12px;text-decoration:none;transition:all .2s}
        .qs-back:hover{border-color:var(--red);color:var(--red-l)}
        .qs-hero{text-align:center;padding:clamp(48px,8vw,80px) 24px clamp(32px,4vw,48px);position:relative}
        .qs-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(232,30,30,.08) 0%,transparent 70%)}
        .qs-hero h1{font-family:var(--display);font-size:clamp(36px,7vw,64px);letter-spacing:2px;position:relative}
        .qs-hero p{color:rgba(255,255,255,.4);font-size:15px;margin-top:10px;max-width:600px;margin-inline:auto;position:relative}
        .qs-content{max-width:900px;margin:0 auto;padding:0 clamp(16px,4vw,48px) 80px}
        .qs-section{margin-bottom:40px;padding:32px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
        .qs-section h2{font-family:var(--display);font-size:24px;letter-spacing:1.5px;color:var(--red);margin-bottom:16px}
        .qs-section p{font-size:14px;line-height:1.8;color:rgba(255,255,255,.55);margin-bottom:12px}
        .qs-disciplines{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}
        .qs-disc{padding:8px 18px;border-radius:100px;background:rgba(232,30,30,.08);border:1px solid rgba(232,30,30,.15);color:var(--red-l);font-size:13px;font-weight:600;letter-spacing:.5px}
        .qs-coaches{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:40px}
        .qs-coach{padding:32px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);text-align:center;transition:all .3s}
        .qs-coach:hover{border-color:rgba(232,30,30,.15);background:rgba(232,30,30,.03)}
        .qs-coach-img{width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid rgba(232,30,30,.2);margin:0 auto 20px}
        .qs-coach h3{font-family:var(--display);font-size:22px;letter-spacing:1px;margin-bottom:6px}
        .qs-coach-role{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--red);margin-bottom:14px}
        .qs-coach p{font-size:13px;line-height:1.7;color:rgba(255,255,255,.45)}
        .qs-cta{text-align:center;margin-top:48px;padding:40px;border-radius:16px;background:rgba(232,30,30,.06);border:1px solid rgba(232,30,30,.12)}
        .qs-cta h2{font-family:var(--display);font-size:28px;letter-spacing:2px;margin-bottom:12px}
        .qs-cta p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:24px}
        .qs-cta a{display:inline-block;padding:14px 36px;border-radius:100px;background:var(--red);color:#fff;font-size:14px;font-weight:700;text-decoration:none;transition:all .25s}
        .qs-cta a:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 8px 24px var(--red-glow)}
        @media(max-width:640px){.qs-coaches{grid-template-columns:1fr}}
      `}</style>

      <div className="qs-hdr">
        <Link to="/" className="qs-hdr-logo"><img src={LOGO} alt="T" /><span>TRANSTRIATLON</span></Link>
        <Link to="/" className="qs-back">← Volver</Link>
      </div>

      <div className="qs-hero">
        <h1>QUIÉNES SOMOS</h1>
        <p>Club especializado en deportes de resistencia desde hace más de 30 años en Vilanova i la Geltrú</p>
      </div>

      <div className="qs-content">
        <div className="qs-section">
          <h2>EL CLUB</h2>
          <p>Transtriatlon está especializado en deportes de resistencia: Natación, Ciclismo y Carrera a pie.</p>
          <div className="qs-disciplines">
            {DISCIPLINES.map(d => <span key={d} className="qs-disc">{d}</span>)}
          </div>
          <p>También tenemos personas que entrenan una sola disciplina y se unen a nosotros para mejorar en ese deporte, conocer gente, entrenar en grupo, etc.</p>
          <p>Llevamos más de 30 años vinculados al Triatlón y la Natación. Tenemos experiencia en competiciones organizando, compitiendo y entrenando.</p>
        </div>

        <div className="qs-section">
          <h2>NUESTRA FILOSOFÍA</h2>
          <p>Además de los años que llevamos en este deporte, tenemos la formación necesaria y obligatoria para desarrollar estas actividades con seguridad.</p>
          <p>Conocemos y aplicamos métodos de entrenamiento diferentes según la edad: niños, jóvenes y adultos.</p>
          <p>Nuestros entrenadores titulados están especializados en formar a deportistas de base (niños/as), jóvenes y deportistas adultos que se inician o que quieren seguir progresando.</p>
          <p>Transtriatlon es un equipo abierto a todas las personas, ya que no pedimos nivel mínimo deportivo.</p>
          <p>Si quieres hacer Triatlón y asistir a los entrenamientos grupales de natación, te pedimos que sepas nadar crol ya que las sesiones son con más personas. Si no sabes nadar, tenemos entrenadores personales o te podemos derivar a cursillos de natación.</p>
          <p>Tenemos un sistema de entrenamiento diseñado para iniciar a toda persona que quiera conocer estos deportes y ayudar a progresar a deportistas experimentados.</p>
          <p style={{ color: "rgba(255,255,255,.7)", fontWeight: 500 }}>Nuestro objetivo es que todos los que forman parte de Transtriatlon, disfrutando de los entrenamientos, encuentren una evolución individual.</p>
        </div>

        <h2 style={{ fontFamily: "var(--display)", fontSize: 28, letterSpacing: 2, textAlign: "center", marginBottom: 24 }}>ENTRENADORES</h2>

        <div className="qs-coaches">
          <div className="qs-coach">
            <img src={NICO_IMG} alt="Nicolás Sáenz Briasco" className="qs-coach-img" />
            <h3>NICOLÁS SÁENZ BRIASCO</h3>
            <div className="qs-coach-role">Entrenador Nacional de Triatlón Nivel 3</div>
            <p>Triatleta desde 1987, experiencia en todas las distancias y deportista en activo.</p>
          </div>
          <div className="qs-coach">
            <img src={JUDITH_IMG} alt="Judith Diaz Batlle" className="qs-coach-img" />
            <h3>JUDITH DIAZ BATLLE</h3>
            <div className="qs-coach-role">Monitora de Natación</div>
            <p>Ex nadadora, subcampeona de España de Natación en 100m espalda 1984 y deportista en activo.</p>
          </div>
        </div>

        <div className="qs-cta">
          <h2>¿QUIERES UNIRTE?</h2>
          <p>Inscríbete y empieza a entrenar con nosotros</p>
          <a href="#/inscripcion">INSCRÍBETE AHORA</a>
        </div>
      </div>
    </div>
  );
}
