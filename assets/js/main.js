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
    document.querySelectorAll('a,.row,.bi-panel,.exhibit').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('hover'));
      el.addEventListener('pointerleave', () => cur.classList.remove('hover'));
    });
  }

  const endIntro = () => { document.body.classList.remove('is-loading'); const i = document.querySelector('.intro'); if (i) i.remove(); };

  // ---- Fallback: no GSAP or reduced motion ----
  if (!hasGSAP || reduce) {
    endIntro();
    document.querySelectorAll('.big .w').forEach(w => w.style.opacity = 1);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

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
  const intro = gsap.timeline({ onComplete: () => { endIntro(); lenis && lenis.start(); ScrollTrigger.refresh(); } });
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
      .fromTo('.frame', { scale: 1 }, { scale: .62, ease: 'none' }, 0)
      .to('.ht-l', { xPercent: -18, ease: 'none' }, 0)
      .to('.ht-r', { xPercent: 18, ease: 'none' }, 0)
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
  gsap.utils.toArray('.collection h2, .works .work, .study div').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.row', { y: 30, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.rows', start: 'top 85%' } });
  gsap.from('.contact h2, .contact-s, .contact-cta, .ayah', { y: 50, opacity: 0, stagger: .12, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.fromTo('.contact-img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
})();
