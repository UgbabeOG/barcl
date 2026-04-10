const transactions = [
  {icon:'🏦',merchant:'Dividend — Portfolio Holdings',dir:'in',date:'16 Jun 2026',cat:'income',status:'cleared',amount:48200},
  {icon:'✈️',merchant:'British Airways',dir:'out',date:'14 Jun 2026',cat:'travel',status:'cleared',amount:-4280},
  {icon:'🛒',merchant:'Harrods Food Hall',dir:'out',date:'13 Jun 2026',cat:'shopping',status:'cleared',amount:-847.50},
  {icon:'🍽️',merchant:'The Fat Duck, Bray',dir:'out',date:'12 Jun 2026',cat:'dining',status:'cleared',amount:-1240},
  {icon:'🏥',merchant:'BUPA Private Healthcare',dir:'out',date:'11 Jun 2026',cat:'health',status:'cleared',amount:-680},
  {icon:'🏠',merchant:'Henshall Properties Ltd',dir:'in',date:'10 Jun 2026',cat:'income',status:'cleared',amount:22000},
  {icon:'🛒',merchant:'Selfridges',dir:'out',date:'9 Jun 2026',cat:'shopping',status:'cleared',amount:-3290},
  {icon:'🍽️',merchant:'Nobu London',dir:'out',date:'8 Jun 2026',cat:'dining',status:'cleared',amount:-520},
  {icon:'⚡',merchant:'British Gas',dir:'out',date:'7 Jun 2026',cat:'utility',status:'cleared',amount:-214.80},
  {icon:'📱',merchant:'EE Mobile',dir:'out',date:'6 Jun 2026',cat:'utility',status:'cleared',amount:-89.99},
  {icon:'🛒',merchant:'Harvey Nichols',dir:'out',date:'5 Jun 2026',cat:'shopping',status:'cleared',amount:-1750},
  {icon:'✈️',merchant:'Eurostar',dir:'out',date:'4 Jun 2026',cat:'travel',status:'cleared',amount:-420},
  {icon:'🏦',merchant:'Barclays Smart Investor',dir:'in',date:'3 Jun 2026',cat:'invest',status:'cleared',amount:5240},
  {icon:'🍽️',merchant:'Rules Restaurant',dir:'out',date:'2 Jun 2026',cat:'dining',status:'cleared',amount:-380},
  {icon:'🚗',merchant:'Porsche Centre Edinburgh',dir:'out',date:'1 Jun 2026',cat:'shopping',status:'cleared',amount:-8400},
  {icon:'⚡',merchant:'Scottish Power',dir:'out',date:'31 May 2026',cat:'utility',status:'cleared',amount:-312},
  {icon:'🏥',merchant:'The London Clinic',dir:'out',date:'30 May 2026',cat:'health',status:'cleared',amount:-1200},
  {icon:'🛒',merchant:'Fortnum & Mason',dir:'out',date:'29 May 2026',cat:'shopping',status:'cleared',amount:-640},
  {icon:'✈️',merchant:'Qatar Airways',dir:'out',date:'28 May 2026',cat:'travel',status:'pending',amount:-7890},
  {icon:'🏦',merchant:'Rental Income — Mayfair',dir:'in',date:'28 May 2026',cat:'income',status:'cleared',amount:18500},
  {icon:'🍽️',merchant:'Sketch London',dir:'out',date:'27 May 2026',cat:'dining',status:'cleared',amount:-890},
  {icon:'📱',merchant:'Sky Broadband & TV',dir:'out',date:'26 May 2026',cat:'utility',status:'cleared',amount:-185},
  {icon:'🛒',merchant:'Net-a-Porter',dir:'out',date:'25 May 2026',cat:'shopping',status:'pending',amount:-2450},
  {icon:'🏦',merchant:'Consultancy Fee',dir:'in',date:'24 May 2026',cat:'income',status:'cleared',amount:15000},
  {icon:'🍽️',merchant:'Hawksmoor',dir:'out',date:'23 May 2026',cat:'dining',status:'cleared',amount:-310},
];

let currentFilter = 'all';
let currentSearch = '';
let loginStep = 1;

function fmt(n){
  const abs = Math.abs(n);
  return (n<0?'−':'+')+' £'+abs.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function fmtAbs(n){
  return '£'+Math.abs(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function renderMiniTxns(){
  const list=document.getElementById('miniTxnList');
  if(!list) return;
  const items=transactions.slice(0,6);
  list.innerHTML=items.map(t=>`
    <div class="txn-mini-item">
      <div class="txn-icon ${t.dir}">${t.icon}</div>
      <div class="txn-detail">
        <div class="txn-merchant">${t.merchant}</div>
        <div class="txn-date-cat">${t.date} · ${t.cat}</div>
      </div>
      <div class="txn-amount ${t.dir}">${fmt(t.amount)}</div>
    </div>
  `).join('');
}

function renderSpend(){
  const barContainer=document.getElementById('spendBars');
  if(!barContainer) return;
  const cats=[
    {label:'Shopping',val:17377,max:20000,cls:'fill-1'},
    {label:'Travel',val:12590,max:20000,cls:'fill-2'},
    {label:'Dining',val:3340,max:20000,cls:'fill-3'},
    {label:'Health',val:1880,max:20000,cls:'fill-4'},
    {label:'Utilities',val:801,max:20000,cls:'fill-5'},
  ];
  barContainer.innerHTML=cats.map(c=>`
    <div class="spend-item">
      <div class="spend-row">
        <span class="spend-cat">${c.label}</span>
        <span class="spend-val">£${c.val.toLocaleString()}</span>
      </div>
      <div class="spend-bar-bg"><div class="spend-bar-fill ${c.cls}" style="width:${Math.round(c.val/c.max*100)}%"></div></div>
    </div>
  `).join('');
}

function renderTxns(){
  let data=[...transactions];
  if(currentFilter==='in') data=data.filter(t=>t.dir==='in');
  if(currentFilter==='out') data=data.filter(t=>t.dir==='out');
  if(currentFilter==='pending') data=data.filter(t=>t.status==='pending');
  if(currentSearch) data=data.filter(t=>t.merchant.toLowerCase().includes(currentSearch.toLowerCase()));
  const list=document.getElementById('txnList');
  if(!list) return;
  if(!data.length){
    list.innerHTML='<div style="padding:2rem;text-align:center;color:var(--gray-400)">No transactions found</div>';
    return;
  }
  list.innerHTML=data.map(t=>`
    <div class="txn-row">
      <div class="txn-merchant-info">
        <div class="txn-icon-sm ${t.dir}">${t.icon}</div>
        <div><div class="txn-m-name">${t.merchant}</div><div class="txn-m-cat">${t.date}</div></div>
      </div>
      <div class="txn-date-cell">${t.date}</div>
      <div class="txn-cat-cell"><span class="txn-cat-pill ${t.cat}">${t.cat}</span></div>
      <div class="txn-status-cell"><span class="status-pill ${t.status}">${t.status}</span></div>
      <div class="txn-amount-cell" style="color:${t.dir==='in'?'var(--green)':'var(--red)'}">${fmt(t.amount)}</div>
    </div>
  `).join('');
}

function filterTxns(q){currentSearch=q;renderTxns();}
function setFilter(f,el){
  currentFilter=f;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  if(el) el.classList.add('active');
  renderTxns();
}

function showPanel(id,btn){
  document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('panel-'+id);
  if(panel) panel.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function doLogin(){
  const surname=document.getElementById('loginSurname').value.trim().toLowerCase();
  const pass=document.getElementById('loginPass').value.trim();
  const otp=document.getElementById('loginOTP').value.trim();
  const err=document.getElementById('loginError');
  const btn=document.querySelector('.login-btn');
  if(loginStep === 1){
    if(surname==='henshall' && pass.length>=4){
      err.classList.remove('show');
      document.querySelectorAll('.form-field:not(.otp-field)').forEach(f => f.style.display = 'none');
      document.getElementById('otpField').style.display = 'block';
      btn.textContent = 'Verify OTP';
      loginStep = 2;
    } else {
      err.classList.add('show');
    }
  } else if(loginStep === 2){
    if(otp === '123456'){
      err.classList.remove('show');
      window.location.href='dashboard.html';
    } else {
      err.textContent = 'Invalid OTP. Please try again.';
      err.classList.add('show');
    }
  }
}

function doTransfer(){
  const name=document.getElementById('tf_name').value.trim();
  const sort=document.getElementById('tf_sort').value.trim();
  const acc=document.getElementById('tf_acc').value.trim();
  const amount=parseFloat(document.getElementById('tf_amount').value);
  const ref=document.getElementById('tf_ref').value.trim();
  if(!name||!sort||!acc||!amount||amount<=0){
    alert('Please fill in all required fields.');
    return;
  }
  const refNo='BRC-'+Math.floor(Math.random()*900000+100000);
  document.getElementById('transferForm').style.display='none';
  const suc=document.getElementById('transferSuccess');
  if(!suc) return;
  document.getElementById('transferSuccessMsg').textContent=
    `£${amount.toLocaleString('en-GB',{minimumFractionDigits:2})} sent to ${name}.`;
  document.getElementById('transferRef').textContent='Ref: '+refNo;
  suc.classList.add('show');
}

function resetTransfer(){
  const form=document.getElementById('transferForm');
  const suc=document.getElementById('transferSuccess');
  if(form) form.style.display='block';
  if(suc) suc.classList.remove('show');
  ['tf_name','tf_sort','tf_acc','tf_amount','tf_ref'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.value='';
  });
}

function initDashboard(){
  renderMiniTxns();
  renderSpend();
  renderTxns();
  const todayDate=document.getElementById('todayDate');
  if(todayDate){
    todayDate.textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('panel-overview')){
    initDashboard();
  }
});

document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && document.getElementById('loginError')){
    doLogin();
  }
});
