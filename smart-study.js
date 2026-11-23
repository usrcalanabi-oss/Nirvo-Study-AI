(() => {
const $=id=>document.getElementById(id), key='nirvo-smart-study-v1';
const map={
'Class 6':['Mathematics','Basic Science','Social Science','English','Malayalam I','Malayalam II','Hindi','ICT','Arabic','Tamil','Kannada'],
'Class 7':['Mathematics','Basic Science','Social Science','English','Malayalam I','Malayalam II','Hindi','ICT','Arabic','Tamil','Kannada'],
'Class 8':['Mathematics','Physics','Chemistry','Biology','Social Science','English','Malayalam I','Malayalam II','Hindi','ICT','Arabic','Tamil','Kannada'],
'Class 9':['Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','English','Malayalam I','Malayalam II','Hindi','ICT','Arabic','Tamil','Kannada'],
'Class 10':['Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','English','Malayalam I','Malayalam II','Hindi','ICT','Arabic','Tamil','Kannada']};
const science=['Basic Science','Physics','Chemistry','Biology'],days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
let data={marks:[],reviews:[],tasks:{},plan:null};try{data={...data,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch{}};
const min=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
const fmt=n=>{n=(n%1440+1440)%1440;let h=Math.floor(n/60);return (h%12||12)+':'+String(n%60).padStart(2,'0')+(h<12?' AM':' PM')};
let subjects=[];
function renderMarks(){
$('marksTable').innerHTML=data.marks.length?'<table><thead><tr><th>Subject</th><th>Marks</th><th>Percent</th><th>Focus</th></tr></thead><tbody>'+data.marks.slice().reverse().map(m=>'<tr><td>'+esc(m.subject)+'</td><td>'+m.got+'/'+m.max+'</td><td>'+Math.round(m.got/m.max*100)+'%</td><td>'+(m.got/m.max<.5?'High':m.got/m.max<.7?'Medium':'Normal')+'</td></tr>').join('')+'</tbody></table>':'<p class="smart-help">Saved marks appear here.</p>';
$('smartProgressSummary').textContent=data.marks.length?'Marks saved. Lower-scoring subjects receive more revision sessions in your next plan.':'Add marks to prioritize subjects that need more practice.';
}
function renderSubjects(){
subjects=map[$('smartClass').value]||map['Class 10'];
$('smartSubjects').innerHTML=subjects.map(s=>'<button type="button" class="smart-subject-chip" data-sub="'+esc(s)+'" aria-pressed="false">'+esc(s)+'</button>').join('');
$('smartSubjects').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const v=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(v));b.classList.toggle('selected',v)}));
const opts=subjects.map(s=>'<option>'+esc(s)+'</option>').join('');
$('markSubject').innerHTML=opts;$('answerSubject').innerHTML=opts;
const sci=subjects.filter(s=>science.includes(s)).map(s=>'<option>'+esc(s)+'</option>').join('');
['scienceFocusOne','scienceFocusTwo'].forEach(id=>$(id).innerHTML='<option value="">No extra focus</option>'+sci);
renderMarks();
}
function createPlan(){
const chosen=[...$('smartSubjects').querySelectorAll('[aria-pressed="true"]')].map(b=>b.dataset.sub);
if(!chosen.length){alert('Select at least one subject.');return}
let diagnostic=null;try{diagnostic=JSON.parse(localStorage.getItem('nirvo-last-quiz')||'null')}catch{}
if(!diagnostic||diagnostic.grade!==$('smartClass').value||!chosen.includes(diagnostic.subject)){
alert('Complete one five-question practice quiz for this class and one selected subject first. Your quiz result will help NIRVO start your study plan.');$('quiz').scrollIntoView({behavior:'smooth',block:'start'});return;
}
const focusOne=$('scienceFocusOne').value,focusTwo=$('scienceFocusTwo').value;
if(focusOne&&focusTwo&&focusOne===focusTwo){alert('Choose two different science subjects.');return}if(focusOne&&!chosen.includes(focusOne))chosen.push(focusOne);if(focusTwo&&!chosen.includes(focusTwo))chosen.push(focusTwo);
const daily=Number($('smartHours').value),start=min($('smartSchoolEnd').value)+35,end=min($('smartBed').value)-35;
if(end<=start){alert('Adjust school finish and bedtime to create an evening study window.');return}
const topics={};chosen.forEach(s=>topics[s]=[]);
$('smartTopics').value.split('\n').map(x=>x.trim()).filter(Boolean).forEach(line=>{
const m=line.match(/^(.+?)\s*[—:–-]\s*(.+)$/);
const subject=m&&chosen.find(s=>s.toLowerCase()===m[1].trim().toLowerCase());
if(subject)topics[subject].push(m[2].trim());else topics[chosen[0]].push(line);
});
chosen.forEach(s=>{if(!topics[s].length)topics[s]=['Revise key concepts','Complete textbook exercises']});
const scores={};data.marks.forEach(m=>scores[m.subject]=m.got/m.max);
const priority=chosen.slice().sort((a,b)=>((scores[a]??.75)-(focusOne===a||focusTwo===a?.2:0))-((scores[b]??.75)-(focusOne===b||focusTwo===b?.2:0))),idx={};chosen.forEach(s=>idx[s]=0);
const count=Number($('smartDays').value),week=days.slice(0,count).map((day,d)=>{
let clock=start,remaining=daily,tasks=[];
for(let slot=0;slot<Math.min(3,Math.ceil(daily/40))&&remaining>=25;slot++){
const subject=priority[(d+slot)%priority.length],topic=topics[subject][idx[subject]++%topics[subject].length];
const base=subject==='Mathematics'?45:science.includes(subject)?40:['English','Malayalam I','Malayalam II','Hindi','Arabic','Tamil','Kannada'].includes(subject)?30:35;
const duration=Math.min(base+Math.min(15,Math.floor(topic.length/55)*5),remaining,end-clock);
if(duration<25)break;
tasks.push({id:day+'-'+slot+'-'+subject,subject,topic,minutes:duration,from:fmt(clock),to:fmt(clock+duration)});
clock+=duration+10;remaining-=duration;
}
return {day,tasks};
});
data.plan={grade:$('smartClass').value,board:$('smartBoard').value,language:$('smartLanguage').value,subjects:chosen,daily,week,diagnostic:{subject:diagnostic.subject,score:diagnostic.score,total:diagnostic.total}};
data.tasks={};save();renderPlan();
}
function renderPlan(){
if(!data.plan)return;
let total=0,done=0;
$('smartPlanOutput').innerHTML='<div class="smart-progress-summary">'+esc(data.plan.grade)+' · '+esc(data.plan.board)+' · '+esc(data.plan.language)+' · '+data.plan.daily+' minutes/day</div>'+data.plan.week.map(d=>'<div class="smart-week-day"><h4>'+d.day+'</h4>'+(d.tasks.length?d.tasks.map(t=>{total++;const yes=!!data.tasks[t.id];if(yes)done++;return '<label class="smart-task '+(yes?'done':'')+'"><input type="checkbox" data-task="'+esc(t.id)+'" '+(yes?'checked':'')+'><time>'+t.from+'</time><span><b>'+esc(t.subject)+' · '+esc(t.topic)+'</b><small>'+t.minutes+' minutes · finish '+t.to+'</small></span></label>'}).join(''):'<small class="smart-help">Rest / flexible catch-up day</small>')+'</div>').join('');
$('smartProgressSummary').textContent='Weekly progress: '+done+'/'+total+' sessions completed ('+(total?Math.round(done/total*100):0)+'%). Mark each task when finished.';
$('smartPlanOutput').querySelectorAll('[data-task]').forEach(c=>c.addEventListener('change',()=>{data.tasks[c.dataset.task]=c.checked;save();renderPlan()}));
$('downloadSmartPlan').disabled=false;
}
$('smartClass').addEventListener('change',()=>{renderSubjects();const q=$('quizClass');if(q&&[...q.options].some(o=>o.value===$('smartClass').value)){q.value=$('smartClass').value;q.dispatchEvent(new Event('change'))}});$('smartBoard').addEventListener('change',()=>{const b=$('quizBoard');if(b&&[...b.options].some(o=>o.value===$('smartBoard').value)){b.value=$('smartBoard').value;b.dispatchEvent(new Event('change'))}});
$('buildSmartPlan').addEventListener('click',createPlan);
$('downloadSmartPlan').addEventListener('click',()=>{
if(!data.plan)return;const p=data.plan,lines=['NIRVO SMART STUDY PLAN',p.grade+' · '+p.board+' · '+p.language,'Subjects: '+p.subjects.join(', '),'','WEEKLY TIMETABLE',...p.week.flatMap(d=>['',d.day,...d.tasks.map(t=>t.from+'–'+t.to+' | '+t.subject+' | '+t.topic+' | '+t.minutes+' min')])];
const a=document.createElement('a'),u=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));a.href=u;a.download='nirvo-weekly-study-plan.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
});
function preview(input,target){$(input).addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/'))return alert('Choose an image file.');const u=URL.createObjectURL(f);$(target).innerHTML='<img src="'+u+'" alt="Uploaded photo preview"><small class="smart-help">Private local preview only. Marks are not automatically read from this image.</small>'})}
preview('progressPhoto','progressPhotoPreview');preview('answerPhoto','answerPhotoPreview');
$('saveMark').addEventListener('click',()=>{
const got=Number($('markObtained').value),max=Number($('markMaximum').value);
if(!Number.isFinite(got)||!Number.isFinite(max)||max<=0||got<0||got>max)return alert('Enter valid marks.');
data.marks.push({subject:$('markSubject').value,exam:$('markExam').value||'Assessment',got,max});save();renderMarks();alert('Marks saved. Rebuild your plan to prioritize weak subjects.');
});
$('saveAnswerReview').addEventListener('click',()=>{
const got=Number($('answerObtained').value),max=Number($('answerMaximum').value);
if(!Number.isFinite(got)||!Number.isFinite(max)||max<=0||got<0||got>max)return alert('Enter valid teacher-awarded marks.');
const r={subject:$('answerSubject').value,topic:$('answerTopic').value,got,max,mistakes:$('answerMistakes').value};data.reviews.push(r);data.marks.push({subject:r.subject,exam:'Answer paper',got,max});save();renderMarks();
$('answerReviewResult').textContent='Saved '+got+'/'+max+' ('+Math.round(got/max*100)+'%). Revision target: '+(r.mistakes||r.topic||'Review missed questions')+'. The next plan will prioritize this subject.';
});
async function search(){
const q=$('smartWebQuery').value.trim();if(!q)return;
$('smartWebResults').innerHTML='<p class="smart-help">Searching online without AI…</p>';$('smartWebSearch').disabled=true;
try{
const url='https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&prop=extracts&exintro=1&explaintext=1&format=json&origin=*&gsrlimit=6';
const r=await fetch(url);if(!r.ok)throw Error('Search service unavailable');const j=await r.json(),pages=Object.values(j.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
$('smartWebResults').innerHTML=pages.length?pages.map(p=>'<article class="smart-web-result"><b>'+esc(p.title)+'</b><p>'+esc((p.extract||'No summary available.').slice(0,500))+'</p><small>Wikipedia general reference · verify with your textbook</small></article>').join(''):'<p class="smart-help">No results. Try another keyword.</p>';
}catch(e){$('smartWebResults').textContent='Online search unavailable right now. Your timetable and progress tracker still work offline.'}
$('smartWebSearch').disabled=false;
}
$('smartWebSearch').addEventListener('click',search);$('smartWebQuery').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();search()}});
renderSubjects();if(data.plan)renderPlan();
try{const p=JSON.parse(localStorage.getItem('nirvo-profile')||'null');if(p?.cls&&map[p.cls]){$('smartClass').value=p.cls;$('smartBoard').value=p.board||'Kerala State';renderSubjects();}}catch{}
})();