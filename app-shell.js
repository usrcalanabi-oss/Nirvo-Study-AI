/* NIRVO app shell: animated workspace navigation + Focus Studio */
(() => {
  const start = () => {
    const main = document.querySelector('main#overview');
    const header = document.querySelector('.topbar');
    if (!main || !header || document.querySelector('.nirvo-app-nav')) return;

    const focus = document.createElement('section');
    focus.className = 'nirvo-focus-room';
    focus.dataset.nirvoPage = 'focus';
    focus.id = 'focusStudio';
    focus.innerHTML = `
      <div class="focus-hero">
        <div class="focus-hero-copy">
          <span class="focus-kicker">NIRVO · DEEP WORK SPACE</span>
          <h1>Make room for <em>focus.</em></h1>
          <p>A quiet space for one task, one session, and steady progress.</p>
          <div class="focus-tags"><span>✦ Distraction-light</span><span>25-minute sessions</span><span>Progress saved on this device</span></div>
        </div>
        <div class="focus-orb" aria-hidden="true"><span>N</span><i></i><b></b></div>
      </div>
      <div class="focus-layout">
        <article class="focus-timer-card">
          <div class="focus-card-top"><span>YOUR FOCUS SESSION</span><span class="focus-live"><i></i> READY WHEN YOU ARE</span></div>
          <div class="focus-mode"><button class="focus-mode-btn active" data-minutes="25">Focus · 25 min</button><button class="focus-mode-btn" data-minutes="5">Short break · 5 min</button></div>
          <div class="focus-clock" role="timer" aria-live="off">25:00</div>
          <div class="focus-progress"><span></span></div>
          <label class="focus-task-label" for="nirvoFocusTask">WHAT WILL YOU WORK ON?</label>
          <input id="nirvoFocusTask" class="focus-task-input" maxlength="90" placeholder="e.g. Revise Physics — Electricity">
          <div class="focus-controls"><button class="focus-start">Start focus <span>→</span></button><button class="focus-reset" type="button">Reset</button></div>
          <p class="focus-hint">Keep one small goal. You can pause or reset whenever you need.</p>
        </article>
        <aside class="focus-side">
          <div class="focus-stat-card"><span class="focus-side-label">COMPLETED SESSIONS</span><strong class="focus-count">0</strong><small>Saved on this device</small></div>
          <div class="focus-intention"><span class="focus-side-label">A SMALL REMINDER</span><h2>Progress is built one focused step at a time.</h2><p>Start with the next 25 minutes. You do not need to finish everything at once.</p><span class="focus-spark">✦</span></div>
        </aside>
      </div>
    `;
    main.appendChild(focus);

    const contact = document.createElement('section');
    contact.className = 'nirvo-contact-page';
    contact.dataset.nirvoPage = 'contact';
    contact.innerHTML = `
      <div class="contact-hero"><span class="focus-kicker">NIRVO · CONNECT</span><h1>Let's make learning <em>better.</em></h1><p>NIRVO is growing. Suggestions, corrections, and thoughtful feedback help shape what comes next.</p></div>
      <div class="contact-grid"><article><span>01 · FEEDBACK</span><h2>Help improve NIRVO</h2><p>Tell us what feels useful, what is confusing, or what you would like to see in a future update.</p><a href="#overview" class="contact-home-link">Back to workspace <b>↗</b></a></article><article><span>02 · OUR APPROACH</span><h2>Built around students</h2><p>Planning, revision, practice, and steady progress—designed to make study routines easier to manage.</p><div class="contact-signature">CREATE · BUILD · SOLVE</div></article></div>
    `;
    main.appendChild(contact);

    const groups = [
      { id:'home', label:'Home', icon:'⌂', selectors:['.welcome','.service-notice','.metrics','.hero-grid','#aboutNirvo'] },
      { id:'planner', label:'Exam planner', icon:'▦', selectors:['.workspace-grid'] },
      { id:'smart', label:'Smart plan', icon:'◷', selectors:['#smartStudy'] },
      { id:'learn', label:'SSLC Library', icon:'▤', selectors:['#sslcLearnHub','#sslcModule','#pdfLibrary'] },
      { id:'practice', label:'Practice', icon:'◎', selectors:['#sslcArena','#quiz','#recallLab'] },
      { id:'life', label:'Student life', icon:'✦', selectors:['#lifeHub'] },
      { id:'ai', label:'Study AI', icon:'✳', selectors:['#tutor','.document-panel'] },
      { id:'focus', label:'Focus Studio', icon:'◉', selectors:['.nirvo-focus-room'] },
      { id:'library', label:'Downloads', icon:'⇩', selectors:['#downloads','#term2-plans'] },
      { id:'contact', label:'Contact', icon:'↗', selectors:['.nirvo-contact-page'] }
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

    const pageNames={home:'Home',planner:'Exam planner',smart:'Smart study plan',learn:'SSLC learning library',practice:'Practice arena',life:'Student life',ai:'Study AI',focus:'Focus Studio',library:'Downloads',contact:'Contact'};
    const hashMap = {overview:'home',planner:'planner',smartStudy:'smart',sslcLearnHub:'learn',sslcModule:'learn',sslcArena:'practice',quiz:'practice',recallLab:'practice',lifeHub:'life',tutor:'ai',downloads:'library',pdfLibrary:'learn','term2-plans':'library',aboutNirvo:'home',focusStudio:'focus',focus:'focus',contact:'contact'};
    const show = (id, updateHash=true) => {
      const page = groups.some(g=>g.id===id) ? id : 'home';
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
      document.title='NIRVO · '+(pageNames[page]||'Study AI');
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
    window.addEventListener('hashchange',()=>{const key=location.hash.slice(1);show(hashMap[key]||'home',false)});
    const initial = location.hash.slice(1);
    show(hashMap[initial]||'home',false);

    main.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');
      if(!a) return;
      const targetId=a.getAttribute('href').slice(1);
      const page=hashMap[targetId];
      if(!page) return;
      e.preventDefault();
      show(page);
      if(targetId!=='overview' && targetId!=='aboutNirvo') {
        requestAnimationFrame(()=>document.getElementById(targetId)?.scrollIntoView({behavior:'smooth',block:'start'}));
      }
    });

    // Focus Studio: a simple local Pomodoro timer; no account or paid service required.
    const clock=focus.querySelector('.focus-clock');
    const startBtn=focus.querySelector('.focus-start');
    const resetBtn=focus.querySelector('.focus-reset');
    const progress=focus.querySelector('.focus-progress span');
    const taskInput=focus.querySelector('.focus-task-input');
    const countEl=focus.querySelector('.focus-count');
    const modeButtons=[...focus.querySelectorAll('.focus-mode-btn')];
    let duration=25*60, remaining=duration, interval=null, running=false;
    const storageKey='nirvo-focus-completed-v1';
    const readCount=()=>{try{return Number(localStorage.getItem(storageKey)||0)||0}catch(_){return 0}};
    let completed=readCount();
    countEl.textContent=completed;
    const render=()=>{
      clock.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
      progress.style.width=((duration-remaining)/duration*100)+'%';
      startBtn.innerHTML=running?'Pause session <span>Ⅱ</span>':'Start focus <span>→</span>';
      focus.querySelector('.focus-live').innerHTML=running?'<i></i> SESSION IN PROGRESS':'<i></i> READY WHEN YOU ARE';
      focus.querySelector('.focus-live').classList.toggle('is-running',running);
    };
    const stop=()=>{if(interval)clearInterval(interval);interval=null;running=false;render()};
    const finish=()=>{
      stop(); remaining=0; render();
      completed+=1; countEl.textContent=completed;
      try{localStorage.setItem(storageKey,String(completed))}catch(_){}
      startBtn.textContent='Session complete ✓';
      focus.querySelector('.focus-hint').textContent='Well done. Take a short break, then choose your next small goal.';
    };
    const tick=()=>{remaining=Math.max(0,remaining-1);if(remaining===0)finish();else render()};
    startBtn.addEventListener('click',()=>{
      if(running){stop();return}
      if(remaining===0){remaining=duration}
      running=true;focus.querySelector('.focus-hint').textContent=taskInput.value.trim()?'Working on: '+taskInput.value.trim():'Stay with one task until the session ends.';
      render();interval=setInterval(tick,1000);
    });
    resetBtn.addEventListener('click',()=>{stop();remaining=duration;focus.querySelector('.focus-hint').textContent='Keep one small goal. You can pause or reset whenever you need.';render()});
    modeButtons.forEach(btn=>btn.addEventListener('click',()=>{
      stop();duration=Number(btn.dataset.minutes)*60;remaining=duration;
      modeButtons.forEach(b=>b.classList.toggle('active',b===btn));
      focus.querySelector('.focus-hint').textContent='Mode changed. Start when you are ready.';render();
    }));
    render();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();