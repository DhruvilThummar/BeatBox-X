/**
 * Premium 3D Background Component for Beat Box X
 * Tech Stack: Vanilla JavaScript / Three.js (WebGL)
 * Visual Style: High-End Audio-Reactive 3D Holographic Universe with Real-Time Themes
 * 
 * Features:
 * - 6 Handcrafted Aesthetic Themes + Dynamic Album Art Reactive Mode
 * - Multi-layer Audio-Reactive Aurora Ribbons with live frequency displacement
 * - Central Holographic Pulsing Core (Wireframe lattice + inner energy bloom)
 * - Volumetric Starfield with twinkling depth & floating cosmic dust particles
 * - Smooth color lerping transitions between themes & album artwork
 * - Mouse parallax & touch tilt interactivity with smooth lerp damping
 * - Full memory lifecycle management, WebGL context resilience & 60fps performance
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;

    // Theme color palettes
    this.themes = {
      cosmic: {
        name: "Cosmic Aurora",
        primary: 0x8B5CF6,   // Vivid Purple
        secondary: 0x06B6D4, // Cyan
        accent: 0xEC4899,    // Neon Pink
        bg: 0x050510,
        fogDensity: 0.012
      },
      cyberpunk: {
        name: "Cyberpunk Neon",
        primary: 0xFF0055,   // Neon Crimson
        secondary: 0x00FFCC, // Electric Cyan
        accent: 0xFFE600,    // Cyber Yellow
        bg: 0x08000F,
        fogDensity: 0.014
      },
      retrowave: {
        name: "Sunset Retrowave",
        primary: 0xFF5E3A,   // Warm Sunset Orange
        secondary: 0x9B5DE5, // Synthwave Violet
        accent: 0xF15BB5,    // Retro Magenta
        bg: 0x0F051D,
        fogDensity: 0.012
      },
      ocean: {
        name: "Ocean Abyss",
        primary: 0x00F5D4,   // Bioluminescent Aqua
        secondary: 0x00BBF9, // Deep Aqua Blue
        accent: 0x4361EE,    // Royal Indigo
        bg: 0x030D1A,
        fogDensity: 0.013
      },
      gold: {
        name: "Royal Gold",
        primary: 0xD4AF37,   // Regal Champagne Gold
        secondary: 0xFFB703, // Golden Amber
        accent: 0xFFE8A3,    // Soft Pale Gold
        bg: 0x0A0905,
        fogDensity: 0.013
      },
      emerald: {
        name: "Emerald Matrix",
        primary: 0x10B981,   // Radiant Emerald
        secondary: 0x06D6A0, // Mint Turquoise
        accent: 0x34D399,    // Neon Mint
        bg: 0x02140D,
        fogDensity: 0.013
      }
    };

    const initialThemeKey = options.theme && this.themes[options.theme] ? options.theme : 'cosmic';
    this.currentThemeKey = initialThemeKey;
    const themeCfg = this.themes[initialThemeKey];

    // Current working colors (THREE.Color objects for smooth lerping)
    this.primaryColor = new THREE.Color(options.primaryColor || themeCfg.primary);
    this.secondaryColor = new THREE.Color(options.secondaryColor || themeCfg.secondary);
    this.accentColor = new THREE.Color(options.accentColor || themeCfg.accent);

    // Target colors for smooth lerp transitions
    this.targetPrimary = this.primaryColor.clone();
    this.targetSecondary = this.secondaryColor.clone();
    this.targetAccent = this.accentColor.clone();

    this.particleCount = options.particleCount || 1000;

    // Mouse & Touch Parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Audio reactive metrics
    this.bassFactor = 0;
    this.trebleFactor = 0;
    this.midFactor = 0;
    this.smoothBass = 0;
    this.smoothTreble = 0;

    this.init();
  }

  // Create smooth radial glow texture for particle points
  createParticleTexture(r, g, b) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1.0)`);
    gradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.75)`);
    gradient.addColorStop(0.55, `rgba(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.9)}, 0.25)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Create sharp star point texture
  createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.2, 'rgba(230, 240, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(180, 205, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  init() {
    try {
      // 1. Scene & Fog Setup
      this.scene = new THREE.Scene();
      const themeCfg = this.themes[this.currentThemeKey] || this.themes.cosmic;
      this.scene.fog = new THREE.FogExp2(themeCfg.bg, themeCfg.fogDensity);

      // 2. Camera Setup
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 1000);
      this.camera.position.set(0, 3, 34);

      // 3. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "mediump"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Fixed full viewport background canvas
      this.canvas = this.renderer.domElement;
      Object.assign(this.canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100dvh',
        zIndex: '0',
        pointerEvents: 'none',
        outline: 'none',
        border: 'none',
        willChange: 'transform'
      });

      this.container.appendChild(this.canvas);

      // 4. Particle Textures
      this.dustTexture1 = this.createParticleTexture(139, 92, 246);
      this.dustTexture2 = this.createParticleTexture(6, 182, 212);
      this.starTexture = this.createStarTexture();

      // 5. Construct 3D Scene Geometry
      this.createStarfield();
      this.createCosmicDust();
      this.createAuroraRibbons();
      this.createHoloOrb();
      this.createGyroRings();

      // 6. Multi-Point Lighting System
      this.setupLights();

      // 7. Event Listeners
      this.handleResize = this.onWindowResize.bind(this);
      this.handleMouseMove = this.onMouseMove.bind(this);
      this.handleTouchMove = this.onTouchMove.bind(this);

      window.addEventListener('resize', this.handleResize, { passive: true });
      window.addEventListener('orientationchange', this.handleResize, { passive: true });
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove, { passive: true });

      // 8. Start Animation Loop
      this.clock = new THREE.Clock();
      this.animate();

      // Expose globally for audio sync and UI theme controller
      window.threeBgInstance = this;

    } catch (err) {
      console.warn("ThreeBackground WebGL initialization caught:", err);
    }
  }

  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x12122b, 0.9);
    this.scene.add(this.ambientLight);

    // Primary Light (Left)
    this.primaryLight = new THREE.PointLight(this.primaryColor.getHex(), 1.6, 90);
    this.primaryLight.position.set(-18, 12, 8);
    this.scene.add(this.primaryLight);

    // Secondary Light (Right)
    this.secondaryLight = new THREE.PointLight(this.secondaryColor.getHex(), 1.4, 90);
    this.secondaryLight.position.set(18, -6, 12);
    this.scene.add(this.secondaryLight);

    // Accent Light (Top Center)
    this.accentLight = new THREE.PointLight(this.accentColor.getHex(), 1.0, 70);
    this.accentLight.position.set(0, 16, -10);
    this.scene.add(this.accentLight);
  }

  // LAYER 1: Deep Volumetric Starfield
  createStarfield() {
    this.starGeometry = new THREE.BufferGeometry();
    const starCount = 1800;
    const positions = new Float32Array(starCount * 3);
    const starTwinkleSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 130 - 15;
      starTwinkleSpeeds[i] = 1.0 + Math.random() * 3.0;
    }

    this.starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.starGeometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(starTwinkleSpeeds, 1));

    this.starMaterial = new THREE.PointsMaterial({
      color: 0xE8EDFF,
      size: 0.7,
      map: this.starTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.starfield = new THREE.Points(this.starGeometry, this.starMaterial);
    this.scene.add(this.starfield);
  }

  // LAYER 2: Floating Cosmic Dust Clouds (Two Swarms)
  createCosmicDust() {
    // Swarm 1: Primary Color
    this.dustGeometry1 = new THREE.BufferGeometry();
    const count1 = Math.floor(this.particleCount * 0.6);
    const pos1 = new Float32Array(count1 * 3);
    for (let i = 0; i < count1; i++) {
      pos1[i * 3] = (Math.random() - 0.5) * 110;
      pos1[i * 3 + 1] = (Math.random() - 0.5) * 85;
      pos1[i * 3 + 2] = (Math.random() - 0.5) * 75;
    }
    this.dustGeometry1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));

    this.dustMaterial1 = new THREE.PointsMaterial({
      color: this.primaryColor,
      size: 1.2,
      map: this.dustTexture1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.cosmicDust1 = new THREE.Points(this.dustGeometry1, this.dustMaterial1);
    this.scene.add(this.cosmicDust1);

    // Swarm 2: Secondary Color
    this.dustGeometry2 = new THREE.BufferGeometry();
    const count2 = Math.floor(this.particleCount * 0.4);
    const pos2 = new Float32Array(count2 * 3);
    for (let i = 0; i < count2; i++) {
      pos2[i * 3] = (Math.random() - 0.5) * 100;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 75;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 65;
    }
    this.dustGeometry2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));

    this.dustMaterial2 = new THREE.PointsMaterial({
      color: this.secondaryColor,
      size: 1.1,
      map: this.dustTexture2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.cosmicDust2 = new THREE.Points(this.dustGeometry2, this.dustMaterial2);
    this.scene.add(this.cosmicDust2);
  }

  // LAYER 3: Audio-Reactive Flowing Aurora Wave Meshes
  createAuroraRibbons() {
    this.auroraRibbons = [];
    const ribbonConfigs = [
      { y: -9, z: -14, width: 130, segments: 85, opacity: 0.22, speed: 0.85, amp: 2.8, phase: 0 },
      { y: -13, z: -20, width: 150, segments: 75, opacity: 0.17, speed: 1.1, amp: 3.4, phase: 1.6 },
      { y: -6, z: -25, width: 110, segments: 65, opacity: 0.13, speed: 1.4, amp: 2.4, phase: 3.2 }
    ];

    ribbonConfigs.forEach((cfg, idx) => {
      const geometry = new THREE.PlaneGeometry(cfg.width, 18, cfg.segments, 9);
      const color = idx === 0 ? this.primaryColor : (idx === 1 ? this.secondaryColor : this.accentColor);

      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: cfg.opacity,
        wireframe: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2.8;
      mesh.position.set(0, cfg.y, cfg.z);
      this.scene.add(mesh);

      this.auroraRibbons.push({
        mesh,
        geometry,
        material,
        speed: cfg.speed,
        amplitude: cfg.amp,
        phase: cfg.phase,
        idx: idx
      });
    });
  }

  // LAYER 4: Audio-Reactive Central Hologram Orb
  createHoloOrb() {
    // Outer dynamic geometric wireframe cage
    const outerGeo = new THREE.IcosahedronGeometry(3.6, 4);
    this.holoOrbMaterial = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.5,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      roughness: 0.3,
      metalness: 0.8
    });

    this.holoOrb = new THREE.Mesh(outerGeo, this.holoOrbMaterial);
    this.holoOrb.position.set(0, 2.2, -5);
    this.scene.add(this.holoOrb);

    // Inner glowing core sphere
    const innerGeo = new THREE.IcosahedronGeometry(2.6, 3);
    this.innerCoreMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.innerCore = new THREE.Mesh(innerGeo, this.innerCoreMaterial);
    this.innerCore.position.set(0, 2.2, -5);
    this.scene.add(this.innerCore);
  }

  // LAYER 5: Gyroscopic Floating Orbital Rings & Geometries
  createGyroRings() {
    this.gyroObjects = [];

    // Ring 1: Primary Outer Gyro Ring
    const ring1Geo = new THREE.TorusGeometry(8.5, 0.14, 16, 100);
    this.ring1Material = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      wireframe: true,
      emissive: this.primaryColor,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.3,
      roughness: 0.2,
      metalness: 0.85
    });
    const ring1 = new THREE.Mesh(ring1Geo, this.ring1Material);
    ring1.position.set(-21, 6, -15);
    ring1.rotation.x = Math.PI / 4;
    this.scene.add(ring1);
    this.gyroObjects.push({ mesh: ring1, rotX: 0.005, rotY: 0.008, rotZ: 0.003, floatSpeed: 0.7 });

    // Ring 2: Secondary Orbital Ring
    const ring2Geo = new THREE.TorusGeometry(5.4, 0.12, 16, 80);
    this.ring2Material = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      wireframe: true,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.25,
      roughness: 0.2,
      metalness: 0.85
    });
    const ring2 = new THREE.Mesh(ring2Geo, this.ring2Material);
    ring2.position.set(23, 7, -18);
    ring2.rotation.z = Math.PI / 5;
    this.scene.add(ring2);
    this.gyroObjects.push({ mesh: ring2, rotX: -0.006, rotY: 0.005, rotZ: -0.004, floatSpeed: 0.85 });

    // Octahedron: Accent Prism
    const octGeo = new THREE.OctahedronGeometry(3.2, 1);
    this.octMaterial = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      wireframe: true,
      emissive: this.accentColor,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.22,
      roughness: 0.3,
      metalness: 0.8
    });
    const oct = new THREE.Mesh(octGeo, this.octMaterial);
    oct.position.set(16, -7, -11);
    this.scene.add(oct);
    this.gyroObjects.push({ mesh: oct, rotX: 0.007, rotY: -0.008, rotZ: 0.005, floatSpeed: 1.1 });
  }

  // Audio Beat Feed (Called every animation frame from Web Audio Analyser)
  setBeatData(bass, treble, mid) {
    this.bassFactor = bass || 0;
    this.trebleFactor = treble || 0;
    this.midFactor = mid || 0;
  }

  // Dynamic Theme Switcher API
  setTheme(themeKey, customColors = null) {
    let p, s, a, bgHex, fog;

    if (customColors) {
      p = customColors.primary;
      s = customColors.secondary;
      a = customColors.accent;
      bgHex = customColors.bg || 0x050510;
      fog = 0.012;
      this.currentThemeKey = 'custom';
    } else {
      const cfg = this.themes[themeKey] || this.themes.cosmic;
      this.currentThemeKey = themeKey;
      p = cfg.primary;
      s = cfg.secondary;
      a = cfg.accent;
      bgHex = cfg.bg;
      fog = cfg.fogDensity;
    }

    this.targetPrimary.setHex(p);
    this.targetSecondary.setHex(s);
    this.targetAccent.setHex(a);

    if (this.scene && this.scene.fog) {
      this.scene.fog.color.setHex(bgHex);
      this.scene.fog.density = fog;
    }
  }

  // Album Artwork Accent Sync
  setAccentColor(hexColor) {
    if (!hexColor) return;
    try {
      this.targetAccent.setHex(hexColor);
      // Softly nudge secondary color toward harmonious blend
      const hsl = {};
      this.targetAccent.getHSL(hsl);
      this.targetSecondary.setHSL((hsl.h + 0.3) % 1.0, 0.8, 0.55);
    } catch (e) {}
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Audio Reactivity Interpolation (Damping)
    this.smoothBass += (this.bassFactor - this.smoothBass) * 0.18;
    this.smoothTreble += (this.trebleFactor - this.smoothTreble) * 0.2;
    const bass = this.smoothBass;
    const treble = this.smoothTreble;

    // 2. Smooth Color Lerp (Transitions themes & album artwork gracefully)
    const lerpSpeed = 0.04;
    this.primaryColor.lerp(this.targetPrimary, lerpSpeed);
    this.secondaryColor.lerp(this.targetSecondary, lerpSpeed);
    this.accentColor.lerp(this.targetAccent, lerpSpeed);

    // Apply interpolated colors to materials and lights
    if (this.primaryLight) this.primaryLight.color.copy(this.primaryColor);
    if (this.secondaryLight) this.secondaryLight.color.copy(this.secondaryColor);
    if (this.accentLight) this.accentLight.color.copy(this.accentColor);

    if (this.dustMaterial1) this.dustMaterial1.color.copy(this.primaryColor);
    if (this.dustMaterial2) this.dustMaterial2.color.copy(this.secondaryColor);

    if (this.holoOrbMaterial) {
      this.holoOrbMaterial.color.copy(this.primaryColor);
      this.holoOrbMaterial.emissive.copy(this.primaryColor);
    }
    if (this.innerCoreMaterial) this.innerCoreMaterial.color.copy(this.secondaryColor);
    if (this.ring1Material) {
      this.ring1Material.color.copy(this.primaryColor);
      this.ring1Material.emissive.copy(this.primaryColor);
    }
    if (this.ring2Material) {
      this.ring2Material.color.copy(this.secondaryColor);
      this.ring2Material.emissive.copy(this.secondaryColor);
    }
    if (this.octMaterial) {
      this.octMaterial.color.copy(this.accentColor);
      this.octMaterial.emissive.copy(this.accentColor);
    }

    // 3. Starfield Drift & Twinkle
    if (this.starfield) {
      this.starfield.rotation.y = elapsedTime * 0.007;
      this.starfield.rotation.x = Math.sin(elapsedTime * 0.004) * 0.015;
      this.starMaterial.opacity = 0.72 + Math.sin(elapsedTime * 2.2) * 0.18 + treble * 0.2;
    }

    // 4. Cosmic Dust Clouds Orbit & Audio Reactivity
    if (this.cosmicDust1) {
      this.cosmicDust1.rotation.y = elapsedTime * 0.015 + bass * 0.08;
      this.cosmicDust1.rotation.x = Math.sin(elapsedTime * 0.008) * 0.025;
      this.dustMaterial1.opacity = 0.45 + bass * 0.35;
    }
    if (this.cosmicDust2) {
      this.cosmicDust2.rotation.y = -elapsedTime * 0.012;
      this.cosmicDust2.rotation.z = Math.cos(elapsedTime * 0.006) * 0.02;
      this.dustMaterial2.opacity = 0.4 + bass * 0.3;
    }

    // 5. Aurora Ribbons Wave Physics (Vertex Displacement)
    this.auroraRibbons.forEach(ribbon => {
      // Sync color with current theme
      if (ribbon.idx === 0) ribbon.material.color.copy(this.primaryColor);
      else if (ribbon.idx === 1) ribbon.material.color.copy(this.secondaryColor);
      else ribbon.material.color.copy(this.accentColor);

      const pos = ribbon.geometry.attributes.position;
      const waveAmp = ribbon.amplitude + bass * 3.5;
      const trebleAmp = treble * 1.2;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * 0.055 + elapsedTime * ribbon.speed + ribbon.phase) * waveAmp +
                  Math.cos(y * 0.075 + elapsedTime * (ribbon.speed * 0.75)) * (waveAmp * 0.55) +
                  Math.sin((x + y) * 0.09 + elapsedTime * 2.5) * trebleAmp;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      ribbon.material.opacity = ribbon.material.opacity * 0.94 + (0.13 + bass * 0.18) * 0.06;
    });

    // 6. Hologram Orb Pulsing & Rotation
    if (this.holoOrb) {
      const scale = 1.0 + bass * 0.45;
      this.holoOrb.scale.set(scale, scale, scale);
      this.holoOrb.rotation.x += 0.004 + bass * 0.008;
      this.holoOrb.rotation.y += 0.006 + bass * 0.01;
      this.holoOrbMaterial.opacity = 0.28 + bass * 0.3;
      this.holoOrbMaterial.emissiveIntensity = 0.4 + bass * 0.8;
    }
    if (this.innerCore) {
      const iScale = 1.0 + bass * 0.28;
      this.innerCore.scale.set(iScale, iScale, iScale);
      this.innerCore.rotation.x -= 0.003;
      this.innerCore.rotation.y -= 0.004;
      this.innerCoreMaterial.opacity = 0.12 + bass * 0.25;
    }

    // 7. Gyroscopic Floating Rings Rotation & Orbit
    if (this.gyroObjects) {
      this.gyroObjects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotX * (1 + bass * 0.4);
        obj.mesh.rotation.y += obj.rotY * (1 + bass * 0.4);
        if (obj.rotZ) obj.mesh.rotation.z += obj.rotZ;
        obj.mesh.position.y += Math.sin(elapsedTime * obj.floatSpeed + idx * 1.5) * 0.018;
      });
    }

    // 8. Dynamic Multi-Point Orbiting Lights
    if (this.primaryLight) {
      this.primaryLight.position.x = Math.sin(elapsedTime * 0.28) * 22;
      this.primaryLight.position.y = 12 + Math.cos(elapsedTime * 0.18) * 6;
      this.primaryLight.intensity = 1.3 + bass * 1.6;
    }
    if (this.secondaryLight) {
      this.secondaryLight.position.x = Math.cos(elapsedTime * 0.22) * 20;
      this.secondaryLight.position.y = -6 + Math.sin(elapsedTime * 0.14) * 5;
      this.secondaryLight.intensity = 1.1 + bass * 1.2;
    }

    // 9. Smooth Parallax Camera Lerping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.045;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.045;

    this.camera.position.x = this.mouseX * 3.5;
    this.camera.position.y = 3.0 - (this.mouseY * 2.2);
    this.camera.lookAt(0, 0, -5);

    // 10. Render
    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);

    const disposables = [
      'starGeometry', 'starMaterial', 'starTexture',
      'dustGeometry1', 'dustMaterial1', 'dustTexture1',
      'dustGeometry2', 'dustMaterial2', 'dustTexture2',
      'holoOrbMaterial', 'innerCoreMaterial',
      'ring1Material', 'ring2Material', 'octMaterial'
    ];
    disposables.forEach(key => {
      if (this[key] && this[key].dispose) this[key].dispose();
    });

    if (this.auroraRibbons) {
      this.auroraRibbons.forEach(r => {
        if (r.geometry) r.geometry.dispose();
        if (r.material) r.material.dispose();
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.ThreeBackground = ThreeBackground;
}
