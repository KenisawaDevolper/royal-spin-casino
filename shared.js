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
 // GSAP confetti
 for(let i=0;i<22;i++){
  const d=document.createElement('div'); d.className='confetti'; d.style.left=Math.random()*100+'vw'; d.style.background=`hsl(${40+Math.random()*20},100%,50%)`; document.body.appendChild(d);
  if(window.gsap){
   gsap.fromTo(d,{y:-20,rotation:0,opacity:1},{y:window.innerHeight+40,rotation:720+Math.random()*360,opacity:0,duration:1.2+Math.random()*.6,delay:Math.random()*.2,ease:'power1.in',onComplete:()=>d.remove()})
  } else setTimeout(()=>d.remove(),1300)
 }
}
// GSAP page intro
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
