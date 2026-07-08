/* ---------- state ---------- */
let current = 1;
const total = 4;
const text = 'Thank you for always being there for me. You make every day brighter, and I am grateful for every moment we share together.';
let i = 0;
let typingTimer = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- typewriter (page 2) ---------- */
function type(){
  const letterEl = document.getElementById('letter');
  if(prefersReducedMotion){
    letterEl.textContent = text;
    letterEl.classList.add('done');
    return;
  }
  if(i < text.length){
    letterEl.textContent += text[i++];
    typingTimer = setTimeout(type, 40);
  } else {
    letterEl.classList.add('done');
  }
}

/* ---------- page navigation ---------- */
function showPage(n){
  document.querySelectorAll('.page').forEach(p=>{
    p.classList.remove('active','show');
  });
  const el = document.getElementById('page' + n);
  el.classList.add('active');
  // double rAF so the browser registers the pre-transition state first
  requestAnimationFrame(()=> requestAnimationFrame(()=> el.classList.add('show')));
  updateDots(n);

  if(n === 2){
    document.getElementById('letter').textContent = '';
    document.getElementById('letter').classList.remove('done');
    i = 0;
    clearTimeout(typingTimer);
    type();
  }
  if(n === 4){
    launchConfetti();
  }
}

function nextPage(){
  if(current < total){
    current++;
    showPage(current);
  }
}

function restart(){
  current = 1;
  clearTimeout(typingTimer);
  showPage(current);
}

function updateDots(n){
  document.querySelectorAll('.dot').forEach((dot, idx)=>{
    const step = idx + 1;
    dot.classList.toggle('active', step === n);
    dot.classList.toggle('done', step < n);
  });
  const progressWrap = document.querySelector('.progress');
  if(progressWrap) progressWrap.setAttribute('aria-label', `Step ${n} of ${total}`);
}

/* ---------- ambient floating hearts ---------- */
function spawnHeart(){
  const bg = document.getElementById('heartsBg');
  if(!bg || prefersReducedMotion) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = ['❤️','💗','💕','🌸'][Math.floor(Math.random()*4)];
  const startX = Math.random() * 100;
  const drift = (Math.random() * 120 - 60) + 'px';
  const duration = 8 + Math.random() * 6;
  heart.style.left = startX + 'vw';
  heart.style.setProperty('--drift', drift);
  heart.style.animationDuration = duration + 's';
  heart.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
  bg.appendChild(heart);
  setTimeout(()=> heart.remove(), duration * 1000 + 200);
}

let heartInterval = setInterval(spawnHeart, 900);
if(!prefersReducedMotion){
  for(let k=0;k<3;k++) setTimeout(spawnHeart, k * 300);
}

/* ---------- confetti burst (page 4) ---------- */
function launchConfetti(){
  if(prefersReducedMotion) return;
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#e0577b', '#f0b94d', '#fbe8dd', '#ffffff', '#c8425f'];
  const pieces = Array.from({length: 90}, () => ({
    x: canvas.width / 2 + (Math.random() * 200 - 100),
    y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 10,
    vy: -(Math.random() * 10 + 4),
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    gravity: 0.28 + Math.random() * 0.12
  }));

  let frame = 0;
  const maxFrames = 130;

  function tick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p=>{
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      ctx.restore();
    });
    frame++;
    if(frame < maxFrames){
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  tick();
}

window.addEventListener('resize', ()=>{
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ---------- init ---------- */
updateDots(1);
