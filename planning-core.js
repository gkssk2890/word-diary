(function(root){
  const day=86400000;
  const date=s=>new Date(s+'T12:00:00Z');
  function shift(s,n){return new Date(date(s).getTime()+n*day).toISOString().slice(0,10)}
  function mondayOf(s){const d=date(s);return shift(s,-((d.getUTCDay()+6)%7))}
  function weekAt(plan,today){return plan.anchorWeek+Math.floor((date(today)-date(plan.anchorDate))/(7*day))}
  function weekRange(plan,week){const count=plan.weeklyCount||2;const start=plan.anchorTopic+count*(week-plan.anchorWeek);const dateStart=shift(plan.anchorDate,7*(week-plan.anchorWeek));return {week,start,end:start+count-1,dateStart,dateEnd:shift(dateStart,6)}}
  function cumulative(plan,week,total){const r=weekRange(plan,week);return {start:1,end:Math.min(total,r.end)}}
  const api={shift,mondayOf,weekAt,weekRange,cumulative};root.MemoryPlan=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
