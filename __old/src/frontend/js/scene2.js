/* ========================================
   SCENE 2 — THE SETUP
   Animated cut-scene with geometric vehicles
   carrying text lines, building from wireframe
   to solid as the message progresses.
   ======================================== */

const Scene2 = (function () {
  'use strict';

  // ── Placeholder lines ──
  // Use <span class="em-handwritten">word</span> for handwriting emphasis
  // Use <span class="em-serif">word</span> for serif emphasis
  // Use <span class="em-bold">word</span> for bold emphasis
  const LINES = [
    `<span class="em-handwritten">Hi <span class="em-bold">Bella</span>...</span>`,
    `You're probably wondering what this <span class="em-serif">is</span>`,
    `And, if I'm honest...`,
    `I'm not too sure <span class="em-serif">either,</span>`,
    `but I'll give it my best go.`,
    `I did some thinking...`,
    `a <span class="em-serif">lot</span> of thinking`,
    `and I came to realise something...`,
    `that I was <span class="em-serif">wrong</span>.`,
    `<span class="em-handwritten">Very</span> wrong.`,
    `And so I created <span class="em-handwritten"><span class="em-bold">this</span></span>`,
    `for <span class="em-handwritten">you</span>`,
  ];

  // Shape intensity progression: wireframe → solid
  const SHAPE_INTENSITY = [
    'shape-wireframe',
    'shape-light',
    'shape-translucent',
    'shape-medium',
    'shape-solid-light',
    'shape-solid',
    'shape-solid',
    'shape-bold',
    'shape-strong',
    'shape-powerful',
    'shape-powerful',
    'shape-final',
  ];

  // Shape form variants — cycled through for variety
  const SHAPE_FORMS = [
    'shape-parallelogram',
    'shape-pill',
    'shape-rounded',
    'shape-soft-rect',
    'shape-diamond',
    'shape-wide',
    'shape-rounded',
    'shape-parallelogram',
    'shape-pill',
    'shape-soft-rect',
    'shape-wide',
    'shape-rounded',
  ];

  // Animation configs — each line enters uniquely
  const ENTER_ANIMATIONS = [
    // 1: Slide from left
    (wrapper) => ({
      from: { x: '-110vw', rotation: -3, opacity: 0 },
      to: { x: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    }),
    // 2: Drop from above
    (wrapper) => ({
      from: { y: '-100vh', rotation: 2, opacity: 0 },
      to: { y: 0, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
    }),
    // 3: Slide from right
    (wrapper) => ({
      from: { x: '110vw', rotation: 4, opacity: 0 },
      to: { x: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    }),
    // 4: Scale up from center
    (wrapper) => ({
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)' },
    }),
    // 5: Rise from below
    (wrapper) => ({
      from: { y: '100vh', opacity: 0 },
      to: { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
    }),
    // 6: Slide from left with arc
    (wrapper) => ({
      from: { x: '-110vw', y: -60, rotation: -5, opacity: 0 },
      to: { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
    }),
    // 7: Fade + slide right
    (wrapper) => ({
      from: { x: '80vw', opacity: 0, scale: 0.9 },
      to: { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
    }),
    // 8: Drop with bounce
    (wrapper) => ({
      from: { y: '-80vh', rotation: -3, opacity: 0 },
      to: { y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'bounce.out' },
    }),
    // 9: Slide from left, steady
    (wrapper) => ({
      from: { x: '-100vw', opacity: 0 },
      to: { x: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
    }),
    // 10: Rise with weight
    (wrapper) => ({
      from: { y: '90vh', scale: 0.95, opacity: 0 },
      to: { y: 0, scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out' },
    }),
    // 11: Scale from point
    (wrapper) => ({
      from: { scale: 0.3, opacity: 0, rotation: 2 },
      to: { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'power3.out' },
    }),
    // 12: Slide from right, final — with presence
    (wrapper) => ({
      from: { x: '100vw', opacity: 0 },
      to: { x: 0, opacity: 1, duration: 1.1, ease: 'power2.out' },
    }),
  ];

  // Exit animations — how each line leaves
  const EXIT_ANIMATIONS = [
    { x: '-110vw', rotation: -4, opacity: 0, duration: 0.6, ease: 'power2.in' },
    { y: '-100vh', opacity: 0, duration: 0.55, ease: 'power2.in' },
    { x: '110vw', rotation: 3, opacity: 0, duration: 0.6, ease: 'power2.in' },
    { scale: 0, opacity: 0, duration: 0.5, ease: 'power2.in' },
    { y: '100vh', opacity: 0, duration: 0.6, ease: 'power2.in' },
    { x: '-100vw', y: 40, opacity: 0, duration: 0.6, ease: 'power2.in' },
    { x: '100vw', opacity: 0, duration: 0.55, ease: 'power2.in' },
    { y: '-90vh', opacity: 0, duration: 0.55, ease: 'power2.in' },
    { x: '-100vw', opacity: 0, duration: 0.5, ease: 'power2.in' },
    { y: '90vh', opacity: 0, duration: 0.6, ease: 'power2.in' },
    { scale: 0.3, opacity: 0, duration: 0.5, ease: 'power2.in' },
    // Last line: no exit — it stays
    null,
  ];

  // Timing — hold duration per line, varies by emotional weight (seconds)
  const HOLD_DURATIONS = [
    2.5,  // 1: "Hi Bella..." — opener, let it land
    2.0,  // 2: "You're probably wondering..." — conversational
    2.0,  // 3: "And, if I'm honest..." — anticipation
    2.2,  // 4: "I'm not too sure either" — playful beat
    1.8,  // 5: "but I'll give it my best go." — transition
    4.2,  // 6+7 STACKED: "I did some thinking..." / "a lot of thinking..."
    0,    // 7: (paired with 6, skip)
    2.5,  // 8: "and I came to realise something..." — buildup
    3.2,  // 9+10 STACKED: "that I was wrong." / "Very wrong." — heavy
    0,    // 10: (paired with 9, skip)
    2.2,  // 11: "And so I created this" — building
    7.5,  // 12: "for you" — final, stays on screen
  ];

  // Stacked line pairs (0-indexed): first → second
  const STACKED_WITH = { 5: 6, 8: 9 };
  const STACKED_SECONDS = new Set([6, 9]);

  const PAUSE_BETWEEN = 0.4;

  let stage;
  let wrappers = [];

  // ── AMBIENT PARTICLES ──
  const AMBIENT_COLORS = [
    'rgba(200, 175, 215, 0.15)',
    'rgba(215, 185, 200, 0.12)',
    'rgba(180, 200, 220, 0.1)',
    'rgba(220, 195, 180, 0.1)',
    'rgba(190, 210, 200, 0.12)',
  ];

  function createAmbientParticles() {
    const container = document.getElementById('scene2Ambient');
    if (!container) return;
    container.innerHTML = '';

    const count = 15 + Math.floor(Math.random() * 10);

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('ambient-particle');

      const size = 4 + Math.random() * 12;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)];
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;

      container.appendChild(p);

      // Slow drifting animation
      const duration = 8 + Math.random() * 12;
      const xDrift = (Math.random() - 0.5) * 120;
      const yDrift = (Math.random() - 0.5) * 80;

      gsap.set(p, { opacity: 0 });
      gsap.to(p, {
        opacity: 0.4 + Math.random() * 0.4,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 3,
      });

      gsap.to(p, {
        x: xDrift,
        y: yDrift,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 4,
      });
    }
  }

  // ── SOUND DESIGN ──
  let audioCtx2;
  function initAudio2() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx2) audioCtx2 = new Ctx();
  }

  function playWhoosh(delay, intensity) {
    if (!audioCtx2) return;
    const time = audioCtx2.currentTime + delay;

    // Filtered noise burst — like a soft whoosh
    const bufLen = audioCtx2.sampleRate * 0.25;
    const buf = audioCtx2.createBuffer(1, bufLen, audioCtx2.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const src = audioCtx2.createBufferSource();
    src.buffer = buf;

    const filter = audioCtx2.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600 + intensity * 200, time);
    filter.Q.setValueAtTime(0.8, time);

    const gain = audioCtx2.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06 + intensity * 0.04, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx2.destination);
    src.start(time);
  }

  // ── PROGRESS INDICATOR ──
  function updateProgress(index, total) {
    const fill = document.getElementById('progressFill');
    if (!fill) return;
    const pct = ((index + 1) / total) * 100;
    fill.style.width = `${pct}%`;
  }

  function showProgress() {
    const el = document.getElementById('scene2Progress');
    if (el) {
      gsap.to(el, { opacity: 1, duration: 0.8, delay: 0.5 });
    }
  }

  function hideProgress() {
    const el = document.getElementById('scene2Progress');
    if (el) {
      gsap.to(el, { opacity: 0, duration: 0.5 });
    }
  }

  // ── Escort object configs per line ──
  // Each line gets 2-4 escort objects that travel with it then fly past
  const ESCORT_COLORS = [
    ['rgba(200, 170, 215, 0.5)', 'rgba(170, 200, 220, 0.4)'],
    ['rgba(190, 160, 210, 0.45)', 'rgba(210, 180, 190, 0.4)'],
    ['rgba(180, 150, 200, 0.5)', 'rgba(200, 175, 170, 0.45)'],
    ['rgba(175, 145, 195, 0.5)', 'rgba(170, 195, 185, 0.4)'],
    ['rgba(170, 140, 195, 0.55)', 'rgba(195, 170, 165, 0.45)'],
    ['rgba(165, 135, 190, 0.5)', 'rgba(165, 190, 205, 0.45)'],
    ['rgba(160, 125, 190, 0.55)', 'rgba(190, 160, 175, 0.5)'],
    ['rgba(155, 120, 185, 0.55)', 'rgba(185, 155, 195, 0.5)'],
    ['rgba(150, 110, 180, 0.6)', 'rgba(180, 145, 190, 0.5)'],
    ['rgba(145, 105, 178, 0.6)', 'rgba(175, 140, 185, 0.55)'],
    ['rgba(140, 100, 175, 0.6)', 'rgba(170, 130, 185, 0.55)'],
    ['rgba(135, 92, 170, 0.65)', 'rgba(165, 125, 180, 0.6)'],
  ];

  const ESCORT_TYPES = [
    ['escort-dot', 'escort-circle', 'escort-bar'],
    ['escort-diamond', 'escort-pill', 'escort-dot'],
    ['escort-ring', 'escort-bar', 'escort-diamond'],
    ['escort-circle', 'escort-dot', 'escort-pill'],
    ['escort-bar', 'escort-ring', 'escort-dot', 'escort-diamond'],
    ['escort-pill', 'escort-circle', 'escort-bar'],
    ['escort-diamond', 'escort-dot', 'escort-ring'],
    ['escort-bar', 'escort-pill', 'escort-circle', 'escort-dot'],
    ['escort-ring', 'escort-diamond', 'escort-bar'],
    ['escort-circle', 'escort-pill', 'escort-dot', 'escort-ring'],
    ['escort-dot', 'escort-bar', 'escort-diamond', 'escort-pill'],
    ['escort-circle', 'escort-ring', 'escort-bar', 'escort-diamond'],
  ];

  // ── Create escort objects for a line ──
  function createEscorts(index) {
    const types = ESCORT_TYPES[index] || ESCORT_TYPES[0];
    const colors = ESCORT_COLORS[index] || ESCORT_COLORS[0];
    const escorts = [];

    types.forEach((type, i) => {
      const el = document.createElement('div');
      el.classList.add('escort-obj', type);
      el.style.background = colors[i % colors.length];
      if (type === 'escort-ring') {
        el.style.background = 'transparent';
        el.style.borderColor = colors[i % colors.length];
      }
      // Random offset from center
      const offsetX = (Math.random() - 0.5) * 300;
      const offsetY = (Math.random() - 0.5) * 120;
      el.style.left = `calc(50% + ${offsetX}px)`;
      el.style.top = `calc(50% + ${offsetY}px)`;
      escorts.push(el);
    });

    return escorts;
  }

  // ── Animate escorts: enter with main block, stay with it ──
  function animateEscorts(escorts, enterConfig, timeline, enterTime, index) {
    const enterFrom = enterConfig.from;
    const duration = enterConfig.to.duration;

    escorts.forEach((el, i) => {
      const stagger = i * 0.06;

      // Enter: same direction as the main block
      const fromProps = {};
      if (enterFrom.x) fromProps.x = enterFrom.x;
      if (enterFrom.y) fromProps.y = enterFrom.y;
      if (enterFrom.scale !== undefined) fromProps.scale = enterFrom.scale * 0.5;
      fromProps.opacity = 0;

      gsap.set(el, fromProps);

      // Move in and stay, then breathe
      timeline.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.7 + Math.random() * 0.3,
        duration: duration - 0.1,
        ease: 'power2.out',
        onComplete: () => {
          // Add breathing micro-animation
          el.style.animationDelay = `${Math.random() * 2}s`;
          el.classList.add('escort-breathing');
        },
      }, enterTime + stagger);
    });
  }

  // ── Exit escorts along with the main block ──
  function exitEscorts(escorts, exitConfig, timeline, exitTime) {
    if (!exitConfig) return;
    escorts.forEach((el, i) => {
      const stagger = i * 0.04;
      timeline.to(el, {
        ...exitConfig,
        duration: exitConfig.duration - 0.05,
      }, exitTime + stagger);
    });
  }

  // ── Create a line wrapper with shape + text ──
  function createLineWrapper(text, index) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('scene2-line-wrapper');

    const shape = document.createElement('div');
    shape.classList.add('scene2-shape');
    // Intensity based on progression
    shape.classList.add(SHAPE_INTENSITY[index] || 'shape-final');
    // Form variant
    shape.classList.add(SHAPE_FORMS[index] || 'shape-rounded');

    const line = document.createElement('p');
    line.classList.add('scene2-line');
    line.innerHTML = text; // innerHTML to support <span> emphasis tags

    wrapper.appendChild(shape);
    wrapper.appendChild(line);

    return wrapper;
  }

  // ── Build the scroll-back view ──
  function buildScrollView() {
    const scrollContent = document.getElementById('scene2ScrollContent');
    scrollContent.innerHTML = '';

    LINES.forEach((text, i) => {
      const p = document.createElement('p');
      p.classList.add('scene2-scroll-line');
      p.innerHTML = text; // innerHTML to support <span> emphasis tags
      scrollContent.appendChild(p);
    });
  }

  // ── Main animation sequence ──
  function playSequence() {
    stage = document.getElementById('scene2Stage');
    stage.innerHTML = '';

    initAudio2();
    showProgress();

    const masterTl = gsap.timeline({
      onComplete: () => {
        hideProgress();
        showScrollView();
      }
    });

    let currentTime = 0.5; // initial pause
    const total = LINES.length;

    for (let i = 0; i < total; i++) {
      // Skip if this is the second line in a stacked pair
      if (STACKED_SECONDS.has(i)) continue;

      const isStacked = STACKED_WITH.hasOwnProperty(i);
      const pairedIndex = isStacked ? STACKED_WITH[i] : null;

      // ── Primary wrapper ──
      const wrapper = createLineWrapper(LINES[i], i);
      stage.appendChild(wrapper);
      wrappers.push(wrapper);

      const escorts = createEscorts(i);
      escorts.forEach(e => stage.appendChild(e));

      const enterConfig = ENTER_ANIMATIONS[i](wrapper);
      const exitConfig = EXIT_ANIMATIONS[i];
      const intensity = i / (total - 1);

      gsap.set(wrapper, enterConfig.from);

      // Sound + progress
      masterTl.call(() => {
        playWhoosh(0, intensity);
        updateProgress(i, total);
      }, null, currentTime);

      if (isStacked) {
        // ── STACKED PAIR ──
        // First line enters and rests slightly above center
        const enterTo1 = { ...enterConfig.to, y: (enterConfig.to.y || 0) - 35 };
        masterTl.to(wrapper, enterTo1, currentTime);
        animateEscorts(escorts, enterConfig, masterTl, currentTime, i);
        currentTime += enterConfig.to.duration;

        // Second line enters shortly after, rests slightly below center
        const wrapper2 = createLineWrapper(LINES[pairedIndex], pairedIndex);
        stage.appendChild(wrapper2);
        wrappers.push(wrapper2);

        const escorts2 = createEscorts(pairedIndex);
        escorts2.forEach(e => stage.appendChild(e));

        const enterConfig2 = ENTER_ANIMATIONS[pairedIndex](wrapper2);
        const intensity2 = pairedIndex / (total - 1);

        gsap.set(wrapper2, enterConfig2.from);

        const enterStart2 = currentTime + 0.25; // slight stagger
        masterTl.call(() => {
          playWhoosh(0, intensity2);
          updateProgress(pairedIndex, total);
        }, null, enterStart2);

        const enterTo2 = { ...enterConfig2.to, y: (enterConfig2.to.y || 0) + 35 };
        masterTl.to(wrapper2, enterTo2, enterStart2);
        animateEscorts(escorts2, enterConfig2, masterTl, enterStart2, pairedIndex);
        currentTime = enterStart2 + enterConfig2.to.duration;

        // Hold both together
        currentTime += HOLD_DURATIONS[i];

        // Exit both together (slight stagger for organic feel)
        if (exitConfig) {
          masterTl.to(wrapper, exitConfig, currentTime);
          exitEscorts(escorts, exitConfig, masterTl, currentTime);
        }
        const exitConfig2 = EXIT_ANIMATIONS[pairedIndex];
        if (exitConfig2) {
          masterTl.to(wrapper2, exitConfig2, currentTime + 0.06);
          exitEscorts(escorts2, exitConfig2, masterTl, currentTime + 0.06);
        }

        const exitDur = Math.max(
          exitConfig ? exitConfig.duration : 0,
          exitConfig2 ? exitConfig2.duration : 0
        );
        currentTime += exitDur + PAUSE_BETWEEN;

      } else {
        // ── SINGLE LINE ──
        masterTl.to(wrapper, enterConfig.to, currentTime);
        animateEscorts(escorts, enterConfig, masterTl, currentTime, i);
        currentTime += enterConfig.to.duration;

        // Hold — variable per line
        currentTime += HOLD_DURATIONS[i];

        // Exit (unless last line)
        if (exitConfig) {
          masterTl.to(wrapper, exitConfig, currentTime);
          exitEscorts(escorts, exitConfig, masterTl, currentTime);
          currentTime += exitConfig.duration + PAUSE_BETWEEN;
        }
      }
    }
  }

  // ── Show scrollable review after playback ──
  function showScrollView() {
    const stage = document.getElementById('scene2Stage');
    const scroll = document.getElementById('scene2Scroll');
    const continueEl = document.getElementById('scene2Continue');

    // Fade out stage
    gsap.to(stage, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        stage.style.display = 'none';
      }
    });

    // Show scroll view
    scroll.classList.add('active');
    gsap.to(scroll, {
      opacity: 1,
      duration: 0.6,
      delay: 0.5,
    });

    // Stagger in each scroll line
    const scrollLines = scroll.querySelectorAll('.scene2-scroll-line');
    gsap.to(scrollLines, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.8,
      ease: 'power2.out',
      onStart: function () {
        scrollLines.forEach(el => {
          gsap.set(el, { y: 15 });
        });
      }
    });

    // Show continue hint
    gsap.to(continueEl, {
      opacity: 1,
      duration: 0.8,
      delay: 1.5,
    });

    // Wire continue → Scene 3
    continueEl.style.cursor = 'pointer';
    continueEl.addEventListener('click', () => {
      if (typeof Scene3 !== 'undefined' && Scene3.transitionIn) {
        continueEl.style.pointerEvents = 'none';
        Scene3.transitionIn();
      }
    });
  }

  // ── Transition from Scene 1 into Scene 2 ──
  function transitionIn() {
    const scene1Reveal = document.getElementById('revealContainer');
    const scene2 = document.getElementById('scene2');

    buildScrollView();
    createAmbientParticles();

    // Throw scene 1 to the left
    gsap.to(scene1Reveal, {
      x: '-120vw',
      rotation: -8,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        scene1Reveal.style.display = 'none';
      }
    });

    // Slide scene 2 in from the right
    scene2.classList.add('active');
    gsap.fromTo(scene2,
      { x: '100%', opacity: 0 },
      {
        x: '0%',
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2,
        onComplete: () => {
          // Start the line-by-line sequence after landing
          setTimeout(() => playSequence(), 600);
        }
      }
    );
  }

  return { transitionIn };

})();
