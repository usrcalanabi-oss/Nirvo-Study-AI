(() => {
const subjects = [
 {id:'math',name:'Mathematics',icon:'∑',url:'https://www.biovisions.in/p/sslc-mathematics.html',desc:'Chapter-wise notes, worked examples, question-and-answer practice and A+ revision.'},
 {id:'physics',name:'Physics',icon:'ϟ',url:'https://www.biovisions.in/p/sslc-physics.html',desc:'Chapter-wise concepts, formulas, diagrams, notes and exam questions.'},
 {id:'chem',name:'Chemistry',icon:'⚗',url:'https://www.biovisions.in/p/sslc-chemistry.html',desc:'Chapter-wise notes, equations, question banks and A+ practice.'},
 {id:'bio',name:'Biology',icon:'⌘',url:'https://www.biovisions.in/p/sslc-biology.html',desc:'Chapter-wise study materials, diagrams, mind maps and question answers.'},
 {id:'ss1',name:'Social Science I',icon:'◎',url:'https://www.biovisions.in/p/standard-10.html',desc:'History and related lesson-wise resources from the complete SSLC collection.'},
 {id:'ss2',name:'Social Science II',icon:'◈',url:'https://www.biovisions.in/p/standard-10.html',desc:'Geography, civics and economics resources from the complete SSLC collection.'},
 {id:'eng',name:'English',icon:'A',url:'https://www.biovisions.in/p/sslc-english.html',desc:'Lesson-wise materials, question answers and language practice.'},
 {id:'ml1',name:'Malayalam I',icon:'അ',url:'https://www.biovisions.in/p/sslc-malayalam.html',desc:'Lesson-wise Malayalam I study materials and revision.'},
 {id:'ml2',name:'Malayalam II',icon:'അ',url:'https://www.biovisions.in/p/sslc-malayalam-ii.html',desc:'Lesson-wise Malayalam II study materials and revision.'},
 {id:'hindi',name:'Hindi',icon:'अ',url:'https://www.biovisions.in/p/sslc-hindi.html',desc:'Lesson-wise Hindi notes, question answers and grammar practice.'},
 {id:'ict',name:'ICT',icon:'⌘',url:'https://www.biovisions.in/p/standard-10.html',desc:'ICT theory, practical learning and SSLC IT practice resources.'}
];
const types = [
 {title:'Lesson-wise notes',sub:'Chapter explanations and study notes',icon:'▤',tag:'NOTES'},
 {title:'Question & answers',sub:'Important questions with answer sets',icon:'Q',tag:'Q&A'},
 {title:'Sure A+ module',sub:'Higher-mark revision and exam-focused practice',icon:'✦',tag:'A+ MODULE'},
 {title:'D+ revision notes',sub:'Simple revision support and key points',icon:'↗',tag:'D+ NOTES'},
 {title:'Mind maps & summaries',sub:'Quick visual revision for each lesson',icon:'⌘',tag:'MIND MAPS'},
 {title:'Chapter practice tests',sub:'Test your understanding lesson by lesson',icon:'✓',tag:'PRACTICE TESTS'}
];
const exams=[
 {title:'SSLC all-subject resources',sub:'Browse the complete Class 10 resource collection',url:'https://www.biovisions.in/p/standard-10.html'},
 {title:'D+ Module · all subjects',sub:'Revision support across subjects',url:'https://www.biovisions.in/p/standard-10.html'},
 {title:'Sample question papers',sub:'Practice with model question papers',url:'https://www.biovisions.in/p/standard-10.html'},
 {title:'Previous-year question bank',sub:'Past examination papers and answer keys',url:'https://www.biovisions.in/p/standard-10.html'},
 {title:'SSLC exam practice',sub:'Mock tests and online quiz collections',url:'https://www.biovisions.in/p/quiz.html'}
];
const tabs=document.getElementById('sslcSubjectTabs'),grid=document.getElementById('sslcResourceGrid'),search=document.getElementById('sslcResourceSearch');
if(!tabs||!grid)return;
let active='math';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function drawTabs(){
 const q=(search.value||'').toLowerCase();
 tabs.innerHTML=subjects.filter(s=>s.name.toLowerCase().includes(q)).map(s=>'<button type="button" role="tab" aria-selected="'+(s.id===active)+'" class="sslc-subject-tab '+(s.id===active?'active':'')+'" data-subject="'+s.id+'"><span>'+s.icon+'</span>'+esc(s.name)+'</button>').join('');
 tabs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.subject;draw()}));
}
function drawResources(){
 const subject=subjects.find(s=>s.id===active)||subjects[0];
 document.getElementById('sslcSelectedTitle').textContent=subject.name;
 document.getElementById('sslcSelectedDescription').textContent=subject.desc;
 const source=document.getElementById('sslcSubjectSource');source.href=subject.url;source.textContent='Open '+subject.name+' resources ↗';
 const q=(search.value||'').toLowerCase();
 const subjectTypes=types.map(t=>({...t,url:subject.url}));
 if(subject.id==='ss1'||subject.id==='ss2'){
  subjectTypes.push({title:'Easy D+ Module · English Medium',sub:'Simplified, exam-focused key ideas from Social Science I & II · all chapters',icon:'D+',tag:'EASY D+ · EM',url:'https://www.biovisions.in/2026/02/sslc-social-science-i-ii-easy-d-module.html'});
  subjectTypes.push({title:'Easy D+ Module · Malayalam Medium',sub:'ലളിതമായ പരീക്ഷാ റിവിഷൻ · സോഷ്യൽ സയൻസ് I & II എല്ലാ പാഠഭാഗങ്ങളും',icon:'D+',tag:'EASY D+ · MM',url:'https://www.biovisions.in/2026/01/sslc-social-science-i-ii-easy-d-module.html'});
  subjectTypes.push({title:'Chapter-wise study materials',sub:'Open Social Science '+(subject.id==='ss1'?'I':'II')+' chapter resources and lesson materials',icon:'▤',tag:'CHAPTERWISE',url:subject.id==='ss1'?'https://www.biovisions.in/2026/02/sslc-social-science-i-examination-2026.html':'https://www.biovisions.in/2026/02/sslc-social-science-ii-examination-2026.html'});
 }
 const visible=subjectTypes.filter(t=>(t.title+' '+t.sub+' '+t.tag+' '+subject.name).toLowerCase().includes(q));
 grid.innerHTML=visible.map(t=>'<article class="sslc-resource-card"><div class="sslc-resource-icon">'+t.icon+'</div><div><span>'+t.tag+'</span><h4>'+t.title+'</h4><p>'+t.sub+'</p></div><a href="'+t.url+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+t.title+' for '+subject.name+'">Open ↗</a></article>').join('')||'<p class="sslc-no-results">No matching resource category. Try another search.</p>';
}
function draw(){drawTabs();drawResources()}
document.getElementById('sslcExamResourceLinks').innerHTML=exams.map(e=>'<a href="'+e.url+'" target="_blank" rel="noopener noreferrer"><span><b>'+esc(e.title)+'</b><small>'+esc(e.sub)+'</small></span><i>↗</i></a>').join('');
search.addEventListener('input',draw);
draw();
})();
