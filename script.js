/* ============================================================
   Untuk Rachel — interactivity
   ============================================================ */

/* ---------- 1. Floating petals / hearts ---------- */
(function petals(){
  const layer = document.querySelector('.petals');
  if(!layer) return;
  const glyphs = ['♡','✿','❀','✾','✽','❁','♥'];
  const colors = ['#e8899b','#f6b48a','#c9a7e0','#d4a24a','#f7c8d3'];

  const spawn = () => {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    el.style.left = Math.random()*100 + 'vw';
    el.style.color = colors[Math.floor(Math.random()*colors.length)];
    const size = 14 + Math.random()*22;
    el.style.fontSize = size + 'px';
    const dur = 9 + Math.random()*9;
    el.style.animationDuration = dur + 's';
    el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    el.style.opacity = (0.35 + Math.random()*0.4).toFixed(2);
    layer.appendChild(el);
    setTimeout(() => el.remove(), dur*1000 + 500);
  };

  // Initial burst
  for(let i=0; i<10; i++) setTimeout(spawn, i*300);
  setInterval(spawn, 700);
})();

/* ---------- 2. Intro → Letter transition ---------- */
const openBtn = document.getElementById('openBtn');
const intro   = document.getElementById('scene-intro');
const letter  = document.getElementById('scene-letter');

openBtn?.addEventListener('click', () => {
  intro.classList.add('fade-out');
  setTimeout(() => {
    intro.classList.remove('active');
    intro.style.display = 'none';
    letter.classList.add('active');
    window.scrollTo({ top:0, behavior:'instant' });
    // Kick off reveals
    initReveal();
  }, 750);
});

/* ---------- 3. Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- 4. The "Nggak" button that runs away ---------- */
const btnNo   = document.getElementById('btnNo');
const btnYes  = document.getElementById('btnYes');
const noTexts = [
  'Nggak ah',
  'Beneran nggak',
  'Yakin nggak',
  'Coba pikir lagi',
  'Hmm… nggak',
  'Duh, nggak deh',
  'Ya udah iya deh…',
];
let noCount = 0;

function moveNoButton(){
  const pad = 20;
  const rect = btnNo.getBoundingClientRect();
  const container = document.querySelector('.ask-buttons').getBoundingClientRect();

  // Move within viewport
  const maxX = window.innerWidth  - rect.width  - pad;
  const maxY = window.innerHeight - rect.height - pad;

  const nx = Math.max(pad, Math.min(maxX, Math.random()*maxX));
  const ny = Math.max(pad, Math.min(maxY, Math.random()*maxY));

  btnNo.style.position = 'fixed';
  btnNo.style.left = nx + 'px';
  btnNo.style.top  = ny + 'px';
  btnNo.style.transform = 'rotate(' + (Math.random()*30 - 15) + 'deg)';

  noCount++;
  if(noCount < noTexts.length){
    btnNo.textContent = noTexts[noCount];
  }
  // Grow the Yes
  if(noCount <= 5){
    btnYes.classList.remove('grow-1','grow-2','grow-3','grow-4','grow-5');
    btnYes.classList.add('grow-' + noCount);
  }
}

btnNo?.addEventListener('mouseenter', moveNoButton);
btnNo?.addEventListener('focus', moveNoButton);
btnNo?.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, {passive:false});
btnNo?.addEventListener('click', (e) => { e.preventDefault(); moveNoButton(); });

/* ---------- 5. Yes → sparkles + reveal final ---------- */
const finalScene = document.getElementById('finalScene');

btnYes?.addEventListener('click', () => {
  burstSparkles();
  setTimeout(() => {
    finalScene.classList.remove('hidden');
    finalScene.classList.add('show');
    finalScene.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 400);
});

/* ---------- 6. Replay ---------- */
document.getElementById('replayBtn')?.addEventListener('click', () => {
  window.scrollTo({ top:0, behavior:'smooth' });
  setTimeout(() => {
    location.reload();
  }, 600);
});

/* ---------- 7. Sparkle burst on canvas ---------- */
const canvas = document.getElementById('sparkles');
const ctx    = canvas.getContext('2d');
let particles = [];

function sizeCanvas(){
  canvas.width  = window.innerWidth  * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

function burstSparkles(){
  const colors = ['#e8899b','#f6b48a','#c9a7e0','#d4a24a','#ffffff','#c85a76'];
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  // Big center burst
  for(let i=0; i<120; i++){
    const a = Math.random()*Math.PI*2;
    const s = 3 + Math.random()*7;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a)*s,
      vy: Math.sin(a)*s - 2,
      life: 1,
      decay: .008 + Math.random()*.012,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: 2 + Math.random()*3,
      glyph: Math.random() < .3 ? '♡' : null,
    });
  }
  // Side confetti
  for(let i=0; i<40; i++){
    particles.push({
      x: Math.random()*window.innerWidth,
      y: -20,
      vx: (Math.random()-.5)*3,
      vy: 2 + Math.random()*4,
      life:1, decay:.005,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: 3 + Math.random()*3,
      glyph:'♡',
    });
  }
  if(!animId) tick();
}

let animId = null;
function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;         // gravity
    p.vx *= 0.995;
    p.life -= p.decay;
    if(p.life <= 0) return;

    ctx.globalAlpha = Math.max(0, p.life);
    if(p.glyph){
      ctx.fillStyle = p.color;
      ctx.font = (p.size*4) + 'px serif';
      ctx.fillText(p.glyph, p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 40);

  if(particles.length){
    animId = requestAnimationFrame(tick);
  } else {
    animId = null;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

/* ---------- 8. Init reveals immediately if page loaded past intro ---------- */
// If a returning visitor lands after refresh, still show the intro. Nothing to do here.
