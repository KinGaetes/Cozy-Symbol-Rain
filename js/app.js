'use strict';

(async()=>{
  await CozyI18n.load('locales/translations.csv');
  restoreLanguage();applyLanguage();
  initializePanel();buildUI();resize();
  addEventListener('resize',resize);
  document.getElementById('languageSelect').addEventListener('change',event=>{
    const preset=currentPresetList().find(item=>item.id===selectedPresetId);
    const name=document.getElementById('presetName');
    const updateName=preset?.nameId && name.value===presetName(preset);
    languageMode=event.target.value;
    try{localStorage.setItem('CozySymbolRain.uiLanguage',languageMode)}catch(_){}
    applyLanguage();
    if(updateName)name.value=presetName(preset);
  });
  setTimeout(()=>document.getElementById('hint').classList.add('hidden'),6000);
  last=performance.now();requestAnimationFrame(frame);
})().catch(error=>{
  console.error('Cozy Symbol Rain initialization failed:',error);
  const message=document.createElement('pre');message.textContent=error.message;document.body.replaceChildren(message);
});
