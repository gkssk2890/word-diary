// Preserve the existing browser records; metadata completion is a new explicit check.
const originalRender=render;
function courseHome(){
  $('#pagetitle').textContent='과정 선택';$('#heading').textContent='어떤 말씀부터 마음에 담을까요?';$('#subtitle').textContent='60구절과 180구절을 먼저 고르고, 나의 암송 계획으로 들어가요.';
  $('.coursebar').hidden=true;$$('nav button').forEach(b=>b.classList.remove('active'));
  $('#content').innerHTML=`<section class="coursewelcome"><div class="eyebrow">MY SCRIPTURE JOURNEY</div><h2>말씀뿐 아니라,<br>말씀의 자리까지 기억해요.</h2><p>대주제 → 소주제 → 말씀 주소 → 본문<br>네 가지를 함께 암송하는 나만의 말씀 다이어리</p></section><div class="coursechoices"><button class="coursechoice sixty" data-enter="60"><span class="courseicon">✳</span><small>TOPICAL MEMORY · 60</small><h2>60구절</h2><p>주제별 말씀 암송</p><div class="courseexample">A. 새로운 삶<br>1. 중심되신 그리스도<br>고린도후서 5:17</div><span class="availability">시리즈 A~E · 말씀 60개</span><strong>60구절 들어가기 →</strong></button><button class="coursechoice oneeighty" data-enter="180"><span class="courseicon">✧</span><small>TOPICAL MEMORY · 180</small><h2>180구절</h2><p>주제의 흐름을 따라 깊이 암송</p><div class="courseexample">1. 하나님을 알아감 / A. 예수 그리스도<br>1. 예수님의 신성<br>요한복음 1:1</div><span class="availability">연결된 묶음 4개 · 카드 65장 학습 가능</span><strong>180구절 들어가기 →</strong></button></div><div class="homeprinciples"><div><b>주마다 소주제 2개</b><span>말씀 수가 아닌 소주제 기준으로 계획해요.</span></div><div><b>네 가지 모두 암송</b><span>대주제·소주제·주소·본문을 함께 점검해요.</span></div><div><b>잊기 전에 다시 만나기</b><span>학습 기록에 따라 복습일을 정해요.</span></div></div>`;
  $('.coursewelcome').insertAdjacentHTML('beforeend','<div class="homehorse"><span class="horsehanja">🐑</span><img src="felt-sheep.webp" alt="말씀을 마음에 양 로고"><span class="horsemeaning">말씀을 마음에</span></div>');
  $$('[data-enter]').forEach(b=>b.onclick=()=>{course=b.dataset.enter;tab='today';weekOverride=null;render();window.scrollTo(0,0)});
}
render=function(){
  if(!course){courseHome();return}
  $('.coursebar').hidden=false;originalRender();
  // The course is selected before entering, not by an in-dashboard toggle.
  $('.segmented').innerHTML=`<button id="c180" hidden>180구절</button><button id="c60" hidden>60구절</button><button id="changeCourse">← 과정 선택</button><span class="selected currentcourse">${course}구절</span>`;
  $('#changeCourse').onclick=()=>{course=null;render();window.scrollTo(0,0)};
  if(course==='180'){
    const banner=$('.heroright');if(banner)banner.innerHTML='<div class="bannerhorse"><span class="horsehanja">🐑</span><img src="felt-sheep.webp" alt="크림색 양 친구"><span>말씀을 마음에</span></div>';
    $$('.statfoot').forEach(el=>{if(el.textContent.includes('성공 기록'))el.textContent='주제·주소·본문 모두 점검한 말씀'});
    $$('.statlabel').forEach(el=>{if(el.textContent.startsWith('이번 주 말씀'))el.firstChild.textContent='이번 주 전체 암송 '});
    $$('.topiccard .muted').forEach(el=>el.textContent=el.textContent.replace('혼자 암송 성공','주제·주소·본문 암송 성공'));
    const note=$('.notebox');if(tab==='today'&&note)note.innerHTML='<b>본문까지 모두 기억해요.</b>대주제 → 소주제 → 말씀 주소 → 본문 순서로 말하고 네 항목을 점검해요. 소주제의 모든 말씀을 통과해야 소주제 1개가 완료돼요.';
    if(tab==='today'){
      const rows=$$('.dayrow span');
      ['첫 번째 소주제<br>대주제·소주제·주소를 본문과 함께 연결하기','첫 번째 소주제<br>네 가지를 모두 가리고 순서대로 말하기','두 번째 소주제<br>주제·주소·본문을 그림과 함께 연결하기','두 번째 소주제<br>네 가지를 모두 가리고 암송하기','두 소주제 함께 점검<br>대주제부터 본문까지 이어서 말하기'].forEach((s,i)=>{if(rows[i])rows[i].innerHTML=s});
    }
    if(tab==='record'){
      $$('.recordtable tbody tr').forEach(row=>{const ref=row.querySelector('td button')?.textContent.replace(' ↗','');const c=cards.find(c=>c.ref===ref);if(c&&state.records[c.id].last==='success'&&!completed(c.id))row.children[1].textContent='본문 성공 · 주제/주소 미점검'});
    }
  }
};
function hierarchy(){return `<div class="memoryhierarchy"><div><small>대주제</small><b>1. 하나님을 알아감<br>A. 예수 그리스도</b></div><span>→</span><div><small>소주제</small><b>${current.topic}. ${current.title}</b></div><span>→</span><div><small>말씀 주소</small><b>${current.ref}</b></div></div>`}
function fullAnswer(){return `<div class="fullanswer">${hierarchy()}<div class="answertext"><small>말씀 본문</small><p>${current.text}</p></div></div>`}
renderStudy=function(){
  $$('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));
  $('#studyTopic').textContent=mode==='read'?'180구절 · 네 가지를 함께 기억하기':'180구절 · 전체 연결 암송';
  $('#studyRef').textContent=mode==='read'?current.ref:'대주제부터 본문까지';
  $('#answer').hidden=mode==='read';$('#answer').textContent='정답 보기';
  $$('[data-part]').forEach(c=>c.checked=false);$('[data-rate="success"]').disabled=true;
  $('#studyBody').innerHTML=mode==='read'?`${hierarchy()}<img class="cardimage" src="${current.image}" alt="${current.ref} 그림 암송카드"><div class="answertext"><small>말씀 본문</small><p>${current.text}</p></div>`:mode==='hint'?`<div class="recallarea"><small>아래 힌트를 완성한 뒤 본문을 이어 말해 보세요.</small><div class="metahints"><p><small>대주제</small> 하나님을 … / 예수 …</p><p><small>소주제</small> ${current.title.slice(0,2)} …</p><p><small>말씀 주소</small> ${current.ref.split(' ')[0]} …장 …절</p></div>${current.clauses.map(c=>`<p>${c.split(' ').slice(0,2).join(' ')} <span style="color:#b3bea9">···</span></p>`).join('')}</div>`:`<div class="recallarea"><div style="font-size:35px;color:#bea36b">✳</div><p>이 말씀의 자리를 기억하나요?</p><ol class="recallsteps"><li>대주제 말하기</li><li>소주제 말하기</li><li>말씀 주소 말하기</li><li>본문 전체 암송하기</li></ol><small>지금 보고 외운 말씀을 순서대로 말해 보세요.<br>정답을 보기 전에는 주제와 주소도 숨겨져 있어요.</small></div>`;
};
$('#answer').onclick=()=>{const a=$('#studyBody .fullanswer');if(a){a.remove();$('#answer').textContent='정답 보기'}else{$('#studyBody').insertAdjacentHTML('beforeend',fullAnswer());$('#answer').textContent='정답 가리기'}};
$$('[data-part]').forEach(c=>c.onchange=()=>{$('[data-rate="success"]').disabled=!$$('[data-part]').every(x=>x.checked)});
$$('[data-rate]').forEach(b=>b.onclick=()=>{
  const id=current.id,rate=b.dataset.rate;
  if(rate==='success'&&!$$('[data-part]').every(c=>c.checked))return toast('대주제·소주제·말씀 주소·본문을 모두 점검해 주세요.');
  const prev=state.records[id]||{count:0,streak:0},streak=rate==='success'?(prev.streak||0)+1:0;
  state.records[id]={...prev,count:prev.count+1,streak,last:rate,allParts:rate==='success',checkedParts:Object.fromEntries($$('[data-part]').map(c=>[c.dataset.part,c.checked])),date:localDate(),due:addDays(localDate(),rate==='success'?[1,3,7,14,30][Math.min(streak-1,4)]:1)};
  state.history.push({id,rate,date:localDate(),allParts:rate==='success'});save();$('#study').close();render();toast(rate==='success'?'대주제부터 본문까지, 전체 암송 성공을 기록했어요.':'기록했어요. 주제와 주소도 함께 다시 연습해요.');
});
// Settings must remain accessible on narrow screens too.
const settingsButton=document.createElement('button');settingsButton.className='mobileSettings';settingsButton.textContent='⚙';settingsButton.setAttribute('aria-label','학습 설정 열기');settingsButton.onclick=settings;$('.topright').prepend(settingsButton);
$('.brand').onclick=e=>{e.preventDefault();course=null;render();window.scrollTo(0,0)};
$('.brand').innerHTML='<span class="brandlockup"><img src="felt-sheep.webp" alt=""><span>말씀을 마음에<small></small></span></span>';
const favicon=document.createElement('link');favicon.rel='icon';favicon.href='felt-sheep-icon.png';document.head.append(favicon);
render();
