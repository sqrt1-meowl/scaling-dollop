export type GeometryFigureType =
  | "triangle-area"
  | "prism"
  | "similar-squares"
  | "vertical-angles"
  | "isosceles"
  | "similar-triangles"
  | "right-triangle"
  | "trig-triangle"
  | "circle-tangent"
  | "coordinate-circle"
  | "composite-region"
  | "parallel-lines";

const stroke = "#17385f";
const accent = "#b26134";
const muted = "#687383";

export function GeometryFigure({ type }: { type: GeometryFigureType }) {
  const shared = { fill: "none", stroke, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (type === "triangle-area") return <svg viewBox="0 0 260 180" role="img" aria-label="Triangle with base 14 and perpendicular height 9">
    <path d="M35 145H225L155 35Z" {...shared}/><path d="M155 35V145" {...shared} strokeDasharray="6 6"/><path d="M145 145v-10h10" {...shared}/>
    <text x="122" y="169">14</text><text x="163" y="93">9</text>
  </svg>;

  if (type === "prism") return <svg viewBox="0 0 260 180" role="img" aria-label="Rectangular prism with dimensions 5, 4, and 9">
    <path d="M48 58h126v88H48zM48 58l36-26h126l-36 26M174 58l36-26v88l-36 26" {...shared}/>
    <text x="104" y="167">5</text><text x="218" y="93">4</text><text x="58" y="48">9</text>
  </svg>;

  if (type === "similar-squares") return <svg viewBox="0 0 260 180" role="img" aria-label="Two similar squares with corresponding side ratio 2 to 5">
    <rect x="35" y="78" width="62" height="62" {...shared}/><rect x="133" y="32" width="112" height="112" {...shared}/>
    <text x="61" y="160">2</text><text x="184" y="164">5</text><path d="M99 64h30" {...shared} strokeDasharray="5 5"/>
  </svg>;

  if (type === "vertical-angles") return <svg viewBox="0 0 260 180" role="img" aria-label="Two intersecting lines with a 47 degree angle">
    <path d="M30 145L230 35M30 35l200 110" {...shared}/><path d="M108 81A34 34 0 0 1 151 81" fill="none" stroke={accent} strokeWidth="2.4"/>
    <text x="117" y="69" fill={accent}>47°</text>
  </svg>;

  if (type === "isosceles") return <svg viewBox="0 0 260 180" role="img" aria-label="Isosceles triangle with a 40 degree vertex angle">
    <path d="M35 150H225L130 28Z" {...shared}/><path d="M74 100l9 7M177 107l9-7" {...shared}/>
    <path d="M113 50A27 27 0 0 1 147 50" fill="none" stroke={accent} strokeWidth="2.4"/><text x="117" y="74" fill={accent}>40°</text>
  </svg>;

  if (type === "similar-triangles") return <svg viewBox="0 0 260 180" role="img" aria-label="Two similar triangles with corresponding sides 9 to 15 and 12 to an unknown length">
    <path d="M20 145h88L56 72zM132 145h112l-67-105z" {...shared}/>
    <text x="56" y="165">12</text><text x="23" y="111">9</text><text x="178" y="165">?</text><text x="135" y="101">15</text>
  </svg>;

  if (type === "right-triangle") return <svg viewBox="0 0 260 180" role="img" aria-label="Right triangle with legs 5 and 12 and unknown hypotenuse">
    <path d="M42 145H225L42 48Z" {...shared}/><path d="M42 132h13v13" {...shared}/>
    <text x="27" y="101">5</text><text x="126" y="166">12</text><text x="143" y="87">?</text>
  </svg>;

  if (type === "trig-triangle") return <svg viewBox="0 0 260 180" role="img" aria-label="Right triangle showing angle theta, opposite side 5, and hypotenuse 13">
    <path d="M36 145H224L36 66Z" {...shared}/><path d="M36 132h13v13" {...shared}/><path d="M192 145a32 32 0 0 0-4-15" fill="none" stroke={accent} strokeWidth="2.4"/>
    <text x="199" y="135" fill={accent}>θ</text><text x="19" y="111">5</text><text x="131" y="91">13</text>
  </svg>;

  if (type === "circle-tangent") return <svg viewBox="0 0 260 180" role="img" aria-label="Circle with radius perpendicular to a tangent line">
    <circle cx="112" cy="90" r="58" {...shared}/><path d="M112 90L170 90M170 25v130" {...shared}/><path d="M158 90V78h12" {...shared}/>
    <circle cx="112" cy="90" r="3" fill={stroke}/><text x="102" y="112">O</text><text x="177" y="84">t</text>
  </svg>;

  if (type === "coordinate-circle") return <svg viewBox="0 0 260 180" role="img" aria-label="Circle centered at 2 comma 3 with a point at 6 comma 3">
    <path d="M25 145H238M70 164V18" {...shared} strokeWidth="1.5"/><circle cx="130" cy="85" r="48" {...shared}/>
    <circle cx="130" cy="85" r="3.5" fill={stroke}/><circle cx="178" cy="85" r="4" fill={accent}/><path d="M130 85h48" {...shared} strokeDasharray="5 5"/>
    <text x="119" y="75">(2, 3)</text><text x="177" y="74" fill={accent}>(6, 3)</text>
  </svg>;

  if (type === "composite-region") return <svg viewBox="0 0 260 180" role="img" aria-label="Rectangle 18 by 12 with a 7 by 5 rectangle removed from one corner">
    <path d="M30 30H230V150H30V30M152 30v50h78" {...shared}/><path d="M152 30h78v50" fill="#f7f4ed" stroke={stroke} strokeWidth="2.4"/>
    <text x="119" y="170">18</text><text x="8" y="95">12</text><text x="184" y="23">7</text><text x="237" y="60">5</text>
  </svg>;

  return <svg viewBox="0 0 260 180" role="img" aria-label="Parallel lines cut by a transversal with algebraic angle measures">
    <path d="M25 50H235M25 130H235M82 16l88 150" {...shared}/><path d="M84 50a28 28 0 0 1 14 20M142 130a28 28 0 0 0 14-20" fill="none" stroke={accent} strokeWidth="2.4"/>
    <text x="96" y="73" fill={accent}>5x−12</text><text x="149" y="108" fill={accent}>3x+24</text><text x="207" y="43" fill={muted}>ℓ</text><text x="207" y="123" fill={muted}>m</text>
  </svg>;
}
