"use strict";
// ??????? HTML ?? element ?????????? ???????????????? TypeScript
function requiredElement(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error('Missing HTML element: ' + selector);
    return element;
}
const programs = [
    { id: 'strength', title: 'Full Body Basics', tag: 'STRENGTH / 01', description: 'ขยับกล้ามเนื้อทั่วร่างกาย ด้วยน้ำหนักตัวของคุณ', time: '3 ท่า · ไม่ใช้อุปกรณ์', symbol: '↗', exercises: [['Squat', 'ย่อตัวแล้วกลับมายืน', '10 ครั้ง'], ['Wall Push-up', 'วิดพื้นกับผนัง', '8 ครั้ง'], ['Standing March', 'ย่ำเท้าอยู่กับที่', '30 วินาที']] },
    { id: 'cardio', title: 'Find Your Rhythm', tag: 'CARDIO / 02', description: 'เปลี่ยนช่วงเวลาสั้น ๆ ให้มีพลัง ด้วยการเคลื่อนไหว', time: '3 ท่า · ไม่ใช้อุปกรณ์', symbol: 'ϟ', exercises: [['Step Touch', 'ก้าวเท้าไปด้านข้างสลับกัน', '30 วินาที'], ['Standing March', 'ย่ำเท้าอยู่กับที่', '30 วินาที'], ['Heel Dig', 'แตะส้นเท้าไปด้านหน้าสลับข้าง', '30 วินาที']] },
    { id: 'mobility', title: 'Slow & Stretch', tag: 'MOBILITY / 03', description: 'ชะลอจังหวะ ผ่อนคลาย แล้วให้ร่างกายได้เคลื่อนไหว', time: '3 ท่า · ไม่ใช้อุปกรณ์', symbol: '〰', exercises: [['Shoulder Rolls', 'หมุนไหล่ช้า ๆ', '8 ครั้ง'], ['Side Reach', 'เอื้อมแขนไปด้านข้างเบา ๆ', 'ข้างละ 15 วินาที'], ['Ankle Circles', 'หมุนข้อเท้าช้า ๆ', 'ข้างละ 8 ครั้ง']] }
];
const cards = requiredElement('#cards');
function renderCards(filter = 'all') {
    cards.innerHTML = programs.filter(p => filter === 'all' || p.id === filter).map(p => `<article class="card"><div class="card-visual"><span class="card-tag">${p.tag}</span><span class="symbol" aria-hidden="true">${p.symbol}</span></div><div class="card-body"><h3>${p.title}</h3><p>${p.description}</p><div class="card-bottom"><span>${p.time}</span><button class="choose" data-program="${p.id}" aria-label="เลือก ${p.title}">↗</button></div></div></article>`).join('');
}
let current = 'strength';
const completed = { strength: new Set(), cardio: new Set(), mobility: new Set() };
function updateProgress() {
    const count = completed[current].size;
    requiredElement('#progress').value = count;
    requiredElement('#progress-label').textContent = `${count} / 3 ท่า`;
    requiredElement('#complete-message').textContent = count === 3 ? 'ครบแล้ว! วันนี้คุณได้ขยับเพื่อตัวเองแล้ว ✓' : '';
}
function selectProgram(id) {
    const p = programs.find(p => p.id === id);
    if (!p)
        return;
    current = p.id;
    requiredElement('#session-title').textContent = p.title;
    requiredElement('#exercises').innerHTML = p.exercises.map((e, i) => `<label class="exercise"><input type="checkbox" data-index="${i}" ${completed[current].has(i) ? 'checked' : ''}><div><strong>${e[0]}</strong><small>${e[1]}</small></div><span>${e[2]}</span></label>`).join('');
    updateProgress();
}
requiredElement('.filters').addEventListener('click', e => {
    if (!(e.target instanceof Element))
        return;
    const button = e.target.closest('[data-filter]');
    if (!button)
        return;
    document.querySelectorAll('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    renderCards(button.dataset.filter);
});
cards.addEventListener('click', e => { if (!(e.target instanceof Element))
    return; const b = e.target.closest('[data-program]'); if (b) {
    selectProgram(b.dataset.program);
    requiredElement('.session').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
} });
requiredElement('#exercises').addEventListener('change', e => { if (!(e.target instanceof HTMLInputElement))
    return; const i = Number(e.target.dataset.index); if (e.target.checked)
    completed[current].add(i);
else
    completed[current].delete(i); updateProgress(); });
let duration = 30, remaining = 30, deadline = 0;
let interval = null;
const startButton = requiredElement('#start'), timerStatus = requiredElement('#timer-status');
function showTime() { requiredElement('#time').textContent = String(Math.floor(remaining / 60)).padStart(2, '0') + ':' + String(remaining % 60).padStart(2, '0'); }
function stopTimer() { if (interval !== null)
    window.clearInterval(interval); interval = null; startButton.textContent = 'เริ่มจับเวลา'; }
function tick() { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); showTime(); if (remaining === 0) {
    stopTimer();
    timerStatus.textContent = 'ครบเวลาพักแล้ว พร้อมไปต่อ!';
} }
startButton.addEventListener('click', () => { if (interval !== null) {
    tick();
    stopTimer();
    timerStatus.textContent = remaining === 0 ? 'ครบเวลาพักแล้ว พร้อมไปต่อ!' : 'หยุดชั่วคราว';
    return;
} if (remaining === 0)
    remaining = duration; deadline = Date.now() + remaining * 1000; interval = window.setInterval(tick, 200); startButton.textContent = 'หยุดชั่วคราว'; timerStatus.textContent = 'หายใจสบาย ๆ ระหว่างพัก'; showTime(); });
requiredElement('#reset').addEventListener('click', () => { stopTimer(); remaining = duration; showTime(); timerStatus.textContent = 'พร้อมเมื่อคุณพร้อม'; });
document.querySelectorAll('[data-seconds]').forEach(b => b.addEventListener('click', () => { stopTimer(); duration = Number(b.dataset.seconds); remaining = duration; showTime(); timerStatus.textContent = 'พร้อมเมื่อคุณพร้อม'; document.querySelectorAll('[data-seconds]').forEach(item => { const active = item === b; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active)); }); }));
renderCards();
selectProgram('strength');
