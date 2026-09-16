let saldo=parseInt(localStorage.getItem('rs_saldo')||'5000');
let usuario=localStorage.getItem('rs_user')||null;
let historial=JSON.parse(localStorage.getItem('rs_hist')||'[]');
let jackpot=parseInt(localStorage.getItem('rs_jackpot')||'48250');
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('rs_saldo',saldo);localStorage.setItem('rs_hist',JSON.stringify(historial.slice(0,60)));localStorage.setItem('rs_jackpot',jackpot)}
function updateSaldo(){
  const s=$('saldo'); if(s){ const prev=parseInt(s.textContent.replace(/,/g,''))||0; s.textContent=saldo.toLocaleString(); if(window.gsap && saldo>prev){ gsap.fromTo(s,{scale:1.2,color:'#f0d76a'},{scale:1,color:'#fff',duration:.4,ease:'back.out(1.7)'}) } }
  const t=$('topTu'); if(t) t.textContent=saldo.toLocaleString();
  const j=$('statJackpot'); if(j) j.textContent='$'+jackpot.toLocaleString();
  const lvl=$('userLevel'); if(lvl) lvl.textContent=saldo>20000?'VIP 💎':saldo>10000?'PRO ⭐':saldo>5000?'LVL 2':'LVL 1';
  const btn=$('btnUser'); if(btn) btn.textContent=usuario?usuario:'INGRESAR';
  if(saldo<=0){ saldo=1000; save(); showToast('Saldo agotado! Bono +$1000'); updateSaldo(); }
  renderHist();
}
function addHist(txt,win){historial.unshift(`${new Date().toLocaleTimeString()} — ${txt} ${win?'✅':''}`);save();renderHist(); if(window.gsap){ const ul=$('historialLista'); if(ul && ul.firstChild) gsap.from(ul.firstChild,{x:-20,opacity:0,duration:.35,ease:'power2.out'}) }}
function renderHist(){const ul=$('historialLista'); if(!ul) return; ul.innerHTML=historial.slice(0,12).map(h=>`<li>${h}</li>`).join('')||'<li>Sin jugadas</li>'}
function clearHistorial(){historial=[];save();renderHist()}
function msg(id,t,c){const e=$(id); if(!e) return; e.textContent=t; e.style.color=c; if(window.gsap) gsap.fromTo(e,{y:6,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'}) }
function setBet(id,v){const e=$(id); if(e) e.value=v; if(window.gsap) gsap.fromTo(e,{scale:1.08},{scale:1,duration:.25,ease:'power2.out'})}
function depositar(m){saldo+=m; jackpot+=Math.floor(m*0.02); save(); updateSaldo(); showToast(`+$${m.toLocaleString()} acreditado`); closeDeposit(); if(window.gsap){ gsap.fromTo('.saldo-box',{scale:1.2,backgroundColor:'rgba(201,168,76,.3)'},{scale:1,backgroundColor:'rgba(255,255,255,.06)',duration:.5,ease:'elastic.out(1,.4)'}) }}
function openAuth(){const m=$('modalAuth'); m.classList.remove('hidden'); if(window.gsap) gsap.fromTo(m.querySelector('.modal-box'),{y:30,scale:.9,opacity:0},{y:0,scale:1,opacity:1,duration:.4,ease:'back.out(1.4)'})}
function closeAuth(){if(window.gsap){ gsap.to('#modalAuth .modal-box',{y:20,scale:.95,opacity:0,duration:.2,onComplete:()=>$('modalAuth').classList.add('hidden')})} else $('modalAuth').classList.add('hidden')}
function doAuth(){const u=$('authUser').value.trim(); if(u.length<3) return msg('authMsg','Mín 3 letras','tomato'); usuario=u; localStorage.setItem('rs_user',u); save(); updateSaldo(); msg('authMsg','¡Bienvenido '+u+'!','#4ade80'); if(window.gsap) gsap.fromTo('#btnUser',{scale:1.3},{scale:1,duration:.4,ease:'back.out(1.7)'}); setTimeout(closeAuth,700)}
function openDeposit(){const m=$('modalDeposit'); m.classList.remove('hidden'); if(window.gsap) gsap.fromTo(m.querySelector('.modal-box'),{y:30,scale:.9,opacity:0},{y:0,scale:1,opacity:1,duration:.4,ease:'back.out(1.4)'})}
function closeDeposit(){if(window.gsap){ gsap.to('#modalDeposit .modal-box',{y:20,scale:.95,opacity:0,duration:.2,onComplete:()=>$('modalDeposit').classList.add('hidden')})} else $('modalDeposit').classList.add('hidden')}
function showToast(t){
 const el=$('toast'); if(!el) return; el.textContent=t;
 if(window.gsap){
  el.classList.add('show');
  gsap.fromTo(el,{x:120,opacity:0},{x:0,opacity:1,duration:.45,ease:'back.out(1.2)'});
  gsap.delayedCall(2, ()=> gsap.to(el,{x:120,opacity:0,duration:.35,ease:'power2.in',onComplete:()=>el.classList.remove('show')}))
 } else { el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200)}
}
function confettiBurst(){
 for(let i=0;i<22;i++){
  const d=document.createElement('div'); d.className='confetti'; d.style.left=Math.random()*100+'vw'; d.style.background=`hsl(${40+Math.random()*20},100%,50%)`; document.body.appendChild(d);
  if(window.gsap){
   gsap.fromTo(d,{y:-20,rotation:0,opacity:1},{y:window.innerHeight+40,rotation:720+Math.random()*360,opacity:0,duration:1.2+Math.random()*.6,delay:Math.random()*.2,ease:'power1.in',onComplete:()=>d.remove()})
  } else setTimeout(()=>d.remove(),1300)
 }
}
function initGSAP(){
 if(!window.gsap) return;
 gsap.from('header',{y:-60,opacity:0,duration:.6,ease:'power3.out'});
 gsap.from('.hero h1',{y:40,opacity:0,duration:.7,delay:.15,ease:'power3.out'});
 gsap.from('.hero p,.hero-btns',{y:20,opacity:0,duration:.6,delay:.3,stagger:.1,ease:'power2.out'});
 gsap.from('.stats div',{y:20,opacity:0,duration:.5,delay:.45,stagger:.1,ease:'back.out(1.2)'});
 gsap.from('.game-card',{y:30,opacity:0,duration:.6,delay:.6,stagger:.08,ease:'power3.out'});
 gsap.from('.game-panel',{y:30,opacity:0,duration:.6,stagger:.12,ease:'power2.out'});
}
document.addEventListener('DOMContentLoaded', initGSAP);
setInterval(()=>{jackpot+=Math.floor(Math.random()*6); const j=$('statJackpot'); if(j){ j.textContent='$'+jackpot.toLocaleString(); if(window.gsap) gsap.fromTo(j,{scale:1.08},{scale:1,duration:.3,ease:'power2.out'}) }},2600);
setInterval(()=>{const el=$('statJugadores'); if(el) el.textContent=(12847+Math.floor(Math.random()*24)).toLocaleString()},3200);

// ===== CANVAS PARTÍCULAS GLOBAL + GIFT =====
(function(){
 function ensureBg(){
  if(document.getElementById('bgCanvas')) return document.getElementById('bgCanvas');
  const c=document.createElement('canvas'); c.id='bgCanvas'; document.body.prepend(c); return c;
 }
 function initCanvas(){
  const canvas=ensureBg(); const ctx=canvas.getContext('2d'); let w,h, parts=[];
  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const count= window.innerWidth<640?28:48;
  for(let i=0;i<count;i++) parts.push({x:Math.random()*w, y:Math.random()*h, r:1+Math.random()*2.2, vx:(Math.random()-0.5)*0.3, vy:-0.2 - Math.random()*0.6, a:0.25+Math.random()*0.45, hue: 38+Math.random()*18});
  function tick(){
   ctx.clearRect(0,0,w,h);
   // glow radial
   parts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.y< -10){ p.y=h+10; p.x=Math.random()*w; }
    if(p.x<0||p.x>w) p.vx*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`hsla(${p.hue},95%,60%,${p.a})`;
    ctx.shadowColor=`hsla(${p.hue},95%,60%,.8)`; ctx.shadowBlur=8;
    ctx.fill(); ctx.shadowBlur=0;
    // line conection cercana
    parts.forEach(q=>{
     const dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
     if(d<110 && q!==p){ ctx.strokeStyle=`hsla(${p.hue},80%,60%,${0.07*(1-d/110)})`; ctx.lineWidth=0.7; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
    })
   });
   requestAnimationFrame(tick);
  }
  tick();
 }
 // gift flotante
 function ensureGift(){
  if(document.getElementById('giftFloat')) return;
  const g=document.createElement('div'); g.id='giftFloat'; g.className='gift-float';
  g.innerHTML='<span>🎁</span><span class="gift-count">x3</span>';
  g.title='Regalo sorpresa - click para abrir';
  g.onclick=()=>{
   if(window.gsap) gsap.fromTo(g,{scale:1},{scale:1.15,duration:.15,yoyo:true,repeat:1,ease:'power2.out'});
   const bonus=500+Math.floor(Math.random()*1500);
   saldo+=bonus; save(); updateSaldo(); showToast(`🎁 ¡Regalo! +$${bonus}`);
   confettiBurst();
   // anim +1 flotante
   const fly=document.createElement('div'); fly.textContent=`+$${bonus}`; fly.style.position='fixed'; fly.style.right='34px'; fly.style.bottom='90px'; fly.style.background='linear-gradient(90deg,#c9a84c,#f0d76a)'; fly.style.color='#000'; fly.style.padding='6px 10px'; fly.style.borderRadius='999px'; fly.style.fontWeight='900'; fly.style.zIndex='30'; document.body.appendChild(fly);
   if(window.gsap) gsap.fromTo(fly,{y:0,opacity:1},{y:-60,opacity:0,duration:1.1,ease:'power2.out',onComplete:()=>fly.remove()}); else setTimeout(()=>fly.remove(),1100);
   // baja contador
   const cnt=g.querySelector('.gift-count'); let n=parseInt(cnt.textContent.replace('x',''))-1; if(n<=0){ cnt.textContent='!'; setTimeout(()=>{ g.style.display='none'; },600); if(window.gsap) gsap.to(g,{scale:0,rotation:180,duration:.4,ease:'back.in(1.2)'})} else cnt.textContent='x'+n;
  };
  document.body.appendChild(g);
  if(window.gsap) gsap.from(g,{y:80,opacity:0,duration:.6,delay:1.2,ease:'back.out(1.2)'});
 }
 document.addEventListener('DOMContentLoaded', ()=>{ initCanvas(); ensureGift(); });
 // si ya cargó
 if(document.readyState!=='loading'){ initCanvas(); ensureGift(); }
})();
