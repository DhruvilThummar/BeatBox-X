/**
 * Beat Box X — Bespoke 3D Chill Audio Sanctuary
 * Architecture: Stylized Low-Poly Music Listener under a Luminous Crystal Bonsai Tree
 * Design Concept: A chill listener with glowing audiophile headphones sitting under
 * a crystalline tree beside a reflective pond with expanding soundwave ripples,
 * orbiting equalizer beat bars, and celestial stardust.
 * Fully coupled to Web Audio FFT, Theme Presets, and Studio Sliders.
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;

    // 5 Bespoke Audiophile Master Themes
    this.themes = {
      obsidian: {
        id: "obsidian",
        name: "Obsidian Violet",
        primary: 0x8A5CFF,   // Obsidian Violet
        secondary: 0x5B21B6, // Deep Violet Core
        accent: 0x00E5FF,    // Specular Cyan Crest
        background: 0x07080D,
        fogDensity: 0.022
      },
      titanium: {
        id: "titanium",
        name: "Titanium Cyan",
        primary: 0x00E5FF,   // Titanium Cyan
        secondary: 0x0F4C81, // Deep Oceanic Cobalt
        accent: 0x38BDF8,    // Electric Sky Specular
        background: 0x040910,
        fogDensity: 0.022
      },
      amber: {
        id: "amber",
        name: "Solar Amber",
        primary: 0xFF9900,   // Solar Amber
        secondary: 0xD4AF37, // Champagne Gold
        accent: 0xFBBF24,    // Warm Solar Crest
        background: 0x0A0704,
        fogDensity: 0.022
      },
      cobalt: {
        id: "cobalt",
        name: "Abyssal Cobalt",
        primary: 0x2979FF,   // Electric Cobalt
        secondary: 0x1A237E, // Deep Indigo
        accent: 0x60A5FA,    // Luminous Horizon
        background: 0x030612,
        fogDensity: 0.022
      },
      dynamic: {
        id: "dynamic",
        name: "Harmonic Dynamic",
        primary: 0x8A5CFF,
        secondary: 0x00E5FF,
        accent: 0xD946EF,
        background: 0x07080D,
        fogDensity: 0.022
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

    // Scene Elements Storage
    this.crystalClusters = [];
    this.ripples = [];
    this.musicalBeats = [];
    this.soundwaveSpheres = [];

    this.init();
  }

  init() {
    // 1. Canvas Setup
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'three-bg-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0';
    this.canvas.style.transition = 'opacity 1.2s ease-in-out';
    this.container.appendChild(this.canvas);

    // 2. Renderer with Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 3. Scene & Atmospheric Studio Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.themes[this.currentThemeKey].background, this.themes[this.currentThemeKey].fogDensity);

    // 4. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 4.6, 13.5);
    this.camera.lookAt(0, 1.6, 0);

    // 5. Root Group for Scene Parallax
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // 6. Build Scene Objects
    this.setupLighting();
    this.buildReflectivePond();
    this.buildIslandPlatform();
    this.buildCrystalTree();
    this.buildChillListener();
    this.buildSoundwaveRipples();
    this.buildOrbitingBeatEqualizer();
    this.buildFloatingSoundSpheres();
    this.buildStardustField();

    // 7. Event Handlers
    this.clock = new THREE.Clock();
    this.onResizeBound = this.onWindowResize.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);

    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('mousemove', this.onMouseMoveBound, { passive: true });
    window.addEventListener('touchmove', this.onTouchMoveBound, { passive: true });

    // 8. Start Animation Loop
    window.threeBgInstance = this;
    requestAnimationFrame(() => {
      this.canvas.style.opacity = '1';
    });
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0x161824, 1.8);
    this.scene.add(this.ambientLight);

    // Key Moon / Atmospheric Studio Light
    this.moonLight = new THREE.DirectionalLight(this.primaryColor, 2.0);
    this.moonLight.position.set(-6, 14, 8);
    this.scene.add(this.moonLight);

    // Cyan Rim Fill Light
    this.cyanRim = new THREE.DirectionalLight(this.accentColor, 2.2);
    this.cyanRim.position.set(8, 7, -6);
    this.scene.add(this.cyanRim);

    // Amber Ambient Island Point Light
    this.amberPoint = new THREE.PointLight(0xFFA500, 2.4, 14, 1.8);
    this.amberPoint.position.set(0, 3.2, 0);
    this.scene.add(this.amberPoint);
  }

  buildReflectivePond() {
    const pondGeo = new THREE.CircleGeometry(18, 64);
    this.pondMat = new THREE.MeshStandardMaterial({
      color: 0x05070A,
      roughness: 0.12,
      metalness: 0.88
    });
    const pond = new THREE.Mesh(pondGeo, this.pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.y = -0.05;
    this.root.add(pond);
  }

  buildIslandPlatform() {
    // Obsidian Boulder Platform (Geometric low-poly island)
    const islandGeo = new THREE.CylinderGeometry(4.2, 4.8, 0.9, 8);
    islandGeo.computeVertexNormals();
    this.islandMat = new THREE.MeshStandardMaterial({
      color: 0x14161F,
      roughness: 0.75,
      metalness: 0.25,
      flatShading: true
    });
    const island = new THREE.Mesh(islandGeo, this.islandMat);
    island.position.set(0, 0.4, 0);
    this.root.add(island);

    // Stepping stones around island
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1A1D27,
      roughness: 0.8,
      flatShading: true
    });
    const stonePositions = [
      { x: -3.6, z: 2.2, r: 0.75 },
      { x: 3.3, z: 2.5, r: 0.8 },
      { x: -2.9, z: -2.7, r: 0.9 },
      { x: 3.0, z: -2.2, r: 0.65 }
    ];
    stonePositions.forEach(s => {
      const stGeo = new THREE.CylinderGeometry(s.r, s.r * 1.2, 0.45, 6);
      const st = new THREE.Mesh(stGeo, stoneMat);
      st.position.set(s.x, 0.2, s.z);
      st.rotation.y = Math.random() * Math.PI;
      this.root.add(st);
    });
  }

  buildCrystalTree() {
    this.treeGroup = new THREE.Group();
    this.treeGroup.position.set(-1.25, 0.85, -0.6);
    this.root.add(this.treeGroup);

    // Twisted Obsidian Trunk
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x161320,
      roughness: 0.65,
      metalness: 0.35,
      flatShading: true
    });

    const trunkSegments = [
      { rT: 0.38, rB: 0.55, h: 1.1, rotZ: 0.15, rotX: -0.1, px: 0, py: 0.55, pz: 0 },
      { rT: 0.28, rB: 0.38, h: 1.1, rotZ: 0.42, rotX: 0.1, px: 0.2, py: 1.45, pz: -0.05 },
      { rT: 0.2, rB: 0.28, h: 1.0, rotZ: -0.28, rotX: 0.22, px: 0.65, py: 2.25, pz: 0.05 },
      { rT: 0.14, rB: 0.2, h: 0.9, rotZ: -0.55, rotX: -0.15, px: 0.6, py: 2.95, pz: 0.15 }
    ];

    trunkSegments.forEach(seg => {
      const geo = new THREE.CylinderGeometry(seg.rT, seg.rB, seg.h, 6);
      const m = new THREE.Mesh(geo, trunkMat);
      m.position.set(seg.px, seg.py, seg.pz);
      m.rotation.z = seg.rotZ;
      m.rotation.x = seg.rotX;
      this.treeGroup.add(m);
    });

    // Glowing Crystal Poly Leaves / Foliage
    this.crystalMatPrimary = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.6,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    this.crystalMatAccent = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 1.0,
      roughness: 0.15,
      metalness: 0.7,
      flatShading: true,
      transparent: true,
      opacity: 0.94
    });

    this.crystalMatSecondary = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.5,
      flatShading: true
    });

    const clusterNodes = [
      { x: 0.9, y: 3.4, z: 0.2, scale: 1.15, mat: this.crystalMatAccent },
      { x: 1.6, y: 3.1, z: -0.4, scale: 0.95, mat: this.crystalMatPrimary },
      { x: 0.1, y: 3.3, z: 0.6, scale: 0.9, mat: this.crystalMatPrimary },
      { x: 1.2, y: 2.6, z: 0.7, scale: 0.8, mat: this.crystalMatSecondary },
      { x: -0.4, y: 2.5, z: -0.3, scale: 0.85, mat: this.crystalMatAccent },
      { x: 2.1, y: 2.8, z: 0.1, scale: 0.75, mat: this.crystalMatPrimary }
    ];

    clusterNodes.forEach(c => {
      const cg = new THREE.DodecahedronGeometry(c.scale * 0.7, 0);
      const cm = new THREE.Mesh(cg, c.mat);
      cm.position.set(c.x, c.y, c.z);
      this.treeGroup.add(cm);

      // Orbiting micro-facet crystals around each foliage node
      for (let j = 0; j < 4; j++) {
        const subG = new THREE.OctahedronGeometry(c.scale * 0.28, 0);
        const subM = new THREE.Mesh(subG, (j % 2 === 0) ? this.crystalMatPrimary : this.crystalMatAccent);
        const angle = (j / 4) * Math.PI * 2;
        const dist = c.scale * 0.62;
        subM.position.set(
          c.x + Math.cos(angle) * dist,
          c.y + (Math.random() - 0.5) * 0.4,
          c.z + Math.sin(angle) * dist
        );
        subM.rotation.set(Math.random(), Math.random(), Math.random());
        this.treeGroup.add(subM);
        this.crystalClusters.push({
          mesh: subM,
          initY: subM.position.y,
          speed: 1.2 + j * 0.4
        });
      }
    });
  }

  buildChillListener() {
    this.listenerGroup = new THREE.Group();
    this.listenerGroup.position.set(1.1, 0.85, 0.6);
    this.listenerGroup.rotation.y = -Math.PI / 4;
    this.root.add(this.listenerGroup);

    // Seated Low-Poly Listener
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x1A1E29,
      roughness: 0.8,
      metalness: 0.12,
      flatShading: true
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xC8AA98,
      roughness: 0.7,
      flatShading: true
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x12141C,
      roughness: 0.9,
      flatShading: true
    });

    // Torso / Hoodie (leaning back in relaxed listening pose)
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.46, 0.95, 6);
    this.listenerTorso = new THREE.Mesh(torsoGeo, hoodieMat);
    this.listenerTorso.position.set(0, 0.72, 0);
    this.listenerTorso.rotation.x = -0.22;
    this.listenerGroup.add(this.listenerTorso);

    // Crossed Legs Base
    const legsGeo = new THREE.BoxGeometry(0.95, 0.35, 0.75);
    const legs = new THREE.Mesh(legsGeo, pantsMat);
    legs.position.set(0, 0.18, 0.12);
    this.listenerGroup.add(legs);

    // Relaxed Arms resting on knees
    const armLGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.65, 5);
    const armL = new THREE.Mesh(armLGeo, hoodieMat);
    armL.position.set(-0.45, 0.55, 0.1);
    armL.rotation.z = 0.35;
    armL.rotation.x = 0.4;
    this.listenerGroup.add(armL);

    const armRGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.65, 5);
    const armR = new THREE.Mesh(armRGeo, hoodieMat);
    armR.position.set(0.45, 0.55, 0.1);
    armR.rotation.z = -0.35;
    armR.rotation.x = 0.4;
    this.listenerGroup.add(armR);

    // Head (tilted back slightly enjoying the songs)
    const headGeo = new THREE.DodecahedronGeometry(0.28, 0);
    this.listenerHead = new THREE.Mesh(headGeo, skinMat);
    this.listenerHead.position.set(0, 1.35, -0.05);
    this.listenerHead.rotation.x = 0.12;
    this.listenerGroup.add(this.listenerHead);

    // Glowing Precision Audiophile Headphones
    const phoneMatHeadband = new THREE.MeshStandardMaterial({
      color: 0x0A0C10,
      roughness: 0.3,
      metalness: 0.8
    });
    this.headphoneGlowMatL = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.4
    });
    this.headphoneGlowMatR = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.4
    });

    // Headband
    const headbandGeo = new THREE.TorusGeometry(0.32, 0.04, 8, 20, Math.PI);
    const headband = new THREE.Mesh(headbandGeo, phoneMatHeadband);
    headband.position.set(0, 1.4, -0.05);
    headband.rotation.x = Math.PI;
    headband.rotation.z = 0.05;
    this.listenerGroup.add(headband);

    // Glowing Earcups
    [-0.34, 0.34].forEach((sideX, idx) => {
      const mat = (idx === 0) ? this.headphoneGlowMatL : this.headphoneGlowMatR;
      const cupGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
      const cup = new THREE.Mesh(cupGeo, mat);
      cup.position.set(sideX, 1.35, -0.05);
      cup.rotation.z = Math.PI / 2;
      this.listenerGroup.add(cup);

      // Glowing outer ring LED
      const ringGeo = new THREE.TorusGeometry(0.12, 0.02, 6, 16);
      const ring = new THREE.Mesh(ringGeo, mat);
      ring.position.set(sideX * 1.12, 1.35, -0.05);
      ring.rotation.y = Math.PI / 2;
      this.listenerGroup.add(ring);
    });

    // Headphone Point Light (casting colored ambient radiance onto the listener)
    this.earLight = new THREE.PointLight(this.accentColor, 1.6, 3.5, 2);
    this.earLight.position.set(0, 1.4, 0.1);
    this.listenerGroup.add(this.earLight);
  }

  buildSoundwaveRipples() {
    this.ripples = [];
    const rippleColors = [this.accentColor, this.primaryColor, this.secondaryColor];

    for (let r = 0; r < 7; r++) {
      const ripGeo = new THREE.RingGeometry(0.4, 0.48, 48);
      const ripMat = new THREE.MeshBasicMaterial({
        color: rippleColors[r % rippleColors.length],
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const rip = new THREE.Mesh(ripGeo, ripMat);
      rip.rotation.x = -Math.PI / 2;
      rip.position.set(0.6, 0.02, 0.3);
      this.root.add(rip);
      this.ripples.push({
        mesh: rip,
        scale: 1 + r * 1.1,
        speed: 0.018 + (r % 3) * 0.005,
        maxScale: 9.5
      });
    }
  }

  buildOrbitingBeatEqualizer() {
    this.musicalBeats = [];
    this.barMatPrimary = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 1.4,
      roughness: 0.3,
      flatShading: true
    });
    this.barMatAccent = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      flatShading: true
    });
    this.barMatSecondary = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      flatShading: true
    });

    // 16 vertical audio equalizer bars orbiting the chill sanctuary
    for (let b = 0; b < 16; b++) {
      const h = 0.4 + Math.random() * 0.8;
      const bGeo = new THREE.BoxGeometry(0.12, h, 0.12);
      const chosenMat = (b % 3 === 0) ? this.barMatPrimary : (b % 3 === 1 ? this.barMatAccent : this.barMatSecondary);
      const beatMesh = new THREE.Mesh(bGeo, chosenMat);

      const angle = (b / 16) * Math.PI * 2;
      const rad = 2.4 + Math.sin(b * 1.7) * 0.6;
      beatMesh.position.set(
        Math.cos(angle) * rad,
        1.2 + Math.sin(b) * 0.5,
        Math.sin(angle) * rad
      );
      this.root.add(beatMesh);
      this.musicalBeats.push({
        mesh: beatMesh,
        angle: angle,
        radius: rad,
        initY: beatMesh.position.y,
        speed: 0.4 + (b % 4) * 0.2,
        phase: b * 0.5
      });
    }
  }

  buildFloatingSoundSpheres() {
    this.soundwaveSpheres = [];
    for (let s = 0; s < 12; s++) {
      const sGeo = new THREE.IcosahedronGeometry(0.14 + Math.random() * 0.12, 1);
      const sMat = new THREE.MeshStandardMaterial({
        color: (s % 2 === 0) ? this.accentColor : this.primaryColor,
        emissive: (s % 2 === 0) ? this.accentColor : this.primaryColor,
        emissiveIntensity: 1.8,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const sphere = new THREE.Mesh(sGeo, sMat);
      sphere.position.set(
        (Math.random() - 0.5) * 6,
        1.5 + Math.random() * 3.5,
        (Math.random() - 0.5) * 6
      );
      this.root.add(sphere);
      this.soundwaveSpheres.push({
        mesh: sphere,
        vy: 0.008 + Math.random() * 0.012,
        origX: sphere.position.x,
        origZ: sphere.position.z,
        freq: 1.0 + Math.random() * 2.0
      });
    }
  }

  buildStardustField() {
    const particleCount = 480;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const colOptions = [
      this.primaryColor,
      this.accentColor,
      this.secondaryColor,
      new THREE.Color(0xFFFFFF)
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = 4.0 + Math.random() * 14.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85);

      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = 0.5 + r * Math.cos(phi);
      pPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = colOptions[Math.floor(Math.random() * colOptions.length)];
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    this.pMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(pGeometry, this.pMaterial);
    this.root.add(this.particles);
  }

  // Audio Feed (Invoked by Web Audio Analyser node every frame)
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
      bgHex = customColors.bg || 0x07080D;
      fog = 0.022;
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
      this.targetSecondary.setHSL((hsl.h + 0.55) % 1.0, 0.7, 0.45);
      this.targetAccent.setHSL((hsl.h + 0.15) % 1.0, 0.9, 0.65);
    } catch (e) {}
  }

  // Live Studio Parameter Updates (Wave Speed, Particle Density, Audio Bloom)
  setParams(newParams = {}) {
    if (newParams.waveSpeed !== undefined) this.params.waveSpeed = newParams.waveSpeed;
    if (newParams.particleDensity !== undefined) {
      this.params.particleDensity = newParams.particleDensity;
      if (this.pMaterial) {
        this.pMaterial.opacity = 0.3 + 0.55 * this.params.particleDensity;
      }
    }
    if (newParams.audioBloom !== undefined) this.params.audioBloom = newParams.audioBloom;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Audio Damping
    this.bass += (this.targetBass - this.bass) * 0.18;
    this.mid += (this.targetMid - this.mid) * 0.18;
    this.treble += (this.targetTreble - this.treble) * 0.22;

    const b = this.bass * this.params.audioBloom;
    const m = this.mid * this.params.audioBloom;
    const t = this.treble * this.params.audioBloom;

    // 2. Smooth Color Lerp
    const lerpRate = 0.045;
    this.primaryColor.lerp(this.targetPrimary, lerpRate);
    this.secondaryColor.lerp(this.targetSecondary, lerpRate);
    this.accentColor.lerp(this.targetAccent, lerpRate);

    // Update scene light colors
    if (this.moonLight) this.moonLight.color.copy(this.primaryColor);
    if (this.cyanRim) this.cyanRim.color.copy(this.accentColor);
    if (this.earLight) this.earLight.color.copy(this.accentColor);

    // Update crystal foliage materials
    if (this.crystalMatPrimary) {
      this.crystalMatPrimary.color.copy(this.primaryColor);
      this.crystalMatPrimary.emissive.copy(this.primaryColor);
      this.crystalMatPrimary.emissiveIntensity = 0.8 + t * 1.4;
    }
    if (this.crystalMatAccent) {
      this.crystalMatAccent.color.copy(this.accentColor);
      this.crystalMatAccent.emissive.copy(this.accentColor);
      this.crystalMatAccent.emissiveIntensity = 0.9 + b * 1.6;
    }
    if (this.crystalMatSecondary) {
      this.crystalMatSecondary.color.copy(this.secondaryColor);
      this.crystalMatSecondary.emissive.copy(this.secondaryColor);
    }

    // Update headphones glow
    if (this.headphoneGlowMatL) {
      this.headphoneGlowMatL.color.copy(this.accentColor);
      this.headphoneGlowMatL.emissive.copy(this.accentColor);
      this.headphoneGlowMatL.emissiveIntensity = 1.8 + b * 2.2;
    }
    if (this.headphoneGlowMatR) {
      this.headphoneGlowMatR.color.copy(this.primaryColor);
      this.headphoneGlowMatR.emissive.copy(this.primaryColor);
      this.headphoneGlowMatR.emissiveIntensity = 1.8 + b * 2.2;
    }

    // 3. Listener Audio Sway & Head Groove
    if (this.listenerHead && this.listenerTorso) {
      const grooveTempo = elapsedTime * 2.8 * this.params.waveSpeed;
      this.listenerHead.rotation.x = 0.12 + Math.sin(grooveTempo) * (0.04 + b * 0.08);
      this.listenerHead.rotation.z = Math.cos(grooveTempo * 0.5) * (0.02 + m * 0.04);
      this.listenerTorso.rotation.x = -0.22 + Math.sin(grooveTempo) * (0.015 + b * 0.03);
    }

    // 4. Crystal Tree Foliage Shimmer
    this.crystalClusters.forEach((cc, idx) => {
      cc.mesh.position.y = cc.initY + Math.sin(elapsedTime * cc.speed + idx) * 0.08;
      cc.mesh.rotation.x += 0.01;
      cc.mesh.rotation.y += 0.015;
    });

    // 5. Soundwave Pond Ripples Pulsing with Bass
    this.ripples.forEach((rip, idx) => {
      rip.scale += rip.speed * this.params.waveSpeed * (1.0 + b * 1.2);
      if (rip.scale > rip.maxScale) {
        rip.scale = 0.5;
      }
      rip.mesh.scale.set(rip.scale, rip.scale, 1);
      const progress = rip.scale / rip.maxScale;
      rip.mesh.material.opacity = Math.max(0, (0.85 + b * 0.4) * (1.0 - progress));
      if (idx % 2 === 0) {
        rip.mesh.material.color.copy(this.accentColor);
      } else {
        rip.mesh.material.color.copy(this.primaryColor);
      }
    });

    // 6. Orbiting Beat Equalizer Bars Scaling to Frequency FFT
    if (this.barMatPrimary) this.barMatPrimary.color.copy(this.primaryColor);
    if (this.barMatAccent) this.barMatAccent.color.copy(this.accentColor);
    if (this.barMatSecondary) this.barMatSecondary.color.copy(this.secondaryColor);

    this.musicalBeats.forEach((mb, idx) => {
      const freqSample = (idx % 3 === 0) ? b : ((idx % 3 === 1) ? m : t);
      const beatPulse = Math.abs(Math.sin(elapsedTime * 3.5 * this.params.waveSpeed + mb.phase));
      mb.mesh.scale.y = 0.4 + (beatPulse * 1.8 + freqSample * 2.5);
      mb.mesh.position.y = mb.initY + (mb.mesh.scale.y * 0.25);
      mb.angle += 0.005 * this.params.waveSpeed;
      mb.mesh.position.x = Math.cos(mb.angle) * mb.radius;
      mb.mesh.position.z = Math.sin(mb.angle) * mb.radius;
      mb.mesh.rotation.y += 0.02;
    });

    // 7. Ascending Acoustic Spheres
    this.soundwaveSpheres.forEach(sw => {
      sw.mesh.position.y += sw.vy * (1.0 + t * 1.5);
      sw.mesh.position.x = sw.origX + Math.sin(elapsedTime * sw.freq) * 0.25;
      sw.mesh.position.z = sw.origZ + Math.cos(elapsedTime * sw.freq) * 0.25;
      sw.mesh.rotation.x += 0.02;
      sw.mesh.rotation.y += 0.03;
      if (sw.mesh.position.y > 6.0) {
        sw.mesh.position.y = 1.0;
      }
    });

    // 8. Stardust Twinkle & Slow Celestial Orbit
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.015 * this.params.waveSpeed;
    }

    // 9. Dynamic Atmospheric Light Breathing
    if (this.amberPoint) {
      this.amberPoint.intensity = 2.4 + Math.sin(elapsedTime * 4.0) * 0.6 + b * 1.5;
    }
    if (this.cyanRim) {
      this.cyanRim.intensity = 1.8 + Math.cos(elapsedTime * 3.2) * 0.5 + m * 1.2;
    }

    // 10. Damped Mouse & Touch Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.camera.position.x = this.mouseX * 3.5;
    this.camera.position.y = 4.6 - (this.mouseY * 1.6);
    this.camera.lookAt(0, 1.6, 0);

    // 11. Render
    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    this.targetMouseX = nx * 0.4;
    this.targetMouseY = ny * 0.25;
  }

  onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const nx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      this.targetMouseX = nx * 0.4;
      this.targetMouseY = ny * 0.25;
    }
  }

  onWindowResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
}

window.ThreeBackground = ThreeBackground;
