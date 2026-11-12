(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  document.getElementById('y').textContent = new Date().getFullYear();

  // ---- Split manifesto into words (lit on scroll) ----
  document.querySelectorAll('.reveal-words').forEach(el => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          if (n.tagName === 'EM') { n.classList.add('w'); } else { walk(n); }
        }
      });
    };
    walk(el);
  });

  const stage = document.getElementById('biStage');

  // ---- Collection rows: tap to open on touch ----
  document.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => r.classList.toggle('open')));

  // ---- Cursor + sunlight follow ----
  const cur = document.querySelector('.cursor');
  if (cur && window.matchMedia('(hover: hover)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      document.documentElement.style.setProperty('--mx', x + 'px');
      document.documentElement.style.setProperty('--my', y + 'px');
    });
    const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    document.querySelectorAll('a,.row,.bi-panel,.exhibit,.piece,.st-frame,button').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('hover'));
      el.addEventListener('pointerleave', () => cur.classList.remove('hover'));
    });
  }


  // ---- Studio: a word for today (curated words only) ----
  const cv = document.getElementById('stCanvas');
  if (cv) {
    const ctx = cv.getContext('2d');
    const moods = {
      sun:     { en: 'Hopeful',    ar: 'تفاؤل',  bg: '#E9B872', ink: '#2B1D14', acc: '#7A4A1E', glow: '#FBE3B6', words: [['Hope', 'أمل'], ['Light', 'نور'], ['Joy', 'بهجة']] },
      sage:    { en: 'Calm',       ar: 'هدوء',   bg: '#6E7B4E', ink: '#F2E8D8', acc: '#E6D6A8', glow: '#9AA77A', words: [['Peace', 'سلام'], ['Stillness', 'سكينة'], ['Patience', 'صبر']] },
      gallery: { en: 'Grateful',   ar: 'امتنان', bg: '#EFE6D8', ink: '#0F0C09', acc: '#967C5D', glow: '#E9B872', words: [['Kindness', 'لُطف'], ['Gratitude', 'امتنان'], ['Contentment', 'رِضا']] },
      clay:    { en: 'Determined', ar: 'عزيمة',  bg: '#C0643C', ink: '#FBF2E6', acc: '#F6D9BE', glow: '#E08A5E', words: [['Courage', 'شجاعة'], ['Focus', 'تركيز'], ['Strength', 'قوّة']] },
      dusk:    { en: 'Thoughtful', ar: 'تأمّل',  bg: '#2F3A5C', ink: '#EFE6D8', acc: '#C9B48E', glow: '#5D6A86', words: [['Clarity', 'وضوح'], ['Growth', 'نموّ'], ['Wonder', 'دهشة']] },
      night:   { en: 'Love',       ar: 'حب', top: 'FEELING LOVED',    bg: '#0F0C09', ink: '#EFE6D8', acc: '#C1A47E', glow: '#3A2E22', words: [['Rest', 'راحة'], ['Gentleness', 'رِفق'], ['Ease', 'يُسر']] }
    };
    let mood = 'gallery', idx = 0;
    const fit = (txt, font, max, start) => { let s = start; do { ctx.font = font.replace('$', s); s -= 4; } while (ctx.measureText(txt).width > max && s > 40); return s + 4; };
    let draw = () => {
      const m = moods[mood], [we, wa] = m.words[idx % m.words.length], W = 1080, H = 1350;
      ctx.fillStyle = m.bg; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(760, 430, 10, 760, 430, 330);
      g.addColorStop(0, m.glow); g.addColorStop(.7, m.glow + 'aa'); g.addColorStop(1, m.glow + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(760, 430, 330, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = m.ink; ctx.globalAlpha = .75; ctx.font = '500 22px Inter';
      ctx.textAlign = 'left'; ctx.fillText('A WORD FOR TODAY', 80, 110);
      ctx.textAlign = 'right'; ctx.fillText(m.top || ('FEELING ' + m.en.toUpperCase()), W - 80, 110);
      ctx.globalAlpha = 1;
      const e = we + '.';
      const s = fit(e, 'italic 400 $px "Instrument Serif"', W - 160, 230);
      ctx.textAlign = 'left'; ctx.fillStyle = m.ink; ctx.font = `italic 400 ${s}px "Instrument Serif"`; ctx.fillText(e, 80, 900);
      const sa = fit(wa, '700 $px Amiri', W - 160, 160);
      ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillStyle = m.acc; ctx.font = `700 ${sa}px Amiri`; ctx.fillText(wa, W - 80, 1095); ctx.direction = 'ltr';
      ctx.strokeStyle = m.ink; ctx.globalAlpha = .35; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 1200); ctx.lineTo(W - 80, 1200); ctx.stroke();
      ctx.globalAlpha = .8; ctx.fillStyle = m.ink;
      ctx.font = '500 22px Inter'; ctx.textAlign = 'left'; ctx.fillText(m.en.toUpperCase(), 80, 1252);
      const ew = ctx.measureText(m.en.toUpperCase() + '  ·  ').width; ctx.fillText('·', 80 + ctx.measureText(m.en.toUpperCase() + '  ').width, 1252);
      ctx.font = '700 28px Amiri'; ctx.direction = 'rtl'; ctx.textAlign = 'left'; ctx.fillText(m.ar, 80 + ew, 1254); ctx.direction = 'ltr';
      ctx.font = '500 22px Inter'; ctx.textAlign = 'right'; ctx.fillText('AISHAHMED.COM', W - 80, 1252); ctx.globalAlpha = 1;
    };
    const btns = document.querySelectorAll('.st-moods button');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-checked', 'true');
      mood = b.dataset.m; idx = Math.floor(Math.random() * moods[mood].words.length); draw();
    }));
    document.getElementById('stNext').addEventListener('click', () => { idx++; draw(); });
    document.getElementById('stSave').addEventListener('click', () => {
      const l = document.createElement('a'); l.download = 'a-word-for-today-' + moods[mood].words[idx % 3][0].toLowerCase() + '.png';
      l.href = cv.toDataURL('image/png'); l.click();
    });
    // ---- Share: native share sheet (with the poster) or a menu of places ----
    const shareBtn = document.getElementById('stShare'), menu = document.getElementById('stMenu'), toast = document.getElementById('stToast');
    const wordUrl = () => 'https://aishahmed.com/word/' + current().en.toLowerCase() + '/';
    const say = t => { toast.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => toast.textContent = '', 4000); };
    const current = () => { const m = moods[mood], w = m.words[idx % m.words.length]; return { en: w[0], ar: w[1], file: 'a-word-for-today-' + w[0].toLowerCase() + '.png' }; };
    const shareText = () => { const c = current(); return `My word for today: ${c.en} · ${c.ar}. Find yours:`; };
    const blob = () => new Promise(r => cv.toBlob(r, 'image/png'));
    const download = () => { const l = document.createElement('a'); l.download = current().file; l.href = cv.toDataURL('image/png'); l.click(); };
    const setLinks = () => {
      const txt = encodeURIComponent(shareText()), both = encodeURIComponent(shareText() + '\n' + wordUrl()), u = encodeURIComponent(wordUrl());
      const links = {
        whatsapp: `https://wa.me/?text=${both}`, x: `https://twitter.com/intent/tweet?text=${txt}&url=${u}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`, linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${both}`,
        telegram: `https://t.me/share/url?url=${u}&text=${txt}`, email: `mailto:?subject=${encodeURIComponent('A word for today')}&body=${both}`
      };
      menu.querySelectorAll('a[data-s]').forEach(a => a.href = links[a.dataset.s]);
    };
    const openMenu = open => { if (open) setLinks(); menu.hidden = !open; shareBtn.setAttribute('aria-expanded', open); };
    // keep a ready-made file so the share sheet opens instantly (no waiting inside the tap)
    let readyFile = null;
    const prepFile = () => cv.toBlob(b => { if (b) readyFile = new File([b], current().file, { type: 'image/png' }); }, 'image/png');
    const nativeBtn = menu.querySelector('[data-s="native"]');
    if (navigator.share) nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', e => {
      e.preventDefault(); openMenu(false);
      const data = { title: 'A word for today', text: shareText(), url: wordUrl() };
      if (readyFile && navigator.canShare && navigator.canShare({ files: [readyFile] })) data.files = [readyFile];
      navigator.share(data).catch(err => { if (!err || err.name !== 'AbortError') { download(); say('Poster saved. Pick an app from the list to share it.'); openMenu(true); } });
    });
    shareBtn.addEventListener('click', e => { e.stopPropagation(); prepFile(); openMenu(menu.hidden); });
    prepFile();
    const _draw = draw; draw = (...a) => { _draw(...a); prepFile(); };

    menu.querySelectorAll('[data-s]').forEach(el => {
      if (el.dataset.s === 'native') return;
      el.addEventListener('click', async e => {
        const s = el.dataset.s;
        setLinks(); const links = { whatsapp: 1, x: 1, facebook: 1, linkedin: 1, telegram: 1, email: 1 };
        if (links[s]) { if (s !== 'linkedin' && s !== 'facebook') { download(); say('Poster saved too, so you can attach it.'); } }
        else if (s === 'copy') { e.preventDefault(); try { await navigator.clipboard.writeText(shareText() + '\n' + wordUrl()); say('Link copied.'); } catch (_) { say(wordUrl()); } }
        else if (s === 'instagram') {
          e.preventDefault();
          // Phones: open the share sheet with the poster so Instagram (post or story) can be picked directly
          if (readyFile && navigator.share && navigator.canShare && navigator.canShare({ files: [readyFile] })) {
            navigator.share({ files: [readyFile] }).then(() => {}, err => {
              if (!err || err.name !== 'AbortError') { download(); window.open('https://www.instagram.com/', '_blank', 'noopener'); }
            });
            say('Choose Instagram from the list, then Story or Post.');
          } else {
            // Computers: save the poster and open Instagram in a new tab, ready to create a post
            download(); window.open('https://www.instagram.com/', '_blank', 'noopener');
            say('Poster saved. On Instagram, click "+ Create" and choose the poster from your Downloads.');
          }
        }
        openMenu(false);
      });
    });
    document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) openMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') openMenu(false); });

    (document.fonts ? Promise.all(['italic 400 80px "Instrument Serif"', '700 80px Amiri', '500 22px Inter'].map(f => document.fonts.load(f))) : Promise.resolve()).then(draw, draw);
    draw();
  }

  const endIntro = () => { document.body.classList.remove('is-loading'); const i = document.querySelector('.intro'); if (i) i.remove(); };

  // ---- Fallback: no GSAP or reduced motion ----
  if (!hasGSAP || reduce) {
    endIntro();
    document.querySelectorAll('.big .w').forEach(w => w.style.opacity = 1);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  let rT; const refresh = () => { clearTimeout(rT); rT = setTimeout(() => ScrollTrigger.refresh(), 150); };
  addEventListener('load', refresh);
  document.querySelectorAll('img').forEach(i => { if (!i.complete) i.addEventListener('load', refresh); });

  // ---- Smooth scroll ----
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { duration: 1.6 });
    }));
  }

  // ---- Intro: count, sun rises, name, curtain lifts ----
  const counter = { v: 0 };
  const countEl = document.getElementById('count');
  let opened = false;
  const open = () => { if (opened) return; opened = true; endIntro(); lenis && lenis.start(); ScrollTrigger.refresh(); };
  const intro = gsap.timeline({ onComplete: open });
  setTimeout(() => { if (!opened) { intro.progress(1); open(); } }, 6000);
  intro
    .to(counter, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => countEl.textContent = Math.round(counter.v) }, 0)
    .to('.intro-sun', { top: '50%', duration: 1.8, ease: 'power3.out' }, 0)
    .to('.intro-word span, .intro-word em', { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' }, .5)
    .to('.intro-sun', { scale: 9, duration: 1.1, ease: 'power3.in' }, 2.1)
    .to('.intro-word', { opacity: 0, duration: .4 }, 2.3)
    .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'power4.inOut' }, 2.9)
    .from('.frame', { scale: 1.25, duration: 1.4, ease: 'power3.out' }, 2.9)
    .from('.ht-l', { yPercent: 110, opacity: 0, duration: 1.1, ease: 'power4.out' }, 3.1)
    .from('.ht-r', { yPercent: 110, opacity: 0, duration: 1.1, ease: 'power4.out' }, 3.2)
    .from('.hero-label, .hero-scroll, .nav', { opacity: 0, y: 20, duration: .8, stagger: .08 }, 3.4);

  // ---- Hero: start close on the Be Kind patch, pull back to the framed portrait ----
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 1 } })
      .fromTo('.frame', { scale: 1 }, { scale: .72, ease: 'none' }, 0)
      .to('.ht-l', { xPercent: -8, ease: 'none' }, 0)
      .to('.ht-r', { xPercent: 10, ease: 'none' }, 0)
      .to('.hero-label', { y: -60, ease: 'none' }, 0)
      .to('.hero-scroll', { opacity: 0, ease: 'none' }, 0);
  });
  mm.add('(max-width: 860px)', () => {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 1 } })
      .fromTo('.frame', { scale: 1 }, { scale: .86, ease: 'none' }, 0)
      .to('.hero-title', { y: -30, ease: 'none' }, 0);
  });

  // ---- Manifesto words light up ----
  gsap.to('.big .w', {
    opacity: 1, stagger: .1, ease: 'none',
    scrollTrigger: { trigger: '.big', start: 'top 80%', end: 'bottom 45%', scrub: true }
  });
  gsap.from('.manifesto-cols p', { y: 40, opacity: 0, stagger: .15, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.manifesto-cols', start: 'top 85%' } });

  // ---- Bilingual panels rise in ----
  gsap.from('.bi-panel', { y: 80, opacity: 0, stagger: .15, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.bi-stage', start: 'top 80%' } });

  // ---- Exhibits: horizontal scroll ----
  const track = document.querySelector('.ex-track');
  if (track) {
    const dist = () => Math.max(0, track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left) + 40);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.exhibits', start: 'top top', end: () => '+=' + dist(), pin: '.ex-pin', scrub: 1, invalidateOnRefresh: true }
    });
  }

  // ---- Archive: stats count up, heading rises ----
  gsap.from('.ar-head > *', { y: 50, opacity: 0, stagger: .1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.archive', start: 'top 70%' } });
  document.querySelectorAll('.ar-stats b[data-count]').forEach(b => {
    const n = +b.dataset.count, o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 85%', once: true }, onUpdate: () => b.textContent = Math.round(o.v) });
  });
  gsap.from('.ar-wall', { x: 200, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.ar-wall', start: 'top 85%' } });

  // ---- Collection, works, contact reveals ----
  gsap.utils.toArray('.collection h2, .study div, .piece, .st-copy, .st-frame').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.row', { y: 30, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.rows', start: 'top 85%' } });
  gsap.from('.contact h2, .contact-s, .contact-cta, .ayah', { y: 50, opacity: 0, stagger: .12, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.fromTo('.contact-img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
})();
