// 홈 화면에 추가하는 방법 안내(읽기 전용 안내창). 기록이나 진도는 건드리지 않아요.
(()=>{
const dlg=document.createElement('dialog');dlg.id='homeGuide';dlg.setAttribute('aria-labelledby','hgTitle');
dlg.innerHTML=`<div class="hg-head"><h2 id="hgTitle">홈 화면에 추가하기</h2><button type="button" class="hg-close" aria-label="안내 닫기">×</button></div>
<p class="hg-lead">아이콘을 눌러 앱처럼 바로 열 수 있어요.</p>
<div class="hg-preview"><img src="icon-180.png" alt=""><span>홈 화면에는 이렇게 나와요<br><b>말씀을 마음에</b></span></div>
<section><h3>아이폰 (사파리)</h3><ol><li>사파리로 이 주소를 열어요. 카카오톡 안에서 열렸다면 메뉴에서 'Safari로 열기'를 눌러요.</li><li>화면 아래의 공유 버튼(네모에서 화살표가 위로 나가는 모양)을 눌러요.</li><li>메뉴를 위로 올려 '홈 화면에 추가'를 눌러요.</li><li>이름이 '말씀을 마음에'인지 확인하고 오른쪽 위 '추가'를 눌러요.</li></ol></section>
<section><h3>안드로이드 (크롬)</h3><ol><li>크롬으로 이 주소를 열어요. 카카오톡 안에서 열렸다면 메뉴에서 '다른 브라우저로 열기'를 눌러요.</li><li>오른쪽 위의 점 세 개(⋮) 메뉴를 눌러요.</li><li>'홈 화면에 추가' 또는 '앱 설치'를 눌러요.</li><li>나온 창에서 '추가'(또는 '설치')를 눌러요.</li></ol></section>
<section class="hg-note"><h3>꼭 알아두세요</h3><ul><li>아이폰은 홈 화면 아이콘으로 여는 앱의 기록이 사파리 기록과 따로 저장될 수 있어요. 홈 화면에 추가한 뒤에는 그 아이콘으로만 쓰는 걸 추천해요.</li><li>이미 쓰던 기록이 있다면 먼저 '학습 설정 → 두 과정 기록 백업'으로 저장하고, 아이콘으로 연 앱에서 '기록 불러오기'를 눌러 옮겨 주세요.</li><li>비밀번호는 한 번 입력하면 그 기기에서는 다시 묻지 않아요. 홈 화면 앱은 따로 한 번 더 입력해야 할 수 있어요.</li></ul></section>
<button type="button" class="hg-ok">확인했어요</button>`;
document.body.append(dlg);
const open=()=>{dlg.showModal();dlg.querySelector('h2').focus?.()};
dlg.querySelector('.hg-close').onclick=()=>dlg.close();dlg.querySelector('.hg-ok').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
const mkLink=()=>{const b=document.createElement('button');b.type='button';b.className='homeguide-link';b.textContent='홈 추가하는 방법';b.onclick=open;return b};
const copy=document.querySelector('#missionEntrance .journey-hero-copy');
if(copy)copy.append(mkLink());
const plan=document.getElementById('planDialog');
if(plan){const add=()=>{if(plan.querySelector('.homeguide-link'))return;const area=plan.querySelector('.backuparea');if(area)area.after(mkLink())};
new MutationObserver(add).observe(plan,{childList:true});add();}
})();
