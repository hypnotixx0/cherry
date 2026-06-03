(function() {
  // ---------- DARKER PULSATING RADIAL GRADIENT ----------
  const gradientCanvas = document.getElementById('gradient-canvas');
  const ctx = gradientCanvas.getContext('2d');
  
  let time = 0;
  let gradientAnimationId;
  
  function resizeGradient() {
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
  }
  
  function drawGradient() {
    const w = gradientCanvas.width;
    const h = gradientCanvas.height;
    if (w === 0 || h === 0) {
      gradientAnimationId = requestAnimationFrame(drawGradient);
      return;
    }
    
    const centerX = w / 2;
    const centerY = h / 2;
    const maxRadius = Math.sqrt(w * w + h * h) * 0.95;
    const radius = maxRadius * (0.92 + Math.sin(time * 1.0) * 0.04);
    
    // Dark cherry palette
    const innerR = 170 + Math.floor(20 * Math.sin(time * 1.5));
    const innerG = 70 + Math.floor(15 * Math.sin(time * 1.3));
    const innerB = 80 + Math.floor(15 * Math.sin(time * 1.1));
    
    const midR = 90 + Math.floor(15 * Math.sin(time * 1.0));
    const midG = 38 + Math.floor(10 * Math.sin(time * 0.8));
    const midB = 48 + Math.floor(10 * Math.sin(time * 0.6));
    
    const outerR = 30 + Math.floor(8 * Math.sin(time * 0.5));
    const outerG = 12 + Math.floor(5 * Math.sin(time * 0.4));
    const outerB = 18 + Math.floor(6 * Math.sin(time * 0.5));
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(${innerR}, ${innerG}, ${innerB}, 1)`);
    gradient.addColorStop(0.3, `rgba(130, 48, 58, 0.98)`);
    gradient.addColorStop(0.6, `rgba(${midR}, ${midG}, ${midB}, 0.96)`);
    gradient.addColorStop(0.85, `rgba(45, 18, 25, 0.94)`);
    gradient.addColorStop(1, `rgba(${outerR}, ${outerG}, ${outerB}, 1)`);
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    time += 0.016;
    gradientAnimationId = requestAnimationFrame(drawGradient);
  }
  
  // ---------- FAST BLOSSOM BLIZZARD (constant blowing) ----------
  const petalCanvas = document.getElementById('petal-canvas');
  const petalCtx = petalCanvas.getContext('2d');
  
  let blossoms = [];
  let petalAnimationId;
  let lastTime = 0;
  
  class Blossom {
    constructor(x, y, size, vx, vy, rot, rotSpeed, opacity, shape) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.vx = vx;
      this.vy = vy;
      this.rot = rot;
      this.rotSpeed = rotSpeed;
      this.opacity = opacity;
      this.shape = shape;
    }
    
    update(delta) {
      const dt = Math.min(delta, 0.033);
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.rot += this.rotSpeed * dt * 60;
      
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      if (this.x > w + 200 || this.y > h + 250 || this.x < -200 || this.y < -200) {
        this.respawn(w, h);
      }
    }
    
    respawn(w, h) {
      this.x = (Math.random() * w * 0.35) - w * 0.15;
      this.y = (Math.random() * h * 0.25) - h * 0.1;
      this.size = 10 + Math.random() * 18;
      // FAST speeds for blizzard effect
      this.vx = 0.45 + Math.random() * 0.65;
      this.vy = 0.4 + Math.random() * 0.55;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.06;
      this.opacity = 0.55 + Math.random() * 0.4;
      this.shape = Math.floor(Math.random() * 3);
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;
      
      const w = this.size;
      const h = this.size * 0.9;
      
      const grad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
      grad.addColorStop(0, `rgba(255, 185, 200, 0.95)`);
      grad.addColorStop(0.6, `rgba(245, 145, 165, 0.85)`);
      grad.addColorStop(1, `rgba(225, 105, 125, 0.75)`);
      ctx.fillStyle = grad;
      
      ctx.beginPath();
      
      if (this.shape === 0) {
        ctx.moveTo(0, -h/2.2);
        ctx.quadraticCurveTo(w/2.3, -h/4, w/2.3, 0);
        ctx.quadraticCurveTo(w/2.3, h/2.2, 0, h/2.2);
        ctx.quadraticCurveTo(-w/2.3, h/2.2, -w/2.3, 0);
        ctx.quadraticCurveTo(-w/2.3, -h/4, 0, -h/2.2);
      } else if (this.shape === 1) {
        ctx.ellipse(0, 0, w/2.2, h/1.8, 0, 0, Math.PI * 2);
      } else {
        ctx.moveTo(0, -h/2.3);
        ctx.bezierCurveTo(w/2.5, -h/3.5, w/2.2, 0, 0, h/2);
        ctx.bezierCurveTo(-w/2.2, 0, -w/2.5, -h/3.5, 0, -h/2.3);
      }
      
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 65, 85, 0.7)`;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  function initBlossoms(count, w, h) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * w * 0.4) - w * 0.12;
      const y = (Math.random() * h * 0.3) - h * 0.1;
      arr.push(new Blossom(
        x, y,
        10 + Math.random() * 18,
        0.45 + Math.random() * 0.65,
        0.4 + Math.random() * 0.55,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.06,
        0.55 + Math.random() * 0.4,
        Math.floor(Math.random() * 3)
      ));
    }
    return arr;
  }
  
  function resizePetals() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
    blossoms = initBlossoms(95, petalCanvas.width, petalCanvas.height);
  }
  
  function drawBlossoms(now) {
    if (!lastTime) lastTime = now;
    let delta = (now - lastTime) / 1000;
    if (delta > 0.05) delta = 0.033;
    lastTime = now;
    
    const w = petalCanvas.width;
    const h = petalCanvas.height;
    if (w === 0 || h === 0) {
      petalAnimationId = requestAnimationFrame(drawBlossoms);
      return;
    }
    
    petalCtx.clearRect(0, 0, w, h);
    
    for (let b of blossoms) {
      b.update(delta);
      b.draw(petalCtx);
    }
    
    petalAnimationId = requestAnimationFrame(drawBlossoms);
  }
  
  // Keep density high (blizzard = constant stream)
  setInterval(() => {
    if (blossoms.length < 100 && petalCanvas.width > 0) {
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      for (let i = 0; i < 4; i++) {
        blossoms.push(new Blossom(
          (Math.random() * w * 0.3) - w * 0.12,
          (Math.random() * h * 0.25) - h * 0.1,
          10 + Math.random() * 18,
          0.45 + Math.random() * 0.65,
          0.4 + Math.random() * 0.55,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.06,
          0.55 + Math.random() * 0.4,
          Math.floor(Math.random() * 3)
        ));
      }
    } else if (blossoms.length > 130) {
      blossoms.splice(0, 8);
    }
  }, 2000);
  
  // Gusts to keep speeds high (blizzard feeling)
  setInterval(() => {
    for (let i = 0; i < blossoms.length; i += 3) {
      if (blossoms[i].vx < 0.5) blossoms[i].vx = 0.5 + Math.random() * 0.5;
      if (blossoms[i].vy < 0.45) blossoms[i].vy = 0.45 + Math.random() * 0.4;
      blossoms[i].vx = Math.min(1.1, blossoms[i].vx + (Math.random() - 0.4) * 0.1);
      blossoms[i].vy = Math.min(0.95, blossoms[i].vy + (Math.random() - 0.4) * 0.08);
      blossoms[i].vx = Math.max(0.4, blossoms[i].vx);
      blossoms[i].vy = Math.max(0.35, blossoms[i].vy);
    }
  }, 1800);
  
  function handleResize() {
    resizeGradient();
    resizePetals();
  }
  
  function start() {
    resizeGradient();
    resizePetals();
    drawGradient();
    lastTime = 0;
    petalAnimationId = requestAnimationFrame(drawBlossoms);
  }
  
  window.addEventListener('resize', handleResize);
  start();
})();
