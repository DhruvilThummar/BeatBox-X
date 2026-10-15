/**
 * Beat Box X — Ultra-Realistic 3D Audiophile Sanctuary
 * Concept: Atmospheric nocturnal scene of an audiophile music listener with precision headphones
 * relaxing under a gnarled, luminous Bonsai tree beside an undulating reflecting lake.
 *
 * Visual & Physics Highlights:
 *  - Multi-Octave Gerstner Wave Water Simulation with acoustic island ripples & specular glints
 *  - Spline-Extruded Gnarled Bonsai Tree with organic root flare, twisted branches & layered crystal canopy
 *  - Anatomically proportioned relaxed listener with organic breathing, beat-responsive head groove & finger taps
 *  - High-Fidelity Audiophile Headphones with plush leather cushions, aluminum gimbals & audio-reactive LED rings
 *  - Braided catenary audio cable running to a dedicated DAC with a live animated OLED spectrum display
 *  - Atmospheric nocturnal sky with crescent moon, glowing lunar corona, cosmic nebula haze & 700 twinkling stars
 *  - 45 drifting sound blossom petals & 36 bio-fireflies with organic flight paths
 *  - Live coupling to Web Audio FFT (Bass, Mid, Treble), 5 bespoke themes & Studio sliders
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;

    // 5 Bespoke Audiophile Reference Color Palettes
    this.themes = {
      obsidian: {
        id: "obsidian",
        name: "Obsidian Violet",
        primary: 0x8A5CFF,   // Obsidian Violet
        secondary: 0x5B21B6, // Velvet Deep
        accent: 0x00E5FF,    // Specular Cyan Crest
        background: 0x06070B,
        waterColor: 0x04060A,
        fogDensity: 0.022
      },
      titanium: {
        id: "titanium",
        name: "Titanium Cyan",
        primary: 0x00E5FF,   // Cryogenic Cyan
        secondary: 0x0F4C81, // Abyssal Cobalt
        accent: 0x38BDF8,    // Electric Sky
        background: 0x03070E,
        waterColor: 0x02050B,
        fogDensity: 0.022
      },
      amber: {
        id: "amber",
        name: "Solar Amber",
        primary: 0xFF9900,   // Solar Phosphor
        secondary: 0x994D00, // Deep Honey
        accent: 0xFBBF24,    // Warm Solar Crest
        background: 0x090603,
        waterColor: 0x060402,
        fogDensity: 0.022
      },
      cobalt: {
        id: "cobalt",
        name: "Abyssal Cobalt",
        primary: 0x2979FF,   // Electric Cobalt
        secondary: 0x1A237E, // Deep Indigo
        accent: 0x60A5FA,    // Horizon Glow
        background: 0x020510,
        waterColor: 0x01030B,
        fogDensity: 0.022
      },
      dynamic: {
        id: "dynamic",
        name: "Harmonic Dynamic",
        primary: 0x8A5CFF,
        secondary: 0x00E5FF,
        accent: 0xD946EF,
        background: 0x06070B,
        waterColor: 0x04060A,
        fogDensity: 0.022
      }
    };

    const initialKey = options.theme && this.themes[options.theme] ? options.theme : 'obsidian';
    this.currentThemeKey = initialKey;
    const themeCfg = this.themes[initialKey];

    // Smooth Color Interpolation Vectors
    this.primaryColor = new THREE.Color(themeCfg.primary);
    this.secondaryColor = new THREE.Color(themeCfg.secondary);
    this.accentColor = new THREE.Color(themeCfg.accent);
    this.bgColor = new THREE.Color(themeCfg.background);

    this.targetPrimary = this.primaryColor.clone();
    this.targetSecondary = this.secondaryColor.clone();
    this.targetAccent = this.accentColor.clone();
    this.targetBg = this.bgColor.clone();

    // Studio Parameter Controls
    this.params = {
      waveSpeed: options.waveSpeed || 1.0,
      particleDensity: options.particleDensity || 1.0,
      audioBloom: options.audioBloom || 1.0
    };

    // Camera & Mouse Damping
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Smoothed Audio Frequency Bands (0.0 to 1.0)
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.targetBass = 0;
    this.targetMid = 0;
    this.targetTreble = 0;

    // Animation Collections
    this.foliageClusters = [];
    this.fallingPetals = [];
    this.fireflies = [];
    this.dacBars = [];

    this.init();
  }

  // Generate Soft Radial Glow Texture for Light Halos & Moon Corona
  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Generate Multi-Octave Normal Map for Realistic Liquid Specular Glints
  createWaterNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base neutral normal (RGB 128, 128, 255)
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 256, 256);

    // Multi-frequency harmonic caustic rings
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      const r = 8 + i * 15;
      ctx.arc(128, 128, r, 0, Math.PI * 2);
      const intensity = Math.sin((i / 16) * Math.PI) * 0.22;
      ctx.strokeStyle = `rgba(145, 120, 255, ${intensity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // High-frequency subtle surface micro-noise
    for (let x = 0; x < 256; x += 4) {
      for (let y = 0; y < 256; y += 4) {
        if (Math.random() > 0.4) {
          const shift = Math.floor((Math.random() - 0.5) * 20);
          ctx.fillStyle = `rgba(${128 + shift}, ${128 + shift}, 255, 0.12)`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }

  init() {
    // 1. WebGL Canvas Setup
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
    this.canvas.style.transition = 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
    this.container.appendChild(this.canvas);

    // 2. High-Performance Renderer with Realistic PBR & Shadows
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.32;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Scene & Depth Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(
      this.themes[this.currentThemeKey].background,
      this.themes[this.currentThemeKey].fogDensity
    );

    // 4. Perspective Camera Framing the Sanctuary
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 3.8, 12.8);
    this.camera.lookAt(0, 1.4, 0);

    // 5. Root Transform Hierarchy
    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.glowTexture = this.createGlowTexture();
    this.waterNormalTexture = this.createWaterNormalTexture();

    // 6. Assemble Realistic World Elements
    this.setupLighting();
    this.buildDynamicWaterLake();
    this.buildIslandSanctuary();
    this.buildOrganicBonsaiTree();
    this.buildChillListener();
    this.buildFallingSoundPetals();
    this.buildBioFireflies();
    this.buildCelestialAtmosphere();

    // 7. Event Handlers
    this.clock = new THREE.Clock();
    this.onResizeBound = this.onWindowResize.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);

    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('mousemove', this.onMouseMoveBound, { passive: true });
    window.addEventListener('touchmove', this.onTouchMoveBound, { passive: true });

    // 8. Launch Animation
    window.threeBgInstance = this;
    requestAnimationFrame(() => {
      this.canvas.style.opacity = '1';
    });
    this.animate();
  }

  setupLighting() {
    // 1. Soft Nocturnal Ambient Fill Light
    this.ambientLight = new THREE.AmbientLight(0x0C101A, 1.5);
    this.scene.add(this.ambientLight);

    // 2. Main Directional Moonlight (Silvery Moon Ray casting soft shadows)
    this.moonLight = new THREE.DirectionalLight(this.primaryColor, 2.6);
    this.moonLight.position.set(-9, 17, 9);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.camera.near = 0.5;
    this.moonLight.shadow.camera.far = 36;
    this.moonLight.shadow.camera.left = -6;
    this.moonLight.shadow.camera.right = 6;
    this.moonLight.shadow.camera.top = 6;
    this.moonLight.shadow.camera.bottom = -6;
    this.moonLight.shadow.bias = -0.0006;
    this.scene.add(this.moonLight);

    // 3. Specular Rim Cyan Light from Lake Horizon
    this.cyanRim = new THREE.DirectionalLight(this.accentColor, 2.2);
    this.cyanRim.position.set(10, 5, -8);
    this.scene.add(this.cyanRim);

    // 4. Warm Point Light Radiating from Seating Platform
    this.islandPoint = new THREE.PointLight(0xFFA500, 2.2, 11, 2.0);
    this.islandPoint.position.set(0.2, 2.4, 0.4);
    this.islandPoint.castShadow = true;
    this.scene.add(this.islandPoint);

    // 5. Headphone LED Halo Local Cast Light
    this.earLight = new THREE.PointLight(this.accentColor, 1.8, 3.5, 2.0);
    this.earLight.position.set(1.15, 2.3, 0.65);
    this.scene.add(this.earLight);
  }

  buildDynamicWaterLake() {
    // High-Resolution 72x72 Grid for Smooth Gerstner Fluid Undulation
    this.waterSegments = 72;
    const waterRadius = 24;
    this.waterGeo = new THREE.PlaneGeometry(waterRadius * 2, waterRadius * 2, this.waterSegments, this.waterSegments);
    this.waterGeo.rotateX(-Math.PI / 2);

    const pos = this.waterGeo.attributes.position;
    this.waterBaseX = new Float32Array(pos.count);
    this.waterBaseY = new Float32Array(pos.count);
    this.waterBaseZ = new Float32Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      this.waterBaseX[i] = pos.getX(i);
      this.waterBaseY[i] = pos.getY(i);
      this.waterBaseZ[i] = pos.getZ(i);
    }

    this.waterMat = new THREE.MeshStandardMaterial({
      color: this.themes[this.currentThemeKey].waterColor,
      roughness: 0.05,
      metalness: 0.94,
      normalMap: this.waterNormalTexture,
      transparent: true,
      opacity: 0.94
    });

    this.waterMesh = new THREE.Mesh(this.waterGeo, this.waterMat);
    this.waterMesh.position.y = -0.02;
    this.waterMesh.receiveShadow = true;
    this.root.add(this.waterMesh);

    // Luminous Shoreline Foam Ring (Highlights lake-rock intersection)
    const foamGeo = new THREE.RingGeometry(4.7, 5.3, 48);
    foamGeo.rotateX(-Math.PI / 2);
    this.foamMat = new THREE.MeshBasicMaterial({
      color: this.accentColor,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.foamRing = new THREE.Mesh(foamGeo, this.foamMat);
    this.foamRing.position.set(0, 0.01, 0);
    this.root.add(this.foamRing);
  }

  buildIslandSanctuary() {
    // 1. Natural Layered Basalt Stone Platform
    const islandGeo = new THREE.CylinderGeometry(4.4, 5.2, 1.15, 18, 3);
    islandGeo.computeVertexNormals();

    // Sculpt natural organic rock fissures & stepped bevels
    const pos = islandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      const dist = Math.sqrt(pos.getX(i) ** 2 + pos.getZ(i) ** 2);
      const rockNoise = Math.sin(angle * 5) * 0.16 + Math.cos(angle * 7) * 0.1;
      pos.setX(i, pos.getX(i) + Math.cos(angle) * rockNoise);
      pos.setZ(i, pos.getZ(i) + Math.sin(angle) * rockNoise);
      if (y > 0.1) {
        pos.setY(i, y + Math.sin(dist * 2.5) * 0.08);
      }
    }
    islandGeo.computeVertexNormals();

    this.islandMat = new THREE.MeshStandardMaterial({
      color: 0x121520,
      roughness: 0.78,
      metalness: 0.24,
      flatShading: true
    });

    this.island = new THREE.Mesh(islandGeo, this.islandMat);
    this.island.position.set(0, 0.52, 0);
    this.island.receiveShadow = true;
    this.island.castShadow = true;
    this.root.add(this.island);

    // 2. Smooth Velvety Obsidian/Moss Seating Plateau
    const plateauGeo = new THREE.CylinderGeometry(4.2, 4.38, 0.14, 18);
    const plateauMat = new THREE.MeshStandardMaterial({
      color: 0x0D1018,
      roughness: 0.65,
      metalness: 0.32
    });
    const plateau = new THREE.Mesh(plateauGeo, plateauMat);
    plateau.position.set(0, 1.11, 0);
    plateau.receiveShadow = true;
    this.root.add(plateau);

    // 3. Natural Stepping Stones Emerging from Water
    const steppingStones = [
      { x: -3.9, z: 2.4, r: 0.85, h: 0.55 },
      { x: 3.7, z: 2.7, r: 0.9, h: 0.5 },
      { x: -3.3, z: -2.9, r: 0.95, h: 0.58 },
      { x: 3.4, z: -2.6, r: 0.75, h: 0.52 }
    ];

    steppingStones.forEach(s => {
      const stGeo = new THREE.CylinderGeometry(s.r, s.r * 1.3, s.h, 8);
      stGeo.computeVertexNormals();
      const st = new THREE.Mesh(stGeo, this.islandMat);
      st.position.set(s.x, s.h * 0.5, s.z);
      st.rotation.y = Math.random() * Math.PI;
      st.receiveShadow = true;
      st.castShadow = true;
      this.root.add(st);
    });

    // 4. Bioluminescent Crystal Nodules tucked along Rock Rim
    this.rockCrystals = [];
    const crystalMat = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.6
    });

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.4;
      const cGeo = new THREE.OctahedronGeometry(0.12 + (i % 2) * 0.06, 0);
      const cry = new THREE.Mesh(cGeo, crystalMat);
      const rad = 4.15;
      cry.position.set(Math.cos(angle) * rad, 1.05, Math.sin(angle) * rad);
      cry.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
      this.root.add(cry);
      this.rockCrystals.push(cry);
    }
  }

  buildOrganicBonsaiTree() {
    this.treeGroup = new THREE.Group();
    this.treeGroup.position.set(-1.35, 1.05, -0.65);
    this.root.add(this.treeGroup);

    // Realistic Weathered Gnarled Bark Material
    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x161220,
      roughness: 0.74,
      metalness: 0.28,
      flatShading: true
    });

    // 1. Spline-Extruded Graceful Curving Bonsai Trunk (Smooth Organic Silhouette)
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.18, 0.85, -0.08),
      new THREE.Vector3(0.55, 1.7, 0.06),
      new THREE.Vector3(0.85, 2.45, 0.22),
      new THREE.Vector3(1.05, 3.15, 0.12)
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 24, 0.38, 8, false);
    const trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    this.treeGroup.add(trunkMesh);

    // 2. Organic Root Tendrils Grasping the Stone Rim
    const rootSplines = [
      [new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(-0.35, -0.05, 0.3), new THREE.Vector3(-0.7, -0.22, 0.55)],
      [new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(0.4, -0.04, -0.32), new THREE.Vector3(0.8, -0.25, -0.55)],
      [new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(-0.32, -0.06, -0.4), new THREE.Vector3(-0.65, -0.24, -0.7)]
    ];

    rootSplines.forEach(pts => {
      const rCurve = new THREE.CatmullRomCurve3(pts);
      const rGeo = new THREE.TubeGeometry(rCurve, 10, 0.14, 6, false);
      const rMesh = new THREE.Mesh(rGeo, barkMat);
      rMesh.castShadow = true;
      rMesh.receiveShadow = true;
      this.treeGroup.add(rMesh);
    });

    // 3. Gracefully Arching Secondary & Tertiary Branches (Arching toward listener)
    const branchConfigs = [
      {
        pts: [
          new THREE.Vector3(0.7, 2.1, 0.15),
          new THREE.Vector3(1.35, 2.45, 0.45),
          new THREE.Vector3(2.05, 2.65, 0.65)
        ],
        radius: 0.13
      },
      {
        pts: [
          new THREE.Vector3(0.45, 1.8, 0.05),
          new THREE.Vector3(-0.15, 2.2, -0.35),
          new THREE.Vector3(-0.75, 2.5, -0.6)
        ],
        radius: 0.12
      },
      {
        pts: [
          new THREE.Vector3(1.05, 3.15, 0.12),
          new THREE.Vector3(1.6, 3.5, -0.25),
          new THREE.Vector3(2.2, 3.65, -0.55)
        ],
        radius: 0.11
      },
      {
        pts: [
          new THREE.Vector3(1.05, 3.15, 0.12),
          new THREE.Vector3(0.75, 3.7, 0.4),
          new THREE.Vector3(0.3, 3.9, 0.7)
        ],
        radius: 0.1
      }
    ];

    branchConfigs.forEach(bc => {
      const bCurve = new THREE.CatmullRomCurve3(bc.pts);
      const bGeo = new THREE.TubeGeometry(bCurve, 12, bc.radius, 6, false);
      const bm = new THREE.Mesh(bGeo, barkMat);
      bm.castShadow = true;
      bm.receiveShadow = true;
      this.treeGroup.add(bm);
    });

    // 4. Luminous Crystal Foliage Materials (Subsurface Scattering Feel)
    this.leafMatPrimary = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.58,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    this.leafMatAccent = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 1.1,
      roughness: 0.15,
      metalness: 0.68,
      flatShading: true,
      transparent: true,
      opacity: 0.95
    });

    this.leafMatSecondary = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.82,
      roughness: 0.25,
      metalness: 0.48,
      flatShading: true
    });

    // 5. Layered Organic Crystal Canopy Clouds
    const canopyNodes = [
      { x: 1.05, y: 3.65, z: 0.2, s: 1.35, mat: this.leafMatAccent },
      { x: 2.1, y: 3.5, z: -0.4, s: 1.1, mat: this.leafMatPrimary },
      { x: 0.25, y: 3.8, z: 0.65, s: 1.0, mat: this.leafMatPrimary },
      { x: 1.85, y: 2.75, z: 0.75, s: 0.95, mat: this.leafMatSecondary },
      { x: -0.65, y: 2.6, z: -0.5, s: 0.92, mat: this.leafMatAccent },
      { x: 2.45, y: 3.1, z: 0.15, s: 0.88, mat: this.leafMatPrimary },
      { x: 0.7, y: 4.1, z: -0.15, s: 1.15, mat: this.leafMatAccent }
    ];

    canopyNodes.forEach(c => {
      // Core faceted foliage crystal
      const cg = new THREE.DodecahedronGeometry(c.s * 0.72, 0);
      const cm = new THREE.Mesh(cg, c.mat);
      cm.position.set(c.x, c.y, c.z);
      cm.castShadow = true;
      this.treeGroup.add(cm);

      // Micro-foliage satellites with organic wind-flutter
      for (let j = 0; j < 5; j++) {
        const subG = new THREE.OctahedronGeometry(c.s * 0.26, 0);
        const subM = new THREE.Mesh(subG, (j % 2 === 0) ? this.leafMatPrimary : this.leafMatAccent);
        const angle = (j / 5) * Math.PI * 2;
        const dist = c.s * 0.68;
        subM.position.set(
          c.x + Math.cos(angle) * dist,
          c.y + (Math.random() - 0.5) * 0.4,
          c.z + Math.sin(angle) * dist
        );
        subM.rotation.set(Math.random(), Math.random(), Math.random());
        this.treeGroup.add(subM);
        this.foliageClusters.push({
          mesh: subM,
          initY: subM.position.y,
          initX: subM.position.x,
          phase: j * 1.25,
          speed: 1.2 + j * 0.35
        });
      }
    });
  }

  buildChillListener() {
    this.listenerGroup = new THREE.Group();
    this.listenerGroup.position.set(1.2, 1.12, 0.7);
    this.listenerGroup.rotation.y = -Math.PI / 4.0;
    this.root.add(this.listenerGroup);

    // PBR Character Palette (Stylized Relaxed Audiophile)
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x1A1F2C,
      roughness: 0.85,
      metalness: 0.12,
      flatShading: true
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xD0AF9D,
      roughness: 0.65,
      flatShading: true
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x141118,
      roughness: 0.88,
      flatShading: true
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x11131B,
      roughness: 0.92,
      flatShading: true
    });
    const sneakerMat = new THREE.MeshStandardMaterial({
      color: 0x2A2E3D,
      roughness: 0.62,
      metalness: 0.28
    });

    // 1. Natural Cross-Legged Base (Anatomically Distinct Thighs & Calves)
    // Left Thigh & Calf
    const thighLGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.72, 8);
    const thighL = new THREE.Mesh(thighLGeo, pantsMat);
    thighL.position.set(-0.35, 0.16, 0.08);
    thighL.rotation.z = Math.PI / 2.3;
    thighL.rotation.y = -0.25;
    thighL.castShadow = true;
    this.listenerGroup.add(thighL);

    // Right Thigh & Calf
    const thighRGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.72, 8);
    const thighR = new THREE.Mesh(thighRGeo, pantsMat);
    thighR.position.set(0.35, 0.16, 0.08);
    thighR.rotation.z = -Math.PI / 2.3;
    thighR.rotation.y = 0.25;
    thighR.castShadow = true;
    this.listenerGroup.add(thighR);

    // Crossed Shins
    const shinsGeo = new THREE.BoxGeometry(0.88, 0.24, 0.42);
    const shins = new THREE.Mesh(shinsGeo, pantsMat);
    shins.position.set(0, 0.12, 0.34);
    shins.castShadow = true;
    this.listenerGroup.add(shins);

    // Sculpted Sneakers with Soles
    [-0.34, 0.34].forEach((fx, idx) => {
      const snkGroup = new THREE.Group();
      snkGroup.position.set(fx, 0.08, 0.44);
      snkGroup.rotation.y = idx === 0 ? 0.35 : -0.35;

      const upperGeo = new THREE.BoxGeometry(0.2, 0.12, 0.36);
      const upper = new THREE.Mesh(upperGeo, sneakerMat);
      upper.castShadow = true;
      snkGroup.add(upper);

      // White/Ice sole trim
      const soleGeo = new THREE.BoxGeometry(0.21, 0.04, 0.37);
      const soleMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.4 });
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.y = -0.06;
      snkGroup.add(sole);

      this.listenerGroup.add(snkGroup);
    });

    // 2. Reclined Torso with Natural Slouch Folds
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.38, 0);
    this.listenerGroup.add(this.torsoGroup);

    const torsoGeo = new THREE.CylinderGeometry(0.36, 0.46, 0.98, 8);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, 0.48, -0.02);
    torso.rotation.x = -0.18;
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.torsoGroup.add(torso);

    // Folded Hood draped over back of neck
    const hoodGeo = new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hood = new THREE.Mesh(hoodGeo, hoodieMat);
    hood.position.set(0, 0.82, -0.24);
    hood.rotation.x = 2.45;
    this.torsoGroup.add(hood);

    // Relaxed Left Arm resting on knee
    const armLGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.72, 6);
    const armL = new THREE.Mesh(armLGeo, hoodieMat);
    armL.position.set(-0.48, 0.46, 0.12);
    armL.rotation.z = 0.36;
    armL.rotation.x = 0.4;
    armL.castShadow = true;
    this.torsoGroup.add(armL);

    // Left Hand resting relaxed
    const handLGeo = new THREE.DodecahedronGeometry(0.095, 0);
    const handL = new THREE.Mesh(handLGeo, skinMat);
    handL.position.set(-0.4, 0.2, 0.4);
    this.torsoGroup.add(handL);

    // Relaxed Right Arm with Beat-Tapping Finger Group
    const armRGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.72, 6);
    const armR = new THREE.Mesh(armRGeo, hoodieMat);
    armR.position.set(0.48, 0.46, 0.12);
    armR.rotation.z = -0.36;
    armR.rotation.x = 0.4;
    armR.castShadow = true;
    this.torsoGroup.add(armR);

    // Right Hand (Taps to the beat)
    this.handR = new THREE.Mesh(handLGeo, skinMat);
    this.handR.position.set(0.4, 0.2, 0.4);
    this.torsoGroup.add(this.handR);

    // 3. Head & Cervical Group (Animated for Music Groove)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.08, -0.06);
    this.torsoGroup.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.2, 6);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 0.1, 0);
    this.headGroup.add(neck);

    // Sculpted Stylized Head
    const headGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.32, 0);
    head.castShadow = true;
    this.headGroup.add(head);

    // Hair / Beanie
    const hairGeo = new THREE.SphereGeometry(0.3, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.38, -0.04);
    hair.rotation.x = -0.15;
    this.headGroup.add(hair);

    // 4. Audiophile Over-Ear Headphones (Precision Studio Acoustic Engineering)
    const phoneMetalMat = new THREE.MeshStandardMaterial({
      color: 0x080A10,
      roughness: 0.22,
      metalness: 0.88
    });

    this.earGlowMatL = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.4
    });

    this.earGlowMatR = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.4
    });

    // Dual-Rail Aluminum Headband Arch
    const bandGeo = new THREE.TorusGeometry(0.34, 0.03, 8, 24, Math.PI);
    const band = new THREE.Mesh(bandGeo, phoneMetalMat);
    band.position.set(0, 0.36, -0.02);
    band.rotation.x = Math.PI;
    band.rotation.z = 0.04;
    this.headGroup.add(band);

    // Plush Memory Foam Earcups & Outer Illuminated LED Halos
    [-0.34, 0.34].forEach((sideX, idx) => {
      const glowMat = idx === 0 ? this.earGlowMatL : this.earGlowMatR;

      // Soft leatherette cushion
      const cushionGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.09, 16);
      const cushion = new THREE.Mesh(cushionGeo, phoneMetalMat);
      cushion.position.set(sideX, 0.32, -0.02);
      cushion.rotation.z = Math.PI / 2;
      this.headGroup.add(cushion);

      // Outer glowing LED halo ring
      const ringGeo = new THREE.TorusGeometry(0.13, 0.022, 6, 20);
      const ring = new THREE.Mesh(ringGeo, glowMat);
      ring.position.set(sideX * 1.14, 0.32, -0.02);
      ring.rotation.y = Math.PI / 2;
      this.headGroup.add(ring);
    });

    // 5. Braided Audio Cable Drooping in Natural Catenary Curve to DAC
    const cablePts = [
      new THREE.Vector3(-0.38, 1.35, 0.0),   // Left earcup connector
      new THREE.Vector3(-0.48, 0.95, 0.15),  // Drape over collar
      new THREE.Vector3(-0.3, 0.55, 0.3),    // Catenary sag
      new THREE.Vector3(0.15, 0.3, 0.38),    // Mid-air coil
      new THREE.Vector3(0.64, 0.14, 0.35)    // DAC 3.5mm jack
    ];
    const cableCurve = new THREE.CatmullRomCurve3(cablePts);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.016, 6, false);
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x181C26,
      roughness: 0.6,
      metalness: 0.4
    });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    this.listenerGroup.add(cableMesh);

    // 6. Dedicated High-Resolution DAC on the Rock with Live Mini Spectrum Bars
    const dacGeo = new THREE.BoxGeometry(0.24, 0.08, 0.38);
    const dacMat = new THREE.MeshStandardMaterial({
      color: 0x0A0D14,
      roughness: 0.2,
      metalness: 0.85
    });
    const dac = new THREE.Mesh(dacGeo, dacMat);
    dac.position.set(0.7, 0.06, 0.35);
    dac.rotation.y = 0.45;
    this.listenerGroup.add(dac);

    // OLED Screen Surface
    const dacScreenGeo = new THREE.PlaneGeometry(0.16, 0.26);
    this.dacScreenMat = new THREE.MeshBasicMaterial({
      color: 0x020408
    });
    const dacScreen = new THREE.Mesh(dacScreenGeo, this.dacScreenMat);
    dacScreen.rotation.x = -Math.PI / 2;
    dacScreen.rotation.z = -0.45;
    dacScreen.position.set(0.7, 0.105, 0.35);
    this.listenerGroup.add(dacScreen);

    // Micro LED Spectrum Equalizer Bars on DAC Screen
    this.dacBars = [];
    const barMat = new THREE.MeshBasicMaterial({ color: this.accentColor });
    this.dacBarMat = barMat;

    for (let b = 0; b < 5; b++) {
      const bGeo = new THREE.PlaneGeometry(0.02, 0.04);
      const bMesh = new THREE.Mesh(bGeo, barMat);
      bMesh.rotation.x = -Math.PI / 2;
      bMesh.rotation.z = -0.45;
      bMesh.position.set(0.66 + b * 0.022, 0.108, 0.32 + b * 0.016);
      this.listenerGroup.add(bMesh);
      this.dacBars.push(bMesh);
    }
  }

  buildFallingSoundPetals() {
    this.fallingPetals = [];
    const petalCount = 45;

    for (let i = 0; i < petalCount; i++) {
      const pGeo = new THREE.OctahedronGeometry(0.06 + Math.random() * 0.05, 0);
      const pMat = new THREE.MeshStandardMaterial({
        color: (i % 2 === 0) ? this.primaryColor : this.accentColor,
        emissive: (i % 2 === 0) ? this.primaryColor : this.accentColor,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85
      });
      const petal = new THREE.Mesh(pGeo, pMat);
      this.resetPetal(petal, true);
      this.root.add(petal);
      this.fallingPetals.push(petal);
    }
  }

  resetPetal(petal, randomizeY = false) {
    petal.position.set(
      -1.35 + (Math.random() - 0.5) * 3.8,
      randomizeY ? (0.2 + Math.random() * 4.4) : (4.1 + Math.random() * 0.8),
      -0.65 + (Math.random() - 0.5) * 3.8
    );
    petal.userData = {
      vy: 0.007 + Math.random() * 0.009,
      vx: (Math.random() - 0.5) * 0.006,
      vz: (Math.random() - 0.5) * 0.006,
      rotX: Math.random() * 0.04,
      rotY: Math.random() * 0.04,
      oscSpeed: 1.2 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    };
  }

  buildBioFireflies() {
    this.fireflies = [];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const spGeo = new THREE.DodecahedronGeometry(0.042, 0);
      const spMat = new THREE.MeshBasicMaterial({
        color: (i % 3 === 0) ? 0xFFDF7E : ((i % 3 === 1) ? this.accentColor : this.primaryColor)
      });
      const fly = new THREE.Mesh(spGeo, spMat);
      fly.position.set(
        (Math.random() - 0.5) * 9,
        0.4 + Math.random() * 4.2,
        (Math.random() - 0.5) * 9
      );
      fly.userData = {
        origX: fly.position.x,
        origZ: fly.position.z,
        baseY: fly.position.y,
        speed: 0.55 + Math.random() * 0.85,
        radius: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2
      };
      this.root.add(fly);
      this.fireflies.push(fly);
    }
  }

  buildCelestialAtmosphere() {
    // 1. Crescent Moon in Deep Background
    const moonGeo = new THREE.SphereGeometry(1.65, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xE8ECF8,
      emissive: 0x64748B,
      emissiveIntensity: 0.35,
      roughness: 0.85
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(-17, 18, -34);
    this.scene.add(this.moonMesh);

    // Volumetric Moon Corona Halo
    const spriteMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: this.primaryColor,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending
    });
    this.moonCorona = new THREE.Sprite(spriteMat);
    this.moonCorona.position.copy(this.moonMesh.position);
    this.moonCorona.scale.set(18, 18, 1);
    this.scene.add(this.moonCorona);

    // 2. Cosmic Nebula Cloud Sprite in Distant Space
    const nebulaMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    this.nebulaSprite = new THREE.Sprite(nebulaMat);
    this.nebulaSprite.position.set(10, 14, -40);
    this.nebulaSprite.scale.set(38, 28, 1);
    this.scene.add(this.nebulaSprite);

    // 3. Multi-Stratified 700 Star Field
    const starCount = 700;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorChoices = [
      this.primaryColor,
      this.accentColor,
      this.secondaryColor,
      new THREE.Color(0xFFFFFF),
      new THREE.Color(0xE2E8F0)
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 7.0 + Math.random() * 26.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = 0.5 + radius * Math.cos(phi);
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    this.starMaterial = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(starGeo, this.starMaterial);
    this.root.add(this.stars);
  }

  // Web Audio Analyser Feed (0.0 to 1.0)
  setBeatData(bass, treble, mid) {
    this.targetBass = bass || 0;
    this.targetTreble = treble || 0;
    this.targetMid = mid || 0;
  }

  // Dynamic Theme Palette Switcher
  setTheme(themeKey, customColors = null) {
    let p, s, a, bgHex, wColor;

    if (customColors) {
      p = customColors.primary;
      s = customColors.secondary;
      a = customColors.accent;
      bgHex = customColors.bg || 0x06070B;
      wColor = 0x04060A;
      this.currentThemeKey = 'dynamic';
    } else {
      const cfg = this.themes[themeKey] || this.themes.obsidian;
      this.currentThemeKey = themeKey;
      p = cfg.primary;
      s = cfg.secondary;
      a = cfg.accent;
      bgHex = cfg.background;
      wColor = cfg.waterColor;
    }

    this.targetPrimary.setHex(p);
    this.targetSecondary.setHex(s);
    this.targetAccent.setHex(a);
    this.targetBg.setHex(bgHex);

    if (this.scene && this.scene.fog) {
      this.scene.fog.color.setHex(bgHex);
    }
    if (this.waterMat) {
      this.waterMat.color.setHex(wColor);
    }
  }

  // Dynamic Album Art Color Extraction
  setAccentColor(hexColor) {
    if (!hexColor) return;
    try {
      this.targetPrimary.setHex(hexColor);
      const hsl = {};
      this.targetPrimary.getHSL(hsl);
      this.targetSecondary.setHSL((hsl.h + 0.55) % 1.0, 0.72, 0.45);
      this.targetAccent.setHSL((hsl.h + 0.15) % 1.0, 0.9, 0.65);
    } catch (e) {}
  }

  // Studio Slider Parameters
  setParams(newParams = {}) {
    if (newParams.waveSpeed !== undefined) this.params.waveSpeed = newParams.waveSpeed;
    if (newParams.particleDensity !== undefined) {
      this.params.particleDensity = newParams.particleDensity;
      if (this.starMaterial) {
        this.starMaterial.opacity = 0.35 + 0.55 * this.params.particleDensity;
      }
    }
    if (newParams.audioBloom !== undefined) this.params.audioBloom = newParams.audioBloom;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Audio Smoothing
    this.bass += (this.targetBass - this.bass) * 0.18;
    this.mid += (this.targetMid - this.mid) * 0.18;
    this.treble += (this.targetTreble - this.treble) * 0.22;

    const b = this.bass * this.params.audioBloom;
    const m = this.mid * this.params.audioBloom;
    const t = this.treble * this.params.audioBloom;

    // 2. Smooth Color Transition
    const lerpRate = 0.045;
    this.primaryColor.lerp(this.targetPrimary, lerpRate);
    this.secondaryColor.lerp(this.targetSecondary, lerpRate);
    this.accentColor.lerp(this.targetAccent, lerpRate);
    this.bgColor.lerp(this.targetBg, lerpRate);

    // Update Lighting
    if (this.moonLight) this.moonLight.color.copy(this.primaryColor);
    if (this.cyanRim) this.cyanRim.color.copy(this.accentColor);
    if (this.earLight) this.earLight.color.copy(this.accentColor);
    if (this.moonCorona) this.moonCorona.material.color.copy(this.primaryColor);
    if (this.nebulaSprite) this.nebulaSprite.material.color.copy(this.secondaryColor);
    if (this.foamMat) this.foamMat.color.copy(this.accentColor);
    if (this.dacBarMat) this.dacBarMat.color.copy(this.accentColor);

    // Update Tree Canopy Lighting
    if (this.leafMatPrimary) {
      this.leafMatPrimary.color.copy(this.primaryColor);
      this.leafMatPrimary.emissive.copy(this.primaryColor);
      this.leafMatPrimary.emissiveIntensity = 0.85 + t * 1.6;
    }
    if (this.leafMatAccent) {
      this.leafMatAccent.color.copy(this.accentColor);
      this.leafMatAccent.emissive.copy(this.accentColor);
      this.leafMatAccent.emissiveIntensity = 0.95 + b * 1.9;
    }
    if (this.leafMatSecondary) {
      this.leafMatSecondary.color.copy(this.secondaryColor);
      this.leafMatSecondary.emissive.copy(this.secondaryColor);
    }

    // Update Headphone Rings
    if (this.earGlowMatL) {
      this.earGlowMatL.color.copy(this.accentColor);
      this.earGlowMatL.emissive.copy(this.accentColor);
      this.earGlowMatL.emissiveIntensity = 2.0 + b * 3.0;
    }
    if (this.earGlowMatR) {
      this.earGlowMatR.color.copy(this.primaryColor);
      this.earGlowMatR.emissive.copy(this.primaryColor);
      this.earGlowMatR.emissiveIntensity = 2.0 + b * 3.0;
    }

    // 3. Multi-Octave Gerstner Lake Simulation (Sharp Crests & Broad Troughs)
    if (this.waterGeo) {
      const pos = this.waterGeo.attributes.position;
      const count = pos.count;
      const tSpeed = elapsedTime * 1.5 * this.params.waveSpeed;
      const waveAmp = 0.045 + b * 0.15;

      for (let i = 0; i < count; i++) {
        const x = this.waterBaseX[i];
        const z = this.waterBaseZ[i];
        const dist = Math.sqrt(x * x + z * z);

        // Acoustic shockwave ripples traveling from island into lake
        const acousticRipple = Math.sin(dist * 1.35 - tSpeed * 2.4) * waveAmp * Math.exp(-dist * 0.055);

        // Ambient Gerstner directional waves
        const wave1 = Math.cos(x * 0.38 + tSpeed * 0.9) * Math.sin(z * 0.38 + tSpeed * 0.7) * 0.038;
        const wave2 = Math.sin((x + z) * 0.22 - tSpeed * 0.5) * 0.024;

        pos.setY(i, this.waterBaseY[i] + acousticRipple + wave1 + wave2);
      }
      pos.needsUpdate = true;
      this.waterGeo.computeVertexNormals();
    }

    // Foam Ring Breathing with Shoreline Water Lapping
    if (this.foamRing) {
      const foamScale = 1.0 + Math.sin(elapsedTime * 2.0 * this.params.waveSpeed) * 0.025 + b * 0.04;
      this.foamRing.scale.set(foamScale, 1.0, foamScale);
      this.foamMat.opacity = 0.22 + b * 0.28;
    }

    // 4. Character Breathing, Music Groove & Hand Tapping
    if (this.torsoGroup && this.headGroup) {
      const tempo = elapsedTime * 2.5 * this.params.waveSpeed;
      const breath = Math.sin(elapsedTime * 1.35) * 0.016;

      // Realistic chest rise & fall
      this.torsoGroup.position.y = 0.38 + breath + b * 0.018;

      // Authentic delayed double-bounce head nod to the rhythm
      const headNod = Math.sin(tempo) * (0.05 + b * 0.11) + Math.sin(tempo * 2.0) * 0.015;
      const headTilt = Math.cos(tempo * 0.5) * (0.022 + m * 0.035);
      const headTurn = Math.sin(tempo * 0.25) * 0.028;

      this.headGroup.rotation.x = 0.12 + headNod;
      this.headGroup.rotation.z = headTilt;
      this.headGroup.rotation.y = headTurn;

      // Subtle right hand tap to the beat on the knee
      if (this.handR) {
        this.handR.position.y = 0.2 + Math.max(0, Math.sin(tempo)) * (0.012 + b * 0.025);
      }
    }

    // 5. Mini DAC OLED Spectrum Bars Animation
    if (this.dacBars && this.dacBars.length) {
      const freqs = [b, (b + m) * 0.5, m, (m + t) * 0.5, t];
      this.dacBars.forEach((bar, idx) => {
        const val = 0.02 + freqs[idx] * 0.06;
        bar.scale.y = Math.max(0.2, val * 20);
      });
    }

    // 6. Tree Foliage Multi-Harmonic Wind Sway
    this.foliageClusters.forEach(f => {
      const wSpeed = elapsedTime * f.speed * this.params.waveSpeed;
      f.mesh.position.y = f.initY + Math.sin(wSpeed + f.phase) * 0.075;
      f.mesh.position.x = f.initX + Math.cos(wSpeed * 0.8 + f.phase) * 0.045;
      f.mesh.rotation.x += 0.008;
      f.mesh.rotation.y += 0.012;
    });

    // 7. Falling Sound Blossom Petals (Drifting with aerodynamics)
    this.fallingPetals.forEach(p => {
      p.position.y -= p.userData.vy * (1.0 + t * 0.9);
      p.position.x += p.userData.vx + Math.sin(elapsedTime * p.userData.oscSpeed + p.userData.phase) * 0.009;
      p.position.z += p.userData.vz + Math.cos(elapsedTime * p.userData.oscSpeed + p.userData.phase) * 0.009;
      p.rotation.x += p.userData.rotX;
      p.rotation.y += p.userData.rotY;

      // Respawn in canopy upon touching water surface
      if (p.position.y <= 0.02) {
        this.resetPetal(p, false);
      }
    });

    // 8. Bioluminescent Fireflies Flying in Organic Curves
    this.fireflies.forEach(fly => {
      const fTime = elapsedTime * fly.userData.speed;
      fly.position.x = fly.userData.origX + Math.sin(fTime + fly.userData.phase) * fly.userData.radius;
      fly.position.z = fly.userData.origZ + Math.cos(fTime + fly.userData.phase) * fly.userData.radius;
      fly.position.y = fly.userData.baseY + Math.sin(fTime * 1.6 + fly.userData.phase) * 0.38 + b * 0.45;
    });

    // 9. Slow Cosmic Celestial Drift
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.01 * this.params.waveSpeed;
    }

    // 10. Damped Mouse & Touch Parallax with Smooth Inertia
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.045;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.045;

    this.camera.position.x = this.mouseX * 3.6;
    this.camera.position.y = 3.8 - (this.mouseY * 1.5);
    this.camera.lookAt(0, 1.4, 0);

    // 11. Render Scene
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
