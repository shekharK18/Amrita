/* =============================================
   ANIMATIONS.JS — Fashion Portfolio · Full Enchantment
   ============================================= */
'use strict';

/* ─── UTILS ─────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ─── DEVICE DETECTION ───────────────────────────── */
const isTouch  = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const isMobile = isTouch || window.innerWidth <= 768;

/* =============================================
   1. SCROLL REVEAL
   ============================================= */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* =============================================
   2. CV TABS
   ============================================= */
document.querySelectorAll('.cv-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cv-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.cv-panel').forEach(p => p.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById('cv-' + tab.dataset.tab);
    if (target) {
      target.classList.remove('hidden');
      target.querySelectorAll('.reveal:not(.revealed)').forEach(el => revealObs.observe(el));
    }
  });
});

/* =============================================
   3. NAV SCROLL + ACTIVE SECTION TRACKING
   ============================================= */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));

/* =============================================
   4. THREAD CURSOR TRAIL  (desktop only)
   ============================================= */
const threadCanvas = document.getElementById('thread-canvas');
const tCtx = (!isMobile) ? threadCanvas?.getContext('2d') : null;
let   threadPoints = [];
let   mousePos     = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const THREAD_LEN   = 28;

if (!isMobile && tCtx) {
  for (let i = 0; i < THREAD_LEN; i++) {
    threadPoints.push({ x: mousePos.x, y: mousePos.y });
  }

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  function drawThread() {
    threadCanvas.width  = window.innerWidth;
    threadCanvas.height = window.innerHeight;
    tCtx.clearRect(0, 0, threadCanvas.width, threadCanvas.height);

    // Shift chain
    threadPoints[0].x = lerp(threadPoints[0].x, mousePos.x, 0.35);
    threadPoints[0].y = lerp(threadPoints[0].y, mousePos.y, 0.35);
    for (let i = 1; i < THREAD_LEN; i++) {
      threadPoints[i].x = lerp(threadPoints[i].x, threadPoints[i - 1].x, 0.55);
      threadPoints[i].y = lerp(threadPoints[i].y, threadPoints[i - 1].y, 0.55);
    }

    tCtx.beginPath();
    tCtx.moveTo(threadPoints[0].x, threadPoints[0].y);
    for (let i = 1; i < THREAD_LEN - 1; i++) {
      const mx = (threadPoints[i].x + threadPoints[i + 1].x) / 2;
      const my = (threadPoints[i].y + threadPoints[i + 1].y) / 2;
      tCtx.quadraticCurveTo(threadPoints[i].x, threadPoints[i].y, mx, my);
    }

    const grad = tCtx.createLinearGradient(
      threadPoints[0].x, threadPoints[0].y,
      threadPoints[THREAD_LEN - 1].x, threadPoints[THREAD_LEN - 1].y
    );
    grad.addColorStop(0, 'rgba(201,169,110,0.9)');
    grad.addColorStop(0.5, 'rgba(201,169,110,0.4)');
    grad.addColorStop(1, 'rgba(201,169,110,0)');

    tCtx.strokeStyle = grad;
    tCtx.lineWidth   = 1.5;
    tCtx.lineCap     = 'round';
    tCtx.lineJoin    = 'round';
    tCtx.stroke();

    // Needle head at start
    tCtx.beginPath();
    tCtx.arc(threadPoints[0].x, threadPoints[0].y, 3, 0, Math.PI * 2);
    tCtx.fillStyle = '#c9a96e';
    tCtx.fill();

    requestAnimationFrame(drawThread);
  }
  drawThread();
  window.addEventListener('resize', () => {
    threadCanvas.width  = window.innerWidth;
    threadCanvas.height = window.innerHeight;
  });
}

/* =============================================
   5. MAGNETIC BUTTONS  (desktop only)
   ============================================= */
if (!isMobile) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    let bound, rafId;
    let bx = 0, by = 0;

    btn.addEventListener('mouseenter', () => {
      bound = btn.getBoundingClientRect();
    });

    btn.addEventListener('mousemove', (e) => {
      if (!bound) return;
      const cx = bound.left + bound.width  / 2;
      const cy = bound.top  + bound.height / 2;
      const dx = (e.clientX - cx) * 0.38;
      const dy = (e.clientY - cy) * 0.38;
      bx = dx; by = dy;
      btn.style.transform = `translate(${bx}px, ${by}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      bx = 0; by = 0;
      btn.style.transform = '';
    });
  });
}

/* =============================================
   6. HERO MAGNETIC NAME  (desktop only)
   ============================================= */
const heroName = document.querySelector('.hero-name');
const hero     = document.getElementById('hero');
if (!isMobile && hero && heroName) {
  let tx = 0, ty = 0, cx2 = 0, cy2 = 0, hRaf = null;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5) * 24;
    ty = ((e.clientY - r.top)  / r.height - 0.5) * 9;
    if (!hRaf) heroLerp();
  });
  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!hRaf) heroLerp(); });
  function heroLerp() {
    cx2 = lerp(cx2, tx, 0.1);
    cy2 = lerp(cy2, ty, 0.1);
    heroName.style.transform = `translate(${cx2}px, ${cy2}px)`;
    if (Math.abs(tx - cx2) + Math.abs(ty - cy2) > 0.05) {
      hRaf = requestAnimationFrame(heroLerp);
    } else { hRaf = null; }
  }
}

/* =============================================
   7. CLICK / TAP RIPPLE EFFECT
   ============================================= */
function spawnRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = x + 'px';
  ripple.style.top  = y + 'px';
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
// Mouse click (desktop)
if (!isMobile) {
  document.addEventListener('click', (e) => spawnRipple(e.clientX, e.clientY));
}
// Touch tap (mobile)
if (isMobile) {
  document.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    if (t) spawnRipple(t.clientX, t.clientY);
  }, { passive: true });
}

/* =============================================
   8. TEXT SCRAMBLE for section titles (on reveal)
   ============================================= */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ✦·';
function scrambleText(el) {
  if (el.dataset.scrambled) return;
  el.dataset.scrambled = '1';
  const original = el.textContent;
  let iter = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((ch, idx) => {
      if (idx < iter) return original[idx];
      if (ch === ' ' || ch === '\n') return ch;
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iter += 0.7;
    if (iter >= original.length) {
      el.textContent = original;
      clearInterval(interval);
    }
  }, 30);
}

const scrambleObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => scrambleText(entry.target), 200);
      scrambleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-label-text').forEach(el => {
  scrambleObs.observe(el);
});

/* =============================================
   9. ANIMATED STAT COUNTERS
   ============================================= */
function animCounter(el) {
  const raw    = el.textContent.replace(/[^0-9]/g, '');
  const suffix = el.textContent.replace(/[0-9]/g, '');
  if (!raw) return;
  const target = parseInt(raw, 10);
  const dur    = 1800;
  const t0     = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(2, -10 * p);
    el.textContent = Math.round(e * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animCounter(e.target); cntObs.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-number').forEach(el => {
  if (/\d/.test(el.textContent)) cntObs.observe(el);
});

/* =============================================
   10. 3D CARD TILT + GLARE (lerp)
   ============================================= */
function initCardTilt() {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }
    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = null;
    function animCard() {
      cx = lerp(cx, tx, 0.13);
      cy = lerp(cy, ty, 0.13);
      card.style.transform = `perspective(800px) rotateY(${cx*18}deg) rotateX(${-cy*16}deg) scale3d(1.03,1.03,1.03)`;
      glare.style.background = `radial-gradient(circle at ${(cx+0.5)*100}% ${(cy+0.5)*100}%, rgba(255,255,255,0.28) 0%, transparent 65%)`;
      glare.style.opacity = '1';
      if (Math.abs(tx-cx)+Math.abs(ty-cy) > 0.003) rafId = requestAnimationFrame(animCard);
      else rafId = null;
    }
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      tx = (e.clientX-r.left)/r.width  - 0.5;
      ty = (e.clientY-r.top) /r.height - 0.5;
      if (!rafId) animCard();
    });
    card.addEventListener('mouseleave', () => {
      tx = 0; ty = 0;
      function ease() {
        cx = lerp(cx, 0, 0.1); cy = lerp(cy, 0, 0.1);
        card.style.transform = `perspective(800px) rotateY(${cx*18}deg) rotateX(${-cy*16}deg) scale3d(1,1,1)`;
        glare.style.opacity  = String(Math.abs(cx)+Math.abs(cy));
        if (Math.abs(cx)+Math.abs(cy) > 0.005) requestAnimationFrame(ease);
        else { card.style.transform=''; glare.style.opacity='0'; }
      }
      ease();
    });
  });
}
if (!isMobile) initCardTilt();


/* =============================================
   11. PORTFOLIO FILTERS (stagger)
   ============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.portfolio-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach((card, i) => {
      const show = filter === 'all' || card.dataset.category === filter;
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity    = show ? '1' : '0.1';
        card.style.transform  = show ? '' : 'scale(0.95)';
        card.style.pointerEvents = show ? 'auto' : 'none';
      }, i * 35);
    });
  });
});

/* =============================================
   12. SKILL BARS (stagger wave)
   ============================================= */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObs  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const pct  = fill.dataset.pct || '80';
      const idx  = [...skillBars].indexOf(fill);
      setTimeout(() => { fill.style.width = pct + '%'; fill.classList.add('animated'); }, idx * 90);
      skillObs.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(bar => { bar.style.width = '0%'; skillObs.observe(bar); });

/* =============================================
   13. TAGS hover stagger
   ============================================= */
document.querySelectorAll('.tag').forEach((tag, i) => {
  tag.style.transitionDelay = `${i * 22}ms`;
});

/* =============================================
   14. FLOATING BG PARALLAX  (desktop: mouse / mobile: gyro)
   ============================================= */
const floats   = document.querySelectorAll('.float-el');
const floatPos = Array.from(floats).map(() => ({ x: 0, y: 0 }));

if (!isMobile) {
  let lmx = window.innerWidth/2, lmy = window.innerHeight/2, pRaf = null;
  window.addEventListener('mousemove', (e) => {
    lmx = e.clientX; lmy = e.clientY;
    if (!pRaf) pRaf = requestAnimationFrame(tickParallax);
  }, { passive: true });
  function tickParallax() {
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    floats.forEach((el, i) => {
      const d = 0.006 + (i % 4) * 0.004;
      floatPos[i].x = lerp(floatPos[i].x, (lmx - cx) * d, 0.07);
      floatPos[i].y = lerp(floatPos[i].y, (lmy - cy) * d, 0.07);
      el.style.setProperty('--px', floatPos[i].x + 'px');
      el.style.setProperty('--py', floatPos[i].y + 'px');
    });
    pRaf = null;
  }
}

/* =============================================
   15. BRAND CARDS staggered pop
   ============================================= */
const brandObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.brand-card').forEach((c, i) => {
        setTimeout(() => { c.style.opacity='1'; c.style.transform='translateY(0) scale(1)'; }, i * 90);
      });
      brandObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.brands-grid').forEach(grid => {
  grid.querySelectorAll('.brand-card').forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(28px) scale(0.95)';
    c.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)';
  });
  brandObs.observe(grid);
});

/* =============================================
   16. TICKER — pause on hover
   ============================================= */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
  tickerTrack.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
}

/* =============================================
   17. LIGHTBOX (with animation)
   ============================================= */
const lightbox   = document.getElementById('lightbox');
const lbFrame    = document.getElementById('lb-frame');
const lbTitle    = document.getElementById('lb-title');
const lbClose    = document.getElementById('lb-close');
const lbExternal = document.getElementById('lb-external');

document.querySelectorAll('[data-pdf]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const src   = trigger.dataset.pdf;
    const title = trigger.dataset.title || 'Portfolio';
    if (!src) return;
    lbFrame.src = src;
    lbTitle.textContent = title;
    if (lbExternal) lbExternal.href = src.replace('/preview', '/view?usp=sharing');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
function closeLightbox() {
  lightbox.classList.add('closing');
  setTimeout(() => {
    lightbox.classList.remove('open', 'closing');
    lbFrame.src = '';
    document.body.style.overflow = '';
  }, 300);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* =============================================
   18. CONTACT FORM (direct AJAX)
   ============================================= */
const form       = document.getElementById('contact-form');
const successMsg = document.getElementById('submit-success');
const submitBtn  = form?.querySelector('button[type="submit"]');
const errorMsg   = document.getElementById('submit-error');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!submitBtn) return;
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending… ✦';
  if (errorMsg) errorMsg.style.display = 'none';
  const formData = {
    name:      form.name.value,
    email:     form.email.value,
    subject:   form.subject?.value || 'New Portfolio Inquiry',
    message:   form.message.value,
    _template: 'box'
  };
  try {
    const res  = await fetch('https://formsubmit.co/ajax/7991amy@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      launchConfetti();
      if (successMsg) { successMsg.classList.add('show'); setTimeout(() => successMsg.classList.remove('show'), 6000); }
      form.reset();
    } else { throw new Error(data.message || 'failed'); }
  } catch (err) {
    console.error(err);
    if (errorMsg) { errorMsg.style.display = 'block'; errorMsg.textContent = '✗ Please email: 7991amy@gmail.com'; }
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message ✦';
  }
});

/* =============================================
   19. CONFETTI BURST
   ============================================= */
const confettiCanvas = document.getElementById('confetti-canvas');
const confCtx        = confettiCanvas?.getContext('2d');
let   confettiPieces = [];
function launchConfetti() {
  confettiCanvas.style.display = 'block';
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiPieces = [];
  const colors = ['#8b0000','#c9a96e','#f5f0eb','#c0392b','#ffffff','#e8a060'];
  for (let i = 0; i < 220; i++) {
    confettiPieces.push({
      x: Math.random() * window.innerWidth, y: -20 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 10, vy: 2 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2, rotV: (Math.random()-0.5)*0.24,
      w: 6 + Math.random() * 10, h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 250 + Math.random() * 80
    });
  }
  animateConfetti();
}
function animateConfetti() {
  if (!confCtx) return;
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.life > 0);
  confettiPieces.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.13; p.vx *= 0.99; p.life -= 2;
    confCtx.save();
    confCtx.translate(p.x, p.y); confCtx.rotate(p.rot);
    confCtx.globalAlpha = Math.min(1, p.life / 60);
    confCtx.fillStyle   = p.color;
    confCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    confCtx.restore();
  });
  if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
  else confettiCanvas.style.display = 'none';
}

/* =============================================
   20. CV ENTRY HOVER
   ============================================= */
document.querySelectorAll('.cv-entry').forEach(entry => {
  const body = entry.querySelector('.cv-entry-body');
  if (!body) return;
  entry.addEventListener('mouseenter', () => { body.style.transform = 'translateX(8px)'; });
  entry.addEventListener('mouseleave', () => { body.style.transform = ''; });
});

/* =============================================
   21. SCROLL PROGRESS BAR
   ============================================= */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* =============================================
   22. DOODLE DRIFT  (desktop: mouse parallax)
   ============================================= */
const doodles = document.querySelectorAll('.doodle');
if (!isMobile && doodles.length) {
  const doodlePos = Array.from(doodles).map(() => ({ x: 0, y: 0 }));
  let dmx = window.innerWidth/2, dmy = window.innerHeight/2, dRaf = null;
  window.addEventListener('mousemove', (e) => {
    dmx = e.clientX; dmy = e.clientY;
    if (!dRaf) dRaf = requestAnimationFrame(tickDoodles);
  }, { passive: true });
  function tickDoodles() {
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    doodles.forEach((d, i) => {
      const depth = 0.015 + i * 0.008;
      doodlePos[i].x = lerp(doodlePos[i].x, (dmx-cx)*depth, 0.06);
      doodlePos[i].y = lerp(doodlePos[i].y, (dmy-cy)*depth, 0.06);
      d.style.transform = `translate(${doodlePos[i].x}px, ${doodlePos[i].y}px)`;
    });
    dRaf = null;
  }
}

/* =============================================
   23. GYROSCOPE PARALLAX  (mobile only)
   Tilting the phone moves the hero doodles +
   floating elements like a depth layer effect
   ============================================= */
if (isMobile) {
  const gyroEls  = [...document.querySelectorAll('.float-el, .doodle')];
  const gyroPos  = gyroEls.map(() => ({ x: 0, y: 0 }));
  let   gyroPermissionGranted = false;

  function startGyro() {
    window.addEventListener('deviceorientation', (e) => {
      // gamma = left/right tilt (-90 to 90), beta = front/back (-180 to 180)
      const gx = clamp(e.gamma || 0, -45, 45) / 45; // normalize -1 to 1
      const gy = clamp((e.beta  || 0) - 40, -45, 45) / 45; // normalize (offset 40° for natural hold)
      let gRaf = null;
      if (!gRaf) gRaf = requestAnimationFrame(() => {
        gyroEls.forEach((el, i) => {
          const depth = 0.5 + (i % 4) * 0.4;
          const tx = gx * 18 * depth;
          const ty = gy * 12 * depth;
          gyroPos[i].x = lerp(gyroPos[i].x, tx, 0.08);
          gyroPos[i].y = lerp(gyroPos[i].y, ty, 0.08);
          el.style.setProperty('--px', gyroPos[i].x + 'px');
          el.style.setProperty('--py', gyroPos[i].y + 'px');
        });
        gRaf = null;
      });
    }, { passive: true });
    gyroPermissionGranted = true;
  }

  // iOS 13+ requires permission request on user gesture
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // Ask on first tap anywhere
    document.addEventListener('touchend', function askGyro() {
      DeviceOrientationEvent.requestPermission()
        .then(state => { if (state === 'granted') startGyro(); })
        .catch(() => {});
      document.removeEventListener('touchend', askGyro);
    }, { passive: true, once: true });
  } else if (typeof DeviceOrientationEvent !== 'undefined') {
    // Android / non-permission browsers — start immediately
    startGyro();
  }
}

/* =============================================
   24. LANDSCAPE IMAGE DETECTION
   Adds .has-landscape-img to .card-thumb
   when the Drive thumbnail is wider than tall
   ============================================= */
document.querySelectorAll('.card-thumb img').forEach(img => {
  function checkOrientation() {
    if (img.naturalWidth > 0 && img.naturalWidth > img.naturalHeight) {
      img.closest('.card-thumb')?.classList.add('has-landscape-img');
    }
  }
  if (img.complete) {
    checkOrientation();
  } else {
    img.addEventListener('load', checkOrientation);
    img.addEventListener('error', () => {
      // fallback: show placeholder if Drive thumbnail fails to load
      img.style.display = 'none';
      const thumb = img.closest('.card-thumb');
      if (thumb) thumb.style.background = 'var(--gray)';
    });
  }
});

/* =============================================
   25. MOBILE: SWIPE-DOWN TO CLOSE LIGHTBOX
   ============================================= */
if (isMobile && lightbox) {
  let startY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 80) closeLightbox(); // swipe down 80px to close
  }, { passive: true });
}
