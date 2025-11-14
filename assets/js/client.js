
function $id(x){ return document.getElementById(x); }
function showC(id){
  // map shortcuts
  const map = { 'menu':'c-menu', 'rating':'c-rating', 'suggest':'c-suggest', 'c-reserve':'c-reserve', 'ranking':'c-ranking' };
  const target = map[id] || id;
  document.querySelectorAll('.section').forEach(s=> s.classList.remove('active'));
  $id(target).classList.add('active');
  if(target==='c-menu' && !$id('c-tabs').children.length){ renderMenu(); }
  if(target==='c-rating'){ $id('avg').textContent = MockAPI.avgRating(); }
  if(target==='c-ranking'){ renderRanking(); }
}

// MENU
function renderMenu(){
  const tabs = $id('c-tabs'); const items = $id('c-items');
  tabs.innerHTML = ''; items.innerHTML = '';
  MockDB.menu.forEach((cat, idx)=>{
    const li = document.createElement('li'); li.className='nav-item';
    li.innerHTML = `<button class="nav-link ${idx===0?'active':''}" data-idx="${idx}">${cat.category}</button>`;
    tabs.appendChild(li);
  });
  tabs.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', e=>{
      tabs.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      drawItems( Number(btn.dataset.idx) );
    });
  });
  drawItems(0);
}

function drawItems(i){
  const items = $id('c-items'); items.innerHTML='';
  MockDB.menu[i].items.forEach(item=>{
    const row = document.createElement('div');
    row.className='d-flex gap-3 align-items-center p-2 bg-white rounded card-shadow border';
    row.innerHTML = `<img class="menu-img" src="${item.img}"/>
      <div class="flex-grow-1">
        <div class="fw-bold">${item.name}</div>
        <div class="text-muted small">${item.description}</div>
        <div class="text-primary fw-semibold">$${item.price}</div>
      </div>
      <button class="btn btn-outline-primary btn-sm">Agregar</button>`;
    items.appendChild(row);
  });
}

// RATING
function setStars(n){ $id('c-stars').value = n; }
function sendRating(){
  const n = Number($id('c-stars').value)||0;
  const c = $id('c-comment').value.trim();
  if(n<=0){ alert('Elegí una cantidad de estrellas (1 a 5)'); return; }
  const avg = MockAPI.addRating(n, c||'Sin comentario');
  $id('avg').textContent = avg;
  $id('c-comment').value=''; $id('c-stars').value='0';
  alert('¡Gracias por calificar!');
}

// SUGGESTIONS
function sendSuggestion(){
  const t = $id('s-type').value; const m = $id('s-msg').value.trim();
  if(!m){ alert('Escribí un mensaje.'); return; }
  MockAPI.addSuggestion(t, m);
  $id('s-msg').value='';
  alert('Mensaje enviado al administrador.');
}

// RESERVATIONS
function sendReservation(){
  const name=$id('r-name').value.trim();
  const phone=$id('r-phone').value.trim();
  const date=$id('r-date').value; const time=$id('r-time').value;
  const people=Number($id('r-people').value||1);
  if(!name||!date||!time||!phone){ alert('Completá todos los campos.'); return; }
  MockAPI.addReservation(name, phone, date, time, people);
  alert('¡Reserva confirmada! El personal se contactará para confirmar.');
}

// CALL WAITER
function callWaiter(){
  const table = 12; // harcoded por ser prototipo
  MockAPI.addWaiterCall(table);
  alert(`Llamado a la mesa ${table} realizado. ¡Un mozo se acercará en breve!`);
}

// RANKING
function renderRanking(){
  $id('avg2').textContent = MockAPI.avgRating();
  $id('count-op').textContent = MockDB.ratings.length;
  const cont = $id('c-opinions'); cont.innerHTML='';
  MockDB.ratings.slice(-10).reverse().forEach(r=>{
    const div = document.createElement('div'); div.className='card p-2';
    div.innerHTML = `<div class="fw-bold text-warning">${'★'.repeat(r.stars)}<span class="text-secondary">${'★'.repeat(5-r.stars)}</span></div>
                     <div>${r.comment}</div>`;
    cont.appendChild(div);
  });
}

// Default
showC('welcome');
