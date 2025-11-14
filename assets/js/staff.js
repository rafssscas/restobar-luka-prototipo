
function $$(x){ return document.getElementById(x); }

function renderOrders(){
  const cols = { pending: $$('col-pending'), preparing: $$('col-preparing'), ready: $$('col-ready') };
  Object.values(cols).forEach(c=> c.innerHTML='');
  MockDB.orders.forEach(o=>{
    const card = document.createElement('div'); card.className='border rounded p-2';
    card.innerHTML = `<div class="d-flex justify-content-between">
        <div class="fw-bold">Mesa ${o.table}</div>
        <div class="text-muted">${o.time}</div></div>
      <div>${o.items}</div>
      <div class="mt-2 d-flex gap-2">
        ${o.status==='pending'?'<button class="btn btn-sm btn-warning" onclick="upd('+o.id+',\'preparing\')">Preparar</button>':''}
        ${o.status==='preparing'?'<button class="btn btn-sm btn-success" onclick="upd('+o.id+',\'ready\')">¡Listo!</button>':''}
        ${o.status!=='ready'?'<button class="btn btn-sm btn-outline-secondary" onclick="upd('+o.id+',\'cancelled\')">Cancelar</button>':''}
        ${o.status==='ready'?'<button class="btn btn-sm btn-secondary" onclick="upd('+o.id+',\'delivered\')">Entregado</button>':''}
      </div>`;
    if(cols[o.status]) cols[o.status].appendChild(card);
  });
}
function upd(id, st){
  MockAPI.updateOrder(id,st);
  renderOrders();
  if(st==='ready'){
    const order = MockDB.orders.find(o=>o.id===id);
    showNotif(`✅ Pedido listo para Mesa ${order.table}`, 'success');
  }
}

function renderCalls(){
  const body = $$('s-calls-body'); body.innerHTML='';
  MockDB.waiterCalls.forEach(c=>{
    const card = document.createElement('div'); card.className='border rounded p-2 d-flex justify-content-between align-items-center';
    card.innerHTML = `<div class="fw-bold">Mesa ${c.table}</div>
      <div class="text-muted">${c.time}</div>
      <button class="btn btn-sm btn-success">Atendido</button>`;
    body.appendChild(card);
  });
}

function renderStock(){
  const tbody = $$('stock-body'); tbody.innerHTML='';
  MockDB.stock.forEach(i=>{
    const low = i.qty < i.min;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="fw-semibold">${i.name}</td>
      <td class="${low?'text-danger fw-bold':''}">${i.qty}</td>
      <td class="text-muted">${i.min}</td>
      <td>${low?'<span class="badge text-bg-danger">BAJO</span>':'<span class="badge text-bg-success">OK</span>'}</td>`;
    tbody.appendChild(tr);
  });
}

function renderChat(){
  const area = $$('chat-area'); area.innerHTML='';
  MockDB.chat.forEach(m=>{
    const div = document.createElement('div');
    const right = /Cocina/.test(m.user); // solo como ejemplo para alternar
    div.className = `my-1 ${right?'text-end':''}`;
    div.innerHTML = `<div class="chat-bubble ${right?'chat-right':'chat-left'}">
      <strong>${m.user}:</strong> ${m.msg} <small class="opacity-75">${m.time}</small>
    </div>`;
    area.appendChild(div);
  });
  area.scrollTop = area.scrollHeight;
}

function sendChat(){
  const inp = $$('chat-input'); const txt = inp.value.trim(); if(!txt) return;
  const now = new Date(); const hh = now.getHours().toString().padStart(2,'0'); const mm = now.getMinutes().toString().padStart(2,'0');
  MockDB.chat.push({ user:'Mozo', msg:txt, time:`${hh}:${mm}` });
  inp.value=''; renderChat();
}

function showNotif(msg, theme='info'){
  const cont = $$('s-notifications');
  const notif = document.createElement('div');
  notif.className = `alert alert-${theme} alert-dismissible fade show`;
  notif.innerHTML = `${msg} <button class="btn-close" data-bs-dismiss="alert"></button>`;
  cont.appendChild(notif);
}

// init
renderOrders(); renderCalls(); renderStock(); renderChat();

// Notificaciones al iniciar
if(MockDB.reservations.length > 0){
  showNotif(`🔔 Hay ${MockDB.reservations.length} reserva(s) pendiente(s) de confirmación.`);
}
const pendingCount = MockDB.orders.filter(o=>o.status==='pending').length;
if(pendingCount > 0){
  showNotif(`🍽️ Hay ${pendingCount} pedidos pendientes.`, 'danger');
}
