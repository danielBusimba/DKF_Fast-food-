let cart = [];
const phoneNumber = "243977434179"; // Change ton numéro ici (ex: 243812345678)

const productsData = [
  { id: "dkf1", title: "Double Cheese DKF", price: 7.0, img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
  { id: "dkf2", title: "Pizza Goma Spéciale", price: 12.0, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
  { id: "dkf3", title: "Ailerons Poulet (x8)", price: 8.5, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500" },
  { id: "dkf4", title: "Milkshake Oreo", price: 4.5, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" }
];

function displayProducts() {
  const shopContent = document.getElementById('shop-content');
  productsData.forEach(p => {
    shopContent.innerHTML += `
            <div class="product-box">
                <img src="${p.img}" alt="${p.title}" class="product-img">
                <h3 style="margin-top:10px;">${p.title}</h3>
                <span class="price">${p.price}$</span>
                <i class='bx bx-plus-circle add-cart' onclick="addToCart('${p.id}', '${p.title}', ${p.price})"></i>
            </div>`;
  });
}

function addToCart(id, title, price) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, title, price, qty: 1 });
  updateUI();
}

function removeFromCart(id) {
  const index = cart.findIndex(i => i.id === id);
  if (index > -1) {
    if (cart[index].qty > 1) cart[index].qty--;
    else cart.splice(index, 1);
  }
  updateUI();
}

function updateUI() {
  const cartItems = document.getElementById('cart-items');
  const totalDisplay = document.querySelector('.total-price');
  const countDisplay = document.getElementById('cart-count');
  const deliveryFeeDisplay = document.getElementById('delivery-fee');
  const quarterSelect = document.getElementById('client-quarter');
  
  const selectedOption = quarterSelect.options[quarterSelect.selectedIndex];
  const deliveryFee = selectedOption ? parseFloat(selectedOption.getAttribute('data-fee') || 0) : 0;
  
  cartItems.innerHTML = "";
  let subtotal = 0,
    count = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    count += item.qty;
    cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #333;">
                <span>${item.title} <b>x${item.qty}</b></span>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--dkf-gold)">${(item.price * item.qty).toFixed(2)}$</span>
                    <i class='bx bx-minus-circle' style="color:var(--dkf-red); cursor:pointer; font-size:1.4rem;" onclick="removeFromCart('${item.id}')"></i>
                </div>
            </div>`;
  });
  
  deliveryFeeDisplay.innerText = deliveryFee + "$";
  totalDisplay.innerText = (subtotal + deliveryFee).toFixed(2) + "$";
  countDisplay.innerText = count;
}

document.getElementById('confirm-order').onclick = () => {
  const name = document.getElementById('client-name').value;
  const quarter = document.getElementById('client-quarter').value;
  const error = document.getElementById('error-message');
  const successMsg = document.getElementById('success-msg');
  
  if (cart.length === 0 || !name || !quarter) {
    error.innerText = "Complétez vos infos !";
    return;
  }
  
  error.innerText = "";
  let msg = `*COMMANDE DKF_Fast-food 🥤*\n--------------------------\n👤 *Client:* ${name}\n📍 *Lieu:* ${quarter}\n🚚 *Livraison:* ${document.getElementById('delivery-fee').innerText}\n\n*Commande :*\n`;
  cart.forEach(i => msg += `- ${i.title} x${i.qty} (${(i.price * i.qty).toFixed(2)}$)\n`);
  msg += `\n💰 *TOTAL FINAL : ${document.querySelector('.total-price').innerText}*`;
  
  successMsg.style.display = "block";
  
  setTimeout(() => {
    const finalUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(msg)}`;
    window.open(finalUrl, '_blank');
    
    cart = [];
    document.getElementById('client-name').value = "";
    document.getElementById('client-quarter').value = "";
    successMsg.style.display = "none";
    updateUI();
    document.getElementById('cart-overlay').classList.remove('active');
  }, 1500);
};

document.getElementById('cart-icon').onclick = () => document.getElementById('cart-overlay').classList.add('active');
document.getElementById('close-cart').onclick = () => document.getElementById('cart-overlay').classList.remove('active');

displayProducts();