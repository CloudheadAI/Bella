/* ========================================
   SCENE 1 — THE DISGUISE & THE FALL
   ======================================== */

(function () {
  'use strict';

  // ── Palette for random gradient blobs ──
  const PASTEL_COLORS = [
    '#f0d4e1', // blush pink
    '#d4c4f0', // soft lavender
    '#c4e0f0', // powder blue
    '#f0e4c4', // warm cream
    '#d4f0e0', // mint
    '#f0c4d4', // rose
    '#e0d4f0', // lilac
    '#c4d8f0', // periwinkle
  ];

  // ── Generate random gradient blobs ──
  function createGradientBlobs() {
    const container = document.getElementById('gradientBg');
    const blobCount = 5 + Math.floor(Math.random() * 4); // 5-8 blobs

    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement('div');
      blob.classList.add('gradient-blob');

      const size = 200 + Math.random() * 400; // 200-600px
      const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      blob.style.background = color;
      blob.style.left = `${x}%`;
      blob.style.top = `${y}%`;
      blob.style.transform = `translate(-50%, -50%)`;
      blob.style.opacity = 0.25 + Math.random() * 0.3;

      container.appendChild(blob);
    }
  }

  // ── Sound effects ──
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
  }

  function playThud(delay) {
    if (!audioCtx) return;
    const time = audioCtx.currentTime + delay;

    // Low thud oscillator
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60 + Math.random() * 40, time);
    osc.frequency.exponentialRampToValueAtTime(20, time + 0.15);
    gain.gain.setValueAtTime(0.12 + Math.random() * 0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);

    // Soft noise burst for texture
    const bufferSize = audioCtx.sampleRate * 0.08;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }
    const noise = audioCtx.createBufferSource();
    const noiseGain = audioCtx.createGain();
    noise.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(time);
  }

  // ── Shuffle array (Fisher-Yates) ──
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── THE FALL ──
  function triggerFall() {
    initAudio();

    // Collect all falling elements
    const formCard = document.getElementById('formCard');
    const formTitle = formCard.querySelector('.form-title');
    const fallElements = [...formCard.querySelectorAll('[data-fall]')];
    const allFallItems = [formTitle, ...fallElements];

    // Include gradient blobs
    const blobs = [...document.querySelectorAll('.gradient-blob')];

    // Combine and shuffle for random order
    const everythingFalls = shuffle([...allFallItems, ...blobs]);

    // Also drop the form card border/bg itself — after everything inside falls
    const viewportH = window.innerHeight;

    // Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide form entirely
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('gradientBg').style.display = 'none';
        // Trigger reveal
        triggerReveal();
      }
    });

    // Each element falls with random delay, rotation, and physics
    everythingFalls.forEach((el, i) => {
      const delay = i * (0.06 + Math.random() * 0.08); // stagger with randomness
      const rotation = (Math.random() - 0.5) * 45; // -22.5 to 22.5 degrees
      const fallDistance = viewportH + 200 + Math.random() * 200;
      const xDrift = (Math.random() - 0.5) * 80; // slight horizontal drift

      // Play sound per element (with slight variation)
      const soundDelay = delay + 0.3; // sound when it "lands"
      playThud(soundDelay);

      tl.to(el, {
        y: fallDistance,
        x: xDrift,
        rotation: rotation,
        duration: 0.5 + Math.random() * 0.3,
        ease: 'power2.in', // accelerating like real gravity
        opacity: 0.6,
      }, delay);
    });

    // Drop the card border itself last
    const cardDelay = everythingFalls.length * 0.07 + 0.15;
    playThud(cardDelay + 0.3);
    tl.to(formCard, {
      y: viewportH + 300,
      rotation: (Math.random() - 0.5) * 20,
      duration: 0.6,
      ease: 'power2.in',
      opacity: 0,
    }, cardDelay);
  }

  // ── THE REVEAL ──
  function triggerReveal() {
    const container = document.getElementById('revealContainer');
    const text = document.getElementById('revealText');
    const arrowSvg = document.getElementById('arrowSvg');
    const arrowPath = document.getElementById('arrowPath');
    const arrowHead = document.getElementById('arrowHead');
    const btn = document.getElementById('nextBtn');

    container.style.opacity = '1';
    container.classList.add('active');

    const tl = gsap.timeline({ delay: 1.0 });

    // 1. "second chance?" fades in
    tl.to(text, {
      opacity: 1,
      duration: 1.4,
      ease: 'power2.out',
    });

    // 2. Arrow draws itself in
    tl.to(arrowSvg, {
      opacity: 1,
      duration: 0.3,
    }, '+=0.3');

    tl.to(arrowPath.style, {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: 'power1.inOut',
    }, '<');

    tl.to(arrowHead.style, {
      strokeDashoffset: 0,
      duration: 0.35,
      ease: 'power1.out',
    }, '-=0.1');

    // 3. Button fades in ~1s after text
    tl.to(btn, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.2');
  }

  // ── MODAL HANDLING ──
  function setupModal() {
    const link = document.getElementById('termsLink');
    const modal = document.getElementById('termsModal');
    const close = document.getElementById('modalClose');

    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add('active');
    });

    close.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // ── FORM SUBMIT ──
  function setupForm() {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Close modal if open
      document.getElementById('termsModal').classList.remove('active');

      // Brief pause to let them think it's processing, then fall
      const btn = form.querySelector('.submit-btn');
      btn.textContent = 'Creating...';
      btn.disabled = true;

      setTimeout(() => {
        triggerFall();
      }, 600);
    });
  }

  // ── NEXT BUTTON (Scene 2 transition) ──
  function setupNextBtn() {
    const btn = document.getElementById('nextBtn');
    btn.addEventListener('click', () => {
      Scene2.transitionIn();
    });
  }

  // ── INIT ──
  function init() {
    createGradientBlobs();
    setupModal();
    setupForm();
    setupNextBtn();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
