// Two-line wordmark, free-font information, and readable study controls.
$('.brand').setAttribute('aria-label','말씀을 마음에');
$('.brand').innerHTML=`<span class="malwordmark"><span class="malmark"><img src="${MASCOT}" alt=""><small></small></span><span class="malwords"><span>말씀을</span><span>마음에</span></span></span>`;
document.querySelector('meta[name="theme-color"]').content='#7857a2';
const beforeLavenderStudy=renderStudy;
renderStudy=function(){beforeLavenderStudy();if($('#cardDownload'))$('#cardDownload').textContent='일러스트 PNG 저장 ↓';$('[data-rate="again"]').textContent='다시 연습';$('[data-rate="hint"]').textContent='힌트 사용';$('[data-rate="success"]').textContent='모두 암송했어요 ✓';$('[data-mode="read"]').textContent='읽기';$('[data-mode="hint"]').textContent='힌트';$('[data-mode="recall"]').textContent='암송'};
const beforeFontPlan=openPlan;
openPlan=function(){beforeFontPlan();if(!$('#planDialog .fontlicense'))$('#planDialog').insertAdjacentHTML('beforeend','<details class="fontlicense"><summary>무료 글꼴 안내</summary><p>나눔고딕·나눔손글씨 펜은 SIL OFL 1.1로 배포된 글꼴입니다. 저작권·라이선스 원문을 함께 제공합니다.</p><a href="fonts/NanumGothic-OFL.txt" target="_blank" rel="noopener">나눔고딕 라이선스</a><a href="fonts/NanumPenScript-OFL.txt" target="_blank" rel="noopener">나눔손글씨 라이선스</a></details>')};
$('#settings').onclick=openPlan;$('.mobileSettings').onclick=openPlan;
const beforeLavenderRender=render;
render=function(){beforeLavenderRender();if(!course&&$('.coursewelcome')&&!$('.brandmeaning'))$('.coursewelcome').insertAdjacentHTML('beforeend','<p class="brandmeaning">보송한 양 친구와 함께,<br>말씀을 마음에 담아요.</p>')};
const lavenderSheet=document.createElement('link');lavenderSheet.rel='stylesheet';lavenderSheet.href='lavender.css';document.head.append(lavenderSheet);
render();
