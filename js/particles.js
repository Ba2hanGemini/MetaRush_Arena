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
    this.particleCount = 45;
    this.connectionDistance = 110;
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

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      // Movement
      p.x += p.vx;
      p.y += p.vy;

      // Pulse effect (optimized)
      p.radius = p.baseRadius + Math.sin(time * 2 + p.pulsePhase) * 0.3;
      p.opacity = p.baseOpacity + Math.sin(time * 1.5 + p.pulsePhase) * 0.05;

      // Screen wrap
      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.canvas.height + 20;
      if (p.y > this.canvas.height + 20) p.y = -20;

      // Mouse interaction (only if mouse is in range)
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < this.mouseRadius * this.mouseRadius) {
        const dist = Math.sqrt(distSq);
        const force = (this.mouseRadius - dist) / this.mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.x -= Math.cos(angle) * force * 1.2;
        p.y -= Math.sin(angle) * force * 1.2;
        p.opacity = Math.min(p.baseOpacity + force * 0.3, 0.7);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const distLimitSq = this.connectionDistance * this.connectionDistance;

    // Draw connections (optimized batching)
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < distLimitSq) {
          const opacity = (1 - Math.sqrt(dSq) / this.connectionDistance) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      this.ctx.fill();

      if (p.radius > 1.6) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.12})`;
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
