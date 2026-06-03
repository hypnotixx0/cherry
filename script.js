(function() {
  // -------------------- PULSATING RADIAL GRADIENT BACKGROUND --------------------
  const gradientCanvas = document.getElementById('gradient-canvas');
  const ctx = gradientCanvas.getContext('2d');
  
  let time = 0;
  let animationId;
  
  function resizeGradientCanvas() {
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
  }
  
  function drawRadialGradient() {
    const w = gradientCanvas.width;
    const h = gradientCanvas.height;
    if (w === 0 || h === 0) return;
    
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Pulsation values
    const pulseScale = 0.85 + Math.sin(time * 1.5) * 0.12;
    const radius = Math.sqrt(w * w + h * h) * 0.9 * (0.92 + Math.sin(time * 1.2) * 0.04);
    
    // Color pulsing
    const intensity = 0.7 + Math.sin(time * 1.8) * 0.08;
    
    // Inner: bright cherry pink
    const innerR = 255;
    const innerG = 190 + Math.floor(25 * Math.sin(time * 2.2));
    const innerB = 200 + Math.floor(20 * Math.sin(time * 1.9));
    
    // Mid: warm pink
    const midR = 235;
    const midG = 145 + Math.floor(20 * Math.sin(time * 1.6));
    const midB = 165 + Math.floor(15 * Math.sin(time * 1.3));
    
    // Outer: deep cherry / maroon
    const outerR = 90 + Math.floor(15 * Math.sin(time * 0.9));
    const outerG = 35 + Math.floor(10 * Math.sin(time * 0.7));
    const outerB = 50 + Math.floor(10 * Math.sin(time * 0.5));
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(${innerR}, ${innerG}, ${innerB}, 1)`);
    gradient.addColorStop(0.28, `rgba(255, ${180 + Math.floor(12 * Math.sin(time))}, ${195 + Math.floor(12 * Math.cos(time * 0.8))}, 0.98)`);
    gradient.addColorStop(0.55, `rgba(${midR}, ${midG}, ${midB}, 0.96)`);
    gradient.addColorStop(0.78, `rgba(155, 65, 80, 0.93)`);
    gradient.addColorStop(1, `rgba(${outerR}, ${outerG}, ${outerB}, 1)`);
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Subtle inner glow overlay
    ctx.globalCompositeOperation = 'lighter';
    const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 0.45);
    glowGrad.addColorStop(0, `rgba(255, 210, 225, ${0.12 + Math.sin(time * 2.5) * 0.04})`);
    glowGrad.addColorStop(1, `rgba(255, 180, 200, 0)`);
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    
    time += 0.016;
    animationId = requestAnimationFrame(drawRadialGradient);
  }
  
  // -------------------- FLOATING CHERRY BLOSSOMS (pink blobs / petal shapes) --------------------
  const petalCanvas = document.getElementById('petal-canvas');
  const petalCtx = petalCanvas.getContext('2d');
  
  let blossoms = [];
  let petalAnimationId;
  let lastTimestamp = 0;
  
  class CherryBlossom {
    constructor(x, y, size, speedX, speedY, rotation, rotationSpeed, opacity, shapeType) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedX = speedX;
      this.speedY = speedY;
      this.rotation = rotation;
      this.rotationSpeed = rotationSpeed;
      this.opacity = opacity;
      this.shapeType = shapeType; // 0, 1, or 2 for slight variation
    }
    
    update(deltaTime) {
      const dt = Math.min(deltaTime, 0.033);
      this.x += this.speedX * dt * 60;
      this.y += this.speedY * dt * 60;
      this.rotation += this.rotationSpeed * dt * 60;
      
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      if (this.x > w + 120 || this.y > h + 150 || this.x < -150 || this.y < -150) {
        this.reset(w, h);
      }
    }
    
    reset(w, h) {
      // Respawn from top-left-ish area
      this.x = (Math.random() * w * 0.25) - w * 0.08;
      this.y = (Math.random() * h * 0.2) - h * 0.06;
      this.size = 14 + Math.random() * 20;
      // Drift towards bottom-right
      this.speedX = 0.09 + Math.random() * 0.28;
      this.speedY = 0.07 + Math.random() * 0.22;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.opacity = 0.55 + Math.random() * 0.4;
      this.shapeType = Math.floor(Math.random() * 3);
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      
      const w = this.size;
      const h = this.size * 0.9;
      
      // Soft pink blob / petal gradient
      const grad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
      grad.addColorStop(0, `rgba(255, 200, 210, 0.9)`);
      grad.addColorStop(0.5, `rgba(250, 165, 180, 0.85)`);
      grad.addColorStop(1, `rgba(240, 130, 150, 0.7)`);
      ctx.fillStyle = grad;
      
      ctx.beginPath();
      
      if (this.shapeType === 0) {
        // Rounded petal / blob (cherry blossom shape)
        ctx.moveTo(0, -h/2.2);
        ctx.quadraticCurveTo(w/2.3, -h/4, w/2.3, 0);
        ctx.quadraticCurveTo(w/2.3, h/2.2, 0, h/2.2);
        ctx.quadraticCurveTo(-w/2.3, h/2.2, -w/2.3, 0);
        ctx.quadraticCurveTo(-w/2.3, -h/4, 0, -h/2.2);
      } else if (this.shapeType === 1) {
        // Soft oval blob
        ctx.ellipse(0, 0, w/2.2, h/1.8, 0, 0, Math.PI * 2);
      } else {
        // Blossom with subtle notch (more petal-like)
        ctx.moveTo(0, -h/2.3);
        ctx.bezierCurveTo(w/2.5, -h/3.5, w/2.2, 0, 0, h/2);
        ctx.bezierCurveTo(-w/2.2, 0, -w/2.5, -h/3.5, 0, -h/2.3);
      }
      
      ctx.fill();
      
      // Tiny center dot (like cherry blossom stamen)
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 85, 100, 0.65)`;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  function initBlossoms(count, w, h) {
    const blossomsArray = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * w * 0.3) - w * 0.08;
      const y = (Math.random() * h * 0.25) - h * 0.05;
      const size = 12 + Math.random() * 22;
      const speedX = 0.08 + Math.random() * 0.3;
      const speedY = 0.06 + Math.random() * 0.24;
      const rotation = Math.random() * Math.PI * 2;
      const rotationSpeed = (Math.random() - 0.5) * 0.03;
      const opacity = 0.5 + Math.random() * 0.45;
      const shapeType = Math.floor(Math.random() * 3);
      blossomsArray.push(new CherryBlossom(x, y, size, speedX, speedY, rotation, rotationSpeed, opacity, shapeType));
    }
    return blossomsArray;
  }
  
  function resizePetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
    blossoms = initBlossoms(50, petalCanvas.width, petalCanvas.height);
  }
  
  let lastFrame = 0;
  
  function drawBlossoms(now) {
    if (!lastFrame) lastFrame = now;
    let delta = Math.min(0.033, (now - lastFrame) / 1000);
    if (delta <= 0.001) {
      lastFrame = now;
      requestAnimationFrame(drawBlossoms);
      return;
    }
    lastFrame = now;
    
    const w = petalCanvas.width;
    const h = petalCanvas.height;
    if (w === 0 || h === 0) {
      requestAnimationFrame(drawBlossoms);
      return;
    }
    
    petalCtx.clearRect(0, 0, w, h);
    
    for (let blossom of blossoms) {
      blossom.update(delta);
      blossom.draw(petalCtx);
    }
    
    petalAnimationId = requestAnimationFrame(drawBlossoms);
  }
  
  // -------------------- WIND BREEZE VARIATION (subtle speed changes) --------------------
  let windTimer = 0;
  setInterval(() => {
    if (blossoms.length) {
      windTimer += 0.4;
      for (let i = 0; i < blossoms.length; i += 2) {
        // slight random breeze adjustment
        blossoms[i].speedX += (Math.random() - 0.5) * 0.012;
        blossoms[i].speedX = Math.min(0.45, Math.max(0.07, blossoms[i].speedX));
        blossoms[i].speedY += (Math.random() - 0.5) * 0.008;
        blossoms[i].speedY = Math.min(0.38, Math.max(0.05, blossoms[i].speedY));
      }
    }
  }, 3000);
  
  // Add occasional new blossoms to keep density (max ~70)
  setInterval(() => {
    if (blossoms.length < 65 && petalCanvas.width > 0) {
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      const x = (Math.random() * w * 0.25) - w * 0.08;
      const y = (Math.random() * h * 0.2) - h * 0.05;
      const newBlossom = new CherryBlossom(
        x, y,
        12 + Math.random() * 20,
        0.08 + Math.random() * 0.28,
        0.06 + Math.random() * 0.22,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.028,
        0.5 + Math.random() * 0.45,
        Math.floor(Math.random() * 3)
      );
      blossoms.push(newBlossom);
    } else if (blossoms.length > 70) {
      blossoms.pop();
    }
  }, 4500);
  
  // -------------------- HANDLE RESIZE --------------------
  function handleResize() {
    resizeGradientCanvas();
    resizePetalCanvas();
  }
  
  function startAnimations() {
    resizeGradientCanvas();
    resizePetalCanvas();
    drawRadialGradient();
    lastFrame = 0;
    petalAnimationId = requestAnimationFrame(drawBlossoms);
  }
  
  window.addEventListener('resize', handleResize);
  startAnimations();
})();
