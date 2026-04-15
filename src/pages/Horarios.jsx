import { Link } from "react-router-dom";
import "../styles.css";

const LOGO = "https://lh3.googleusercontent.com/d/1k4Vbce4KpniDHESGgsp-FJ-9k1WIX8Iy";

const SCHEDULES = [
  {
    program: "Funcional",
    color: "#E81E1E",
    icon: "💪",
    sessions: [
      { day: "Martes", time: "9:30h", activity: "Funcional", place: "Pistas de atletismo de Vilanova i la Geltrú" },
      { day: "Jueves", time: "18:00h", activity: "Funcional", place: "Pistas de atletismo de Vilanova i la Geltrú" },
    ],
  },
  {
    program: "Academy (6 – 12 años)",
    color: "#FF8C00",
    icon: "⭐",
    sessions: [
      { day: "Lunes", time: "18:30h – 19:30h", activity: "Carrera a pie", place: "Pistas de atletismo de Vilanova i la Geltrú" },
      { day: "Miércoles", time: "18:30h – 19:30h", activity: "Ciclismo", place: "Circuito ciclismo Vilanova i la Geltrú" },
    ],
  },
  {
    program: "Joven y Adulto",
    color: "#C41414",
    icon: "🏃",
    sessions: [
      { day: "Lunes", time: "19:45h", activity: "Carrera a pie", place: "Pistas de atletismo de Vilanova i la Geltrú" },
      { day: "Martes", time: "11:00h", activity: "Ciclismo carretera", place: "Salida Vilanova i la Geltrú" },
      { day: "Martes", time: "19:30h", activity: "Natación en mar", place: "Playa Vilanova i la Geltrú (temporada)" },
      { day: "Martes", time: "20:15h / 20:45h", activity: "Natación", place: "Piscina municipal de Vilanova i la Geltrú" },
      { day: "Miércoles", time: "19:45h", activity: "Carrera a pie", place: "Pistas de atletismo de Vilanova i la Geltrú" },
      { day: "Jueves", time: "19:45h", activity: "Ciclismo", place: "Circuito ciclismo Vilanova i la Geltrú" },
    ],
  },
];

export default function Horarios() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--white)" }}>
      <style>{`
        .ho-hdr{position:sticky;top:0;z-index:50;background:rgba(11,10,9,.94);backdrop-filter:blur(16px);padding:16px clamp(16px,4vw,48px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
        .ho-hdr-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .ho-hdr-logo img{height:32px;filter:brightness(0) invert(1)}
        .ho-hdr-logo span{font-family:var(--display);font-size:18px;letter-spacing:2px;color:#fff}
        .ho-back{padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);font-size:12px;text-decoration:none;transition:all .2s}
        .ho-back:hover{border-color:var(--red);color:var(--red-l)}

        .ho-hero{text-align:center;padding:clamp(48px,8vw,80px) 24px clamp(32px,4vw,48px);position:relative}
        .ho-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(232,30,30,.08) 0%,transparent 70%)}
        .ho-hero h1{font-family:var(--display);font-size:clamp(36px,7vw,64px);letter-spacing:2px;position:relative}
        .ho-hero p{color:rgba(255,255,255,.4);font-size:15px;margin-top:10px;max-width:600px;margin-inline:auto;position:relative}

        .ho-content{max-width:1000px;margin:0 auto;padding:0 clamp(16px,4vw,48px) 80px}

        .ho-program{margin-bottom:32px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);overflow:hidden}
        .ho-program-hdr{padding:20px 28px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:14px}
        .ho-program-hdr h2{font-family:var(--display);font-size:24px;letter-spacing:1.5px}
        .ho-program-icon{font-size:28px}

        .ho-table{width:100%;border-collapse:collapse}
        .ho-table th{text-align:left;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);padding:14px 28px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)}
        .ho-table td{padding:16px 28px;border-bottom:1px solid rgba(255,255,255,.04);font-size:14px;color:rgba(255,255,255,.7);vertical-align:top}
        .ho-table tr:last-child td{border-bottom:none}
        .ho-table tr:hover td{background:rgba(255,255,255,.02)}
        .ho-day{font-weight:700;color:#fff;white-space:nowrap}
        .ho-time{font-family:monospace;font-weight:600;color:var(--red-l);white-space:nowrap}
        .ho-activity{font-weight:500}
        .ho-place{color:rgba(255,255,255,.45);font-size:13px}

        .ho-note{margin-top:32px;padding:24px;border-radius:14px;background:rgba(232,30,30,.05);border:1px solid rgba(232,30,30,.12)}
        .ho-note h3{font-family:var(--display);font-size:18px;letter-spacing:1.5px;margin-bottom:10px;color:var(--red-l)}
        .ho-note p{font-size:13px;line-height:1.7;color:rgba(255,255,255,.5)}

        .ho-cta{text-align:center;margin-top:48px;padding:40px;border-radius:16px;background:rgba(232,30,30,.06);border:1px solid rgba(232,30,30,.12)}
        .ho-cta h2{font-family:var(--display);font-size:28px;letter-spacing:2px;margin-bottom:12px}
        .ho-cta p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:24px}
        .ho-cta a{display:inline-block;padding:14px 36px;border-radius:100px;background:var(--red);color:#fff;font-size:14px;font-weight:700;text-decoration:none;transition:all .25s}
        .ho-cta a:hover{background:var(--red-l);transform:translateY(-1px);box-shadow:0 8px 24px var(--red-glow)}

        @media(max-width:640px){
          .ho-table th,.ho-table td{padding:12px 16px;font-size:12px}
          .ho-program-hdr{padding:16px 20px}
          .ho-place{font-size:11px}
        }
      `}</style>

      <div className="ho-hdr">
        <Link to="/" className="ho-hdr-logo"><img src={LOGO} alt="T" /><span>TRANSTRIATLON</span></Link>
        <Link to="/" className="ho-back">← Volver</Link>
      </div>

      <div className="ho-hero">
        <h1>HORARIOS DE ENTRENAMIENTO</h1>
        <p>Calendario semanal de entrenamientos por programa. Los horarios pueden variar según la temporada.</p>
      </div>

      <div className="ho-content">
        {SCHEDULES.map(prog => (
          <div key={prog.program} className="ho-program">
            <div className="ho-program-hdr" style={{ borderLeft: `4px solid ${prog.color}` }}>
              <span className="ho-program-icon">{prog.icon}</span>
              <h2>{prog.program}</h2>
            </div>
            <table className="ho-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora</th>
                  <th>Actividad</th>
                  <th>Lugar</th>
                </tr>
              </thead>
              <tbody>
                {prog.sessions.map((s, i) => (
                  <tr key={i}>
                    <td className="ho-day">{s.day}</td>
                    <td className="ho-time">{s.time}</td>
                    <td className="ho-activity">{s.activity}</td>
                    <td className="ho-place">{s.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="ho-note">
          <h3>📌 NOTAS IMPORTANTES</h3>
          <p>
            • Los entrenamientos grupales son optativos. Los deportistas vienen cuando quieren y cuando pueden.<br />
            • La natación en mar se realiza solo en épocas que el clima lo permite.<br />
            • Los horarios pueden ajustarse según temporada, clima y luz solar.<br />
            • Para entrenamientos personales, consulta horarios con tu entrenador.
          </p>
        </div>

        <div className="ho-cta">
          <h2>¿QUIERES ENTRENAR CON NOSOTROS?</h2>
          <p>Inscríbete y empieza a entrenar</p>
          <a href="#/inscripcion">INSCRÍBETE AHORA</a>
        </div>
      </div>
    </div>
  );
}
