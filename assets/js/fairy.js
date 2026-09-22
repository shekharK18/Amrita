/* ============================================================
   FAIRY CURSOR — Amrita Portfolio
   A cute pixie fairy that follows the cursor with sparkle dust
   ============================================================ */

(function () {
  'use strict';

  /* ── Inject fairy styles ─────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #fairy-wrap {
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      top: 0; left: 0;
      width: 0; height: 0;
      will-change: transform;
    }

    /* Fairy body */
    #fairy {
      position: absolute;
      width: 48px;
      height: 56px;
      transform: translate(-50%, -110%);
      transition: none;
      filter: drop-shadow(0 0 6px rgba(255,182,193,0.9));
    }

    /* Idle bob */
    @keyframes fairy-bob {
      0%,100% { transform: translate(-50%, -110%) translateY(0px); }
      50%      { transform: translate(-50%, -110%) translateY(-7px); }
    }
    #fairy.idle { animation: fairy-bob 1.8s ease-in-out infinite; }

    /* Wing flap */
    @keyframes wing-flap-l {
      0%,100% { d: path('M24 20 Q6 10 2 22 Q8 28 24 24 Z'); }
      50%      { d: path('M24 20 Q4 6 0 18 Q6 25 24 24 Z'); }
    }
    @keyframes wing-flap-r {
      0%,100% { d: path('M24 20 Q42 10 46 22 Q40 28 24 24 Z'); }
      50%      { d: path('M24 20 Q44 6 48 18 Q42 25 24 24 Z'); }
    }
    .wing-l { animation: wing-flap-l 0.35s ease-in-out infinite alternate; }
    .wing-r { animation: wing-flap-r 0.35s ease-in-out infinite alternate; }

    /* Click burst */
    @keyframes fairy-click {
      0%  { transform: translate(-50%,-110%) scale(1) rotate(0deg); filter: drop-shadow(0 0 8px rgba(255,182,193,1)); }
      40% { transform: translate(-50%,-110%) scale(1.4) rotate(-20deg); filter: drop-shadow(0 0 18px rgba(255,215,0,1)); }
      70% { transform: translate(-50%,-110%) scale(0.9) rotate(15deg); }
      100%{ transform: translate(-50%,-110%) scale(1) rotate(0deg); filter: drop-shadow(0 0 6px rgba(255,182,193,0.9)); }
    }
    #fairy.clicked { animation: fairy-click 0.5s ease forwards; }

    /* Sparkle particle */
    .fairy-spark {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      width: 8px; height: 8px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: spark-life 0.9s ease-out forwards;
    }
    @keyframes spark-life {
      0%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
      100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
    }

    /* ✦ star sparkles */
    .fairy-star {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      font-size: 12px;
      animation: star-life 1.1s ease-out forwards;
      transform-origin: center;
    }
    @keyframes star-life {
      0%   { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
      100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0) rotate(180deg); }
    }

    /* Speech bubble on hover over links */
    #fairy-bubble {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-4px);
      background: rgba(255,255,255,0.95);
      border: 1.5px solid #f4a7b9;
      border-radius: 12px;
      padding: 4px 10px;
      font-size: 11px;
      color: #b5506a;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      font-family: 'Playfair Display', serif;
      box-shadow: 0 2px 10px rgba(244,167,185,0.35);
    }
    #fairy-bubble.show { opacity: 1; }
    #fairy-bubble::after {
      content: '';
      position: absolute;
      top: 100%; left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: #f4a7b9;
    }
  `;
  document.head.appendChild(style);

  /* ── Build fairy SVG ─────────────────────────────────────── */
  const wrap = document.createElement('div');
  wrap.id = 'fairy-wrap';

  wrap.innerHTML = `
    <div id="fairy">
      <svg viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg" width="48" height="56">
        <!-- Wings (back) -->
        <path class="wing-l" d="M24 20 Q6 10 2 22 Q8 28 24 24 Z"
              fill="rgba(255,200,220,0.65)" stroke="#f4a7b9" stroke-width="0.8"/>
        <path class="wing-r" d="M24 20 Q42 10 46 22 Q40 28 24 24 Z"
              fill="rgba(200,220,255,0.65)" stroke="#a7c4f4" stroke-width="0.8"/>

        <!-- Lower wings -->
        <path d="M24 26 Q10 26 8 34 Q16 34 24 30 Z"
              fill="rgba(255,200,220,0.45)" stroke="#f4a7b9" stroke-width="0.6"/>
        <path d="M24 26 Q38 26 40 34 Q32 34 24 30 Z"
              fill="rgba(200,220,255,0.45)" stroke="#a7c4f4" stroke-width="0.6"/>

        <!-- Dress / body -->
        <ellipse cx="24" cy="38" rx="9" ry="12"
                 fill="url(#dressGrad)" stroke="#e8889a" stroke-width="0.8"/>

        <!-- Waist sash -->
        <path d="M16 33 Q24 36 32 33" fill="none" stroke="#f4a7b9" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Head -->
        <circle cx="24" cy="17" r="8.5" fill="#fde8d0" stroke="#e8c4a0" stroke-width="0.8"/>

        <!-- Hair bun -->
        <ellipse cx="24" cy="9.5" rx="5" ry="3.5" fill="#7b4f2e"/>
        <circle cx="20" cy="8" r="2.5" fill="#7b4f2e"/>
        <circle cx="28" cy="8" r="2.5" fill="#7b4f2e"/>

        <!-- Hair flowing -->
        <path d="M16 14 Q12 20 14 26" fill="none" stroke="#7b4f2e" stroke-width="2" stroke-linecap="round"/>
        <path d="M32 14 Q36 20 34 26" fill="none" stroke="#7b4f2e" stroke-width="2" stroke-linecap="round"/>

        <!-- Eyes -->
        <ellipse cx="21" cy="17" rx="1.8" ry="2" fill="#3d2b1f"/>
        <ellipse cx="27" cy="17" rx="1.8" ry="2" fill="#3d2b1f"/>
        <!-- Eye shine -->
        <circle cx="21.7" cy="16.2" r="0.6" fill="white"/>
        <circle cx="27.7" cy="16.2" r="0.6" fill="white"/>

        <!-- Rosy cheeks -->
        <circle cx="18.5" cy="19.5" r="2.2" fill="rgba(255,150,150,0.3)"/>
        <circle cx="29.5" cy="19.5" r="2.2" fill="rgba(255,150,150,0.3)"/>

        <!-- Smile -->
        <path d="M21.5 21 Q24 23 26.5 21" fill="none" stroke="#c0706a" stroke-width="0.9" stroke-linecap="round"/>

        <!-- Wand arm -->
        <line x1="32" y1="25" x2="42" y2="14" stroke="#e8c4a0" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Wand tip star -->
        <text x="38" y="12" font-size="8" text-anchor="middle" fill="#FFD700">✦</text>

        <!-- Sparkle on dress hem -->
        <text x="16" y="50" font-size="7" fill="#f4a7b9" opacity="0.8">·</text>
        <text x="32" y="52" font-size="6" fill="#a7c4f4" opacity="0.8">·</text>

        <defs>
          <radialGradient id="dressGrad" cx="40%" cy="30%">
            <stop offset="0%" stop-color="#fce4f0"/>
            <stop offset="100%" stop-color="#e8a0b8"/>
          </radialGradient>
        </defs>
      </svg>
      <div id="fairy-bubble">✨ Hello!</div>
    </div>
  `;
  document.body.appendChild(wrap);

  /* ── State ───────────────────────────────────────────────── */
  const fairyEl   = wrap.querySelector('#fairy');
  const bubble    = wrap.querySelector('#fairy-bubble');
  let   targetX   = window.innerWidth  / 2;
  let   targetY   = window.innerHeight / 2;
  let   currentX  = targetX;
  let   currentY  = targetY;
  let   idleTimer = null;
  let   lastMoveT = 0;
  let   raf       = null;

  const SPARK_COLORS = ['#FFD700','#FF9EBB','#C8AAFF','#87CEEB','#FFB6C1','#FFF0A0'];
  const STARS        = ['✦','✧','✶','✸','⋆','·'];

  /* ── Mouse tracking ──────────────────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    targetX   = e.clientX;
    targetY   = e.clientY;
    lastMoveT = Date.now();

    fairyEl.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => fairyEl.classList.add('idle'), 1800);

    // occasional sparkle on move
    if (Math.random() < 0.28) emitSpark(e.clientX, e.clientY);
  });

  /* ── Click burst ─────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    fairyEl.classList.remove('clicked');
    void fairyEl.offsetWidth; // reflow
    fairyEl.classList.add('clicked');
    fairyEl.addEventListener('animationend', () => fairyEl.classList.remove('clicked'), { once: true });

    for (let i = 0; i < 10; i++) emitSpark(e.clientX, e.clientY, true);
    emitStars(currentX, currentY, 6);
  });

  /* ── Hover links / buttons → bubble ─────────────────────── */
  const bubblePhrases = ['✨ Oooh!','🌸 Pretty!','✦ Magical!','💫 Love it!','🪄 Wow!'];
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .portfolio-card')) {
      bubble.textContent = bubblePhrases[Math.floor(Math.random() * bubblePhrases.length)];
      bubble.classList.add('show');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .portfolio-card')) {
      bubble.classList.remove('show');
    }
  });

  /* ── Emit spark particle ─────────────────────────────────── */
  function emitSpark(x, y, burst = false) {
    const el = document.createElement('div');
    el.className = 'fairy-spark';
    const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    el.style.background = color;
    el.style.boxShadow  = `0 0 4px ${color}`;

    const spread  = burst ? 80 : 40;
    const angle   = Math.random() * Math.PI * 2;
    const dist    = (Math.random() * spread) + (burst ? 20 : 5);
    el.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
    el.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.width = el.style.height = (Math.random() * 6 + 4) + 'px';
    el.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  /* ── Emit star ✦ characters ──────────────────────────────── */
  function emitStars(x, y, count) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'fairy-star';
      el.textContent = STARS[Math.floor(Math.random() * STARS.length)];
      const angle = (Math.random() * Math.PI * 2);
      const dist  = Math.random() * 70 + 30;
      el.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      el.style.animationDuration = (Math.random() * 0.6 + 0.8) + 's';
      el.style.animationDelay    = (i * 0.05) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  /* ── Smooth follow loop ──────────────────────────────────── */
  function loop() {
    const ease = 0.08;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    wrap.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Tiny sparkle trail when moving
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const moving = Math.abs(dx) + Math.abs(dy) > 2;
    if (moving && Math.random() < 0.15) {
      emitSpark(currentX, currentY);
    }

    raf = requestAnimationFrame(loop);
  }
  loop();

  /* ── Entry animation ─────────────────────────────────────── */
  setTimeout(() => emitStars(currentX, currentY, 5), 800);
  setTimeout(() => fairyEl.classList.add('idle'), 3000);

})();

