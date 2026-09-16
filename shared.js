let saldo=parseInt(localStorage.getItem('rs_saldo')||'5000');
let usuario=localStorage.getItem('rs_user')||null;
let historial=JSON.parse(localStorage.getItem('rs_hist')||'[]');
let jackpot=parseInt(localStorage.getItem('rs_jackpot')||'48250');
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('rs_saldo',saldo);localStorage.setItem('rs_hist',JSON.stringify(historial.slice(0,60)));localStorage.setItem('rs_jackpot',jackpot)}
function updateSaldo(){
  const s=$('saldo'); if(s) s.textContent=saldo.toLocaleString();
  const t=$('topTu'); if(t) t.textContent=saldo.toLocaleString();
  const j=$('statJackpot'); if(j) j.textContent='$'+jackpot.toLocaleString();
  const lvl=$('userLevel'); if(lvl) lvl.textContent=saldo>20000?'VIP 💎':saldo>10000?'PRO ⭐':saldo>5000?'LVL 2':'LVL 1';
  const btn=$('btnUser'); if(btn) btn.textContent=usuario?usuario:'INGRESAR';
  if(saldo<=0){ saldo=1000; save(); showToast('Saldo agotado! Bono +$1000'); updateSaldo(); }
  renderHist();
}
function addHist(txt,win){historial.unshift(`${new Date().toLocaleTimeString()} — ${txt} ${win?'✅':''}`);save();renderHist()}
function renderHist(){const ul=$('historialLista'); if(!ul) return; ul.innerHTML=historial.slice(0,12).map(h=>`<li>${h}</li>`).join('')||'<li>Sin jugadas</li>'}
function clearHistorial(){historial=[];save();renderHist()}
function msg(id,t,c){const e=$(id); if(!e) return; e.textContent=t; e.style.color=c}
function setBet(id,v){const e=$(id); if(e) e.value=v}
function depositar(m){saldo+=m; jackpot+=Math.floor(m*0.02); save(); updateSaldo(); showToast(`+$${m.toLocaleString()} acreditado`); closeDeposit()}
function openAuth(){$('modalAuth').classList.remove('hidden')}
function closeAuth(){$('modalAuth').classList.add('hidden')}
function doAuth(){const u=$('authUser').value.trim(); if(u.length<3) return msg('authMsg','Mín 3 letras','tomato'); usuario=u; localStorage.setItem('rs_user',u); save(); updateSaldo(); msg('authMsg','¡Bienvenido '+u+'!','#4ade80'); setTimeout(closeAuth,700)}
function openDeposit(){$('modalDeposit').classList.remove('hidden')}
function closeDeposit(){$('modalDeposit').classList.add('hidden')}
function showToast(t){const el=$('toast'); if(!el) return; el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200)}
function confettiBurst(){for(let i=0;i<18;i++){const d=document.createElement('div'); d.className='confetti'; d.style.left=Math.random()*100+'vw'; d.style.background=`hsl(${40+Math.random()*20},100%,50%)`; d.style.animationDelay=Math.random()*.3+'s'; document.body.appendChild(d); setTimeout(()=>d.remove(),1300)}}
setInterval(()=>{jackpot+=Math.floor(Math.random()*6); const j=$('statJackpot'); if(j) j.textContent='$'+jackpot.toLocaleString(); const s=$('saldo'); if(s) s.textContent=saldo.toLocaleString();},2600);
setInterval(()=>{const el=$('statJugadores'); if(el) el.textContent=(12847+Math.floor(Math.random()*24)).toLocaleString()},3200);
