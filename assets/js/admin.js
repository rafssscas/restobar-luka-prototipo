
function $(id){ return document.getElementById(id); }

function showA(id){
  document.querySelectorAll('.section').forEach(s=> s.classList.remove('active'));
  $(id).classList.add('active');
  if(id==='a-dash'){ fillKpis(); }
  if(id==='a-menu'){ drawMenuTable(); fillCatSelect(); }
  if(id==='a-reports'){ drawComments(); }
  if(id==='a-sales'){ /* No action needed on show */ }
}

function login(){
  const pin = $('a-pin').value;
  if(pin==='1234'){
    $('a-err').classList.add('d-none');
    // redirigir a la versión por páginas separadas
    window.location.href = 'admin-dashboard.html';
  }else{
    $('a-err').classList.remove('d-none');
  }
}
function logout(){ showA('a-login'); }

// KPIs
function fillKpis(){
  $('kpi-res').textContent = MockDB.reservations.length;
  $('kpi-avg').textContent = MockAPI.avgRating();
  $('kpi-ops').textContent = MockDB.ratings.length;
  $('kpi-orders').textContent = MockDB.orders.filter(o=>o.status!=='delivered' && o.status!=='cancelled').length;
}

// MENU MGMT
function drawMenuTable(){
  const body = $('a-menu-body'); body.innerHTML='';
  MockDB.menu.forEach(cat=>{
    cat.items.forEach(item=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><div class="d-flex align-items-center gap-2">
          <img src="${item.img}" class="rounded" style="width:44px;height:44px;object-fit:cover"/>
          <div class="fw-semibold">${item.name}</div></div></td>
        <td><span class="badge text-bg-light">${cat.category}</span></td>
        <td class="fw-semibold">$${item.price}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})">Eliminar</button></td>`;
      body.appendChild(tr);
    });
  });
}
function fillCatSelect(){
  const sel=$('add-cat'); sel.innerHTML='';
  MockDB.menu.forEach(c=>{
    const opt=document.createElement('option'); opt.value=c.category; opt.textContent=c.category; sel.appendChild(opt);
  });
}
function addItem(){
  const c=$('add-cat').value, n=$('add-name').value.trim(), p=$('add-price').value, img=$('add-img').value.trim();
  if(!n||!p){ alert('Completá nombre y precio.'); return; }
  MockAPI.addMenuItem(c, n, p, img);
  drawMenuTable();
  alert('Plato agregado (prototipo, sin persistencia).');
}
function removeItem(id){
  MockAPI.removeMenuItem(id);
  drawMenuTable();
}

// REPORTS
function drawComments(){
  const cont = $('a-comments'); cont.innerHTML='';
  MockDB.ratings.slice(-10).reverse().forEach(r=>{
    const d = document.createElement('div'); d.className='border rounded p-2';
    d.innerHTML = `<div class="fw-bold text-warning">${'★'.repeat(r.stars)}<span class="text-secondary">${'★'.repeat(5-r.stars)}</span></div>
                   <div>${r.comment}</div>`;
    cont.appendChild(d);
  });
}
function downloadJSON(){
  const data = JSON.stringify(MockDB,null,2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'restobar-mockdb.json'; a.click();
  URL.revokeObjectURL(url);
}

// Sales Modal Logic
let mesaActual = null;
let confirmationModal, successModal;
document.addEventListener('DOMContentLoaded', () => {
  confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
  successModal = new bootstrap.Modal(document.getElementById('successModal'));
});

function mostrarModal(mesaNro, total) {
  mesaActual = mesaNro;
  $('modalMesa').textContent = `Mesa Nro. ${mesaNro}`;
  $('modalTotal').textContent = total;
  confirmationModal.show();
}
function cerrarModal() {
  confirmationModal.hide();
}
function confirmarVenta() {
  cerrarModal();
  const filas = document.querySelectorAll('#a-sales tbody tr');
  filas.forEach(fila => {
    const mesaTd = fila.querySelector('td:first-child');
    if (mesaTd && parseInt(mesaTd.textContent) === mesaActual) {
      fila.classList.add('d-none');
    }
  });
  successModal.show();
}
function cerrarSuccessModal() {
  successModal.hide();
}

/* Permitir Enter para iniciar sesión */
document.addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && document.getElementById('a-pin')){
    e.preventDefault();
    login();
  }
});
