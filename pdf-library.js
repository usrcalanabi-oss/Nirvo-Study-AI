
(() => {
  const root = document.getElementById('pdfLibrary');
  if (!root) return;
  const classSelect=root.querySelector('#libraryClass');
  const mediumSelect=root.querySelector('#libraryMedium');
  const subjectSelect=root.querySelector('#librarySubject');
  const searchInput=root.querySelector('#librarySearch');
  const results=root.querySelector('#libraryResults');
  const count=root.querySelector('#libraryCount');
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
  function esc(value){
    return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function refreshSubjects(){
    const list=subjects[classSelect.value];
    subjectSelect.innerHTML='<option value="all">All subjects</option>'+list.map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('');
    render();
  }
  function render(){
    const grade=classSelect.value, medium=mediumSelect.value;
    const chosen=subjectSelect.value, query=searchInput.value.trim().toLowerCase();
    const available=subjects[grade].filter(s=>chosen==='all'||s===chosen);
    const matches=available.filter(s=>(s+' '+grade+' '+medium+' '+mediumNames[medium]).toLowerCase().includes(query));
    count.textContent=matches.length+' SUBJECTS';
    if(!matches.length){
      results.innerHTML='<div class="pdf-library-empty">No matching subject. Try a different subject name or clear your search.</div>';
      return;
    }
    results.innerHTML=matches.map((subject,index)=>(
      '<article class="pdf-library-card">'+
        '<span class="library-kicker">CLASS '+grade+' · '+esc(medium.toUpperCase())+' MEDIUM</span>'+
        '<h3>'+esc(subject)+'</h3>'+
        '<p>Open the source page and select '+esc(mediumNames[medium])+'. Check the title and edition before downloading.</p>'+
        '<div class="pdf-library-actions">'+
          '<a class="primary-library-link" href="'+classPages[grade]+'" target="_blank" rel="noopener noreferrer">Full textbook PDFs ↗</a>'+
          '<a href="'+chapterPages[grade]+'" target="_blank" rel="noopener noreferrer">Chapter notes & guides ↗</a>'+
        '</div>'+
      '</article>'
    )).join('');
  }
  classSelect.addEventListener('change',refreshSubjects);
  mediumSelect.addEventListener('change',render);
  subjectSelect.addEventListener('change',render);
  searchInput.addEventListener('input',render);
  refreshSubjects();
})();
