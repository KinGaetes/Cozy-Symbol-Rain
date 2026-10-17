'use strict';

function randomColorIndex(){ return Math.floor(rand(0, 6)); }
function clampRanges(){
  if(config.rain.minSpeed > config.rain.maxSpeed) [config.rain.minSpeed, config.rain.maxSpeed] = [config.rain.maxSpeed, config.rain.minSpeed];
  if(config.rain.minLength > config.rain.maxLength) [config.rain.minLength, config.rain.maxLength] = [config.rain.maxLength, config.rain.minLength];
  if(config.rain.minWidth > config.rain.maxWidth) [config.rain.minWidth, config.rain.maxWidth] = [config.rain.maxWidth, config.rain.minWidth];
  if(config.rain.targetTop > config.rain.targetBottom) [config.rain.targetTop, config.rain.targetBottom] = [config.rain.targetBottom, config.rain.targetTop];
  if(config.ripple.minLife > config.ripple.maxLife) [config.ripple.minLife, config.ripple.maxLife] = [config.ripple.maxLife, config.ripple.minLife];
  if(config.ripple.minRadius > config.ripple.maxRadius) [config.ripple.minRadius, config.ripple.maxRadius] = [config.ripple.maxRadius, config.ripple.minRadius];
  if(config.splash.minCount > config.splash.maxCount) [config.splash.minCount, config.splash.maxCount] = [config.splash.maxCount, config.splash.minCount];
  if(config.splash.minLife > config.splash.maxLife) [config.splash.minLife, config.splash.maxLife] = [config.splash.maxLife, config.splash.minLife];
  if(config.splash.minSize > config.splash.maxSize) [config.splash.minSize, config.splash.maxSize] = [config.splash.maxSize, config.splash.minSize];
  if(config.splash.minPower > config.splash.maxPower) [config.splash.minPower, config.splash.maxPower] = [config.splash.maxPower, config.splash.minPower];
  if(config.symbol.minLife > config.symbol.maxLife) [config.symbol.minLife, config.symbol.maxLife] = [config.symbol.maxLife, config.symbol.minLife];
  if(config.symbol.minSize > config.symbol.maxSize) [config.symbol.minSize, config.symbol.maxSize] = [config.symbol.maxSize, config.symbol.minSize];
  if(config.symbol.minRise > config.symbol.maxRise) [config.symbol.minRise, config.symbol.maxRise] = [config.symbol.maxRise, config.symbol.minRise];
  config.rain.maxDrops = Math.max(1, Math.round(config.rain.maxDrops));
  config.ripple.count = Math.max(1, Math.round(config.ripple.count));
  config.dof.layers = Math.round(clamp(config.dof.layers, 4, 16));
}

function createDrop(){
  clampRanges();
  if(drops.length >= config.rain.maxDrops) return;
  const tx = rand(26, W - 26);
  const ty = rand(H * config.rain.targetTop / 100, H * config.rain.targetBottom / 100);
  const localAngle = config.rain.angle + rand(-config.rain.angleJitter, config.rain.angleJitter);
  const rad = localAngle * Math.PI / 180;
  const sy = rand(-120, -18);
  const dxTotal = Math.tan(rad) * (ty - sy);
  const sx = tx - dxTotal + rand(-12, 12);
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.hypot(dx, dy);
  const speed = rand(config.rain.minSpeed, config.rain.maxSpeed);
  drops.push({
    x: sx, y: sy,
    vx: dx / dist * speed,
    vy: dy / dist * speed,
    targetX: tx, targetY: ty,
    length: rand(config.rain.minLength, config.rain.maxLength),
    width: rand(config.rain.minWidth, config.rain.maxWidth),
    alpha: rand(config.rain.minAlpha, config.rain.maxAlpha),
    colorIndex: randomColorIndex(),
  });
}

function familyIndex(sourceIndex){
  return config.color.syncImpactFamily ? sourceIndex : randomColorIndex();
}
function impact(x, y, baseIndex){
  const depth = depthFromY(y);
  const count = clamp(Math.round(config.ripple.count), 1, 5);
  for(let i=0;i<count;i++){
    ripples.push({
      x, y, depth, colorIndex: familyIndex(baseIndex),
      age: 0,
      delay: i * config.ripple.delay,
      life: rand(config.ripple.minLife, config.ripple.maxLife) * (1 + i * 0.06),
      maxRadius: rand(config.ripple.minRadius, config.ripple.maxRadius) * (1 + i * 0.08)
    });
  }

  const sc = Math.floor(rand(config.splash.minCount, config.splash.maxCount + 1));
  for(let i=0;i<sc;i++){
    const angle = rand(-Math.PI * 0.90, -Math.PI * 0.10);
    const pv = rand(1 - config.splash.powerVariance / 100, 1 + config.splash.powerVariance / 100);
    const sv = rand(1 - config.splash.sizeVariance / 100, 1 + config.splash.sizeVariance / 100);
    const speed = rand(config.splash.minPower, config.splash.maxPower) * pv;
    splashes.push({
      x: x + rand(-2.5, 2.5), y: y - 1, depth,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: rand(config.splash.minSize, config.splash.maxSize) * sv,
      age: 0,
      life: rand(config.splash.minLife, config.splash.maxLife),
      colorIndex: familyIndex(baseIndex),
    });
  }

  if(Math.random() < config.symbol.chance / 100){
    const sv = rand(1 - config.symbol.sizeVariance / 100, 1 + config.symbol.sizeVariance / 100);
    const lv = rand(1 - config.symbol.lifeVariance / 100, 1 + config.symbol.lifeVariance / 100);
    const rv = rand(1 - config.symbol.riseVariance / 100, 1 + config.symbol.riseVariance / 100);
    symbols.push({
      char: SYMBOLS[(Math.random() * SYMBOLS.length) | 0],
      x: x + rand(-4, 4), y, baseY: y, depth, vx: rand(-18, 18),
      rise: rand(config.symbol.minRise, config.symbol.maxRise) * rv,
      age: 0,
      life: rand(config.symbol.minLife, config.symbol.maxLife) * lv,
      size: rand(config.symbol.minSize, config.symbol.maxSize) * sv,
      rotation: rand(-0.12, 0.12),
      colorIndex: familyIndex(baseIndex),
    });
  }
}

function update(dt){
  elapsed += dt;
  const warm = clamp01((elapsed - 0.25) / 4);
  const rate = config.rain.spawnRate * (0.15 + 0.85 * warm);
  if(elapsed > 0.25){
    spawnAccumulator += dt * rate;
    while(spawnAccumulator >= 1){ spawnAccumulator -= 1; createDrop(); }
  }
  for(let i=drops.length-1;i>=0;i--){
    const d = drops[i];
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    if((d.targetX - d.x) * d.vx + (d.targetY - d.y) * d.vy <= 0){
      impact(d.targetX, d.targetY, d.colorIndex);
      drops.splice(i, 1);
    }
  }
  for(let i=ripples.length-1;i>=0;i--){ const r = ripples[i]; r.age += dt; if(r.age >= r.life + r.delay) ripples.splice(i, 1); }
  for(let i=splashes.length-1;i>=0;i--){ const p = splashes[i]; p.age += dt; p.vy += 330 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if(p.age >= p.life) splashes.splice(i, 1); }
  for(let i=symbols.length-1;i>=0;i--){
    const s = symbols[i];
    s.age += dt; s.x += s.vx * dt;
    const t = clamp01(s.age / s.life);
    if(t < 0.38){
      const u = t / 0.38;
      s.y = s.baseY - s.rise * (1 - Math.pow(1 - u, 2));
    } else {
      const u = (t - 0.38) / 0.62;
      s.y = s.baseY - s.rise + (s.rise * 0.92) * (u * u);
    }
    if(s.age >= s.life) symbols.splice(i, 1);
  }
}
