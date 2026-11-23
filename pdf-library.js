(() => {
  const root = document.getElementById('pdfLibrary');
  if (!root) return;
  const home=root.querySelector('#libraryClassHome');
  const page=root.querySelector('#libraryClassPage');
  const gradeTitle=root.querySelector('#libraryGradeTitle');
  const mediumSelect=root.querySelector('#libraryMedium');
  const subjectSelect=root.querySelector('#librarySubject');
  const searchInput=root.querySelector('#librarySearch');
  const results=root.querySelector('#libraryResults');
  const count=root.querySelector('#libraryCount');
  const viewer=root.querySelector('#libraryEmbeddedResources');
  const frame=root.querySelector('#libraryResourceFrame');
  const embedTitle=root.querySelector('#libraryEmbedTitle');
  let activeGrade='10';
  const classPages={
    '6':'https://scert.kerala.gov.in/standard-6/',
    '7':'https://scert.kerala.gov.in/standard-7/',
    '8':'https://scert.kerala.gov.in/standard-8/',
    '9':'https://scert.kerala.gov.in/standard-9/1000/',
    '10':'https://scert.kerala.gov.in/standard-10/1000/'
  };
  const chapterPages={
    '6':'https://www.biovisions.in/p/standard-6.html',
    '7':'https://www.biovisions.in/p/standard-7.html',
    '8':'https://www.biovisions.in/p/standard-8.html',
    '9':'https://www.biovisions.in/p/standard-9.html',
    '10':'https://www.biovisions.in/p/standard-10.html'
  };
  const subjects={
    '6':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Basic Science','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '7':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Basic Science','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '8':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '9':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','ICT','Tamil Reader','Kannada Reader'],
    '10':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','ICT','Tamil Reader','Kannada Reader']
  };
  const mediumNames={Malayalam:'Malayalam medium',English:'English medium',Tamil:'Tamil medium',Kannada:'Kannada medium'};
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function openClass(grade){
    activeGrade=grade;
    home.hidden=true; page.hidden=false;
    gradeTitle.textContent='Class '+grade;
    count.textContent=subjects[grade].length+' SUBJECTS';
    subjectSelect.innerHTML='<option value="all">All subjects</option>'+subjects[grade].map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('');
    searchInput.value='';
    viewer.hidden=true;
    render();
    page.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showSource(source){
    const isBio=source==='bio';
    embedTitle.textContent=isBio?'BioVision · Class '+activeGrade+' resources':'SCERT · Class '+activeGrade+' textbooks';
    frame.src=isBio?chapterPages[activeGrade]:classPages[activeGrade];
    viewer.hidden=false;
    viewer.scrollIntoView({behavior:'smooth',block:'start'});
    root.querySelectorAll('.library-embed-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.source===source));
  }
  function render(){
    const medium=mediumSelect.value, chosen=subjectSelect.value, query=searchInput.value.trim().toLowerCase();
    const matches=subjects[activeGrade].filter(s=>(chosen==='all'||s===chosen)&&(!query||(s+' '+activeGrade+' '+medium+' '+mediumNames[medium]).toLowerCase().includes(query)));
    count.textContent=matches.length+' SUBJECTS';
    if(!matches.length){results.innerHTML='<div class="pdf-library-empty">No matching subject. Try another search.</div>';return;}
    results.innerHTML=matches.map(subject=>'<article class="pdf-library-card"><span class="library-kicker">CLASS '+activeGrade+' · '+esc(medium.toUpperCase())+' MEDIUM</span><h3>'+esc(subject)+'</h3><p>Browse '+esc(subject)+' resources for '+esc(mediumNames[medium])+'. Check the language and current textbook edition in the resource viewer.</p><div class="pdf-library-actions"><button type="button" data-open-source="bio">BioVision notes & chapters ↗</button><button type="button" data-open-source="scert">SCERT textbooks ↗</button></div></article>').join('');
  }
  home.addEventListener('click',e=>{const tile=e.target.closest('[data-grade]');if(tile)openClass(tile.dataset.grade);});
  root.querySelector('#libraryBack').addEventListener('click',()=>{page.hidden=true;home.hidden=false;viewer.hidden=true;frame.src='about:blank';count.textContent='5 CLASSES';home.scrollIntoView({behavior:'smooth',block:'start'});});
  root.querySelector('#libraryCloseEmbed').addEventListener('click',()=>{viewer.hidden=true;frame.src='about:blank';});
  results.addEventListener('click',e=>{const btn=e.target.closest('[data-open-source]');if(btn)showSource(btn.dataset.openSource);});
  root.querySelectorAll('.library-embed-tabs button').forEach(btn=>btn.addEventListener('click',()=>showSource(btn.dataset.source)));
  mediumSelect.addEventListener('change',render);
  subjectSelect.addEventListener('change',render);
  searchInput.addEventListener('input',render);
})();