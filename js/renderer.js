'use strict';

function ensureLayers(){
  const n = clamp(Math.round(config.dof.layers), 4, 16);
  while(layerCanvases.length < n){
    const c = document.createElement('canvas');
    layerCanvases.push(c);
    layerContexts.push(c.getContext('2d'));
  }
  layerCanvases.length = n;
  layerContexts.length = n;
  for(let i=0;i<n;i++){
    const c = layerCanvases[i];
    const lc = layerContexts[i];
    if(c.width !== Math.round(W * DPR) || c.height !== Math.round(H * DPR)){
      c.width = Math.round(W * DPR);
      c.height = Math.round(H * DPR);
    }
    lc.setTransform(DPR, 0, 0, DPR, 0, 0);
    lc.clearRect(0, 0, W, H);
    lc.lineCap = 'round';
    lc.filter = 'none';
  }
}
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ensureLayers();
}

function gradientEndpoints(angleDeg){
  const a = (angleDeg - 90) * Math.PI / 180;
  const cx = W / 2, cy = H / 2;
  const dx = Math.cos(a), dy = Math.sin(a), len = Math.abs(W * dx) + Math.abs(H * dy);
  return [cx - dx * len / 2, cy - dy * len / 2, cx + dx * len / 2, cy + dy * len / 2];
}
function drawBackground(){
  const [x0,y0,x1,y1] = gradientEndpoints(config.background.angle);
  const g = ctx.createLinearGradient(x0,y0,x1,y1);
  g.addColorStop(0, config.background.top);
  g.addColorStop(clamp01(config.background.midPos / 100), config.background.mid);
  g.addColorStop(1, config.background.bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if(config.background.glow > 0){
    const rg = ctx.createRadialGradient(W * 0.52, H * 0.84, 0, W * 0.52, H * 0.84, Math.max(W, H) * 0.7);
    rg.addColorStop(0, `rgba(170,210,255,${config.background.glow / 100})`);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }
}

function layerForDepth(depth){ const n = layerContexts.length; return layerContexts[clamp(Math.floor(depth * n), 0, n - 1)]; }
function drawDrop(lc, d, depth){
  const sc = depthScales(depth), dof = dofInfo(depth), mag = Math.hypot(d.vx, d.vy), ux = d.vx / mag, uy = d.vy / mag;
  lc.save();
  lc.translate(d.x, d.y); lc.scale(sc.x, sc.y);
  const grad = lc.createLinearGradient(-ux * d.length, -uy * d.length, 0, 0);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.45, getLiquidColor(d.colorIndex, depth, d.alpha * 0.55 * dof.opacity));
  grad.addColorStop(1, getLiquidColor(d.colorIndex, depth, d.alpha * dof.opacity));
  lc.beginPath(); lc.moveTo(-ux * d.length, -uy * d.length); lc.lineTo(0, 0);
  lc.strokeStyle = grad; lc.lineWidth = d.width; lc.stroke();
  lc.restore();
}
function drawRipple(lc, r){
  const la = r.age - r.delay; if(la < 0) return;
  const t = clamp01(la / r.life), ease = 1 - Math.pow(1 - t, 2), sc = depthScales(r.depth), dof = dofInfo(r.depth);
  lc.save(); lc.translate(r.x, r.y); lc.scale(sc.x, sc.y);
  lc.beginPath(); lc.ellipse(0,0,r.maxRadius * ease, r.maxRadius * ease * 0.28, 0,0,Math.PI * 2);
  lc.strokeStyle = getLiquidColor(r.colorIndex, r.depth, (1 - t) * 0.40 * dof.opacity);
  lc.lineWidth = 1 + Math.min(dof.blur * 0.08, 0.7); lc.stroke(); lc.restore();
}
function drawSplash(lc, p){
  const t = clamp01(p.age / p.life), sc = depthScales(p.depth), dof = dofInfo(p.depth);
  lc.save(); lc.translate(p.x, p.y); lc.scale(sc.x, sc.y);
  lc.beginPath(); lc.arc(0, 0, p.radius * (1 - t * 0.28), 0, Math.PI * 2);
  lc.fillStyle = getLiquidColor(p.colorIndex, p.depth, (1 - t) * 0.84 * dof.opacity);
  lc.fill(); lc.restore();
}
function drawSymbol(lc, s){
  const t = clamp01(s.age / s.life), apex = 0.38;
  const a = t <= apex ? t / apex : Math.pow(1 - (t - apex) / (1 - apex), 2.75);
  const sc = depthScales(s.depth), dof = dofInfo(s.depth);
  lc.save();
  lc.translate(s.x, s.y); lc.rotate(s.rotation); lc.scale(sc.x, sc.y);
  lc.textAlign = 'center'; lc.textBaseline = 'middle';
  lc.font = `${s.size}px Georgia, "Times New Roman", serif`;
  lc.fillStyle = getSymbolColor(s.colorIndex, s.depth, a * 0.96 * dof.opacity);
  lc.fillText(s.char, 0, 0);
  lc.restore();
}
function renderLayers(){
  ensureLayers();
  for(const d of drops){ const dep = depthFromY(d.y); drawDrop(layerForDepth(dep), d, dep); }
  for(const r of ripples) drawRipple(layerForDepth(r.depth), r);
  for(const p of splashes) drawSplash(layerForDepth(p.depth), p);
  for(const s of symbols) drawSymbol(layerForDepth(s.depth), s);

  const n = layerCanvases.length;
  ctx.save();
  for(let i=0;i<n;i++){
    const dep = (i + 0.5) / n, info = dofInfo(dep);
    ctx.filter = config.dof.enabled && info.blur > 0.01 ? `blur(${info.blur}px)` : 'none';
    ctx.drawImage(layerCanvases[i], 0, 0, W * DPR, H * DPR, 0, 0, W, H);
  }
  ctx.filter = 'none';
  ctx.restore();

  if(config.dof.showFocus){
    const y = H * config.dof.focusDepth / 100;
    ctx.save();
    ctx.setLineDash([6,7]); ctx.strokeStyle = 'rgba(255,255,255,.36)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    ctx.restore();
  }
}
function frame(now){
  const dt = Math.min((now - last) / 1000, 0.033); last = now;
  update(dt); drawBackground(); renderLayers(); requestAnimationFrame(frame);
}
