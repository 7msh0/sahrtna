// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // App State
    const state = {
        cart: {},
        total: 0,
        itemCount: 0,
        selectedLocation: null,
        locationConfirmed: false
    };

    // Elements
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    const loadingProgress = document.querySelector('.loading-progress');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const categorySections = document.querySelectorAll('.category-section');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartCount = document.getElementById('cart-count');
    const cartTotalHeader = document.getElementById('cart-total');
    const cartSideMenu = document.getElementById('cart-side-menu');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSummary = document.getElementById('cart-total-summary');
    const cartGrandTotal = document.getElementById('cart-grand-total');
    const sideCheckoutBtn = document.getElementById('side-checkout-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutTotal = document.querySelector('.checkout-total');
    const orderModal = document.getElementById('order-modal');
    const orderSummaryItems = document.getElementById('order-summary-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderGrandTotal = document.getElementById('order-grand-total');
    const confirmOrderBtn = document.getElementById('confirm-order');
    const mapModal = document.getElementById('map-modal');
    const whatsappModal = document.getElementById('whatsapp-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const findLocationBtn = document.getElementById('find-location');
    const confirmLocationBtn = document.getElementById('confirm-location');
    const selectedLocationText = document.getElementById('selected-location-text');
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const whatsappMessage = document.getElementById('whatsapp-message');
    const whatsappSendLink = document.getElementById('whatsapp-send-link');

    // Initialize Map
    let map = null;
    let marker = null;
    let userLocationMarker = null;
    const lattakiaCoords = [35.5175, 35.7833]; // Lattakia coordinates
    const deliveryFee = 5000; // Delivery fee in Syrian Pounds

    // Initialize the application
    function initApp() {
        // Simulate loading for 3 seconds
        setTimeout(() => {
            loadingProgress.style.width = '100%';

            // Animate logo before transitioning
            setTimeout(() => {
                splashScreen.classList.remove('active');
                splashScreen.classList.add('hidden');

                // Show main app
                setTimeout(() => {
                    mainApp.classList.add('active');
                    // Load images with fallback
                    loadProductImages();
                }, 300);
            }, 500);
        }, 3000);

        // Setup event listeners
        setupEventListeners();

        // Initialize cart from localStorage if available
        loadCartFromStorage();

        // Update cart display
        updateCartDisplay();
    }

    // Load product images with fallback to placeholder
    function loadProductImages() {
        const itemCards = document.querySelectorAll('.item-card');
        itemCards.forEach(card => {
            const imgPath = card.getAttribute('data-img');
            const imgContainer = card.querySelector('.item-img');

            if (imgPath) {
                const img = new Image();
                img.src = imgPath;
                img.onload = function () {
                    // Replace placeholder with actual image
                    const placeholder = imgContainer.querySelector('.img-placeholder');
                    if (placeholder) {
                        imgContainer.innerHTML = '';
                        imgContainer.appendChild(img);
                    }
                };
                img.onerror = function () {
                    // Keep placeholder if image fails to load
                    console.log(`Image not found: ${imgPath}`);
                };
            }
        });
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');

                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding section
                categorySections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === tabId) {
                        section.classList.add('active');
                    }
                });
            });
        });

        // Quantity buttons
        document.addEventListener('click', function (e) {
            // Plus button in main grid
            if (e.target.closest('.quantity-btn.plus')) {
                const btn = e.target.closest('.quantity-btn.plus');
                const itemCard = btn.closest('.item-card');
                const itemName = itemCard.getAttribute('data-item');
                const itemPrice = parseInt(itemCard.getAttribute('data-price'));
                addToCart(itemName, itemPrice, 1);
            }

            // Minus button in main grid
            if (e.target.closest('.quantity-btn.minus')) {
                const btn = e.target.closest('.quantity-btn.minus');
                const itemCard = btn.closest('.item-card');
                const itemName = itemCard.getAttribute('data-item');
                const itemPrice = parseInt(itemCard.getAttribute('data-price'));
                removeFromCart(itemName, 1);
            }

            // Cart item minus button in side menu
            if (e.target.closest('.cart-item-minus')) {
                const btn = e.target.closest('.cart-item-minus');
                const itemName = btn.getAttribute('data-item');
                const itemPrice = parseInt(btn.getAttribute('data-price'));
                removeFromCart(itemName, 1);
            }

            // Cart item plus button in side menu
            if (e.target.closest('.cart-item-plus')) {
                const btn = e.target.closest('.cart-item-plus');
                const itemName = btn.getAttribute('data-item');
                const itemPrice = parseInt(btn.getAttribute('data-price'));
                addToCart(itemName, itemPrice, 1);
            }

            // Cart item remove button in side menu
            if (e.target.closest('.cart-item-remove')) {
                const btn = e.target.closest('.cart-item-remove');
                const itemName = btn.getAttribute('data-item');
                removeFromCart(itemName, 'all');
            }
        });

        // Cart icon click
        cartIconBtn.addEventListener('click', openCartSideMenu);

        // Close cart side menu
        closeCartBtn.addEventListener('click', closeCartSideMenu);
        cartOverlay.addEventListener('click', closeCartSideMenu);

        // Checkout buttons
        checkoutBtn.addEventListener('click', function () {
            if (state.total === 0) {
                alert('الرجاء إضافة عناصر إلى السلة قبل المتابعة');
                return;
            }
            closeCartSideMenu();
            showOrderModal();
        });

        sideCheckoutBtn.addEventListener('click', function () {
            if (state.total === 0) {
                alert('الرجاء إضافة عناصر إلى السلة قبل المتابعة');
                return;
            }
            closeCartSideMenu();
            showOrderModal();
        });

        // Confirm order button
        confirmOrderBtn.addEventListener('click', function () {
            orderModal.classList.remove('active');
            showMapModal();
        });

        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
            });
        });

        // Find location button
        findLocationBtn.addEventListener('click', function () {
            findUserLocation();
        });

        // Confirm location button
        confirmLocationBtn.addEventListener('click', function () {
            if (marker) {
                const latlng = marker.getLatLng();
                state.selectedLocation = {
                    lat: latlng.lat,
                    lng: latlng.lng
                };
                state.locationConfirmed = true;

                selectedLocationText.textContent = `تم تحديد الموقع: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
                sendWhatsappBtn.disabled = false;

                // Show success message
                const successMsg = document.createElement('div');
                successMsg.innerHTML = '<i class="fas fa-check-circle" style="color: #25D366; margin-left: 5px;"></i> تم تأكيد الموقع بنجاح';
                successMsg.style.color = '#25D366';
                successMsg.style.fontWeight = '600';
                successMsg.style.marginTop = '10px';

                // Remove previous success message if exists
                const prevMsg = document.querySelector('.location-success');
                if (prevMsg) prevMsg.remove();

                successMsg.classList.add('location-success');
                selectedLocationText.parentNode.insertBefore(successMsg, selectedLocationText.nextSibling);
            } else {
                alert('الرجاء تحديد موقع على الخريطة أولاً');
            }
        });

        // Send WhatsApp button
        sendWhatsappBtn.addEventListener('click', function () {
            if (!state.locationConfirmed || !state.selectedLocation) {
                alert('الرجاء تأكيد موقع التوصيل أولاً');
                return;
            }

            prepareWhatsAppMessage();
            mapModal.classList.remove('active');
            whatsappModal.classList.add('active');
        });

        // Close modals when clicking outside
        orderModal.addEventListener('click', function (e) {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
            }
        });

        mapModal.addEventListener('click', function (e) {
            if (e.target === mapModal) {
                mapModal.classList.remove('active');
            }
        });

        whatsappModal.addEventListener('click', function (e) {
            if (e.target === whatsappModal) {
                whatsappModal.classList.remove('active');
            }
        });
    }

    // Cart functions
    function addToCart(itemName, itemPrice, quantity) {
        if (!state.cart[itemName]) {
            state.cart[itemName] = {
                quantity: 0,
                price: itemPrice,
                img: getItemImagePath(itemName)
            };
        }

        state.cart[itemName].quantity += quantity;
        state.total += itemPrice * quantity;
        state.itemCount += quantity;

        updateCartDisplay();
        updateItemQuantityDisplay(itemName);
        updateCartHeader();
        saveCartToStorage();
    }

    function removeFromCart(itemName, quantity) {
        if (!state.cart[itemName]) return;

        if (quantity === 'all') {
            state.total -= state.cart[itemName].quantity * state.cart[itemName].price;
            state.itemCount -= state.cart[itemName].quantity;
            delete state.cart[itemName];
        } else {
            if (state.cart[itemName].quantity <= quantity) {
                state.total -= state.cart[itemName].quantity * state.cart[itemName].price;
                state.itemCount -= state.cart[itemName].quantity;
                delete state.cart[itemName];
            } else {
                state.cart[itemName].quantity -= quantity;
                state.total -= state.cart[itemName].price * quantity;
                state.itemCount -= quantity;
            }
        }

        updateCartDisplay();
        updateItemQuantityDisplay(itemName);
        updateCartHeader();
        saveCartToStorage();
    }

    function getItemImagePath(itemName) {
        // This function would map item names to their image paths
        // For now, we'll return a generic placeholder
        const itemCards = document.querySelectorAll('.item-card');
        for (let card of itemCards) {
            if (card.getAttribute('data-item') === itemName) {
                return card.getAttribute('data-img') || '';
            }
        }
        return '';
    }

    function updateCartHeader() {
        // Update cart count in header
        cartCount.textContent = state.itemCount;

        // Update total in header
        cartTotalHeader.textContent = state.total.toLocaleString('ar-SY') + ' ل.س';

        // Update checkout button total
        checkoutTotal.textContent = state.total.toLocaleString('ar-SY') + ' ل.س';

        // Update bottom checkout button text
        const checkoutText = document.querySelector('.checkout-text');
        checkoutText.textContent = `طلب والدفع (${state.itemCount})`;
    }

    function updateCartDisplay() {
        // Update cart items in side menu
        cartItemsContainer.innerHTML = '';

        if (Object.keys(state.cart).length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>سلة الطلبات فارغة</p>
                    <p class="empty-cart-sub">أضف عناصر من القائمة</p>
                </div>
            `;

            // Update cart totals
            cartTotalSummary.textContent = '0 ليرة';
            cartGrandTotal.textContent = deliveryFee.toLocaleString('ar-SY') + ' ليرة';
            return;
        }

        for (const itemName in state.cart) {
            const item = state.cart[itemName];
            const itemTotal = item.quantity * item.price;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            // Create image element
            let imgHtml = '';
            if (item.img) {
                imgHtml = `<img src="${item.img}" alt="${itemName}" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'img-placeholder\\'>${itemName.substring(0, 10)}</div>';" />`;
            } else {
                imgHtml = `<div class="img-placeholder">${itemName.substring(0, 10)}</div>`;
            }

            cartItem.innerHTML = `
                <div class="cart-item-img">
                    ${imgHtml}
                </div>
                <div class="cart-item-info">
                    <h4>${itemName}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString('ar-SY')} × ${item.quantity} = ${itemTotal.toLocaleString('ar-SY')} ل.س</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn plus cart-item-plus" data-item="${itemName}" data-price="${item.price}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn minus cart-item-minus" data-item="${itemName}" data-price="${item.price}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="cart-item-remove" data-item="${itemName}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        }

        // Update cart totals
        const grandTotal = state.total + deliveryFee;
        cartTotalSummary.textContent = state.total.toLocaleString('ar-SY') + ' ليرة';
        cartGrandTotal.textContent = grandTotal.toLocaleString('ar-SY') + ' ليرة';
    }

    function updateItemQuantityDisplay(itemName) {
        // Update quantity in item cards
        const itemCards = document.querySelectorAll(`[data-item="${itemName}"]`);
        itemCards.forEach(card => {
            const quantityElement = card.querySelector('.quantity');
            if (quantityElement) {
                quantityElement.textContent = state.cart[itemName] ? state.cart[itemName].quantity : 0;
            }
        });
    }

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

                // Update all item quantity displays
                for (const itemName in state.cart) {
                    updateItemQuantityDisplay(itemName);
                }
            } catch (e) {
                console.error('Error loading cart from storage:', e);
            }
        }
    }

    function openCartSideMenu() {
        cartSideMenu.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCartSideMenu() {
        cartSideMenu.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Modal functions
    function showOrderModal() {
        // Update order summary
        orderSummaryItems.innerHTML = '';

        for (const itemName in state.cart) {
            const item = state.cart[itemName];
            const itemTotal = item.quantity * item.price;

            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>${itemName} (${item.quantity})</div>
                <div>${itemTotal.toLocaleString('ar-SY')} ليرة</div>
            `;

            orderSummaryItems.appendChild(orderItem);
        }

        const grandTotal = state.total + deliveryFee;
        orderSubtotal.textContent = state.total.toLocaleString('ar-SY') + ' ليرة';
        orderGrandTotal.textContent = grandTotal.toLocaleString('ar-SY') + ' ليرة';
        orderModal.classList.add('active');
    }

    function showMapModal() {
        mapModal.classList.add('active');

        // Initialize map if not already initialized
        if (!map) {
            initMap();
        } else {
            // Reset map view to Lattakia
            map.setView(lattakiaCoords, 13);

            // Clear any existing markers except the user location marker
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }

            // Add a marker for Lattakia center
            marker = L.marker(lattakiaCoords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    iconSize: [24, 24]
                })
            }).addTo(map);

            state.selectedLocation = {
                lat: lattakiaCoords[0],
                lng: lattakiaCoords[1]
            };
            state.locationConfirmed = false;
            selectedLocationText.textContent = `الموقع الافتراضي: اللاذقية`;
            sendWhatsappBtn.disabled = true;

            // Remove success message if exists
            const prevMsg = document.querySelector('.location-success');
            if (prevMsg) prevMsg.remove();
        }
    }

    // Map functions
    function initMap() {
        // Create map centered on Lattakia
        map = L.map('map').setView(lattakiaCoords, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Add click event to map to place marker
        map.on('click', function (e) {
            // Remove previous marker if exists
            if (marker) {
                map.removeLayer(marker);
            }

            // Add new marker
            marker = L.marker(e.latlng, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    iconSize: [24, 24]
                })
            }).addTo(map);

            // Update location text
            selectedLocationText.textContent = `الموقع المحدد: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;

            // Enable confirm location button
            confirmLocationBtn.disabled = false;
        });

        // Add a marker for Lattakia center
        marker = L.marker(lattakiaCoords, {
            icon: L.divIcon({
                className: 'custom-marker',
                iconSize: [24, 24]
            })
        }).addTo(map);

        // Initialize location text
        selectedLocationText.textContent = `الموقع الافتراضي: اللاذقية`;
    }

    function findUserLocation() {
        if (!navigator.geolocation) {
            alert('متصفحك لا يدعم تحديد الموقع الجغرافي');
            return;
        }

        // Show loading state
        const originalText = findLocationBtn.innerHTML;
        findLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري البحث عن موقعك...';
        findLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Success callback
                const userCoords = [position.coords.latitude, position.coords.longitude];

                // Remove previous user location marker if exists
                if (userLocationMarker) {
                    map.removeLayer(userLocationMarker);
                }

                // Add marker for user location
                userLocationMarker = L.marker(userCoords, {
                    icon: L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                    })
                }).addTo(map);

                // Create a popup for the user location
                userLocationMarker.bindPopup('موقعك الحالي').openPopup();

                // Pan map to user location
                map.setView(userCoords, 15);

                // Update selected location
                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker(userCoords, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        iconSize: [24, 24]
                    })
                }).addTo(map);

                selectedLocationText.textContent = `الموقع المحدد: ${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`;

                // Reset button
                findLocationBtn.innerHTML = originalText;
                findLocationBtn.disabled = false;
            },
            function (error) {
                // Error callback
                console.error('Geolocation error:', error);

                let errorMessage = 'تعذر تحديد موقعك الجغرافي. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'تم رفض الإذن لتحديد الموقع.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'معلومات الموقع غير متوفرة.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'انتهت المهلة في انتظار الموقع.';
                        break;
                    default:
                        errorMessage += 'حدث خطأ غير معروف.';
                }

                alert(errorMessage);

                // Reset button
                findLocationBtn.innerHTML = originalText;
                findLocationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    function prepareWhatsAppMessage() {
        // Format the order details
        let message = `*طلب جديد من تطبيق سهرتنا*\n\n`;
        message += `*التفاصيل:*\n`;

        for (const itemName in state.cart) {
            const item = state.cart[itemName];
            const itemTotal = item.quantity * item.price;
            message += `- ${itemName} (${item.quantity}) → ${itemTotal.toLocaleString('ar-SY')} ليرة\n`;
        }

        message += `\n*المجموع:* ${state.total.toLocaleString('ar-SY')} ليرة\n`;
        message += `*رسوم التوصيل:* ${deliveryFee.toLocaleString('ar-SY')} ليرة\n`;
        message += `*المجموع الكلي:* ${(state.total + deliveryFee).toLocaleString('ar-SY')} ليرة سورية\n\n`;

        if (state.selectedLocation) {
            const mapsUrl = `https://www.google.com/maps?q=${state.selectedLocation.lat},${state.selectedLocation.lng}`;
            message += `*موقع التوصيل:*\n${mapsUrl}\n`;
            message += `الإحداثيات: ${state.selectedLocation.lat.toFixed(5)}, ${state.selectedLocation.lng.toFixed(5)}\n\n`;
        }

        message += `*شكراً لاستخدامكم تطبيق سهرتنا!*`;

        // Update the message display
        whatsappMessage.textContent = message;

        // Create WhatsApp link
        const phoneNumber = '+963945349776';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        whatsappSendLink.href = whatsappUrl;
    }

    // Start the application
    initApp();
});