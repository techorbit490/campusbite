const PF = 10;
let role = '';
let cart = {};
let orders = [];
let nextOId = 1;
let menuItems = [
    { id: 1, name: "Rajma Chawal", cat: "meals", price: 80, type: "veg", desc: "Hearty kidney beans curry with steamed rice.", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80", badge: "🔥 Bestseller", avail: true },
    { id: 2, name: "Chicken Biryani", cat: "meals", price: 120, type: "nv", desc: "Aromatic basmati rice with spiced chicken & saffron.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=80", badge: "⭐ Top Pick", avail: true },
    { id: 3, name: "Masala Dosa", cat: "snacks", price: 60, type: "veg", desc: "Crispy golden dosa stuffed with spiced potato filling.", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80", badge: "", avail: true },
    { id: 4, name: "Veg Burger", cat: "snacks", price: 70, type: "veg", desc: "Soft bun, crispy patty, fresh veggies & zesty sauce.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", badge: "🌱 Healthy", avail: true },
    { id: 5, name: "Cold Coffee", cat: "drinks", price: 55, type: "veg", desc: "Chilled creamy blended coffee with ice cream.", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80", badge: "", avail: true },
    { id: 6, name: "Mango Lassi", cat: "drinks", price: 50, type: "veg", desc: "Thick Alphonso mango blended with chilled yogurt.", img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80", badge: "☀ Seasonal", avail: true },
    { id: 7, name: "Gulab Jamun", cat: "desserts", price: 40, type: "veg", desc: "Soft milk dumplings in rose-cardamom syrup.", img: "https://images.unsplash.com/photo-1601303516534-bf496bdf61fc?w=400&q=80", badge: "", avail: true },
    { id: 8, name: "Paneer Frankie", cat: "snacks", price: 75, type: "veg", desc: "Spiced paneer roll with mint chutney & lemon.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80", badge: "🆕 New", avail: true },
    { id: 9, name: "Egg Fried Rice", cat: "meals", price: 90, type: "nv", desc: "Wok-tossed rice with scrambled egg, veggies & soy.", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", badge: "", avail: true },
    { id: 10, name: "Samosa (2 pcs)", cat: "snacks", price: 30, type: "veg", desc: "Crispy fried pastry with spiced potato & peas.", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", badge: "💰 Budget", avail: true },
    { id: 11, name: "Fresh Lime Soda", cat: "drinks", price: 35, type: "veg", desc: "Zesty lime with sparkling soda, sweet or salted.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80", badge: "", avail: true },
    { id: 12, name: "Chocolate Brownie", cat: "desserts", price: 65, type: "veg", desc: "Fudgy dark chocolate brownie with walnut crumble.", img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=80", badge: "🍫 New", avail: true }
];
let nextMId = 13;
let curCat = 'all';
let selectedSlot = '';
let selectedPayMethod = 'upi';

// ── ROLE ──
function enterAs(r) {
    role = r;
    document.getElementById('roleScreen').style.display = 'none';
    document.getElementById('mainNav').style.display = 'block';
    const tag = document.getElementById('roleTag');
    tag.className = 'role-tag ' + r;
    tag.textContent = r === 'user' ? '🎒 Student' : r === 'vendor' ? '🍳 Vendor' : '⚙ Admin';
    document.getElementById('cartFab').style.display = r === 'user' ? 'flex' : 'none';
    document.getElementById('userPortal').style.display = r === 'user' ? 'block' : 'none';
    document.getElementById('vendorPortal').style.display = r === 'vendor' ? 'block' : 'none';
    document.getElementById('adminPortal').style.display = r === 'admin' ? 'block' : 'none';
    if (r === 'user') renderMenu('all');
    if (r === 'vendor') renderVendor();
    if (r === 'admin') renderAdmin();
}

function goHome() {
    ['userPortal', 'vendorPortal', 'adminPortal'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('mainNav').style.display = 'none';
    document.getElementById('roleScreen').style.display = 'flex';
    closeCart();
}

// ── MENU ──
function renderMenu(cat) {
    curCat = cat;
    const filtered = cat === 'all' ? menuItems.filter(i => i.avail) : menuItems.filter(i => i.cat === cat && i.avail);
    document.getElementById('itemCt').textContent = filtered.length + ' items';
    document.getElementById('foodGrid').innerHTML = filtered.map(item => `
    <div class="fc">
      <div class="fc-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        ${item.badge?`<div class="fc-bdg">${item.badge}</div>`:''}
        <div class="vdot ${item.type}"></div>
      </div>
      <div class="fc-body">
        <div class="fc-name">${item.name}</div>
        <div class="fc-desc">${item.desc}</div>
        <div class="fc-ft">
          <div class="fc-price">₹${item.price} <small>+₹10 fee</small></div>
          <div id="ctrl_${item.id}">${cart[item.id]?qcHTML(item.id):`<button class="add-btn" onclick="addToCart(${item.id})">+</button>`}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function qcHTML(id) {
  return `<div class="qc"><button class="qb" onclick="chQty(${id},-1)">−</button><span class="qn">${cart[id]||0}</span><button class="qb" onclick="chQty(${id},1)">+</button></div>`;
}

function filterCat(cat, el) {
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  renderMenu(cat);
}

function addToCart(id) {
  cart[id] = (cart[id]||0)+1;
  updCart(); renderMenu(curCat); toast('Added to cart!');
}

function chQty(id, d) {
  cart[id] = (cart[id]||0)+d;
  if (cart[id]<=0) delete cart[id];
  updCart(); renderMenu(curCat);
}

function updCart() {
  const tot = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = tot;
  renderCartItems();
}

function renderCartItems() {
  const keys = Object.keys(cart);
  const list = document.getElementById('cItems');
  if (!keys.length) {
    list.innerHTML = `<div class="c-empty"><div style="font-size:44px;margin-bottom:10px;">🍽</div><p style="color:var(--muted);">Your cart is empty!</p></div>`;
    document.getElementById('cFoot').style.display = 'none';
    return;
  }
  document.getElementById('cFoot').style.display = 'block';
  let sub=0, tQty=0;
  list.innerHTML = keys.map(id=>{
    const item = menuItems.find(m=>m.id==id); if(!item) return '';
    const lt = item.price*cart[id]; const lf = PF*cart[id];
    sub+=lt; tQty+=cart[id];
    return `<div class="ci">
      <div class="ci-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="ci-inf"><div class="ci-nm">${item.name}</div><div class="ci-pr">₹${lt}</div><div class="ci-fee">+₹${lf} platform fee</div></div>
      <div class="ci-qc"><button onclick="chQty(${id},-1)">−</button><span>${cart[id]}</span><button onclick="chQty(${id},1)">+</button></div>
    </div>`;
  }).join('');
  const fee = PF*tQty;
  document.getElementById('cSub').textContent='₹'+sub;
  document.getElementById('cFeeQty').textContent=tQty;
  document.getElementById('cFee').textContent='₹'+fee;
  document.getElementById('cTot').textContent='₹'+(sub+fee);
}

// ── CART PANEL ──
function openCart() { document.getElementById('cPanel').classList.add('on'); document.getElementById('cOv').classList.add('on'); renderCartItems(); }
function closeCart() { document.getElementById('cPanel').classList.remove('on'); document.getElementById('cOv').classList.remove('on'); }

// ── INVOICE ──
function showInvoice() {
  document.getElementById('cMain').style.display='none';
  document.getElementById('invView').classList.add('on');
  buildInvoice();
  renderSlots();
}

function renderSlots() {
  const slots = [];
  let h = 8, m = 30;
  while (h < 17 || (h === 17 && m <= 30)) {
    const hh = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    const mm = m === 0 ? '00' : m;
    slots.push(`${hh}:${mm} ${ampm}`);
    m += 15;
    if (m >= 60) { m -= 60; h++; }
  }
  const grid = document.getElementById('slotGrid');
  grid.innerHTML = slots.map((s,i) =>
    `<button class="slot-btn${i===0?' selected':''}" onclick="selectSlot(this,'${s}')">${s}</button>`
  ).join('');
  selectedSlot = slots[0];
}

function selectSlot(el, val) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedSlot = val;
}

function selectPay(radio) {
  document.querySelectorAll('.pay-opt').forEach(l => l.classList.remove('selected'));
  radio.closest('.pay-opt').classList.add('selected');
}
function backToCart() {
  document.getElementById('invView').classList.remove('on');
  document.getElementById('cMain').style.display='flex';
}
function buildInvoice() {
  const keys = Object.keys(cart);
  let sub=0, tQty=0;
  let tblRows=`<div class="inv-tbl-hd"><span style="flex:1;">Item</span><span style="width:36px;text-align:center;">Qty</span><span style="width:55px;text-align:right;">Rate</span><span style="width:60px;text-align:right;">Amt</span></div>`;
  keys.forEach(id=>{
    const item=menuItems.find(m=>m.id==id); if(!item) return;
    const qty=cart[id], amt=item.price*qty;
    sub+=amt; tQty+=qty;
    tblRows+=`<div class="inv-tbl-row"><span style="flex:1;">${item.name}</span><span style="width:36px;text-align:center;">${qty}</span><span style="width:55px;text-align:right;">₹${item.price}</span><span style="width:60px;text-align:right;font-weight:700;">₹${amt}</span></div>`;
  });
  document.getElementById('invItemsSection').innerHTML=`<div class="inv-label">Items</div>${tblRows}`;
  const fee=PF*tQty;
  document.getElementById('invSub').textContent='₹'+sub;
  document.getElementById('invFeeRows').innerHTML=keys.map(id=>{
    const item=menuItems.find(m=>m.id==id); if(!item) return '';
    return `<div class="inv-row or"><span>Platform Fee — ${item.name} (₹${PF}×${cart[id]})</span><span>₹${PF*cart[id]}</span></div>`;
  }).join('');
  document.getElementById('invTot').textContent='₹'+(sub+fee);
}

// ── PLACE ORDER ──
function placeOrder() {
  const keys = Object.keys(cart);
  if (!keys.length) return;
  const payInput = document.querySelector('input[name="payMethod"]:checked');
  const payMethod = payInput ? payInput.value : 'cod';
  if (!selectedSlot) { toast('Please select a time slot!'); return; }
  const code = 'CB-'+Math.floor(100000+Math.random()*900000);
  let sub=0, tQty=0;
  const items=[];
  keys.forEach(id=>{
    const item=menuItems.find(m=>m.id==id); if(!item) return;
    const qty=cart[id]; const amt=item.price*qty;
    sub+=amt; tQty+=qty;
    items.push({...item, qty, lineTotal:amt});
  });
  const fee=PF*tQty;
  const payLabels = {upi:'UPI', card:'Card', cod:'Cash on Delivery'};
  const order={
    id:nextOId++, code, items, subtotal:sub, fee, total:sub+fee,
    status:'new', time:new Date().toLocaleTimeString(),
    payMethod: payLabels[payMethod]||payMethod, slot: selectedSlot
  };
  orders.push(order);
  document.getElementById('modCode').textContent=code;
  document.getElementById('modPayMethod').textContent = payLabels[payMethod]||payMethod;
  document.getElementById('modSlot').textContent = selectedSlot;
  document.getElementById('successMod').classList.add('on');
}

function closeMod() {
  document.getElementById('successMod').classList.remove('on');
  cart={};
  updCart();
  backToCart();
  closeCart();
  renderMenu(curCat);
  if (document.getElementById('vendorPortal').style.display!=='none') renderVendor();
  if (document.getElementById('adminPortal').style.display!=='none') renderAdmin();
}

// ── VENDOR ──
function renderVendor() {
  const live = orders.filter(o=>o.status!=='done');
  document.getElementById('liveOrderCt').textContent=live.length+' orders';
  const el=document.getElementById('vendorOrdersList');
  if (!live.length) { el.innerHTML=`<div class="vp-empty"><div class="ve-ico">📭</div><p>No live orders yet.</p></div>`; return; }
  el.innerHTML=live.map(o=>orderCardHTML(o)).join('');
}

function orderCardHTML(o) {
  const sp = o.status==='new'?'sp-new':o.status==='prep'?'sp-prep':o.status==='ready'?'sp-ready':'sp-done';
  const sl = o.status==='new'?'⏳ New':o.status==='prep'?'🔥 Preparing':o.status==='ready'?'✅ Ready':'✔ Done';
  const acts = o.status==='done'?'':`
    ${o.status==='new'?`<button class="act-btn ab-prep" onclick="setStatus(${o.id},'prep')">Mark Preparing</button>`:''}
    ${o.status==='prep'?`<button class="act-btn ab-ready" onclick="setStatus(${o.id},'ready')">Mark Ready</button>`:''}
    ${o.status==='ready'?`<button class="act-btn ab-done" onclick="setStatus(${o.id},'done')">Mark Done</button>`:''}
    <button class="act-btn ab-cancel" onclick="setStatus(${o.id},'done')">✕ Cancel</button>
  `;
  return `<div class="order-card" id="ocard_${o.id}">
    <div class="oc-head">
      <div><div class="oc-id">${o.code}</div><div class="oc-time">Placed at ${o.time}${o.slot?' · 🕐 '+o.slot:''}${o.payMethod?' · 💳 '+o.payMethod:''}</div></div>
      <span class="status-pill ${sp}">${sl}</span>
    </div>
    <div class="oc-items">
      ${o.items.map(it=>`<div class="oi-row"><div class="oi-img"><img src="${it.img}" alt="${it.name}"></div><div><div class="oi-nm">${it.name}</div><div class="oi-qty">Qty: ${it.qty}</div></div><div class="oi-pr">₹${it.lineTotal}</div></div>`).join('')}
    </div>
    <div class="oc-foot">
      <div class="oc-total">Total: ₹${o.total} <span style="font-size:12px;color:var(--muted);font-weight:400;">(incl. ₹${o.fee} fee)</span></div>
      <div class="oc-actions">${acts}</div>
    </div>
  </div>`;
}

function setStatus(id, status) {
  const o = orders.find(x=>x.id===id);
  if(o) o.status=status;
  renderVendor();
  if (document.getElementById('adminPortal').style.display!=='none') renderAdmin();
  toast('Order updated!');
}

function lookupOrder() {
  const code = document.getElementById('lookupInput').value.trim().toUpperCase();
  const err = document.getElementById('lookupErr');
  const res = document.getElementById('lookupResult');
  const o = orders.find(x=>x.code===code);
  if (!o) { err.style.display='block'; res.innerHTML=''; return; }
  err.style.display='none';
  res.innerHTML=`<div style="margin-bottom:20px;"><div style="font-size:12px;color:var(--muted);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">🔍 Found Order</div>${orderCardHTML(o)}</div>`;
}

// ── ADMIN ──
function renderAdmin() {
  const done=orders.filter(o=>o.status==='done').length;
  const rev=orders.reduce((a,o)=>a+o.total,0);
  const fees=orders.reduce((a,o)=>a+o.fee,0);
  document.getElementById('st0').textContent=orders.length;
  document.getElementById('st1').textContent=rev;
  document.getElementById('st2').textContent=menuItems.filter(m=>m.avail).length;
  document.getElementById('st3').textContent='₹'+fees;
  renderAdminMenu();
}

function aTab(tab,el) {
  document.querySelectorAll('.at').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('aTabMenu').style.display=tab==='menu'?'block':'none';
  document.getElementById('aTabOrders').style.display=tab==='orders'?'block':'none';
  document.getElementById('aTabAdd').style.display=tab==='add'?'block':'none';
  document.getElementById('aEditWrap').style.display='none';
  if(tab==='orders') renderAdminOrders();
  if(tab==='add') renderAddForm();
  if(tab==='menu') renderAdminMenu();
}

function renderAdminMenu() {
  document.getElementById('aTabMenu').innerHTML=`<div class="admin-items">${menuItems.map(item=>`
    <div class="ai-row">
      <div class="ai-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="ai-info"><div class="ai-nm">${item.name}</div><div class="ai-cat">${item.cat} · ${item.type} · ${item.avail?'✅ Available':'❌ Hidden'}</div></div>
      <div class="ai-pr">₹${item.price}</div>
      <div class="ai-acts">
        <button class="ai-edit" onclick="aEditItem(${item.id})">✏ Edit</button>
        <button class="ai-tog" onclick="aToggle(${item.id})">${item.avail?'Hide':'Show'}</button>
        <button class="ai-del" onclick="aDel(${item.id})">🗑</button>
      </div>
    </div>
  `).join('')}</div>`;
}

function renderAdminOrders() {
  document.getElementById('aTabOrders').innerHTML = !orders.length
    ? `<div class="vp-empty"><div class="ve-ico">📭</div><p>No orders yet.</p></div>`
    : `<div class="vp-orders-grid">${[...orders].reverse().map(o=>orderCardHTML(o)).join('')}</div>`;
}

function renderAddForm() {
  document.getElementById('aTabAdd').innerHTML=`<div class="frm">
    <div class="fgrid">
      <div class="fg"><label>Item Name</label><input type="text" id="nName" placeholder="e.g. Chole Bhature"></div>
      <div class="fg"><label>Category</label><select id="nCat"><option value="meals">Meals</option><option value="snacks">Snacks</option><option value="drinks">Drinks</option><option value="desserts">Desserts</option></select></div>
      <div class="fg"><label>Price (₹)</label><input type="number" id="nPrice" placeholder="99"></div>
      <div class="fg"><label>Type</label><select id="nType"><option value="veg">Veg</option><option value="nv">Non-Veg</option></select></div>
      <div class="fg full"><label>Description</label><textarea id="nDesc" placeholder="Short description..."></textarea></div>
      <div class="fg full"><label>Image URL (Unsplash or direct link)</label><input type="text" id="nImg" placeholder="https://images.unsplash.com/..."></div>
      <div class="fg"><label>Badge (optional)</label><input type="text" id="nBdg" placeholder="🔥 Bestseller"></div>
      <div class="fg"><label>Available?</label><select id="nAvail"><option value="1">Yes</option><option value="0">No</option></select></div>
    </div>
    <div class="f-acts"><button class="bp" onclick="aAddItem()">+ Add to Menu</button><button class="bs" onclick="renderAddForm()">Reset</button></div>
  </div>`;
}

function aAddItem() {
  const name=document.getElementById('nName').value.trim();
  const price=parseInt(document.getElementById('nPrice').value);
  if(!name||!price){toast('Name & price required!');return;}
  menuItems.push({
    id:nextMId++,name,
    cat:document.getElementById('nCat').value,
    price,type:document.getElementById('nType').value,
    desc:document.getElementById('nDesc').value,
    img:document.getElementById('nImg').value||'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    badge:document.getElementById('nBdg').value,
    avail:document.getElementById('nAvail').value==='1'
  });
  renderAdmin(); renderAddForm(); toast('Item added!');
}

function aEditItem(id) {
  const item=menuItems.find(m=>m.id===id);if(!item) return;
  document.getElementById('aEditWrap').style.display='block';
  document.getElementById('aEditWrap').innerHTML=`
    <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:800;margin-bottom:12px;">✏ Edit: ${item.name}</div>
    <div class="frm">
      <input type="hidden" id="eId" value="${id}">
      <div class="fgrid">
        <div class="fg"><label>Name</label><input type="text" id="eName" value="${item.name}"></div>
        <div class="fg"><label>Category</label><select id="eCat"><option value="meals" ${item.cat==='meals'?'selected':''}>Meals</option><option value="snacks" ${item.cat==='snacks'?'selected':''}>Snacks</option><option value="drinks" ${item.cat==='drinks'?'selected':''}>Drinks</option><option value="desserts" ${item.cat==='desserts'?'selected':''}>Desserts</option></select></div>
        <div class="fg"><label>Price (₹)</label><input type="number" id="ePrice" value="${item.price}"></div>
        <div class="fg"><label>Type</label><select id="eType"><option value="veg" ${item.type==='veg'?'selected':''}>Veg</option><option value="nv" ${item.type==='nv'?'selected':''}>Non-Veg</option></select></div>
        <div class="fg full"><label>Description</label><textarea id="eDesc">${item.desc}</textarea></div>
        <div class="fg full"><label>Image URL</label><input type="text" id="eImg" value="${item.img}"></div>
        <div class="fg"><label>Badge</label><input type="text" id="eBdg" value="${item.badge}"></div>
      </div>
      <div class="f-acts"><button class="bp" onclick="aSaveEdit()">Save Changes</button><button class="bs" onclick="document.getElementById('aEditWrap').style.display='none'">Cancel</button></div>
    </div>`;
  document.getElementById('aEditWrap').scrollIntoView({behavior:'smooth'});
}

function aSaveEdit() {
  const id=parseInt(document.getElementById('eId').value);
  const idx=menuItems.findIndex(m=>m.id===id);if(idx<0)return;
  menuItems[idx]={...menuItems[idx],
    name:document.getElementById('eName').value,
    cat:document.getElementById('eCat').value,
    price:parseInt(document.getElementById('ePrice').value)||menuItems[idx].price,
    type:document.getElementById('eType').value,
    desc:document.getElementById('eDesc').value,
    img:document.getElementById('eImg').value||menuItems[idx].img,
    badge:document.getElementById('eBdg').value
  };
  document.getElementById('aEditWrap').style.display='none';
  renderAdmin(); if(role==='user') renderMenu(curCat);
  toast('Item saved!');
}

function aToggle(id) {
  const item=menuItems.find(m=>m.id===id);if(item) item.avail=!item.avail;
  renderAdmin(); if(role==='user') renderMenu(curCat);
}

function aDel(id) {
  if(!confirm('Delete this item from the menu?')) return;
  menuItems=menuItems.filter(m=>m.id!==id);
  renderAdmin(); if(role==='user') renderMenu(curCat);
  toast('Item deleted.');
}

// ── UTILS ──
function toast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('on');
  setTimeout(()=>t.classList.remove('on'),2200);
}