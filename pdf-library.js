(() => {
  const root=document.getElementById('pdfLibrary');
  if(!root)return;
  const home=root.querySelector('#libraryClassHome');
  const page=root.querySelector('#libraryClassPage');
  const gradeTitle=root.querySelector('#libraryGradeTitle');
  const mediumSelect=root.querySelector('#libraryMedium');
  const subjectSelect=root.querySelector('#librarySubject');
  const searchInput=root.querySelector('#librarySearch');
  const results=root.querySelector('#libraryResults');
  const count=root.querySelector('#libraryCount');
  const viewer=root.querySelector('#libraryEmbeddedResources');
  const subjects={
    '6':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Basic Science','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '7':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Basic Science','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '8':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science','ICT','Tamil Reader','Kannada Reader'],
    '9':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','ICT','Tamil Reader','Kannada Reader'],
    '10':['Malayalam I','Malayalam II','English','Hindi','Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','ICT','Tamil Reader','Kannada Reader']
  };
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let activeGrade='10',activeSubject='',activeResource='notes';
  // Only resources physically published in this NIRVO project are listed here.
  // Add approved, locally hosted files/content to this manifest as they are prepared.
  const localResources={};
  viewer.innerHTML=`
    <div class="library-embed-head"><div><span class="eyebrow">NIRVO STUDY SPACE</span><h4 id="libraryEmbedTitle">Study resources</h4><p>Everything in this reader is served from NIRVO. No external website is opened.</p></div><button type="button" id="libraryCloseEmbed" class="library-back">Close ✕</button></div>
    <div class="library-embed-tabs" role="tablist" aria-label="NIRVO study resource type">
      <button type="button" data-kind="notes" class="active" role="tab" aria-selected="true">NIRVO Notes</button>
      <button type="button" data-kind="textbook" role="tab" aria-selected="false">Textbook PDFs</button>
      <button type="button" data-kind="practice" role="tab" aria-selected="false">Practice</button>
    </div>
    <div id="nirvoLocalResourceContent" class="nirvo-local-resource-content" aria-live="polite"></div>`;
  const content=viewer.querySelector('#nirvoLocalResourceContent');
  function openClass(grade){
    activeGrade=grade;home.hidden=true;page.hidden=false;gradeTitle.textContent='Class '+grade;
    count.textContent=subjects[grade].length+' SUBJECTS';
    subjectSelect.innerHTML='<option value="all">All subjects</option>'+subjects[grade].map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('');
    searchInput.value='';viewer.hidden=true;render();
    page.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showResource(subject,kind='notes'){
    activeSubject=subject;activeResource=kind;
    viewer.querySelector('#libraryEmbedTitle').textContent=subject+' · Class '+activeGrade;
    viewer.querySelectorAll('[data-kind]').forEach(b=>{const on=b.dataset.kind===kind;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});
    const key=[activeGrade,mediumSelect.value,subject,kind].join('|');
    const item=localResources[key];
    if(item){
      if(item.type==='html')content.innerHTML='<article class="nirvo-resource-article">'+item.content+'</article>';
      else if(item.type==='pdf')content.innerHTML='<div class="nirvo-pdf-viewer"><iframe title="'+esc(subject)+' study PDF" src="'+esc(item.path)+'"></iframe><a class="nirvo-local-download" href="'+esc(item.path)+'" download>Download this NIRVO PDF ↓</a></div>';
    }else{
      const labels={notes:'NIRVO chapter notes',textbook:'Textbook PDF',practice:'Practice questions'};
      content.innerHTML='<div class="nirvo-resource-empty"><span class="library-kicker">NIRVO CLASS '+activeGrade+' · '+esc(mediumSelect.value.toUpperCase())+' MEDIUM</span><h5>'+esc(labels[kind])+' are being prepared</h5><p><b>'+esc(subject)+'</b> resources will appear here when the verified, permitted material is added to NIRVO. This page will not redirect you to another website.</p><span class="nirvo-resource-status">INTERNAL NIRVO LIBRARY · NO EXTERNAL REDIRECTS</span></div>';
    }
    viewer.hidden=false;viewer.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function render(){
    const medium=mediumSelect.value,chosen=subjectSelect.value,q=searchInput.value.trim().toLowerCase();
    const matches=subjects[activeGrade].filter(s=>(chosen==='all'||s===chosen)&&(!q||(s+' '+activeGrade+' '+medium).toLowerCase().includes(q)));
    count.textContent=matches.length+' SUBJECTS';
    results.innerHTML=matches.length?matches.map(subject=>'<article class="pdf-library-card"><span class="library-kicker">CLASS '+activeGrade+' · '+esc(medium.toUpperCase())+' MEDIUM</span><h3>'+esc(subject)+'</h3><p>Open NIRVO-hosted notes, textbook PDFs and practice material. All resource views stay inside this website.</p><div class="pdf-library-actions"><button type="button" data-subject="'+esc(subject)+'" data-kind="notes">NIRVO Notes</button><button type="button" data-subject="'+esc(subject)+'" data-kind="textbook">Textbook PDFs</button><button type="button" data-subject="'+esc(subject)+'" data-kind="practice">Practice</button></div></article>').join(''):'<div class="pdf-library-empty">No matching subject. Try another search.</div>';
  }
  home.addEventListener('click',e=>{const tile=e.target.closest('[data-grade]');if(tile)openClass(tile.dataset.grade);});
  root.querySelector('#libraryBack').addEventListener('click',()=>{page.hidden=true;home.hidden=false;viewer.hidden=true;count.textContent='5 CLASSES';home.scrollIntoView({behavior:'smooth',block:'start'});});
  root.querySelector('#libraryCloseEmbed').addEventListener('click',()=>{viewer.hidden=true;});
  results.addEventListener('click',e=>{const b=e.target.closest('[data-subject][data-kind]');if(b)showResource(b.dataset.subject,b.dataset.kind);});
  viewer.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>showResource(activeSubject,b.dataset.kind)));
  mediumSelect.addEventListener('change',()=>{render();if(!viewer.hidden)showResource(activeSubject,activeResource);});
  subjectSelect.addEventListener('change',render);searchInput.addEventListener('input',render);
})();