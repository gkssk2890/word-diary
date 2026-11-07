// Presentation only: existing plans, learning records and download behavior remain intact.
const MASCOT='felt-sheep.webp';
plannerToday=function(){
  const cc=weeklyCards(),ns=topicNumbers(displayRange(weekViewed())),cum=cumulativeCards(),focus=cc.find(c=>!completed(c.id))||cc[0],done=cc.filter(c=>completed(c.id)).length;
  return `<section class="littlehello"><div><span>${weekViewed()}주차 · 주 ${weeklyCount()}개 소주제</span><h2>오늘도 한 말씀,<br>마음에 차곡차곡.</h2></div><img src="${MASCOT}" alt="보송한 크림색 양 친구"></section><section class="dailyword"><div class="dailylabel"><span>${weekViewed()===weekNow()?'오늘 이어 외울 말씀':'선택한 주차의 말씀'}</span><small>${done}/${cc.length}</small></div>${focus?`<div class="wordpath">${focus.tn||focus.topic}. ${focus.title}</div><h3>${focus.ref}</h3><p class="wordpreview">${focus.text.length>115?focus.clauses[0]+' …':focus.text}</p><button class="primary full" data-card="${focus.id}">${done===cc.length?'다시 암송하기':'이어서 암송하기'} →</button>`:'<p class="muted">현재 연결된 A 범위를 마쳤어요.<br>아래에서 누적 복습을 이어가세요.</p>'}<div class="dailyprogress"><i style="width:${cc.length?done/cc.length*100:0}%"></i></div></section><section class="simplecumulative"><div><h3>배운 말씀, 잊지 않도록</h3><p>1주차부터 지금까지 · ${cum.length}개 말씀</p></div><button class="outline" data-review="cumulative" ${cum.length?'':'disabled'}>누적 복습 →</button></section><details class="simpledetails"><summary>${weekViewed()===weekNow()?'이번 주':'선택 주차'} 소주제 <span>${ns.length}개 · ${weekLabel()}</span></summary><div class="detailbody">${ns.map(topicHTML).join('')||'<p class="muted">연결된 소주제가 없어요.</p>'}<button class="textbutton" data-plan>진도 바꾸기 →</button></div></details><details class="simpledetails"><summary>주차 계획 보기 <span>${weekViewed()}주차</span></summary><div class="detailbody"><div class="weeknav"><button data-week="-1" aria-label="이전 주">‹</button><span>${weekViewed()}주차</span><button data-week="1" aria-label="다음 주">›</button><button class="textbutton" data-current>이번 주로</button></div>${timelineHTML()}</div></details>`;
};
const homeBeforeSimple=courseHome;
courseHome=function(){homeBeforeSimple();$('#heading').textContent='어떤 말씀을 외울까요?';$('#subtitle').textContent='';$('.coursewelcome').innerHTML=`<img class="coursepony" src="${MASCOT}" alt="크림색 양 친구"><p>나의 속도로, 꾸준히 함께.</p>`;$('.homeprinciples').hidden=true;$$('.coursechoice').forEach(b=>{const c=b.dataset.enter;b.innerHTML=`<span class="coursebook">${c==='60'?'60':'180'}</span><div><h2>${c}구절</h2><small>${courseSummary(c)}</small></div><strong>→</strong>`})};
const beforeSimpleRender=render;
render=function(){beforeSimpleRender();
  $$('img[src="felt-sheep.webp"]').forEach(i=>{i.src=MASCOT;i.alt=i.alt?'크림색 양 친구':''});
  if(course&&state.weeklyCount){
    if(tab==='today')$('#heading').textContent='오늘의 암송';
    if(tab==='library')$('#heading').textContent='말씀 모아보기';
    if(tab==='record')$('#heading').textContent='나의 암송 기록';
    const notice=$('#content>.notice');if(notice){const d=document.createElement('details');d.className='contentnote';d.innerHTML=`<summary>현재 연결된 말씀 안내</summary><p>${notice.textContent}</p>`;notice.replaceWith(d)}
    $('#planSettings').textContent='진도 설정';
  }
};
const brand=$('.brand');$('header').prepend(brand);brand.innerHTML=`<span class="simplebrand"><img src="${MASCOT}" alt=""><span>말씀을 마음에</span></span>`;
const icons={today:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',library:'<path d="M12 5v16M12 5Q7 2 2 5v14q5-3 10 2 5-5 10-2V5q-5-3-10 0Z"/>',wallpaper:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',record:'<path d="M5 20V12M12 20V4M19 20V8"/>'};
const navLabels={today:'오늘',library:'말씀',wallpaper:'배경화면',record:'기록'};
for(const id of['today','library','record']){const b=$(`nav [data-tab="${id}"]`);if(b){$('nav').append(b);b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[id]}</svg><span>${navLabels[id]}</span>`}}
// Use the pony for the app icon without replacing older assets in the repository.
document.querySelector('link[rel="icon"]').href='felt-sheep-icon.png';
document.head.append(document.querySelector('link[href="simple.css"]'));
render();
