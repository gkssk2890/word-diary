// 과정별 묶음(대주제/세트)과 소주제 목록. 소주제 번호는 과정 전체 기준 연속 번호예요.
const COURSE_SETS={"60":[{"key":"A","course":"60","start":0,"villageName":"새로운 삶","label":"A. 새로운 삶","short":"A","topics":["중심되신 그리스도","그리스도께 순종","말씀","기도","교제","증거"]},{"key":"B","course":"60","start":6,"villageName":"그리스도를 전파함","label":"B. 그리스도를 전파함","short":"B","topics":["모든 사람이 죄를 범함","죄의 형벌","그리스도가 형벌을 받음","선행으로 구원받지 못함","그리스도를 모셔야 함","구원의 확신"]},{"key":"C","course":"60","start":12,"villageName":"하나님을 의뢰함","label":"C. 하나님을 의뢰함","short":"C","topics":["성령","능력","성실","평안","공급","유혹에서 도우심"]},{"key":"D","course":"60","start":18,"villageName":"그리스도 제자의 자격","label":"D. 그리스도 제자의 자격","short":"D","topics":["그리스도를 첫자리에 모심","죄에서 떠남","견고함","다른 사람을 섬김","후히 드릴 것","세계 비전"]},{"key":"E","course":"60","start":24,"villageName":"그리스도를 닮아 감","label":"E. 그리스도를 닮아 감","short":"E","topics":["사랑","겸손","순결","정직","믿음","선행"]}],"180":[{"key":"1A","start":0,"villageName":"하나님을 알아감","label":"1. 하나님을 알아감 / A. 예수 그리스도","short":"1-A","topics":["예수님의 신성","예수님의 인성","예수님의 부활","예수님은 하나님을 나타내심","구속자이신 예수님","예수님의 재림"]},{"key":"1B","start":6,"villageName":"하나님을 알아감","label":"1. 하나님을 알아감 / B. 성령","short":"1-B","topics":["증거하시는 성령","내주하시는 성령","통치하시는 성령","계시하시는 성령","능력을 주시는 성령","은사를 주시는 성령"]},{"key":"1C","start":12,"villageName":"하나님을 알아감","label":"1. 하나님을 알아감 / C. 하나님","short":"1-C","topics":["하나님의 능력","하나님의 지혜","하나님의 임재","하나님의 은혜","하나님의 영광","하나님의 성실","하나님은 영이심","하나님의 거룩하심","하나님의 광대하심","하나님의 사랑","하나님의 긍휼","하나님의 절대주권"]},{"key":"2A","start":24,"villageName":"사랑 안에서 자라감","label":"2. 사랑 안에서 자라감 / A. 사랑으로 말함","short":"2-A","topics":["진실을 말함","험담을 피함","은혜스럽게 말함","죄를 시인함","경청함","책망을 받아들임"]}]};
const setsOf=c=>COURSE_SETS[c||'180']||COURSE_SETS['180'];
const topicTotal=c=>setsOf(c).reduce((n,s)=>n+s.topics.length,0);
const setOfTopic=(c,n)=>setsOf(c).find(s=>n>s.start&&n<=s.start+s.topics.length)||null;
const setByKey=(c,k)=>setsOf(c).find(s=>s.key===k)||null;
const topicTitleAt=(c,n)=>{const s=setOfTopic(c,n);return s?s.topics[n-s.start-1]:''};
const topicLocal=(c,n)=>{const s=setOfTopic(c,n);return s?n-s.start:n};
const topicTag=(c,n)=>{const s=setOfTopic(c,n);return s?s.short+' · '+String(n-s.start).padStart(2,'0'):String(n)};
const allTopicTitles=c=>setsOf(c).flatMap(s=>s.topics);
const cardSetLabel=c=>{const s=setByKey(course||'180',c&&c.set);return s?s.label:''};
const hierarchyLabel=c=>{const s=setByKey(course||'180',c&&c.set);if(!s)return '';const p=s.label.split(' / ');return p.join('<br>')};
const courseSummary=c=>'카드 '+(c==='60'?(typeof A60DATA!=='undefined'?A60DATA.length:60):(typeof data180!=='undefined'&&data180?data180.length:65))+'장';
