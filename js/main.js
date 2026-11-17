/* Isabela Simião — Portfólio · JS puro */
(function () {
  document.documentElement.classList.remove('no-js');

  /* ---------- Imagens com placeholder automático ----------
     Cada <img data-src="assets/img/cases/b-1"> tenta .jpg, .png e .webp.
     Se nenhum arquivo existir, mostra um placeholder com o nome esperado.
     Para trocar: salve sua imagem com esse nome (ex.: b-1.jpg) na pasta. */
  var EXT = ['jpg', 'png', 'webp', 'jpeg'];
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    var base = img.getAttribute('data-src');
    var i = 0;
    function next() {
      if (i >= EXT.length) return showPlaceholder(img, base);
      img.src = base + '.' + EXT[i++];
    }
    img.addEventListener('error', next);
    img.loading = 'lazy';
    next();
  });

  function showPlaceholder(img, base) {
    var ph = document.createElement('div');
    ph.className = 'ph';
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', 'Espaço reservado: ' + (img.alt || 'imagem'));
    ph.innerHTML =
      '<svg class="ico"><use href="#node"/></svg>' +
      '<span>' + (img.getAttribute('data-ph') || 'Imagem') + '</span>' +
      '<code>' + base + '.jpg</code>';
    img.replaceWith(ph);
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobilemenu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Topbar ao rolar ---------- */
  var topbar = document.querySelector('.topbar');
  function onScroll() { topbar.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Animações ao entrar na tela ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal, .flow, .bars, .signature, [data-count]');

  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('is-in', 'is-drawn'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        if (el.classList.contains('signature')) el.classList.add('is-drawn');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Link ativo no menu ---------- */
  var links = document.querySelectorAll('.mainnav a');
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  sections.push(document.getElementById('topo'));
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) navIO.observe(s); });
  }

  /* ---------- Ano no rodapé ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- Ampliar prints ao clicar ---------- */
(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;
  var big = box.querySelector('img'), cap = box.querySelector('.lightbox__cap'), closeBtn = box.querySelector('.lightbox__close');
  var last = null;
  function open(img) {
    last = document.activeElement;
    big.src = img.currentSrc || img.src; big.alt = img.alt;
    var fc = img.parentElement.querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : img.alt;
    box.hidden = false; document.body.style.overflow = 'hidden'; closeBtn.focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ''; if (last) last.focus(); }
  document.addEventListener('click', function (e) {
    var shot = e.target.closest('.shot');
    if (shot) { var img = shot.querySelector('img'); if (img && img.naturalWidth) open(img); }
  });
  box.addEventListener('click', function (e) { if (e.target !== big) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
})();
