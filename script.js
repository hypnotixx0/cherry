(function() {
  // -------------------- DARKER PULSATING RADIAL GRADIENT BACKGROUND --------------------
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
    
    // Pulsation values - subtle, not overpowering
    const pulseScale = 0.88 + Math.sin(time * 1.2) * 0.08;
    const radius = Math.sqrt(w * w + h * h) * 0.95 * (0.94 + Math.sin(time * 1.0) * 0.03);
    
    // Darker cherry palette
    const innerR = 180 + Math.floor(20 * Math.sin(time * 1.8));
    const innerG = 80 + Math.floor(15 * Math.sin(time * 1.5));
    const innerB = 90 + Math.floor(15 * Math.sin(time * 1.3));
    
    const midR = 100 + Math.floor(15 * Math.sin(time * 1.2));
    const midG = 45 + Math.floor(10 * Math.sin(time * 1.0));
    const midB = 55 + Math.floor(10 * Math.sin(time * 0.8));
    
    const outerR = 40 + Math.floor(10 * Math.sin(time * 0.7));
    const outerG = 18 + Math.floor(6 * Math.sin(time * 0.5));
    const outerB = 25 + Math.floor(8 * Math.sin(time * 0.6));
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(${innerR}, ${innerG}, ${innerB}, 1)`);
    gradient.addColorStop(0.3, `rgba(140, 55, 65, 0.98)`);
    gradient.addColorStop(0.6, `rgba(${midR}, ${midG}, ${midB}, 0.96)`);
    gradient.addColorStop(0.85, `rgba(55, 22, 30, 0.94)`);
    gradient.addColorStop(1, `rgba(${outerR}, ${outerG}, ${outerB}, 1)`);
    
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Subtle dark cherry glow in center
    ctx.globalCompositeOperation = 'lighter';
    const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 0.35);
    glowGrad.addColorStop(0, `rgba(200, 100, 115, ${0.08 + Math.sin(time * 2.2) * 0.03})`);
    glowGrad.addColorStop(1, `rgba(150, 60, 75, 0)`);
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    
    time += 0.016;
    animationId = requestAnimationFrame(drawRadialGradient);
  }
  
  // -------------------- FLOATING CHERRY BLOSSOMS (FAST, CONSTANT LIKE A BLIZZARD) --------------------
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
      this.shapeType = shapeType;
    }
    
    update(deltaTime) {
      const dt = Math.min(deltaTime, 0.033);
      this.x += this.speedX * dt * 60;
      this.y += this.speedY * dt * 60;
      this.rotation += this.rotationSpeed * dt * 60;
      
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      if (this.x > w + 150 || this.y > h + 180 || this.x < -180 || this.y < -180) {
        this.reset(w, h);
      }
    }
    
    reset(w, h) {
      // Respawn from top-left-ish area (constant stream)
      this.x = (Math.random() * w * 0.35) - w * 0.12;
      this.y = (Math.random() * h * 0.25) - h * 0.08;
      this.size = 12 + Math.random() * 18;
      // FASTER speeds for blizzard-like constant blowing
      this.speedX = 0.35 + Math.random() * 0.55;
      this.speedY = 0.3 + Math.random() * 0.48;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.045;
      this.opacity = 0.6 + Math.random() * 0.35;
      this.shapeType = Math.floor(Math.random() * 3);
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      
      const w = this.size;
      const h = this.size * 0.9;
      
      // Soft pink blossom gradient (visible against dark bg)
      const grad = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
      grad.addColorStop(0, `rgba(255, 185, 200, 0.95)`);
      grad.addColorStop(0.5, `rgba(245, 150, 170, 0.85)`);
      grad.addColorStop(1, `rgba(230, 115, 135, 0.75)`);
      ctx.fillStyle = grad;
      
      ctx.beginPath();
      
      if (this.shapeType === 0) {
        // Rounded petal / blob
        ctx.moveTo(0, -h/2.2);
        ctx.quadraticCurveTo(w/2.3, -h/4, w/2.3, 0);
        ctx.quadraticCurveTo(w/2.3, h/2.2, 0, h/2.2);
        ctx.quadraticCurveTo(-w/2.3, h/2.2, -w/2.3, 0);
        ctx.quadraticCurveTo(-w/2.3, -h/4, 0, -h/2.2);
      } else if (this.shapeType === 1) {
        // Soft oval blob
        ctx.ellipse(0, 0, w/2.2, h/1.8, 0, 0, Math.PI * 2);
      } else {
        // Blossom with subtle notch
        ctx.moveTo(0, -h/2.3);
        ctx.bezierCurveTo(w/2.5, -h/3.5, w/2.2, 0, 0, h/2);
        ctx.bezierCurveTo(-w/2.2, 0, -w/2.5, -h/3.5, 0, -h/2.3);
      }
      
      ctx.fill();
      
      // Tiny center dot
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 70, 90, 0.7)`;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  function initBlossoms(count, w, h) {
    const blossomsArray = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * w * 0.4) - w * 0.1;
      const y = (Math.random() * h * 0.3) - h * 0.1;
      const size = 12 + Math.random() * 18;
      // Faster speeds for constant blowing effect
      const speedX = 0.35 + Math.random() * 0.55;
      const speedY = 0.3 + Math.random() * 0.48;
      const rotation = Math.random() * Math.PI * 2;
      const rotationSpeed = (Math.random() - 0.5) * 0.045;
      const opacity = 0.6 + Math.random() * 0.35;
      const shapeType = Math.floor(Math.random() * 3);
      blossomsArray.push(new CherryBlossom(x, y, size, speedX, speedY, rotation, rotationSpeed, opacity, shapeType));
    }
    return blossomsArray;
  }
  
  function resizePetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
    // HIGH DENSITY for blizzard-like constant stream
    blossoms = initBlossoms(85, petalCanvas.width, petalCanvas.height);
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
  
  // -------------------- CONSTANT WIND / BLIZZARD EFFECT --------------------
  // Maintain high speeds and add occasional tiny gusts
  setInterval(() => {
    if (blossoms.length) {
      for (let i = 0; i < blossoms.length; i += 2) {
        // Keep speeds consistently fast - like a constant blowing blizzard
        if (blossoms[i].speedX < 0.4) blossoms[i].speedX = 0.4 + Math.random() * 0.3;
        if (blossoms[i].speedY < 0.35) blossoms[i].speedY = 0.35 + Math.random() * 0.25;
        // Occasional gust boost
        if (Math.random() < 0.3) {
          blossoms[i].speedX += (Math.random() - 0.3) * 0.08;
          blossoms[i].speedY += (Math.random() - 0.3) * 0.06;
        }
        blossoms[i].speedX = Math.min(0.95, Math.max(0.35, blossoms[i].speedX));
        blossoms[i].speedY = Math.min(0.85, Math.max(0.3, blossoms[i].speedY));
      }
    }
  }, 2000);
  
  // Aggressive respawn to keep density high (constant stream)
  setInterval(() => {
    if (blossoms.length < 90 && petalCanvas.width > 0) {
      const w = petalCanvas.width;
      const h = petalCanvas.height;
      for (let i = 0; i < 3; i++) {
        const x = (Math.random() * w * 0.3) - w * 0.1;
        const y = (Math.random() * h * 0.25) - h * 0.08;
        const newBlossom = new CherryBlossom(
          x, y,
          12 + Math.random() * 18,
          0.38 + Math.random() * 0.52,
          0.32 + Math.random() * 0.45,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.045,
          0.6 + Math.random() * 0.35,
          Math.floor(Math.random() * 3)
        );
        blossoms.push(newBlossom);
      }
    } else if (blossoms.length > 110) {
      blossoms.splice(0, 5);
    }
  }, 2500);
  
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
