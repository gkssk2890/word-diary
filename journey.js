// The map is a view of the existing plan and records, not a separate progress system.
const journeyToday=plannerToday;
const journeyCourseHome=courseHome;
const pixelCloud='<svg viewBox="0 0 80 32" aria-hidden="true" shape-rendering="crispEdges"><path fill="#a7c8df" d="M0 24h8V16h12V8h10V0h22v8h12v8h8v8h8v8H0z"/><path fill="#fffdf3" d="M0 20h8v-8h12V4h10V0h20v8h12v8h10v8H0z"/><path fill="#e5eff8" d="M0 24h72v4H0z"/></svg>';
const pixelTree='<svg viewBox="0 0 40 48" aria-hidden="true" shape-rendering="crispEdges"><path fill="#547744" d="M6 45h28v3H6z"/><path fill="#8b603e" d="M16 25h9v20H16z"/><path fill="#38694d" d="M12 0h15v5h7v6h6v17h-6v7H7v-6H0V12h5V5h7z"/><path fill="#6d9e4c" d="M12 5h15v5h7v13h-6v6H8v-6H4V12h8z"/><path fill="#9cc665" d="M12 6h14v5h-5v5H8v-5h4z"/></svg>';
const pixelFlower='<svg viewBox="0 0 28 25" aria-hidden="true" shape-rendering="crispEdges"><path fill="#47774a" d="M12 10h4v15h-4zM4 15h8v5H4zM16 19h8v4h-8z"/><path fill="#fff0a5" d="M10 0h8v4h5v8h-5v4h-8v-4H5V4h5z"/><path fill="#db8050" d="M11 5h6v6h-6z"/></svg>';
const pixelPin='<svg viewBox="0 0 24 28" aria-hidden="true" shape-rendering="crispEdges"><path fill="#703c43" d="M6 0h12v3h3v3h3v12h-3v3h-3v3h-3v4H9v-4H6v-3H3v-3H0V6h3V3h3z"/><path fill="#ed6661" d="M6 3h12v3h3v12h-3v3h-3v3H9v-3H6v-3H3V6h3z"/><path fill="#fff5dc" d="M8 7h8v8H8z"/></svg>';
function journeyHero(meta,action){
  return `<section class="journeyhero" aria-label="말씀 암송 여정"><div class="journey-cloud cloud-a">${pixelCloud}</div><div class="journey-cloud cloud-b">${pixelCloud}</div><div class="journey-hill"></div><div class="journey-ground"></div><div class="hero-tree">${pixelTree}</div><div class="hero-flower">${pixelFlower}</div><div class="journey-hero-copy"><span class="journey-kicker">✦  말씀을 마음에</span><h2>말씀의 여정</h2><p>${meta}</p>${action}</div></section>`;
}
function journeyMap(cc,active){
  const height=cc.length*76+24;
  // Step the path horizontally between fixed-height rows; labels are regular DOM.
  let path='M38 0 V50';
  for(let i=1;i<cc.length;i++){
    const from=i%2?38:62,to=100-from,top=50+(i-1)*76;
    for(let j=1;j<=8;j++)path+=` V${top+j*7} H${from+(to-from)*j/8}`;
    path+=` V${top+76}`;
  }
  path+=` V${height}`;
  return `<section class="journey-map-section" aria-labelledby="journey-map-title"><div class="journey-map-heading"><div><small>WEEK ${String(weekViewed()).padStart(2,'0')}</small><h2 id="journey-map-title">${weekViewed()===weekNow()?'이번 주':'선택 주차'} 암송 지도</h2></div><a href="#journey-quick">빠른 목록 ↑</a></div><div class="journey-map"><svg class="journey-road" viewBox="0 0 100 ${height}" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true"><path d="${path}" fill="none" stroke="#a58b5e" stroke-width="30" vector-effect="non-scaling-stroke"/><path d="${path}" fill="none" stroke="#ead59f" stroke-width="23" vector-effect="non-scaling-stroke"/><path d="${path}" fill="none" stroke="#fff1c6" stroke-width="2" stroke-dasharray="4 5" vector-effect="non-scaling-stroke"/></svg><ol>${cc.map((c,i)=>{
    const done=completed(c.id),status=done?'완료':c===active?'현재':'다음';
    return `<li class="journey-stop ${i%2?'stop-left':'stop-right'}"><span class="journey-scenery" aria-hidden="true">${i%3===1?pixelFlower:pixelTree}</span><button class="journey-pin ${done?'pin-done':c===active?'pin-current':''}" data-card="${c.id}" ${c===active?'aria-current="step"':''}><span class="pin-icon">${pixelPin}</span><span class="pin-label"><span class="pin-top"><span>길목 ${String(i+1).padStart(2,'0')}</span><b>${done?'✓ ':''}${status}</b></span><strong>${c.ref}</strong></span></button></li>`;
  }).join('')}</ol></div></section>`;
}
plannerToday=function(){
  const cc=weeklyCards(),active=cc.find(c=>!completed(c.id)),first=active||cc[0],done=cc.filter(c=>completed(c.id)).length;
  const action=first?`<button class="journey-start" data-card="${first.id}"><b>▶ START</b><span>${active?'암송 시작':'다시 암송'}</span></button>`:'<button class="journey-start" data-plan><b>진도 설정</b></button>';
  const hero=journeyHero(`${weekViewed()}주차 · ${weekLabel()}`,action);
  const summary=`<section class="journey-summary"><div><small>${course}구절 · 주 ${weeklyCount()}개 소주제</small><strong>${first?first.ref:'연결된 이번 주 구절 없음'}</strong><span>${active?'지금 외울 말씀':first?'이번 주 암송 완료':'진도 설정 또는 누적 복습을 이용하세요'}</span></div><div class="journey-score" aria-label="암송 완료 ${done} / ${cc.length}"><b>${done}<span> / ${cc.length}</span></b><small>암송 완료</small></div></section>`;
  const quick=cc.length?`<details id="journey-quick" class="simpledetails journey-quick"><summary>이번 주 구절 빠른 목록 <span>${cc.length}개</span></summary><div class="journey-list">${cc.map(c=>`<button data-card="${c.id}"><span>${c.ref}</span><small>${completed(c.id)?'완료':c===active?'현재':'다음'} →</small></button>`).join('')}</div></details>`:'';
  const original=journeyToday();
  const existing=original.slice(original.indexOf('</section>')+10).replace(/<div class="weekline"[^>]*><i[^>]*><\/i><\/div>/,'');
  return hero+summary+quick+(cc.length?journeyMap(cc,active)+'<h2 class="journey-deck-heading">이번 주 암송 카드</h2>':'')+existing;
};
courseHome=function(){
  journeyCourseHome();
  $('.coursewelcome')?.insertAdjacentHTML('beforebegin',journeyHero('한 말씀씩, 마음에 담는 길','<a class="journey-start" href="#journey-courses"><b>▶ START</b><span>과정 선택</span></a>'));
  const choices=$('.coursechoices');if(choices)choices.id='journey-courses';
};
const beforeJourneyRender=render;
render=function(){
  beforeJourneyRender();
  const today=!!$('.journey-summary');
  document.body.classList.toggle('journey-view',today||!!$('.journeyhero'));
  if(today)$('#heading').textContent='오늘의 말씀';
  const link=$('.journey-map-heading a');
  if(link)link.onclick=()=>{$('#journey-quick').open=true};
};
const journeyStyle=document.createElement('link');
journeyStyle.rel='stylesheet';journeyStyle.href='journey.css';document.head.append(journeyStyle);
render();
