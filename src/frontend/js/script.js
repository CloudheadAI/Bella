/* ═══════════════════════════════════════════════════════════
   KINETIC TYPOGRAPHY ENGINE
   A word-by-word reveal with blur-fade, dynamic backgrounds,
   and choreographed pacing.
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Speed constants (ms a phrase stays in focus) ─────────
    const VS = 1400;   // very slow  – climactic moments
    const S  = 900;    // slow       – emphatic phrases
    const M  = 650;    // medium     – comfortable reading pace
    const MF = 450;    // med-fast   – brisk flowing passages
    const F  = 300;    // fast       – rushing stream

    // ── Effect settings ─────────────────────────────────────
    const BLUR_MAX       = 10;    // px – max blur at edge
    const FADE_ZONE      = 0.44;  // fraction of stage half-width where words fully vanish
    const INTRO_DELAY    = 2000;  // ms before first word
    const LINE_FADE_IN   = 500;   // ms before lines appear
    const FINAL_HOLD     = 4000;  // ms to hold after last word before fade

    // ── Background phases ──────────────────────────────────
    // Subtle palette – colors drift gently between phases
    const PHASES = {
        opening:     { center: '#f2dae5', mid: '#e4c8d6', edge: '#d6b8c8',
                       blobs: ['#f0d4e1', '#e8ccd8', '#ddc4d0', '#f2dce8', '#e0d0d8'] },
        selfaware:   { center: '#e8dced', mid: '#dac8de', edge: '#ccb8cf',
                       blobs: ['#d4c4f0', '#dcd0ea', '#c8bce0', '#e0d8ee', '#d0c8e4'] },
        admission:   { center: '#f0d5dc', mid: '#e2c2cc', edge: '#d5b2be',
                       blobs: ['#f0c4d4', '#e8bcc8', '#e0b4c0', '#f0d0da', '#e4c0cc'] },
        apology:     { center: '#e8d2e4', mid: '#dac0d6', edge: '#ccb0c8',
                       blobs: ['#e0d4f0', '#d8c8e4', '#d0c0dc', '#e4d0e8', '#dcc8e0'] },
        philosophy:  { center: '#f0ddd2', mid: '#e2ccc0', edge: '#d5bdb2',
                       blobs: ['#f0e4c4', '#e8dcc0', '#e0d4b8', '#f0e0cc', '#e4d8c0'] },
        realization: { center: '#dce8e2', mid: '#c8dad4', edge: '#b8ccc6',
                       blobs: ['#d4f0e0', '#c8e4d8', '#c0dcd0', '#d0e8dc', '#c4e0d4'] },
        finale:      { center: '#efd0da', mid: '#e0beca', edge: '#d2aebc',
                       blobs: ['#f0c8d8', '#e8c0cc', '#e0b8c4', '#ecc8d4', '#e4bcc8'] },
    };

    // ── Helper: build flat word array from sections ─────────
    function buildWords(sections) {
        const out = [];
        for (const sec of sections) {
            const dSpeed = (sec.defaults && sec.defaults.speed) || M;
            let first = true;
            for (const item of sec.words) {
                let word;
                if (typeof item === 'string') {
                    word = { text: item, speed: dSpeed, pauseAfter: 0 };
                } else {
                    word = {
                        speed: dSpeed,
                        pauseAfter: 0,
                        ...item,
                    };
                }
                if (first && sec.phase) {
                    word.phase = sec.phase;
                    first = false;
                }
                out.push(word);
            }
        }
        return out;
    }

    // ══════════════════════════════════════════════════════════
    //  MESSAGE DATA  –  Full choreography
    // ══════════════════════════════════════════════════════════

    const sections = [

        // ─── OPENING  (soft lavender-pink) ───────────────────
        {
            phase: 'opening',
            defaults: { speed: M },
            words: [
                { text: 'Bella.', speed: S, pauseAfter: 1500, emphasis: true, grow: true },
                { text: 'Hi.', speed: S, pauseAfter: 1000 },
                { text: "I'd like to begin", speed: M },
                { text: 'by acknowledging', speed: M, pauseAfter: 100 },
                { text: 'that this', speed: M },
                { text: 'is . . .', speed: VS, pauseAfter: 700 },
                { text: 'unusual?', speed: S, emphasis: true, pauseAfter: 500 },
                { text: "But you're here now,", speed: M },
                { text: 'so please,', speed: M, pauseAfter: 400 },
                { text: 'stay with me.', speed: S, emphasis: true, pauseAfter: 800 },
            ],
        },

        // ─── SELF-AWARE  (muted blue-grey) ───────────────────
        {
            phase: 'selfaware',
            defaults: { speed: M },
            words: [
                { text: 'This might seem', speed: M },
                { text: 'awkward,', speed: M, pauseAfter: 300 },
                { text: "though that's just", speed: M },
                { text: "what I'm like.", speed: M, pauseAfter: 600 },
                { text: 'Communication', speed: S },
                { text: 'has never been', speed: M, emphasis: true },
                { text: 'my strong point.', speed: S, pauseAfter: 800 },
            ],
        },

        // ─── ADMISSION  (deeper rose) ────────────────────────
        {
            phase: 'admission',
            defaults: { speed: M },
            words: [
                { text: "What I'm trying", speed: M },
                { text: 'to say is this:', speed: M, pauseAfter: 500 },
                { text: 'I was', speed: S },
                { text: 'wrong.', speed: VS, emphasis: true, grow: true, font: 'emphasis', pauseAfter: 1200 },
                { text: 'Not just once \u2013', speed: MF, pauseAfter: 200 },
                { text: "I've been doing", speed: M },
                { text: 'everything wrong', speed: M, pauseAfter: 200 },
                { text: 'for as long as', speed: M },
                { text: 'I can remember.', speed: M, pauseAfter: 600 },
                { text: 'What can I say?', speed: S, pauseAfter: 500 },
                { text: "I'm only human.", speed: M, pauseAfter: 400 },
                { text: 'That said,', speed: M },
                { text: 'I still have regrets,', speed: S, pauseAfter: 400 },
                { text: 'and moving on means', speed: M, pauseAfter: 200 },
                { text: 'correcting myself', speed: S, emphasis: true },
                { text: 'first.', speed: S, emphasis: true, pauseAfter: 800 },
            ],
        },

        // ─── APOLOGY  (somber purple) ────────────────────────
        {
            phase: 'apology',
            defaults: { speed: M },
            words: [
                { text: "Some might say", speed: M },
                { text: "I'm too late", speed: M, pauseAfter: 400 },
                { text: '\u2013 maybe even most \u2013', speed: S, pauseAfter: 300 },
                { text: 'but I say', speed: S, pauseAfter: 100 },
                { text: 'late is better', speed: S, emphasis: true, italic: true },
                { text: 'than never.', speed: S, emphasis: true, italic: true, pauseAfter: 1000 },
                { text: 'I know my conduct', speed: M },
                { text: 'was horrendous,', speed: S, emphasis: true, pauseAfter: 300 },
                { text: 'and words cannot describe', speed: M },
                { text: 'how sorry I am,', speed: S, emphasis: true, grow: true, pauseAfter: 500 },
                { text: 'and forever will be.', speed: M, pauseAfter: 600 },
                { text: 'No one should ever', speed: S },
                { text: 'have to be in', speed: M },
                { text: 'your position,', speed: M, pauseAfter: 200 },
                { text: 'and no one should', speed: M },
                { text: 'ever act as immaturely', speed: S, pauseAfter: 200 },
                { text: 'as I did.', speed: S, pauseAfter: 400 },
                { text: 'I just want you', speed: S },
                { text: 'to know.', speed: S, emphasis: true, pauseAfter: 1200 },
            ],
        },

        // ─── PHILOSOPHY  (warm peach) ────────────────────────
        {
            phase: 'philosophy',
            defaults: { speed: M },
            words: [
                { text: "I won't ever be", speed: S },
                { text: 'perfect:', speed: M, pauseAfter: 400 },
                { text: "I won't ever be", speed: M },
                { text: 'the best person', speed: M, pauseAfter: 200 },
                { text: 'on the planet \u2013', speed: M, pauseAfter: 100 },
                { text: 'regardless of all the', speed: M },
                { text: 'glazing I get \u2013', speed: M, pauseAfter: 500 },
                { text: "but I don't care,", speed: M, pauseAfter: 260 },
                { text: 'because', speed: M, pauseAfter: 200 },
                { text: "I'm willing to learn,", speed: S, emphasis: true, pauseAfter: 400 },
                { text: "and that's better", speed: M, pauseAfter: 260 },
                { text: 'than most.', speed: S, pauseAfter: 600 },
                { text: 'I believe if', speed: M },
                { text: "I'm better off", speed: M },
                { text: 'at the end of the day', speed: S },
                { text: 'than at the start of it,', speed: MF, pauseAfter: 300 },
                { text: 'even if only slightly,', speed: S, pauseAfter: 100 },
                { text: 'then that day', speed: M },
                { text: 'has been', speed: M },
                { text: 'worth living.', speed: S, emphasis: true, pauseAfter: 1500 },
            ],
        },

        // ─── REALIZATION  (mint / teal) ──────────────────────
        {
            phase: 'realization',
            defaults: { speed: M },
            words: [
                { text: 'It dawned on me', speed: M },
                { text: 'just before my', speed: M },
                { text: '16th birthday', speed: M },
                { text: '(back in December)', speed: MF, pauseAfter: 350 },
                { text: 'that', speed: M, pauseAfter: 200 },
                { text: 'time passes', speed: S, emphasis: true },
                { text: 'too quickly.', speed: S, emphasis: true, pauseAfter: 1000 },
                { text: 'And it became clear:', speed: M, pauseAfter: 500 },
                { text: 'nothing would change,', speed: M, emphasis: true },
                { text: 'not unless I', speed: M },
                { text: 'changed myself first.', speed: S, emphasis: true, pauseAfter: 800 },
                { text: 'I told myself that', speed: M },
                { text: '2026', speed: M, emphasis: true, pauseAfter: 200 },
                { text: 'would be my year.', speed: M, pauseAfter: 500 },
                { text: 'For the first time,', speed: S, pauseAfter: 300 },
                { text: 'I believed it.', speed: S, emphasis: true, pauseAfter: 1500 },
            ],
        },

        // ─── FINALE  (deep warm rose) ────────────────────────
        {
            phase: 'finale',
            defaults: { speed: M },
            words: [
                { text: 'Ultimately,', speed: M, pauseAfter: 250 },
                { text: "I'm still the same", speed: M },
                { text: 'person \u2013', speed: M },
                { text: 'still incredibly', speed: M, pauseAfter: 150 },
                { text: 'introverted', speed: M, pauseAfter: 180 },
                { text: '(as always).', speed: M, pauseAfter: 340 },
                { text: 'What is different', speed: M, italic: true },
                { text: 'is my attitude.', speed: M, pauseAfter: 400 },
                { text: 'I now chase', speed: M },
                { text: 'what I need,', speed: S, emphasis: true, pauseAfter: 450 },
                { text: 'rather than running from it.', speed: S, emphasis: true, pauseAfter: 1000 },
                { text: 'And that includes', speed: M },
                { text: 'you;', speed: S, emphasis: true, pauseAfter: 400 },
                { text: 'we both know what', speed: M },
                { text: 'happened two years ago,', speed: M, emphasis: true, pauseAfter: 200 },
                { text: 'how I ruined', speed: M },
                { text: 'the moment,', speed: S, pauseAfter: 340 },
                { text: 'and I can only', speed: M },
                { text: 'imagine how you felt.', speed: M, italic: true, pauseAfter: 320 },
                { text: 'You reached out,', speed: M, pauseAfter: 320 },
                { text: 'I ignored it,', speed: M, pauseAfter: 320 },
                { text: "and now it's", speed: M },
                { text: 'my turn:', speed: S, pauseAfter: 1000 },
                { text: 'I', speed: M, emphasis: true, pauseAfter: 180 },
                { text: 'love you', speed: VS, emphasis: true, grow: true, pauseAfter: 400 },
                { text: 'Bella,', speed: S, emphasis: true, grow: true, pauseAfter: 800 },
                { text: 'I really do.', speed: S, emphasis: true, pauseAfter: 1200 },
                { text: 'No one else', speed: M },
                { text: 'compares,', speed: S, emphasis: true, pauseAfter: 400 },
                { text: 'and you deserve', speed: M, emphasis: true, grow: true },
                { text: 'to know that.', speed: S, emphasis: true, pauseAfter: 4000 },
            ],
        },
    ];

    // ══════════════════════════════════════════════════════════
    //  ENGINE  –  Each word is independently positioned
    // ══════════════════════════════════════════════════════════

    const words = buildWords(sections);
    const stage = document.getElementById('stage');
    const container = document.getElementById('container');

    let currentIndex = 0;
    let rafId        = null;
    let prevTime     = 0;

    const GAP        = 12;      // px gap between words
    const CHAR_RATE  = 65;     // ms per letter reveal
    const DECAY      = 6;      // exponential decay rate (higher = faster settle)

    // Each active word stored as:
    // { el, width, currentX, targetX }
    let activeWords = [];

    // ── Gradient blobs ──────────────────────────────────────
    const blobLayer = document.getElementById('blobLayer');
    const BLOB_COUNT = 6 + Math.floor(Math.random() * 3); // 6-8 blobs
    const blobs = [];

    function createBlobs() {
        const colors = PHASES.opening.blobs;
        for (let i = 0; i < BLOB_COUNT; i++) {
            const el = document.createElement('div');
            el.className = 'gradient-blob';

            const size = 250 + Math.random() * 350;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.background = colors[i % colors.length];
            el.style.opacity = (0.2 + Math.random() * 0.2).toFixed(2);

            // Random starting position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            el.style.left = x + '%';
            el.style.top = y + '%';
            el.style.transform = 'translate(-50%, -50%)';

            blobLayer.appendChild(el);
            blobs.push({
                el: el,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: size,
            });
        }
    }

    // Drift blobs slowly with random wandering
    function driftBlobs(dt) {
        for (let i = 0; i < blobs.length; i++) {
            const b = blobs[i];

            // Slight random acceleration
            b.vx += (Math.random() - 0.5) * 0.02;
            b.vy += (Math.random() - 0.5) * 0.02;

            // Damping
            b.vx *= 0.998;
            b.vy *= 0.998;

            // Clamp velocity
            const maxV = 0.4;
            b.vx = Math.max(-maxV, Math.min(maxV, b.vx));
            b.vy = Math.max(-maxV, Math.min(maxV, b.vy));

            b.x += b.vx * dt;
            b.y += b.vy * dt;

            // Soft bounce off edges
            if (b.x < -15) { b.x = -15; b.vx = Math.abs(b.vx) * 0.5; }
            if (b.x > 115) { b.x = 115; b.vx = -Math.abs(b.vx) * 0.5; }
            if (b.y < -15) { b.y = -15; b.vy = Math.abs(b.vy) * 0.5; }
            if (b.y > 115) { b.y = 115; b.vy = -Math.abs(b.vy) * 0.5; }

            b.el.style.left = b.x.toFixed(1) + '%';
            b.el.style.top  = b.y.toFixed(1) + '%';
        }
    }

    // ── Phase transition ────────────────────────────────────
    function setPhase(name) {
        const p = PHASES[name];
        if (!p) return;
        document.body.style.setProperty('--bg-center', p.center);
        document.body.style.setProperty('--bg-mid', p.mid);
        document.body.style.setProperty('--bg-edge', p.edge);

        // Shift blob colors
        for (let i = 0; i < blobs.length; i++) {
            blobs[i].el.style.background = p.blobs[i % p.blobs.length];
        }
    }

    // ── Recalculate all target positions ────────────────────
    //    Focused word (last) → centered.
    //    Previous words → stacked to the left of it.
    function recalcTargets() {
        const stageW = stage.offsetWidth;
        const len    = activeWords.length;
        if (len === 0) return;

        // Focused word center = stageW / 2
        const focused    = activeWords[len - 1];
        const focusedX   = stageW / 2 - focused.width / 2;
        focused.targetX  = focusedX;

        // Walk backwards for previous words
        let rightEdge = focusedX - GAP;
        for (let i = len - 2; i >= 0; i--) {
            const w   = activeWords[i];
            w.targetX = rightEdge - w.width;
            rightEdge = w.targetX - GAP;
        }
    }

    // ── Main animation frame ────────────────────────────────
    function tick(ts) {
        if (!prevTime) prevTime = ts;
        const dt = Math.min(ts - prevTime, 50) / 1000; // seconds, capped
        prevTime = ts;
        // Drift background blobs
        driftBlobs(dt);
        const stageW  = stage.offsetWidth;
        const center  = stageW / 2;
        const maxDist = stageW * FADE_ZONE;

        let needsClean = false;

        for (let i = 0; i < activeWords.length; i++) {
            const w = activeWords[i];

            // Smooth exponential move toward target
            const diff = w.targetX - w.currentX;
            if (Math.abs(diff) > 0.3) {
                w.currentX += diff * (1 - Math.exp(-DECAY * dt));
            } else {
                w.currentX = w.targetX;
            }

            // Apply position
            w.el.style.left = w.currentX.toFixed(1) + 'px';

            // Blur/fade based on distance from center (leftward only)
            const wordCenter = w.currentX + w.width / 2;
            const dist       = Math.max(center - wordCenter, 0);
            const norm       = Math.min(dist / maxDist, 1);

            w.el.style.filter  = 'blur(' + (norm * BLUR_MAX).toFixed(1) + 'px)';
            w.el.style.opacity = Math.max(1 - norm * 1.4, 0).toFixed(3);

            if (norm >= 0.99) needsClean = true;
        }

        // Remove fully faded words
        if (needsClean) {
            while (activeWords.length > 1) {
                const w = activeWords[0];
                const wordCenter = w.currentX + w.width / 2;
                const dist = Math.max(center - wordCenter, 0);
                const norm = Math.min(dist / maxDist, 1);
                if (norm < 0.99) break;
                w.el.remove();
                activeWords.shift();
            }
        }

        rafId = requestAnimationFrame(tick);
    }

    // ── Type a word letter-by-letter, returns total ms ──────
    function typeWord(el, text, speed) {
        const chars   = text.length;
        const perChar = Math.min(CHAR_RATE, Math.floor((speed * 0.8) / Math.max(chars, 1)));

        const spans = [];
        for (let i = 0; i < chars; i++) {
            const span = document.createElement('span');
            span.className = 'letter';
            if (text[i] === ' ') {
                span.classList.add('space');
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = text[i];
            }
            el.appendChild(span);
            spans.push(span);
        }

        el.offsetWidth; // reflow to lock in size

        for (let i = 0; i < spans.length; i++) {
            const jitter = Math.random() * 10 - 5;
            const t = Math.max(0, i * perChar + jitter);
            setTimeout(function () {
                spans[i].classList.add('visible');
            }, t);
        }

        return chars * perChar;
    }

    // ── Main word loop ──────────────────────────────────────
    function showNextWord() {
        if (currentIndex >= words.length) {
            setTimeout(function () {
                cancelAnimationFrame(rafId);
                container.style.opacity = '0';
            }, FINAL_HOLD);
            return;
        }

        const data = words[currentIndex];

        if (data.phase) setPhase(data.phase);

        // Create word element
        const el = document.createElement('span');
        el.className = 'word';

        if (data.emphasis) el.classList.add('emphasis');
        if (data.grow)     el.classList.add('grow');
        if (data.italic)   el.classList.add('italic');
        if (data.font === 'emphasis') el.classList.add('font-emphasis');
        if (data.font === 'playful')  el.classList.add('font-playful');

        stage.appendChild(el);

        // Type letters (gives the element its full width)
        const typeDuration = typeWord(el, data.text, data.speed);

        // Measure word width
        const width = el.offsetWidth;

        // Start position = center (it appears in place)
        const stageW   = stage.offsetWidth;
        const startX   = stageW / 2 - width / 2;

        const wordObj = {
            el: el,
            width: width,
            currentX: startX,
            targetX: startX,
        };
        activeWords.push(wordObj);

        // Recalculate all targets (old words shift left)
        recalcTargets();

        // First word: snap all instantly
        if (currentIndex === 0) {
            for (let i = 0; i < activeWords.length; i++) {
                activeWords[i].currentX = activeWords[i].targetX;
                activeWords[i].el.style.left = activeWords[i].currentX.toFixed(1) + 'px';
            }
        }

        currentIndex++;

        const remaining = Math.max(data.speed - typeDuration, 0);
        const delay     = typeDuration + remaining + (data.pauseAfter || 0);
        setTimeout(showNextWord, delay);
    }

    // ══════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════

    setPhase('opening');
    createBlobs();

    // Wait for all fonts to load before measuring word widths
    document.fonts.ready.then(function () {
        rafId = requestAnimationFrame(tick);

        setTimeout(function () {
            var lines = document.querySelectorAll('.line');
            for (var i = 0; i < lines.length; i++) lines[i].classList.add('active');
        }, LINE_FADE_IN);

        setTimeout(showNextWord, INTRO_DELAY);
    });

})();
