# ⚡ PlaySQL: Interactive 3D Gamified SQL Arena

[![SQLite WASM](https://img.shields.io/badge/SQLite-WASM-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-059669.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akshaysharma2005/PlaySQL)
[![Author](https://img.shields.io/badge/Author-M_Akshay_Sharma-0f172a)](https://github.com/akshaysharma2005)

**PlaySQL** is an in-browser, 3D gamified SQL coding challenge platform designed for data analysts, software engineers, and database practitioners. Powered by an in-memory **SQLite WebAssembly engine** and a real-time **Three.js WebGL spatial data prism**, PlaySQL transforms traditional technical assessments into a stress-free, engaging coding arena.

---

## ⚡ 1-Click Vercel Deployment

Deploy your own live copy of PlaySQL to Vercel in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akshaysharma2005/PlaySQL)

- **Framework Preset**: Other (Static Site)
- **Root Directory**: `./`
- **Build Command**: None (or leave blank)
- **Output Directory**: `./` (or leave blank)

---

## 🌟 Key Architectural Features

### 1. 🚪 Tactical Player Portal & Career Telemetry
- **Custom Gamertag & Generator**: Choose your own identity or roll the tactical codename generator (`QueryKnight`, `SchemaStriker`, `JoinMaestro`, etc.).
- **Interactive Avatar Selector**: Pick from 8 distinct player avatars.
- **Persistent Career Records**: Automatically tracks tests cleared, lifetime XP, and average accuracy in `localStorage`.

### 2. 🔀 Anti-Cheating Dynamic Session Randomizer
- **48 Curated SQL Questions**: 16 questions per tier across Beginner, Intermediate, and Advanced (10 MCQs + 6 In-browser coding challenges).
- **Seeded Fisher-Yates Shuffling**: Dynamically permutes question order and MCQ option choices (A, B, C, D) using a username + timestamp seed. No two players ever receive the identical test sequence.

### 3. 🌿 Calming, Editorial Design System
- Built to eliminate test-induced anxiety using an editorial light theme:
  - **Canvas**: Soft off-white & luminous pearl (`#f8fafc` / `#ffffff`).
  - **Accents**: Turf Emerald (`#059669` / `#10b981`), Mint (`#d1fae5`), and Soft Amber (`#d97706`).
  - **Typography & Panels**: Deep slate (`#0f172a`) with subtle glassmorphism (`rgba(15, 23, 42, 0.04)`).
- **Soothing Acoustic Soundscape**: Ambient electric piano chords, soft marimba tones, and gentle wooden ticks instead of harsh alarms.

### 4. 💎 3D Three.js WebGL Data Prism
- Real-time geometric icosahedron core with inner emerald luminescence.
- Gyroscopic orbital rings in chrome and emerald responsive to mouse parallax and cursor movement.
- Octahedral data shards drifting with gentle floating physics.

### 5. ⚡ Zero-Latency In-Browser SQLite WASM Engine
- Full relational database executed entirely client-side via WebAssembly.
- Schema Inspector with live table previews (`departments`, `employees`, `products`, `customers`, `orders`, `order_items`, `monthly_sales`).
- Custom lightweight code editor with syntax highlighting and line numbering.

### 6. 🔒 Delayed Solution Reveal & Comprehensive Debriefing
- Strictly enforces assessment integrity: solutions and explanations are withheld during the exam.
- **4-Domain Competency Matrix**:
  1. *Syntax & Filtering*
  2. *Relational Joins*
  3. *Aggregation & Grouping*
  4. *Window Functions & Analytical Operations*
- Question-by-question post-test breakdown with model solutions and query output diffs.
- Downloadable canvas-rendered Certificate of Completion.

---

## 📊 Difficulty Tiers

| Tier | Focus Areas | Complexity | Question Pool |
| :--- | :--- | :--- | :--- |
| **Beginner** | `SELECT`, `WHERE`, `ORDER BY`, `DISTINCT`, Basic `COUNT`/`SUM` | Entry-level SQL fundamentals | 10 MCQs + 6 Missions |
| **Intermediate** | `INNER`/`LEFT JOIN`, `GROUP BY`, `HAVING`, Subqueries, Date functions | Real-world business reporting | 10 MCQs + 6 Missions |
| **Advanced** | `ROW_NUMBER()`, `RANK()`, `LAG()`/`LEAD()`, CTEs, Multi-table joins | Enterprise analytics & optimization | 10 MCQs + 6 Missions |

---

## 🛠️ Quickstart (Run Locally)

No Node.js or Docker required — PlaySQL runs entirely in modern browsers with any static web server:

```bash
# Clone the repository
git clone https://github.com/akshaysharma2005/PlaySQL.git
cd PlaySQL

# Start a local HTTP server
python3 -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080/index.html
```

---

## 📁 Repository Structure

```
PlaySQL/
├── index.html            # Main SPA structure (Portal, Calibration, Arena, Debrief)
├── css/
│   └── styles.css        # Calming editorial light design system & glassmorphism
├── js/
│   ├── app.js            # Core state machine, exam logic & scoring
│   ├── database.js       # SQLite WASM initialization & in-memory database
│   ├── questions.js      # 48 Curated SQL questions & dynamic seeded generator
│   ├── editor.js         # Lightweight custom SQL editor with line numbers
│   ├── audio.js          # Web Audio API acoustic soundscape
│   ├── threeScene.js     # Three.js 3D WebGL data prism & orbital rings
│   ├── three.min.js      # Three.js r128 bundle
│   ├── sql-wasm.js       # SQLite WebAssembly loader
│   └── sql-wasm.wasm     # SQLite binary WASM module
├── source_data/          # Seed CSV data files
└── images/               # Schema diagrams & UI assets
```

---

## 👨‍💻 Author

**M Akshay Sharma**
- GitHub: [@akshaysharma2005](https://github.com/akshaysharma2005)
- Specialization: Computer Science & Data Analytics

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
