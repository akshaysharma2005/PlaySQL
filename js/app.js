/**
 * PlaySQL Application Controller (Editorial Light & Calming Edition)
 * - Opening Login & Gamertag Portal with Avatar & persistent stats
 * - Dynamic Seed-based Session Randomizer (guarantees NO two users get same questions)
 * - Exam Integrity: No answer or solution spoilers during the test!
 * - Comprehensive Post-Test Analytical Feedback Report
 */

class PlaySQLApp {
    constructor() {
        // Player Profile State (Persistent in localStorage)
        this.profile = this.loadPlayerProfile();

        // Mission Configuration
        this.config = {
            level: 'beginner',
            questionCount: 10,
            questionMix: 'balanced',
            timerMode: 'tactical'
        };

        // Active Session Gameplay State
        this.activeQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.sessionAnswers = {}; // id -> { selectedIdx, userSql, timeSpent, timedOut }
        this.startTime = null;

        // Timer Handles
        this.timeRemaining = 60;
        this.timerTotal = 60;
        this.timerInterval = null;

        // Subsystems
        this.audio = window.cyberAudio;
        this.db = window.cyberDB;
        this.scene3D = null;
        this.editor = null;

        // Random name bank
        this.randomNames = [
            'QueryKnight', 'DataVoyager', 'ByteTitan', 'AlgoScribe',
            'SyntaxPro', 'SchemaWizard', 'EchoCoder', 'PrismData',
            'NovaAnalyst', 'QuantumSQL', 'MatrixSeeker', 'VanguardDev'
        ];

        this.init();
    }

    loadPlayerProfile() {
        const saved = localStorage.getItem('playsql_player_profile');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Error reading saved profile:', e);
            }
        }
        return {
            name: 'QUERYKNIGHT',
            avatar: '🧙‍♂️',
            totalXP: 0,
            testsCompleted: 0,
            bestAccuracy: 0,
            highestGrade: 'C'
        };
    }

    savePlayerProfile() {
        localStorage.setItem('playsql_player_profile', JSON.stringify(this.profile));
    }

    async init() {
        this.setupDOM();

        // 1. Initialize 3D Three.js WebGL Scene
        if (window.PlaySQL3DScene) {
            this.scene3D = new window.PlaySQL3DScene('webgl-3d-canvas');
        }

        // 2. Initialize In-Browser SQLite WebAssembly Database
        try {
            await this.db.init();
            this.updateDatabaseStatus(true);
        } catch (err) {
            console.error('Error starting SQLite engine:', err);
            this.updateDatabaseStatus(false);
        }

        // 3. Initialize Code Editor
        this.editor = new CyberCodeEditor('editor-container', {
            initialValue: '',
            onRun: () => this.runUserQuery()
        });

        // 4. Update Profile Display
        this.syncProfileDOM();

        // 5. Default Screen: Opening Portal Screen (Screen 0)
        this.showScreen('portal');
    }

    syncProfileDOM() {
        document.getElementById('hud-callsign-text').textContent = this.profile.name;
        document.getElementById('hud-avatar-icon').textContent = this.profile.avatar;

        const nameInput = document.getElementById('player-name-input');
        if (nameInput) nameInput.value = this.profile.name;

        // Highlight selected avatar
        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.avatar === this.profile.avatar);
        });

        // Update stats preview bar
        document.getElementById('stat-preview-xp').textContent = this.profile.totalXP;
        document.getElementById('stat-preview-cleared').textContent = this.profile.testsCompleted;
        document.getElementById('stat-preview-acc').textContent = `${this.profile.bestAccuracy}%`;
        document.getElementById('stat-preview-rank').textContent = this.profile.highestGrade;
    }

    setupDOM() {
        // --- SCREEN 0: PORTAL SCREEN LISTENERS ---

        // Avatar selector
        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                this.profile.avatar = opt.dataset.avatar;
                this.savePlayerProfile();
                this.syncProfileDOM();
            });
        });

        // Name input
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.profile.name = e.target.value.trim().toUpperCase() || 'OPERATIVE';
                this.savePlayerProfile();
                document.getElementById('hud-callsign-text').textContent = this.profile.name;
            });
        }

        // Randomize name button
        const diceBtn = document.getElementById('btn-randomize-name');
        if (diceBtn) {
            diceBtn.addEventListener('click', () => {
                this.audio.playSelect();
                const rand = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
                this.profile.name = rand.toUpperCase();
                this.savePlayerProfile();
                this.syncProfileDOM();
            });
        }

        // Enter Briefing Button
        const enterBriefingBtn = document.getElementById('btn-enter-briefing');
        if (enterBriefingBtn) {
            enterBriefingBtn.addEventListener('click', () => {
                this.audio.playSelect();
                this.showScreen('briefing');
            });
        }

        // --- SCREEN 1: BRIEFING CONFIGURATION LISTENERS ---

        // Level Cards
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.config.level = card.dataset.level;
            });
        });

        // Question Count Chips
        document.querySelectorAll('.chip-question-count').forEach(chip => {
            chip.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.chip-question-count').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.config.questionCount = parseInt(chip.dataset.count, 10);
            });
        });

        // Question Mix Chips
        document.querySelectorAll('.chip-question-mix').forEach(chip => {
            chip.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.chip-question-mix').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.config.questionMix = chip.dataset.mix;
            });
        });

        // Timer Mode Chips
        document.querySelectorAll('.chip-timer-mode').forEach(chip => {
            chip.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.chip-timer-mode').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.config.timerMode = chip.dataset.mode;
            });
        });

        // Start Challenge Button
        const startBtn = document.getElementById('btn-start-challenge');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.audio.playLaunch();
                if (this.scene3D) this.scene3D.triggerCelebration();
                this.startMission();
            });
        }

        // --- SCREEN 2: ARENA ACTIONS ---

        // Next Question Button
        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.nextQuestion();
            });
        }

        // Run Code Button
        const runBtn = document.getElementById('btn-run-code');
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.runUserQuery();
            });
        }

        // Format Code Button
        const formatBtn = document.getElementById('btn-format-code');
        if (formatBtn) {
            formatBtn.addEventListener('click', () => {
                this.audio.playClick();
                if (this.editor) this.editor.formatSQL();
            });
        }

        // Reset Code Button
        const resetBtn = document.getElementById('btn-reset-code');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.audio.playClick();
                const q = this.getCurrentQuestion();
                if (q && q.starterCode && this.editor) {
                    this.editor.setValue(q.starterCode);
                }
            });
        }

        // Output Tabs (User Output vs Target Output)
        document.querySelectorAll('.output-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                this.audio.playClick();
                document.querySelectorAll('.output-tab-btn').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                document.getElementById('view-user-output').style.display = target === 'user' ? 'block' : 'none';
                document.getElementById('view-expected-output').style.display = target === 'expected' ? 'block' : 'none';
            });
        });

        // Hint Toggle
        const hintToggleBtn = document.getElementById('hint-toggle-btn');
        if (hintToggleBtn) {
            hintToggleBtn.addEventListener('click', () => {
                this.audio.playClick();
                const hintContent = document.getElementById('hint-content');
                if (hintContent) hintContent.classList.toggle('visible');
            });
        }

        // --- SCREEN 3: FEEDBACK ACTIONS ---
        const retakeBtn = document.getElementById('btn-feedback-retake');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.startMission();
            });
        }

        const reconfigureBtn = document.getElementById('btn-feedback-reconfigure');
        if (reconfigureBtn) {
            reconfigureBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.showScreen('briefing');
            });
        }

        const certBtn = document.getElementById('btn-feedback-certificate');
        if (certBtn) {
            certBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.renderCertificate();
            });
        }

        // Modals & Navigation
        this.bindModal('btn-open-schema', 'schema-modal', () => this.renderSchemaModal());
        this.bindModal('btn-hud-schema', 'schema-modal', () => this.renderSchemaModal());
        this.bindModal('btn-hud-help', 'help-modal');

        const muteBtn = document.getElementById('btn-hud-audio');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const isMuted = this.audio.toggleMute();
                this.updateAudioIcon(isMuted);
            });
            this.updateAudioIcon(this.audio.isMuted);
        }

        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.audio.playClick();
                const modal = btn.closest('.cyber-modal-overlay');
                if (modal) modal.classList.remove('open');
            });
        });

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

            const q = this.getCurrentQuestion();
            if (q && q.type === 'mcq') {
                const keys = { 'a': 0, '1': 0, 'b': 1, '2': 1, 'c': 2, '3': 2, 'd': 3, '4': 3 };
                const selected = keys[e.key.toLowerCase()];
                if (selected !== undefined && selected < q.options.length) {
                    this.handleOptionSelect(selected);
                }
            }

            if (e.key === 'Enter') {
                const nextBtn = document.getElementById('btn-next-question');
                if (nextBtn && !nextBtn.disabled && nextBtn.style.display !== 'none') {
                    this.nextQuestion();
                }
            }
        });
    }

    bindModal(triggerId, modalId, onOpen) {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);
        if (trigger && modal) {
            trigger.addEventListener('click', () => {
                this.audio.playClick();
                modal.classList.add('open');
                if (onOpen) onOpen();
            });
        }
    }

    updateAudioIcon(isMuted) {
        const iconSlot = document.getElementById('audio-icon-slot');
        if (!iconSlot) return;
        if (isMuted) {
            iconSlot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
        } else {
            iconSlot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>`;
        }
    }

    updateDatabaseStatus(ready) {
        const statusEl = document.getElementById('editor-db-status');
        if (statusEl) {
            statusEl.innerHTML = ready
                ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:6px"></span> SQLite WASM Ready`
                : `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-right:6px"></span> Engine Offline`;
        }
    }

    showScreen(screenName) {
        document.getElementById('screen-portal').style.display = screenName === 'portal' ? 'flex' : 'none';
        document.getElementById('screen-briefing').style.display = screenName === 'briefing' ? 'flex' : 'none';
        document.getElementById('screen-arena').style.display = screenName === 'arena' ? 'flex' : 'none';
        document.getElementById('screen-feedback').style.display = screenName === 'feedback' ? 'flex' : 'none';
    }

    startMission() {
        // DYNAMIC SEED RANDOMIZER: Guarantees NO two users get the same question set!
        this.activeQuestions = window.generateDynamicSession(
            this.config.level,
            this.config.questionCount,
            this.config.questionMix,
            this.profile.name
        );

        this.currentIndex = 0;
        this.score = 0;
        this.sessionAnswers = {};
        this.startTime = Date.now();

        // Update Top HUD
        document.getElementById('hud-callsign-text').textContent = this.profile.name;
        document.getElementById('hud-avatar-icon').textContent = this.profile.avatar;
        document.getElementById('hud-score').textContent = '0';

        const levelData = window.PLAYSQL_MASTER_BANK[this.config.level];
        document.getElementById('stage-map-title').textContent = `${levelData.title} (${this.activeQuestions.length} Questions)`;
        document.getElementById('stage-map-subtitle').textContent = `Target: ${levelData.badge} - Loadout: ${this.config.questionMix.toUpperCase()} (Unique Session)`;

        this.showScreen('arena');
        this.renderStageMap();
        this.loadQuestion(0);
    }

    renderStageMap() {
        const track = document.getElementById('mission-nodes-track');
        if (!track) return;
        track.innerHTML = '';

        this.activeQuestions.forEach((q, idx) => {
            const btn = document.createElement('button');
            btn.className = 'node-btn';
            if (q.type === 'coding') btn.classList.add('coding-node');

            if (idx === this.currentIndex) btn.classList.add('active');

            const ans = this.sessionAnswers[q.id];
            if (ans) btn.classList.add('answered');

            btn.innerHTML = `<span>${idx + 1}</span>`;
            btn.title = `${q.type.toUpperCase()}: ${q.title}`;

            btn.addEventListener('click', () => {
                this.audio.playClick();
                this.loadQuestion(idx);
            });

            track.appendChild(btn);
        });
    }

    getCurrentQuestion() {
        return this.activeQuestions[this.currentIndex];
    }

    loadQuestion(index) {
        this.currentIndex = index;
        const q = this.getCurrentQuestion();
        if (!q) return;

        this.renderStageMap();

        document.getElementById('arena-category-tag').textContent = q.category;
        document.getElementById('arena-type-tag').textContent = q.type.toUpperCase();
        document.getElementById('arena-question-counter').textContent = `Question ${this.currentIndex + 1} of ${this.activeQuestions.length}`;

        let baseTime = q.timeLimit || 60;
        if (this.config.timerMode === 'blitz') {
            baseTime = Math.round(baseTime * 0.5);
        } else if (this.config.timerMode === 'zen') {
            baseTime = 9999;
        }

        this.timerTotal = baseTime;
        this.timeRemaining = this.timerTotal;
        this.startTimer();

        // Next Button State
        const nextBtn = document.getElementById('btn-next-question');
        const ans = this.sessionAnswers[q.id];
        if (nextBtn) {
            nextBtn.disabled = !ans;
            nextBtn.textContent = (this.currentIndex === this.activeQuestions.length - 1) ? 'Complete & View Analytical Report ⚡' : 'Next Question ▹';
        }

        if (q.type === 'mcq') {
            this.renderMCQ(q, ans);
        } else {
            this.renderCoding(q, ans);
        }
    }

    renderMCQ(q, ans) {
        document.getElementById('mcq-view').style.display = 'block';
        document.getElementById('coding-view').style.display = 'none';

        document.getElementById('mcq-title').textContent = q.title;
        document.getElementById('mcq-prompt').textContent = q.prompt;

        const snippetBox = document.getElementById('mcq-snippet');
        if (q.codeSnippet) {
            snippetBox.style.display = 'block';
            snippetBox.textContent = q.codeSnippet;
        } else {
            snippetBox.style.display = 'none';
        }

        // Render Options (NO ANSWERS REVEALED DURING TEST!)
        const optionsGrid = document.getElementById('mcq-options-grid');
        optionsGrid.innerHTML = '';
        const keys = ['A', 'B', 'C', 'D'];

        q.options.forEach((optText, optIdx) => {
            const card = document.createElement('div');
            card.className = 'mcq-option-card';
            card.innerHTML = `
                <div class="option-key-badge">${keys[optIdx]}</div>
                <div class="option-text-content">${optText}</div>
            `;

            if (ans && ans.selectedIdx === optIdx) {
                card.classList.add('selected-choice');
            }

            card.addEventListener('click', () => this.handleOptionSelect(optIdx));
            optionsGrid.appendChild(card);
        });
    }

    handleOptionSelect(selectedIdx) {
        const q = this.getCurrentQuestion();
        if (!q || q.type !== 'mcq') return;

        this.audio.playSelect();

        // Highlight selection without revealing correctness
        const cards = document.querySelectorAll('.mcq-option-card');
        cards.forEach((c, idx) => {
            c.classList.toggle('selected-choice', idx === selectedIdx);
        });

        const timeSpent = this.timerTotal - this.timeRemaining;
        this.sessionAnswers[q.id] = { selectedIdx, timeSpent };

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) nextBtn.disabled = false;

        this.renderStageMap();
    }

    renderCoding(q, ans) {
        document.getElementById('mcq-view').style.display = 'none';
        document.getElementById('coding-view').style.display = 'grid';

        document.getElementById('mission-title').textContent = q.title;
        document.getElementById('mission-desc').textContent = q.prompt;

        const instList = document.getElementById('mission-instructions');
        instList.innerHTML = '';
        (q.instructions || []).forEach(inst => {
            const li = document.createElement('li');
            li.textContent = inst;
            instList.appendChild(li);
        });

        const pillsContainer = document.getElementById('schema-pills-list');
        pillsContainer.innerHTML = '';
        (q.relevantTables || []).forEach(table => {
            const pill = document.createElement('span');
            pill.className = 'schema-table-pill';
            pill.textContent = table;
            pill.addEventListener('click', () => {
                this.audio.playClick();
                this.openSchemaForTable(table);
            });
            pillsContainer.appendChild(pill);
        });

        if (this.editor) {
            this.editor.setValue(ans ? ans.userSql : (q.starterCode || ''));
        }

        document.getElementById('user-output-table').innerHTML = '<div style="color:var(--slate-muted);padding:10px">Click "RUN QUERY ⚡" to test your query against SQLite...</div>';
        document.getElementById('expected-output-table').innerHTML = '<div style="color:var(--slate-muted);padding:10px">Solution output is hidden during the exam and revealed in the final debriefing report.</div>';
    }

    async runUserQuery() {
        const q = this.getCurrentQuestion();
        if (!q || q.type !== 'coding' || !this.editor) return;

        const userSql = this.editor.getValue();
        if (!userSql.trim()) return;

        this.audio.playCodeRun();

        const userRes = this.db.runQuery(userSql);
        this.renderTableResults('user-output-table', userRes);

        const timeSpent = this.timerTotal - this.timeRemaining;
        this.sessionAnswers[q.id] = { userSql, timeSpent };

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) nextBtn.disabled = false;

        this.renderStageMap();
    }

    renderTableResults(containerId, resultObj) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!resultObj || resultObj.error) {
            container.innerHTML = `<div style="color:#b91c1c;padding:10px;font-weight:600">SQL Error: ${resultObj ? resultObj.error : 'Execution failed'}</div>`;
            return;
        }

        if (!resultObj.columns || resultObj.columns.length === 0) {
            container.innerHTML = `<div style="color:var(--slate-muted);padding:10px">0 rows returned.</div>`;
            return;
        }

        let html = '<table class="cyber-table"><thead><tr>';
        resultObj.columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        resultObj.values.forEach(row => {
            html += '<tr>';
            row.forEach(val => {
                const displayVal = val === null ? '<span style="color:var(--slate-muted)">NULL</span>' : val;
                html += `<td>${displayVal}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        container.innerHTML = html;
    }

    startTimer() {
        this.stopTimer();
        if (this.config.timerMode === 'zen') {
            document.getElementById('timer-digits').textContent = '∞';
            return;
        }

        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const digitsEl = document.getElementById('timer-digits');
        const progressCircle = document.getElementById('timer-circle-progress');
        if (!digitsEl || !progressCircle) return;

        const mins = Math.floor(this.timeRemaining / 60);
        const secs = this.timeRemaining % 60;
        digitsEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const pct = Math.max(0, this.timeRemaining / this.timerTotal);
        const offset = 100 - (pct * 100);
        progressCircle.style.strokeDashoffset = offset;

        digitsEl.classList.remove('warning', 'danger');
        progressCircle.classList.remove('warning', 'danger');

        if (this.timeRemaining <= 15) {
            digitsEl.classList.add('danger');
            progressCircle.classList.add('danger');
            this.audio.playUrgentTick();
        } else if (this.timeRemaining <= 30) {
            digitsEl.classList.add('warning');
            progressCircle.classList.add('warning');
            this.audio.playTick();
        }
    }

    handleTimeout() {
        this.stopTimer();
        this.audio.playTick();

        const q = this.getCurrentQuestion();
        if (!q) return;

        this.sessionAnswers[q.id] = { timedOut: true, timeSpent: this.timerTotal };

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) nextBtn.disabled = false;

        this.renderStageMap();
    }

    nextQuestion() {
        if (this.currentIndex < this.activeQuestions.length - 1) {
            this.loadQuestion(this.currentIndex + 1);
        } else {
            this.finishMission();
        }
    }

    finishMission() {
        this.stopTimer();
        this.audio.playVictory();
        if (this.scene3D) this.scene3D.triggerCelebration();
        this.generateComprehensiveFeedback();
        this.showScreen('feedback');
    }

    /**
     * COMPREHENSIVE POST-TEST EVALUATION & FEEDBACK
     * All answers, target queries, and solutions are revealed here!
     */
    generateComprehensiveFeedback() {
        let passedCount = 0;
        let totalTime = 0;
        this.score = 0;

        const domainScores = {
            'Syntax & Basic Projections': { passed: 0, total: 0 },
            'Relational Joins & Sets': { passed: 0, total: 0 },
            'Aggregation & Grouping': { passed: 0, total: 0 },
            'Window Functions & Analytics': { passed: 0, total: 0 }
        };

        const questionResults = [];

        this.activeQuestions.forEach((q, idx) => {
            const ans = this.sessionAnswers[q.id];
            let isPassed = false;
            let userDisplay = 'No answer submitted';

            if (q.type === 'mcq') {
                if (ans && ans.selectedIdx !== undefined) {
                    isPassed = ans.selectedIdx === q.correctAnswer;
                    userDisplay = `Option ${['A','B','C','D'][ans.selectedIdx]}: "${q.options[ans.selectedIdx]}"`;
                }
            } else {
                if (ans && ans.userSql) {
                    const verification = this.db.verifyChallenge(ans.userSql, q.solutionSql);
                    isPassed = verification.success;
                    userDisplay = ans.userSql;
                }
            }

            if (isPassed) {
                passedCount++;
                this.score += (q.type === 'coding' ? 300 : 100);
            }

            if (ans && ans.timeSpent) totalTime += ans.timeSpent;

            // Map Domain
            let catKey = 'Syntax & Basic Projections';
            const catUpper = (q.category || '').toUpperCase();
            if (catUpper.includes('JOIN') || catUpper.includes('ANTI-JOIN') || catUpper.includes('SET')) {
                catKey = 'Relational Joins & Sets';
            } else if (catUpper.includes('GROUP') || catUpper.includes('AGGREGAT') || catUpper.includes('COUNT')) {
                catKey = 'Aggregation & Grouping';
            } else if (catUpper.includes('WINDOW') || catUpper.includes('RANK') || catUpper.includes('LAG') || catUpper.includes('SERIES')) {
                catKey = 'Window Functions & Analytics';
            }

            domainScores[catKey].total++;
            if (isPassed) domainScores[catKey].passed++;

            questionResults.push({
                index: idx + 1,
                question: q,
                isPassed,
                userDisplay,
                correctDisplay: q.type === 'mcq' ? `Option ${['A','B','C','D'][q.correctAnswer]}: "${q.options[q.correctAnswer]}"` : q.solutionSql
            });
        });

        const totalQuestions = this.activeQuestions.length;
        const accuracyPct = Math.round((passedCount / totalQuestions) * 100);

        let grade = 'C';
        let gradeTitle = 'CADET';
        if (accuracyPct >= 90) { grade = 'S+'; gradeTitle = 'OVERLORD'; }
        else if (accuracyPct >= 80) { grade = 'A'; gradeTitle = 'MASTER'; }
        else if (accuracyPct >= 60) { grade = 'B'; gradeTitle = 'OPERATOR'; }

        // Update persistent player stats in localStorage
        this.profile.totalXP += this.score;
        this.profile.testsCompleted += 1;
        if (accuracyPct > this.profile.bestAccuracy) this.profile.bestAccuracy = accuracyPct;
        if (['S+', 'A'].includes(grade)) this.profile.highestGrade = grade;
        this.savePlayerProfile();
        this.syncProfileDOM();

        // Render Hero Debrief Banner
        document.getElementById('feedback-grade-text').textContent = grade;
        document.getElementById('feedback-grade-label').textContent = gradeTitle;
        document.getElementById('feedback-hero-title').textContent = `DIAGNOSTIC DEBRIEF // ${this.profile.name}`;

        // Render Metrics Grid
        document.getElementById('stat-metric-score').textContent = this.score;
        document.getElementById('stat-metric-accuracy').textContent = `${accuracyPct}%`;
        document.getElementById('stat-metric-passed').textContent = `${passedCount} / ${totalQuestions}`;
        document.getElementById('stat-metric-time').textContent = `${Math.round(totalTime)}s`;

        // Render Skill Radar Bars
        const domainBarsContainer = document.getElementById('competency-bars-container');
        domainBarsContainer.innerHTML = '';
        Object.entries(domainScores).forEach(([domain, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 100;
            const barHtml = `
                <div class="competency-item">
                    <div class="competency-meta">
                        <span>${domain}</span>
                        <span>${pct}% (${stats.passed}/${stats.total})</span>
                    </div>
                    <div class="competency-track">
                        <div class="competency-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
            domainBarsContainer.innerHTML += barHtml;
        });

        // Recommendations List
        const recList = document.getElementById('feedback-recommendations-list');
        recList.innerHTML = '';
        const recs = [];

        if (domainScores['Window Functions & Analytics'].passed < domainScores['Window Functions & Analytics'].total) {
            recs.push(`<strong>Window Functions Priority:</strong> Deepen practice with <code>DENSE_RANK()</code> vs <code>RANK()</code> tie rules, and explicit window frame bounds (<code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>) vs default <code>RANGE</code>.`);
        }
        if (domainScores['Relational Joins & Sets'].passed < domainScores['Relational Joins & Sets'].total) {
            recs.push(`<strong>Relational Anti-Join Patterns:</strong> Master <code>LEFT JOIN ... WHERE right.id IS NULL</code> and correlated <code>NOT EXISTS</code> to prevent null-leak bugs in <code>NOT IN</code> subqueries.`);
        }
        if (domainScores['Aggregation & Grouping'].passed < domainScores['Aggregation & Grouping'].total) {
            recs.push(`<strong>Strict Aggregation Semantics:</strong> Ensure all non-aggregated projections appear in <code>GROUP BY</code>, and remember <code>WHERE</code> executes before grouping while <code>HAVING</code> filters aggregated metrics.`);
        }
        if (accuracyPct >= 90) {
            recs.push(`<strong>Exceptional Relational Query Architecture:</strong> Flawless command demonstrated across indexing SARGability, multi-table joins, and advanced analytical partitions!`);
        }

        recs.forEach(r => {
            const div = document.createElement('div');
            div.className = 'rec-item';
            div.innerHTML = r;
            recList.appendChild(div);
        });

        // Detailed Question Review Section with Answers, Solutions, and Explanations
        const reviewContainer = document.getElementById('feedback-review-list');
        reviewContainer.innerHTML = '';

        questionResults.forEach(item => {
            const statusClass = item.isPassed ? 'passed' : 'failed';
            const statusText = item.isPassed ? 'PASSED ◈ CORRECT' : 'FAILED ◈ INCORRECT';

            const card = document.createElement('div');
            card.className = 'review-item';
            card.innerHTML = `
                <div class="review-item-header">
                    <div class="review-q-title">Q${item.index}: ${item.question.title} (${item.question.type.toUpperCase()})</div>
                    <span class="review-status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="review-choice-compare">
                    <div>
                        <div class="review-choice-label">YOUR SUBMISSION:</div>
                        <div style="color:${item.isPassed ? '#059669' : '#b91c1c'};white-space:pre-wrap;">${this.escapeHTML(item.userDisplay)}</div>
                    </div>
                    <div>
                        <div class="review-choice-label">OFFICIAL TARGET SOLUTION:</div>
                        <div style="color:#0f172a;font-weight:600;white-space:pre-wrap;">${this.escapeHTML(item.correctDisplay)}</div>
                    </div>
                </div>
                <div class="review-explanation-text">
                    <strong>Architectural Insight & Explanation:</strong><br>
                    ${item.question.explanation || (item.question.instructions ? item.question.instructions.join(' | ') : '')}
                </div>
            `;
            reviewContainer.appendChild(card);
        });
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    renderCertificate() {
        const certCanvas = document.getElementById('cert-canvas');
        if (!certCanvas) return;
        const ctx = certCanvas.getContext('2d');
        certCanvas.width = 860;
        certCanvas.height = 540;

        // Clean Editorial Ivory/Slate gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 860, 540);
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(1, '#f8fafc');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 860, 540);

        // Elegant Double Borders in Emerald & Slate
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 4;
        ctx.strokeRect(24, 24, 812, 492);

        ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(32, 32, 796, 476);

        // Header Title
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 22px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYSQL: QUANTUM QUERY CREDENTIAL', 430, 85);

        ctx.fillStyle = '#64748b';
        ctx.font = '13px Inter, sans-serif';
        ctx.fillText('OFFICIAL CERTIFICATION OF RELATIONAL SQL MASTERY', 430, 115);

        // Operative Name with Avatar
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px Orbitron, sans-serif';
        ctx.fillText(`${this.profile.avatar} ${this.profile.name}`, 430, 205);

        // Clearance Tier
        const levelData = window.PLAYSQL_MASTER_BANK[this.config.level];
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 18px Orbitron, sans-serif';
        ctx.fillText(`CLEARANCE TIER: ${levelData.title.toUpperCase()} [${levelData.badge}]`, 430, 250);

        // Score & Verification
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText(`FINAL SCORE: ${this.score} XP  |  ACCURACY: ${Math.round((this.score / (this.activeQuestions.length * 100)) * 100)}%`, 430, 310);

        const hash = 'PLAYSQL-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
        ctx.fillStyle = '#64748b';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`VERIFICATION HASH: ${hash}`, 430, 360);
        ctx.fillText(`ISSUED: ${new Date().toLocaleDateString()} | IN-BROWSER WASM SQL ENGINE`, 430, 385);

        const certModal = document.getElementById('cert-modal');
        if (certModal) certModal.classList.add('open');
    }

    renderSchemaModal() {
        const container = document.getElementById('schema-modal-content');
        if (!container) return;

        const schemas = this.db.getSchemaDetails();
        let html = '';

        schemas.forEach(s => {
            html += `
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                        <h3 style="font-family:var(--font-heading);color:#0f172a;font-size:1.05rem">TABLE: ${s.tableName}</h3>
                        <span style="font-family:var(--font-mono);color:#64748b;font-size:0.75rem">${s.columns.length} Columns</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            `;
            s.columns.forEach(c => {
                const pkBadge = c.pk ? '<span style="color:#d97706;font-weight:700">[PK]</span> ' : '';
                html += `<span style="background:#ffffff;border:1px solid #cbd5e1;padding:4px 8px;border-radius:6px;font-family:var(--font-mono);font-size:0.78rem">${pkBadge}<strong>${c.name}</strong> <em style="color:#64748b">${c.type}</em></span>`;
            });
            html += `</div>`;

            if (s.sample && s.sample.values && s.sample.values.length > 0) {
                html += `<div style="overflow-x:auto"><table class="cyber-table"><thead><tr>`;
                s.sample.columns.forEach(col => html += `<th>${col}</th>`);
                html += `</tr></thead><tbody>`;
                s.sample.values.forEach(row => {
                    html += `<tr>`;
                    row.forEach(v => html += `<td>${v}</td>`);
                    html += `</tr>`;
                });
                html += `</tbody></table></div>`;
            }

            html += `</div>`;
        });

        container.innerHTML = html;
    }

    openSchemaForTable(tableName) {
        this.renderSchemaModal();
        const modal = document.getElementById('schema-modal');
        if (modal) modal.classList.add('open');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new PlaySQLApp();
});
