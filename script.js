// إحداثيات اللاذقية
const LATTAKIA = [35.5194, 35.7853];

// إنشاء الخريطة متمركزة على اللاذقية
const map = L.map('map').setView(LATTAKIA, 13);

// تحميل مربعات OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// متغيرات التتبع
let userMarker = null;
let markers = [];
let userLocation = null;

// عناصر DOM
const locateBtn = document.getElementById('locateBtn');
const resetBtn = document.getElementById('resetBtn');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const statusMessage = document.getElementById('statusMessage');
const latValue = document.getElementById('latValue');
const lngValue = document.getElementById('lngValue');
const accuracyValue = document.getElementById('accuracyValue');

// تحديث حالة الرسالة
function updateStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = 'status-content';
    
    switch(type) {
        case 'loading':
            statusMessage.classList.add('status-loading');
            break;
        case 'success':
            statusMessage.classList.add('status-success');
            break;
        case 'error':
            statusMessage.classList.add('status-error');
            break;
    }
}

// تحديث عرض الإحداثيات
function updateCoordinates(lat, lng, accuracy = null) {
    latValue.textContent = lat.toFixed(6);
    lngValue.textContent = lng.toFixed(6);
    
    if (accuracy !== null) {
        accuracyValue.textContent = `${accuracy.toFixed(1)} متر`;
    } else {
        accuracyValue.textContent = '--';
    }
}

// إنشاء أيقونة حمراء مخصصة
function createRedIcon() {
    return L.divIcon({
        className: 'red-marker',
        html: `
            <div class="marker-pin">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="pulse-ring"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

// إنشاء أيقونة زرقاء مخصصة
function createBlueIcon() {
    return L.divIcon({
        className: 'blue-marker',
        html: '<i class="fas fa-map-pin"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

// إضافة علامة حمراء في الموقع الحالي
function addUserMarker(lat, lng, accuracy = null) {
    // إزالة العلامة السابقة إن وجدت
    if (userMarker) {
        map.removeLayer(userMarker);
        markers = markers.filter(marker => marker !== userMarker);
    }
    
    // إنشاء علامة مخصصة باللون الأحمر
    const redIcon = createRedIcon();
    
    // إضافة العلامة إلى الخريطة
    userMarker = L.marker([lat, lng], {
        icon: redIcon,
        title: 'موقعك الحالي'
    }).addTo(map);
    
    // إضافة نافذة منبثقة
    const popupContent = `
        <div class="popup-content">
            <h4><i class="fas fa-user-circle"></i> موقعك الحالي</h4>
            <p><strong>خط العرض:</strong> ${lat.toFixed(6)}</p>
            <p><strong>خط الطول:</strong> ${lng.toFixed(6)}</p>
            ${accuracy ? `<p><strong>الدقة:</strong> ${accuracy.toFixed(1)} متر</p>` : ''}
            <p class="timestamp"><i class="far fa-clock"></i> ${new Date().toLocaleString('ar-SA')}</p>
        </div>
    `;
    
    userMarker.bindPopup(popupContent).openPopup();
    
    // تخزين العلامة
    markers.push(userMarker);
    
    // تحديث الإحداثيات
    updateCoordinates(lat, lng, accuracy);
    
    // تكبير الخريطة على الموقع
    map.setView([lat, lng], 15);
    
    return userMarker;
}

// إضافة علامة زرقاء للنقرات
function addClickMarker(lat, lng) {
    const blueIcon = createBlueIcon();
    
    const marker = L.marker([lat, lng], {
        icon: blueIcon,
        title: 'موقع محدّد'
    }).addTo(map);
    
    const popupContent = `
        <div class="popup-content">
            <h4><i class="fas fa-map-pin"></i> موقع محدّد</h4>
            <p><strong>خط العرض:</strong> ${lat.toFixed(6)}</p>
            <p><strong>خط الطول:</strong> ${lng.toFixed(6)}</p>
            <p class="timestamp"><i class="far fa-clock"></i> ${new Date().toLocaleString('ar-SA')}</p>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    markers.push(marker);
    
    return marker;
}

// العودة إلى اللاذقية
function resetToLattakia() {
    // إزالة جميع العلامات
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    markers = [];
    userMarker = null;
    userLocation = null;
    
    // العودة إلى اللاذقية
    map.setView(LATTAKIA, 13);
    
    // إضافة علامة للاذقية
    const lattakiaMarker = L.marker(LATTAKIA, {
        title: 'اللاذقية، سوريا'
    }).addTo(map);
    
    lattakiaMarker.bindPopup(`
        <div class="popup-content">
            <h4><i class="fas fa-city"></i> اللاذقية، سوريا</h4>
            <p>مركز الخريطة الرئيسي</p>
            <p>خط العرض: ${LATTAKIA[0].toFixed(6)}</p>
            <p>خط الطول: ${LATTAKIA[1].toFixed(6)}</p>
        </div>
    `).openPopup();
    
    markers.push(lattakiaMarker);
    
    // تحديث الإحداثيات
    updateCoordinates(LATTAKIA[0], LATTAKIA[1]);
    
    // تحديث الحالة
    updateStatus('تم العودة إلى اللاذقية، سوريا', 'success');
}

// تحديد الموقع الحالي
function getUserLocation() {
    if (!navigator.geolocation) {
        updateStatus('المتصفح لا يدعم تحديد الموقع الجغرافي', 'error');
        return;
    }
    
    updateStatus('جاري تحديد موقعك...', 'loading');
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
        // نجاح
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            userLocation = {
                latitude: lat,
                longitude: lng,
                accuracy: accuracy
            };
            
            // إضافة علامة الموقع
            addUserMarker(lat, lng, accuracy);
            
            // تحديث الحالة
            updateStatus(`تم تحديد موقعك بنجاح! الدقة: ${accuracy.toFixed(1)} متر`, 'success');
        },
        // فشل
        (error) => {
            let errorMsg = 'تعذر تحديد موقعك. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'تم رفض الإذن. يرجى السماح بالوصول إلى الموقع.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'معلومات الموقع غير متوفرة.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'انتهت مهلة طلب الموقع.';
                    break;
                default:
                    errorMsg += 'حدث خطأ غير معروف.';
                    break;
            }
            
            updateStatus(errorMsg, 'error');
            
            // العودة إلى اللاذقية كبديل
            setTimeout(() => {
                resetToLattakia();
                updateStatus('تم العودة إلى اللاذقية كموقع بديل', 'info');
            }, 2000);
        },
        options
    );
}

// إضافة CSS مخصص
const customStyles = `
    .red-marker {
        background: transparent;
        border: none;
    }
    
    .marker-pin {
        width: 40px;
        height: 40px;
        color: #e74c3c;
        font-size: 40px;
        text-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        animation: bounce 1s ease infinite alternate;
    }
    
    .pulse-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border: 2px solid #e74c3c;
        border-radius: 50%;
        animation: pulse 1.5s ease-out infinite;
        opacity: 0;
    }
    
    .blue-marker {
        color: #3498db;
        font-size: 40px;
        text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        background: transparent;
        border: none;
    }
    
    .popup-content {
        text-align: right;
        font-family: 'Cairo', sans-serif;
    }
    
    .popup-content h4 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 1.2rem;
    }
    
    .popup-content p {
        margin: 5px 0;
        color: #555;
    }
    
    .timestamp {
        font-size: 0.8rem;
        color: #95a5a6;
        margin-top: 10px;
        border-top: 1px solid #eee;
        padding-top: 5px;
    }
    
    @keyframes bounce {
        from {
            transform: translateY(0px);
        }
        to {
            transform: translateY(-10px);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(0.5);
            opacity: 0.8;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

// إضافة الأنماط المخصصة إلى الصفحة
const styleSheet = document.createElement('style');
styleSheet.textContent = customStyles;
document.head.appendChild(styleSheet);

// مستمعو الأحداث
locateBtn.addEventListener('click', getUserLocation);

resetBtn.addEventListener('click', resetToLattakia);

zoomInBtn.addEventListener('click', () => {
    map.zoomIn();
});

zoomOutBtn.addEventListener('click', () => {
    map.zoomOut();
});

// النقر على الخريطة لإضافة علامات
map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    
    addClickMarker(lat, lng);
    updateCoordinates(lat, lng);
    
    updateStatus(`تم إضافة علامة في الإحداثيات: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'success');
});

// تهيئة الخريطة باللاذقية عند التحميل
window.addEventListener('load', () => {
    resetToLattakia();
    updateStatus('مرحباً! اضغط على زر "تحديد موقعي" للعثور على موقعك الحالي', 'info');
});