// ===== ESTADO GLOBAL =====
let saldo = parseInt(localStorage.getItem('rs_saldo') || '5000');
let usuario = localStorage.getItem('rs_user') || null;
let historial = JSON.parse(localStorage.getItem('rs_hist') || '[]');
let jackpot = parseInt(localStorage.getItem('rs_jackpot') || '48250');
const $ = id => document.getElementById(id);
function save(){ localStorage.setItem('rs_saldo', saldo); localStorage.setItem('rs_hist', JSON.stringify(historial.slice(0,50))); localStorage.setItem('rs_jackpot', jackpot); }
function updateSaldo(){
  $('saldo').textContent = saldo.toLocaleString();
  $('topTu').textContent = saldo.toLocaleString();
  let lvl = saldo>20000?'VIP 💎': saldo>10000?'PRO ⭐': saldo>5000?'LVL 2':'LVL 1';
  $('userLevel').textContent = lvl;
  if(saldo<=0){ alert('Saldo agotado! +$1000 de bono'); saldo=1000; save(); updateSaldo(); }
  $('btnUser').textContent = usuario ? usuario : 'INGRESAR';
  $('jackpot').textContent = jackpot.toLocaleString();
  renderHist();
}
function addHist(txt, win){
  historial.unshift(`${new Date().toLocaleTimeString()} - ${txt} ${win? '✅':''}`);
  save(); renderHist();
}
function renderHist(){
  const ul=$('historialLista'); if(!ul) return;
  ul.innerHTML = historial.slice(0,12).map(h=>`<li>${h}</li>`).join('') || '<li>Sin jugadas aún</li>';
}
function clearHistorial(){ historial=[]; save(); renderHist(); }
function msg(id,t,c){ const e=$(id); if(!e) return; e.textContent=t; e.style.color=c; }
function setBet(id,v){ $(id).value=v; }
function scrollToGame(id){ document.getElementById(id).scrollIntoView({behavior:'smooth', block:'start'}); }
function depositar(m){ saldo+=m; jackpot+=Math.floor(m*0.02); save(); updateSaldo(); msg('msgSlots',`+ $${m} acreditado (demo)`, '#4ade80'); closeDeposit(); }

// Auth
function openAuth(){ $('modalAuth').classList.remove('hidden'); }
function closeAuth(){ $('modalAuth').classList.add('hidden'); }
function doAuth(){
  const u=$('authUser').value.trim(), p=$('authPass').value.trim();
  if(u.length<3) return msg('authMsg','Usuario mínimo 3 letras','tomato');
  usuario=u; localStorage.setItem('rs_user', u); save(); updateSaldo(); msg('authMsg','¡Bienvenido '+u+'!',' #4ade80');
  setTimeout(closeAuth,800);
}
function openDeposit(){ $('modalDeposit').classList.remove('hidden'); }
function closeDeposit(){ $('modalDeposit').classList.add('hidden'); }

// ===== SLOTS 5 rodillos =====
const simbolos=['🍒','🍋','🔔','⭐','💎','7️⃣','🍀'];
const peso={'🍒':1,'🍋':1,'🔔':1,'⭐':1,'🍀':1,'💎':0.3,'7️⃣':0.3};
function randSim(){
  // ponderado simple
  const r=Math.random();
  if(r<0.04) return '💎';
  if(r<0.08) return '7️⃣';
  return simbolos[Math.floor(Math.random()*5)];
}
function jugarSlots(){
  const ap=parseInt($('apuestaSlots').value);
  if(ap>saldo) return msg('msgSlots','Saldo insuficiente','tomato');
  if(ap<10) return msg('msgSlots','Mínimo $10','tomato');
  saldo-=ap; jackpot+=Math.floor(ap*0.05);
  const r=[randSim(),randSim(),randSim(),randSim(),randSim()];
  ['s1','s2','s3','s4','s5'].forEach((id,i)=> $(id).textContent=r[i]);
  // animación
  $('slotsDisplay').style.transform='scale(1.03)'; setTimeout(()=>$('slotsDisplay').style.transform='',150);
  let premio=0, txt='';
  const counts={}; r.forEach(s=>counts[s]=(counts[s]||0)+1);
  const max = Math.max(...Object.values(counts));
  const simMax = Object.keys(counts).find(k=>counts[k]===max);
  if(max===5){ premio = simMax==='💎'? jackpot : ap*50; if(simMax==='💎'){ jackpot=20000; txt=`JACKPOT!!! `} }
  else if(max===4) premio=ap*10;
  else if(max===3) premio=ap*5;
  else if(max===2) premio=Math.floor(ap*0.5);
  if(premio>0){
    if(max===5 && simMax==='💎') saldo+=premio; else saldo+=premio;
    msg('msgSlots',`${txt}¡GANASTE $${premio.toLocaleString()}! [${r.join('')}]`,'#4ade80');
    addHist(`Slots ${r.join('')} +$${premio}`, true);
  } else {
    msg('msgSlots',`Perdiste [${r.join('')}]`, 'tomato');
    addHist(`Slots ${r.join('')} -$${ap}`, false);
  }
  save(); updateSaldo();
}

// ===== RULETA =====
let histRuleta=[];
function jugarRuleta(){
  const ap=parseInt($('apuestaRuletaValor').value);
  const ele=$('apuestaRuleta').value;
  if(ap>saldo) return msg('msgRuleta','Saldo insuficiente','tomato');
  saldo-=ap; save(); updateSaldo();
  const num=Math.floor(Math.random()*37);
  let color=num===0?'verde': num%2===0?'negro':'rojo';
  let parImpar = num===0? 'verde' : num%2===0?'par':'impar';
  const win = (ele===color) || (ele===parImpar);
  const w=$('ruletaWheel');
  w.style.transform=`rotate(${720+num*13}deg)`;
  w.textContent=`${num} ${color==='rojo'?'🔴':color==='negro'?'⚫':'🟢'}`;
  w.style.color = color==='rojo'?'#ef4444': color==='negro'?'#fff':'#22c55e';
  let premio=0;
  if(win) premio = ele==='verde'? ap*14 : ap*2;
  histRuleta.unshift(num); if(histRuleta.length>10) histRuleta.pop();
  $('historialRuleta').textContent='Últimos: '+histRuleta.join(' - ');
  if(premio>0){ saldo+=premio; msg('msgRuleta',`Salió ${num} ${color} ¡GANASTE $${premio}!`,'#4ade80'); addHist(`Ruleta ${num} ${color} +$${premio}`, true); }
  else { msg('msgRuleta',`Salió ${num} ${color}. Perdiste -$${ap}`,'tomato'); addHist(`Ruleta ${num} ${color} -$${ap}`, false); }
  save(); updateSaldo();
}

// ===== BLACKJACK =====
let player=[], dealer=[], jugando=false, apuestaBJ=0, doblado=false;
function valor(c){ if(['J','Q','K'].includes(c)) return 10; if(c==='A') return 11; return parseInt(c); }
function puntos(m){ let p=m.reduce((a,c)=>a+valor(c),0); let ac=m.filter(c=>c==='A').length; while(p>21 && ac>0){p-=10; ac--} return p; }
function carta(){ return ['A','2','3','4','5','6','7','8','9','10','J','Q','K'][Math.floor(Math.random()*13)]; }
function iniciarBJ(){
  const ap=parseInt($('apuestaBJ').value);
  if(ap>saldo) return msg('msgBJ','Saldo insuficiente','tomato');
  apuestaBJ=ap; doblado=false; player=[carta(),carta()]; dealer=[carta(),carta()]; jugando=true; updBJ();
  if(puntos(player)===21) setTimeout(()=>finalizarBJ(),400);
  else msg('msgBJ','Pide, plántate o dobla','white');
}
function pedirCarta(){ if(!jugando) return; player.push(carta()); updBJ(); if(puntos(player)>21) finalizarBJ(); }
function plantarse(){ if(!jugando) return; while(puntos(dealer)<17) dealer.push(carta()); finalizarBJ(); }
function doblar(){
  if(!jugando || player.length!==2) return msg('msgBJ','Solo puedes doblar al inicio','tomato');
  if(saldo < apuestaBJ) return msg('msgBJ','Saldo insuficiente para doblar','tomato');
  doblado=true; apuestaBJ*=2; player.push(carta()); updBJ();
  if(puntos(player)<=21) { while(puntos(dealer)<17) dealer.push(carta()); }
  finalizarBJ();
}
function updBJ(){
  $('jugadorCartas').textContent=player.join(' ');
  $('jugadorPuntos').textContent=puntos(player);
  if(jugando){ $('dealerCartas').textContent=dealer[0]+' 🂠'; $('dealerPuntos').textContent='?'; }
  else { $('dealerCartas').textContent=dealer.join(' '); $('dealerPuntos').textContent=puntos(dealer); }
}
function finalizarBJ(){
  jugando=false; updBJ();
  const pp=puntos(player), pd=puntos(dealer);
  let res='', win=false;
  if(pp>21){ saldo-=apuestaBJ; res=`Te pasaste (${pp}). Perdiste -$${apuestaBJ}`; }
  else if(pd>21 || pp>pd){ saldo+=apuestaBJ; res=`¡Ganaste +$${apuestaBJ}! (${pp} vs ${pd})`; win=true; }
  else if(pp===pd) res=`Empate (${pp})`;
  else { saldo-=apuestaBJ; res=`Perdiste -$${apuestaBJ} (${pp} vs ${pd})`; }
  msg('msgBJ',res, win?'#4ade80':'tomato');
  addHist(`Blackjack ${pp} vs ${pd} ${win?'+$'+apuestaBJ:'-$'+apuestaBJ}`, win);
  save(); updateSaldo();
}

// ===== CRASH =====
let crashActivo=false, crashMult=1, crashTimer=null, crashApuesta=0, crashExploded=false;
function toggleCrash(){
  if(crashActivo) return;
  const ap=parseInt($('apuestaCrash').value);
  if(ap>saldo) return msg('msgCrash','Saldo insuficiente','tomato');
  crashApuesta=ap; saldo-=ap; save(); updateSaldo();
  crashActivo=true; crashExploded=false; crashMult=1;
  $('btnCrash').disabled=true; $('btnRetirarCrash').disabled=false;
  $('crashMult').style.color='#c9a84c';
  msg('msgCrash','¡En juego! Retira antes que explote','white');
  const crashPoint = (Math.random()*6 + 1.1); // 1.1x a 7x, random
  // con 15% chance crash instant <1.5
  const finalCrash = Math.random()<0.15 ? (1.05 + Math.random()*0.4) : crashPoint;
  crashTimer = setInterval(()=>{
    crashMult += 0.04 + crashMult*0.015;
    $('crashMult').textContent=crashMult.toFixed(2)+'x';
    $('crashGraph').style.width=Math.min(100, (crashMult/8)*100)+'%';
    $('crashGraph').style.background= crashMult>3 ? '#22c55e' : '#c9a84c';
    if(crashMult >= finalCrash){
      clearInterval(crashTimer); crashActivo=false; crashExploded=true;
      $('crashMult').textContent='💥 '+crashMult.toFixed(2)+'x';
      $('crashMult').style.color='tomato';
      $('btnCrash').disabled=false; $('btnRetirarCrash').disabled=true;
      msg('msgCrash',`¡CRASH en ${crashMult.toFixed(2)}x! Perdiste -$${crashApuesta}`,'tomato');
      addHist(`Crash 💥 ${crashMult.toFixed(2)}x -$${crashApuesta}`, false);
      save(); updateSaldo();
    }
  }, 80);
}
function retirarCrash(){
  if(!crashActivo || crashExploded) return;
  clearInterval(crashTimer); crashActivo=false;
  const premio=Math.floor(crashApuesta * crashMult);
  saldo+=premio;
  $('btnCrash').disabled=false; $('btnRetirarCrash').disabled=true;
  msg('msgCrash',`Retiraste en ${crashMult.toFixed(2)}x ¡Ganaste $${premio}!`,'#4ade80');
  addHist(`Crash ${crashMult.toFixed(2)}x +$${premio}`, true);
  save(); updateSaldo();
}

// ===== MINES =====
let mines=[], minesReveladas=0, minesActiva=false, minesApuesta=0, minesMult=1;
function iniciarMines(){
  const ap=parseInt($('apuestaMines').value); const nMinas=parseInt($('minasCount').value);
  if(ap>saldo) return msg('msgMines','Saldo insuficiente','tomato');
  minesApuesta=ap; minesActiva=true; minesReveladas=0; minesMult=1;
  // generar 25 celdas, nMinas bombas
  mines = Array(25).fill(0).map(()=>0);
  let colocadas=0; while(colocadas<nMinas){ const i=Math.floor(Math.random()*25); if(mines[i]===0){ mines[i]=1; colocadas++; } }
  renderMines(); updateMinesBtn(); msg('msgMines','Juego iniciado. Evita las 💣','white');
}
function renderMines(){
  const g=$('minesGrid'); g.innerHTML='';
  mines.forEach((isBomb,i)=>{
    const b=document.createElement('button');
    b.id='mine-'+i; b.textContent='?';
    b.onclick=()=>clickMine(i);
    g.appendChild(b);
  });
}
function clickMine(i){
  if(!minesActiva) return;
  const btn=$('mine-'+i);
  if(btn.classList.contains('revealed')) return;
  btn.classList.add('revealed');
  if(mines[i]===1){
    btn.textContent='💣'; btn.classList.add('bomb');
    // revelar todas
    mines.forEach((v,idx)=>{ const bb=$('mine-'+idx); if(v===1){ bb.textContent='💣'; bb.classList.add('bomb'); } else if(!bb.classList.contains('revealed')){ bb.textContent='💎'; } });
    saldo-=minesApuesta; minesActiva=false;
    msg('msgMines',`¡BOMBA! Perdiste -$${minesApuesta}`,'tomato');
    addHist(`Mines 💣 -$${minesApuesta}`, false);
    save(); updateSaldo(); updateMinesBtn();
  } else {
    btn.textContent='💎'; btn.style.background='#0a3d1a';
    minesReveladas++;
    minesMult = 1 + minesReveladas * (0.25 + parseInt($('minasCount').value)*0.04);
    updateMinesBtn();
  }
}
function updateMinesBtn(){
  const premio = minesActiva && minesReveladas>0 ? Math.floor(minesApuesta * minesMult) : 0;
  $('btnRetirarMines').textContent = minesActiva && minesReveladas>0 ? `RETIRAR $${premio} (${minesMult.toFixed(2)}x)` : 'RETIRAR $0';
}
function retirarMines(){
  if(!minesActiva || minesReveladas===0) return msg('msgMines','Revela al menos 1 💎','tomato');
  const premio=Math.floor(minesApuesta * minesMult);
  saldo+=premio; minesActiva=false;
  msg('msgMines',`Retiraste $${premio} con ${minesReveladas} diamantes!`,'#4ade80');
  addHist(`Mines ${minesReveladas}💎 +$${premio}`, true);
  save(); updateSaldo(); updateMinesBtn();
}

// ===== DADOS =====
function jugarDados(){
  const ap=parseInt($('apuestaDados').value); const modo=$('dadosModo').value;
  if(ap>saldo) return msg('msgDados','Saldo insuficiente','tomato');
  saldo-=ap; save(); updateSaldo();
  const d1=Math.floor(Math.random()*6)+1, d2=Math.floor(Math.random()*6)+1;
  const suma=d1+d2; // 2-12, convertimos a 0-100 scale: suma*8 aprox
  const roll = Math.floor(Math.random()*100)+1;
  $('dadosDisplay').textContent=`🎲 ${d1} + ${d2} = ${suma} | Roll: ${roll}`;
  let win=false, premio=0;
  if(modo==='mayor50') win=roll>50;
  if(modo==='mayor70') win=roll>70;
  if(modo==='exacto') win=d1===d2;
  if(win){
    premio = modo==='mayor70'? ap*3 : modo==='exacto'? ap*5 : ap*2;
    saldo+=premio; msg('msgDados',`¡GANASTE $${premio}! Roll ${roll}`,'#4ade80'); addHist(`Dados ${roll} +$${premio}`, true);
  } else {
    msg('msgDados',`Perdiste. Roll ${roll} -$${ap}`,'tomato'); addHist(`Dados ${roll} -$${ap}`, false);
  }
  save(); updateSaldo();
}

// INIT
updateSaldo();
renderMines();
setInterval(()=>{ if(!crashActivo) $('crashMult').textContent='1.00x'; }, 1000);
// animar jackpot
setInterval(()=>{ jackpot+=Math.floor(Math.random()*8); $('jackpot').textContent=jackpot.toLocaleString(); }, 2500);
// stats anim
setInterval(()=>{ const el=$('statJugadores'); if(el) el.textContent=(12483+Math.floor(Math.random()*20)).toLocaleString(); }, 3000);
