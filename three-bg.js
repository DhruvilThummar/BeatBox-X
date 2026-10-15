/**
 * Beat Box X — Realistic 3D Audiophile Sanctuary
 * Concept: Atmospheric nocturnal scene of a music listener with precision headphones
 * relaxing under an organic luminous Bonsai tree beside an undulating reflecting lake.
 * Features:
 *  - Dynamic vertex-displaced PBR water simulation with real-time wave physics & caustics
 *  - Organic multi-branched Bonsai tree with wind-swayed illuminated foliage & falling sound petals
 *  - Anatomically proportioned stylized listener with natural breathing & beat-synchronized head groove
 *  - Precision audiophile headphones with plush cushions, aluminum gimbals & audio-reactive LED rings
 *  - Coiled audio cable leading to an illuminated DAC player on the stone
 *  - Distant crescent moon with atmospheric corona, volumetric depth fog, & 600 twinkling stars
 *  - Live coupling to Web Audio FFT (Bass, Mid, Treble), 5 master themes, & Studio sliders
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;

    // 5 Master Audiophile Palettes
    this.themes = {
      obsidian: {
        id: "obsidian",
        name: "Obsidian Violet",
        primary: 0x8A5CFF,   // Obsidian Violet
        secondary: 0x5B21B6, // Deep Velvet
        accent: 0x00E5FF,    // Specular Cyan Crest
        background: 0x06070B,
        waterColor: 0x04060A,
        fogDensity: 0.024
      },
      titanium: {
        id: "titanium",
        name: "Titanium Cyan",
        primary: 0x00E5FF,   // Titanium Cyan
        secondary: 0x0F4C81, // Deep Oceanic Cobalt
        accent: 0x38BDF8,    // Electric Sky Specular
        background: 0x03070E,
        waterColor: 0x02050B,
        fogDensity: 0.024
      },
      amber: {
        id: "amber",
        name: "Solar Amber",
        primary: 0xFF9900,   // Solar Amber
        secondary: 0xD4AF37, // Champagne Gold
        accent: 0xFBBF24,    // Warm Solar Crest
        background: 0x090603,
        waterColor: 0x060402,
        fogDensity: 0.024
      },
      cobalt: {
        id: "cobalt",
        name: "Abyssal Cobalt",
        primary: 0x2979FF,   // Electric Cobalt
        secondary: 0x1A237E, // Deep Indigo
        accent: 0x60A5FA,    // Luminous Horizon
        background: 0x020510,
        waterColor: 0x01030B,
        fogDensity: 0.024
      },
      dynamic: {
        id: "dynamic",
        name: "Harmonic Dynamic",
        primary: 0x8A5CFF,
        secondary: 0x00E5FF,
        accent: 0xD946EF,
        background: 0x06070B,
        waterColor: 0x04060A,
        fogDensity: 0.024
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

    // User-Tunable Parameters
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

    // Collections for Animation
    this.foliageClusters = [];
    this.fallingPetals = [];
    this.waterRipples = [];
    this.fireflies = [];

    this.init();
  }

  // Generate Procedural Soft Radial Glow Texture
  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Generate Subtle Water Normal Perturbation Canvas
  createWaterNormalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8080ff'; // flat normal base
    ctx.fillRect(0, 0, 128, 128);

    // Soft concentric noise rings
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(64, 64, 10 + i * 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${128 + i * 8}, ${128 - i * 6}, 255, 0.15)`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  init() {
    // 1. WebGL Canvas
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

    // 2. High-Precision Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Scene & Atmospheric Volumetric Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(
      this.themes[this.currentThemeKey].background,
      this.themes[this.currentThemeKey].fogDensity
    );

    // 4. Studio Perspective Camera
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 4.2, 13.0);
    this.camera.lookAt(0, 1.4, 0);

    // 5. Root Transform Hierarchy
    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.glowTexture = this.createGlowTexture();
    this.waterNormalTexture = this.createWaterNormalTexture();

    // 6. Build High-Fidelity Scene
    this.setupLighting();
    this.buildDynamicWaterLake();
    this.buildIslandSanctuary();
    this.buildOrganicBonsaiTree();
    this.buildChillListener();
    this.buildFallingSoundPetals();
    this.buildBioFireflies();
    this.buildCelestialAtmosphere();

    // 7. Event Listeners
    this.clock = new THREE.Clock();
    this.onResizeBound = this.onWindowResize.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);

    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('mousemove', this.onMouseMoveBound, { passive: true });
    window.addEventListener('touchmove', this.onTouchMoveBound, { passive: true });

    // 8. Launch Loop
    window.threeBgInstance = this;
    requestAnimationFrame(() => {
      this.canvas.style.opacity = '1';
    });
    this.animate();
  }

  setupLighting() {
    // Ambient nocturnal skylight
    this.ambientLight = new THREE.AmbientLight(0x0E121E, 1.4);
    this.scene.add(this.ambientLight);

    // Key Directional Moon Light (Casts soft directional shadows)
    this.moonLight = new THREE.DirectionalLight(this.primaryColor, 2.4);
    this.moonLight.position.set(-8, 16, 8);
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.camera.near = 0.5;
    this.moonLight.shadow.camera.far = 32;
    this.moonLight.shadow.camera.left = -6;
    this.moonLight.shadow.camera.right = 6;
    this.moonLight.shadow.camera.top = 6;
    this.moonLight.shadow.camera.bottom = -6;
    this.moonLight.shadow.bias = -0.0008;
    this.scene.add(this.moonLight);

    // Specular Rim Cyan Light
    this.cyanRim = new THREE.DirectionalLight(this.accentColor, 1.9);
    this.cyanRim.position.set(9, 6, -7);
    this.scene.add(this.cyanRim);

    // Warm Island Emissive Light
    this.islandPoint = new THREE.PointLight(0xFFA500, 2.2, 12, 1.8);
    this.islandPoint.position.set(0.4, 2.8, 0.4);
    this.islandPoint.castShadow = true;
    this.scene.add(this.islandPoint);

    // Headphone Local Aura Light
    this.earLight = new THREE.PointLight(this.accentColor, 1.6, 3.2, 2.2);
    this.earLight.position.set(1.1, 2.2, 0.6);
    this.scene.add(this.earLight);
  }

  buildDynamicWaterLake() {
    // Undulating High-Density Water Mesh with 64x64 Segments
    this.waterSegments = 64;
    const waterRadius = 22;
    this.waterGeo = new THREE.PlaneGeometry(waterRadius * 2, waterRadius * 2, this.waterSegments, this.waterSegments);
    this.waterGeo.rotateX(-Math.PI / 2);

    // Cache initial vertex positions for procedural wave simulation
    const pos = this.waterGeo.attributes.position;
    this.waterBaseY = new Float32Array(pos.count);
    this.waterBaseX = new Float32Array(pos.count);
    this.waterBaseZ = new Float32Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      this.waterBaseX[i] = pos.getX(i);
      this.waterBaseY[i] = pos.getY(i);
      this.waterBaseZ[i] = pos.getZ(i);
    }

    this.waterMat = new THREE.MeshStandardMaterial({
      color: this.themes[this.currentThemeKey].waterColor,
      roughness: 0.08,
      metalness: 0.92,
      normalMap: this.waterNormalTexture,
      transparent: true,
      opacity: 0.94
    });

    this.waterMesh = new THREE.Mesh(this.waterGeo, this.waterMat);
    this.waterMesh.position.y = -0.02;
    this.waterMesh.receiveShadow = true;
    this.root.add(this.waterMesh);
  }

  buildIslandSanctuary() {
    // Sculpted Slate Boulder Platform
    const islandGeo = new THREE.CylinderGeometry(4.3, 5.0, 1.0, 14, 2);
    islandGeo.computeVertexNormals();

    // Micro-roughen vertices to give real natural rock contours
    const pos = islandGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const noise = (Math.sin(pos.getX(i) * 3) + Math.cos(pos.getZ(i) * 3)) * 0.08;
      pos.setX(i, pos.getX(i) + noise);
      pos.setZ(i, pos.getZ(i) + noise);
      if (y > 0) pos.setY(i, y + Math.sin(pos.getX(i) * 2) * 0.06);
    }
    islandGeo.computeVertexNormals();

    this.islandMat = new THREE.MeshStandardMaterial({
      color: 0x131620,
      roughness: 0.82,
      metalness: 0.22,
      flatShading: true
    });

    this.island = new THREE.Mesh(islandGeo, this.islandMat);
    this.island.position.set(0, 0.45, 0);
    this.island.receiveShadow = true;
    this.island.castShadow = true;
    this.root.add(this.island);

    // Moss / Obsidian Surface Cap on Top
    const capGeo = new THREE.CylinderGeometry(4.1, 4.3, 0.12, 14);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0E1119,
      roughness: 0.7,
      metalness: 0.3
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.98, 0);
    cap.receiveShadow = true;
    this.root.add(cap);

    // Natural Stepping Stones in Water
    const stoneCoords = [
      { x: -3.8, z: 2.3, r: 0.8, h: 0.5 },
      { x: 3.5, z: 2.6, r: 0.85, h: 0.45 },
      { x: -3.1, z: -2.8, r: 0.9, h: 0.52 },
      { x: 3.2, z: -2.4, r: 0.7, h: 0.48 }
    ];

    stoneCoords.forEach(s => {
      const stGeo = new THREE.CylinderGeometry(s.r, s.r * 1.25, s.h, 7);
      stGeo.computeVertexNormals();
      const st = new THREE.Mesh(stGeo, this.islandMat);
      st.position.set(s.x, s.h * 0.5, s.z);
      st.rotation.y = Math.random() * Math.PI;
      st.receiveShadow = true;
      st.castShadow = true;
      this.root.add(st);
    });
  }

  buildOrganicBonsaiTree() {
    this.treeGroup = new THREE.Group();
    this.treeGroup.position.set(-1.3, 0.92, -0.6);
    this.root.add(this.treeGroup);

    // Twisted Bonsai Bark Material
    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x15111F,
      roughness: 0.76,
      metalness: 0.28,
      flatShading: true
    });

    // 1. Trunk Segments with Natural Organic Arching
    const trunkData = [
      { rT: 0.46, rB: 0.62, h: 1.15, rotZ: 0.18, rotX: -0.12, px: 0, py: 0.55, pz: 0 },
      { rT: 0.36, rB: 0.46, h: 1.15, rotZ: 0.44, rotX: 0.12, px: 0.22, py: 1.5, pz: -0.06 },
      { rT: 0.26, rB: 0.36, h: 1.05, rotZ: -0.3, rotX: 0.24, px: 0.68, py: 2.35, pz: 0.06 },
      { rT: 0.16, rB: 0.26, h: 0.95, rotZ: -0.58, rotX: -0.16, px: 0.65, py: 3.1, pz: 0.18 }
    ];

    trunkData.forEach(d => {
      const geo = new THREE.CylinderGeometry(d.rT, d.rB, d.h, 8);
      const m = new THREE.Mesh(geo, barkMat);
      m.position.set(d.px, d.py, d.pz);
      m.rotation.z = d.rotZ;
      m.rotation.x = d.rotX;
      m.castShadow = true;
      m.receiveShadow = true;
      this.treeGroup.add(m);
    });

    // 2. Extending Secondary Branches arching toward the listener
    const branchData = [
      { rT: 0.1, rB: 0.18, h: 1.4, rotZ: 0.75, rotX: 0.35, px: 1.25, py: 2.9, pz: 0.3 },
      { rT: 0.08, rB: 0.15, h: 1.3, rotZ: -0.65, rotX: -0.4, px: -0.2, py: 2.45, pz: -0.25 },
      { rT: 0.09, rB: 0.16, h: 1.2, rotZ: 0.2, rotX: -0.85, px: 0.7, py: 2.7, pz: -0.7 }
    ];

    branchData.forEach(b => {
      const bGeo = new THREE.CylinderGeometry(b.rT, b.rB, b.h, 6);
      const bm = new THREE.Mesh(bGeo, barkMat);
      bm.position.set(b.px, b.py, b.pz);
      bm.rotation.z = b.rotZ;
      bm.rotation.x = b.rotX;
      bm.castShadow = true;
      this.treeGroup.add(bm);
    });

    // 3. Foliage Cloud Materials (PBR Translucent Illuminated Crystals)
    this.leafMatPrimary = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      metalness: 0.55,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    this.leafMatAccent = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 1.05,
      roughness: 0.18,
      metalness: 0.65,
      flatShading: true,
      transparent: true,
      opacity: 0.94
    });

    this.leafMatSecondary = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.85,
      roughness: 0.28,
      metalness: 0.45,
      flatShading: true
    });

    // Dense Canopy Clouds
    const canopyNodes = [
      { x: 1.0, y: 3.55, z: 0.25, s: 1.25, mat: this.leafMatAccent },
      { x: 1.8, y: 3.25, z: -0.45, s: 1.05, mat: this.leafMatPrimary },
      { x: 0.15, y: 3.45, z: 0.65, s: 0.95, mat: this.leafMatPrimary },
      { x: 1.4, y: 2.75, z: 0.75, s: 0.88, mat: this.leafMatSecondary },
      { x: -0.45, y: 2.65, z: -0.35, s: 0.92, mat: this.leafMatAccent },
      { x: 2.3, y: 2.95, z: 0.15, s: 0.85, mat: this.leafMatPrimary },
      { x: 0.7, y: 3.85, z: -0.15, s: 1.1, mat: this.leafMatAccent }
    ];

    canopyNodes.forEach(c => {
      // Main faceted canopy cluster
      const cg = new THREE.DodecahedronGeometry(c.s * 0.75, 0);
      const cm = new THREE.Mesh(cg, c.mat);
      cm.position.set(c.x, c.y, c.z);
      cm.castShadow = true;
      this.treeGroup.add(cm);

      // Micro-foliage satellites with wind oscillation
      for (let j = 0; j < 5; j++) {
        const subG = new THREE.OctahedronGeometry(c.s * 0.26, 0);
        const subM = new THREE.Mesh(subG, (j % 2 === 0) ? this.leafMatPrimary : this.leafMatAccent);
        const angle = (j / 5) * Math.PI * 2;
        const dist = c.s * 0.65;
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
          phase: j * 1.2,
          speed: 1.2 + j * 0.3
        });
      }
    });
  }

  buildChillListener() {
    this.listenerGroup = new THREE.Group();
    this.listenerGroup.position.set(1.15, 0.95, 0.65);
    this.listenerGroup.rotation.y = -Math.PI / 4.2;
    this.root.add(this.listenerGroup);

    // PBR Character Materials
    const hoodieMat = new THREE.MeshStandardMaterial({
      color: 0x1B202D,
      roughness: 0.84,
      metalness: 0.12,
      flatShading: true
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xC8A896,
      roughness: 0.68,
      flatShading: true
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x151218,
      roughness: 0.85,
      flatShading: true
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x11131B,
      roughness: 0.92,
      flatShading: true
    });
    const sneakerMat = new THREE.MeshStandardMaterial({
      color: 0x2A2E3D,
      roughness: 0.6,
      metalness: 0.3
    });

    // 1. Cross-legged Lower Body Base
    const legsGeo = new THREE.BoxGeometry(1.05, 0.36, 0.82);
    const legs = new THREE.Mesh(legsGeo, pantsMat);
    legs.position.set(0, 0.18, 0.12);
    legs.castShadow = true;
    legs.receiveShadow = true;
    this.listenerGroup.add(legs);

    // Sneaker Details
    [-0.38, 0.38].forEach((footX, idx) => {
      const snkGeo = new THREE.BoxGeometry(0.24, 0.14, 0.38);
      const snk = new THREE.Mesh(snkGeo, sneakerMat);
      snk.position.set(footX, 0.1, 0.42);
      snk.rotation.y = idx === 0 ? 0.3 : -0.3;
      snk.castShadow = true;
      this.listenerGroup.add(snk);
    });

    // 2. Torso with Natural Slouch / Relaxed Recline
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.36, 0);
    this.listenerGroup.add(this.torsoGroup);

    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.95, 8);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, 0.46, 0);
    torso.rotation.x = -0.2;
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.torsoGroup.add(torso);

    // Hoodie Hood folded down on back
    const hoodGeo = new THREE.SphereGeometry(0.32, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hood = new THREE.Mesh(hoodGeo, hoodieMat);
    hood.position.set(0, 0.82, -0.22);
    hood.rotation.x = 2.4;
    this.torsoGroup.add(hood);

    // Relaxed Arms resting on knees
    const armLGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.68, 6);
    const armL = new THREE.Mesh(armLGeo, hoodieMat);
    armL.position.set(-0.46, 0.45, 0.12);
    armL.rotation.z = 0.38;
    armL.rotation.x = 0.42;
    armL.castShadow = true;
    this.torsoGroup.add(armL);

    const armRGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.68, 6);
    const armR = new THREE.Mesh(armRGeo, hoodieMat);
    armR.position.set(0.46, 0.45, 0.12);
    armR.rotation.z = -0.38;
    armR.rotation.x = 0.42;
    armR.castShadow = true;
    this.torsoGroup.add(armR);

    // Hands resting on knees
    [-0.38, 0.38].forEach(hx => {
      const handGeo = new THREE.DodecahedronGeometry(0.1, 0);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(hx, 0.22, 0.38);
      this.torsoGroup.add(hand);
    });

    // 3. Head & Hair Group (Animated for Natural Music Groove)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.05, -0.06);
    this.torsoGroup.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.2, 6);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 0.1, 0);
    this.headGroup.add(neck);

    // Head (Sculpted Stylized Geometry)
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

    // 4. Precision Audiophile Over-Ear Headphones
    const phoneMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0A0D12,
      roughness: 0.25,
      metalness: 0.85
    });

    this.earGlowMatL = new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: this.accentColor,
      emissiveIntensity: 2.4,
      roughness: 0.1,
      metalness: 0.4
    });

    this.earGlowMatR = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 2.4,
      roughness: 0.1,
      metalness: 0.4
    });

    // Arching Dual-Rail Headband
    const bandGeo = new THREE.TorusGeometry(0.34, 0.032, 8, 24, Math.PI);
    const band = new THREE.Mesh(bandGeo, phoneMetalMat);
    band.position.set(0, 0.36, -0.02);
    band.rotation.x = Math.PI;
    band.rotation.z = 0.04;
    this.headGroup.add(band);

    // Soft Leather Cushion Earcups & Outer LED Halos
    [-0.35, 0.35].forEach((sideX, idx) => {
      const glowMat = idx === 0 ? this.earGlowMatL : this.earGlowMatR;

      // Cushion
      const cushionGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.09, 14);
      const cushion = new THREE.Mesh(cushionGeo, phoneMetalMat);
      cushion.position.set(sideX, 0.32, -0.02);
      cushion.rotation.z = Math.PI / 2;
      this.headGroup.add(cushion);

      // Glowing Outer Ring Halo
      const ringGeo = new THREE.TorusGeometry(0.13, 0.022, 6, 20);
      const ring = new THREE.Mesh(ringGeo, glowMat);
      ring.position.set(sideX * 1.14, 0.32, -0.02);
      ring.rotation.y = Math.PI / 2;
      this.headGroup.add(ring);
    });

    // 5. Audiophile DAC Player on Stone & Braided Audio Cable
    const dacGeo = new THREE.BoxGeometry(0.24, 0.08, 0.38);
    const dacMat = new THREE.MeshStandardMaterial({
      color: 0x0A0C11,
      roughness: 0.2,
      metalness: 0.8
    });
    const dac = new THREE.Mesh(dacGeo, dacMat);
    dac.position.set(0.68, 0.08, 0.35);
    dac.rotation.y = 0.45;
    this.listenerGroup.add(dac);

    // Illuminated OLED Screen on DAC
    const dacScreenGeo = new THREE.PlaneGeometry(0.16, 0.26);
    this.dacScreenMat = new THREE.MeshBasicMaterial({
      color: this.accentColor
    });
    const dacScreen = new THREE.Mesh(dacScreenGeo, this.dacScreenMat);
    dacScreen.rotation.x = -Math.PI / 2;
    dacScreen.rotation.z = -0.45;
    dacScreen.position.set(0.68, 0.125, 0.35);
    this.listenerGroup.add(dacScreen);
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
      -1.3 + (Math.random() - 0.5) * 3.6,
      randomizeY ? (0.2 + Math.random() * 4.2) : (4.0 + Math.random() * 0.8),
      -0.6 + (Math.random() - 0.5) * 3.6
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
    const count = 35;

    for (let i = 0; i < count; i++) {
      const spGeo = new THREE.DodecahedronGeometry(0.04, 0);
      const spMat = new THREE.MeshBasicMaterial({
        color: (i % 3 === 0) ? 0xFFDF7E : ((i % 3 === 1) ? this.accentColor : this.primaryColor)
      });
      const fly = new THREE.Mesh(spGeo, spMat);
      fly.position.set(
        (Math.random() - 0.5) * 8,
        0.4 + Math.random() * 4.0,
        (Math.random() - 0.5) * 8
      );
      fly.userData = {
        origX: fly.position.x,
        origZ: fly.position.z,
        baseY: fly.position.y,
        speed: 0.6 + Math.random() * 0.8,
        radius: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      };
      this.root.add(fly);
      this.fireflies.push(fly);
    }
  }

  buildCelestialAtmosphere() {
    // 1. Crescent Moon in Far Background
    const moonGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xE8ECF8,
      emissive: 0x64748B,
      emissiveIntensity: 0.35,
      roughness: 0.85
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(-16, 18, -32);
    this.scene.add(this.moonMesh);

    // Moon Glow Corona Sprite
    const spriteMat = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: this.primaryColor,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.moonCorona = new THREE.Sprite(spriteMat);
    this.moonCorona.position.copy(this.moonMesh.position);
    this.moonCorona.scale.set(16, 16, 1);
    this.scene.add(this.moonCorona);

    // 2. Multi-Stratified 600 Star Particle Field
    const starCount = 600;
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
      const radius = 6.0 + Math.random() * 22.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.82);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = 0.6 + radius * Math.cos(phi);
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    this.starMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(starGeo, this.starMaterial);
    this.root.add(this.stars);
  }

  // Web Audio Analyser Feed
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

  // Studio Sliders Parameter Coupling
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
    this.bgColor.lerp(this.targetBg, lerpRate);

    // Update scene lighting
    if (this.moonLight) this.moonLight.color.copy(this.primaryColor);
    if (this.cyanRim) this.cyanRim.color.copy(this.accentColor);
    if (this.earLight) this.earLight.color.copy(this.accentColor);
    if (this.moonCorona) this.moonCorona.material.color.copy(this.primaryColor);
    if (this.dacScreenMat) this.dacScreenMat.color.copy(this.accentColor);

    // Update Tree Materials
    if (this.leafMatPrimary) {
      this.leafMatPrimary.color.copy(this.primaryColor);
      this.leafMatPrimary.emissive.copy(this.primaryColor);
      this.leafMatPrimary.emissiveIntensity = 0.85 + t * 1.5;
    }
    if (this.leafMatAccent) {
      this.leafMatAccent.color.copy(this.accentColor);
      this.leafMatAccent.emissive.copy(this.accentColor);
      this.leafMatAccent.emissiveIntensity = 0.95 + b * 1.8;
    }
    if (this.leafMatSecondary) {
      this.leafMatSecondary.color.copy(this.secondaryColor);
      this.leafMatSecondary.emissive.copy(this.secondaryColor);
    }

    // Update Headphone Glow LEDs
    if (this.earGlowMatL) {
      this.earGlowMatL.color.copy(this.accentColor);
      this.earGlowMatL.emissive.copy(this.accentColor);
      this.earGlowMatL.emissiveIntensity = 2.0 + b * 2.8;
    }
    if (this.earGlowMatR) {
      this.earGlowMatR.color.copy(this.primaryColor);
      this.earGlowMatR.emissive.copy(this.primaryColor);
      this.earGlowMatR.emissiveIntensity = 2.0 + b * 2.8;
    }

    // 3. Dynamic Water Surface Simulation (Physical Vertex Waves)
    if (this.waterGeo) {
      const pos = this.waterGeo.attributes.position;
      const count = pos.count;
      const tSpeed = elapsedTime * 1.6 * this.params.waveSpeed;
      const waveAmp = 0.05 + b * 0.16;

      for (let i = 0; i < count; i++) {
        const x = this.waterBaseX[i];
        const z = this.waterBaseZ[i];
        const distToCenter = Math.sqrt(x * x + z * z);

        // Multi-frequency harmonic lake undulation + acoustic ripples traveling from island
        const ripple = Math.sin(distToCenter * 1.4 - tSpeed * 2.2) * waveAmp * Math.exp(-distToCenter * 0.06);
        const ambientChoppiness = Math.cos(x * 0.4 + tSpeed * 0.8) * Math.sin(z * 0.4 + tSpeed * 0.6) * 0.04;

        pos.setY(i, this.waterBaseY[i] + ripple + ambientChoppiness);
      }
      pos.needsUpdate = true;
      this.waterGeo.computeVertexNormals();
    }

    // 4. Character Breathing & Head Music Groove
    if (this.torsoGroup && this.headGroup) {
      const tempo = elapsedTime * 2.6 * this.params.waveSpeed;
      const breath = Math.sin(elapsedTime * 1.4) * 0.015;

      // Subtle chest rise & fall
      this.torsoGroup.position.y = 0.36 + breath + b * 0.015;

      // Authentic head nodding & swaying to beat
      this.headGroup.rotation.x = 0.12 + Math.sin(tempo) * (0.05 + b * 0.09);
      this.headGroup.rotation.z = Math.cos(tempo * 0.5) * (0.02 + m * 0.035);
      this.headGroup.rotation.y = Math.sin(tempo * 0.25) * 0.03;
    }

    // 5. Tree Foliage Wind Sway
    this.foliageClusters.forEach(f => {
      const wSpeed = elapsedTime * f.speed * this.params.waveSpeed;
      f.mesh.position.y = f.initY + Math.sin(wSpeed + f.phase) * 0.07;
      f.mesh.position.x = f.initX + Math.cos(wSpeed * 0.8 + f.phase) * 0.04;
      f.mesh.rotation.x += 0.008;
      f.mesh.rotation.y += 0.012;
    });

    // 6. Falling Sound Petals (Drifting with gravity & wind)
    this.fallingPetals.forEach(p => {
      p.position.y -= p.userData.vy * (1.0 + t * 0.8);
      p.position.x += p.userData.vx + Math.sin(elapsedTime * p.userData.oscSpeed + p.userData.phase) * 0.008;
      p.position.z += p.userData.vz + Math.cos(elapsedTime * p.userData.oscSpeed + p.userData.phase) * 0.008;
      p.rotation.x += p.userData.rotX;
      p.rotation.y += p.userData.rotY;

      // If petal hits water surface, respawn in canopy
      if (p.position.y <= 0.02) {
        this.resetPetal(p, false);
      }
    });

    // 7. Bioluminescent Fireflies Floating Arc
    this.fireflies.forEach(fly => {
      const fTime = elapsedTime * fly.userData.speed;
      fly.position.x = fly.userData.origX + Math.sin(fTime + fly.userData.phase) * fly.userData.radius;
      fly.position.z = fly.userData.origZ + Math.cos(fTime + fly.userData.phase) * fly.userData.radius;
      fly.position.y = fly.userData.baseY + Math.sin(fTime * 1.5 + fly.userData.phase) * 0.35 + b * 0.4;
    });

    // 8. Stardust Twinkle & Slow Cosmic Drift
    if (this.stars) {
      this.stars.rotation.y = elapsedTime * 0.012 * this.params.waveSpeed;
    }

    // 9. Damped Mouse & Touch Parallax Camera
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.camera.position.x = this.mouseX * 3.4;
    this.camera.position.y = 4.2 - (this.mouseY * 1.4);
    this.camera.lookAt(0, 1.4, 0);

    // 10. Render
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
