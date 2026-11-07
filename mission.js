/* Uses the existing plan, card deck and success handler; opening a screen never saves a rating. */
(()=>{
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized=s=>s.normalize('NFC').replace(/[\s\p{P}\u200B\uFEFF]/gu,'');
const equal=(a,b)=>!!normalized(a)&&normalized(a)===normalized(b);
const steps={read:'이미지 암기',hint:'필사하기',recall:'통암기'}, drafts=new Map();
const stepTo=m=>{mode=m;renderStudy();$('#study').scrollTop=0};
const oldStudy=renderStudy;
renderStudy=function(){
  oldStudy();
  $('.studyactions').hidden=true;
  $('#cardDownload')?.remove();
  $$('[data-mode]').forEach((b,i)=>{b.textContent=(i+1)+'. '+steps[b.dataset.mode];b.onclick=()=>stepTo(b.dataset.mode)});
  $('#studyTopic').textContent=course+'구절 · '+steps[mode];
  $('#studyGuideSheep')?.remove();
  $('#studyBody').before(Object.assign(document.createElement('div'),{
    id:'studyGuideSheep',className:'study-sheep-guide',
    innerHTML:`<img src="${MASCOT}" alt=""><span>${mode==='read'?'그림에서 말씀의 단서를 찾아봐요.':mode==='hint'?'한 글자씩 마음에 새겨요.':'떠오르는 말씀을 차근차근 적어봐요.'}</span>`
  }));
  const verse=current, selectedCourse=course, surface=$('#studyBody .studyswipesurface');
  if(mode==='read'){
    const art=surface.querySelector('.studyhero');
    if(art){
      const b=document.createElement('a');b.className='mission-download';b.textContent='↓ 이미지 다운로드';b.href=verse.orig;b.download=`${verse.ref.replaceAll(':','-')}_일러스트카드${verse.orig.slice(verse.orig.lastIndexOf('.'))}`;art.after(b);
    }
    $('#studyNext').textContent='필사하기 →';$('#studyNext').onclick=()=>stepTo('hint');return;
  }
  const copy=mode==='hint',key=course+':'+verse.id+':'+mode;
  const words=[...new Set((verse.clauses||[verse.text]).flatMap(clause=>{
    const w=clause.trim().split(/\s+/);return w.length>=4?[w[0],w[Math.floor(w.length/2)]]:w.slice(0,1);
  }))].filter(Boolean).slice(0,10);
  surface.innerHTML=`<section class="mission-writing"><h3>${copy?'한 글자씩 말씀을 새겨요':'키워드만 보고 말씀 전체를 써 보세요'}</h3>
  ${copy?`<div class="mission-guide"><strong>따라쓰기 가이드 · 개역개정</strong><p>${esc(verse.text)}</p></div>`:`<ul class="mission-keywords" aria-label="본문 키워드">${words.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`}
  <label for="missionInput">${copy?'필사':'통암기'} 입력</label><textarea id="missionInput" rows="5" maxlength="800" lang="ko" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="${copy?'위 말씀을 보고 따라 써 보세요':'기억나는 말씀을 처음부터 써 보세요'}"></textarea>
  <p class="mission-note">띄어쓰기와 문장부호 차이는 틀린 것으로 보지 않아요.</p><div class="mission-controls"><button class="primary" id="missionCompare">원문과 대조하기</button>${copy?'<button class="outline" id="missionRecall">통암기 →</button>':''}</div><div id="missionFeedback"></div></section>`;
  const input=$('#missionInput'),feedback=$('#missionFeedback'),compare=$('#missionCompare');
  input.value=drafts.get(key)||'';let composing=false;
  const capture=()=>{drafts.set(key,input.value);feedback.replaceChildren()};
  input.oncompositionstart=()=>{composing=true;compare.disabled=true};
  input.oncompositionend=()=>{composing=false;compare.disabled=false;capture()};
  input.oninput=e=>{if(!composing&&!e.isComposing)capture()};
  if(copy)$('#missionRecall').onclick=()=>stepTo('recall');
  compare.onclick=()=>{
    if(composing)return;
    const a=Array.from(normalized(input.value)),b=Array.from(normalized(verse.text));
    if(!a.length){feedback.innerHTML='<p role="status">말씀을 먼저 입력해 주세요.</p>';input.focus();return}
    const ok=equal(input.value,verse.text);
    let i=0,j=0;
    if(!ok){
      while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;
      while(j<Math.min(a.length,b.length)-i&&a[a.length-1-j]===b[b.length-1-j])j++;
    }
    const portion=x=>esc(x.slice(i,x.length-j).slice(0,24).join(''))||'없음';
    feedback.innerHTML=`<div class="mission-result ${ok?'matched':''}"><h4 tabindex="-1">${ok?'본문이 원문과 일치해요':'다른 부분을 확인하고 다시 도전해요'}</h4>
    ${!ok?`<p>처음 다른 부분 · 공백 제외 ${i+1}번째 글자부터</p><p>입력: <mark>${portion(a)}</mark><br>원문: <mark>${portion(b)}</mark></p><button class="outline" id="missionRetry">입력으로 돌아가 고치기</button>`:''}
    ${!copy?`<p class="mission-note">개역개정 원문</p><p>${esc(verse.text)}</p>`:''}
    ${ok&&!copy?`<p>마을·구역: ${esc(cardSetLabel(verse))}<br>집: ${esc(verse.title)}<br>말씀 주소: ${esc(verse.ref)}</p><button class="primary" id="missionSuccess">주제와 주소도 확인했어요 · 성공 기록</button>`:''}</div>`;
    feedback.querySelector('h4').focus();
    if($('#missionRetry'))$('#missionRetry').onclick=()=>{feedback.replaceChildren();input.focus()};
    if($('#missionSuccess'))$('#missionSuccess').onclick=()=>{
      if(current!==verse||selectedCourse!==course||mode!=='recall'||!equal(input.value,verse.text))return;
      const original=$('[data-rate="success"]');
      $$('.selfcheck input').forEach(x=>x.checked=true);
      original.disabled=false;$('#missionSuccess').disabled=true;drafts.delete(key);original.click();
    };
  };
};

function reviewCards(){
  const start=displayRange(weekNow()).start;
  const recorded=new Set(state.history.filter(h=>h.rate==='success'&&h.allParts===true).map(h=>String(h.id)));
  const overdue=c=>state.records[c.id]?.due<=localDate();
  return cumulativeCards().filter(c=>completed(c.id)||recorded.has(c.id)).sort((a,b)=>
    Number(a.topic>=start)-Number(b.topic>=start)||Number(overdue(b))-Number(overdue(a))||a.topic-b.topic||Number(a.id)-Number(b.id));
}
const oldSession=startSession;
startSession=function(type){
  if(type!=='mission-review')return oldSession(type);
  const queue=reviewCards();if(!queue.length)return;
  studyDeckIds=[];studyDeckCourse=null;studyDeckSession=false;
  sessionQueue=queue.map(c=>c.id);sessionTotal=sessionQueue.length;openCard(sessionQueue.shift());
};
function reviewHTML(){
  const queue=reviewCards(),r=displayRange(weekNow());
  const fresh=cards.filter(c=>c.topic>=r.start&&c.topic<=r.end&&!queue.includes(c));
  return `<section id="missionReview" class="mission-review" tabindex="-1"><h2>누적 복습</h2><div class="review-split"><p><b>이번 주 새 말씀 · ${fresh.length}개</b><span>${fresh.map(c=>esc(c.ref)).join(' · ')||'새로 외울 말씀이 없어요.'}</span></p><p><b>이미 외운 말씀 · ${queue.length}개</b><span>${queue.length?'이전 주 먼저, 각 범위에서 복습일이 된 말씀부터 열어요.':'성공 기록이 생기면 여기에 표시돼요.'}</span></p></div><button class="primary" data-review="mission-review" ${queue.length?'':'disabled'}>지금 복습 시작 · ${queue.length}개</button>${queue.length?`<details><summary>복습 순서 보기</summary><ol>${queue.map(c=>`<li>${esc(c.ref)}</li>`).join('')}</ol></details>`:''}</section>`;
}
const house='<svg viewBox="0 0 32 30" aria-hidden="true" shape-rendering="crispEdges"><path fill="#314e3b" d="M14 0h4v3h4v3h4v3h4v4h2v4h-4v13H4V17H0v-4h2V9h4V6h4V3h4Z"/><path fill="#e38464" d="M14 4h4v3h4v3h4v3H6v-3h4V7h4z"/><path fill="#fff3c9" d="M7 17h18v10H7z"/><path fill="#85634c" d="M14 20h5v7h-5z"/></svg>';
const villageSet={},villageChunk={};
function houseMap(){
  const sets=setsOf(course),wk=weeklyCards(),week=new Set(wk.map(c=>c.topic));
  const setObj=setByKey(course,villageSet[course])||setOfTopic(course,(wk[0]||{}).topic)||sets[0];
  const per=6,all=setObj.topics.map((_,i)=>setObj.start+i+1).filter(n=>topicCards(n).length);
  const chunks=Math.max(1,Math.ceil(setObj.topics.length/per)),ck=setObj.key+':'+course;
  const activeAll=all.find(n=>week.has(n)&&!topicDone(n))||all.find(n=>week.has(n));
  let ch=villageChunk[ck];if(ch==null)ch=Math.floor(((activeAll||all[0]||setObj.start+1)-setObj.start-1)/per);
  ch=Math.max(0,Math.min(chunks-1,ch));
  const ns=all.filter(n=>Math.floor((n-setObj.start-1)/per)===ch);
  const active=ns.find(n=>week.has(n)&&!topicDone(n)),done=all.filter(topicDone).length;
  const part=setObj.label.split(' / ').pop();
  const tabs=sets.length>1?`<div class="village-tabs" role="group" aria-label="구역 선택">${sets.map(s=>`<button type="button" class="${s.key===setObj.key?'is-on':''}" data-village="${s.key}" aria-pressed="${s.key===setObj.key}">${esc(s.short)}</button>`).join('')}</div>`:'';
  const chunkTabs=chunks>1?`<div class="village-tabs village-chunks" role="group" aria-label="집 범위 선택">${Array.from({length:chunks},(_,i)=>`<button type="button" class="${i===ch?'is-on':''}" data-village-chunk="${i}" aria-pressed="${i===ch}">집 ${String(i*per+1).padStart(2,'0')}–${String(Math.min(setObj.topics.length,(i+1)*per)).padStart(2,'0')}</button>`).join('')}</div>`:'';
  return `<section class="house-map island-map" id="villageMap"><div class="house-heading"><div><small>${esc(part)} · 구역</small><h2>${esc(setObj.villageName)} 마을</h2><p>집 ${done} / ${all.length} 완료 · 연결된 말씀 기준</p></div><img src="${MASCOT}" alt="크림색 양 친구"></div>
  ${tabs}${chunkTabs}
  ${all.length&&done===all.length?`<div class="house-current island-complete" role="status"><img src="${MASCOT}" alt=""><span>이 구역의 모든 집을 완주했어요! 누적 복습에서 다시 만나요.</span></div>`:active?`<p class="house-current">현재 집 · ${esc(topicTitleAt(course,active))}</p>`:''}
  <div class="island-tools"><span id="islandHelp">지도를 좌우로 움직여 집을 찾아보세요.</span><button class="outline" type="button" data-island-pan="-1" aria-label="지도 왼쪽">←</button><button class="outline" type="button" data-island-pan="1" aria-label="지도 오른쪽">→</button></div>
  <div class="island-scroll" tabindex="0" role="region" aria-label="말씀의 섬 지도" aria-describedby="islandHelp"><div class="island-board">${islandScenery()}
  <ol>${ns.map((n,i)=>{
    const group=topicCards(n),count=group.filter(c=>completed(c.id)).length,finished=count===group.length;
    const [x,y]=islandStops[i];
    return `<li style="--x:${x/850*100}%;--y:${y/468*100}%"><button class="island-house ${n===active?'is-current':''} ${finished?'is-done':''}" data-house="${n}" aria-expanded="false" aria-controls="housePanel">${n===active?`<img class="island-marker" src="${MASCOT}" alt="현재 위치">`:''}<span class="island-house-icon">${house}</span><span class="island-label"><small>집 ${String(n-setObj.start).padStart(2,'0')} · ${finished?'완료':n===active?'현재':week.has(n)?'이번 주':'방문 가능'} · ${count}/${group.length}</small><strong>${esc(topicTitleAt(course,n))}</strong></span></button></li>`;
  }).join('')}</ol></div></div><div id="housePanel" hidden></div></section>`;
}
function bindHouses(){
  const panel=$('#housePanel');if(!panel)return;
  const redraw=()=>{render();$('#villageMap')?.scrollIntoView({block:'start'})};
  $$('[data-village]').forEach(b=>b.onclick=()=>{villageSet[course]=b.dataset.village;delete villageChunk[b.dataset.village+':'+course];redraw()});
  $$('[data-village-chunk]').forEach(b=>b.onclick=()=>{const cur=$('[data-village].is-on')?.dataset.village;villageChunk[cur+':'+course]=Number(b.dataset.villageChunk);redraw()});
  const scroller=$('.island-scroll'),pan=$$('[data-island-pan]');
  const update=()=>{pan[0].disabled=scroller.scrollLeft<=1;pan[1].disabled=scroller.scrollLeft+scroller.clientWidth>=scroller.scrollWidth-1;};
  pan.forEach(b=>b.onclick=()=>scroller.scrollBy({left:Number(b.dataset.islandPan)*Math.max(160,scroller.clientWidth*.64),behavior:'instant'}));
  scroller.addEventListener('scroll',update,{passive:true});
  const resize=new ResizeObserver(()=>{if(scroller.isConnected)update();else resize.disconnect();});
  resize.observe(scroller);
  requestAnimationFrame(()=>{
    const marker=scroller.querySelector('.is-current');
    if(marker&&scroller.clientWidth)scroller.scrollLeft=marker.parentElement.offsetLeft-scroller.clientWidth/2;
    update();
  });
  $$('[data-house]').forEach(b=>b.onclick=()=>{
    const was=b.getAttribute('aria-expanded')==='true';$$('[data-house]').forEach(x=>x.setAttribute('aria-expanded','false'));panel.hidden=was;if(was)return;
    b.setAttribute('aria-expanded','true');const n=Number(b.dataset.house);
    panel.innerHTML=`<h3 tabindex="-1">${esc(topicTitleAt(course,n))} 집</h3><p>이미지 암기 → 필사하기 → 통암기</p><div>${topicCards(n).map(c=>`<button class="outline" data-house-card="${c.id}">${esc(c.ref)} · ${completed(c.id)?'복습':'학습 시작'} →</button>`).join('')}</div>`;
    panel.querySelector('h3').focus();panel.scrollIntoView({block:'nearest'});
    $$('[data-house-card]').forEach(x=>x.onclick=()=>{sessionQueue=[];sessionTotal=0;openCard(x.dataset.houseCard)});
  });
}
const oldToday=plannerToday;
plannerToday=function(){
  const w=document.createElement('div');w.innerHTML=oldToday();
  w.querySelector('.journeyhero')?.remove();w.querySelector('.journey-map-section')?.remove();
  const sum=w.querySelector('.journey-summary'), first=weeklyCards().find(c=>!completed(c.id))||weeklyCards()[0];
  sum.querySelector('small').textContent=`${weekViewed()}주차 · ${weekLabel()} · ${course}구절`;
  sum.insertAdjacentHTML('afterend',`<div class="mission-home-actions">${first?`<button class="primary" data-card="${first.id}">이번 주 말씀 열기 →</button>`:''}<a class="outline" href="#missionReview">누적 복습 ↓</a></div>`);
  const quick=w.querySelector('.journey-quick');(quick||w.querySelector('.mission-home-actions')).insertAdjacentHTML('afterend',houseMap());
  const review=w.querySelector('.simplecumulative');
  if(review){w.querySelector('.house-map').after(review);review.outerHTML=reviewHTML();}
  return w.innerHTML;
};
const oldCourseHome=courseHome;
courseHome=function(){oldCourseHome();$('#content .journeyhero')?.remove()};
const oldRender=render;
render=function(){oldRender();bindHouses();};
const entrance=document.createElement('div');
entrance.id='missionEntrance';
entrance.innerHTML=journeyHero('마을을 지나, 한 말씀씩 마음에.','<button class="journey-start" id="missionStart"><b>▶ START</b><span>여정 시작</span></button>');
entrance.querySelector('.journeyhero').insertAdjacentHTML('beforeend',`<img class="entrance-sheep" src="${MASCOT}" alt="크림색 양 친구">`);
document.body.prepend(entrance);document.body.classList.add('mission-entering');
$('#missionStart').onclick=()=>{
  document.body.classList.remove('mission-entering');entrance.hidden=true;
  tab='today';weekOverride=null;render();window.scrollTo(0,0);
  const title=$('#heading');title.tabIndex=-1;title.focus({preventScroll:true});
};
{const l=document.createElement('link');l.rel='stylesheet';l.href='catalog.css';document.head.append(l)}
document.querySelector('meta[name="theme-color"]').content='#c5e9f7';
render();
})();
