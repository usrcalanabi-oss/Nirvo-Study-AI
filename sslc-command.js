(() => {
'use strict';
const $=id=>document.getElementById(id), KEY='nirvo-sslc-command-v1', DB='nirvo-sslc-files-v1';
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let d={examDate:'',chapters:[],mistakes:[],daily:[],xp:0,completedDays:[],papers:[]};
try{d={...d,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch{status('Browser storage is full. Export or remove older records.')}};
const status=t=>{const e=$('scStatus');if(e)e.textContent=t};
const arena=()=>{try{const a=JSON.parse(localStorage.getItem('nirvo-sslc-arena-v1')||'[]');return Array.isArray(a)?a:[]}catch{return []}};
const addXP=n=>{d.xp=(d.xp||0)+n;save()};
function renderTop(){
 const el=$('scExamDate');el.value=d.examDate||'';
 if(d.examDate){const days=Math.ceil((new Date(d.examDate+'T23:59:59')-new Date())/86400000);$('scDays').textContent=days<0?'0':days;$('scCountdownLabel').textContent=days<0?'Date has passed':days===0?'Exam day is here':days===1?'1 day to go':'days remaining';$('scDateStatus').textContent=days<0?'Choose your next exam date.':'Countdown uses your device date.'}
 else{$('scDays').textContent='—';$('scCountdownLabel').textContent='Set your exam date to begin';$('scDateStatus').textContent='Your date is saved only on this device.'}
 const chapters=d.chapters||[],done=chapters.filter(x=>x.state==='done').length,pct=chapters.length?Math.round(done/chapters.length*100):0,a=arena(),total=a.reduce((n,x)=>n+(Number(x.total)||0),0),score=a.reduce((n,x)=>n+(Number(x.score)||0),0);
 $('scChaptersDone').textContent=pct+'%';$('scMockAttempts').textContent=a.length;$('scAccuracy').textContent=total?Math.round(score/total*100)+'%':'—';$('scSyllabusBar').style.width=pct+'%';
 $('scNextStep').textContent=chapters.length?(chapters.find(x=>x.state!=='done')?('Next: '+chapters.find(x=>x.state!=='done').subject+' · '+chapters.find(x=>x.state!=='done').name):'All listed chapters are marked complete. Keep revising!'):'Add chapters to build your preparation tracker.';
}
function renderChapters(){
 const filter=$('scChapterFilter').value,list=(d.chapters||[]).filter(x=>filter==='all'||x.state===filter),labels={pending:'Not started',learning:'Learning',revision:'Revision',done:'Completed'};
 $('scChapterCount').textContent=(d.chapters||[]).length+' chapters';
 $('scChapterList').innerHTML=list.map(x=>'<div class="sc-list-item"><div><b>'+esc(x.name)+'</b><small>'+esc(x.subject)+' · '+labels[x.state]+'</small></div><select data-state="'+x.id+'" aria-label="Chapter progress"><option value="pending" '+(x.state==='pending'?'selected':'')+'>Not started</option><option value="learning" '+(x.state==='learning'?'selected':'')+'>Learning</option><option value="revision" '+(x.state==='revision'?'selected':'')+'>Revision</option><option value="done" '+(x.state==='done'?'selected':'')+'>Completed</option></select><button type="button" data-del-chapter="'+x.id+'" aria-label="Delete chapter">×</button></div>').join('')||'<p class="suite-muted">No chapters here yet. Add your textbook chapter above.</p>';
 $('scChapterList').querySelectorAll('[data-state]').forEach(s=>s.onchange=()=>{const x=d.chapters.find(x=>x.id===s.dataset.state);if(x){if(x.state!=='done'&&s.value==='done')addXP(10);x.state=s.value;save();renderAll()}});
 $('scChapterList').querySelectorAll('[data-del-chapter]').forEach(b=>b.onclick=()=>{d.chapters=d.chapters.filter(x=>x.id!==b.dataset.delChapter);save();renderAll()});
}
function renderMistakes(){
 $('scMistakeList').innerHTML=(d.mistakes||[]).map(x=>'<div class="sc-list-item"><div><b>'+esc(x.subject)+' · '+(x.fixed?'Reviewed':'Needs review')+'</b><small>'+esc(x.question)+'<br><strong>Correction:</strong> '+esc(x.fix)+'</small></div><button data-fix="'+x.id+'" type="button">'+(x.fixed?'Undo':'Reviewed')+'</button><button data-del-mistake="'+x.id+'" type="button">×</button></div>').join('')||'<p class="suite-muted">Your saved mistakes will appear here.</p>';
 $('scMistakeList').querySelectorAll('[data-fix]').forEach(b=>b.onclick=()=>{const x=d.mistakes.find(x=>x.id===b.dataset.fix);if(x){if(!x.fixed)addXP(3);x.fixed=!x.fixed;save();renderMistakes();renderAchievements()}});
 $('scMistakeList').querySelectorAll('[data-del-mistake]').forEach(b=>b.onclick=()=>{d.mistakes=d.mistakes.filter(x=>x.id!==b.dataset.delMistake);save();renderMistakes();renderAchievements()});
}
function generatePlan(){
 const mins=Number($('scStudyMinutes').value),items=(d.chapters||[]).filter(x=>x.state!=='done');if(!items.length){$('scDailyPlan').innerHTML='<p class="suite-muted">Add unfinished chapters first. Your plan will be built from those chapters.</p>';return}
 const slots=Math.max(1,Math.floor(mins/30)),chosen=items.slice().sort((a,b)=>({pending:0,learning:1,revision:2}[a.state]-({pending:0,learning:1,revision:2}[b.state]))).slice(0,slots);
 d.daily=chosen.map((x,i)=>({id:x.id,subject:x.subject,name:x.name,minutes:Math.floor(mins/chosen.length),done:false}));save();renderDaily();
}
function renderDaily(){
 $('scDailyPlan').innerHTML=(d.daily||[]).map((x,i)=>'<label class="sc-plan-item"><input type="checkbox" data-daily="'+i+'" '+(x.done?'checked':'')+'><span><b>'+esc(x.subject)+'</b> · '+esc(x.name)+'</span><small>'+x.minutes+' min</small></label>').join('')||'<p class="suite-muted">Add chapters, then generate today's plan.</p>';
 $('scDailyPlan').querySelectorAll('[data-daily]').forEach(c=>c.onchange=()=>{const x=d.daily[+c.dataset.daily];x.done=c.checked;if(c.checked){addXP(5);if(!d.completedDays.includes(today()))d.completedDays.push(today())}save();renderDaily();renderAchievements()});
}
function renderAchievements(){
 const a=arena(),chapters=d.chapters||[],done=chapters.filter(x=>x.state==='done').length,reviewed=(d.mistakes||[]).filter(x=>x.fixed).length;
 const achievements=[['First step','Add your first chapter',chapters.length>=1],['Chapter champion','Complete 5 chapters',done>=5],['Halfway there','Complete 50% of listed chapters',chapters.length>0&&done/chapters.length>=.5],['Practice starter','Finish your first mock exam',a.length>=1],['Practice pro','Finish 5 mock exams',a.length>=5],['Learn from mistakes','Review 3 saved mistakes',reviewed>=3],['Daily focus','Complete a planned study task',d.completedDays.length>=1],['Consistent learner','Study on 5 different days',d.completedDays.length>=5]];
 $('scXP').textContent=d.xp||0;$('scAchievements').innerHTML=achievements.map(x=>'<div class="sc-badge '+(x[2]?'unlocked':'')+'"><b>'+(x[2]?'✓ ':'☆ ')+x[0]+'</b><small>'+x[1]+'</small></div>').join('');
}
function dbOpen(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('files'))r.result.createObjectStore('files',{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function dbPut(file,meta){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put({...meta,blob:file});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
async function dbAll(){const db=await dbOpen();return new Promise((resolve,reject)=>{const r=db.transaction('files').objectStore('files').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function dbDelete(id){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
async function renderPapers(){
 try{const files=await dbAll();$('scPaperList').innerHTML=files.map(x=>'<div class="sc-list-item"><div><b>'+esc(x.name)+'</b><small>'+esc(x.subject)+' · '+(x.size/1024/1024).toFixed(2)+' MB</small></div><button data-open-paper="'+x.id+'" type="button">Open</button><button data-delete-paper="'+x.id+'" type="button">×</button></div>').join('')||'<p class="suite-muted">No files saved yet.</p>';
 $('scPaperList').querySelectorAll('[data-open-paper]').forEach(b=>b.onclick=async()=>{const all=await dbAll(),f=all.find(x=>x.id===b.dataset.openPaper);if(f){const u=URL.createObjectURL(f.blob),a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.click();setTimeout(()=>URL.revokeObjectURL(u),60000)}});
 $('scPaperList').querySelectorAll('[data-delete-paper]').forEach(b=>b.onclick=async()=>{await dbDelete(b.dataset.deletePaper);renderPapers();status('File removed from this browser.')});
 }catch{$('scPaperList').innerHTML='<p class="suite-muted">This browser does not support local file storage. Try a recent browser.</p>'}
}
function renderAll(){renderTop();renderChapters();renderMistakes();renderDaily();renderAchievements()}
function init(){
 if(!$('sslcCommand'))return;
 $('scExamDate').onchange=()=>{d.examDate=$('scExamDate').value;save();renderTop()};
 $('scAddChapter').onclick=()=>{const name=$('scChapterName').value.trim();if(!name)return status('Enter a chapter name first.');d.chapters.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),subject:$('scChapterSubject').value,name,state:'pending'});$('scChapterName').value='';save();renderAll();status('Chapter added to your tracker.')};
 $('scChapterFilter').onchange=renderChapters;
 $('scSaveMistake').onclick=()=>{const question=$('scMistakeQuestion').value.trim(),fix=$('scMistakeFix').value.trim();if(!question||!fix)return status('Add both the mistake and its correction.');d.mistakes.unshift({id:String(Date.now()),subject:$('scMistakeSubject').value,question,fix,fixed:false});$('scMistakeQuestion').value='';$('scMistakeFix').value='';save();renderMistakes();renderAchievements();status('Mistake saved. Review it after your next practice session.')};
 $('scGeneratePlan').onclick=generatePlan;
 $('scSavePaper').onclick=async()=>{const input=$('scPaperFile'),f=input.files&&input.files[0];if(!f)return status('Choose a file first.');if(f.size>20*1024*1024)return status('Please choose a file smaller than 20 MB.');try{await dbPut(f,{id:String(Date.now()),name:f.name,subject:$('scPaperSubject').value,size:f.size,type:f.type,added:new Date().toISOString()});input.value='';renderPapers();status('Your file is saved in this browser only.')}catch{status('Could not save this file. Browser storage may be full or unavailable.')}};
 renderAll();renderPapers();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();