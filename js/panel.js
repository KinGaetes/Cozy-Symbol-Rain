'use strict';

let locked = false, hideTimer = null;
const showPanel = () => { clearTimeout(hideTimer); panel.classList.add('visible'); };
const scheduleHide = () => { if(locked) return; clearTimeout(hideTimer); hideTimer = setTimeout(() => panel.classList.remove('visible'), 260); };
function initializePanel(){
edgeSensor.addEventListener('mouseenter', showPanel);
panel.addEventListener('mouseenter', showPanel);
panel.addEventListener('mouseleave', scheduleHide);
pinBtn.addEventListener('click', () => {
  locked = !locked;
  panel.classList.toggle('locked', locked);
  pinBtn.classList.toggle('active', locked);pinBtn.setAttribute('aria-pressed',String(locked));
  if(locked) showPanel(); else scheduleHide();
});
closeBtn.addEventListener('click', () => {
  locked = false;
  pinBtn.classList.remove('active');pinBtn.setAttribute('aria-pressed','false');
  panel.classList.remove('locked', 'visible');
});

edgeSensor.addEventListener('click',showPanel);
panel.addEventListener('focusin',showPanel);
pinBtn.setAttribute('aria-pressed','false');
}
