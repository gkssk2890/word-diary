// 오늘 화면: 전체 마을 → 입장 → 집 → 말씀 카드. 이번 주 / 누적 암송카드 탭.
// 기록·진도·성공 처리는 건드리지 않고, 기존 데이터를 보여주기만 해요.
(()=>{
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const houseSvg='<svg viewBox="0 0 32 30" aria-hidden="true" shape-rendering="crispEdges"><path fill="#314e3b" d="M14 0h4v3h4v3h4v3h4v4h2v4h-4v13H4V17H0v-4h2V9h4V6h4V3h4Z"/><path fill="#e38464" d="M14 4h4v3h4v3h4v3H6v-3h4V7h4z"/><path fill="#fff3c9" d="M7 17h18v10H7z"/><path fill="#85634c" d="M14 20h5v7h-5z"/></svg>';
const view={},villageKey={},chunk={};let tabSel='week';
const vTitle=s=>s.label.split(' / ').pop().replace(/^[A-Z]\.\s*/,'')+' 마을';
const vGroup=s=>course==='60'?'시리즈 '+s.key:s.label.split(' / ')[0];
const topicsOf=s=>s.topics.map((_,i)=>s.start+i+1).filter(n=>topicCards(n).length);
const stat=s=>{const ts=topicsOf(s),cs=cards.filter(c=>c.set===s.key);return {ts,cs,houses:ts.filter(topicDone).length,words:cs.filter(c=>completed(c.id)).length}};
function todaySet(){const wk=weeklyCards(),c=wk.find(c=>!completed(c.id))||wk[0];if(c)return setByKey(course,c.set);const s=setsOf(course);return s[s.length-1]}
const panTools=()=>'<div class="island-tools"><span id="islandHelp">좌우로 움직여 보세요</span><button class="outline" type="button" data-island-pan="-1" aria-label="지도 왼쪽">←</button><button class="outline" type="button" data-island-pan="1" aria-label="지도 오른쪽">→</button></div>';
function hello(){
  const cur=todaySet(),wk=weeklyCards(),left=wk.filter(c=>!completed(c.id)).length;
  return `<section class="tw-hello"><img class="tw-wave" src="sheep-wave.webp" alt="손을 흔드는 양"><div class="tw-hello-text"><b>${wk.length?(left?esc(vTitle(cur))+'로 가요':'이번 주 완료'):'이번 주 말씀 없음'}</b><span>${weekViewed()}주차${wk.length?' · 말씀 '+wk.length+'개':''}</span></div>${wk.length?`<button class="primary" data-enter-village="${cur.key}">${left?'마을로 입장':'마을 다시 가기'}</button>`:''}</section>`;
}
function worldMap(){
  const sets=setsOf(course),cur=todaySet();
  const items=sets.map(s=>{const st=stat(s),done=st.ts.length&&st.houses===st.ts.length,today=cur&&s.key===cur.key,pct=st.cs.length?Math.round(st.words/st.cs.length*100):0;
    return `<li class="tw-stop ${today?'is-today':''} ${done?'is-done':''}" style="--vc:${villageTheme(s.key).accent}"><span class="tw-node" aria-hidden="true">${today?'<img src="sheep-wave.webp" alt="">':villageIconSym(s.key)}</span><button type="button" class="tw-village" data-enter-village="${s.key}" aria-label="${esc(vTitle(s))} 입장. 집 ${st.houses}/${st.ts.length} 완료${today?'. 오늘의 마을':''}"><span class="tw-vtop"><small>${today?'오늘의 마을':done?'완주 ✓':esc(vGroup(s))}</small><em>입장 ▸</em></span><strong>${esc(vTitle(s))}</strong><span class="tw-bar" aria-hidden="true"><i style="width:${pct}%"></i></span><small>집 ${st.houses}/${st.ts.length} · 말씀 ${st.words}/${st.cs.length}</small></button></li>`}).join('');
  return `<section class="tw-world" id="worldMap"><h2 class="tw-title">전체 마을</h2><ol class="tw-path">${items}</ol></section>`;
}
function villageMap(){
  const sets=setsOf(course),wk=weeklyCards(),week=new Set(wk.map(c=>c.topic));
  const s=setByKey(course,villageKey[course])||todaySet(),per=6,all=topicsOf(s),vst=villageStops(s.key),vth=villageTheme(s.key);
  const chunks=Math.max(1,Math.ceil(s.topics.length/per)),ck=course+':'+s.key;
  const activeAll=all.find(t=>week.has(t)&&!topicDone(t))||all.find(t=>week.has(t));
  let ch=chunk[ck];if(ch==null)ch=Math.floor(((activeAll||all[0]||s.start+1)-s.start-1)/per);
  ch=Math.max(0,Math.min(chunks-1,ch));
  const ns=all.filter(t=>Math.floor((t-s.start-1)/per)===ch),active=ns.find(t=>week.has(t)&&!topicDone(t)),st=stat(s);
  const chunkTabs=chunks>1?`<div class="village-tabs village-chunks" role="group" aria-label="집 범위 선택">${Array.from({length:chunks},(_,i)=>`<button type="button" class="${i===ch?'is-on':''}" data-village-chunk="${i}" aria-pressed="${i===ch}">집 ${String(i*per+1).padStart(2,'0')}–${String(Math.min(s.topics.length,(i+1)*per)).padStart(2,'0')}</button>`).join('')}</div>`:'';
  return `<section class="house-map island-map tw-vmap" id="villageMap" data-set="${s.key}" style="--vc:${vth.accent}"><div class="tw-backbar"><button type="button" class="outline" data-back-world>← 전체 마을</button><div class="village-tabs" role="group" aria-label="다른 마을로 이동">${sets.map(x=>`<button type="button" class="${x.key===s.key?'is-on':''}" data-enter-village="${x.key}" aria-pressed="${x.key===s.key}" title="${esc(vTitle(x))}">${esc(x.short)}</button>`).join('')}</div></div><div class="house-heading"><div><small>${esc(vGroup(s))}</small><h2>${esc(vTitle(s))}</h2><p>집 ${st.houses}/${st.ts.length} · 말씀 ${st.words}/${st.cs.length}</p></div><img src="${MASCOT}" alt="크림색 양 친구"></div>${chunkTabs}${active?`<p class="house-current">오늘 갈 집 · ${esc(topicTitleAt(course,active))}</p>`:''}${panTools()}<div class="island-scroll" tabindex="0" role="region" aria-label="${esc(vTitle(s))} 지도" aria-describedby="islandHelp"><div class="island-board">${villageScenery(s.key)}<ol>${ns.map((t,i)=>{const g=topicCards(t),c=g.filter(x=>completed(x.id)).length,fin=c===g.length,[x,y]=vst[i]||islandStops[i];return `<li style="--x:${x/850*100}%;--y:${y/468*100}%"><button class="island-house ${t===active?'is-current':''} ${fin?'is-done':''}" data-house="${t}" aria-expanded="false" aria-controls="housePanel">${t===active?`<img class="island-marker" src="${MASCOT}" alt="현재 위치">`:''}<span class="island-house-icon">${houseSvg.replace('#e38464',vth.accent)}</span><span class="island-label"><small>집 ${String(t-s.start).padStart(2,'0')} · ${fin?'완료':t===active?'오늘 갈 집':week.has(t)?'이번 주':'방문 가능'} · ${c}/${g.length}</small><strong>${esc(topicTitleAt(course,t))}</strong></span></button></li>`}).join('')}</ol></div></div><div id="housePanel" hidden></div></section>`;
}
function weekPanel(){
  const cc=weeklyCards();
  const nav=`<div class="tw-weekhead"><div class="weeknav"><button data-week="-1" aria-label="이전 주">‹</button><span>${weekViewed()}주차</span><button data-week="1" aria-label="다음 주">›</button></div><small>${weekLabel()}${weekViewed()!==weekNow()?' · 다른 주차를 보는 중':''}</small>${weekViewed()!==weekNow()?'<button class="textbutton" data-current>이번 주로</button>':''}</div>`;
  if(!cc.length)return nav+'<div class="empty">이 주차에는 연결된 말씀이 없어요.<br>누적 암송카드에서 복습하거나 진도를 바꿔 보세요.</div><button class="textbutton" data-plan>진도 바꾸기 →</button>';
  return nav+`<div class="memorytrack" id="memoryTrack" role="list" aria-label="이번 주 암송카드, 좌우로 넘기기" tabindex="0">${cc.map((c,i)=>memoryCard(c,i,cc.length)).join('')}</div><div class="memorycontrols"><button id="memoryPrev" aria-label="이전 말씀">‹</button><div class="memoryposition"><span id="memoryCount" aria-live="polite">1 / ${cc.length}</span><div class="memoryticks" aria-hidden="true">${cc.map((_,i)=>`<i data-memorytick="${i}" class="${i===0?'on':''}"></i>`).join('')}</div></div><button id="memoryNext" aria-label="다음 말씀">›</button></div><p class="tw-help">이미지 암기 → 필사하기 → 통암기</p><button class="textbutton" data-plan>진도 바꾸기 →</button>`;
}
function cumPanel(){
  const cum=cumulativeCards(),done=cum.filter(c=>completed(c.id)),due=new Set(dueNow().map(c=>c.id)),dueDone=done.filter(c=>due.has(c.id)).length;
  const groups=setsOf(course).map(s=>({s,list:cum.filter(c=>c.set===s.key)})).filter(g=>g.list.length);
  const chip=c=>completed(c.id)?(due.has(c.id)?'<em class="tw-chip due">복습할 차례</em>':'<em class="tw-chip ok">외웠어요 ✓</em>'):'<em class="tw-chip">아직이에요</em>';
  return `<div class="tw-cumhead"><div><b>1주차부터 지금까지 ${cum.length}개 말씀</b><span>외운 말씀 ${done.length}개 · 복습할 차례 ${dueDone}개</span></div><button class="primary" data-review="mission-review" ${done.length?'':'disabled'}>복습 시작 · ${done.length}개</button></div>${done.length?'':'<p class="tw-help">통암기에 성공하면 복습할 수 있어요</p>'}${groups.length?groups.map(g=>`<details class="tw-group" ${groups.length<=2?'open':''}><summary><span>${esc(vTitle(g.s))}</span><small>${g.list.filter(c=>completed(c.id)).length}/${g.list.length}</small></summary><div class="tw-list">${g.list.map(c=>`<button class="tw-row" data-card="${c.id}"><span><b>${esc(c.ref)}</b><small>${esc(c.tn||c.topic)}. ${esc(c.title)}</small></span>${chip(c)}</button>`).join('')}</div></details>`).join(''):'<div class="empty">아직 누적된 말씀이 없어요.</div>'}`;
}
plannerToday=function(){
  const cc=weeklyCards(),cum=cumulativeCards(),inV=view[course]==='village';
  return hello()+(inV?villageMap():worldMap())+`<section class="tw-cards" id="twCards"><div class="tw-tabs" role="tablist" aria-label="암송카드 구분"><button role="tab" id="tab-week" aria-selected="${tabSel==='week'}" aria-controls="panel-week" data-twtab="week">이번 주 암송카드 <span>${cc.length}</span></button><button role="tab" id="tab-cum" aria-selected="${tabSel==='cum'}" aria-controls="panel-cum" data-twtab="cum">누적 암송카드 <span>${cum.length}</span></button></div><div role="tabpanel" id="panel-week" aria-labelledby="tab-week" ${tabSel==='week'?'':'hidden'}>${weekPanel()}</div><div role="tabpanel" id="panel-cum" aria-labelledby="tab-cum" ${tabSel==='cum'?'':'hidden'}>${cumPanel()}</div></section>`;
};
function bindToday(){
  const clean=!!course&&!!state.weeklyCount&&tab==='today';
  document.body.classList.toggle('today-clean',clean);
  if(!clean||!$('#twCards'))return;
  const redraw=(sel)=>{render();if(sel)document.querySelector(sel)?.scrollIntoView({block:'start',behavior:'instant'})};
  $$('[data-enter-village]').forEach(b=>b.onclick=()=>{view[course]='village';villageKey[course]=b.dataset.enterVillage;delete chunk[b.dataset.enterVillage+':'+course];redraw('#villageMap')});
  $$('[data-back-world]').forEach(b=>b.onclick=()=>{view[course]='world';redraw('#worldMap')});
  $$('[data-village-chunk]').forEach(b=>b.onclick=()=>{const k=$('#villageMap').dataset.set;chunk[k+':'+course]=Number(b.dataset.villageChunk);redraw('#villageMap')});
  $$('[data-twtab]').forEach(b=>b.onclick=()=>{tabSel=b.dataset.twtab;$$('[data-twtab]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));$('#panel-week').hidden=tabSel!=='week';$('#panel-cum').hidden=tabSel!=='cum'});
  const scroller=$('.island-scroll'),pan=$$('[data-island-pan]');
  if(scroller&&pan.length){
    const update=()=>{pan[0].disabled=scroller.scrollLeft<=1;pan[1].disabled=scroller.scrollLeft+scroller.clientWidth>=scroller.scrollWidth-1};
    pan.forEach(b=>b.onclick=()=>scroller.scrollBy({left:Number(b.dataset.islandPan)*Math.max(160,scroller.clientWidth*.64),behavior:'instant'}));
    scroller.addEventListener('scroll',update,{passive:true});
    const ro=new ResizeObserver(()=>{if(scroller.isConnected)update();else ro.disconnect()});ro.observe(scroller);
    requestAnimationFrame(()=>{const m=scroller.querySelector('.is-current');if(m&&scroller.clientWidth)scroller.scrollLeft=m.parentElement.offsetLeft-scroller.clientWidth/2;update()});
  }
  const panel=$('#housePanel');
  if(panel)$$('[data-house]').forEach(b=>b.onclick=()=>{
    const was=b.getAttribute('aria-expanded')==='true';$$('[data-house]').forEach(x=>x.setAttribute('aria-expanded','false'));panel.hidden=was;if(was)return;
    b.setAttribute('aria-expanded','true');const t=Number(b.dataset.house);
    panel.innerHTML=`<h3 tabindex="-1">${esc(topicTitleAt(course,t))} 집</h3><p class="tw-steps">이미지 암기 → 필사하기 → 통암기</p><div>${topicCards(t).map(c=>`<button class="outline" data-house-card="${c.id}">${esc(c.ref)} · ${completed(c.id)?'복습':'학습 시작'} →</button>`).join('')}</div>`;
    panel.querySelector('h3').focus();panel.scrollIntoView({block:'nearest'});
    $$('[data-house-card]').forEach(x=>x.onclick=()=>{sessionQueue=[];sessionTotal=0;openCard(x.dataset.houseCard)});
  });
}
const prevRender=render;
render=function(){prevRender();bindToday()};
{const l=document.createElement('link');l.rel='stylesheet';l.href='today.css';document.head.append(l)}
render();
})();
