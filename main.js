let cart = [];
const phoneNumber = "243977434179";

// --- CAROUSEL LOGIC ---
const heroImages = ["dkf_burger.jpeg", "dkf_frittes.jpeg", "dkf_jus.jpeg", "dkf_logo.jpeg", "dkf_menu.jpeg", "dkf_reel.jpeg"];
let currentIdx = 0;
const wrapper = document.getElementById('carousel-wrapper');
const dotsContainer = document.getElementById('carousel-dots');

function initCarousel() {
    heroImages.forEach((img, i) => {
        wrapper.innerHTML += `<img src="${img}" alt="promo">`;
        dotsContainer.innerHTML += `<div class="dot ${i===0?'active':''}" onclick="goToSlide(${i})"></div>`;
    });
}

function goToSlide(i) {
    currentIdx = i;
    wrapper.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
}

setInterval(() => {
    currentIdx = (currentIdx + 1) % heroImages.length;
    goToSlide(currentIdx);
}, 5000);

// --- LIGHTBOX LOGIC ---
function viewImage(src, title) {
    const viewer = document.getElementById('image-viewer');
    document.getElementById('full-res-img').src = src;
    document.getElementById('viewer-title').innerText = title;
    viewer.classList.add('active');
}

// --- SHOP LOGIC ---
async function loadProducts() {
    const response = await fetch('products.json');
    const products = await response.json();
    const shopContent = document.getElementById('shop-content');
    shopContent.innerHTML = "";
    products.forEach(p => {
        shopContent.innerHTML += `
            <div class="product-box">
                <img src="${p.img}" class="product-img" onclick="viewImage('${p.img}', '${p.title}')">
                <h3>${p.title}</h3>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="price">${p.price.toLocaleString()} Fc</span>
                    <i class='bx bx-plus-circle add-cart' onclick="addToCart(${p.id}, '${p.title}', ${p.price})"></i>
                </div>
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
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) {
        if (cart[idx].qty > 1) cart[idx].qty--;
        else cart.splice(idx, 1);
    }
    updateUI();
}

function updateUI() {
    const cartItems = document.getElementById('cart-items');
    const quarterSelect = document.getElementById('client-quarter');
    const fee = parseInt(quarterSelect.options[quarterSelect.selectedIndex]?.getAttribute('data-fee') || 0);
    
    let subtotal = 0;
    let count = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-msg">Votre panier est vide</p>`;
    } else {
        cartItems.innerHTML = "";
        cart.forEach(item => {
            subtotal += item.price * item.qty;
            count += item.qty;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #222;">
                    <span>${item.title} <b>x${item.qty}</b></span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="color:var(--primary); font-weight:bold;">${(item.price * item.qty).toLocaleString()} Fc</span>
                        <i class='bx bx-minus-circle' style="cursor:pointer; font-size:1.3rem; opacity:0.6" onclick="removeFromCart(${item.id})"></i>
                    </div>
                </div>`;
        });
    }
    
    document.getElementById('cart-count').innerText = count;
    document.getElementById('delivery-fee').innerText = fee.toLocaleString() + " Fc";
    document.querySelector('.total-price').innerText = (subtotal + fee).toLocaleString() + " Fc";
}

document.getElementById('confirm-order').onclick = () => {
    const name = document.getElementById('client-name').value;
    const quarter = document.getElementById('client-quarter').value;
    if (!name || !quarter || cart.length === 0) return alert("Veuillez remplir les informations et choisir des produits.");
    
    let msg = `*COMMANDE DKF_Fast-food 👑*\n👤 *Client:* ${name}\n📍 *Lieu:* ${quarter}\n\n*Ma Commande:*\n`;
    cart.forEach(i => msg += `- ${i.title} x${i.qty} (${(i.price * i.qty).toLocaleString()} Fc)\n`);
    msg += `\n💰 *TOTAL FINAL : ${document.querySelector('.total-price').innerText}*`;
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(msg)}`);
};

document.getElementById('cart-icon').onclick = () => document.getElementById('cart-overlay').classList.add('active');
document.getElementById('close-cart').onclick = () => document.getElementById('cart-overlay').classList.remove('active');

initCarousel();
loadProducts();