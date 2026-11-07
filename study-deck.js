// Illustration-first learning. Browsing never writes plans, ratings or home carousel state.
let studyDeckIds=[],studyDeckCourse=null,studyDeckSession=false,studyDeckJump=false,studyDeckDirection=0;
const studyImageCache=new Map();
function warmStudyNeighbors(id){const i=studyDeckIds.indexOf(id);for(const n of [i-1,i+1]){const c=cards.find(c=>c.id===studyDeckIds[n]);if(c?.image&&!studyImageCache.has(c.image)){const image=new Image();image.decoding='async';image.src=c.image;studyImageCache.set(c.image,image)}}}
function studyDeckScope(id){
  if(sessionTotal)return [id,...sessionQueue];
  const weekly=weeklyCards();
  return (tab==='today'&&weekly.some(c=>c.id===id)?weekly:cards).map(c=>c.id);
}
const beforeDeckOpenCard=openCard;
openCard=function(id){
  if(!cards.some(c=>c.id===id))return;
  const continuingSession=studyDeckSession&&sessionTotal>0&&studyDeckCourse===course&&studyDeckIds.includes(id);
  if(!studyDeckJump&&!continuingSession){studyDeckIds=studyDeckScope(id);studyDeckCourse=course;studyDeckSession=sessionTotal>0;}
  beforeDeckOpenCard(id);
  warmStudyNeighbors(id);
  const dialog=$('#study');dialog.scrollTop=0;
};
const beforeDeckSession=startSession;
startSession=function(type){studyDeckIds=[];studyDeckSession=false;studyDeckCourse=null;beforeDeckSession(type)};
function browseStudyCard(delta){
  const index=studyDeckIds.indexOf(current?.id),next=index+delta;
  if(index<0||next<0||next>=studyDeckIds.length)return;
  studyDeckDirection=delta;studyDeckJump=true;
  // Keep the existing review-session queue aligned with the card being viewed.
  if(studyDeckSession)sessionQueue=studyDeckIds.slice(next+1);
  try{openCard(studyDeckIds[next]);const button=$(delta>0?'#studyNextCard':'#studyPrev');if(button&&!button.disabled)button.focus({preventScroll:true});else $('#study').focus({preventScroll:true});}finally{studyDeckJump=false;studyDeckDirection=0;}
}
function attachStudySwipe(surface){
  let gesture=null,ignoreClick=false;
  const clear=()=>{gesture=null;surface.style.removeProperty('--swipe-x');surface.classList.remove('swiping')};
  surface.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button,a,input,select,textarea,summary'))return;
    gesture={x:e.clientX,y:e.clientY,id:e.pointerId};ignoreClick=false;
  });
  surface.addEventListener('pointermove',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>14){clear();return;}
    if(Math.abs(dx)>10){ignoreClick=true;surface.classList.add('swiping');surface.style.setProperty('--swipe-x',`${Math.max(-70,Math.min(70,dx*.3))}px`);if(e.pointerType==='mouse'&&!surface.hasPointerCapture(e.pointerId))surface.setPointerCapture(e.pointerId);}
  });
  surface.addEventListener('pointerup',e=>{
    if(!gesture||e.pointerId!==gesture.id)return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    if(surface.hasPointerCapture(e.pointerId))surface.releasePointerCapture(e.pointerId);
    clear();if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)browseStudyCard(dx<0?1:-1);
  });
  surface.addEventListener('pointercancel',clear);
  surface.addEventListener('click',e=>{if(ignoreClick){e.preventDefault();e.stopPropagation();ignoreClick=false}},true);
}
const beforeDeckStudy=renderStudy;
renderStudy=function(){
  beforeDeckStudy();
  const body=$('#studyBody'),image=body.querySelector('.cardimage');
  if(mode==='read'&&image){
    const oldDetails=image.closest('.studyillustration');
    const figure=document.createElement('figure');figure.className='studyhero';
    image.draggable=false;figure.append(image);oldDetails?.remove();body.prepend(figure);
  }
  $('#studyDeckNav')?.remove();
  const index=studyDeckIds.indexOf(current.id),total=studyDeckIds.length;
  const nav=document.createElement('div');nav.id='studyDeckNav';nav.className='studydecknav';
  nav.innerHTML=`<button id="studyPrev" class="outline" aria-label="이전 암송 카드" ${index<=0?'disabled':''}>← <span>이전</span></button><div role="status" aria-live="polite"><b>${index>=0?index+1:1} / ${total||1}</b><small>좌우로 넘겨요</small></div><button id="studyNextCard" class="outline" aria-label="다음 암송 카드" ${index<0||index>=total-1?'disabled':''}><span>다음</span> →</button>`;
  body.before(nav);$('#studyPrev').onclick=()=>browseStudyCard(-1);$('#studyNextCard').onclick=()=>browseStudyCard(1);
  body.classList.remove('card-enter-next','card-enter-prev');
  if(studyDeckDirection){void body.offsetWidth;body.classList.add(studyDeckDirection>0?'card-enter-next':'card-enter-prev');}
  // One handler set per render; replacing the body content cannot accumulate gestures.
  const surface=document.createElement('div');surface.className='studyswipesurface';
  while(body.firstChild)surface.append(body.firstChild);body.append(surface);attachStudySwipe(surface);
};
$('#study').addEventListener('keydown',e=>{
  if(e.target.closest('input,select,textarea')||e.altKey||e.ctrlKey||e.metaKey)return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();browseStudyCard(e.key==='ArrowLeft'?-1:1)}
});
$('#study').addEventListener('close',()=>{if(!sessionTotal){studyDeckIds=[];studyDeckSession=false;studyDeckCourse=null;}});
const deckSheet=document.createElement('link');deckSheet.rel='stylesheet';deckSheet.href='study-deck.css';document.head.append(deckSheet);
