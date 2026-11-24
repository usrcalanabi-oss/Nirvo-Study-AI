(() => {
  const main = document.querySelector('#overview');
  if (!main) return;
  const sections = [...main.querySelectorAll(':scope > section')];
  const homeSections = new Set(['welcome','metrics','hero-grid']);
  const menu = document.querySelector('#studyMenu');
  function showHome() {
    sections.forEach(section => { section.hidden = !homeSections.has([...section.classList].find(c => homeSections.has(c))); });
    main.classList.add('home-view');
    if (menu) menu.open = false;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function showSection(id, scroll = true) {
    if (!id || id === 'overview') return showHome();
    const target = document.getElementById(id);
    if (!target || !main.contains(target)) return;
    const parentSection = target.closest('main > section');
    if (!parentSection) return;
    sections.forEach(section => { section.hidden = section !== parentSection; });
    if (parentSection.classList.contains('workspace-grid')) {
      const selectedPanel = target.closest('article') || target;
      [...parentSection.children].forEach(child => { child.hidden = child !== selectedPanel; });
    }
    main.classList.remove('home-view');
    if (menu) menu.open = false;
    if (scroll) target.scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id) || !main.contains(document.getElementById(id))) return;
    event.preventDefault();
    history.replaceState(null,'','#'+id);
    showSection(id);
  });
  window.addEventListener('hashchange', () => showSection(location.hash.slice(1), false));
  if (location.hash && document.getElementById(location.hash.slice(1))) showSection(location.hash.slice(1), false);
  else showHome();
})();