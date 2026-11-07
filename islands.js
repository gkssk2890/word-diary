// 마을마다 색·모양·구성이 다른 픽셀 섬. 집 위치(stops)와 라벨 크기는 그대로라 기존 지도 동작은 같아요.
(()=>{
const W=850,H=468;
const rng=seed=>{let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}};
const hashStr=str=>{let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const TH={
 '1A':{name:'예수 그리스도',icon:'cross',sea:'#3a8fc2',wave:'#9fe0e8',shallow:'#12618e',ring:'#6cc2cf',sand:'#f0d79a',base:'#9acb5c',patch:'#dccb62',g1:'#86ba55',g2:'#c3df7c',route:['#b58a52','#ecc27e','#f7d9a0'],tree:['#3f6b3a','#5a9a44','#8cc560'],trunk:'#8a5a36',rock:['#6a6a58','#a7a58c','#d3d1b0'],flower:'#ffe27a',accent:'#d9a93a',
  shape:{cx:430,cy:236,rx:350,ry:192,rot:0,h:[[3,.05,.5],[5,.03,1.1]]},stops:[[140,330],[262,246],[382,326],[500,232],[612,308],[704,176]],
  land:['cross','wheat','wheat','wheat'],scatter:{tree:.35,rock:.1,flower:.2,wheat:.35},seaDeco:['dove2']},
 '1B':{name:'성령',icon:'flame',sea:'#7fc9e8',wave:'#ffffff',shallow:'#4aa2cc',ring:'#cdeefa',sand:'#f6ecc4',base:'#bfe6b3',patch:'#a6dba2',g1:'#a8d99f',g2:'#e0f5c9',route:['#c8c2a8','#f7f1de','#ffffff'],tree:['#4c9a78','#7cc9a0','#b8ebcc'],trunk:'#a07a52',rock:['#7f8f99','#b6c4cc','#e3edf1'],flower:'#ffffff',accent:'#f08a3a',
  shape:{cx:425,cy:236,rx:318,ry:200,rot:0,h:[[2,.07,.3],[5,.05,1.4],[7,.03,.2]]},stops:[[425,108],[596,168],[606,306],[425,364],[250,302],[246,164]],
  land:['flame','flame','flame','windmill'],scatter:{tree:.3,rock:.1,flower:.3,swirl:.3},seaDeco:['cloud','cloud','dove2','dove2']},
 '1C':{name:'하나님',icon:'mountain',sea:'#1f5391',wave:'#7fb8e8',shallow:'#10345f',ring:'#4d89c4',sand:'#cfc9b8',base:'#5ea65c',patch:'#8a9a7a',g1:'#4c9150',g2:'#8bc46d',route:['#7d7466','#c9c1b0','#e8e2d2'],tree:['#1f4b3a','#2f7a52','#5fae6a'],trunk:'#6b4a30',rock:['#59636c','#8d9aa3','#c3ced4'],flower:'#fff4a8',accent:'#8d99a3',
  shape:{cx:430,cy:232,rx:335,ry:200,rot:-.06,h:[[3,.11,1.2],[4,.07,.3],[6,.04,.9]]},stops:[[170,322],[318,238],[300,118],[480,176],[596,300],[700,150]],
  land:['mountain','mountain','mountain','lake'],scatter:{pine:.45,rock:.25,flower:.1,mountainS:.2},seaDeco:['star']},
 '2A':{name:'사랑으로 말함',icon:'heart',sea:'#5fbfd3',wave:'#c9f1f5',shallow:'#2f8fa8',ring:'#9fe0e6',sand:'#f9dcc0',base:'#b7dc8c',patch:'#f3c9bf',g1:'#a4d27a',g2:'#d5eeb0',route:['#c98f7c','#f4c9b5','#fff0e6'],tree:['#d5688d','#ef8db1','#ffc6d8'],trunk:'#8a5a46',rock:['#9a8a86','#cbbcb6','#ede2de'],flower:'#ff9db8',accent:'#ee6f8a',
  shape:{cx:430,cy:236,rx:342,ry:195,rot:0,h:[[2,.12,1.57],[3,.05,.4]]},stops:[[130,166],[252,262],[392,172],[522,272],[642,184],[732,300]],
  land:['house','house','heartbed','heartbed'],scatter:{blossom:.4,flower:.35,heart:.15,rock:.1},seaDeco:['heart','heart','dove2']},
 'A':{name:'새로운 삶',icon:'sprout',sea:'#4fb7d8',wave:'#c9f2f7',shallow:'#2a8cb0',ring:'#8fdbe6',sand:'#f4e6b0',base:'#b6e07a',patch:'#d4f09a',g1:'#9ed25f',g2:'#d9f5a0',route:['#bb9760','#efd29a','#fbebc4'],tree:['#3f8a3f','#6fc254','#a9e275'],trunk:'#8a6038',rock:['#7c8a6e','#b0bd9c','#d9e3c4'],flower:'#ffb7d0',accent:'#6fc254',
  shape:{cx:428,cy:236,rx:362,ry:165,rot:.04,h:[[4,.05,.2],[2,.04,1]]},stops:[[130,304],[252,198],[376,302],[500,190],[626,292],[736,190]],
  land:['sproutbig','sproutbig','butterfly','butterfly'],scatter:{tree:.2,sprout:.45,flower:.3,rock:.05},seaDeco:['bubble']},
 'B':{name:'그리스도를 전파함',icon:'letter',sea:'#2fa8b8',wave:'#bff0ee',shallow:'#13788a',ring:'#7fdcd8',sand:'#f6e2a4',base:'#a9d77a',patch:'#f1e0a4',g1:'#92c866',g2:'#cbe898',route:['#c9a45e','#f3dfa6','#fff3cc'],tree:['#2f7d4c','#4fae62','#8fd68a'],trunk:'#a1713f',rock:['#8a8f84','#bfc3b3','#e6e8d4'],flower:'#ffd1a6',accent:'#d8473f',
  shape:{cx:432,cy:232,rx:368,ry:178,rot:-.03,h:[[1,.1,1.57],[2,.1,.4],[5,.04,.8]]},stops:[[130,176],[270,132],[424,186],[562,142],[702,190],[742,318]],
  land:['mailbox','palm','palm','palm'],scatter:{palm:.3,tree:.15,rock:.1,flower:.2,shell:.1,letter:.15},seaDeco:['boat','boat','boat','bird']},
 'C':{name:'하나님을 의뢰함',icon:'fort',sea:'#4a7fa6',wave:'#a9cde4',shallow:'#2c557a',ring:'#7eaed0',sand:'#d8d2bc',base:'#8fb56a',patch:'#a9a98a',g1:'#7ea45a',g2:'#b4d08a',route:['#7f7867','#cdc6b2',' #ebe5d3'.trim()],tree:['#2f5f3e','#4f8a52','#86b86d'],trunk:'#6e4c30',rock:['#59636c','#909ba2','#c8d0d4'],flower:'#fff0a0',accent:'#8d99a3',
  shape:{cx:430,cy:236,rx:335,ry:195,rot:0,h:[[6,.07,.4],[3,.07,1.7],[9,.03,.1]]},stops:[[130,292],[262,176],[428,118],[594,176],[722,292],[428,352]],
  land:['fort','boulder','boulder','boulder'],scatter:{pine:.25,rock:.4,flower:.1,tree:.15,boulder:.1},seaDeco:['bird']},
 'D':{name:'그리스도 제자의 자격',icon:'autumn',sea:'#3a7ea0',wave:'#9ccbdf',shallow:'#1f5878',ring:'#6fa9c4',sand:'#e8cf98',base:'#c8b25a',patch:'#d99a4a',g1:'#b89f4a',g2:'#e0cf7c',route:['#9a6a38','#d7a566','#f0cd92'],tree:['#a8482a','#df7b2e','#f5b648'],trunk:'#6a4528',rock:['#7a6a58','#aa9a84','#d4c6aa'],flower:'#ffe08a',accent:'#df7b2e',
  shape:{cx:432,cy:236,rx:350,ry:185,rot:.1,h:[[3,.09,.9],[5,.05,2.2]]},stops:[[140,120],[330,142],[522,120],[690,190],[540,292],[330,332]],
  land:['crossroad','autumn','autumn','autumn'],scatter:{autumn:.5,rock:.15,flower:.15,leaf:.2},seaDeco:['bird']},
 'E':{name:'그리스도를 닮아 감',icon:'apple',sea:'#3f86b0',wave:'#ffd9a8',shallow:'#215f84',ring:'#f4b88a',sand:'#f8dfa4',base:'#a8d06a',patch:'#f1d46a',g1:'#94c258',g2:'#cfe88c',route:['#b88a4c','#f1cf7e','#fff0b8'],tree:['#3f7a3a','#62a448','#98d068'],trunk:'#8a5a34',rock:['#8a7a62','#bba98a','#e2d6ba'],flower:'#ff8f6a',accent:'#e0543a',
  shape:{cx:430,cy:238,rx:345,ry:190,rot:-.05,h:[[1,.1,.3],[3,.06,.2],[4,.04,1.6]]},stops:[[134,356],[262,262],[404,350],[534,246],[640,340],[722,190]],
  land:['orchard','orchard','orchard','vine'],scatter:{apple:.45,tree:.15,flower:.25,rock:.05,vine:.1},seaDeco:['sun','bird']}
};
const PALETTE_ORDER=['A','1A','B','2A','1C','D','E','C','1B'];
function themeOf(key){
  if(TH[key])return TH[key];
  const base=TH[PALETTE_ORDER[hashStr(String(key))%PALETTE_ORDER.length]];
  const r=rng(hashStr('fb'+key));const sx=[...base.stops].sort(()=>r()-.5);
  return Object.assign({},base,{fallback:true});
}
/* ---------- geometry ---------- */
const inPoly=(poly,x,y)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
function shapePoly(sh,scale=1,n=132,snap=10){
  const pts=[];const cs=Math.cos(sh.rot||0),sn=Math.sin(sh.rot||0);
  for(let i=0;i<n;i++){const t=i/n*Math.PI*2;let f=1;for(const[k,a,p]of sh.h)f+=a*Math.cos(k*t+p);
    const ex=sh.rx*scale*f*Math.cos(t),ey=sh.ry*scale*f*Math.sin(t);
    let x=sh.cx+ex*cs-ey*sn,y=sh.cy+ex*sn+ey*cs;x=Math.max(26,Math.min(W-26,x));y=Math.max(30,Math.min(H-30,y));
    x=Math.round(x/snap)*snap;y=Math.round(y/snap)*snap;const l=pts[pts.length-1];if(!l||l[0]!==x||l[1]!==y)pts.push([x,y])}
  return pts;}
const polyPath=p=>'M'+p[0][0]+' '+p[0][1]+p.slice(1).map(([x,y])=>'H'+x+'V'+y).join('')+'Z';
const labelOk=(poly,[x,y])=>[[0,0],[-62,0],[62,0],[0,34],[0,-30],[-62,34],[62,34]].every(([dx,dy])=>inPoly(poly,x+dx,y+dy));
function buildShape(t){let s=.82,poly=shapePoly(t.shape,s);for(;s<1.16;s+=.02){poly=shapePoly(t.shape,s);if(t.stops.every(p=>labelOk(poly,p)))break}return poly}
function routePts(stops,seed){
  const r=rng(seed),pts=[];for(let i=0;i<stops.length;i++){const a=stops[i];pts.push(a);if(i<stops.length-1){const b=stops[i+1];const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;const nx=-(b[1]-a[1]),ny=b[0]-a[0],len=Math.hypot(nx,ny)||1;const off=(i%2?1:-1)*(18+r()*20);pts.push([Math.round(mx+nx/len*off),Math.round(my+ny/len*off)])}}
  return pts;}
const segDist=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy||1;let t=((px-ax)*dx+(py-ay)*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(ax+t*dx),py-(ay+t*dy))};
const nearRoute=(pts,x,y,d)=>{for(let i=0;i<pts.length-1;i++)if(segDist(x,y,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1])<d)return true;return false};
const nearStop=(stops,x,y)=>stops.some(([sx,sy])=>Math.abs(x-sx)<92&&y>sy-62&&y<sy+52);
/* ---------- pixel props (anchor = bottom center) ---------- */
const T=(id,c,fruit)=>`<g id="${id}" shape-rendering="crispEdges"><path fill="${c.dark}" d="M-17 12h34v6h-34z" opacity=".55"/><path fill="${c.trunk}" d="M-5 4h10v13H-5z"/><path fill="${c.t0}" d="M-8-21H8v4h6v5h5V4h-4v6h-8v3H-8V9h-7V5h-5v-16h4v-6h8z"/><path fill="${c.t1}" d="M-9-18H8v4h7v7h4v8h-7v5H-9V3h-8V-9h3v-6h5z"/><path fill="${c.t2}" d="M-8-17H6v3h7v7H6v4H-9v-4h-6v-5h7z"/>${fruit?'<path fill="#e0432f" d="M-9-8h4v4h-4zM3-12h4v4H3zM6 0h4v4H6zM-4 0h4v4h-4z"/>':''}</g>`;
const PINE=(id,c)=>`<g id="${id}" shape-rendering="crispEdges"><path fill="${c.trunk}" d="M-3 8h6v8h-6z"/><path fill="${c.t0}" d="M-14 10L0-6 14 10Z"/><path fill="${c.t1}" d="M-11 2L0-16 11 2Z"/><path fill="${c.t2}" d="M-8-6L0-24 8-6Z"/><path fill="#fff" opacity=".7" d="M-2-22h4v3h-4z"/></g>`;
const ROCK=(id,r)=>`<g id="${id}" shape-rendering="crispEdges"><path fill="${r[0]}" d="M-8-3h4v-4H5v4h4v8H-8Z"/><path fill="${r[1]}" d="M-5-3h9v-2h3v7H-6z"/><path fill="${r[2]}" d="M-4-4h8v3h-8z"/></g>`;
const FLOWER=(id,col)=>`<g id="${id}" shape-rendering="crispEdges"><path fill="#4b813d" d="M0 0h3v11H0zm-5 7h5v3h-5z"/><path fill="${col}" d="M-5-3h4v-4h5v4h4v5H4v4h-5V2h-4z"/><path fill="#e7aa46" d="M-1-3h5v5h-5z"/></g>`;
const SYM={
 cross:'<g shape-rendering="crispEdges"><path fill="#5f9b46" d="M-30 0H30V-4H24V-8H14V-12H-14V-8H-24V-4H-30Z"/><path fill="#7fbf58" d="M-20-4H20V-8H12V-12H-12V-8H-20Z"/><path fill="#8a5a36" d="M-3-12h6v-34h-6z"/><path fill="#8a5a36" d="M-13-38h26v6h-26z"/><path fill="#c58b57" d="M-3-12h2v-34h-2zM-13-38h26v2h-26z"/><path fill="#ffe27a" d="M-22-44h3v3h-3zM19-46h3v3h-3zM-1-54h3v3h-3zM-28-30h3v3h-3zM25-30h3v3h-3z"/></g>',
 wheat:'<g shape-rendering="crispEdges"><path fill="#b99a36" d="M-1 0h2v-16h-2zM-8 0h2v-12h-2zM6 0h2v-13H6z"/><path fill="#ecc95a" d="M-3-24h6v4h-6zM-3-19h6v4h-6zM-10-20h6v4h-6zM4-21h6v4H4zM-10-15h6v3h-6zM4-16h6v3H4z"/></g>',
 flame:'<g shape-rendering="crispEdges"><path fill="#8b8f93" d="M-12 0V-5H12V0Z"/><path fill="#e5532d" d="M-7-5V-14H-4V-22H-1V-34H2V-24H5V-17H8V-5Z"/><path fill="#f5a02a" d="M-4-5V-12H-1V-19H1V-12H4V-5Z"/><path fill="#ffe27a" d="M-2-5V-9H0V-14H2V-5Z"/></g>',
 windmill:'<g shape-rendering="crispEdges"><path fill="#c9bfa4" d="M-8 0H8L5-26H-5Z"/><path fill="#8a6a46" d="M-3 0h6v-9h-6z"/><path fill="#ffffff" d="M-2-27l-18-16 4-2 16 14zM2-27l18 16-4 2-16-14zM2-27l16-18 2 4-14 16zM-2-27l-16 18-2-4 14-16z"/><path fill="#d9534a" d="M-4-30h8v6h-8z"/></g>',
 mountain:'<g shape-rendering="crispEdges"><path fill="#6f7d87" d="M-36 0L-6-38H6L36 0Z"/><path fill="#55636f" d="M6-38L36 0H10Z"/><path fill="#ffffff" d="M-10-28L-6-38H6L11-26H5L0-31L-5-24Z"/><path fill="#8f9ca6" d="M-26 0L-14-16 -8 0Z"/></g>',
 mountainS:'<g shape-rendering="crispEdges"><path fill="#78868f" d="M-22 0L-4-24H4L22 0Z"/><path fill="#5d6b76" d="M4-24L22 0H8Z"/><path fill="#fff" d="M-6-18L-4-24H4L7-16H2L0-19L-3-15Z"/></g>',
 lake:'<g shape-rendering="crispEdges"><path fill="#2d6fb0" d="M-30 0H30V-6H24V-12H-24V-6H-30Z"/><path fill="#6fb4e6" d="M-22-2H16V-5H-22zM-10-9H14V-11H-10z"/></g>',
 heart:'<g shape-rendering="crispEdges"><path fill="#ee6f8a" d="M-10.5 -24h6v3h-6zM4.5 -24h6v3h-6zM-13.5 -21h12v3h-12zM1.5 -21h12v3h-12zM-13.5 -18h27v3h-27zM-13.5 -15h27v3h-27zM-10.5 -12h21v3h-21zM-7.5 -9h15v3h-15zM-4.5 -6h9v3h-9zM-1.5 -3h3v3h-3z"/><path fill="#d4526f" d="M4.5 -18h9v3h-9zM4.5 -15h9v3h-9zM4.5 -12h6v3h-6zM-7.5 -9h15v3h-15zM-4.5 -6h9v3h-9zM-1.5 -3h3v3h-3z"/><path fill="#ffc0cf" d="M-10.5 -24h6v3h-6zM-13.5 -21h6v3h-6zM1.5 -21h3v3h-3z"/></g>',
 heartbed:'<g shape-rendering="crispEdges"><path fill="#7a5a3a" d="M-24 0H24V-5H-24Z"/><path fill="#ee6f8a" d="M-20-5h6v-5h4v5h4v-5h4v5h4v-5h4v5h4v-5h6v5H-20z" opacity=".95"/><path fill="#fff" d="M-16-8h2v2h-2zM-2-8h2v2h-2zM10-8h2v2h-2z"/></g>',
 house:'<g shape-rendering="crispEdges"><path fill="#f6e4cc" d="M-14 0V-14H14V0Z"/><path fill="#e07a6a" d="M-18-14L0-28 18-14Z"/><path fill="#a86a52" d="M-3 0v-9h6v9z"/><path fill="#7fc0d8" d="M-11-10h5v5h-5zM6-10h5v5H6z"/></g>',
 sproutbig:'<g shape-rendering="crispEdges"><path fill="#4b9a3c" d="M-2 0h4v-18h-4z"/><path fill="#7ccc54" d="M-16-18h14v-6h-6v-4h-8zM2-22h14v-6h-6v-4H2z"/><path fill="#b4ec7a" d="M-12-22h6v-3h-6zM6-26h6v-3H6z"/><path fill="#8a6038" d="M-12 0h24v4h-24z"/></g>',
 sprout:'<g shape-rendering="crispEdges"><path fill="#3f9a46" d="M-1 0h2v-9h-2z"/><path fill="#79c957" d="M-7-9h6v-4h-6zM1-11h7v-4H1z"/></g>',
 butterfly:'<g shape-rendering="crispEdges"><path fill="#ffb347" d="M-8-8h6v-6h-4zM2-8h6l2-6H4z"/><path fill="#ff7f50" d="M-6-6h4v4h-4zM2-6h4v4H2z"/><path fill="#4a3a30" d="M-1-12h2v10h-2z"/></g>',
 letter:'<g shape-rendering="crispEdges"><path fill="#8a5a36" d="M-15 0V-23H15V0Z"/><path fill="#fff6e0" d="M-13-2V-21H13V-2Z"/><path fill="#e2c791" d="M-13-21L0-9 13-21V-17L0-5-13-17Z"/><path fill="#d8473f" d="M-3-14h6v6h-6z"/><path fill="#ff8f7a" d="M-3-14h3v3h-3z"/></g>',
 mailbox:'<g shape-rendering="crispEdges"><path fill="#6a4528" d="M-2 0h4v-14h-4z"/><path fill="#2f6aa8" d="M-13-14V-30H13V-14Z"/><path fill="#5f9ad8" d="M-13-30H13V-26H-13z"/><path fill="#fff6e0" d="M-7-27h14v7h-14z"/><path fill="#d8473f" d="M-2-25h4v3h-4z"/><path fill="#8a5a36" d="M13-26h3v-12h-3z"/><path fill="#d8473f" d="M16-38h8v6h-8z"/></g>',
 lighthouse:'<g shape-rendering="crispEdges"><path fill="#4a3a38" d="M-6 0H6V-3H-6Z"/><path fill="#f6f1e6" d="M-5-3H5L3-34H-3Z"/><path fill="#d8473f" d="M-4-10H4L4-16H-4zM-3-24H3V-29H-3z"/><path fill="#ffd95a" d="M-4-40h8v6h-8z"/><path fill="#4a3a38" d="M-6-42h12v3h-12z"/><path fill="#fff4b0" opacity=".6" d="M8-39h14v3H8zM-22-39h14v3h-14z"/></g>',
 palm:'<g shape-rendering="crispEdges"><path fill="#9e6b3d" d="M-1 0h4v-10h-3v-8h3v-6h-3v-4h-3v10h3v8h-2v10z"/><path fill="#3f9a52" d="M-16-24h12v-4h8v4h12v4h-9v-4H-3v4h-9v4h-8z"/><path fill="#6cc878" d="M-12-26h8v-2h-8zM4-26h8v-2H4z"/></g>',
 shell:'<g shape-rendering="crispEdges"><path fill="#f7d6c8" d="M-5 0h10v-4h-3v-3h-4v3h-3z"/><path fill="#e8a99a" d="M-1-4h2v4h-2z"/></g>',
 boat:'<g shape-rendering="crispEdges"><path fill="#8a5a36" d="M-12 0h24l-4 5h-16z"/><path fill="#fff" d="M-1-24L11-2H-1Z"/><path fill="#e9e2d0" d="M-3-20L-12-2H-3Z"/><path fill="#5a3a24" d="M-2-26h2v26h-2z"/></g>',
 bird:'<g shape-rendering="crispEdges"><path fill="#fff" d="M-8-4h4v-3h4v3h4v-3h4v3h-4v3h-8v-3z"/></g>',
 dove2:'<g shape-rendering="crispEdges"><path fill="#fff" d="M-9-6h12v-4h4v-4h6v6h-4v4h-4v6h-10v-4h-6z"/><path fill="#d6edf6" d="M-5-6h6v-6h-6z"/><path fill="#f0a030" d="M13-12h4v3h-4z"/><path fill="#33505e" d="M10-12h2v2h-2z"/></g>',
 cloud:'<g shape-rendering="crispEdges"><path fill="#e1eff8" d="M-22 4H22V-2H26V-8H16V-14H4V-20H-12V-14H-20V-8H-26V-2H-22Z" opacity=".9"/><path fill="#fff" d="M-22 0H22V-4H20V-10H12V-16H0V-10H-14V-4H-22Z"/></g>',
 swirl:'<g shape-rendering="crispEdges" fill="none" stroke="#ffffff" stroke-width="3" opacity=".85"><path d="M-14 0H0V-4H8V-8H4"/><path d="M-10 8H6V4H12"/></g>',
 star:'<g shape-rendering="crispEdges"><path fill="#fff3b0" d="M-1-8h2v6h-2zM-1 2h2v6h-2zM-8-1h6v2h-6zM2-1h6v2H2z"/></g>',
 bubble:'<g shape-rendering="crispEdges" fill="none" stroke="#fff" stroke-width="2" opacity=".8"><path d="M-3 0h6v-6h-6z"/><path d="M6-10h4v-4H6z"/></g>',
 sun:'<g shape-rendering="crispEdges"><path fill="#ffe27a" d="M-10-14h20v4H14v10H-14V-10h4z" opacity=".9"/><path fill="#fff4b0" d="M-6-12h12v4H-6z"/><path fill="#ffb347" opacity=".6" d="M-24-3h48v3h-48z"/></g>',
 fort:'<g shape-rendering="crispEdges"><path fill="#8d99a3" d="M-22 0V-26h8v-6h8v6h8v-6h8v6h8V0Z"/><path fill="#b4c0c8" d="M-20 0V-24h4v24zM-4 0V-24h4v24z"/><path fill="#59636c" d="M-6 0v-12h12V0Z"/><path fill="#6a4528" d="M-1-42h2v12h-2z"/><path fill="#d9534a" d="M1-42h12v6H1z"/></g>',
 boulder:'<g shape-rendering="crispEdges"><path fill="#59636c" d="M-18 0V-10h4v-8h14v-4h12v8h6V0Z"/><path fill="#8d99a3" d="M-14 0V-9h4v-7h10v-3h10v7h5V0Z"/><path fill="#c3ced4" d="M-8-8h8v-4h-8z"/></g>',
 crossroad:'<g shape-rendering="crispEdges"><path fill="#6a4528" d="M-2 0h4v-26h-4z"/><path fill="#8a5a36" d="M-14-20h13v5h-13zM1-14h14v5H1z"/><path fill="#f0cd92" d="M-12-19h9v2h-9zM3-13h10v2H3z"/></g>',
 leaf:'<g shape-rendering="crispEdges"><path fill="#df7b2e" d="M-4-2h6v-4h-4v-4h-4z"/><path fill="#a8482a" d="M-1-4h2v3h-2z"/></g>',
 vine:'<g shape-rendering="crispEdges"><path fill="#4f8a3a" d="M-20 0h40v-5h-40z"/><path fill="#6fc254" d="M-18-5h6v-5h-6zM-6-5h6v-6h-6zM6-5h6v-5H6z"/><path fill="#d9534a" d="M-16-8h2v2h-2zM-4-9h2v2h-2zM8-8h2v2H8z"/></g>'
};
const TREEKINDS={tree:'t',blossom:'t',autumn:'t',apple:'t',palm:'palm',pine:'pine'};
function themeDefs(t,k){
  const c=Object.fromEntries([['dark','#1d3a1a'],['trunk',t.trunk],['t0',t.tree[0]],['t1',t.tree[1]],['t2',t.tree[2]]]);
  return `${T('v'+k+'-tree',c,false)}${T('v'+k+'-apple',Object.assign({},c,{t0:'#3f7a3a',t1:'#62a448',t2:'#98d068'}),true)}${PINE('v'+k+'-pine',c)}${ROCK('v'+k+'-rock',t.rock)}${FLOWER('v'+k+'-flower',t.flower)}${Object.entries(SYM).map(([id,g])=>`<g id="v${k}-${id}">${g}</g>`).join('')}`;
}
function isTree(kind){return ['tree','blossom','autumn','apple','pine'].includes(kind)}
const cache={};
function resolve(key){if(cache[key])return cache[key];const t=themeOf(key);let poly,stops=t.stops.map(p=>[...p]);for(let s=.84;s<=1.3;s+=.02){poly=shapePoly(t.shape,s);if(stops.every(p=>labelOk(poly,p)))break}
  const cx=t.shape.cx,cy=t.shape.cy;stops=stops.map(p=>{let x=p[0],y=p[1],i=0;while(!labelOk(poly,[x,y])&&i<60){x+=Math.sign(cx-x)*6;y+=Math.sign(cy-y)*4;i++}return [Math.round(x),Math.round(y)]});return cache[key]={t,poly,stops}}
function villageScenery(key){
  const t=themeOf(key),k=String(key).replace(/[^A-Za-z0-9]/g,'');const seed=hashStr(String(key));const r=rng(seed);
  const R=resolve(key),poly=R.poly,stops=R.stops,rp=routePts(stops,seed+7),route='M'+rp.map(p=>p.join(' ')).join('L');
  const used=[];const items=[];
  const free=(x,y,pad=0)=>inPoly(poly,x,y)&&inPoly(poly,x-14,y)&&inPoly(poly,x+14,y)&&inPoly(poly,x,y+12)&&!nearRoute(rp,x,y,30+pad)&&!nearStop(stops,x,y);
  const place=(kind,count,minGap,margin=0)=>{let n=0,tries=0;while(n<count&&tries<count*60){tries++;const x=Math.round(40+r()*(W-80)),y=Math.round(50+r()*(H-90));if(!free(x,y,margin))continue;if(used.some(([ux,uy,ug])=>Math.hypot(ux-x,uy-y)<Math.max(minGap,ug)))continue;used.push([x,y,minGap]);items.push([kind,x,y,.85+r()*.4]);n++}};
  // landmarks
  const lm={cross:1,mountain:3,lake:1,fort:1,lighthouse:1,windmill:1,house:2,heartbed:2,sproutbig:3,butterfly:2,flame:3,crossroad:1,orchard:0,vine:2,boulder:3,wheat:6};
  const counts={};for(const kd of t.land)counts[kd]=(counts[kd]||0)+1;
  for(const[kd,n]of Object.entries(counts)){const total=({wheat:5,flame:3,mountain:3,house:2,heartbed:2,sproutbig:3,butterfly:2,boulder:3,vine:2}[kd])??1;place(kd,kd==='wheat'?5:Math.min(total,n*(kd==='mountain'||kd==='sproutbig'||kd==='boulder'?1:1)+ (kd==='flame'?0:0)),kd==='mountain'?120:90,10)}
  if(counts.flame)place('flame',Math.max(0,3-(items.filter(i=>i[0]==='flame').length)),90,8);
  if(counts.mountain)place('mountain',Math.max(0,3-(items.filter(i=>i[0]==='mountain').length)),120,8);
  const S=t.scatter,total=64;
  for(const[kd,w]of Object.entries(S)){const kind=kd==='tree'||kd==='blossom'||kd==='autumn'||kd==='apple'||kd==='pine'||kd==='rock'||kd==='flower'?kd:kd;place(kind,Math.round(total*w),kd==='tree'||kd==='blossom'||kd==='autumn'||kd==='apple'?30:24)}
  items.sort((a,b)=>a[2]-b[2]);
  const use=(kind,x,y,s)=>{const id={tree:'tree',blossom:'tree',autumn:'tree',apple:'apple',pine:'pine',rock:'rock',flower:'flower',palm:'palm'}[kind]||kind;return `<use href="#v${k}-${id}" transform="translate(${x} ${y}) scale(${s.toFixed(2)})"/>`};
  const seaItems=[];const sea=t.seaDeco;let tries=0;while(seaItems.length<sea.length*2&&tries<400){tries++;const x=Math.round(30+r()*(W-60)),y=Math.round(30+r()*(H-60));if(inPoly(poly,x,y)||inPoly(poly,x-36,y)||inPoly(poly,x+36,y)||inPoly(poly,x,y+14)||inPoly(poly,x,y-30))continue;if(seaItems.some(([,sx,sy])=>Math.hypot(sx-x,sy-y)<90))continue;seaItems.push([sea[seaItems.length%sea.length],x,y,1])}
  const waves=Array.from({length:80},(_,i)=>`<path d="M${(i*109+13)%846} ${(i*71+17)%468}h${8+i%4*6}v3h-8v3h-12v-3h12Z" opacity="${i%3===0?.35:.18}"/>`).join('');
  const patches=Array.from({length:4},(_,i)=>{const px=140+r()*560,py=110+r()*260,sh={cx:px,cy:py,rx:50+r()*50,ry:30+r()*30,rot:r()*.6,h:[[3,.15,r()*6]]};return `<path fill="${t.patch}" d="${polyPath(shapePoly(sh,1,40,8))}"/>`}).join('');
  return `<svg class="island-art village-art" viewBox="0 0 850 468" aria-hidden="true">
  <defs><clipPath id="v${k}-land"><path d="${polyPath(poly)}"/></clipPath><pattern id="v${k}-grass" width="49" height="39" patternUnits="userSpaceOnUse"><path fill="${t.g1}" d="M5 8h3v5h4v3H5zm28 20h3v6h4v2h-7z"/><path fill="${t.g2}" d="M22 13h4v4h-4zm21-7h3v3h-3z"/></pattern>${themeDefs(t,k)}</defs>
  <path fill="${t.sea}" d="M0 0H850V468H0Z"/><g fill="${t.wave}">${waves}</g>
  ${seaItems.map(([kd,x,y,s])=>`<use href="#v${k}-${kd}" transform="translate(${x} ${y})"/>`).join('')}
  <path d="${polyPath(poly)}" transform="translate(0 12)" fill="${t.shallow}" stroke="${t.ring}" stroke-width="18" stroke-linejoin="round"/>
  <path d="${polyPath(poly)}" transform="translate(0 8)" fill="${t.sand}" stroke="${t.sand}" stroke-width="12" stroke-linejoin="round"/>
  <path d="${polyPath(poly)}" fill="${t.base}" stroke="${t.sand}" stroke-width="8" stroke-linejoin="round" paint-order="stroke"/>
  <g clip-path="url(#v${k}-land)"><path d="${polyPath(poly)}" fill="${t.base}"/>${patches}<rect width="850" height="468" fill="url(#v${k}-grass)"/>
   <path d="${route}" fill="none" stroke="${t.route[0]}" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>
   <path d="${route}" fill="none" stroke="${t.route[1]}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
   <path d="${route}" fill="none" stroke="${t.route[2]}" stroke-width="4" stroke-dasharray="4 16" stroke-linecap="square"/>
   ${items.map(([kd,x,y,s])=>use(kd,x,y,['cross','mountain','fort','lighthouse','mailbox','windmill','lake'].includes(kd)?1:s)).join('')}
  </g></svg>`;
}
globalThis.villageScenery=villageScenery;
globalThis.villageTheme=themeOf;
globalThis.villageStops=key=>resolve(key).stops;
globalThis.villageIconSym=(key)=>{const t=themeOf(key),k='ic'+String(key).replace(/[^A-Za-z0-9]/g,'');const map={cross:'cross',flame:'flame',mountain:'mountain',heart:'heart',sprout:'sproutbig',letter:'letter',lighthouse:'lighthouse',fort:'fort',autumn:null,apple:null};let g=SYM[map[t.icon]];if(!g){const col=t.icon==='autumn'?{t0:'#a8482a',t1:'#df7b2e',t2:'#f5b648'}:{t0:'#3f7a3a',t1:'#62a448',t2:'#98d068'};g=T(k+'t',Object.assign({dark:'#1d3a1a',trunk:t.trunk},col),t.icon==='apple').replace('id="'+k+'t"','')}const VB={autumn:'-24 -28 48 48',apple:'-24 -28 48 48',letter:'-18 -26 36 30',heart:'-17 -28 34 32',flame:'-14 -38 28 42',sprout:'-18 -32 36 38',lighthouse:'-24 -46 48 52',fort:'-26 -46 52 50',cross:'-30 -56 60 62',mountain:'-38 -42 76 46'};return '<svg viewBox="'+(VB[t.icon]||'-30 -50 60 56')+'" aria-hidden="true">'+g+'</svg>'};
})();
