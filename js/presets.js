'use strict';

const STORAGE_KEY = 'cozy-rain-custom-presets-v1';
function listCustomPresets(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    if(!Array.isArray(saved))return [];
    return saved.flatMap(preset=>{
      try{
        if(typeof preset?.id!=='string'||!preset.id.startsWith('custom_')||typeof preset.name!=='string')return [];
        return [{id:preset.id,name:preset.name,config:normalizePreset(preset.config)}];
      }catch(_){return []}
    });
  }catch(_){return []}
}
function saveCustomPresets(list){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(list));return true}
  catch(_){alert(t('text.could_not_save_in_this_browser_export_the_preset_to_keep_it'));return false}
}
function presetName(preset){return preset.nameId?t(preset.nameId):preset.name||''}
function normalizePreset(value){
  function normalize(input,example){
    if(Array.isArray(example)){
      if(!Array.isArray(input)||input.length!==example.length)throw new TypeError('Invalid palette');
      return input.map((entry,i)=>normalize(entry,example[i]));
    }
    if(example&&typeof example==='object'){
      if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Invalid settings');
      return Object.fromEntries(Object.entries(example).map(([key,expected])=>{
        if(!Object.hasOwn(input,key))throw new TypeError('Missing setting');
        return [key,normalize(input[key],expected)];
      }));
    }
    if(typeof input!==typeof example||(typeof input==='number'&&!Number.isFinite(input)))throw new TypeError('Invalid setting type');
    if(typeof example==='string'&&example.startsWith('#')&&!/^#[0-9a-f]{6}$/i.test(input))throw new TypeError('Invalid color');
    return input;
  }
  const clean=normalize(value,defaults);
  for(const [, ,items] of defs)for(const [path,,min,max] of items){
    if(typeof min!=='number')continue;
    const current=path.split('.').reduce((obj,key)=>obj[key],clean);
    if(current<min||current>max)throw new TypeError('Setting outside supported range');
  }
  if(!['white','palette','paletteSoft','paletteWhite50'].includes(clean.color.liquidMode)||!['white','palette'].includes(clean.color.symbolMode))throw new TypeError('Invalid color mode');
  if(!Object.hasOwn(PALETTE_PRESETS,clean.color.liquidPreset)||!Object.hasOwn(PALETTE_PRESETS,clean.color.symbolPreset))throw new TypeError('Invalid palette');
  return clean;
}
function exportPresetJSON(text){
  const blob=new Blob([text],{type:'application/json;charset=utf-8'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='cozy-symbol-rain-preset.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}
function currentPresetList(){ return [...BUILTIN_PRESETS, ...listCustomPresets()]; }
let selectedPresetId = BUILTIN_PRESETS[0].id;

function loadPresetById(id){
  const preset = currentPresetList().find(p => p.id === id);
  if(!preset) return;
  copyIntoConfig(preset.config);
  selectedPresetId = id;
  ensureLayers();
  buildUI();
}
function saveNewCustomPreset(name){
  const clean = (name || '').trim() || t('preset.default_name',{n:listCustomPresets().length+1});
  const list = listCustomPresets();
  const id = `custom_${Date.now()}`;
  list.push({ id, name: clean, config: deepClone(config) });
  if(!saveCustomPresets(list))return;
  selectedPresetId = id;
  buildUI();
}
function overwriteSelectedCustom(name){
  const list = listCustomPresets();
  const idx = list.findIndex(p => p.id === selectedPresetId);
  if(idx < 0) return false;
  list[idx].name = (name || list[idx].name || t('text.preset')).trim();
  list[idx].config = deepClone(config);
  if(!saveCustomPresets(list))return null;
  buildUI();
  return true;
}
function deleteSelectedCustom(){
  const list = listCustomPresets().filter(p => p.id !== selectedPresetId);
  if(!saveCustomPresets(list))return;
  selectedPresetId = BUILTIN_PRESETS[0].id;
  buildUI();
}

function applyPalette(which, presetName){
  if(!PALETTE_PRESETS[presetName]) return;
  config.color[which + 'Preset'] = presetName;
  config.color[which + 'Colors'] = deepClone(PALETTE_PRESETS[presetName]);
  buildUI();
}
function copyPalette(from, to){
  config.color[to + 'Colors'] = deepClone(config.color[from + 'Colors']);
  buildUI();
}
