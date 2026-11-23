/* NIRVO app shell: compact, animated workspace navigation */
(() => {
  const start = () => {
    const main = document.querySelector('main#overview');
    const header = document.querySelector('.topbar');
    if (!main || !header || document.querySelector('.nirvo-app-nav')) return;

    const groups = [
      { id:'home', label:'Home', icon:'⌂', selectors:['.welcome','.service-notice','.metrics','.hero-grid','#aboutNirvo'] },
      { id:'planner', label:'Exam planner', icon:'▦', selectors:['.workspace-grid'] },
      { id:'smart', label:'Smart plan', icon:'◷', selectors:['#smartStudy'] },
      { id:'learn', label:'SSLC Library', icon:'▤', selectors:['#sslcLearnHub','#sslcModule','#pdfLibrary'] },
      { id:'practice', label:'Practice', icon:'◎', selectors:['#sslcArena','#quiz','#recallLab'] },
      { id:'life', label:'Student life', icon:'✦', selectors:['#lifeHub'] },
      { id:'ai', label:'Study AI', icon:'✳', selectors:['#tutor','.document-panel'] },
      { id:'library', label:'Downloads', icon:'⇩', selectors:['#downloads','#term2-plans'] }
    ];

    const nav = document.createElement('nav');
    nav.className = 'nirvo-app-nav';
    nav.setAttribute('aria-label','NIRVO workspace');
    nav.innerHTML = groups.map((g,i) => '<button type="button" class="nirvo-nav-item'+(i===0?' active':'')+'" data-page="'+g.id+'" aria-pressed="'+(i===0?'true':'false')+'"><span class="nirvo-nav-icon" aria-hidden="true">'+g.icon+'</span><span>'+g.label+'</span></button>').join('');
    header.insertAdjacentElement('afterend', nav);

    const all = new Set();
    groups.forEach(g => g.selectors.forEach(sel => {
      const el = main.querySelector(sel);
      if (el && main.contains(el) && el.parentElement === main) {
        el.dataset.nirvoPage = g.id;
        all.add(el);
      }
    }));

    const show = (id, updateHash=true) => {
      const known = groups.some(g=>g.id===id);
      const page = known ? id : 'home';
      all.forEach(el => {
        const visible = el.dataset.nirvoPage === page;
        el.classList.toggle('nirvo-page-hidden',!visible);
        el.setAttribute('aria-hidden',visible?'false':'true');
      });
      nav.querySelectorAll('.nirvo-nav-item').forEach(btn=>{
        const active=btn.dataset.page===page;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-pressed',active?'true':'false');
      });
      document.body.dataset.nirvoPage=page;
      if(updateHash && history.replaceState) history.replaceState(null,'',page==='home'?'#overview':'#'+page);
      window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    };

    nav.addEventListener('click',e=>{
      const btn=e.target.closest('[data-page]');
      if(btn) show(btn.dataset.page);
    });
    document.querySelectorAll('.topbar .wordmark,.topbar nav a[href="#overview"],.rail-brand').forEach(a=>{
      a.addEventListener('click',()=>show('home'));
    });
    document.querySelectorAll('.topbar nav').forEach(el=>el.setAttribute('aria-hidden','true'));

    const initial = location.hash.slice(1);
    const hashMap = {overview:'home',planner:'planner',smartStudy:'smart',sslcLearnHub:'learn',sslcModule:'learn',sslcArena:'practice',quiz:'practice',recallLab:'practice',lifeHub:'life',tutor:'ai',downloads:'library',pdfLibrary:'learn','term2-plans':'library',aboutNirvo:'home'};
    show(hashMap[initial]||'home',false);

    // Internal links switch workspace first, then scroll to the requested item.
    main.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');
      if(!a) return;
      const targetId=a.getAttribute('href').slice(1);
      const page=hashMap[targetId];
      if(!page) return;
      e.preventDefault();
      show(page);
      if(targetId!=='overview' && targetId!=='aboutNirvo'){
        requestAnimationFrame(()=>document.getElementById(targetId)?.scrollIntoView({behavior:'smooth',block:'start'}));
      }
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();