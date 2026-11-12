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


  // ---- Studio: bilingual poster maker ----
  const cv = document.getElementById('stCanvas');
  if (cv) {
    const ctx = cv.getContext('2d');
    const en = document.getElementById('stEn'), ar = document.getElementById('stAr');
    const moods = {
      gallery: { bg: '#EFE6D8', ink: '#0F0C09', acc: '#967C5D', sun: '#E9B872' },
      night:   { bg: '#0F0C09', ink: '#EFE6D8', acc: '#C1A47E', sun: '#E9B872' },
      sun:     { bg: '#E9B872', ink: '#2B1D14', acc: '#7A4A1E', sun: '#FBE3B6' },
      sage:    { bg: '#6E7B4E', ink: '#F2E8D8', acc: '#E6D6A8', sun: '#D9B86A' }
    };
    let mood = 'gallery';
    const fit = (txt, font, max, start) => { let s = start; do { ctx.font = font.replace('$', s); s -= 4; } while (ctx.measureText(txt).width > max && s > 40); return s + 4; };
    const draw = () => {
      const m = moods[mood], W = 1080, H = 1350;
      ctx.fillStyle = m.bg; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(760, 430, 10, 760, 430, 330);
      g.addColorStop(0, m.sun); g.addColorStop(.7, m.sun + 'aa'); g.addColorStop(1, m.sun + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(760, 430, 330, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = m.ink; ctx.globalAlpha = .7;
      ctx.font = '500 22px Inter'; ctx.textAlign = 'left'; ctx.fillText('A WORD TO LIVE BY', 80, 110);
      ctx.textAlign = 'right'; ctx.fillText('NO. ' + String((en.value.length * 7 + ar.value.length * 3) % 100).padStart(2, '0'), W - 80, 110);
      ctx.globalAlpha = 1;
      const e = (en.value || ' ').trim() + '.';
      const s = fit(e, 'italic 400 $px "Instrument Serif"', W - 160, 230);
      ctx.textAlign = 'left'; ctx.fillStyle = m.ink; ctx.font = `italic 400 ${s}px "Instrument Serif"`;
      ctx.fillText(e, 80, 900);
      const a = (ar.value || ' ').trim();
      const sa = fit(a, '700 $px Amiri', W - 160, 150);
      ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillStyle = m.acc; ctx.font = `700 ${sa}px Amiri`;
      ctx.fillText(a, W - 80, 1090); ctx.direction = 'ltr';
      ctx.strokeStyle = m.ink; ctx.globalAlpha = .35; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 1200); ctx.lineTo(W - 80, 1200); ctx.stroke(); ctx.globalAlpha = .75;
      ctx.fillStyle = m.ink; ctx.font = '500 22px Inter'; ctx.textAlign = 'left'; ctx.fillText('MADE IN THE STUDIO OF AISHA AHMED', 80, 1250);
      ctx.textAlign = 'right'; ctx.fillText('AISHAHMED.COM', W - 80, 1250); ctx.globalAlpha = 1;
    };
    document.querySelectorAll('.st-moods button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.st-moods button').forEach(x => x.classList.remove('on')); b.classList.add('on'); mood = b.dataset.m; draw();
    }));
    en.addEventListener('input', draw); ar.addEventListener('input', draw);
    document.getElementById('stSave').addEventListener('click', () => {
      const l = document.createElement('a'); l.download = 'poster-' + (en.value || 'word').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
      l.href = cv.toDataURL('image/png'); l.click();
    });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      Promise.all(['italic 400 80px "Instrument Serif"', '700 80px Amiri', '500 22px Inter'].map(f => document.fonts.load(f))).then(draw, draw);
    });
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

  // ---- Collection, works, contact reveals ----
  gsap.utils.toArray('.collection h2, .study div, .piece, .st-copy, .st-frame').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.row', { y: 30, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.rows', start: 'top 85%' } });
  gsap.from('.contact h2, .contact-s, .contact-cta, .ayah', { y: 50, opacity: 0, stagger: .12, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.fromTo('.contact-img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
})();
