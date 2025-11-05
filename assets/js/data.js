
/* Datos mockeados para todo el prototipo (no hay persistencia real) */
window.MockDB = {
  menu: [
    { category: "Entradas", items: [
      { id:1, name:"Empanadas Salteñas (x2)", price:1200, img:"https://placehold.co/600x400/f59e0b/333?text=Empanadas" },
      { id:2, name:"Provoleta Ahumada", price:3500, img:"https://placehold.co/600x400/facc15/333?text=Provoleta" },
      { id:3, name:"Rabas Crocantes", price:5900, img:"https://placehold.co/600x400/eab308/333?text=Rabas" }
    ]},
    { category: "Platos Principales", items: [
      { id:4, name:"Lomo Saltado", price:8900, img:"https://placehold.co/600x400/8b5cf6/fff?text=Lomo" },
      { id:5, name:"Milanesa Napolitana c/Fritas", price:8200, img:"https://placehold.co/600x400/c026d3/fff?text=Milanesa" },
      { id:6, name:"Risotto de Hongos", price:7800, img:"https://placehold.co/600x400/db2777/fff?text=Risotto" },
      { id:7, name:"Salmón con Vegetales", price:10500, img:"https://placehold.co/600x400/e11d48/fff?text=Salmon" }
    ]},
    { category: "Bebidas", items: [
      { id:8, name:"Agua s/ Gas", price:1200, img:"https://placehold.co/600x400/3b82f6/fff?text=Agua" },
      { id:9, name:"Gaseosa (Coca-Cola)", price:1500, img:"https://placehold.co/600x400/ef4444/fff?text=Gaseosa" },
      { id:10, name:"Copa Vino Malbec", price:2800, img:"https://placehold.co/600x400/7e22ce/fff?text=Vino" },
      { id:11, name:"Cerveza IPA", price:2300, img:"https://placehold.co/600x400/f59e0b/fff?text=Cerveza" }
    ]},
    { category: "Postres", items: [
      { id:12, name:"Tiramisú", price:3600, img:"https://placehold.co/600x400/78350f/fff?text=Tiramisu" },
      { id:13, name:"Flan con Dulce", price:3200, img:"https://placehold.co/600x400/fbbf24/333?text=Flan" }
    ]}
  ],
  ratings: [
    { stars:5, comment:"Atención de 10 y platos abundantes."},
    { stars:4, comment:"Muy rico todo. Un poco de demora en hora pico."},
    { stars:5, comment:"Las rabas, un golazo. Volveré!"},
    { stars:3, comment:"Precio/calidad ok, mejoraría el postre."}
  ],
  suggestions: [
    { type:"sugerencia", message:"Sumar menú vegetariano." },
    { type:"queja", message:"La música estaba fuerte el viernes." }
  ],
  reservations: [
    { name:"Ana", date:"2025-11-06", time:"21:00", people:4 }
  ],
  orders: [
    { id:101, table:5, items:"Lomo Saltado", time:"19:32", status:"pending" },
    { id:102, table:2, items:"Cerveza IPA (x2)", time:"19:34", status:"pending" },
    { id:103, table:8, items:"Agua s/ Gas", time:"19:35", status:"preparing" },
    { id:104, table:5, items:"Flan Casero", time:"19:36", status:"preparing" },
    { id:105, table:1, items:"Milanesa Napolitana", time:"19:20", status:"ready" }
  ],
  stock: [
    { name:"Harina (kg)", qty:20, min:10 },
    { name:"Tomate (kg)", qty:5, min:8 },
    { name:"Queso Muzzarella (kg)", qty:15, min:10 },
    { name:"Salmón (un)", qty:8, min:5 },
    { name:"Papas (kg)", qty:50, min:20 },
    { name:"Cerveza IPA (barril)", qty:1, min:2 },
    { name:"Lomo (kg)", qty:3, min:5 }
  ],
  chat: [
    { user:"Cocina", msg:"¡Salió el Lomo de la Mesa 5!", time:"19:40" },
    { user:"Mozo (Ana)", msg:"Recibido. Voy a buscar.", time:"19:41" },
    { user:"Barra", msg:"Necesito reposición de limas urgente.", time:"19:42" },
    { user:"Cocina", msg:"Mesa 2 pidió cervezas hace 10 min ¿salió?", time:"19:44" },
    { user:"Barra", msg:"Salió junto con el pedido 103.", time:"19:45" }
  ]
};

window.MockAPI = {
  avgRating(){
    if(!MockDB.ratings.length) return 0;
    const s = MockDB.ratings.reduce((a,b)=>a+b.stars,0);
    return Math.round((s/MockDB.ratings.length)*10)/10;
  },
  addRating(stars, comment){
    MockDB.ratings.push({stars, comment});
    return this.avgRating();
  },
  addSuggestion(type, message){
    MockDB.suggestions.push({type, message});
  },
  addReservation(name,date,time,people){
    MockDB.reservations.push({name,date,time,people});
  },
  updateOrder(id, status){
    const o = MockDB.orders.find(x=>x.id===id);
    if(o){ o.status = status; }
  },
  addMenuItem(category, name, price, img){
    const cat = MockDB.menu.find(c=>c.category===category);
    const id = 1000 + Math.floor(Math.random()*9000);
    (cat?cat.items:MockDB.menu[0].items).push({id, name, price:Number(price), img: img||"https://placehold.co/600x400/94a3b8/fff?text=Nuevo"});
  },
  removeMenuItem(id){
    MockDB.menu.forEach(c=> c.items = c.items.filter(i=>i.id!==id) );
  }
};
