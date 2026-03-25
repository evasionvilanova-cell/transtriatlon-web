import { Link } from "react-router-dom";
import "../styles.css";

const LOGO = "https://lh3.googleusercontent.com/d/1k4Vbce4KpniDHESGgsp-FJ-9k1WIX8Iy";

export default function Privacidad() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)" }}>
      <style>{`
        .pv-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.94);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .pv-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .pv-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .pv-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .pv-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:12px;text-decoration:none;transition:all .2s}
        .pv-back:hover{border-color:var(--red);color:var(--red-l)}
        .pv-content{max-width:800px;margin:0 auto;padding:clamp(32px,6vw,64px) clamp(16px,4vw,48px) 80px}
        .pv-content h1{font-family:var(--display);font-size:clamp(28px,5vw,42px);letter-spacing:2px;margin-bottom:8px}
        .pv-content .pv-sub{color:rgba(255,255,255,.35);font-size:14px;margin-bottom:40px}
        .pv-section{margin-bottom:32px;padding:28px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
        .pv-section h2{font-family:var(--display);font-size:20px;letter-spacing:1.5px;color:var(--red);margin-bottom:16px}
        .pv-section p{font-size:14px;line-height:1.8;color:rgba(255,255,255,.6)}
        .pv-section strong{color:rgba(255,255,255,.85)}
        .pv-section h3{font-family:var(--display);font-size:17px;letter-spacing:1px;margin-top:20px;margin-bottom:10px;color:rgba(255,255,255,.8)}
      `}</style>

      <div className="pv-hdr">
        <Link to="/" className="pv-hdr-logo"><img src={LOGO} alt="T" /><span>TRANSTRIATLON</span></Link>
        <Link to="/inscripcion" className="pv-back">← Volver al formulario</Link>
      </div>

      <div className="pv-content">
        <h1>POLÍTICA DE PRIVACIDAD</h1>
        <p className="pv-sub">Club Deportivo Transtriatlon Vilanova</p>

        <div className="pv-section">
          <h2>AUTORIZACIÓN PARA LA PUBLICACIÓN DE IMÁGENES</h2>
          <p>A partir de los 18 años</p>
        </div>

        <div className="pv-section">
          <h2>1. PROTECCIÓN DE DATOS</h2>
          <p>
            De conformidad con lo establecido en el <strong>Real Decreto-ley 5/2018, de 27 de julio</strong>, de medidas urgentes para la adaptación del Derecho español (L.O. 15/1999, de 13 de diciembre, de Protección de Datos de Carácter Personal) a la normativa de la Unión Europea en materia de protección de datos, y del <strong>Reglamento (UE) 2016/679 del Parlamento Europeo de 27 de abril de 2016</strong>, relativo a la protección de las personas físicas, se informa que la inscripción al Club Deportivo Transtriatlon Vilanova implica el consentimiento para la incorporación de los datos personales a los ficheros destinados a la gestión del Club.
          </p>
        </div>

        <div className="pv-section">
          <h2>2. USO DE IMAGEN</h2>
          <p>
            La inscripción al Club Deportivo Transtriatlon supone la autorización para el uso libre del nombre del participante y su foto o imagen en los distintos medios de comunicación.
          </p>
        </div>

        <div className="pv-section">
          <h2>RESPONSABILIDADES</h2>
          <p>
            La organización advierte que los entrenamientos organizados por el Club Deportivo Transtriatlon Vilanova son exigentes físicamente, por lo que debe ser practicado por personas con una óptima preparación y un correcto estado de salud, recomendando abstenerse a aquellas personas que no estén en buenas condiciones para su realización.
          </p>
          <p style={{ marginTop: 16 }}>
            La organización queda exenta de cualquier responsabilidad sobre los daños que la participación de los entrenamientos y/o competiciones pudiera conllevar al deportista o a terceras personas, asumiendo éstos con su inscripción la plena responsabilidad de los mismos.
          </p>
        </div>
      </div>
    </div>
  );
}
