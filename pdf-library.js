
(() => {
  const root = document.getElementById('pdfLibrary');
  if (!root) return;
  const classSelect = root.querySelector('#libraryClass');
  const mediumSelect = root.querySelector('#libraryMedium');
  const searchInput = root.querySelector('#librarySearch');
  const results = root.querySelector('#libraryResults');
  const count = root.querySelector('#libraryCount');
  const classPages = {
    '6':'https://scert.kerala.gov.in/standard-6/',
    '7':'https://scert.kerala.gov.in/standard-7/',
    '8':'https://scert.kerala.gov.in/standard-8/',
    '9':'https://scert.kerala.gov.in/standard-9/',
    '10':'https://scert.kerala.gov.in/standard-10/'
  };
  const mediumNames = {
    Malayalam:'Malayalam medium',
    English:'English medium',
    Tamil:'Tamil medium',
    Kannada:'Kannada medium'
  };
  const cards = [
    {
      key:'textbooks', kicker:'OFFICIAL TEXTBOOKS',
      title:'Complete textbooks · Class {grade}',
      description:'Open the Kerala SCERT textbook page for the selected class. Choose the {medium} section there and open the available books and parts.',
      links:[{label:'Open SCERT textbooks ↗',url:'classPage',primary:true}],
      terms:'textbook full book complete book pdf scert'
    },
    {
      key:'chapter', kicker:'CHAPTER-WISE MATERIALS',
      title:'Chapter notes, guides & handbooks',
      description:'Explore chapter-wise study materials and handbooks. Check the class, medium and textbook edition before using a file.',
      links:[
        {label:'Browse study materials ↗',url:'https://www.biovisions.in/',primary:true},
        {label:'SCERT resource materials ↗',url:'https://scert.kerala.gov.in/resource-materials/'}
      ],
      terms:'chapter notes guide handbook study material question answers'
    }
  ];
  function render(){
    const grade = classSelect.value;
    const medium = mediumSelect.value;
    const query = searchInput.value.trim().toLowerCase();
    const visible = cards.filter(card => {
      const haystack = [card.title,card.description,card.terms,grade,medium,mediumNames[medium]].join(' ').toLowerCase();
      return !query || haystack.includes(query);
    });
    count.textContent = visible.length + ' RESOURCE TYPES';
    if (!visible.length) {
      results.innerHTML = '<div class="pdf-library-empty">No matching resource category. Try “textbook”, “chapter”, “notes” or “guide”.</div>';
      return;
    }
    results.innerHTML = visible.map(card => {
      const title = card.title.replace('{grade}',grade);
      const description = card.description.replace('{grade}',grade).replace('{medium}',mediumNames[medium]);
      const links = card.links.map(link => {
        const url = link.url === 'classPage' ? classPages[grade] : link.url;
        return '<a ' + (link.primary ? 'class="primary-library-link" ' : '') + 'href="' + url + '" target="_blank" rel="noopener noreferrer">' + link.label + '</a>';
      }).join('');
      return '<article class="pdf-library-card"><span class="library-kicker">' + card.kicker + '</span><h3>' + title + '</h3><p>' + description + '</p><div class="pdf-library-actions">' + links + '</div></article>';
    }).join('');
  }
  [classSelect,mediumSelect].forEach(el => el.addEventListener('change',render));
  searchInput.addEventListener('input',render);
  render();
})();
