/**
 * High-Performance Responsive 3D Background Component
 * Tech Stack: Plain HTML / JS / Three.js
 * Visual Style: Floating Glowing Abstract Particles & Undulating Low-Poly Grid
 * 
 * Features:
 * - 100vw / 100dvh full viewport coverage
 * - Capped DevicePixelRatio (Max 2) for retina screen performance & battery saving
 * - Smooth lerped mouse & touch parallax interactivity
 * - Full memory cleanup & object disposal method
 */

class ThreeBackground {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.primaryColor = options.primaryColor || 0xD4AF37; // Gold accent
    this.secondaryColor = options.secondaryColor || 0x4a3b10;
    this.particleCount = options.particleCount || 1200;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.init();
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 30);

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
    this.createParticles();
    this.createWaveGrid();

    // 5. Event Listeners
    this.handleResize = this.onWindowResize.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });

    // 6. Start Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  createParticles() {
    this.particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const scales = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      scales[i] = Math.random() * 1.5 + 0.5;
    }

    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Soft Particle Material
    this.particleMaterial = new THREE.PointsMaterial({
      color: this.primaryColor,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
  }

  createWaveGrid() {
    const width = 80;
    const height = 80;
    const segments = 40;

    this.gridGeometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.gridMaterial = new THREE.MeshBasicMaterial({
      color: this.secondaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    this.gridMesh = new THREE.Mesh(this.gridGeometry, this.gridMaterial);
    this.gridMesh.rotation.x = -Math.PI / 2.5;
    this.gridMesh.position.y = -12;
    this.scene.add(this.gridMesh);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    // Subtle Particle Drift & Rotation
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.03;
      this.particles.rotation.x = elapsedTime * 0.015;
    }

    // Undulating Wave Grid Animation
    if (this.gridGeometry) {
      const pos = this.gridGeometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.2 + elapsedTime * 1.5) * 0.8 + Math.cos(v * 0.2 + elapsedTime * 1.2) * 0.8;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // Smooth Lerp Mouse Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.camera.position.x = this.mouseX * 3;
    this.camera.position.y = -this.mouseY * 3;
    this.camera.lookAt(this.scene.position);

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
    // 1. Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // 2. Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);

    // 3. Dispose Geometries and Materials
    if (this.particleGeometry) this.particleGeometry.dispose();
    if (this.particleMaterial) this.particleMaterial.dispose();
    if (this.gridGeometry) this.gridGeometry.dispose();
    if (this.gridMaterial) this.gridMaterial.dispose();

    // 4. Dispose Renderer & Canvas
    if (this.renderer) {
      this.renderer.dispose();
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }
}

// Global Export or Auto-Init
if (typeof window !== 'undefined') {
  window.ThreeBackground = ThreeBackground;
}
