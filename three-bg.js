/**
 * Beat Box X — Obsidian Precision 3D Audio Visualizer
 * Architecture: High-End Audiophile Procedural Fluid Canvas (WebGL / Three.js)
 * Design Direction: Clean Architectural Fluid Surface, Quantum Stardust & Specular Crest Waves.
 * Zero generic AI wireframes or toy geometry — pure luxury atmospheric studio depth.
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;

    // 5 Bespoke Audiophile Palettes (Engineered for zero glare & deep contrast)
    this.themes = {
      obsidian: {
        id: "obsidian",
        name: "Obsidian Violet",
        primary: 0x8A5CFF,   // Obsidian Violet
        secondary: 0x4C1D95, // Deep Violet Core
        accent: 0x00E5FF,    // Specular Cyan Crest
        background: 0x08090C,
        fogDensity: 0.012
      },
      titanium: {
        id: "titanium",
        name: "Titanium Cyan",
        primary: 0x00E5FF,   // Titanium Cyan
        secondary: 0x0F4C81, // Deep Oceanic Cobalt
        accent: 0xE2E8F0,    // Brushed Steel Specular
        background: 0x07090E,
        fogDensity: 0.013
      },
      amber: {
        id: "amber",
        name: "Solar Amber",
        primary: 0xFF9900,   // Solar Amber
        secondary: 0xD4AF37, // Champagne Gold
        accent: 0xFFE082,    // Warm Solar Crest
        background: 0x0A0805,
        fogDensity: 0.013
      },
      cobalt: {
        id: "cobalt",
        name: "Abyssal Cobalt",
        primary: 0x1947E5,   // Electric Cobalt
        secondary: 0x00F5D4, // Aqua Bioluminescence
        accent: 0x60A5FA,    // Luminous Horizon
        background: 0x040814,
        fogDensity: 0.014
      },
      dynamic: {
        id: "dynamic",
        name: "Harmonic Dynamic",
        primary: 0x8A5CFF,
        secondary: 0x00E5FF,
        accent: 0xFF9900,
        background: 0x08090C,
        fogDensity: 0.012
      }
    };

    const initialThemeKey = options.theme && this.themes[options.theme] ? options.theme : 'obsidian';
    this.currentThemeKey = initialThemeKey;
    const themeCfg = this.themes[initialThemeKey];

    // Smooth Color Interpolation Targets
    this.primaryColor = new THREE.Color(themeCfg.primary);
    this.secondaryColor = new THREE.Color(themeCfg.secondary);
    this.accentColor = new THREE.Color(themeCfg.accent);

    this.targetPrimary = this.primaryColor.clone();
    this.targetSecondary = this.secondaryColor.clone();
    this.targetAccent = this.accentColor.clone();

    // User-Tunable Telemetry Parameters
    this.params = {
      waveSpeed: options.waveSpeed || 1.0,
      particleDensity: options.particleDensity || 1.0,
      audioBloom: options.audioBloom || 1.0
    };

    // Parallax Interpolation
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Smoothed Audio Frequency Bands
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.targetBass = 0;
    this.targetMid = 0;
    this.targetTreble = 0;

    this.init();
  }

  // Soft Photometric Particle Dot Generator
  createDotTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  init() {
    try {
      // 1. Scene & Depth Fog
      this.scene = new THREE.Scene();
      const themeCfg = this.themes[this.currentThemeKey] || this.themes.obsidian;
      this.scene.fog = new THREE.FogExp2(themeCfg.background, themeCfg.fogDensity);

      // 2. Camera Setup (Low Pitch Angle for Cinematic Horizon View)
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
      this.camera.position.set(0, 5, 28);
      this.camera.lookAt(0, -2, 0);

      // 3. Precision WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

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
      this.dotTexture = this.createDotTexture();

      // 4. Construct Bespoke Audiophile Elements
      this.createLiquidSurface();
      this.createQuantumField();
      this.createHorizonBeams();
      this.setupStudioLighting();

      // 5. Event Listeners
      this.handleResize = this.onWindowResize.bind(this);
      this.handleMouseMove = this.onMouseMove.bind(this);
      this.handleTouchMove = this.onTouchMove.bind(this);

      window.addEventListener('resize', this.handleResize, { passive: true });
      window.addEventListener('orientationchange', this.handleResize, { passive: true });
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove, { passive: true });

      // 6. Animation Clock
      this.clock = new THREE.Clock();
      this.animate();

      window.threeBgInstance = this;

    } catch (err) {
      console.warn("ThreeBackground WebGL initialization caught:", err);
    }
  }

  setupStudioLighting() {
    this.ambientLight = new THREE.AmbientLight(0x0e111a, 1.2);
    this.scene.add(this.ambientLight);

    // Key Horizon Light (Sweeps across the fluid wave crests)
    this.keyLight = new THREE.DirectionalLight(this.primaryColor.getHex(), 2.2);
    this.keyLight.position.set(0, 15, 10);
    this.scene.add(this.keyLight);

    // Rim Fill Light Left
    this.fillLightLeft = new THREE.PointLight(this.secondaryColor.getHex(), 1.6, 70);
    this.fillLightLeft.position.set(-20, 4, -10);
    this.scene.add(this.fillLightLeft);

    // Rim Fill Light Right
    this.fillLightRight = new THREE.PointLight(this.accentColor.getHex(), 1.4, 70);
    this.fillLightRight.position.set(20, -2, -8);
    this.scene.add(this.fillLightRight);
  }

  // COMPONENT 1: Liquid Chromatic Silk Wave Surface
  createLiquidSurface() {
    // High-density parametric surface
    const width = 120;
    const height = 90;
    const segX = 140;
    const segY = 100;

    this.liquidGeo = new THREE.PlaneGeometry(width, height, segX, segY);
    this.liquidGeo.rotateX(-Math.PI / 2.3);

    // Store base vertices for noise deformation
    const pos = this.liquidGeo.attributes.position;
    this.liquidBaseVertices = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count * 3; i++) {
      this.liquidBaseVertices[i] = pos.array[i];
    }

    // Double-pass liquid silk mesh:
    // Pass 1: Semi-translucent dark obsidian body
    this.liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x0B0D14,
      roughness: 0.28,
      metalness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82
    });

    this.liquidMesh = new THREE.Mesh(this.liquidGeo, this.liquidMaterial);
    this.liquidMesh.position.set(0, -9, -10);
    this.scene.add(this.liquidMesh);

    // Pass 2: Laser-hairline wireframe crest lattice (gives high-tech studio precision)
    this.latticeMaterial = new THREE.MeshBasicMaterial({
      color: this.primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending
    });

    this.latticeMesh = new THREE.Mesh(this.liquidGeo, this.latticeMaterial);
    this.latticeMesh.position.set(0, -8.95, -10);
    this.scene.add(this.latticeMesh);
  }

  // COMPONENT 2: Quantum Stardust Depth Field
  createQuantumField() {
    const starCount = 1400;
    this.quantumGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const scales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = Math.random() * 80 - 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
      scales[i] = Math.random() * 0.9 + 0.3;
    }

    this.quantumGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.quantumGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    this.quantumMaterial = new THREE.PointsMaterial({
      color: this.accentColor,
      size: 0.85,
      map: this.dotTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.quantumPoints = new THREE.Points(this.quantumGeo, this.quantumMaterial);
    this.scene.add(this.quantumPoints);
  }

  // COMPONENT 3: Horizon Atmospheric Gradient Ribbon
  createHorizonBeams() {
    const beamGeo = new THREE.PlaneGeometry(160, 24, 60, 8);
    this.horizonMaterial = new THREE.MeshBasicMaterial({
      color: this.primaryColor,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.horizonMesh = new THREE.Mesh(beamGeo, this.horizonMaterial);
    this.horizonMesh.position.set(0, 4, -40);
    this.horizonMesh.rotation.x = -Math.PI / 2.6;
    this.scene.add(this.horizonMesh);
  }

  // Audio Feed (Called from Web Audio Analyser every requestAnimationFrame)
  setBeatData(bass, treble, mid) {
    this.targetBass = bass || 0;
    this.targetTreble = treble || 0;
    this.targetMid = mid || 0;
  }

  // Dynamic Theme Switcher API
  setTheme(themeKey, customColors = null) {
    let p, s, a, bgHex, fog;

    if (customColors) {
      p = customColors.primary;
      s = customColors.secondary;
      a = customColors.accent;
      bgHex = customColors.bg || 0x08090C;
      fog = 0.012;
      this.currentThemeKey = 'dynamic';
    } else {
      const cfg = this.themes[themeKey] || this.themes.obsidian;
      this.currentThemeKey = themeKey;
      p = cfg.primary;
      s = cfg.secondary;
      a = cfg.accent;
      bgHex = cfg.background;
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

  // Dynamic Artwork Color Extraction
  setAccentColor(hexColor) {
    if (!hexColor) return;
    try {
      this.targetPrimary.setHex(hexColor);
      const hsl = {};
      this.targetPrimary.getHSL(hsl);
      // Create a sophisticated harmonious contrast for secondary and accent
      this.targetSecondary.setHSL((hsl.h + 0.55) % 1.0, 0.7, 0.45);
      this.targetAccent.setHSL((hsl.h + 0.15) % 1.0, 0.9, 0.65);
    } catch (e) {}
  }

  // Telemetry Param Updates (Wave Speed, Particle Density, Audio Bloom)
  setParams(newParams) {
    if (newParams.waveSpeed !== undefined) this.params.waveSpeed = newParams.waveSpeed;
    if (newParams.particleDensity !== undefined) {
      this.params.particleDensity = newParams.particleDensity;
      if (this.quantumMaterial) {
        this.quantumMaterial.opacity = 0.3 + 0.5 * this.params.particleDensity;
      }
    }
    if (newParams.audioBloom !== undefined) this.params.audioBloom = newParams.audioBloom;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Audio Reactivity Damping
    this.bass += (this.targetBass - this.bass) * 0.16;
    this.mid += (this.targetMid - this.mid) * 0.18;
    this.treble += (this.targetTreble - this.treble) * 0.22;

    const b = this.bass * this.params.audioBloom;
    const m = this.mid * this.params.audioBloom;
    const t = this.treble * this.params.audioBloom;

    // 2. Smooth Color Transitions (Lerp)
    const lerpRate = 0.04;
    this.primaryColor.lerp(this.targetPrimary, lerpRate);
    this.secondaryColor.lerp(this.targetSecondary, lerpRate);
    this.accentColor.lerp(this.targetAccent, lerpRate);

    // Apply colors to scene elements
    if (this.keyLight) this.keyLight.color.copy(this.primaryColor);
    if (this.fillLightLeft) this.fillLightLeft.color.copy(this.secondaryColor);
    if (this.fillLightRight) this.fillLightRight.color.copy(this.accentColor);
    if (this.latticeMaterial) this.latticeMaterial.color.copy(this.primaryColor);
    if (this.quantumMaterial) this.quantumMaterial.color.copy(this.accentColor);
    if (this.horizonMaterial) this.horizonMaterial.color.copy(this.primaryColor);

    // 3. Deform Liquid Silk Mesh (Procedural Harmonic Wave Physics)
    if (this.liquidGeo) {
      const pos = this.liquidGeo.attributes.position;
      const count = pos.count;
      const base = this.liquidBaseVertices;
      const speed = elapsedTime * 0.9 * this.params.waveSpeed;
      const waveHeight = 2.4 + b * 4.2;
      const rippleFreq = 0.08 + m * 0.03;

      for (let i = 0; i < count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];

        // Complex 3-octave fluid wave equation
        const z = Math.sin(x * rippleFreq + speed) * waveHeight * 0.6 +
                  Math.cos(y * (rippleFreq * 0.8) + speed * 1.1) * (waveHeight * 0.4) +
                  Math.sin((x + y) * 0.05 + speed * 1.6) * (1.2 + t * 2.0);

        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      this.liquidGeo.computeVertexNormals();

      // Dynamic surface luminescence based on beat intensity
      this.latticeMaterial.opacity = 0.16 + b * 0.28;
      this.horizonMaterial.opacity = 0.08 + b * 0.15;
    }

    // 4. Quantum Stardust Field Gentle Swirl
    if (this.quantumPoints) {
      this.quantumPoints.rotation.y = elapsedTime * 0.01 * this.params.waveSpeed;
      this.quantumPoints.rotation.x = Math.sin(elapsedTime * 0.005) * 0.015;
      this.quantumMaterial.size = 0.75 + t * 0.6;
    }

    // 5. Studio Key Light Dynamic Orbit
    if (this.keyLight) {
      this.keyLight.position.x = Math.sin(elapsedTime * 0.35) * 24;
      this.keyLight.intensity = 1.6 + b * 1.8;
    }

    // 6. Damped Mouse & Touch Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.camera.position.x = this.mouseX * 3.2;
    this.camera.position.y = 5.0 - (this.mouseY * 1.8);
    this.camera.lookAt(0, -2, 0);

    // 7. Render
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
      'liquidGeo', 'liquidMaterial', 'latticeMaterial',
      'quantumGeo', 'quantumMaterial', 'dotTexture',
      'horizonMaterial'
    ];
    disposables.forEach(key => {
      if (this[key] && this[key].dispose) this[key].dispose();
    });

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
