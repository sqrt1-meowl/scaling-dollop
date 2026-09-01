export type GeometryHardFigureType =
  | "scale-square-225"
  | "isosceles-exterior"
  | "similar-algebra"
  | "rectangle-diagonal"
  | "tower-trig"
  | "circle-equation";

const stroke = "#17385f";
const accent = "#b26134";

export function GeometryHardFigure({ type }: { type: GeometryHardFigureType }) {
  const shared = { fill: "none", stroke, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (type === "scale-square-225") return <svg viewBox="0 0 260 180" role="img" aria-label="Square with side 6 and a second square with 225 percent of its area">
    <rect x="34" y="75" width="68" height="68" {...shared}/><rect x="138" y="35" width="108" height="108" {...shared}/>
    <text x="61" y="164">6</text><text x="164" y="92" fill={accent}>225% area</text>
  </svg>;

  if (type === "isosceles-exterior") return <svg viewBox="0 0 260 180" role="img" aria-label="Isosceles triangle with an exterior angle of 124 degrees at the base">
    <path d="M35 145H198L116 32ZM198 145h45" {...shared}/><path d="M75 90l9 7M150 97l9-7" {...shared}/>
    <path d="M204 145a36 36 0 0 0-19-31" fill="none" stroke={accent} strokeWidth="2.4"/><text x="199" y="119" fill={accent}>124°</text>
  </svg>;

  if (type === "similar-algebra") return <svg viewBox="0 0 260 180" role="img" aria-label="Similar triangles with corresponding sides x plus 4 and 18, and 10 and 15">
    <path d="M20 145h88L56 72zM132 145h112l-67-105z" {...shared}/>
    <text x="45" y="165">10</text><text x="17" y="108">x+4</text><text x="180" y="165">15</text><text x="137" y="101">18</text>
  </svg>;

  if (type === "rectangle-diagonal") return <svg viewBox="0 0 260 180" role="img" aria-label="Rectangle with width x, length x plus 7, and diagonal 17">
    <rect x="30" y="42" width="200" height="105" {...shared}/><path d="M30 147L230 42" {...shared}/><path d="M30 134h13v13" {...shared}/>
    <text x="9" y="98">x</text><text x="113" y="168">x+7</text><text x="126" y="85">17</text>
  </svg>;

  if (type === "tower-trig") return <svg viewBox="0 0 260 180" role="img" aria-label="Tower height h viewed from 45 feet away at a 38 degree angle of elevation">
    <path d="M45 145H225M190 145V28M45 145L190 28" {...shared}/><path d="M177 145v-13h13" {...shared}/><path d="M76 145a31 31 0 0 0-7-19" fill="none" stroke={accent} strokeWidth="2.4"/>
    <text x="78" y="133" fill={accent}>38°</text><text x="109" y="166">45 ft</text><text x="199" y="89">h</text>
  </svg>;

  return <svg viewBox="0 0 260 180" role="img" aria-label="Coordinate circle with center 4 comma negative 3 and unknown radius">
    <path d="M25 145H238M130 164V18" {...shared} strokeWidth="1.5"/><circle cx="178" cy="109" r="58" {...shared}/><circle cx="178" cy="109" r="3.5" fill={stroke}/><path d="M178 109h58" {...shared} strokeDasharray="5 5"/>
    <text x="145" y="99">(4, −3)</text><text x="202" y="103" fill={accent}>r = ?</text>
  </svg>;
}
