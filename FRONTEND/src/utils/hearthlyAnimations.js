/**
 * Exact Hearthly Animation Engine for Esyus Technologies
 * Implements the 1:1 animations from the original code provided by the user:
 * - Pinned Hero with Orb card flood expansion & collage drift
 * - Folders stacking scale and dimming on scroll
 * - Arched Plates wash opening & tab bounce
 * - Process steps progress rail scrub
 * - Fact chart bars scaleX stagger
 * - Team portraits rising into tabs
 * - Infinite review marquee ticker
 * - FAQ accordion border rules & entrance reveals
 * - Lenis smooth momentum scrolling
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initHearthlyAnimations() {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) {
    root.classList.add('motion');
  }

  // Clean up any stale ScrollTriggers before re-initializing
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const init = (sel, fn) => {
    document.querySelectorAll(sel).forEach((el) => {
      try {
        fn(el);
      } catch (e) {
        console.error('Hearthly init error for', sel, e);
      }
    });
  };

  // 1. Initialize CSS variables for collage floating animations
  init('.collage', (box) => {
    box.querySelectorAll('.look').forEach((card, i) => {
      card.style.setProperty('--fd', (3.2 + (i % 3) * 0.7).toFixed(1) + 's');
      card.style.setProperty('--fdl', (-i * 0.6).toFixed(1) + 's');
      card.style.setProperty('--fa', (i % 2 ? 6 : -6) + 'px');
    });
  });

  // 2. Initialize Stacking Folders index and progress
  init('[data-folders]', (box) => {
    const items = [...box.querySelectorAll('.folder')];
    const n = items.length;
    items.forEach((f, i) => {
      f.style.setProperty('--i', i);
      f.style.setProperty('--p', n > 1 ? (i / (n - 1)).toFixed(3) : 0);
    });
  });

  // 3. Initialize Arched Plates
  init('[data-plates]', (list) => {
    const items = [...list.children];
    const c = (items.length - 1) / 2;
    items.forEach((li, i) => {
      li.style.setProperty('--arch', c ? (1 - Math.abs(i - c) / c).toFixed(3) : 0);
      const card = li.querySelector('.plate__card');
      if (card && c && i !== c) {
        card.classList.add(i < c ? 'tab-l' : 'tab-r');
      }
    });
  });

  // 4. Initialize Chart Bars values
  init('[data-chart]', (chart) => {
    chart.querySelectorAll('.bar').forEach((bar) => {
      const v = parseFloat((bar.querySelector('.bar__value') || {}).textContent);
      const fill = bar.querySelector('.bar__fill');
      if (fill && !isNaN(v)) {
        fill.style.width = Math.max(0, Math.min(100, v)) + '%';
      }
    });
  });

  // Initialize Lenis smooth scroll
  let lenis = null;
  try {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn('Lenis initialization warning:', e);
  }

  const handleAnchorClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = id === '#top' || id === '#home' ? 0 : document.getElementById(id.slice(1));
    if (target === null) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -60, duration: 1.3 });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  document.addEventListener('click', handleAnchorClick);

  const onEnter = (els, fn, margin = '0px 0px -8% 0px') => {
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        try {
          fn(en.target);
        } catch (err) {
          console.error(err);
        }
      });
    }, { rootMargin: margin });
    els.forEach((el) => {
      // If already in viewport, trigger immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        fn(el);
      } else {
        io.observe(el);
      }
    });
  };

  const queue = [];
  const later = (fn) => queue.push(fn);
  const near = (sel, fn) => onEnter([...document.querySelectorAll(sel)], fn, '100% 0px 100% 0px');
  const flush = () => {
    const fn = queue.shift();
    if (!fn) return;
    try {
      fn();
    } catch (err) {
      console.error(err);
    }
    setTimeout(flush, 0);
  };

  // Reveals
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  reveals.forEach((el) => {
    if (el.dataset.reveal === 'stagger') {
      [...el.children].forEach((k, i) => k.style.setProperty('--d', i));
    }
  });
  root.classList.add('rv');
  onEnter(reveals, (el) => el.classList.add('is-in'));

  // Openings
  later(() => {
    const opens = [...document.querySelectorAll('[data-open]')];
    opens.forEach((el) => gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' }));
    onEnter(opens, (el) => {
      gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' });
      const art = el.querySelector('.art');
      if (art) gsap.fromTo(art, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'power3.out', clearProps: 'transform' });
    });
  });

  // Marks
  later(() => {
    const marks = [...document.querySelectorAll('[data-mark]')];
    marks.forEach((el) => gsap.set(el, { backgroundSize: '0% 52%' }));
    onEnter(marks, (el) => gsap.to(el, { backgroundSize: '100% 52%', duration: 0.9, delay: 0.35, ease: 'power2.inOut' }), '0px 0px -15% 0px');
  });

  // Parallax Drift
  near('[data-drift]', (el) => {
    const k = parseFloat(el.dataset.drift) || 0.15;
    gsap.fromTo(el, { yPercent: k * 50 }, {
      yPercent: -k * 50,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // 1. PINNED HERO PIN & FLOOD ANIMATION
  queue.unshift(() => init('.hero', (hero) => {
    new IntersectionObserver(([en]) => hero.classList.toggle('is-still', !en.isIntersecting)).observe(hero);
    const stage = hero.querySelector('.hero__stage');
    const flood = hero.querySelector('[data-flood]');
    const from = hero.querySelector('[data-flood-from]');
    if (!stage || !flood || !from) return;

    const img = flood.querySelector('.art') || flood.querySelector('img');
    const text = flood.querySelector('.flood__text');

    const startClip = () => {
      const s = stage.getBoundingClientRect();
      const f = from.getBoundingClientRect();
      const r = parseFloat(getComputedStyle(from).borderTopLeftRadius) || 16;
      return `inset(${(f.top - s.top).toFixed(1)}px ${(s.right - f.right).toFixed(1)}px ${(s.bottom - f.bottom).toFixed(1)}px ${(f.left - s.left).toFixed(1)}px round ${r}px)`;
    };

    const drift = (el) => {
      const s = stage.getBoundingClientRect();
      const f = el.getBoundingClientRect();
      return (f.left + f.width / 2 - (s.left + s.width / 2)) / s.width;
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(flood, { clipPath: startClip }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.55, ease: 'power2.inOut' }, 0)
      .fromTo(flood, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0);

    if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 0.7, ease: 'power1.out' }, 0);

    const head = hero.querySelector('.hero__head');
    if (head) tl.to(head, { yPercent: -45, opacity: 0, duration: 0.35 }, 0);

    hero.querySelectorAll('.collage__col').forEach((col) => {
      if (col.contains(from)) return;
      tl.to(col, {
        x: () => drift(col) * innerWidth * 0.5,
        y: () => -Math.abs(drift(col)) * innerHeight * 0.6,
        duration: 0.55,
        ease: 'power1.in',
      }, 0);
    });

    if (text) {
      [...text.children].forEach((el, i) => {
        tl.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.5 + i * 0.06);
      });
    }

    tl.to({}, { duration: 0.2 });
  }));

  // 2. FOLDERS STACKING SCALE & DIMMING
  near('[data-folders]', (box) => {
    const items = [...box.querySelectorAll('.folder')];
    items.forEach((f, i) => {
      const next = items[i + 1];
      const inner = f.querySelector('.folder__in');
      const body = f.querySelector('.folder__body');
      if (!next || !inner) return;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: () => 'top ' + (parseFloat(getComputedStyle(next).top) || 0) + 'px',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(inner, { scale: 0.955 }, 0);
      if (body) tl.to(body, { '--dim': 0.3 }, 0);
    });
  });

  // 3. ARCHED PLATES WASH OPENING & BOUNCE
  near('[data-plates]', (list) => {
    const items = [...list.children];
    const c = (items.length - 1) / 2;

    const add = (li, tl, at) => {
      const card = li.querySelector('.plate__card');
      const wash = li.querySelector('.plate__wash');
      const cap = li.querySelector('.plate__cap');
      if (!card || !wash) return;
      const art = card.querySelector('.art') || card.querySelector('img');
      const end = () => 'inset(' + (cap ? ((cap.offsetTop / card.offsetHeight) * 100).toFixed(2) : 100) + '% 0% 0%)';

      tl.fromTo(wash, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: end, duration: 1, ease: 'power2.inOut' }, at);
      tl.fromTo(card, { '--t': '0px' }, { '--t': '14px', duration: 0.45, ease: 'back.out(3)' }, at + 0.6);
      if (art) tl.fromTo(art, { scale: 1.18 }, { scale: 1, duration: 1.2, ease: 'power1.out' }, at);
    };

    gsap.matchMedia().add({
      wide: '(min-width: 761px)',
      narrow: '(max-width: 760px)',
    }, (ctx) => {
      if (ctx.conditions.wide) {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: list,
            start: 'top 82%',
            end: 'bottom 40%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        items.forEach((li, i) => add(li, tl, c ? (1 - Math.abs(i - c) / c) * 0.7 : 0));
      } else {
        items.forEach((li) => {
          add(li, gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: li,
              start: 'top 88%',
              end: 'top 30%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }), 0);
        });
      }
    });
  });

  // 4. PROCESS STEPS PROGRESS RAIL
  near('[data-steps]', (list) => {
    const steps = [...list.querySelectorAll('.step')];
    let marks = [];
    gsap.matchMedia().add({
      wide: '(min-width: 761px)',
      narrow: '(max-width: 760px)',
    }, (ctx) => {
      const down = ctx.conditions.narrow;
      const measure = () => {
        const r = list.getBoundingClientRect();
        marks = steps.map((s) => {
          const b = s.getBoundingClientRect();
          return down ? (b.top - r.top) / r.height : (b.left - r.left) / r.width;
        });
      };
      gsap.fromTo(list, { '--prog': 0 }, {
        '--prog': 1,
        ease: 'none',
        scrollTrigger: {
          trigger: list,
          start: down ? 'top 75%' : 'top 80%',
          end: down ? 'bottom 60%' : 'top 35%',
          scrub: 0.4,
          onRefresh: measure,
          onUpdate: (self) => {
            steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= (marks[i] || 0) - 0.001));
          },
        },
      });
    });
  });

  // 5. CHART BARS SCALE ANIMATION
  later(() => {
    const fills = [...document.querySelectorAll('[data-chart] .bar__fill')];
    fills.forEach((el) => gsap.set(el, { scaleX: 0 }));
    onEnter([...document.querySelectorAll('[data-chart]')], (chart) => {
      gsap.to(chart.querySelectorAll('.bar__fill'), { scaleX: 1, duration: 1.4, ease: 'power3.inOut', stagger: 0.12 });
    }, '0px 0px -20% 0px');
  });

  // 6. TEAM PORTRAITS RISE INTO TABS
  later(() => init('[data-people]', (list) => {
    const photos = [...list.querySelectorAll('.person__photo')];
    photos.forEach((p) => {
      const art = p.querySelector('.art .full') || p.querySelector('.art img') || p.querySelector('.art > *');
      if (art) gsap.set(art, { yPercent: 102 });
      gsap.set(p, { '--t': '0px' });
    });
    onEnter([list], () => photos.forEach((p, i) => {
      gsap.to(p, { '--t': '16px', duration: 0.6, delay: i * 0.12, ease: 'back.out(3)' });
      const art = p.querySelector('.art .full') || p.querySelector('.art img') || p.querySelector('.art > *');
      if (art) gsap.to(art, { yPercent: 0, duration: 1.3, delay: 0.25 + i * 0.12, ease: 'power4.out' });
    }), '0px 0px -18% 0px');
  }));

  // 7. REVIEW MARQUEE CONTINUOUS TWEEN
  near('[data-marquee]', (row) => {
    const track = row.firstElementChild;
    if (!track || !track.children.length) return;
    if (!track.dataset.cloned) {
      [...track.children].forEach((li) => {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('a, button').forEach((a) => a.setAttribute('tabindex', '-1'));
        track.appendChild(c);
      });
      track.dataset.cloned = 'true';
    }
    track.classList.add('is-running');
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      repeat: -1,
      duration: Math.max(20, track.scrollWidth / 55),
      paused: true,
    });
    let over = false;
    let seen = false;
    const sync = () => (seen && !over ? tween.resume() : tween.pause());
    row.addEventListener('mouseenter', () => { over = true; sync(); });
    row.addEventListener('mouseleave', () => { over = false; sync(); });
    row.addEventListener('focusin', () => { over = true; sync(); });
    row.addEventListener('focusout', () => { over = false; sync(); });
    ScrollTrigger.create({
      trigger: row,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        seen = self.isActive;
        sync();
      },
    });
  });

  // 8. FAQ ACCORDION RULES & STAGGERS
  near('[data-rules]', (list) => {
    const rows = [...list.querySelectorAll('.qa')];
    rows.forEach((r) => gsap.set(r, { '--rule': 0 }));
    gsap.set(rows, { opacity: 0, y: 18 });
    onEnter([list], () => gsap.to(rows, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      clearProps: 'transform,opacity',
    }));
    rows.forEach((r) => r.addEventListener('toggle', () => {
      const a = r.querySelector('.qa__a');
      if (r.open && a) {
        gsap.fromTo(a, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform,opacity' });
      }
    }));
    gsap.fromTo(list.querySelectorAll('.qa'), { '--rule': 0 }, {
      '--rule': 1,
      ease: 'none',
      stagger: 0.15,
      scrollTrigger: {
        trigger: list,
        start: 'top 85%',
        end: 'bottom 70%',
        scrub: 0.5,
      },
    });
  });

  // Execute flush queue
  flush();

  // ScrollTrigger refresh to sync all positions
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);

  // Return cleanup
  return () => {
    document.removeEventListener('click', handleAnchorClick);
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (lenis && typeof lenis.destroy === 'function') {
      lenis.destroy();
    }
  };
}
