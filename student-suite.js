(() => {
'use strict';
const $ = id => document.getElementById(id);
const KEY='nirvo-student-suite-v1';
const day=()=>new Date().toISOString().slice(0,10);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
let data=read();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{status('Storage is full. Export or remove old notes/cards.')}};
const status=t=>{const e=$('suiteStatus');if(e)e.textContent=t||''};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arena=()=>{try{const a=JSON.parse(localStorage.getItem('nirvo-sslc-arena-v1')||'[]');return Array.isArray(a)?a:[]}catch{return []}};
function renderDay(){
 const tasks=data.tasks||[];const done=tasks.filter(x=>x.done).length;
 $('suiteTaskCount').textContent=done+'/'+tasks.length;
 $('suiteTaskBar').style.width=(tasks.length?done/tasks.length*100:0)+'%';
 $('suiteTasks').innerHTML=tasks.map((t,i)=>'<label class="suite-item"><input type="checkbox" data-task="'+i+'" '+(t.done?'checked':'')+'><span>'+esc(t.text)+'</span><button type="button" data-remove-task="'+i+'" aria-label="Remove task">×</button></label>').join('')||'<p class="suite-muted">Add your first task for today.</p>';
 $('suiteTasks').querySelectorAll('[data-task]').forEach(e=>e.addEventListener('change',()=>{tasks[+e.dataset.task].done=e.checked;data.tasks=tasks;save();renderDay()}));
 $('suiteTasks').querySelectorAll('[data-remove-task]').forEach(e=>e.addEventListener('click',()=>{tasks.splice(+e.dataset.removeTask,1);data.tasks=tasks;save();renderDay()}));
}
function renderAnalytics(){
 const a=arena(),attempts=a.length,correct=a.reduce((n,x)=>n+(Number(x.score)||0),0),total=a.reduce((n,x)=>n+(Number(x.total)||0),0);
 $('suiteAttempts').textContent=attempts;$('suiteAccuracy').textContent=total?Math.round(correct/total*100)+'%':'—';
 const subjects={};a.forEach(x=>{const s=x.subject||'Other';(subjects[s]??={score:0,total:0,count:0});subjects[s].score+=Number(x.score)||0;subjects[s].total+=Number(x.total)||0;subjects[s].count++});
 $('suiteSubjectStats').innerHTML=Object.entries(subjects).sort((x,y)=>(x[1].score/x[1].total||0)-(y[1].score/y[1].total||0)).map(([s,v])=>'<div class="suite-item"><span>'+esc(s)+'</span><b>'+(v.total?Math.round(v.score/v.total*100):0)+'%</b><small>'+v.count+' attempts</small></div>').join('')||'<p class="suite-muted">Complete a Practice Arena test to see your subject analysis.</p>';
}
function renderCards(){
 const cards=data.cards||[]; $('suiteCardCount').textContent=cards.length;
 $('suiteCardList').innerHTML=cards.map((c,i)=>'<div class="suite-item"><span>'+esc(c.front)+' <small>· '+(c.due<=Date.now()?'Due':'Later')+'</small></span><button data-card="'+i+'">Review</button><button data-card-del="'+i+'">×</button></div>').join('')||'<p class="suite-muted">Create a flashcard to start your revision deck.</p>';
 $('suiteCardList').querySelectorAll('[data-card]').forEach(b=>b.addEventListener('click',()=>reviewCard(+b.dataset.card)));
 $('suiteCardList').querySelectorAll('[data-card-del]').forEach(b=>b.addEventListener('click',()=>{cards.splice(+b.dataset.cardDel,1);data.cards=cards;save();renderCards()}));
}
let currentCard=-1,flipped=false;
function reviewCard(i){currentCard=i;flipped=false;const c=data.cards[i];$('suiteFlash').textContent=c.front;$('suiteFlashActions').hidden=false;$('suiteFlip').textContent='Show answer';}
function renderNotes(filter=''){const notes=data.notes||[];$('suiteNotes').innerHTML=notes.map((n,i)=>({n,i})).filter(x=>(x.n.title+' '+x.n.body).toLowerCase().includes(filter.toLowerCase())).map(({n,i})=>'<div class="suite-item"><span><b>'+esc(n.title)+'</b><br><small>'+esc(n.body.slice(0,100))+'</small></span><button data-note-edit="'+i+'">Edit</button><button data-note-del="'+i+'">×</button></div>').join('')||'<p class="suite-muted">No notes yet. Your notes stay in this browser.</p>';
 $('suiteNotes').querySelectorAll('[data-note-edit]').forEach(b=>b.addEventListener('click',()=>{const n=notes[+b.dataset.noteEdit];$('suiteNoteTitle').value=n.title;$('suiteNoteBody').value=n.body;$('suiteNoteEdit').value=b.dataset.noteEdit;}));
 $('suiteNotes').querySelectorAll('[data-note-del]').forEach(b=>b.addEventListener('click',()=>{notes.splice(+b.dataset.noteDel,1);data.notes=notes;save();renderNotes($('suiteNoteSearch').value)}));
}
function startTimer(){let remaining=25*60,handle=null;const clock=$('suiteClock');function draw(){clock.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0')}
$('suiteTimerStart').onclick=()=>{if(handle)return;handle=setInterval(()=>{remaining--;draw();if(remaining<=0){clearInterval(handle);handle=null;data.focus=(data.focus||0)+1;save();$('suiteFocusCount').textContent=data.focus;status('Focus session complete. Take a short break.')}},1000);status('Focus session running. Keep this tab open.')};
$('suiteTimerReset').onclick=()=>{if(handle)clearInterval(handle);handle=null;remaining=25*60;draw();status('Timer reset.')};draw();$('suiteFocusCount').textContent=data.focus||0;
}
function video(){
 const cls=$('suiteVideoClass').value,board=$('suiteVideoBoard').value,sub=$('suiteVideoSubject').value;
 const q=[board,cls,sub,'lesson explanation'].join(' ');
 $('suiteVideoCaption').textContent='Suggested search: '+q+'. You can also paste a video URL below to play a specific lesson here.';
 $('suiteVideoSearch').onclick=()=>{const query=encodeURIComponent(q);$('suiteVideoFrame').src='https://www.youtube.com/embed?listType=search&list='+query;status('Loading class-based YouTube results. If YouTube does not support embedded search, paste a video URL below.');};
 $('suiteVideoLoad').onclick=()=>{const raw=$('suiteVideoUrl').value.trim();let id='';try{const u=new URL(raw);if(u.hostname.includes('youtu.be'))id=u.pathname.slice(1);else id=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop()}catch{}if(!/^[\w-]{11}$/.test(id)){status('Enter a valid YouTube video URL.');return}$('suiteVideoFrame').src='https://www.youtube-nocookie.com/embed/'+id;status('Video loaded inside NIRVO.')};
 $('suiteVideoSearch').addEventListener('click',()=>{});$('suiteVideoLoad').addEventListener('click',()=>{});
}
function init(){
 if(!$('studentSuite'))return;
 if(data.day!==day()){data.tasks=[];data.day=day();save()}
 $('suiteAddTask').onclick=()=>{const v=$('suiteTaskInput').value.trim();if(!v)return;(data.tasks??=[]).push({text:v,done:false});$('suiteTaskInput').value='';save();renderDay()};
 $('suiteCardSave').onclick=()=>{const f=$('suiteCardFront').value.trim(),b=$('suiteCardBack').value.trim();if(!f||!b)return status('Add both a question and an answer.');(data.cards??=[]).push({front:f,back:b,due:Date.now()});$('suiteCardFront').value='';$('suiteCardBack').value='';save();renderCards();status('Flashcard saved on this device.')};
 $('suiteFlip').onclick=()=>{if(currentCard<0)return;flipped=!flipped;$('suiteFlash').textContent=flipped?data.cards[currentCard].back:data.cards[currentCard].front;$('suiteFlip').textContent=flipped?'Show question':'Show answer'};
 $('suiteKnow').onclick=()=>{if(currentCard<0)return;data.cards[currentCard].due=Date.now()+86400000;currentCard=-1;$('suiteFlash').textContent='Good work. Review another card when ready.';$('suiteFlashActions').hidden=true;save();renderCards()};
 $('suiteAgain').onclick=()=>{if(currentCard<0)return;data.cards[currentCard].due=Date.now()+60000;currentCard=-1;$('suiteFlash').textContent='This card will come back soon.';$('suiteFlashActions').hidden=true;save();renderCards()};
 $('suiteNoteSave').onclick=()=>{const title=$('suiteNoteTitle').value.trim(),body=$('suiteNoteBody').value.trim();if(!title||!body)return status('Add a title and note text.');const i=$('suiteNoteEdit').value;(data.notes??=[]);if(i!=='')data.notes[+i]={title,body};else data.notes.unshift({title,body});$('suiteNoteTitle').value='';$('suiteNoteBody').value='';$('suiteNoteEdit').value='';save();renderNotes();status('Note saved locally.')};
 $('suiteNoteSearch').oninput=()=>renderNotes($('suiteNoteSearch').value);
 $('suiteNoteExport').onclick=()=>{const blob=new Blob([(data.notes||[]).map(n=>'# '+n.title+'\n'+n.body).join('\n\n---\n\n')],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nirvo-study-notes.md';a.click();URL.revokeObjectURL(a.href)};
 $('suiteTaskDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
 renderDay();renderCards();renderNotes();renderAnalytics();startTimer();video();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
