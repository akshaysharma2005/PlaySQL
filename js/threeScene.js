/**
 * PlaySQL 3D Luminous Prism Engine (Three.js)
 * Clean, calming, editorial 3D WebGL graphics:
 * - Luminous geometric data prism / faceted icosahedron core with glass refractions
 * - Soft orbital chrome & emerald rings
 * - Floating translucent data crystals drifting gently in light space
 * - Gentle mouse parallax and calm, soothing ambient lighting (Zero stress, luxury editorial feel)
 */
class PlaySQL3DScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || typeof THREE === 'undefined') return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.coreGroup = null;
        this.prismMesh = null;
        this.orbitalRings = [];
        this.floatingShards = [];
        this.particles = null;

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetCamX = 0;
        this.targetCamY = 0;

        this.init();
    }

    init() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Scene & Camera (Calming, light fog)
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.0012);

        this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 2000);
        this.camera.position.set(0, 30, 480);

        // 2. High-Precision WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3. Calming, Soft Editorial Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 1.8);
        this.scene.add(ambient);

        // Soft Sunlight
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
        sunLight.position.set(150, 250, 200);
        this.scene.add(sunLight);

        // Gentle Emerald Tint Light
        const emeraldLight = new THREE.PointLight(0x10b981, 1.8, 700);
        emeraldLight.position.set(-180, 100, 150);
        this.scene.add(emeraldLight);

        // Soft Indigo Accent Light
        const indigoLight = new THREE.PointLight(0x6366f1, 1.2, 700);
        indigoLight.position.set(150, -120, 100);
        this.scene.add(indigoLight);

        // 4. Build 3D Luminous Prism Core
        this.buildPrismCore();

        // 5. Build Floating Translucent Data Shards
        this.buildFloatingShards();

        // 6. Build Ethereal Light Particles
        this.buildParticleField();

        // 7. Event Listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // 8. Start Animation Loop
        this.animate();
    }

    buildPrismCore() {
        this.coreGroup = new THREE.Group();

        // Central Faceted Icosahedron (Geometric Data Crystal)
        const prismGeo = new THREE.IcosahedronGeometry(48, 1);
        const prismMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x10b981,
            emissiveIntensity: 0.12,
            roughness: 0.1,
            metalness: 0.2,
            transmission: 0.6,
            thickness: 1.2,
            transparent: true,
            opacity: 0.85
        });
        this.prismMesh = new THREE.Mesh(prismGeo, prismMat);
        this.coreGroup.add(this.prismMesh);

        // Delicate Emerald & Chrome Wireframe Cage
        const wireGeo = new THREE.IcosahedronGeometry(49, 1);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x059669,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        this.coreGroup.add(wireMesh);

        // Inner Golden Spark Node
        const sparkGeo = new THREE.SphereGeometry(14, 16, 16);
        const sparkMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.6,
            roughness: 0.2
        });
        this.sparkNode = new THREE.Mesh(sparkGeo, sparkMat);
        this.coreGroup.add(this.sparkNode);

        // Elegant Gyroscopic Orbital Rings (Soft Emerald & Slate)
        const ringConfigs = [
            { radius: 88, tube: 1.2, color: 0x10b981, speedX: 0.006, speedY: 0.012 },
            { radius: 118, tube: 1.0, color: 0x0ea5e9, speedX: -0.009, speedY: 0.007 },
            { radius: 148, tube: 0.8, color: 0x64748b, speedX: 0.005, speedY: -0.010 }
        ];

        this.orbitalRings = [];
        ringConfigs.forEach(cfg => {
            const ringGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                transparent: true,
                opacity: 0.45
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.random() * Math.PI;
            ringMesh.rotation.y = Math.random() * Math.PI;

            this.coreGroup.add(ringMesh);
            this.orbitalRings.push({ mesh: ringMesh, ...cfg });
        });

        this.coreGroup.position.set(0, 20, -50);
        this.scene.add(this.coreGroup);
    }

    buildFloatingShards() {
        this.floatingShards = [];
        const shardGeo = new THREE.OctahedronGeometry(12, 0);

        for (let i = 0; i < 28; i++) {
            const shardMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: i % 2 === 0 ? 0x10b981 : 0x0284c7,
                emissiveIntensity: 0.25,
                roughness: 0.2,
                metalness: 0.4,
                transparent: true,
                opacity: 0.75
            });
            const mesh = new THREE.Mesh(shardGeo, shardMat);

            const distance = 160 + Math.random() * 260;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI * 0.7;

            mesh.position.set(
                distance * Math.cos(theta) * Math.cos(phi),
                distance * Math.sin(phi) + 10,
                distance * Math.sin(theta) * Math.cos(phi) - 60
            );

            mesh.scale.setScalar(Math.random() * 0.7 + 0.5);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            this.scene.add(mesh);
            this.floatingShards.push({
                mesh,
                rotSpeedX: (Math.random() - 0.5) * 0.015,
                rotSpeedY: (Math.random() - 0.5) * 0.015,
                baseY: mesh.position.y,
                floatSpeed: Math.random() * 0.012 + 0.004
            });
        }
    }

    buildParticleField() {
        const count = 380;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const emerald = new THREE.Color(0x10b981);
        const teal = new THREE.Color(0x0ea5e9);
        const slate = new THREE.Color(0x94a3b8);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 1100;
            positions[i3 + 1] = (Math.random() - 0.5) * 800;
            positions[i3 + 2] = (Math.random() - 0.5) * 900 - 80;

            const r = Math.random();
            let c = emerald;
            if (r > 0.6) c = teal;
            else if (r > 0.85) c = slate;

            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 3.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.55
        });

        this.particles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(this.particles);
    }

    onMouseMove(e) {
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        this.targetCamX = this.mouseX * 35;
        this.targetCamY = 30 + this.mouseY * 25;
    }

    onResize() {
        if (!this.renderer || !this.camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    triggerCelebration() {
        if (!this.coreGroup) return;
        this.coreGroup.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => {
            if (this.coreGroup) this.coreGroup.scale.set(1, 1, 1);
        }, 400);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now() * 0.001;

        // Gentle camera parallax
        this.camera.position.x += (this.targetCamX - this.camera.position.x) * 0.04;
        this.camera.position.y += (this.targetCamY - this.camera.position.y) * 0.04;
        this.camera.lookAt(0, 10, 0);

        // Rotate prism core smoothly
        if (this.prismMesh) {
            this.prismMesh.rotation.y = time * 0.22;
            this.prismMesh.rotation.x = Math.sin(time * 0.15) * 0.2;
        }

        // Rotate orbital rings
        this.orbitalRings.forEach(r => {
            r.mesh.rotation.x += r.speedX;
            r.mesh.rotation.y += r.speedY;
        });

        // Float shards gently like dandelion seeds
        this.floatingShards.forEach((s, idx) => {
            s.mesh.rotation.x += s.rotSpeedX;
            s.mesh.rotation.y += s.rotSpeedY;
            s.mesh.position.y = s.baseY + Math.sin(time * 1.5 + idx) * 8;
        });

        // Drift particle cloud
        if (this.particles) {
            this.particles.rotation.y = time * 0.015;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

window.PlaySQL3DScene = PlaySQL3DScene;
