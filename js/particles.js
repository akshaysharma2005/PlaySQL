/**
 * CyberSQL Background Particle & Grid Engine
 * Provides an interactive cyberpunk cyber-matrix canvas with drifting SQL keywords,
 * glowing network nodes, and mouse gravitational response.
 */
class CyberParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.keywords = [
            'SELECT', 'FROM', 'JOIN', 'WHERE', 'GROUP BY', 
            'HAVING', 'ORDER BY', 'PARTITION BY', 'OVER()', 
            'DENSE_RANK', 'LAG', 'LEAD', 'WITH RECURSIVE', 
            'COALESCE', 'CASE WHEN', 'INDEX', 'EXISTS'
        ];
        this.keywordParticles = [];
        this.mouse = { x: -1000, y: -1000, radius: 140 };
        this.numParticles = 55;
        this.animationId = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(this.numParticles, Math.floor((window.innerWidth * window.innerHeight) / 22000));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 2.2 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.4 ? '#00f3ff' : '#d946ef'
            });
        }

        // Create drifting SQL keyword entities
        this.keywordParticles = [];
        const numKeywords = Math.min(9, Math.floor(window.innerWidth / 160));
        for (let i = 0; i < numKeywords; i++) {
            this.keywordParticles.push({
                text: this.keywords[Math.floor(Math.random() * this.keywords.length)],
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.12 + 0.05,
                size: Math.floor(Math.random() * 4 + 11)
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw faint cyber grid background
        this.drawGrid();

        // Update and draw floating SQL keywords
        this.ctx.font = '600 12px "JetBrains Mono", monospace';
        this.keywordParticles.forEach((k) => {
            k.x += k.vx;
            k.y += k.vy;
            if (k.x < -100) k.x = this.canvas.width + 100;
            if (k.x > this.canvas.width + 100) k.x = -100;
            if (k.y < -50) k.y = this.canvas.height + 50;
            if (k.y > this.canvas.height + 50) k.y = -50;

            this.ctx.fillStyle = `rgba(0, 243, 255, ${k.alpha})`;
            this.ctx.fillText(k.text, k.x, k.y);
        });

        // Update & draw connection lines and nodes
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            p1.x += p1.vx;
            p1.y += p1.vy;

            // Bounce off screen boundaries gently
            if (p1.x < 0 || p1.x > this.canvas.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > this.canvas.height) p1.vy *= -1;

            // Mouse gravitational interaction
            const dxMouse = this.mouse.x - p1.x;
            const dyMouse = this.mouse.y - p1.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse < this.mouse.radius) {
                const force = (1 - distMouse / this.mouse.radius) * 1.5;
                p1.x -= (dxMouse / distMouse) * force;
                p1.y -= (dyMouse / distMouse) * force;
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p1.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = p1.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0; // reset

            // Connect neighboring particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    const lineAlpha = (1 - dist / 110) * 0.22;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 243, 255, ${lineAlpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawGrid() {
        const step = 80;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
}
