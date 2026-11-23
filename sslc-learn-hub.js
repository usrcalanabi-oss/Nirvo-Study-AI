(()=>{
  const $=id=>document.getElementById(id);
  const subject=$('learnSubject'),language=$('learnLanguage'),level=$('learnLevel');
  const chapter=$('learnChapter'),manual=$('learnChapterName'),status=$('learnStatus');
  if(!subject||!language||!level||!chapter||!manual||!status)return;

  // SCERT Standard X subject/book titles. Do not guess chapter names.
  const subjects=[
    'Mathematics','Physics','Chemistry','Biology','Social Science I','Social Science II','ICT',
    'English Reader','Malayalam – Kerala Padavali (AT)','Malayalam – Basic Padavali (BT)',
    'Tamil Reader – Kerala Padavali (AT)','Tamil Reader – Basic Padavali (BT)',
    'Kannada Reader – Kerala Padavali (AT)','Kannada Reader – Basic Padavali (BT)',
    'Hindi Reader','Arabic Reader – Academic','Arabic Reader – Oriental','Urdu Reader',
    'Sanskrit Reader – Academic','Sanskrit Reader – Oriental'
  ];
  subjects.forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;subject.append(o)});
  const part1='https://scert.kerala.gov.in/class-x/';
  const part2='https://scert.kerala.gov.in/10thp2/';
  const details={
    'Mathematics':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'Physics':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'Chemistry':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'Biology':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'Social Science I':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'Social Science II':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'ICT':'Malayalam, English, Tamil and Kannada medium · Part 1 and Part 2',
    'English Reader':'Kerala Reader English · Part 1 and Part 2',
    'Malayalam – Kerala Padavali (AT)':'Malayalam Kerala Padavali',
    'Malayalam – Basic Padavali (BT)':'Malayalam Basic Padavali',
    'Tamil Reader – Kerala Padavali (AT)':'Tamil Kerala Padavali',
    'Tamil Reader – Basic Padavali (BT)':'Tamil Basic Padavali',
    'Kannada Reader – Kerala Padavali (AT)':'Kannada Kerala Padavali',
    'Kannada Reader – Basic Padavali (BT)':'Kannada Basic Padavali',
    'Hindi Reader':'Kerala Reader Hindi',
    'Arabic Reader – Academic':'Kerala Reader Arabic · Academic',
    'Arabic Reader – Oriental':'Kerala Reader Arabic · Oriental',
    'Urdu Reader':'Kerala Reader Urdu',
    'Sanskrit Reader – Academic':'Kerala Reader Sanskrit · Academic',
    'Sanskrit Reader – Oriental':'Kerala Reader Sanskrit · Oriental'
  };
  const chooseLevel=value=>{
    level.value=value;
    document.querySelectorAll('.sslc-level-card').forEach(b=>b.classList.toggle('active',b.dataset.level===value));
  };
  document.querySelectorAll('.sslc-level-card').forEach(b=>b.addEventListener('click',()=>chooseLevel(b.dataset.level)));
  level.addEventListener('change',()=>chooseLevel(level.value));
  subject.addEventListener('change',()=>{
    chapter.innerHTML='<option value="">Chapter list is being verified</option>';
    manual.value='';
    status.textContent=details[subject.value]+'. Enter the exact chapter heading from your textbook; NIRVO will not guess chapter names.';
  });
  $('learnOpenResources').addEventListener('click',()=>{
    window.open(part1,'_blank','noopener,noreferrer');
    status.textContent='Opened the official SCERT Kerala Standard X Part 1 textbook list. Part 2 is also published on the SCERT website. Find '+subject.value+' and confirm the edition and medium used by your school.';
  });
  $('learnMakeNotes').addEventListener('click',()=>{
    const title=manual.value.trim()||chapter.value;
    if(!title){status.textContent='Enter the exact chapter title from your current SCERT textbook first. The chapter catalogue is still being verified.';manual.focus();return}
    const lang=language.value==='മലയാളം'?'Malayalam':language.value;
    const mode=level.value==='dplus'
      ?'D+ SIMPLE REVISION: explain the chapter in easy language; define key terms; list essential facts, dates or formulas; give a short recap; include 5 simple questions with answers and a quick self-check.'
      :'A+ DETAILED PREPARATION: provide a structured explanation of all important concepts; clarify terms, events, dates and formulas; identify diagrams, maps or steps to practise; include short, medium and long exam-style questions with structured model answers; finish with a chapter checklist and recap.';
    const prompt='Create original Kerala SSLC Class 10 study notes based on the current SCERT textbook. Do not claim the notes are official SCERT notes. Do not invent textbook-specific facts, chapter details, quotations, dates or questions. If you cannot verify a detail, clearly flag it and ask the student to compare with the textbook. Keep the explanation age-appropriate and accurate.\n\n'+mode+'\nNotes language: '+lang+'\nSubject/book: '+subject.value+'\nChapter title supplied by student: '+title+'\nTextbook reference: SCERT Kerala Standard X revised textbooks, Part 1 / Part 2.';
    const input=$('chatInput'),form=$('chatForm');
    if(input&&form&&!input.disabled){
      input.value=prompt;window.nirvoNoteRequest=true;window.nirvoDownloadNextAnswer=true;form.requestSubmit();
      status.textContent='Your '+(level.value==='dplus'?'D+':'A+')+' notes request has been sent to Study AI. Check generated content against the SCERT textbook.';
      return;
    }
    status.textContent='Study AI is not connected or signed in. No notes have been generated. You can still open the official SCERT textbook lists.';
  });
  status.textContent='SCERT textbook titles and available mediums are listed. Chapter titles are not yet imported, so enter the exact title from your current book.';
})();