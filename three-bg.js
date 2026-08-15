/**
 * Premium 3D Background Component for Beat Box X
 * Tech Stack: Plain HTML / JS / Three.js (WebGL)
 * Visual Style: Glowing Soft Bokeh Particles, Floating 3D Geometric Nodes & Undulating Wave Grid
 * 
 * Features:
 * - High-Performance 100vw / 100dvh full viewport coverage
 * - Soft canvas-generated radial gradient bokeh textures (no square pixels)
 * - Floating 3D geometric objects (Torus & Icosahedron with golden glow)
 * - Multi-harmonic liquid wave terrain
 * - Capped DevicePixelRatio (Max 2) for retina screens & smooth 60fps
 * - Mouse tilt & touch parallax interactivity with smooth lerp damping
 * - Full memory cleanup & object disposal
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.primaryColor = options.primaryColor || 0xD4AF37; // Rich Gold
    this.secondaryColor = options.secondaryColor || 0x4a3b10; // Dark Amber
    this.particleCount = options.particleCount || 1000;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  // Create soft radial glow texture for circular bokeh particles
  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 230, 150, 1.0)');
    gradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    gradient.addColorStop(0.7, 'rgba(180, 130, 30, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0c, 0.015);

    // 2. Camera Setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 32);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Style Canvas for Fixed Background Integration
    this.canvas = this.renderer.domElement;
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100dvh',
      zIndex: '-1',
      pointerEvents: 'auto',
      outline: 'none',
      border: 'none'
    });

    this.container.appendChild(this.canvas);

    // 4. Create 3D Objects
    this.particleTexture = this.createParticleTexture();
    this.createParticles();
    this.createFloatingGeometries();
    this.createWaveGrid();

    // 5. Ambient Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(this.primaryColor, 2, 100);
    pointLight.position.set(0, 10, 10);
    this.scene.add(pointLight);

    // 6. Event Listeners
    this.handleResize = this.onWindowResize.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });

    // 7. Start Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  createParticles() {
    this.particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      scales[i] = Math.random() * 1.8 + 0.6;
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Glowing Particle Material with Soft Canvas Texture
    this.particleMaterial = new THREE.PointsMaterial({
      color: this.primaryColor,
      size: 1.2,
      map: this.particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  createFloatingGeometries() {
    this.floatingObjects = [];

    // Floating Torus (Gold Glowing Ring)
    const torusGeo = new THREE.TorusGeometry(6, 0.4, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      wireframe: true,
      emissive: 0x4a3b10,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.45
    });
    this.torusMesh = new THREE.Mesh(torusGeo, torusMat);
    this.torusMesh.position.set(-18, 4, -10);
    this.scene.add(this.torusMesh);
    this.floatingObjects.push({ mesh: this.torusMesh, rotX: 0.008, rotY: 0.012, floatSpeed: 1.2 });

    // Floating Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(4, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      wireframe: true,
      emissive: 0x664d03,
      transparent: true,
      opacity: 0.35
    });
    this.icoMesh = new THREE.Mesh(icoGeo, icoMat);
    this.icoMesh.position.set(20, 8, -12);
    this.scene.add(this.icoMesh);
    this.floatingObjects.push({ mesh: this.icoMesh, rotX: -0.01, rotY: 0.007, floatSpeed: 0.9 });
  }

  createWaveGrid() {
    const width = 100;
    const height = 100;
    const segments = 50;

    this.gridGeometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.gridMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });

    this.gridMesh = new THREE.Mesh(this.gridGeometry, this.gridMaterial);
    this.gridMesh.rotation.x = -Math.PI / 2.3;
    this.gridMesh.position.y = -10;
    this.scene.add(this.gridMesh);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Particle Drift & Rotation
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.025;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;
    }

    // 2. Floating Geometries Animation
    if (this.floatingObjects) {
      this.floatingObjects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotX;
        obj.mesh.rotation.y += obj.rotY;
        obj.mesh.position.y += Math.sin(elapsedTime * obj.floatSpeed + idx) * 0.02;
      });
    }

    // 3. Multi-Harmonic Wave Grid Animation
    if (this.gridGeometry) {
      const pos = this.gridGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.18 + elapsedTime * 1.6) * 0.9 +
                  Math.cos(v * 0.18 + elapsedTime * 1.3) * 0.9 +
                  Math.sin((u + v) * 0.1 + elapsedTime * 2.0) * 0.4;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // 4. Smooth Damped Mouse Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.camera.position.x = this.mouseX * 4;
    this.camera.position.y = 5 - (this.mouseY * 3);
    this.camera.lookAt(0, 0, -5);

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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);

    if (this.particleGeometry) this.particleGeometry.dispose();
    if (this.particleMaterial) this.particleMaterial.dispose();
    if (this.particleTexture) this.particleTexture.dispose();
    if (this.gridGeometry) this.gridGeometry.dispose();
    if (this.gridMaterial) this.gridMaterial.dispose();

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
