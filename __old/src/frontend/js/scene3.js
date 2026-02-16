/* ========================================
   SCENE 3 — THE QUIZ
   Falling through nebula sky →
   paper floats in with wobble →
   pen hovers beside it
   ======================================== */

const Scene3 = (function () {
  'use strict';

  // ── STAR FIELD ──
  const STAR_COUNT = 280;
  const stars = [];
  let starCanvas, starCtx;
  let starAnimFrame;
  // Sky-drift offset (falling effect)
  let skyDriftY = 0;
  let skyDriftActive = false;
  let currentDriftSpeed = 0.00012; // current speed (will decelerate gradually)
  const SKY_DRIFT_SPEED_FAST = 0.00012;
  const SKY_DRIFT_SPEED_SLOW = 0.000015;
  let targetDriftSpeed = 0.00012;
  const DRIFT_LERP = 0.015; // how fast speed transitions (lower = more gradual)

  function initStars() {
    starCanvas = document.getElementById('scene3Stars');
    if (!starCanvas) return;
    starCtx = starCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const sizeSeed = Math.random();
      const r = sizeSeed < 0.6 ? 0.3 + Math.random() * 0.6
              : sizeSeed < 0.9 ? 0.8 + Math.random() * 1.0
              : 1.5 + Math.random() * 1.2;

      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: r,
        baseAlpha: 0.2 + Math.random() * 0.8,
        twinkleSpeed: 0.3 + Math.random() * 2.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.75
          ? `hsla(${190 + Math.random() * 80}, 50%, 85%, `
          : 'rgba(255, 255, 255, ',
        // Parallax depth: smaller stars drift slower
        depth: 0.3 + (r / 2.7) * 0.7,
      });
    }
  }

  function resizeCanvas() {
    if (!starCanvas) return;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function drawStars(time) {
    if (!starCtx) return;
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Smoothly interpolate drift speed toward target
    currentDriftSpeed += (targetDriftSpeed - currentDriftSpeed) * DRIFT_LERP;
    // Accumulate drift when active
    if (skyDriftActive) {
      skyDriftY += currentDriftSpeed * 16; // ~16ms per frame
    }

    stars.forEach(s => {
      const twinkle = Math.sin(time * 0.001 * s.twinkleSpeed + s.twinkleOffset);
      const alpha = s.baseAlpha * (0.5 + 0.5 * twinkle);
      const x = s.x * starCanvas.width;
      // Apply parallax drift — stars move upward (viewer falling)
      let rawY = (s.y - skyDriftY * s.depth);
      // Wrap around so stars reappear from bottom
      rawY = ((rawY % 1) + 1) % 1;
      const y = rawY * starCanvas.height;

      // Core dot
      starCtx.beginPath();
      starCtx.arc(x, y, s.r, 0, Math.PI * 2);
      starCtx.fillStyle = s.hue + alpha.toFixed(3) + ')';
      starCtx.fill();

      // Soft outer glow
      if (s.r > 0.8) {
        const gradient = starCtx.createRadialGradient(x, y, 0, x, y, s.r * 4);
        gradient.addColorStop(0, s.hue + (alpha * 0.2).toFixed(3) + ')');
        gradient.addColorStop(1, s.hue + '0)');
        starCtx.beginPath();
        starCtx.arc(x, y, s.r * 4, 0, Math.PI * 2);
        starCtx.fillStyle = gradient;
        starCtx.fill();
      }

      // Cross-shaped diffraction spike for brightest stars
      if (s.r > 1.4 && alpha > 0.5) {
        const spikeLen = s.r * 6;
        const spikeAlpha = alpha * 0.15;
        starCtx.strokeStyle = s.hue + spikeAlpha.toFixed(3) + ')';
        starCtx.lineWidth = 0.5;
        starCtx.beginPath();
        starCtx.moveTo(x - spikeLen, y);
        starCtx.lineTo(x + spikeLen, y);
        starCtx.moveTo(x, y - spikeLen);
        starCtx.lineTo(x, y + spikeLen);
        starCtx.stroke();
      }
    });

    starAnimFrame = requestAnimationFrame(drawStars);
  }

  function startStarAnimation() {
    starAnimFrame = requestAnimationFrame(drawStars);
  }

  function stopStarAnimation() {
    if (starAnimFrame) cancelAnimationFrame(starAnimFrame);
  }

  // ── SOUND DESIGN ──
  let audioCtx3;
  function initAudio3() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx3) audioCtx3 = new Ctx();
  }

  // Soft wind ambience
  function playWindAmbience() {
    if (!audioCtx3) return;
    const time = audioCtx3.currentTime;
    const duration = 6;

    const bufLen = audioCtx3.sampleRate * duration;
    const buf = audioCtx3.createBuffer(1, bufLen, audioCtx3.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.008;
    }

    const src = audioCtx3.createBufferSource();
    src.buffer = buf;

    const filter = audioCtx3.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);
    filter.Q.setValueAtTime(0.5, time);

    const gain = audioCtx3.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.04, time + 2);
    gain.gain.linearRampToValueAtTime(0.035, time + 4);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx3.destination);
    src.start(time);
  }

  // Soft paper flutter sound
  function playPaperFlutter() {
    if (!audioCtx3) return;
    const time = audioCtx3.currentTime;

    const bufLen = audioCtx3.sampleRate * 0.3;
    const buf = audioCtx3.createBuffer(1, bufLen, audioCtx3.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.008;
    }

    const src = audioCtx3.createBufferSource();
    src.buffer = buf;

    const filter = audioCtx3.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, time);
    filter.Q.setValueAtTime(1.5, time);

    const gain = audioCtx3.createGain();
    gain.gain.setValueAtTime(0.03, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx3.destination);
    src.start(time);
  }

  // Pen materialise — soft chime
  function playPenChime() {
    if (!audioCtx3) return;
    const time = audioCtx3.currentTime;

    const osc = audioCtx3.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, time);
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.15);

    const gain = audioCtx3.createGain();
    gain.gain.setValueAtTime(0.025, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx3.destination);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  // ── SHOOTING STARS ──
  function launchShootingStar() {
    const sky = document.getElementById('scene3Sky');
    if (!sky || sky.style.opacity === '0') return;

    const star = document.createElement('div');
    star.classList.add('shooting-star');

    const startX = 10 + Math.random() * 70;
    const startY = 5 + Math.random() * 30;
    const angle = 20 + Math.random() * 30;
    const distance = 150 + Math.random() * 200;
    const duration = 0.5 + Math.random() * 0.4;

    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    star.style.transform = `rotate(${angle}deg)`;

    sky.appendChild(star);

    gsap.fromTo(star,
      { x: 0, y: 0, opacity: 0 },
      {
        x: distance * Math.cos(angle * Math.PI / 180),
        y: distance * Math.sin(angle * Math.PI / 180),
        opacity: 0,
        duration: duration,
        ease: 'power1.in',
        onStart: () => { gsap.set(star, { opacity: 1 }); },
        onUpdate: function () {
          const prog = this.progress();
          if (prog < 0.2) star.style.opacity = prog * 5;
          else if (prog > 0.7) star.style.opacity = (1 - prog) * 3.3;
        },
        onComplete: () => { star.remove(); },
      }
    );
  }

  let shootingStarInterval;
  function startShootingStars() {
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000;
      shootingStarInterval = setTimeout(() => {
        launchShootingStar();
        scheduleNext();
      }, delay);
    };
    setTimeout(() => {
      launchShootingStar();
      scheduleNext();
    }, 3000 + Math.random() * 2000);
  }

  // ── FIREFLIES (scattered across the sky) ──
  function createFireflies() {
    const container = document.getElementById('scene3Fireflies');
    if (!container) return;
    container.innerHTML = '';

    const count = 8 + Math.floor(Math.random() * 6);

    for (let i = 0; i < count; i++) {
      const fly = document.createElement('div');
      fly.classList.add('firefly');

      const size = 3 + Math.random() * 4;
      fly.style.width = `${size}px`;
      fly.style.height = `${size}px`;
      // Scattered across the whole sky, not just bottom
      fly.style.left = `${5 + Math.random() * 90}%`;
      fly.style.top = `${10 + Math.random() * 80}%`;

      const glow = document.createElement('div');
      glow.classList.add('firefly-glow');
      glow.style.animationDelay = `${Math.random() * 2}s`;
      glow.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      fly.appendChild(glow);

      container.appendChild(fly);

      // Wandering flight path
      const driftX = (Math.random() - 0.5) * 120;
      const driftY = (Math.random() - 0.5) * 80;
      const dur = 6 + Math.random() * 8;

      gsap.to(fly, {
        x: driftX,
        y: driftY,
        duration: dur,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 3,
      });

      // Fade in
      gsap.fromTo(fly,
        { opacity: 0 },
        { opacity: 1, duration: 2, delay: 1 + Math.random() * 3 }
      );
    }
  }

  // ── PAPER WOBBLE — continuous subtle 3D bend ──
  let paperWobbleTween;
  function startPaperWobble(paperInner) {
    paperWobbleTween = gsap.timeline({ repeat: -1, yoyo: true });

    paperWobbleTween.to(paperInner, {
      rotateX: 3,
      rotateY: -2,
      skewX: 0.5,
      duration: 3,
      ease: 'sine.inOut',
    });
    paperWobbleTween.to(paperInner, {
      rotateX: -2,
      rotateY: 3,
      skewX: -0.8,
      duration: 3.5,
      ease: 'sine.inOut',
    });
    paperWobbleTween.to(paperInner, {
      rotateX: 1.5,
      rotateY: -1,
      skewX: 0.3,
      duration: 2.8,
      ease: 'sine.inOut',
    });
  }

  // ── PAPER FLOAT — physics-style gravity bob ──
  // Paper slowly sinks under its own weight, then buoyancy corrects it
  let paperFloatTween;
  function startPaperFloat(paper) {
    paperFloatTween = gsap.timeline({ repeat: -1 });

    // Sink slowly (gravity pulling)
    paperFloatTween.to(paper, {
      y: '+=12',
      rotation: 0.8,
      duration: 4.5,
      ease: 'power1.in',
    });
    // Buoyancy kicks in — float back up past center
    paperFloatTween.to(paper, {
      y: '-=16',
      rotation: -0.5,
      duration: 3.8,
      ease: 'power2.out',
    });
    // Overshoot settle
    paperFloatTween.to(paper, {
      y: '+=7',
      rotation: 0.3,
      duration: 3.0,
      ease: 'sine.inOut',
    });
    // Drift sideways slightly
    paperFloatTween.to(paper, {
      y: '-=4',
      x: '+=5',
      rotation: -0.2,
      duration: 4,
      ease: 'sine.inOut',
    });
    // Correct back
    paperFloatTween.to(paper, {
      y: '+=3',
      x: '-=6',
      rotation: 0.4,
      duration: 3.5,
      ease: 'sine.inOut',
    });
    // Return near original
    paperFloatTween.to(paper, {
      y: '-=2',
      x: '+=1',
      rotation: 0,
      duration: 2.5,
      ease: 'power1.inOut',
    });
  }

  // ── PEN FLOAT — physics-style gravity bob (offset from paper) ──
  let penHoverTween;
  function startPenHover(pen) {
    penHoverTween = gsap.timeline({ repeat: -1 });

    // Pen sinks under weight
    penHoverTween.to(pen, {
      y: '+=10',
      rotation: -11,
      duration: 3.8,
      ease: 'power1.in',
    });
    // Buoyancy lifts it back
    penHoverTween.to(pen, {
      y: '-=14',
      rotation: -18,
      duration: 3.2,
      ease: 'power2.out',
    });
    // Overshoot settle
    penHoverTween.to(pen, {
      y: '+=5',
      rotation: -14,
      duration: 2.8,
      ease: 'sine.inOut',
    });
    // Drift + tilt
    penHoverTween.to(pen, {
      y: '-=3',
      rotation: -19,
      duration: 3.5,
      ease: 'sine.inOut',
    });
    // Return near center
    penHoverTween.to(pen, {
      y: '+=2',
      rotation: -15,
      duration: 2.5,
      ease: 'power1.inOut',
    });
  }

  // ── NEBULA DRIFT — slow upward movement for falling illusion ──
  function startNebulaDrift() {
    const nebulae = document.querySelectorAll('.scene3-nebula-glow');
    nebulae.forEach((neb, i) => {
      // Each nebula drifts upward at slightly different speeds
      const speed = 25 + i * 8;
      gsap.to(neb, {
        y: `-=${speed}vh`,
        duration: 60,
        ease: 'none',
        repeat: -1,
      });
    });
  }

  // ── MAIN ANIMATION SEQUENCE ──
  function playScene3() {
    const scene3 = document.getElementById('scene3');
    const gradientBridge = document.getElementById('scene3GradientBridge');
    const sky = document.getElementById('scene3Sky');
    const paper = document.getElementById('scene3Paper');
    const paperInner = document.getElementById('scene3PaperInner');
    const pen = document.getElementById('scene3Pen');

    initAudio3();
    initStars();

    scene3.classList.add('active');

    const tl = gsap.timeline();

    // ── PHASE 1: Gradient bridge (pastel → nebula) ──
    tl.to(gradientBridge, {
      opacity: 1,
      duration: 2.0,
      ease: 'power2.inOut',
    });

    // ── PHASE 2: Reveal the nebula sky ──
    tl.to(sky, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.in',
      onStart: () => {
        startStarAnimation();
        startShootingStars();
        playWindAmbience();
      }
    }, '-=0.5');

    // Hide the gradient bridge once sky is visible
    tl.to(gradientBridge, {
      opacity: 0,
      duration: 0.8,
    }, '-=0.3');

    // ── PHASE 3: Falling through space ──
    // Start the parallax drift — stars and nebulae move upward
    tl.call(() => {
      skyDriftActive = true;
      startNebulaDrift();
    });

    // Hold while the sky drifts (viewer is falling through stars)
    tl.to({}, { duration: 3.5 });

    // Begin gradual deceleration of sky drift
    tl.call(() => {
      targetDriftSpeed = SKY_DRIFT_SPEED_SLOW;
    });

    // ── PHASE 4: Paper drifts into view from above ──
    // Paper starts well off-screen, hidden during the sky moment
    tl.set(paper, {
      top: '-500px',
      opacity: 0,
      rotation: -8,
    });

    // Paper fades in as it enters viewport
    tl.to(paper, {
      opacity: 1,
      duration: 0.4,
      ease: 'power1.in',
      onStart: () => {
        playPaperFlutter();
      },
    });

    // Paper drifts down to floating center with natural flutter
    tl.to(paper, {
      top: '50%',
      y: '-50%',
      rotation: 3,
      x: 12,
      duration: 3.2,
      ease: 'power2.out',
    }, '-=0.3');

    // Gentle flutter corrections
    tl.to(paper, {
      rotation: -1.5,
      x: -6,
      duration: 1.2,
      ease: 'sine.inOut',
    });

    tl.to(paper, {
      rotation: 0.8,
      x: 3,
      duration: 0.9,
      ease: 'sine.inOut',
    });

    // Settle into center
    tl.to(paper, {
      rotation: 0,
      x: 0,
      duration: 1.2,
      ease: 'power2.out',
    });

    // Start paper wobble (continuous 3D bend) + physics float
    tl.call(() => {
      gsap.set(paperInner, { transformStyle: 'preserve-3d' });
      startPaperWobble(paperInner);
      startPaperFloat(paper);
    });

    // Paper is now interactive
    tl.set(paper, { pointerEvents: 'auto' });

    // ── PHASE 5: Pen drops in from above (like paper) ──
    tl.set(pen, {
      top: '-200px',
      opacity: 0,
      rotation: -30,
      y: 0,
    }, '+=0.3');

    // Pen fades in as it enters viewport
    tl.to(pen, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.in',
      onStart: () => {
        playPenChime();
      },
    });

    // Pen drifts down to its resting spot beside the paper
    tl.to(pen, {
      top: '50%',
      y: '-50%',
      rotation: -18,
      duration: 2.8,
      ease: 'power2.out',
    }, '-=0.2');

    // Gentle settle
    tl.to(pen, {
      rotation: -15,
      duration: 0.8,
      ease: 'sine.inOut',
    });

    // Start pen idle hover
    tl.call(() => {
      startPenHover(pen);
    });

    // ── PHASE 6: Fireflies appear ──
    tl.call(() => {
      createFireflies();
    }, null, '+=0.3');

    // ── PHASE 7: Start the quiz after a breath ──
    tl.call(() => {
      setTimeout(() => startQuiz(), 1200);
    }, null, '+=0.5');
  }

  // ════════════════════════════════════════
  //  QUIZ ENGINE
  // ════════════════════════════════════════

  const QUIZ_DATA = [
    {
      id: 'q1',
      question: 'Where did I go wrong? (choose all four)',
      type: 'choice',
      selectAll: true,          // every option must be picked
      sorryFlyby: true,         // fly a "sorry :(" note after each pick
      options: [
        { label: 'A', text: 'Ignoring you' },
        { label: 'B', text: 'My ambiguity' },
        { label: 'C', text: 'Lack of communication' },
        { label: 'D', text: 'Being rude' },
      ],
    },
    {
      id: 'q2',
      question: 'Enough about me, how are you doing?',
      type: 'choice',
      options: [
        { label: 'A', text: "I'm alright" },
        { label: 'B', text: "I'm kinda sad" },
        { label: 'C', text: "I'm doing great!" },
        { label: 'D', text: '...' },
      ],
      // Special: option B triggers the "Nuh uh" flyby
      easterEgg: { optionIndex: 1 },
    },
    {
      id: 'q3',
      question: 'What do you want us to be?',
      type: 'text',
    },
  ];

  let currentQuestion = 0;
  const quizAnswers = {};

  function startQuiz() {
    renderQuestion(0);
  }

  // ── Render a question onto the paper ──
  function renderQuestion(index) {
    const paperInner = document.getElementById('scene3PaperInner');
    const q = QUIZ_DATA[index];

    // Build question HTML
    let html = `<p class="quiz-question">${q.question}</p>`;

    if (q.type === 'choice') {
      html += '<ul class="quiz-options">';
      q.options.forEach((opt, i) => {
        html += `
          <li class="quiz-option" data-index="${i}">
            <span class="option-label">${opt.label})</span> ${opt.text}
          </li>`;
      });
      html += '</ul>';
    } else if (q.type === 'text') {
      html += `
        <textarea class="quiz-textbox" placeholder="Write anything you want..." rows="4"></textarea>
        <button class="quiz-submit-btn">Send</button>`;
    }

    paperInner.innerHTML = html;

    // Wire up interactions
    if (q.type === 'choice') {
      const options = paperInner.querySelectorAll('.quiz-option');
      options.forEach(opt => {
        opt.addEventListener('click', () => handleChoiceSelect(opt, index));
      });
    } else if (q.type === 'text') {
      const btn = paperInner.querySelector('.quiz-submit-btn');
      const textarea = paperInner.querySelector('.quiz-textbox');
      btn.addEventListener('click', () => handleTextSubmit(textarea, index));
    }

    // Fade in the content
    gsap.fromTo(paperInner.children,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }

  // Track how many options have been picked on select-all questions
  const selectAllPicked = {};

  // ── Handle multiple-choice selection ──
  function handleChoiceSelect(optionEl, questionIndex) {
    const q = QUIZ_DATA[questionIndex];
    const allOptions = optionEl.parentElement.querySelectorAll('.quiz-option');

    // Prevent double-clicks on this option
    if (optionEl.classList.contains('selected')) return;

    // Disable all options while animating
    allOptions.forEach(o => o.style.pointerEvents = 'none');

    optionEl.classList.add('selected');
    const selectedIndex = parseInt(optionEl.dataset.index);

    // ── Select-all mode (Q1) ──
    if (q.selectAll) {
      if (!selectAllPicked[q.id]) selectAllPicked[q.id] = [];
      selectAllPicked[q.id].push(q.options[selectedIndex].text);

      const totalNeeded = q.options.length;
      const pickedCount = selectAllPicked[q.id].length;
      const allDone = pickedCount >= totalNeeded;

      // Draw pen circle, then fly "sorry :(" note
      drawPenCircle(optionEl, () => {
        const afterFlyby = () => {
          if (allDone) {
            // All options selected — store answer and advance
            quizAnswers[q.id] = selectAllPicked[q.id].join(', ');
            advanceToNextQuestion(questionIndex);
          } else {
            // Re-enable remaining un-selected options
            allOptions.forEach(o => {
              if (!o.classList.contains('selected')) {
                o.style.pointerEvents = 'auto';
              }
            });
          }
        };

        if (q.sorryFlyby) {
          launchSorryPaper(afterFlyby);
        } else {
          afterFlyby();
        }
      });
      return;
    }

    // ── Normal single-select mode ──
    quizAnswers[q.id] = q.options[selectedIndex].text;

    drawPenCircle(optionEl, () => {
      // Check for easter egg (Q2, option B = "I'm kinda sad")
      if (q.easterEgg && selectedIndex === q.easterEgg.optionIndex) {
        launchNuhUhPaper(() => {
          advanceToNextQuestion(questionIndex);
        });
      } else {
        advanceToNextQuestion(questionIndex);
      }
    });
  }

  // ── Draw hand-drawn circle SVG around selected option ──
  function drawPenCircle(optionEl, onComplete) {
    const pen = document.getElementById('scene3Pen');
    const paper = document.getElementById('scene3Paper');

    // Pause pen hover during animation
    if (penHoverTween) penHoverTween.pause();

    // Get option position relative to viewport
    const optRect = optionEl.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();

    // Move pen tip toward the option (approximate position)
    const penTargetX = paperRect.right + 10;
    const penTargetY = optRect.top + optRect.height / 2;

    // Create hand-drawn SVG circle
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('pen-circle-svg');
    svg.setAttribute('viewBox', `0 0 ${optRect.width + 16} ${optRect.height + 12}`);

    // Irregular ellipse path (hand-drawn look)
    const w = optRect.width + 10;
    const h = optRect.height + 6;
    const cx = w / 2;
    const cy = h / 2;
    const rx = w / 2 - 2;
    const ry = h / 2 - 1;
    // Wobbly ellipse via cubic beziers
    const d = `M ${cx + rx * 0.95} ${cy - ry * 0.1}
      C ${cx + rx * 1.02} ${cy - ry * 0.8},
        ${cx + rx * 0.3} ${cy - ry * 1.1},
        ${cx - rx * 0.2} ${cy - ry * 0.95}
      C ${cx - rx * 0.7} ${cy - ry * 0.85},
        ${cx - rx * 1.05} ${cy - ry * 0.2},
        ${cx - rx * 0.98} ${cy + ry * 0.15}
      C ${cx - rx * 1.0} ${cy + ry * 0.7},
        ${cx - rx * 0.4} ${cy + ry * 1.08},
        ${cx + rx * 0.1} ${cy + ry * 0.98}
      C ${cx + rx * 0.6} ${cy + ry * 1.0},
        ${cx + rx * 1.05} ${cy + ry * 0.3},
        ${cx + rx * 0.95} ${cy - ry * 0.1}`;

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.classList.add('circle-path');
    pathEl.setAttribute('d', d);
    svg.appendChild(pathEl);
    optionEl.appendChild(svg);

    // Measure path length for dash animation
    const pathLength = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = pathLength;
    pathEl.style.strokeDashoffset = pathLength;

    // Animate pen moving toward the option, then draw the circle
    const penTl = gsap.timeline();

    // Move pen to option area
    penTl.to(pen, {
      x: penTargetX - paper.getBoundingClientRect().right - 40,
      y: penTargetY - paper.getBoundingClientRect().top - paperRect.height / 2,
      rotation: -5,
      duration: 0.6,
      ease: 'power2.out',
    });

    // Draw the circle
    penTl.to(pathEl, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: 'power1.inOut',
    }, '-=0.1');

    // Pen returns toward rest position
    penTl.to(pen, {
      x: 0,
      y: 0,
      rotation: -15,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        if (penHoverTween) penHoverTween.resume();
        if (onComplete) onComplete();
      },
    }, '+=0.3');
  }

  // ── "sorry :(" flying paper easter egg (Q1) ──
  function launchSorryPaper(onComplete) {
    const sorry = document.getElementById('sorryPaper');
    if (!sorry) { if (onComplete) onComplete(); return; }

    const tl = gsap.timeline();

    tl.set(sorry, {
      bottom: '-200px',
      opacity: 0,
      rotation: -6,
      x: 0,
    });

    tl.to(sorry, {
      opacity: 1,
      duration: 0.3,
    });

    tl.to(sorry, {
      bottom: '120%',
      rotation: 10,
      x: 60,
      duration: 3.0,
      ease: 'none',
    }, '-=0.15');

    tl.to(sorry, {
      opacity: 0,
      duration: 0.4,
    }, '-=0.5');

    tl.call(() => {
      gsap.set(sorry, { bottom: '-200px', opacity: 0 });
      if (onComplete) onComplete();
    });
  }

  // ── "Nuh uh =D" flying paper easter egg ──
  function launchNuhUhPaper(onComplete) {
    const nuhuh = document.getElementById('nuhuhPaper');
    if (!nuhuh) { if (onComplete) onComplete(); return; }

    const tl = gsap.timeline();

    // Reset position
    tl.set(nuhuh, {
      bottom: '-200px',
      opacity: 0,
      rotation: 8,
      x: 0,
    });

    // Fly up from below — swoop across the screen and off the top
    tl.to(nuhuh, {
      opacity: 1,
      duration: 0.3,
    });

    tl.to(nuhuh, {
      bottom: '120%',
      rotation: -12,
      x: -80,
      duration: 3.0,
      ease: 'none',
    }, '-=0.15');

    // Fade out near the top
    tl.to(nuhuh, {
      opacity: 0,
      duration: 0.4,
    }, '-=0.5');

    tl.call(() => {
      // Reset for potential replay
      gsap.set(nuhuh, { bottom: '-200px', opacity: 0 });
      if (onComplete) onComplete();
    });
  }

  // ── Handle text submission (Q3) ──
  function handleTextSubmit(textarea, questionIndex) {
    const q = QUIZ_DATA[questionIndex];
    const value = textarea.value.trim();
    if (!value) {
      // Gentle shake if empty
      gsap.to(textarea, {
        x: [0, -5, 5, -3, 3, 0],
        duration: 0.4,
        ease: 'power2.out',
      });
      return;
    }

    quizAnswers[q.id] = value;

    // Disable inputs
    textarea.disabled = true;
    const btn = textarea.parentElement.querySelector('.quiz-submit-btn');
    if (btn) {
      btn.style.pointerEvents = 'none';
      btn.textContent = 'Sent ♡';
      gsap.to(btn, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 });
    }

    // Submit all answers to backend
    submitAnswers(() => {
      // Quiz is done — advance to next scene or show ending
      setTimeout(() => {
        onQuizComplete();
      }, 2000);
    });
  }

  // ── Submit answers to backend ──
  function submitAnswers(onComplete) {
    // Always use same-origin (backend serves the frontend)
    const url = '/api/answer';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizAnswers),
    })
    .then(r => r.json())
    .then(() => { if (onComplete) onComplete(); })
    .catch(() => {
      // If backend is down, still proceed
      console.warn('Could not save answers (backend offline?)');
      if (onComplete) onComplete();
    });
  }

  // ── Advance to next question (paper swap) ──
  function advanceToNextQuestion(currentIdx) {
    const paper = document.getElementById('scene3Paper');
    const paperInner = document.getElementById('scene3PaperInner');
    const nextIdx = currentIdx + 1;

    if (nextIdx >= QUIZ_DATA.length) {
      // Last question was a choice — submit and end
      submitAnswers(() => {
        setTimeout(() => onQuizComplete(), 1500);
      });
      return;
    }

    // Pause float/wobble during swap
    if (paperFloatTween) paperFloatTween.pause();
    if (paperWobbleTween) paperWobbleTween.pause();

    const swapTl = gsap.timeline();

    // Current paper floats away upward and fades
    swapTl.to(paper, {
      top: '-500px',
      rotation: 6,
      x: -30,
      opacity: 0,
      duration: 1.4,
      ease: 'power2.in',
    });

    // Brief pause
    swapTl.to({}, { duration: 0.3 });

    // Reset paper content for next question
    swapTl.call(() => {
      currentQuestion = nextIdx;
      renderQuestion(nextIdx);
    });

    // New paper drops in from above
    swapTl.set(paper, {
      top: '-500px',
      rotation: -6,
      x: 15,
      opacity: 0,
      y: 0,
    });

    swapTl.to(paper, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.in',
      onStart: () => { playPaperFlutter(); },
    });

    swapTl.to(paper, {
      top: '50%',
      y: '-50%',
      rotation: 2,
      x: 8,
      duration: 2.4,
      ease: 'power2.out',
    }, '-=0.2');

    // Settle
    swapTl.to(paper, {
      rotation: 0,
      x: 0,
      duration: 0.8,
      ease: 'sine.inOut',
    });

    // Resume float/wobble
    swapTl.call(() => {
      if (paperFloatTween) paperFloatTween.restart();
      if (paperWobbleTween) paperWobbleTween.restart();
    });
  }

  // ── Quiz complete — placeholder for Scene 4 transition ──
  function onQuizComplete() {
    console.log('Quiz complete! Answers:', quizAnswers);
    // TODO: Transition to Scene 4
  }

  // ── Transition from Scene 2 into Scene 3 ──
  function transitionIn() {
    const scene2 = document.getElementById('scene2');

    // Fade out Scene 2
    gsap.to(scene2, {
      opacity: 0,
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        scene2.style.display = 'none';
        // Begin Scene 3 sequence
        setTimeout(() => playScene3(), 300);
      },
    });
  }

  return { transitionIn };

})();
