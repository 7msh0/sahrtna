// App Data and Configuration
const appData = {
    items: {
        hookah: [
            { id: 'apple', name: 'تفاحتين', price: 17000, img: 'shesha/apple.png', color: '#FF6B6B' },
            { id: 'mint', name: 'نعنع', price: 17000, img: 'shesha/mint.png', color: '#4ECDC4' },
            { id: 'bubblegum', name: 'علكة بولو', price: 17000, img: 'shesha/bubblegum.png', color: '#FFD93D' },
            { id: 'grape', name: 'عنب', price: 17000, img: 'shesha/grape.png', color: '#6BCF7F' },
            { id: 'love', name: 'لوف', price: 17000, img: 'shesha/love.png', color: '#FF8BA7' }
        ],
        drinks: [
            { id: 'pepsi', name: 'بيبسي', price: 10000, img: 'drinks/pepsi.png', color: '#2A2A86' },
            { id: 'mirinda', name: 'مينردا', price: 10000, img: 'drinks/mirinda.png', color: '#FF6B00' },
            { id: 'seven', name: 'سفن', price: 10000, img: 'drinks/seven.png', color: '#D4D4D4' },
            { id: 'zoya_freeze', name: 'زويا فريز', price: 10000, img: 'drinks/zoya_freeze.png', color: '#FF007A' },
            { id: 'zoya_pineapple', name: 'زويا اناناس', price: 10000, img: 'drinks/zoya_pineapple.png', color: '#FFCC00' },
            { id: 'energy', name: 'مشروب طاقة', price: 10000, img: 'drinks/energy.png', color: '#FF0000' },
            { id: 'salsal_orange', name: 'سلسل برتقال', price: 10000, img: 'drinks/salsal_orange.png', color: '#FF9900' },
            { id: 'salsal_pineapple', name: 'سلس اناناس', price: 10000, img: 'drinks/salsal_pineapple.png', color: '#FFFF00' },
            { id: 'salsal_mango', name: 'سلس منغا', price: 10000, img: 'drinks/salsal_mango.png', color: '#FF6600' }
        ],
        desserts: [
            { id: 'chocolate_cake', name: 'كاتو شوكلا', price: 25000, img: 'sweets/chocolate_cake.png', color: '#4A2C2C' },
            { id: 'milk_cake', name: 'كاتو حليب', price: 25000, img: 'sweets/milk_cake.png', color: '#F8E0B0' },
            { id: 'cheesecake', name: 'تشيز كيك', price: 25000, img: 'sweets/cheesecake.png', color: '#FFF8DC' },
            { id: 'brownie', name: 'براوني', price: 25000, img: 'sweets/brownie.png', color: '#3C2A1E' },
            { id: 'nutella_salad', name: 'سلطة نوتيلا', price: 25000, img: 'sweets/nutella_salad.png', color: '#7B3F00' }
        ],
        games: [
            { id: 'ps4', name: 'بلايستيشن 4 (24 ساعة)', price: 100000, img: 'games/ps4.png', color: '#2D2D86', description: 'إيجار 24 ساعة مع 2 يد تحكم' },
            { id: 'shadda', name: 'شدة', price: 5000, img: 'games/shadda.png', color: '#2D862D' },
            { id: 'monopoly', name: 'مونوبالي', price: 10000, img: 'games/monopoly.png', color: '#E6CC80' },
            { id: 'jackaroo', name: 'جاكارو', price: 10000, img: 'games/jackaroo.png', color: '#8066CC' },
            { id: 'makdous', name: 'مكدوس', price: 10000, img: 'games/makdous.png', color: '#CC6666' }
        ]
    },
    deliveryFee: 5000,
    phoneNumber: '+963945349776',
    lattakiaCoords: [35.5175, 35.7833]
};

// App State
const state = {
    cart: {},
    total: 0,
    itemCount: 0,
    selectedLocation: null,
    locationConfirmed: false,
    currentTab: 'hookah'
};

// DOM Elements
let elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    setupEventListeners();
    initializeData();
    initApp();
});

// Initialize DOM elements
function initializeElements() {
    elements = {
        splashScreen: document.getElementById('splash-screen'),
        mainApp: document.getElementById('main-app'),
        loadingProgress: document.querySelector('.loading-progress'),

        // Navigation
        navBtns: document.querySelectorAll('.nav-btn'),
        categorySections: document.querySelectorAll('.category-section'),

        // Cart
        floatingCartBtn: document.getElementById('floating-cart-btn'),
        floatingCartCount: document.querySelector('.floating-cart-count'),

        // Cart Side Menu
        cartSideMenu: document.getElementById('cart-side-menu'),
        closeCartBtn: document.getElementById('close-cart'),
        cartOverlay: document.getElementById('cart-overlay'),
        cartItems: document.getElementById('cart-items'),
        cartTotalSummary: document.getElementById('cart-total-summary'),
        cartGrandTotal: document.getElementById('cart-grand-total'),
        checkoutActionBtn: document.getElementById('checkout-action-btn'),

        // Modals
        orderModal: document.getElementById('order-modal'),
        orderSummaryItems: document.getElementById('order-summary-items'),
        orderSubtotal: document.getElementById('order-subtotal'),
        orderGrandTotal: document.getElementById('order-grand-total'),
        confirmOrderBtn: document.getElementById('confirm-order'),
        mapModal: document.getElementById('map-modal'),
        whatsappModal: document.getElementById('whatsapp-modal'),
        closeModalBtns: document.querySelectorAll('.close-modal'),

        // Map
        findLocationBtn: document.getElementById('find-location'),
        confirmLocationBtn: document.getElementById('confirm-location'),
        selectedLocationText: document.getElementById('selected-location-text'),
        sendWhatsappBtn: document.getElementById('send-whatsapp'),
        whatsappMessage: document.getElementById('whatsapp-message'),
        whatsappSendLink: document.getElementById('whatsapp-send-link')
    };
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Cart
    elements.floatingCartBtn.addEventListener('click', openCartSideMenu);
    elements.closeCartBtn.addEventListener('click', closeCartSideMenu);
    elements.cartOverlay.addEventListener('click', closeCartSideMenu);
    elements.checkoutActionBtn.addEventListener('click', showOrderModal);

    // Item controls (delegated)
    document.addEventListener('click', function (e) {
        // Add item
        if (e.target.closest('.quantity-btn.plus')) {
            const btn = e.target.closest('.quantity-btn.plus');
            const itemId = btn.getAttribute('data-id');
            const category = btn.getAttribute('data-category');
            addToCart(itemId, category, 1);
        }

        // Remove item
        if (e.target.closest('.quantity-btn.minus')) {
            const btn = e.target.closest('.quantity-btn.minus');
            const itemId = btn.getAttribute('data-id');
            const category = btn.getAttribute('data-category');
            removeFromCart(itemId, 1);
        }

        // Remove item from cart
        if (e.target.closest('.cart-item-remove')) {
            const btn = e.target.closest('.cart-item-remove');
            const itemId = btn.getAttribute('data-id');
            removeFromCart(itemId, 'all');
        }
    });

    // Modals
    elements.confirmOrderBtn.addEventListener('click', function () {
        elements.orderModal.classList.remove('active');
        showMapModal();
    });

    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
        });
    });

    // Map
    elements.findLocationBtn.addEventListener('click', findUserLocation);
    elements.confirmLocationBtn.addEventListener('click', confirmLocation);
    elements.sendWhatsappBtn.addEventListener('click', prepareWhatsAppMessage);

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function () {
            this.closest('.modal').classList.remove('active');
        });
    });
}

// Initialize data and UI
function initializeData() {
    // Load cart from localStorage
    loadCartFromStorage();

    // Populate items in each category
    populateItems('hookah', appData.items.hookah);
    populateItems('drinks', appData.items.drinks);
    populateItems('desserts', appData.items.desserts);
    populateItems('games', appData.items.games);
}

// Populate items in a category
function populateItems(category, items) {
    const container = document.querySelector(`#${category} .items-grid`);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="item-card" data-id="${item.id}" data-category="${category}">
            <div class="item-img" style="background: linear-gradient(135deg, ${item.color}40, ${item.color}80);">
                <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiR7aXRlbS5jb2xvcn0iLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkNhaXJvIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+JHtpdGVtLm5hbWUuc3Vic3RyaW5nKDAsMik8L3RleHQ+PC9zdmc+';">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
                <div class="item-price">${formatPrice(item.price)} ليرة</div>
                <div class="item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}" data-category="${category}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity" data-id="${item.id}">${state.cart[item.id]?.quantity || 0}</span>
                    <button class="quantity-btn plus" data-id="${item.id}" data-category="${category}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Switch between tabs
function switchTab(tabId) {
    // Update active nav button
    elements.navBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update active section
    elements.categorySections.forEach(section => {
        if (section.id === tabId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    state.currentTab = tabId;
}

// Cart functions
function addToCart(itemId, category, quantity) {
    const item = appData.items[category].find(i => i.id === itemId);
    if (!item) return;

    if (!state.cart[itemId]) {
        state.cart[itemId] = {
            ...item,
            quantity: 0
        };
    }

    state.cart[itemId].quantity += quantity;
    state.total += item.price * quantity;
    state.itemCount += quantity;

    updateCartDisplay();
    updateItemQuantity(itemId);
    saveCartToStorage();

    // Animation feedback
    animateAddToCart(itemId);
}

function removeFromCart(itemId, quantity) {
    if (!state.cart[itemId]) return;

    const item = state.cart[itemId];

    if (quantity === 'all') {
        state.total -= item.price * item.quantity;
        state.itemCount -= item.quantity;
        delete state.cart[itemId];
    } else {
        if (item.quantity <= quantity) {
            state.total -= item.price * item.quantity;
            state.itemCount -= item.quantity;
            delete state.cart[itemId];
        } else {
            state.cart[itemId].quantity -= quantity;
            state.total -= item.price * quantity;
            state.itemCount -= quantity;
        }
    }

    updateCartDisplay();
    updateItemQuantity(itemId);
    saveCartToStorage();
}

function updateCartDisplay() {
    // Update counts
    elements.floatingCartCount.textContent = state.itemCount;

    // Update cart items
    elements.cartItems.innerHTML = '';

    if (state.itemCount === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <h3>سلة الطلبات فارغة</h3>
                <p>أضف عناصر من القائمة لتبدأ التسوق</p>
            </div>
        `;
    } else {
        Object.values(state.cart).forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-img" style="background: linear-gradient(135deg, ${item.color}40, ${item.color}80);">
                    <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;\\'>${item.name.substring(0, 2)}</div>';">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)} ل.س</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn plus cart-item-plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn minus cart-item-minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            elements.cartItems.appendChild(itemElement);
        });
    }

    // Update totals
    const grandTotal = state.total + appData.deliveryFee;
    elements.cartTotalSummary.textContent = `${formatPrice(state.total)} ليرة`;
    elements.cartGrandTotal.textContent = `${formatPrice(grandTotal)} ليرة`;
}

function updateItemQuantity(itemId) {
    const quantityElements = document.querySelectorAll(`[data-id="${itemId}"] .quantity`);
    quantityElements.forEach(el => {
        el.textContent = state.cart[itemId]?.quantity || 0;
    });
}

function animateAddToCart(itemId) {
    const itemCard = document.querySelector(`.item-card[data-id="${itemId}"]`);
    if (itemCard) {
        itemCard.classList.add('selected');
        setTimeout(() => {
            itemCard.classList.remove('selected');
        }, 1000);
    }
}

// Cart side menu
function openCartSideMenu() {
    elements.cartSideMenu.classList.add('active');
    elements.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSideMenu() {
    elements.cartSideMenu.classList.remove('active');
    elements.cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Storage
function saveCartToStorage() {
    localStorage.setItem('sahratna_cart', JSON.stringify({
        cart: state.cart,
        total: state.total,
        itemCount: state.itemCount
    }));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('sahratna_cart');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.cart = data.cart || {};
            state.total = data.total || 0;
            state.itemCount = data.itemCount || 0;
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    }
}

// Modals
function showOrderModal() {
    if (state.itemCount === 0) {
        alert('الرجاء إضافة عناصر إلى السلة قبل المتابعة');
        return;
    }

    closeCartSideMenu();

    // Update order summary
    elements.orderSummaryItems.innerHTML = '';
    Object.values(state.cart).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>${formatPrice(item.price * item.quantity)} ليرة</span>
        `;
        elements.orderSummaryItems.appendChild(itemElement);
    });

    const grandTotal = state.total + appData.deliveryFee;
    elements.orderSubtotal.textContent = `${formatPrice(state.total)} ليرة`;
    elements.orderGrandTotal.textContent = `${formatPrice(grandTotal)} ليرة`;

    elements.orderModal.classList.add('active');
}

let map = null;
let marker = null;
let userLocationMarker = null;

function showMapModal() {
    elements.mapModal.classList.add('active');

    if (!map) {
        initMap();
    } else {
        map.setView(appData.lattakiaCoords, 13);
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(appData.lattakiaCoords, {
            icon: L.divIcon({
                className: 'custom-marker',
                iconSize: [24, 24]
            })
        }).addTo(map);

        state.selectedLocation = {
            lat: appData.lattakiaCoords[0],
            lng: appData.lattakiaCoords[1]
        };
        state.locationConfirmed = false;
        updateLocationText();
        elements.sendWhatsappBtn.disabled = true;
    }
}

function initMap() {
    map = L.map('map').setView(appData.lattakiaCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    map.on('click', function (e) {
        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'custom-marker',
                iconSize: [24, 24]
            })
        }).addTo(map);

        state.selectedLocation = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        };

        updateLocationText();
    });

    marker = L.marker(appData.lattakiaCoords, {
        icon: L.divIcon({
            className: 'custom-marker',
            iconSize: [24, 24]
        })
    }).addTo(map);

    state.selectedLocation = {
        lat: appData.lattakiaCoords[0],
        lng: appData.lattakiaCoords[1]
    };

    updateLocationText();
}

function findUserLocation() {
    if (!navigator.geolocation) {
        alert('متصفحك لا يدعم تحديد الموقع الجغرافي');
        return;
    }

    const originalText = elements.findLocationBtn.innerHTML;
    elements.findLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>جاري البحث...</span>';
    elements.findLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const userCoords = [position.coords.latitude, position.coords.longitude];

            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }

            userLocationMarker = L.marker(userCoords, {
                icon: L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            }).addTo(map);

            userLocationMarker.bindPopup('موقعك الحالي').openPopup();
            map.setView(userCoords, 15);

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker(userCoords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    iconSize: [24, 24]
                })
            }).addTo(map);

            state.selectedLocation = {
                lat: userCoords[0],
                lng: userCoords[1]
            };

            updateLocationText();

            elements.findLocationBtn.innerHTML = originalText;
            elements.findLocationBtn.disabled = false;
        },
        function (error) {
            alert('تعذر تحديد موقعك. الرجاء المحاولة مرة أخرى أو تحديد الموقع يدوياً.');
            elements.findLocationBtn.innerHTML = originalText;
            elements.findLocationBtn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000
        }
    );
}

function confirmLocation() {
    if (marker) {
        state.locationConfirmed = true;
        updateLocationText();
        elements.sendWhatsappBtn.disabled = false;

        // Add confirmation effect
        elements.confirmLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>تم التأكيد</span>';
        setTimeout(() => {
            elements.confirmLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>تأكيد هذا الموقع</span>';
        }, 2000);
    } else {
        alert('الرجاء تحديد موقع على الخريطة أولاً');
    }
}

function updateLocationText() {
    if (!state.selectedLocation) return;

    const lat = state.selectedLocation.lat.toFixed(5);
    const lng = state.selectedLocation.lng.toFixed(5);

    if (state.locationConfirmed) {
        elements.selectedLocationText.innerHTML = `
            <i class="fas fa-check-circle" style="color: #25D366;"></i>
            <span>تم تأكيد الموقع: ${lat}, ${lng}</span>
        `;
    } else {
        elements.selectedLocationText.innerHTML = `
            <i class="fas fa-map-marker-alt" style="color: #e27a37;"></i>
            <span>الموقع المحدد: ${lat}, ${lng}</span>
        `;
    }
}

function prepareWhatsAppMessage() {
    if (!state.locationConfirmed || !state.selectedLocation) {
        alert('الرجاء تأكيد موقع التوصيل أولاً');
        return;
    }

    let message = `*طلب جديد من تطبيق سهرتنا* 🎉\n\n`;
    message += `*تفاصيل الطلب:*\n`;

    Object.values(state.cart).forEach(item => {
        message += `- ${item.name} (${item.quantity}) → ${formatPrice(item.price * item.quantity)} ليرة\n`;
    });

    message += `\n*المجموع:* ${formatPrice(state.total)} ليرة\n`;
    message += `*رسوم التوصيل:* ${formatPrice(appData.deliveryFee)} ليرة\n`;
    message += `*المجموع الكلي:* ${formatPrice(state.total + appData.deliveryFee)} ليرة سورية\n\n`;

    const mapsUrl = `https://www.google.com/maps?q=${state.selectedLocation.lat},${state.selectedLocation.lng}`;
    message += `*موقع التوصيل:*\n${mapsUrl}\n`;
    message += `الإحداثيات: ${state.selectedLocation.lat.toFixed(5)}, ${state.selectedLocation.lng.toFixed(5)}\n\n`;
    message += `*شكراً لاستخدامكم تطبيق سهرتنا!* ❤️`;

    elements.whatsappMessage.textContent = message;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${appData.phoneNumber}?text=${encodedMessage}`;
    elements.whatsappSendLink.href = whatsappUrl;

    elements.mapModal.classList.remove('active');


    elements.whatsappModal.classList.add('active');
}

// Helper functions
function formatPrice(price) {
    return price.toLocaleString('ar-SY');
}

// Initialize app
function initApp() {
    // Simulate loading
    setTimeout(() => {
        elements.loadingProgress.style.width = '100%';

        setTimeout(() => {
            elements.splashScreen.classList.remove('active');
            elements.splashScreen.classList.add('hidden');

            setTimeout(() => {
                elements.mainApp.classList.add('active');
                updateCartDisplay();
            }, 300);
        }, 500);
    }, 3000);
}

// Add scroll effect to categories nav
let lastScroll = 0;
window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;
    const categoriesNav = document.querySelector('.categories-nav');

    if (currentScroll > lastScroll && currentScroll > 100) {
        categoriesNav.classList.add('scrolled');
    } else {
        categoriesNav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Initialize the app
initApp();