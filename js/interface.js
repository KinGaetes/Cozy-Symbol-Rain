'use strict';

function getPath(path){
  return path.split('.').reduce((o, k) => o[k], config);
}
function setPath(path, value){
  const parts = path.split('.');
  let obj = config;
  for(let i=0;i<parts.length-1;i++) obj = obj[parts[i]];
  obj[parts[parts.length-1]] = value;
}
const esc = s => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function sectionPreset(){
  const wrap = document.createElement('details'); wrap.open = true;
  wrap.innerHTML = `<summary data-i18n="text.presets">${th('text.presets')}</summary>`;
  const group = document.createElement('div'); group.className = 'group';
  const options = currentPresetList().map(p => `<option ${p.nameId?`data-i18n="${p.nameId}"`:""} value="${esc(p.id)}" ${p.id===selectedPresetId?'selected':''}>${esc(presetName(p))}</option>`).join('');
  group.innerHTML = `
    <div class="row compact">
      <label><span data-i18n="text.active_preset">${th('text.active_preset')}</span></label>
      <select id="presetSelect">${options}</select>
    </div>
    <div class="row compact">
      <label><span data-i18n="text.name">${th('text.name')}</span></label>
      <input type="text" id="presetName" value="${esc(presetName(currentPresetList().find(p => p.id===selectedPresetId)||{}))}" />
    </div>
    <div class="buttons three">
      <button id="presetLoad"><span data-i18n="text.load">${th('text.load')}</span></button>
      <button id="presetSaveNew"><span data-i18n="text.save_new">${th('text.save_new')}</span></button>
      <button id="presetOverwrite"><span data-i18n="text.overwrite">${th('text.overwrite')}</span></button>
    </div>
    <div class="buttons three">
      <button id="presetDelete"><span data-i18n="text.delete">${th('text.delete')}</span></button>
      <button id="presetExport"><span data-i18n="text.export">${th('text.export')}</span></button>
      <button id="presetImport"><span data-i18n="text.import">${th('text.import')}</span></button>
    </div>
    <div class="tiny"><span data-i18n="text.presets_01_and_02_are_included_new_presets_are_saved_locally_in_your_bro">${th('text.presets_01_and_02_are_included_new_presets_are_saved_locally_in_your_bro')}</span></div>
  `;
  wrap.appendChild(group);
  return wrap;
}

function sectionColors(){
  const wrap = document.createElement('details'); wrap.open = true;
  wrap.innerHTML = `<summary data-i18n="text.color_and_palettes">${th('text.color_and_palettes')}</summary>`;
  const liquidOpts = [
    ['white','text.white'], ['palette','text.full_color'], ['paletteSoft','text.less_opaque_color'], ['paletteWhite50','text.color_50_white']
  ].map(([v,l]) => `<option data-i18n="${l}" value="${v}" ${config.color.liquidMode===v?'selected':''}>${th(l)}</option>`).join('');
  const symbolOpts = [['white','text.white'],['palette','text.palette']].map(([v,l]) => `<option data-i18n="${l}" value="${v}" ${config.color.symbolMode===v?'selected':''}>${th(l)}</option>`).join('');
  const presetOpts = Object.keys(PALETTE_PRESETS).map(id => `<option data-i18n="${PALETTE_NAMES[id]}" value="${id}">${th(PALETTE_NAMES[id])}</option>`).join('');
  const group = document.createElement('div'); group.className = 'group';
  group.innerHTML = `
    <div class="row compact"><label><span data-i18n="text.match_impact_colors">${th('text.match_impact_colors')}</span></label><input id="syncImpact" type="checkbox" ${config.color.syncImpactFamily ? 'checked' : ''}></div>
    <div class="row compact"><label><span data-i18n="text.drop_ripple_splash_mode">${th('text.drop_ripple_splash_mode')}</span></label><select id="liquidMode">${liquidOpts}</select></div>
    <div class="row compact"><label><span data-i18n="text.symbol_mode">${th('text.symbol_mode')}</span></label><select id="symbolMode">${symbolOpts}</select></div>

    <div class="row compact"><span class="label"><span data-i18n="text.liquid_palette_preset">${th('text.liquid_palette_preset')}</span></span><div class="combo textOnly"><select id="liquidPresetSelect">${presetOpts}</select></div></div>
    <button class="wideBtn" id="applyLiquidPreset"><span data-i18n="text.apply_to_liquids">${th('text.apply_to_liquids')}</span></button>
    <div class="paletteGrid" id="liquidPaletteGrid"></div>

    <div class="row compact"><span class="label"><span data-i18n="text.symbol_palette_preset">${th('text.symbol_palette_preset')}</span></span><div class="combo textOnly"><select id="symbolPresetSelect">${presetOpts}</select></div></div>
    <button class="wideBtn" id="applySymbolPreset"><span data-i18n="text.apply_to_symbols">${th('text.apply_to_symbols')}</span></button>
    <div class="paletteGrid" id="symbolPaletteGrid"></div>

    <div class="buttons">
      <button id="copyLiquidToSymbol"><span data-i18n="text.copy_liquids_symbols">${th('text.copy_liquids_symbols')}</span></button>
      <button id="copySymbolToLiquid"><span data-i18n="text.copy_symbols_liquids">${th('text.copy_symbols_liquids')}</span></button>
    </div>
    <div class="tiny"><span data-i18n="text.try_a_black_background_white_liquids_and_rgb_cmy_symbols_or_coordinate_e">${th('text.try_a_black_background_white_liquids_and_rgb_cmy_symbols_or_coordinate_e')}</span></div>
  `;
  wrap.appendChild(group);
  return wrap;
}

function makePaletteGrid(container, type){
  container.innerHTML = '';
  const arr = config.color[type + 'Colors'];
  for(let i=0;i<6;i++){
    const cell = document.createElement('div');
    cell.className = 'paletteCell';
    cell.innerHTML = `<span>${i+1}</span><input type="color" data-palette-type="${type}" data-palette-index="${i}" value="${esc(arr[i] || '#ffffff')}" />`;
    container.appendChild(cell);
  }
}

function buildGenericSection([title, open, items]){
  const det = document.createElement('details'); det.open = open;
  const sum = document.createElement('summary'); sum.dataset.i18n=title;sum.textContent=t(title); det.appendChild(sum);
  const group = document.createElement('div'); group.className = 'group';
  for(const item of items){
    const [path, label, a, b, step] = item;
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<label data-i18n="${label}">${th(label)}</label>`;
    const value = getPath(path);
    if(a === 'check'){
      const input = document.createElement('input');
      input.type = 'checkbox'; input.checked = !!value; input.dataset.path = path;
      row.appendChild(input);
    } else if(a === 'color'){
      const input = document.createElement('input');
      input.type = 'color'; input.value = value; input.dataset.path = path;
      row.appendChild(input);
    } else {
      const combo = document.createElement('div'); combo.className = 'combo';
      const range = document.createElement('input');
      range.type = 'range'; range.min = a; range.max = b; range.step = step; range.value = value; range.dataset.path = path;
      const num = document.createElement('input');
      num.type = 'number'; num.min = a; num.max = b; num.step = step; num.value = value; num.dataset.path = path;
      combo.append(range, num); row.appendChild(combo);
    }
    group.appendChild(row);
  }
  det.appendChild(group);
  return det;
}

function buildFooter(){
  const foot = document.createElement('div'); foot.className = 'buttons';
  foot.innerHTML = `<button id="resetAll"><span data-i18n="text.reset">${th('text.reset')}</span></button><button id="clearFx"><span data-i18n="text.clear_particles">${th('text.clear_particles')}</span></button>`;
  return foot;
}

function bindInputs(){
  controls.querySelectorAll('input[data-path]').forEach(input => {
    const path = input.dataset.path;
    input.addEventListener('input', () => {
        const value = input.type === 'checkbox' ? input.checked : input.type === 'color' ? input.value : Number(input.value);
        if(input.type === 'number' && (input.value.trim()==='' || !Number.isFinite(value) || value<Number(input.min) || value>Number(input.max)))return;
      setPath(path, value);
      controls.querySelectorAll(`input[data-path="${path}"]`).forEach(peer => {
        if(peer === input) return;
        if(peer.type === 'checkbox') peer.checked = !!value; else peer.value = value;
      });
      if(path === 'dof.layers') ensureLayers();
    });
  });

  controls.querySelectorAll('input[data-palette-type]').forEach(input => {
    input.addEventListener('input', () => {
      const type = input.dataset.paletteType;
      const idx = Number(input.dataset.paletteIndex);
      config.color[type + 'Colors'][idx] = input.value;
    });
  });

  const liquidPresetSelect = document.getElementById('liquidPresetSelect');
  const symbolPresetSelect = document.getElementById('symbolPresetSelect');
  if(liquidPresetSelect) liquidPresetSelect.value = config.color.liquidPreset;
  if(symbolPresetSelect) symbolPresetSelect.value = config.color.symbolPreset;

  document.getElementById('syncImpact').oninput = e => { config.color.syncImpactFamily = e.target.checked; };
  document.getElementById('liquidMode').oninput = e => { config.color.liquidMode = e.target.value; };
  document.getElementById('symbolMode').oninput = e => { config.color.symbolMode = e.target.value; };
  document.getElementById('applyLiquidPreset').onclick = () => applyPalette('liquid', liquidPresetSelect.value);
  document.getElementById('applySymbolPreset').onclick = () => applyPalette('symbol', symbolPresetSelect.value);
  document.getElementById('copyLiquidToSymbol').onclick = () => copyPalette('liquid', 'symbol');
  document.getElementById('copySymbolToLiquid').onclick = () => copyPalette('symbol', 'liquid');

  document.getElementById('resetAll').onclick = () => { resetToDefaults(); selectedPresetId = BUILTIN_PRESETS[0].id; ensureLayers(); buildUI(); };
  document.getElementById('clearFx').onclick = () => { drops.length = 0; ripples.length = 0; splashes.length = 0; symbols.length = 0; spawnAccumulator = 0; elapsed = 0; };

  document.getElementById('presetSelect').onchange = e => { selectedPresetId = e.target.value; const item = currentPresetList().find(p => p.id === selectedPresetId); document.getElementById('presetName').value = item ? presetName(item) : ''; };
  document.getElementById('presetLoad').onclick = () => loadPresetById(document.getElementById('presetSelect').value);
  document.getElementById('presetSaveNew').onclick = () => saveNewCustomPreset(document.getElementById('presetName').value);
  document.getElementById('presetOverwrite').onclick = () => {
    if(overwriteSelectedCustom(document.getElementById('presetName').value)===false) saveNewCustomPreset(document.getElementById('presetName').value || t('text.copy'));
  };
  document.getElementById('presetDelete').onclick = () => deleteSelectedCustom();
  document.getElementById('presetExport').onclick = async () => {
    const text = JSON.stringify(deepClone(config), null, 2);
    let message;
    try{await navigator.clipboard.writeText(text);message='text.copied'}
    catch(_){exportPresetJSON(text);message='text.downloaded'}
    const button=document.getElementById('presetExport');button.textContent=t(message);button.dataset.i18n=message;
    setTimeout(()=>buildUI(),900);
  };
  document.getElementById('presetImport').onclick = () => {
    const raw = prompt(t('text.paste_the_preset_json_here'));
    if(!raw) return;
    try {
      const parsed = normalizePreset(JSON.parse(raw));
      copyIntoConfig(parsed);
      selectedPresetId = BUILTIN_PRESETS[0].id;
      ensureLayers();
      buildUI();
    } catch {
      alert(t('text.invalid_json_or_incompatible_preset'));
    }
  };
}

function buildUI(){
  controls.innerHTML = '';
  controls.appendChild(sectionPreset());
  controls.appendChild(sectionColors());
  for(const def of defs) controls.appendChild(buildGenericSection(def));
  controls.appendChild(buildFooter());
  makePaletteGrid(document.getElementById('liquidPaletteGrid'), 'liquid');
  makePaletteGrid(document.getElementById('symbolPaletteGrid'), 'symbol');
  bindInputs();
  CozyI18n.localize(document,currentLanguage);
}

