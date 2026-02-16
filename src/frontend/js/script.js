/* ═══════════════════════════════════════════════════════════
   KINETIC TYPOGRAPHY ENGINE
   A word-by-word reveal with blur-fade, dynamic backgrounds,
   and choreographed pacing.
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Speed constants (ms a word stays in focus) ──────────
    const VS = 1000;   // very slow  – climactic ("I love you Bella,")
    const S  = 620;    // slow       – emphatic key words
    const M  = 400;    // medium     – comfortable reading pace
    const MF = 300;    // med-fast   – brisk flowing passages
    const F  = 200;    // fast       – rushing stream of words

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
                "I'd", 'like', 'to', 'begin', 'by',
                { text: 'acknowledging', speed: M, pauseAfter: 100 },
                'that', 'this', 'is',
                { text: '. . .', speed: VS, pauseAfter: 700 },
                { text: 'unusual?', speed: S, emphasis: true, pauseAfter: 500 },
                'But', "you're", 'here',
                { text: 'now,', speed: S }, 'so',
                'please',
                'stay',
                'with',
                { text: 'me.', speed: S, emphasis: true, pauseAfter: 800 },
            ],
        },

        // ─── SELF-AWARE  (muted blue-grey) ───────────────────
        {
            phase: 'selfaware',
            defaults: { speed: M },
            words: [
                'This', 'might', 'seem',
                { text: 'awkward,', pauseAfter: 300 },
                'though', "that's", 'just', 'what', "I'm",
                { text: 'like.', pauseAfter: 600 },
                { text: 'Communication', pauseAfter: 400 },
                'has',
                { text: 'never', emphasis: true },
                'been',
                'my',
                'strong',
                { text: 'point.', speed: S, pauseAfter: 800 },
            ],
        },

        // ─── ADMISSION  (deeper rose) ────────────────────────
        {
            phase: 'admission',
            defaults: { speed: M },
            words: [
                'What', "I'm", 'trying', 'to', 'say', 'is',
                { text: 'this:', pauseAfter: 500 },
                { text: 'I', speed: S },
                { text: 'was', speed: S },
                { text: 'wrong.', speed: S, emphasis: true, grow: true, font: 'emphasis', pauseAfter: 1200 },
                { text: 'Not', speed: F },
                { text: 'just', speed: MF },
                { text: 'once', speed: M, pauseAfter: 500 },
                { text: '\u2013', speed: MF, pauseAfter: 200 },
                { text: "I've", speed: F },
                { text: 'been', speed: F },
                { text: 'doing', speed: F },
                { text: 'everything', speed: F, pauseAfter: 200 },
                { text: 'wrong', speed: F },
                { text: 'for', speed: F },
                { text: 'as', speed: MF },
                { text: 'long', speed: MF },
                { text: 'as', speed: MF },
                { text: 'I', speed: MF },
                { text: 'can', speed: MF },
                { text: 'remember.', speed: MF, pauseAfter: 600 },
                { text: 'What', speed: S, pauseAfter: 300 },
                { text: 'can', speed: S },
                { text: 'I', speed: S },
                { text: 'say?', speed: S, pauseAfter: 500 },
                "I'm", 'only',
                { text: 'human.', pauseAfter: 400 },
                'That', 'said,', 'I', 'still', 'have', 'regrets,', 'and',
                { text: 'moving', speed: S },
                { text: 'on', speed: S },
                { text: 'means', speed: S },
                { text: 'correcting', speed: S, emphasis: true },
                { text: 'myself', speed: S, emphasis: true },
                { text: 'first.', speed: S, emphasis: true, pauseAfter: 800 },
            ],
        },

        // ─── APOLOGY  (somber purple) ────────────────────────
        {
            phase: 'apology',
            defaults: { speed: MF },
            words: [
                'Some', 'might', 'say', "I'm", 'too', 'late',
                '\u2013', 'maybe', 'even', 'most', '\u2013',
                { text: 'but', speed: S },
                { text: 'I', speed: S },
                { text: 'say', speed: S },
                { text: 'late', speed: S, emphasis: true, italic: true },
                { text: 'is', speed: S, italic: true },
                { text: 'better', speed: S, italic: true },
                { text: 'than', speed: S, italic: true },
                { text: 'never.', speed: S, emphasis: true, italic: true, pauseAfter: 1000 },
                { text: 'I', speed: M },
                { text: 'know', speed: M },
                { text: 'my', speed: M },
                { text: 'conduct', speed: M },
                { text: 'was', speed: M },
                { text: 'horrendous,', speed: S, emphasis: true },
                'and', 'words', 'cannot', 'describe', 'how',
                { text: 'sorry', speed: S, emphasis: true, grow: true },
                'I', 'am,', 'and', 'forever', 'will',
                { text: 'be.', pauseAfter: 400 },
                'No', 'one', 'should', 'ever', 'have', 'to', 'be',
                'in', 'your',
                { text: 'position,', pauseAfter: 100 },
                { text: 'and', speed: F },
                { text: 'no', speed: F },
                { text: 'one', speed: F },
                { text: 'should', speed: F },
                { text: 'ever', speed: F },
                { text: 'act', speed: F },
                { text: 'as', speed: F },
                { text: 'immaturely', speed: F },
                { text: 'as', speed: F },
                { text: 'I', speed: F },
                { text: 'did.', speed: F, pauseAfter: 200 },
                { text: 'I', speed: S },
                { text: 'just', speed: S },
                { text: 'want', speed: S },
                { text: 'you', speed: S },
                { text: 'to', speed: S },
                { text: 'know.', speed: S, emphasis: true, pauseAfter: 1200 },
            ],
        },

        // ─── PHILOSOPHY  (warm peach) ────────────────────────
        {
            phase: 'philosophy',
            defaults: { speed: M },
            words: [
                'I', "won't", 'ever', 'be',
                { text: 'perfect:', pauseAfter: 200 },
                { text: 'I', speed: MF },
                { text: "won't", speed: MF },
                { text: 'ever', speed: MF },
                { text: 'be', speed: MF },
                { text: 'the', speed: MF },
                { text: 'best', speed: MF },
                { text: 'person', speed: MF },
                { text: 'on', speed: MF },
                { text: 'the', speed: MF },
                { text: 'planet', speed: MF },
                { text: '\u2013', speed: MF },
                { text: 'regardless', speed: F, font: 'playful' },
                { text: 'of', speed: F, font: 'playful' },
                { text: 'all', speed: F, font: 'playful' },
                { text: 'the', speed: F, font: 'playful' },
                { text: 'glazing', speed: F, font: 'playful' },
                { text: 'I', speed: F, font: 'playful' },
                { text: 'get!', speed: F, font: 'playful', pauseAfter: 500 },
                'But', 'I', "don't", 'care,',
                { text: 'because', pauseAfter: 200 },
                { text: "I'm", speed: S, emphasis: true },
                { text: 'willing', speed: S, emphasis: true },
                { text: 'to', speed: S, emphasis: true },
                { text: 'learn,', speed: S, emphasis: true },
                'and', "that's", 'better', 'than',
                { text: 'most.', pauseAfter: 400 },
                { text: 'I', speed: MF },
                { text: 'believe', speed: MF },
                { text: 'if', speed: MF },
                { text: "I'm", speed: MF },
                { text: 'better', speed: MF },
                { text: 'off', speed: MF },
                { text: 'at', speed: MF },
                { text: 'the', speed: MF },
                { text: 'end', speed: MF },
                { text: 'of', speed: MF },
                { text: 'the', speed: MF },
                { text: 'day', speed: MF },
                { text: 'than', speed: MF },
                { text: 'at', speed: MF },
                { text: 'the', speed: MF },
                { text: 'start', speed: MF },
                { text: 'of', speed: MF },
                { text: 'it,', speed: MF },
                { text: 'even', speed: S },
                { text: 'if', speed: S },
                { text: 'only', speed: S },
                { text: 'slightly,', speed: S },
                { text: 'then', speed: S },
                { text: 'that', speed: S },
                { text: 'day', speed: S },
                { text: 'has', speed: S },
                { text: 'been', speed: S },
                { text: 'worth', speed: S, emphasis: true },
                { text: 'living.', speed: S, emphasis: true, pauseAfter: 1500 },
            ],
        },

        // ─── REALIZATION  (mint / teal) ──────────────────────
        {
            phase: 'realization',
            defaults: { speed: M },
            words: [
                'It', 'dawned', 'on', 'me', 'just', 'before', 'my',
                '16th', 'birthday',
                { text: '(back', speed: F },
                { text: 'in', speed: F },
                { text: 'December)', speed: F },
                { text: 'that', pauseAfter: 200 },
                { text: 'time', speed: S, emphasis: true },
                { text: 'passes', speed: S },
                { text: 'too', speed: S },
                { text: 'quickly.', speed: S, emphasis: true, pauseAfter: 1000 },
                'And', 'it', 'became',
                { text: 'clear:', pauseAfter: 500 },
                { text: 'nothing', speed: S, emphasis: true },
                { text: 'would', speed: S },
                { text: 'change,', speed: S },
                'not', 'unless',
                { text: 'I', speed: S, emphasis: true },
                { text: 'changed', speed: S, emphasis: true },
                { text: 'myself', speed: S, emphasis: true },
                { text: 'first.', speed: S, emphasis: true, pauseAfter: 800 },
                'I', 'told', 'myself', 'that', '2026', 'would', 'be', 'my',
                { text: 'year.', pauseAfter: 300 },
                { text: 'For', speed: S },
                { text: 'the', speed: S },
                { text: 'first', speed: S },
                { text: 'time,', speed: S },
                { text: 'I', speed: S },
                { text: 'believed', speed: S, emphasis: true },
                { text: 'it.', speed: S, emphasis: true, pauseAfter: 1500 },
            ],
        },

        // ─── FINALE  (deep warm rose) ────────────────────────
        {
            phase: 'finale',
            defaults: { speed: M },
            words: [
                "I'm", 'still', 'the', 'same', 'person', '\u2013',
                { text: 'still', speed: MF },
                { text: 'incredibly', speed: MF },
                { text: 'introverted', speed: MF },
                { text: '(as', speed: MF },
                { text: 'always).', speed: MF, pauseAfter: 300 },
                'What',
                { text: 'is', italic: true },
                'different', 'is', 'my',
                { text: 'attitude.', pauseAfter: 400 },
                { text: 'I', speed: S, emphasis: true },
                { text: 'now', speed: S, emphasis: true },
                { text: 'chase', speed: S, emphasis: true },
                { text: 'what', speed: S, emphasis: true },
                { text: 'I', speed: S, emphasis: true },
                { text: 'need,', speed: S, emphasis: true },
                { text: 'not', speed: S },
                { text: 'comfort.', speed: S, pauseAfter: 1000 },
                'And', 'that', 'includes',
                { text: 'you;', pauseAfter: 200 },
                { text: 'we', speed: MF },
                { text: 'both', speed: MF },
                { text: 'know', speed: MF },
                { text: 'what', speed: MF },
                { text: 'happened', speed: MF },
                { text: 'two', speed: MF },
                { text: 'years', speed: MF },
                { text: 'ago,', speed: MF },
                { text: 'how', speed: S },
                { text: 'I', speed: S },
                { text: 'ruined', speed: S },
                { text: 'the', speed: S },
                { text: 'moment,', speed: S, pauseAfter: 300 },
                'and', 'I', 'can', 'only',
                { text: 'imagine', italic: true },
                'how', 'you',
                { text: 'felt.', pauseAfter: 300 },
                'You', 'reached',
                { text: 'out,', pauseAfter: 300 },
                'I', 'ignored',
                { text: 'it,', pauseAfter: 300 },
                { text: 'and', speed: S },
                { text: 'now', speed: S },
                { text: "it's", speed: S },
                { text: 'my', speed: S },
                { text: 'turn:', speed: S, pauseAfter: 1000 },
                { text: 'I', speed: VS, emphasis: true, grow: true },
                { text: 'love', speed: VS, emphasis: true, grow: true },
                { text: 'you', speed: VS, emphasis: true, grow: true },
                { text: 'Bella,', speed: VS, emphasis: true, grow: true, pauseAfter: 800 },
                { text: 'I', speed: S, emphasis: true },
                { text: 'really', speed: S, emphasis: true },
                { text: 'do.', speed: S, emphasis: true, pauseAfter: 1200 },
                { text: 'No', speed: S },
                { text: 'one', speed: S },
                { text: 'else', speed: S },
                { text: 'compares,', speed: S, emphasis: true },
                { text: 'and', pauseAfter: 200 },
                { text: 'you', speed: S, emphasis: true },
                { text: 'deserve', speed: S, emphasis: true },
                { text: 'to', speed: S },
                { text: 'know', speed: S },
                { text: 'that.', speed: S, emphasis: true },
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

    const GAP        = 8;      // px gap between words
    const CHAR_RATE  = 35;     // ms per letter reveal
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
            span.textContent = text[i];
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
