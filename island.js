// A fixed pixel landscape with live, keyboard-accessible HTML house markers.
const islandStops=[[154,322],[216,155],[391,258],[479,109],[587,292],[704,156]];
function islandScenery(){
  const shore='M72 240H91V211H116V175H145V124H183V103H233V68H298V86H355V103H388V81H426V56H486V41H539V63H599V96H643V74H694V89H750V118H779V156H806V204H819V255H800V297H760V329H726V377H680V400H613V417H540V393H489V376H431V402H359V419H288V404H246V430H165V402H122V373H86V329H63V276H72Z';
  const route='M104 373L112 346 154 322 189 283 186 239 151 225 164 188 216 155 254 166 277 212 311 244 351 244 391 258 429 228 418 187 438 141 479 109 528 124 536 171 506 213 528 264 587 292 640 277 674 238 658 205 677 175 704 156 748 172';
  const cluster=(id,points)=>points.map(([x,y,s=1])=>`<use href="#island-${id}" transform="translate(${x} ${y}) scale(${s})"/>`).join('');
  const waves=Array.from({length:90},(_,i)=>`<path d="M${(i*109+13)%846} ${(i*71+17)%468}h${8+i%4*6}v3h-8v3h-12v-3h12Z" opacity="${i%3===0?.35:.18}"/>`).join('');
  const trees=[[111,272,1.2],[133,236],[112,310,.8],[138,196],[177,136],[205,116],[243,119],[268,104],[292,124],[319,153],[343,168,.9],[349,206],[299,278],[285,303],[299,345,1.2],[324,361],[357,327],[378,374],[401,329],[451,304],[469,333],[481,256,.9],[455,203,.8],[434,91],[503,77],[548,83],[577,113],[568,158],[582,192],[613,150,.9],[630,117],[672,116],[730,122],[755,146],[780,191],[774,237,1.2],[758,272],[725,302],[696,338],[658,359],[635,380],[603,358],[569,366],[526,350],[145,370],[187,373],[231,382],[240,326]];
  const rocks=[[104,341],[249,251],[320,318],[361,294],[404,114],[520,303],[591,250],[721,211],[739,331],[793,259],[179,207],[570,388]];
  const flowers=[[119,323],[156,146],[258,181],[215,267],[273,289],[359,227],[417,270],[453,155],[539,110],[548,293],[621,302],[679,294],[750,250],[699,137],[679,361],[458,360],[209,353],[169,390]];
  const wall=(x,y,n)=>Array.from({length:n},(_,i)=>`<use href="#island-stone" x="${x+i*12}" y="${y+(i%2)*2}"/>`).join('');
  return `<svg class="island-art" viewBox="0 0 850 468" aria-hidden="true">
  <defs>
    <clipPath id="island-land"><path d="${shore}"/></clipPath>
    <pattern id="island-grass" width="49" height="39" patternUnits="userSpaceOnUse"><path fill="#7dbc60" d="M5 8h3v5h4v3H5zm28 20h3v6h4v2h-7z"/><path fill="#b2d775" d="M22 13h4v4h-4zm21-7h3v3h-3z"/></pattern>
    <g id="island-tree" shape-rendering="crispEdges"><path fill="#47643c" d="M-17 12h34v6h-34z"/><path fill="#744732" d="M-5 4h10v13H-5z"/><path fill="#9e653e" d="M-3 8h3v7h-3z"/><path fill="#24583d" d="M-8-21H8v4h6v5h5V4h-4v6h-8v3H-8V9h-7V5h-5v-16h4v-6h8z"/><path fill="#448b48" d="M-9-18H8v4h7v7h4v8h-7v5H-9V3h-8V-9h3v-6h5z"/><path fill="#75b74f" d="M-8-17H6v3h7v7H6v4H-9v-4h-6v-5h7z"/><path fill="#9aca61" d="M-7-15H5v4H-7z"/></g>
    <g id="island-stone" shape-rendering="crispEdges"><path fill="#52615e" d="M-8-3h4v-4H5v4h4v8H-8Z"/><path fill="#899c9a" d="M-5-3h9v-2h3v7H-6z"/><path fill="#b2c2b9" d="M-4-4h8v3h-8z"/></g>
    <g id="island-flower" shape-rendering="crispEdges"><path fill="#4b813d" d="M0 0h3v11H0zm-5 7h5v3h-5z"/><path fill="#fff5cb" d="M-5-3h4v-4h5v4h4v5H4v4h-5V2h-4z"/><path fill="#e7aa46" d="M-1-3h5v5h-5z"/></g>
  </defs>
  <path fill="#277ca8" d="M0 0H850V468H0Z"/><g fill="#9cddde">${waves}</g>
  <path d="${shore}" transform="translate(0 12)" fill="#12618e" stroke="#62b9c6" stroke-width="18" stroke-linejoin="round"/>
  <path d="${shore}" transform="translate(0 8)" fill="#ad774e" stroke="#f5d69a" stroke-width="12" stroke-linejoin="round"/>
  <path d="${shore}" fill="#8ec65f" stroke="#4b9453" stroke-width="8" stroke-linejoin="round"/>
  <g clip-path="url(#island-land)">
    <path fill="#75b35d" d="M84 223Q193 42 342 94T568 78L611 107Q537 145 445 115T249 155L105 288ZM139 399Q236 305 298 370T451 392L355 443H144ZM670 340Q702 228 799 204L828 290 755 386Z"/>
    <rect width="850" height="468" fill="url(#island-grass)"/>
    <path d="${route}" fill="none" stroke="#b48a54" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${route}" fill="none" stroke="#e9bd7c" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${route}" fill="none" stroke="#f4cf94" stroke-width="4" stroke-dasharray="4 16" stroke-linecap="square"/>
    <path fill="#519e78" d="M570 212h18v-9h26v7h18v11h11v22h-17v9h-42v-8h-15z"/><path fill="#4a99bc" d="M581 220h16v-8h19v7h16v16h-13v8h-32v-8h-9z"/><path fill="#a2dfe0" d="M590 224h13v3h-13zm19 9h15v3h-15z"/>
    ${wall(316,202,5)}${wall(609,329,6)}${wall(215,309,4)}
    <g transform="translate(211 338)"><path fill="#5a583f" d="M-23 13 0-21 24 13v4h-47z"/><path fill="#f2d495" d="M-19 12 0-17 19 12z"/><path fill="#bf8858" d="M-3-4h6l8 16H-12z"/><path fill="#714b3a" d="M-2 1h4l5 11h-14z"/></g>
    ${cluster('stone',rocks)}${cluster('flower',flowers)}${cluster('tree',trees)}
  </g></svg>`;
}
