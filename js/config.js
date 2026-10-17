'use strict';

const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d', { alpha: false });
const panel = document.getElementById('panel');
const edgeSensor = document.getElementById('edgeSensor');
const pinBtn = document.getElementById('pinBtn');
const closeBtn = document.getElementById('closeBtn');
const controls = document.getElementById('controls');
const SYMBOLS = ['☺','☻','♥','♦','♣','♠','♪','♫','☼'];
const deepClone = obj => JSON.parse(JSON.stringify(obj));
const PALETTE_PRESETS = {
  monochrome: ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],
  rgbcmy: ['#ff4f4f','#47d36f','#4d9dff','#00e6ff','#ff5cf1','#ffe24a'],
  pastel: ['#ffb7c5','#b5d8ff','#bff0c9','#fff2b7','#d8c1ff','#ffc8a8'],
  aurora: ['#79f2ff','#2dd4bf','#60a5fa','#a78bfa','#f472b6','#fde047'],
  ember: ['#ffd6a5','#ffadad','#ff8fab','#ffc6ff','#ffd166','#ffe66d'],
};

const defaults = {
  depth: {
    enabled: true,
    equator: 50,
    topScaleX: 80, midScaleX: 100, bottomScaleX: 120,
    topScaleY: 80, midScaleY: 100, bottomScaleY: 120,
  },
  tint: {
    topColor: '#8db9df', topStrength: 22,
    bottomColor: '#d5ecff', bottomStrength: 10,
  },
  background: {
    top: '#285f99', mid: '#1d4f88', bottom: '#153d73',
    midPos: 52, angle: 90,
    glow: 10,
  },
  rain: {
    spawnRate: 27, maxDrops: 180,
    minSpeed: 760, maxSpeed: 1060,
    minLength: 12, maxLength: 27,
    minWidth: 0.7, maxWidth: 1.35,
    minAlpha: 0.42, maxAlpha: 0.83,
    targetTop: 6, targetBottom: 96,
    angle: 22,
    angleJitter: 5,
  },
  ripple: {
    count: 2, minLife: 0.68, maxLife: 0.92,
    minRadius: 18, maxRadius: 34, delay: 0.11,
  },
  splash: {
    minCount: 5, maxCount: 8,
    minLife: 0.30, maxLife: 0.52,
    minSize: 1.0, maxSize: 2.1,
    minPower: 58, maxPower: 118,
    sizeVariance: 15, powerVariance: 15,
  },
  symbol: {
    chance: 72,
    minLife: 1.25, maxLife: 1.80,
    minSize: 12, maxSize: 19,
    minRise: 20, maxRise: 38,
    sizeVariance: 10, lifeVariance: 10, riseVariance: 10,
  },
  dof: {
    enabled: true,
    focusDepth: 58,
    focusWidth: 16,
    backBlur: 3.5,
    frontBlur: 6.5,
    backCurve: 1.8,
    frontCurve: 2.1,
    layers: 10,
    opacityLoss: 12,
    showFocus: false,
  },
  color: {
    syncImpactFamily: true,
    liquidMode: 'white',
    symbolMode: 'white',
    liquidColors: deepClone(PALETTE_PRESETS.monochrome),
    symbolColors: deepClone(PALETTE_PRESETS.monochrome),
    liquidPreset: 'monochrome',
    symbolPreset: 'monochrome',
  }
};

const screenshotPreset = deepClone(defaults);
Object.assign(screenshotPreset.depth, {
  enabled: true, equator: 15,
  topScaleX: 100, midScaleX: 120, bottomScaleX: 150,
  topScaleY: 75, midScaleY: 100, bottomScaleY: 135,
});
Object.assign(screenshotPreset.rain, {
  spawnRate: 80, maxDrops: 500,
  minSpeed: 760, maxSpeed: 1060,
  minLength: 12, maxLength: 27,
  minWidth: 0.7, maxWidth: 1.35,
  targetTop: 6, targetBottom: 96,
});
Object.assign(screenshotPreset.ripple, {
  count: 3, minLife: 0.68, maxLife: 0.92,
  minRadius: 18, maxRadius: 50, delay: 0.30,
});
Object.assign(screenshotPreset.splash, {
  minCount: 5, maxCount: 16,
  minLife: 0.30, maxLife: 0.52,
  minSize: 1.0, maxSize: 4.0,
  minPower: 92, maxPower: 188,
  sizeVariance: 15, powerVariance: 15,
});
Object.assign(screenshotPreset.symbol, {
  chance: 72,
  minLife: 1.25, maxLife: 1.80,
  minSize: 18, maxSize: 25,
  minRise: 20, maxRise: 61,
  sizeVariance: 10, lifeVariance: 10, riseVariance: 10,
});
Object.assign(screenshotPreset.dof, {
  enabled: true, focusDepth: 58, focusWidth: 16,
  backBlur: 3.5, frontBlur: 6.5,
  backCurve: 1.8, frontCurve: 2.1,
  layers: 10, opacityLoss: 12, showFocus: false,
});

const BUILTIN_PRESETS = [
  { id: 'builtin_current', nameId: 'text.01_default', config: deepClone(defaults) },
  { id: 'builtin_screens', nameId: 'text.02_screenshots', config: deepClone(screenshotPreset) },
];

const config = deepClone(defaults);
const drops = [], ripples = [], splashes = [], symbols = [];
const layerCanvases = [];
const layerContexts = [];
let W = 0, H = 0, DPR = 1, last = performance.now(), elapsed = 0, spawnAccumulator = 0;

const rand = (a,b) => a + Math.random() * (b-a);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const clamp01 = v => clamp(v,0,1);
const lerp = (a,b,t) => a + (b-a) * t;

function copyIntoConfig(source){
  const fresh = deepClone(source);
  Object.keys(config).forEach(k => delete config[k]);
  Object.assign(config, fresh);
}
function resetToDefaults(){ copyIntoConfig(defaults); }
