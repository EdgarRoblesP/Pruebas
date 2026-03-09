import { useState } from "react";

const PINK       = "#FF69B4";
const PINK_DARK  = "#c2185b";
const NAVY       = "#1F4E79";
const WHITE      = "#FFFFFF";
const GRAY_NODE  = "#D8E4EF";
const GRAY_EDGE  = "#9DAFC0";
const GRAY_TEXT  = "#3A5068";
const GREEN      = "#27AE60";
const RED        = "#E74C3C";
const YELLOW     = "#F6C90E";
const BG_DIAG    = "#F4F8FC";

// ── Multi-line centered text ──────────────────────────────────
function MText({ x, y, lines, active, size = 11 }) {
  const lh = size * 1.45;
  const startY = y - ((lines.length - 1) * lh) / 2;
  return (
    <>
      {lines.map((l, i) => (
        <text key={i} x={x} y={startY + i * lh}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size} fontFamily="'Courier New', monospace"
          fontWeight={active ? "700" : "500"}
          fill={active ? WHITE : GRAY_TEXT}>{l}</text>
      ))}
    </>
  );
}

function Oval({ x, y, w = 84, h = 32, lines, active }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w/2} ry={h/2}
        fill={active ? PINK : GRAY_NODE}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <MText x={x} y={y} lines={lines} active={active} size={13} />
    </g>
  );
}

function Box({ x, y, w, h, lines, active }) {
  return (
    <g>
      <rect x={x-w/2} y={y-h/2} width={w} height={h} rx={5}
        fill={active ? PINK : GRAY_NODE}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <MText x={x} y={y} lines={lines} active={active} size={11} />
    </g>
  );
}

function Diamond({ x, y, hw, hh, lines, active }) {
  const pts = `${x},${y-hh} ${x+hw},${y} ${x},${y+hh} ${x-hw},${y}`;
  return (
    <g>
      <polygon points={pts}
        fill={active ? PINK : GRAY_NODE}
        stroke={active ? PINK_DARK : NAVY}
        strokeWidth={active ? 2.5 : 1.5} />
      <MText x={x} y={y} lines={lines} active={active} size={11} />
    </g>
  );
}

function arrowHead(x2, y2, angle, color) {
  const al = 9;
  const p1x = x2 - al * Math.cos(angle - 0.38);
  const p1y = y2 - al * Math.sin(angle - 0.38);
  const p2x = x2 - al * Math.cos(angle + 0.38);
  const p2y = y2 - al * Math.sin(angle + 0.38);
  return <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} />;
}

function Arrow({ x1, y1, x2, y2, label, active, lx, ly }) {
  const color = active ? PINK_DARK : GRAY_EDGE;
  const angle = Math.atan2(y2-y1, x2-x1);
  const tlx = lx !== undefined ? lx : (x1+x2)/2;
  const tly = ly !== undefined ? ly : (y1+y2)/2 - 9;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={active?2.5:1.5} />
      {arrowHead(x2, y2, angle, color)}
      {label && <text x={tlx} y={tly} textAnchor="middle" fontSize={11}
        fontFamily="'Courier New', monospace"
        fontWeight={active?"700":"400"}
        fill={active ? PINK_DARK : "#607A90"}>{label}</text>}
    </g>
  );
}

// Right-then-down elbow: (x1,y1) → right to cornerX → down to (cornerX, y2)
function ElbowRD({ x1, y1, cornerX, y2, label, active, lx, ly }) {
  const color = active ? PINK_DARK : GRAY_EDGE;
  const sw    = active ? 2.5 : 1.5;
  const tlx = lx !== undefined ? lx : cornerX;
  const tly = ly !== undefined ? ly : y1 - 9;
  return (
    <g>
      <polyline points={`${x1},${y1} ${cornerX},${y1} ${cornerX},${y2}`}
        fill="none" stroke={color} strokeWidth={sw} />
      {arrowHead(cornerX, y2, Math.PI/2, color)}
      {label && <text x={tlx} y={tly} textAnchor="middle" fontSize={11}
        fontFamily="'Courier New', monospace"
        fontWeight={active?"700":"400"}
        fill={active ? PINK_DARK : "#607A90"}>{label}</text>}
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
//  DIAGRAMS
// ══════════════════════════════════════════════════════════════

/* prestarLibro
   ◇ !prestado?
     true  ↓  → Box: prestado=true / return true → Fin
     false →  → Box: (sin cambio) / return false → Fin
*/
function DiagPrestar({ activeTrue: aT }) {
  const cx = 180; // center x for main column
  const rx = 370; // right column x
  return (
    <svg width="490" height="560" viewBox="0 0 490 560">
      <Oval x={cx} y={44} lines={["Inicio"]} active />
      <Arrow x1={cx} y1={60} x2={cx} y2={96} active />

      <Box x={cx} y={124} w={220} h={46}
        lines={[`prestado = ${aT?"false":"true"}`]} active />
      <Arrow x1={cx} y1={147} x2={cx} y2={183} active />

      <Diamond x={cx} y={224} hw={90} hh={42}
        lines={["!prestado?"]} active />

      {/* TRUE branch – down */}
      <Arrow x1={cx} y1={266} x2={cx} y2={318}
        label="true" active={aT} lx={cx+20} ly={294} />
      <Box x={cx} y={350} w={230} h={52}
        lines={["prestado = true","return true"]} active={aT} />
      <Arrow x1={cx} y1={376} x2={cx} y2={420} active={aT} />
      <Oval x={cx} y={444} lines={["Fin"]} active={aT} />

      {/* FALSE branch – right elbow */}
      <ElbowRD x1={cx+90} y1={224} cornerX={rx} y2={318}
        label="false" active={!aT} lx={rx+8} ly={210} />
      <Box x={rx} y={350} w={210} h={52}
        lines={["(sin cambio)","return false"]} active={!aT} />
      <Arrow x1={rx} y1={376} x2={rx} y2={420} active={!aT} />
      <Oval x={rx} y={444} lines={["Fin"]} active={!aT} />
    </svg>
  );
}

/* reservarLibro
   ◇ !reservado && prestado==true?
     true  ↓  → reservado=true / return true → Fin
     false →  → (sin cambio)  / return false → Fin
*/
function DiagReservar({ activeTrue: aT }) {
  const cx = 190;
  const rx = 390;
  return (
    <svg width="510" height="590" viewBox="0 0 510 590">
      <Oval x={cx} y={44} lines={["Inicio"]} active />
      <Arrow x1={cx} y1={60} x2={cx} y2={96} active />

      <Box x={cx} y={132} w={255} h={54}
        lines={[
          `prestado = ${aT?"true":"false"}`,
          "reservado = false",
        ]} active />
      <Arrow x1={cx} y1={159} x2={cx} y2={197} active />

      <Diamond x={cx} y={248} hw={115} hh={50}
        lines={["!reservado &&","prestado==true?"]} active />

      {/* TRUE */}
      <Arrow x1={cx} y1={298} x2={cx} y2={352}
        label="true" active={aT} lx={cx+20} ly={327} />
      <Box x={cx} y={386} w={240} h={52}
        lines={["reservado = true","return true"]} active={aT} />
      <Arrow x1={cx} y1={412} x2={cx} y2={456} active={aT} />
      <Oval x={cx} y={480} lines={["Fin"]} active={aT} />

      {/* FALSE */}
      <ElbowRD x1={cx+115} y1={248} cornerX={rx} y2={352}
        label="false" active={!aT} lx={rx+8} ly={234} />
      <Box x={rx} y={386} w={210} h={52}
        lines={["(sin cambio)","return false"]} active={!aT} />
      <Arrow x1={rx} y1={412} x2={rx} y2={456} active={!aT} />
      <Oval x={rx} y={480} lines={["Fin"]} active={!aT} />
    </svg>
  );
}

/* devolverLibro
   ◇ ¿Existen libros prestados?
     Sí  ↓  → seleccionar → devolverLibro() → prestado=false → println → Fin
     No  →  → mensaje informativo → menú principal → Fin
*/
function DiagDevolver({ activeTrue: aT }) {
  const cx = 200;
  const rx = 400;
  return (
    <svg width="540" height="620" viewBox="0 0 540 620">
      <Oval x={cx} y={44} lines={["Inicio"]} active />
      <Arrow x1={cx} y1={60} x2={cx} y2={96} active />

      <Diamond x={cx} y={148} hw={120} hh={50}
        lines={["¿Existen libros","prestados?"]} active />

      {/* TRUE (Sí) */}
      <Arrow x1={cx} y1={198} x2={cx} y2={248}
        label="Sí" active={aT} lx={cx+18} ly={224} />
      <Box x={cx} y={278} w={240} h={46}
        lines={["Seleccionar libro"]} active={aT} />
      <Arrow x1={cx} y1={301} x2={cx} y2={340} active={aT} />
      <Box x={cx} y={372} w={255} h={52}
        lines={["devolverLibro()","prestado = false"]} active={aT} />
      <Arrow x1={cx} y1={398} x2={cx} y2={438} active={aT} />
      <Box x={cx} y={468} w={255} h={52}
        lines={['println: "estado', 'a disponible"']} active={aT} />
      <Arrow x1={cx} y1={494} x2={cx} y2={540} active={aT} />
      <Oval x={cx} y={562} lines={["Fin"]} active={aT} />

      {/* FALSE (No) */}
      <ElbowRD x1={cx+120} y1={148} cornerX={rx} y2={248}
        label="No" active={!aT} lx={rx+8} ly={134} />
      <Box x={rx} y={278} w={200} h={52}
        lines={['"No hay libros',  'en préstamo"']} active={!aT} />
      <Arrow x1={rx} y1={304} x2={rx} y2={352} active={!aT} />
      <Box x={rx} y={382} w={190} h={46}
        lines={["→ Menú principal"]} active={!aT} />
      <Arrow x1={rx} y1={405} x2={rx} y2={452} active={!aT} />
      <Oval x={rx} y={474} lines={["Fin"]} active={!aT} />
    </svg>
  );
}

/* setIsbn
   ◇ isbn!=null && matches(\d{13})?
     true  ↓  → this.isbn = isbn → Fin
     false →  → isbn sin cambio  → Fin
*/
function DiagIsbn({ activeTrue: aT }) {
  const cx = 190;
  const rx = 390;
  return (
    <svg width="510" height="560" viewBox="0 0 510 560">
      <Oval x={cx} y={44} lines={["Inicio"]} active />
      <Arrow x1={cx} y1={60} x2={cx} y2={96} active />

      <Box x={cx} y={132} w={265} h={54}
        lines={[
          aT ? 'isbn="9780134685991"' : 'isbn="123ABC"',
          "(valor ingresado)",
        ]} active />
      <Arrow x1={cx} y1={159} x2={cx} y2={197} active />

      <Diamond x={cx} y={252} hw={120} hh={54}
        lines={['isbn!=null &&', 'matches("\\d{13}")?']} active />

      {/* TRUE */}
      <Arrow x1={cx} y1={306} x2={cx} y2={358}
        label="true" active={aT} lx={cx+20} ly={334} />
      <Box x={cx} y={390} w={250} h={52}
        lines={["this.isbn = isbn","(ISBN actualizado)"]} active={aT} />
      <Arrow x1={cx} y1={416} x2={cx} y2={460} active={aT} />
      <Oval x={cx} y={482} lines={["Fin"]} active={aT} />

      {/* FALSE */}
      <ElbowRD x1={cx+120} y1={252} cornerX={rx} y2={358}
        label="false" active={!aT} lx={rx+8} ly={238} />
      <Box x={rx} y={390} w={195} h={52}
        lines={["isbn sin cambio","(valor previo)"]} active={!aT} />
      <Arrow x1={rx} y1={416} x2={rx} y2={460} active={!aT} />
      <Oval x={rx} y={482} lines={["Fin"]} active={!aT} />
    </svg>
  );
}

/* setPaginas
   ◇ numPaginas > 0?
     true  ↓  → this.numPaginas = num → Fin
     false →  → sin cambio           → Fin
*/
function DiagPaginas({ activeTrue: aT }) {
  const cx = 185;
  const rx = 380;
  return (
    <svg width="500" height="540" viewBox="0 0 500 540">
      <Oval x={cx} y={44} lines={["Inicio"]} active />
      <Arrow x1={cx} y1={60} x2={cx} y2={96} active />

      <Box x={cx} y={132} w={250} h={54}
        lines={[
          `numPaginas = ${aT?"320":"0"}`,
          "(valor ingresado)",
        ]} active />
      <Arrow x1={cx} y1={159} x2={cx} y2={197} active />

      <Diamond x={cx} y={246} hw={105} hh={48}
        lines={["numPaginas > 0?"]} active />

      {/* TRUE */}
      <Arrow x1={cx} y1={294} x2={cx} y2={346}
        label="true" active={aT} lx={cx+22} ly={322} />
      <Box x={cx} y={378} w={255} h={52}
        lines={["this.numPaginas =","numPaginas"]} active={aT} />
      <Arrow x1={cx} y1={404} x2={cx} y2={448} active={aT} />
      <Oval x={cx} y={470} lines={["Fin"]} active={aT} />

      {/* FALSE */}
      <ElbowRD x1={cx+105} y1={246} cornerX={rx} y2={346}
        label="false" active={!aT} lx={rx+8} ly={232} />
      <Box x={rx} y={378} w={195} h={52}
        lines={["numPaginas sin","cambio (prev.)"]} active={!aT} />
      <Arrow x1={rx} y1={404} x2={rx} y2={448} active={!aT} />
      <Oval x={rx} y={470} lines={["Fin"]} active={!aT} />
    </svg>
  );
}

// ── Case registry ─────────────────────────────────────────────
const CASES = [
  { id:"CP-01", uc:"UC-01", metodo:"prestarLibro()", flujo:"Normal",
    titulo:"Préstamo: libro disponible",
    desc:"Condición !prestado evaluada como TRUE → prestado cambia a true, retorna true.",
    Diagram: () => <DiagPrestar activeTrue={true} /> },
  { id:"CP-02", uc:"UC-01", metodo:"prestarLibro()", flujo:"Alternativo",
    titulo:"Préstamo: libro ya prestado",
    desc:"Condición !prestado evaluada como FALSE → no hay cambio de estado, retorna false.",
    Diagram: () => <DiagPrestar activeTrue={false} /> },
  { id:"CP-03", uc:"UC-02", metodo:"reservarLibro()", flujo:"Normal",
    titulo:"Reserva: libro prestado sin reserva",
    desc:"Condición (!reservado && prestado) evaluada como TRUE → reservado=true, retorna true.",
    Diagram: () => <DiagReservar activeTrue={true} /> },
  { id:"CP-04", uc:"UC-02", metodo:"reservarLibro()", flujo:"Alternativo",
    titulo:"Reserva: libro no prestado",
    desc:"Condición (!reservado && prestado) evaluada como FALSE → retorna false.",
    Diagram: () => <DiagReservar activeTrue={false} /> },
  { id:"CP-05", uc:"UC-03", metodo:"devolverLibro()", flujo:"Normal",
    titulo:"Devolución: libro prestado",
    desc:"Existen libros prestados → se invoca devolverLibro(), prestado cambia a false.",
    Diagram: () => <DiagDevolver activeTrue={true} /> },
  { id:"CP-06", uc:"UC-03", metodo:"devolverLibro()", flujo:"Alternativo",
    titulo:"Devolución: sin libros prestados",
    desc:"No existen libros prestados → mensaje informativo, regresa al menú sin ejecutar devolverLibro().",
    Diagram: () => <DiagDevolver activeTrue={false} /> },
  { id:"CP-07", uc:"UC-04", metodo:"setIsbn()", flujo:"Normal",
    titulo:"ISBN: valor de 13 dígitos válido",
    desc:'Condición (isbn!=null && matches("\\d{13}")) evaluada como TRUE → isbn actualizado.',
    Diagram: () => <DiagIsbn activeTrue={true} /> },
  { id:"CP-08", uc:"UC-04", metodo:"setIsbn()", flujo:"Alternativo",
    titulo:"ISBN: formato inválido",
    desc:'Condición (isbn!=null && matches("\\d{13}")) evaluada como FALSE → isbn sin cambio.',
    Diagram: () => <DiagIsbn activeTrue={false} /> },
  { id:"CP-09", uc:"UC-05", metodo:"setPaginas()", flujo:"Normal",
    titulo:"Páginas: valor positivo (320)",
    desc:"Condición numPaginas > 0 evaluada como TRUE → numPaginas actualizado a 320.",
    Diagram: () => <DiagPaginas activeTrue={true} /> },
  { id:"CP-10", uc:"UC-05", metodo:"setPaginas()", flujo:"Alternativo",
    titulo:"Páginas: valor cero",
    desc:"Condición numPaginas > 0 evaluada como FALSE (valor=0) → numPaginas sin cambio.",
    Diagram: () => <DiagPaginas activeTrue={false} /> },
];

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [sel, setSel] = useState(0);
  const c = CASES[sel];
  const isN = c.flujo === "Normal";

  return (
    <div style={{fontFamily:"'Courier New',monospace",background:"#0D1B2A",minHeight:"100vh",color:WHITE,display:"flex",flexDirection:"column"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1F4E79,#0D1B2A)",borderBottom:`2px solid ${PINK}`,padding:"14px 26px 10px",display:"flex",alignItems:"center",gap:14}}>
        <div style={{fontSize:19,fontWeight:700,color:PINK,letterSpacing:2}}>◈ DECISION COVERAGE</div>
        <div style={{fontSize:11,color:"#8AACC8"}}>Clase Libro.java — Diagramas de Flujo</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",flexWrap:"wrap",gap:3,padding:"8px 14px 0",borderBottom:"1px solid #1F4E79",background:"#111C2A"}}>
        {CASES.map((ca,i) => {
          const active = i===sel;
          const nm = ca.flujo==="Normal";
          return (
            <button key={ca.id} onClick={()=>setSel(i)} style={{
              padding:"5px 12px",borderRadius:"6px 6px 0 0",border:"none",cursor:"pointer",
              fontSize:11,fontFamily:"'Courier New',monospace",fontWeight:active?700:400,
              background:active?(nm?PINK:"#c0392b"):"#1a2a3a",
              color:active?WHITE:(nm?"#FF9EC4":"#FF8C7A"),
              borderBottom:active?`3px solid ${nm?PINK_DARK:"#922B21"}`:"3px solid transparent",
              transition:"all 0.15s",
            }}>{ca.id}</button>
          );
        })}
      </div>

      {/* Main */}
      <div style={{display:"flex",flex:1,padding:"18px 22px",gap:22,flexWrap:"wrap"}}>

        {/* Left panel */}
        <div style={{flex:"0 0 272px",display:"flex",flexDirection:"column",gap:11}}>

          {/* Card */}
          <div style={{background:isN?"linear-gradient(135deg,#1a4a2e,#0D2818)":"linear-gradient(135deg,#4a1a1a,#2a0a0a)",border:`2px solid ${isN?GREEN:RED}`,borderRadius:10,padding:"13px 15px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
              <span style={{fontSize:19,fontWeight:700,color:PINK}}>{c.id}</span>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:20,background:isN?GREEN:RED,color:WHITE}}>{c.flujo}</span>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:WHITE,marginBottom:4}}>{c.titulo}</div>
            <div style={{fontSize:10,color:"#8AACC8",marginBottom:7}}>{c.uc} · <span style={{color:PINK}}>{c.metodo}</span></div>
            <div style={{fontSize:10,color:"#CBD5E0",lineHeight:1.65}}>{c.desc}</div>
          </div>

          {/* Legend */}
          <div style={{background:"#111C2A",border:"1px solid #1F4E79",borderRadius:10,padding:"11px 14px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#8AACC8",marginBottom:7,letterSpacing:1}}>LEYENDA</div>
            {[
              {color:PINK,   border:PINK_DARK, label:"Flujo evaluado (activo)"},
              {color:GRAY_NODE,border:NAVY,    label:"Nodo no recorrido"},
            ].map((l,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{width:15,height:15,borderRadius:3,background:l.color,border:`2px solid ${l.border}`,flexShrink:0}} />
                <span style={{fontSize:10,color:"#CBD5E0"}}>{l.label}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <div style={{width:20,height:3,background:GRAY_EDGE,borderRadius:2,flexShrink:0}} />
              <span style={{fontSize:10,color:"#CBD5E0"}}>Arista no recorrida</span>
            </div>
          </div>

          {/* Decision */}
          <div style={{background:"#111C2A",border:`1px solid ${isN?GREEN:RED}`,borderRadius:10,padding:"11px 14px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#8AACC8",marginBottom:6,letterSpacing:1}}>DECISIÓN EVALUADA</div>
            <div style={{fontSize:12,fontWeight:700,color:isN?"#6FCF97":"#FF8C7A",marginBottom:3}}>
              {isN?"✓  Condición = TRUE":"✗  Condición = FALSE"}
            </div>
            <div style={{fontSize:10,color:"#8AACC8"}}>
              Tipo: <span style={{color:YELLOW}}>Decision Coverage</span>
            </div>
          </div>

          {/* Case list */}
          <div style={{background:"#111C2A",border:"1px solid #1F4E79",borderRadius:10,padding:"11px 14px",flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:"#8AACC8",marginBottom:7,letterSpacing:1}}>TODOS LOS CASOS</div>
            {CASES.map((ca,i)=>(
              <div key={ca.id} onClick={()=>setSel(i)} style={{
                display:"flex",alignItems:"center",gap:7,padding:"4px 6px",borderRadius:5,
                cursor:"pointer",background:i===sel?"#1F4E79":"transparent",marginBottom:2,transition:"background 0.15s",
              }}>
                <span style={{fontSize:10,fontWeight:700,color:PINK,minWidth:36}}>{ca.id}</span>
                <span style={{fontSize:9,color:"#8AACC8",flex:1}}>{ca.metodo}</span>
                <span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:8,background:ca.flujo==="Normal"?GREEN:RED,color:WHITE}}>
                  {ca.flujo==="Normal"?"N":"A"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagram */}
        <div style={{flex:1,minWidth:340,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#8AACC8",letterSpacing:2,alignSelf:"flex-start"}}>
            DIAGRAMA DE FLUJO — {c.id}
          </div>

          <div style={{
            background:BG_DIAG,borderRadius:14,
            border:`3px solid ${isN?GREEN:RED}`,
            padding:"24px 20px",
            boxShadow:`0 0 48px ${isN?"rgba(39,174,96,0.18)":"rgba(231,76,60,0.18)"}`,
            display:"flex",alignItems:"flex-start",justifyContent:"center",
            width:"100%",overflowX:"auto",
          }}>
            <c.Diagram />
          </div>

          <div style={{background:"#111C2A",border:"1px solid #1F4E79",borderRadius:10,padding:"10px 15px",fontSize:10,color:"#8AACC8",lineHeight:1.7,width:"100%"}}>
            <span style={{color:PINK,fontWeight:700}}>★ Flujo resaltado en rosa:</span>{" "}
            nodos y aristas de color rosa representan el camino recorrido en <strong style={{color:WHITE}}>{c.id}</strong>.{" "}
            Las ramas en <span style={{color:GRAY_NODE,fontWeight:700}}>gris</span> muestran los caminos alternativos del punto de decisión que <em>no</em> se ejecutan en este caso, pero que son parte del método.
          </div>
        </div>
      </div>
    </div>
  );
}
