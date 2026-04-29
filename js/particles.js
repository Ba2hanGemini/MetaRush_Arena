/* ========================================
   METARUSH — Canvas Particle System
   Floating particles with mouse interaction
   ======================================== */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.particleCount = 80;
    this.connectionDistance = 150;
    this.mouseRadius = 200;

    this.colors = [
      { r: 124, g: 58, b: 237 },   // purple
      { r: 6, g: 182, b: 212 },     // cyan
      { r: 129, g: 140, b: 248 },   // indigo-light
      { r: 99, g: 102, b: 241 },    // indigo
    ];

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    // Adjust count for performance on smaller screens
    const count = window.innerWidth < 768 ? 40 : this.particleCount;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      baseRadius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      baseOpacity: Math.random() * 0.5 + 0.1,
      color: color,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  update() {
    const time = Date.now() * 0.001;

    for (const p of this.particles) {
      // Movement
      p.x += p.vx;
      p.y += p.vy;

      // Pulse effect
      p.radius = p.baseRadius + Math.sin(time * p.pulseSpeed * 10 + p.pulsePhase) * 0.5;
      p.opacity = p.baseOpacity + Math.sin(time * p.pulseSpeed * 8 + p.pulsePhase) * 0.1;

      // Screen wrap
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouseRadius) {
        const force = (this.mouseRadius - dist) / this.mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 1.5;
        p.y -= Math.sin(angle) * force * 1.5;
        // Brighten near mouse
        p.opacity = Math.min(p.baseOpacity + force * 0.4, 0.8);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const opacity = (1 - dist / this.connectionDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      this.ctx.fill();

      // Glow effect for larger particles
      if (p.radius > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.15})`;
        this.ctx.fill();
      }
    }
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem('particles-canvas');
});
