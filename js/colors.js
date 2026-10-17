'use strict';

function hexToRgb(hex){
  const clean = (hex || '#ffffff').replace('#','');
  const full = clean.length === 3 ? clean.split('').map(ch => ch + ch).join('') : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToCss({r,g,b}, alpha=1){ return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`; }
function mixHex(hexA, hexB, t){
  const a = hexToRgb(hexA), b = hexToRgb(hexB), m = clamp01(t);
  return {
    r: lerp(a.r, b.r, m),
    g: lerp(a.g, b.g, m),
    b: lerp(a.b, b.b, m),
  };
}
function paletteColor(type, index){
  const list = type === 'liquid' ? config.color.liquidColors : config.color.symbolColors;
  return list[(index % list.length + list.length) % list.length] || '#ffffff';
}
function applyDepthTint(baseHex, depth){
  const eq = clamp01(config.depth.equator / 100);
  let tint = '#ffffff', amount = 0;
  if(depth < eq){
    const t = eq <= 0 ? 0 : 1 - depth / eq;
    tint = config.tint.topColor;
    amount = t * (config.tint.topStrength / 100);
  } else {
    const t = eq >= 1 ? 0 : (depth - eq) / (1 - eq);
    tint = config.tint.bottomColor;
    amount = t * (config.tint.bottomStrength / 100);
  }
  return mixHex(baseHex, tint, clamp01(amount));
}
function getLiquidColor(index, depth, alpha=1){
  let base = '#ffffff';
  let outAlpha = alpha;
  const mode = config.color.liquidMode;
  if(mode === 'palette' || mode === 'paletteSoft' || mode === 'paletteWhite50'){
    base = paletteColor('liquid', index);
    if(mode === 'paletteSoft') outAlpha *= 0.58;
    if(mode === 'paletteWhite50') base = rgbToCss(mixHex(base, '#ffffff', 0.5), 1);
  }
  if(base.startsWith('rgba(')){
    const match = base.match(/rgba\((\d+),(\d+),(\d+),([0-9.]+)\)/);
    if(match){
      const mixed = applyDepthTint(`#${(+match[1]).toString(16).padStart(2,'0')}${(+match[2]).toString(16).padStart(2,'0')}${(+match[3]).toString(16).padStart(2,'0')}`, depth);
      return rgbToCss(mixed, outAlpha);
    }
  }
  return rgbToCss(applyDepthTint(base, depth), outAlpha);
}
function getSymbolColor(index, depth, alpha=1){
  const mode = config.color.symbolMode;
  const base = mode === 'palette' ? paletteColor('symbol', index) : '#ffffff';
  return rgbToCss(applyDepthTint(base, depth), alpha);
}

function depthFromY(y){ return clamp01(y / Math.max(1, H)); }
function depthScales(depth){
  if(!config.depth.enabled) return { x: 1, y: 1 };
  const eq = clamp01(config.depth.equator / 100);
  const interp = (top, mid, bottom) => depth <= eq
    ? lerp(top, mid, eq <= 0 ? 1 : depth / eq)
    : lerp(mid, bottom, eq >= 1 ? 1 : (depth - eq) / (1 - eq));
  return {
    x: interp(config.depth.topScaleX, config.depth.midScaleX, config.depth.bottomScaleX) / 100,
    y: interp(config.depth.topScaleY, config.depth.midScaleY, config.depth.bottomScaleY) / 100,
  };
}
function dofInfo(depth){
  if(!config.dof.enabled) return { blur: 0, opacity: 1 };
  const focus = config.dof.focusDepth / 100;
  const half = Math.max(0, config.dof.focusWidth / 200);
  const delta = depth - focus;
  const ad = Math.abs(delta);
  if(ad <= half) return { blur: 0, opacity: 1 };
  if(delta < 0){
    const range = Math.max(0.001, focus - half);
    const n = clamp01((ad - half) / range);
    const e = Math.pow(n, config.dof.backCurve);
    return { blur: e * config.dof.backBlur, opacity: 1 - e * (config.dof.opacityLoss / 100) };
  }
  const range = Math.max(0.001, 1 - focus - half);
  const n = clamp01((ad - half) / range);
  const e = Math.pow(n, config.dof.frontCurve);
  return { blur: e * config.dof.frontBlur, opacity: 1 - e * (config.dof.opacityLoss / 100) };
}
