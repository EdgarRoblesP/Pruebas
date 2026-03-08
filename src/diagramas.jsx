import { useState } from "react";

const PINK = "#FF69B4";
const PINK_DARK = "#c2185b";
const NAVY = "#1F4E79";
const NAVY_LIGHT = "#2E74B5";
const WHITE = "#FFFFFF";
const GRAY = "#B0B8C1";
const GRAY_LIGHT = "#ECF0F3";
const GREEN = "#27AE60";
const RED = "#E74C3C";
const YELLOW = "#F6C90E";

// ── Shared SVG primitives ─────────────────────────────────────

function Oval({ x, y, w = 90, h = 34, label, active }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2}
        fill={active ? PINK : GRAY_LIGHT}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fontFamily="'Courier New', monospace"
        fontWeight={active ? "700" : "500"}
        fill={active ? WHITE : NAVY}>{label}</text>
    </g>
  );
}

function Rect({ x, y, w = 130, h = 40, label, active, sub }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4}
        fill={active ? PINK : GRAY_LIGHT}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <text x={x} y={sub ? y - 5 : y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fontFamily="'Courier New', monospace"
        fontWeight={active ? "700" : "500"}
        fill={active ? WHITE : NAVY}>{label}</text>
      {sub && <text x={x} y={y + 10} textAnchor="middle" dominantBaseline="middle"
        fontSize={10} fontFamily="'Courier New', monospace"
        fill={active ? WHITE : "#555"}>{sub}</text>}
    </g>
  );
}

function Diamond({ x, y, size = 44, label, active }) {
  const pts = `${x},${y - size} ${x + size * 1.4},${y} ${x},${y + size} ${x - size * 1.4},${y}`;
  return (
    <g>
      <polygon points={pts}
        fill={active ? PINK : GRAY_LIGHT}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fontFamily="'Courier New', monospace"
        fontWeight={active ? "700" : "500"}
        fill={active ? WHITE : NAVY}>{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, active, labelPos }) {
  const color = active ? PINK_DARK : GRAY;
  const sw = active ? 2.5 : 1.5;
  // arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const al = 10;
  const ax1 = x2 - al * Math.cos(angle - 0.4);
  const ay1 = y2 - al * Math.sin(angle - 0.4);
  const ax2 = x2 - al * Math.cos(angle + 0.4);
  const ay2 = y2 - al * Math.sin(angle + 0.4);
  const lx = labelPos ? labelPos.x : (x1 + x2) / 2 + 4;
  const ly = labelPos ? labelPos.y : (y1 + y2) / 2 - 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} />
      <polygon points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`} fill={color} />
      {label && <text x={lx} y={ly} textAnchor="middle" fontSize={10}
        fontFamily="'Courier New', monospace" fill={active ? PINK_DARK : "#666"}
        fontWeight={active ? "700" : "400"}>{label}</text>}
    </g>
  );
}

// ── Individual diagrams ───────────────────────────────────────

// prestarLibro – Normal (libro disponible → true)
function DiagPrestarNormal() {
  return (
    <svg width="260" height="380" viewBox="0 0 260 380">
      <Oval x={130} y={30} label="Inicio" active />
      <Arrow x1={130} y1={47} x2={130} y2={90} active />
      <Rect x={130} y={110} w={170} h={38} label="prestado = false" active />
      <Arrow x1={130} y1={129} x2={130} y2={168} active />
      <Diamond x={130} y={195} size={36} label="!prestado?" active />
      <Arrow x1={130} y1={231} x2={130} y2={268} label="true" active labelPos={{x:145,y:252}} />
      <Rect x={130} y={290} w={160} h={38} label="prestado = true" active />
      <Arrow x1={130} y1={309} x2={130} y2={345} active />
      <Rect x={130} y={358} w={130} h={28} label="return true" active />
      {/* false branch — inactive */}
      <Arrow x1={191} y1={195} x2={230} y2={195} label="false" active={false} labelPos={{x:215,y:185}} />
      <Rect x={230} y={230} w={50} h={28} label="ret false" active={false} />
      <Arrow x1={191} y1={195} x2={230} y2={215} active={false} />
    </svg>
  );
}

// prestarLibro – Alternativo (libro ya prestado → false)
function DiagPrestarAlt() {
  return (
    <svg width="300" height={380} viewBox="0 0 300 380">
      <Oval x={130} y={30} label="Inicio" active />
      <Arrow x1={130} y1={47} x2={130} y2={90} active />
      <Rect x={130} y={110} w={170} h={38} label="prestado = true" active />
      <Arrow x1={130} y1={129} x2={130} y2={168} active />
      <Diamond x={130} y={195} size={36} label="!prestado?" active />
      {/* true branch — inactive */}
      <Arrow x1={130} y1={231} x2={130} y2={268} label="true" active={false} labelPos={{x:148,y:252}} />
      <Rect x={130} y={290} w={150} h={38} label="prestado=true" active={false} />
      {/* false branch — active */}
      <Arrow x1={191} y1={195} x2={245} y2={195} label="false" active labelPos={{x:222,y:184}} />
      <Arrow x1={245} y1={195} x2={245} y2={290} active />
      <Rect x={245} y={310} w={90} h={38} label="return false" active />
      <Arrow x1={245} y1={329} x2={245} y2={358} active />
      <Oval x={245} y={368} label="Fin" active />
    </svg>
  );
}

// reservarLibro – Normal (prestado=true, reservado=false → true)
function DiagReservarNormal() {
  return (
    <svg width="320" height={430} viewBox="0 0 320 430">
      <Oval x={160} y={30} label="Inicio" active />
      <Arrow x1={160} y1={47} x2={160} y2={85} active />
      <Rect x={160} y={108} w={200} h={42} label="prestado=true" sub="reservado=false" active />
      <Arrow x1={160} y1={129} x2={160} y2={170} active />
      <Diamond x={160} y={200} size={40} label="!reservado &&" active />
      <text x={160} y={202} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={WHITE}>prestado?</text>
      <Arrow x1={160} y1={240} x2={160} y2={278} label="true" active labelPos={{x:176,y:261}} />
      <Rect x={160} y={300} w={170} h={38} label="reservado = true" active />
      <Arrow x1={160} y1={319} x2={160} y2={355} active />
      <Rect x={160} y={375} w={130} h={30} label="return true" active />
      {/* false → inactive */}
      <Arrow x1={216} y1={200} x2={270} y2={200} label="false" active={false} labelPos={{x:247,y:189}} />
      <Rect x={270} y={235} w={90} h={30} label="ret false" active={false} />
    </svg>
  );
}

// reservarLibro – Alternativo (prestado=false → false)
function DiagReservarAlt() {
  return (
    <svg width="320" height={400} viewBox="0 0 320 400">
      <Oval x={140} y={30} label="Inicio" active />
      <Arrow x1={140} y1={47} x2={140} y2={85} active />
      <Rect x={140} y={108} w={200} h={42} label="prestado=false" sub="reservado=false" active />
      <Arrow x1={140} y1={129} x2={140} y2={168} active />
      <Diamond x={140} y={198} size={40} label="!reservado &&" active />
      <text x={140} y={200} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={WHITE}>prestado?</text>
      {/* true branch inactive */}
      <Arrow x1={140} y1={238} x2={140} y2={275} label="true" active={false} labelPos={{x:156,y:258}} />
      <Rect x={140} y={297} w={160} h={36} label="reservado=true" active={false} />
      {/* false branch active */}
      <Arrow x1={196} y1={198} x2={258} y2={198} label="false" active labelPos={{x:232,y:187}} />
      <Arrow x1={258} y1={198} x2={258} y2={295} active />
      <Rect x={258} y={315} w={90} h={36} label="return false" active />
      <Arrow x1={258} y1={333} x2={258} y2={365} active />
      <Oval x={258} y={378} label="Fin" active />
    </svg>
  );
}

// devolverLibro – Normal
function DiagDevolverNormal() {
  return (
    <svg width="260" height={370} viewBox="0 0 260 370">
      <Oval x={130} y={30} label="Inicio" active />
      <Arrow x1={130} y1={47} x2={130} y2={85} active />
      <Rect x={130} y={108} w={165} h={38} label="prestado = true" active />
      <Arrow x1={130} y1={127} x2={130} y2={163} active />
      <Rect x={130} y={186} w={200} h={42} label={`println: "Cambiando`} sub={`estado a disponible"`} active />
      <Arrow x1={130} y1={207} x2={130} y2={248} active />
      <Rect x={130} y={270} w={165} h={38} label="prestado = false" active />
      <Arrow x1={130} y1={289} x2={130} y2={328} active />
      <Oval x={130} y={345} label="Fin" active />
    </svg>
  );
}

// devolverLibro – Alternativo (no hay libros prestados)
function DiagDevolverAlt() {
  return (
    <svg width="300" height={400} viewBox="0 0 300 400">
      <Oval x={150} y={30} label="Inicio" active />
      <Arrow x1={150} y1={47} x2={150} y2={85} active />
      <Diamond x={150} y={118} size={40} label="¿Libros" active />
      <text x={150} y={120} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={WHITE}>prestados?</text>
      {/* SÍ branch — inactive */}
      <Arrow x1={150} y1={158} x2={150} y2={195} label="Sí" active={false} labelPos={{x:163,y:178}} />
      <Rect x={150} y={218} w={165} h={38} label="devolverLibro()" active={false} />
      {/* NO branch — active */}
      <Arrow x1={206} y1={118} x2={262} y2={118} label="No" active labelPos={{x:238,y:107}} />
      <Arrow x1={262} y1={118} x2={262} y2={210} active />
      <Rect x={262} y={232} w={120} h={42} label={`"No hay libros`} sub={`en préstamo"`} active />
      <Arrow x1={262} y1={253} x2={262} y2={300} active />
      <Rect x={262} y={320} w={130} h={36} label="→ Menú principal" active />
      <Arrow x1={262} y1={338} x2={262} y2={370} active />
      <Oval x={262} y={383} label="Fin" active />
    </svg>
  );
}

// setIsbn – Normal
function DiagIsbnNormal() {
  return (
    <svg width="270" height={390} viewBox="0 0 270 390">
      <Oval x={135} y={30} label="Inicio" active />
      <Arrow x1={135} y1={47} x2={135} y2={85} active />
      <Rect x={135} y={108} w={200} h={38} label={`isbn = "9780134685991"`} active />
      <Arrow x1={135} y1={127} x2={135} y2={163} active />
      <Diamond x={135} y={196} size={40} label="isbn != null &&" active />
      <text x={135} y={198} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={WHITE}>matches(\\d{13})?</text>
      <Arrow x1={135} y1={236} x2={135} y2={273} label="true" active labelPos={{x:151,y:256}} />
      <Rect x={135} y={296} w={190} h={38} label="this.isbn = isbn" active />
      <Arrow x1={135} y1={315} x2={135} y2={353} active />
      <Oval x={135} y={368} label="Fin" active />
      {/* false branch inactive */}
      <Arrow x1={191} y1={196} x2={245} y2={196} label="false" active={false} labelPos={{x:222,y:185}} />
      <Rect x={245} y={228} w={80} h={30} label="sin cambio" active={false} />
    </svg>
  );
}

// setIsbn – Alternativo
function DiagIsbnAlt() {
  return (
    <svg width="310" height={380} viewBox="0 0 310 380">
      <Oval x={130} y={30} label="Inicio" active />
      <Arrow x1={130} y1={47} x2={130} y2={85} active />
      <Rect x={130} y={108} w={175} h={38} label={`isbn = "123ABC"`} active />
      <Arrow x1={130} y1={127} x2={130} y2={165} active />
      <Diamond x={130} y={198} size={40} label="isbn != null &&" active />
      <text x={130} y={200} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={WHITE}>matches(\\d{13})?</text>
      {/* true branch inactive */}
      <Arrow x1={130} y1={238} x2={130} y2={275} label="true" active={false} labelPos={{x:146,y:258}} />
      <Rect x={130} y={297} w={175} h={36} label="this.isbn = isbn" active={false} />
      {/* false branch active */}
      <Arrow x1={186} y1={198} x2={252} y2={198} label="false" active labelPos={{x:224,y:187}} />
      <Arrow x1={252} y1={198} x2={252} y2={293} active />
      <Rect x={252} y={313} w={110} h={38} label="isbn sin cambio" active />
      <Arrow x1={252} y1={332} x2={252} y2={358} active />
      <Oval x={252} y={370} label="Fin" active />
    </svg>
  );
}

// setPaginas – Normal
function DiagPaginasNormal() {
  return (
    <svg width="270" height={380} viewBox="0 0 270 380">
      <Oval x={135} y={30} label="Inicio" active />
      <Arrow x1={135} y1={47} x2={135} y2={85} active />
      <Rect x={135} y={108} w={175} h={38} label="numPaginas = 320" active />
      <Arrow x1={135} y1={127} x2={135} y2={165} active />
      <Diamond x={135} y={198} size={38} label="numPaginas > 0?" active />
      <Arrow x1={135} y1={236} x2={135} y2={273} label="true" active labelPos={{x:151,y:256}} />
      <Rect x={135} y={296} w={200} h={38} label="this.numPaginas = 320" active />
      <Arrow x1={135} y1={315} x2={135} y2={352} active />
      <Oval x={135} y={368} label="Fin" active />
      {/* false inactive */}
      <Arrow x1={189} y1={198} x2={240} y2={198} label="false" active={false} labelPos={{x:219,y:187}} />
      <Rect x={240} y={228} w={80} h={30} label="sin cambio" active={false} />
    </svg>
  );
}

// setPaginas – Alternativo
function DiagPaginasAlt() {
  return (
    <svg width="310" height={370} viewBox="0 0 310 370">
      <Oval x={130} y={30} label="Inicio" active />
      <Arrow x1={130} y1={47} x2={130} y2={85} active />
      <Rect x={130} y={108} w={165} h={38} label="numPaginas = 0" active />
      <Arrow x1={130} y1={127} x2={130} y2={165} active />
      <Diamond x={130} y={198} size={38} label="numPaginas > 0?" active />
      {/* true inactive */}
      <Arrow x1={130} y1={236} x2={130} y2={273} label="true" active={false} labelPos={{x:148,y:256}} />
      <Rect x={130} y={297} w={190} h={36} label="this.numPaginas = 0" active={false} />
      {/* false active */}
      <Arrow x1={184} y1={198} x2={252} y2={198} label="false" active labelPos={{x:223,y:187}} />
      <Arrow x1={252} y1={198} x2={252} y2={293} active />
      <Rect x={252} y={313} w={120} h={38} label="numPaginas sin\ncambio (=320)" active />
      <Arrow x1={252} y1={332} x2={252} y2={355} active />
      <Oval x={252} y={368} label="Fin" active />
    </svg>
  );
}

// ── Case data ─────────────────────────────────────────────────
const CASES = [
  { id: "CP-01", uc: "UC-01", metodo: "prestarLibro()", flujo: "Normal",
    titulo: "Préstamo: libro disponible",
    desc: "Condición !prestado evaluada como TRUE → prestado cambia a true, retorna true.",
    Diagram: DiagPrestarNormal },
  { id: "CP-02", uc: "UC-01", metodo: "prestarLibro()", flujo: "Alternativo",
    titulo: "Préstamo: libro ya prestado",
    desc: "Condición !prestado evaluada como FALSE → no hay cambio, retorna false.",
    Diagram: DiagPrestarAlt },
  { id: "CP-03", uc: "UC-02", metodo: "reservarLibro()", flujo: "Normal",
    titulo: "Reserva: libro prestado sin reserva",
    desc: "Condición (!reservado && prestado) evaluada como TRUE → reservado = true, retorna true.",
    Diagram: DiagReservarNormal },
  { id: "CP-04", uc: "UC-02", metodo: "reservarLibro()", flujo: "Alternativo",
    titulo: "Reserva: libro no prestado",
    desc: "Condición (!reservado && prestado) evaluada como FALSE (prestado=false) → retorna false.",
    Diagram: DiagReservarAlt },
  { id: "CP-05", uc: "UC-03", metodo: "devolverLibro()", flujo: "Normal",
    titulo: "Devolución: libro prestado",
    desc: "Se invoca devolverLibro() → prestado cambia a false, se imprime mensaje de confirmación.",
    Diagram: DiagDevolverNormal },
  { id: "CP-06", uc: "UC-03", metodo: "devolverLibro()", flujo: "Alternativo",
    titulo: "Devolución: sin libros prestados",
    desc: "No existen libros prestados → el sistema muestra mensaje y regresa al menú sin invocar devolverLibro().",
    Diagram: DiagDevolverAlt },
  { id: "CP-07", uc: "UC-04", metodo: "setIsbn()", flujo: "Normal",
    titulo: "ISBN: valor de 13 dígitos válido",
    desc: "Condición (isbn != null && matches(\\d{13})) evaluada como TRUE → isbn actualizado.",
    Diagram: DiagIsbnNormal },
  { id: "CP-08", uc: "UC-04", metodo: "setIsbn()", flujo: "Alternativo",
    titulo: "ISBN: formato inválido",
    desc: "Condición (isbn != null && matches(\\d{13})) evaluada como FALSE → isbn sin cambio.",
    Diagram: DiagIsbnAlt },
  { id: "CP-09", uc: "UC-05", metodo: "setPaginas()", flujo: "Normal",
    titulo: "Páginas: valor positivo (320)",
    desc: "Condición (numPaginas > 0) evaluada como TRUE → numPaginas actualizado a 320.",
    Diagram: DiagPaginasNormal },
  { id: "CP-10", uc: "UC-05", metodo: "setPaginas()", flujo: "Alternativo",
    titulo: "Páginas: valor cero",
    desc: "Condición (numPaginas > 0) evaluada como FALSE (valor=0) → numPaginas sin cambio.",
    Diagram: DiagPaginasAlt },
];

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState(0);
  const c = CASES[selected];
  const isNormal = c.flujo === "Normal";

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: "#0D1B2A",
      minHeight: "100vh",
      color: WHITE,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1F4E79 0%, #0D1B2A 100%)",
        borderBottom: "2px solid #FF69B4",
        padding: "18px 32px 14px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: PINK, letterSpacing: 2 }}>
          ◈ DECISION COVERAGE
        </div>
        <div style={{ fontSize: 13, color: "#8AACC8", marginTop: 2 }}>
          Clase Libro.java — Diagramas de Flujo de Casos de Prueba
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: "10px 18px 0",
        borderBottom: "1px solid #1F4E79",
        background: "#111C2A",
      }}>
        {CASES.map((c, i) => {
          const active = i === selected;
          const norm = c.flujo === "Normal";
          return (
            <button key={c.id} onClick={() => setSelected(i)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px 6px 0 0",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'Courier New', monospace",
                fontWeight: active ? 700 : 400,
                background: active ? (norm ? PINK : "#c0392b") : "#1a2a3a",
                color: active ? WHITE : (norm ? "#FF9EC4" : "#FF8C7A"),
                borderBottom: active ? `3px solid ${norm ? PINK_DARK : "#922B21"}` : "3px solid transparent",
                transition: "all 0.15s",
                letterSpacing: 0.5,
              }}>
              {c.id}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{
        display: "flex",
        flex: 1,
        padding: "24px 28px",
        gap: 28,
        flexWrap: "wrap",
      }}>

        {/* Left: info panel */}
        <div style={{
          flex: "0 0 310px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          {/* Case header card */}
          <div style={{
            background: isNormal
              ? "linear-gradient(135deg, #1a4a2e 0%, #0D2818 100%)"
              : "linear-gradient(135deg, #4a1a1a 0%, #2a0a0a 100%)",
            border: `2px solid ${isNormal ? "#27AE60" : RED}`,
            borderRadius: 10,
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: PINK, letterSpacing: 1 }}>{c.id}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                background: isNormal ? GREEN : RED, color: WHITE,
              }}>{c.flujo}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 6 }}>{c.titulo}</div>
            <div style={{ fontSize: 11, color: "#8AACC8", marginBottom: 10 }}>
              {c.uc} &nbsp;·&nbsp; <span style={{ color: PINK }}>{c.metodo}</span>
            </div>
            <div style={{ fontSize: 11, color: "#CBD5E0", lineHeight: 1.6 }}>{c.desc}</div>
          </div>

          {/* Legend */}
          <div style={{
            background: "#111C2A",
            border: "1px solid #1F4E79",
            borderRadius: 10,
            padding: "14px 18px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8AACC8", marginBottom: 10, letterSpacing: 1 }}>
              LEYENDA
            </div>
            {[
              { color: PINK, label: "Flujo activo (camino recorrido)" },
              { color: GRAY_LIGHT, label: "Nodo inactivo", border: NAVY },
              { color: GRAY, label: "Arista inactiva" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: l.color,
                  border: `2px solid ${l.border || PINK_DARK}`,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, color: "#CBD5E0" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Decision outcome */}
          <div style={{
            background: "#111C2A",
            border: `1px solid ${isNormal ? GREEN : RED}`,
            borderRadius: 10,
            padding: "14px 18px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8AACC8", marginBottom: 8, letterSpacing: 1 }}>
              DECISIÓN EVALUADA
            </div>
            <div style={{
              fontSize: 13,
              color: isNormal ? "#6FCF97" : "#FF8C7A",
              fontWeight: 700,
              marginBottom: 4,
            }}>
              {isNormal ? "✓  Condición = TRUE" : "✗  Condición = FALSE"}
            </div>
            <div style={{ fontSize: 11, color: "#8AACC8" }}>
              Tipo de prueba: <span style={{ color: YELLOW }}>Decision Coverage</span>
            </div>
          </div>

          {/* All cases mini list */}
          <div style={{
            background: "#111C2A",
            border: "1px solid #1F4E79",
            borderRadius: 10,
            padding: "14px 18px",
            flex: 1,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8AACC8", marginBottom: 10, letterSpacing: 1 }}>
              TODOS LOS CASOS
            </div>
            {CASES.map((ca, i) => (
              <div key={ca.id}
                onClick={() => setSelected(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 8px", borderRadius: 6, cursor: "pointer",
                  background: i === selected ? "#1F4E79" : "transparent",
                  marginBottom: 2,
                  transition: "background 0.15s",
                }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: PINK, minWidth: 42 }}>{ca.id}</span>
                <span style={{ fontSize: 10, color: "#8AACC8", flex: 1 }}>{ca.metodo}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                  background: ca.flujo === "Normal" ? "#27AE60" : RED,
                  color: WHITE,
                }}>{ca.flujo === "Normal" ? "N" : "A"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: diagram */}
        <div style={{
          flex: 1,
          minWidth: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 16,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#8AACC8",
            letterSpacing: 2, alignSelf: "flex-start",
          }}>
            DIAGRAMA DE FLUJO — {c.id}
          </div>

          <div style={{
            background: "#F8FAFC",
            borderRadius: 14,
            border: `3px solid ${isNormal ? GREEN : RED}`,
            padding: "30px 20px",
            boxShadow: `0 0 40px ${isNormal ? "rgba(39,174,96,0.2)" : "rgba(231,76,60,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 360,
            width: "100%",
            maxWidth: 480,
          }}>
            <c.Diagram />
          </div>

          {/* Color explanation */}
          <div style={{
            background: "#111C2A",
            border: "1px solid #1F4E79",
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 11,
            color: "#8AACC8",
            lineHeight: 1.7,
            maxWidth: 480,
            width: "100%",
          }}>
            <span style={{ color: PINK, fontWeight: 700 }}>★ Flujo resaltado en rosa:</span>{" "}
            todos los nodos y aristas de color <span style={{ color: PINK }}>rosa/magenta</span> representan
            el camino que se recorre durante la ejecución del caso de prueba <strong style={{ color: WHITE }}>{c.id}</strong>.{" "}
            Los nodos en <span style={{ color: GRAY }}>gris</span> son ramas que <em>no</em> se ejecutan en este escenario.
          </div>
        </div>
      </div>
    </div>
  );
}
