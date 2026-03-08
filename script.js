// Biến toàn cục
let player;
let isPlaying = false;
let isPlayerReady = false;
let pingInterval;
let storageInterval;
let lastPingTime = 0;

// Dữ liệu con giáp
const zodiacAnimals = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const zodiacIcons = ["🐭", "🐮", "🐯", "🐰", "🐉", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];
const canChi = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

// Emoji cho hiệu ứng click
const clickEmojis = ["🧧", "🎊", "🎉", "🏮", "🎋", "🍊", "🌸", "✨", "💫", "⭐", "🔥", "💖", "🎆", "🎇", "🐉", "🐍", "🧨", "🎁"];

// Thông báo lag ngẫu nhiên
const lagMessages = [
    "Oh no mạng bạn đang bị lag 😫",
    "Mạng chậm quá, tết đến nơi rồi! 🐌",
    "Lag vl, đổi mạng đi bạn ơi! 📉",
    "Mạng như rùa bò... 🐢",
    "Loading... loading... mãi không xong! ⏳",
    "Mạng lag, Tết sắp hết! 😱",
    "Bình tĩnh, mạng đang ngủ đông... 😴",
    "Lag quá, xin hãy chờ đợi! 🙏"
];

// Mệnh nạp âm
function getNapAmMenh(canIndex, chiIndex) {
    const napAmTable = [
        ["Hải Trung Kim", "Hải Trung Kim", "Lư Trung Hỏa", "Lư Trung Hỏa", "Đại Lâm Mộc", "Đại Lâm Mộc", "Lộ Bàng Thổ", "Lộ Bàng Thổ", "Kiếm Phong Kim", "Kiếm Phong Kim", "Sơn Đầu Hỏa", "Sơn Đầu Hỏa"],
        ["Giản Hạ Thủy", "Giản Hạ Thủy", "Thành Đầu Thổ", "Thành Đầu Thổ", "Bạch Lạp Kim", "Bạch Lạp Kim", "Dương Liễu Mộc", "Dương Liễu Mộc", "Tuyền Trung Thủy", "Tuyền Trung Thủy", "Ốc Thượng Thổ", "Ốc Thượng Thổ"],
        ["Tích Lịch Hỏa", "Tích Lịch Hỏa", "Tùng Bách Mộc", "Tùng Bách Mộc", "Trường Lưu Thủy", "Trường Lưu Thủy", "Sa Trung Kim", "Sa Trung Kim", "Thiên Thượng Hỏa", "Thiên Thượng Hỏa", "Bình Địa Mộc", "Bình Địa Mộc"],
        ["Bích Thượng Thổ", "Bích Thượng Thổ", "Kim Bạc Kim", "Kim Bạc Kim", "Phúc Đăng Hỏa", "Phúc Đăng Hỏa", "Thiên Hà Thủy", "Thiên Hà Thủy", "Đại Trạch Thổ", "Đại Trạch Thổ", "Thoa Xuyến Kim", "Thoa Xuyến Kim"],
        ["Tang Đố Mộc", "Tang Đố Mộc", "Đại Khê Thủy", "Đại Khê Thủy", "Sa Trung Thổ", "Sa Trung Thổ", "Thiên Thượng Hỏa", "Thiên Thượng Hỏa", "Thạch Lựu Mộc", "Thạch Lựu Mộc", "Đại Hải Thủy", "Đại Hải Thủy"]
    ];
    const canGroup = Math.floor(canIndex / 2);
    return napAmTable[canGroup][chiIndex];
}

// Bảng ngày Tết
const tetDates = {
    2024: new Date("2024-02-10T00:00:00"),
    2025: new Date("2025-01-29T00:00:00"),
    2026: new Date("2026-02-17T00:00:00"),
    2027: new Date("2027-02-06T00:00:00"),
    2028: new Date("2028-01-26T00:00:00"),
    2029: new Date("2029-02-13T00:00:00"),
    2030: new Date("2030-02-03T00:00:00")
};

// ==================== POPUP SYSTEM ====================
function showPopup(content, icon = "📢") {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popupOverlay');
    const popupIcon = document.getElementById('popupIcon');
    const popupContent = document.getElementById('popupContent');
    
    popupIcon.textContent = icon;
    popupContent.textContent = content;
    
    popup.classList.add('active');
    overlay.classList.add('active');
    
    // Tự động đóng sau 5 giây
    setTimeout(closePopup, 5000);
}

function closePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popupOverlay');
    
    popup.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
        popup.classList.remove('active');
        overlay.classList.remove('active');
        popup.style.animation = '';
    }, 300);
}

// ==================== PING SYSTEM ====================
function checkPing() {
    const startTime = performance.now();
    const pingStatus = document.getElementById('pingStatus');
    const pingText = document.getElementById('pingText');
    
    // Tạo request để đo ping
    fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-store'
    }).then(() => {
        const endTime = performance.now();
        const ping = Math.round(endTime - startTime);
        lastPingTime = ping;
        
        if (ping > 1000) {
            pingStatus.classList.add('lag');
            pingText.textContent = `${ping}ms - Lag!`;
            
            // Hiển thị thông báo ngẫu nhiên
            const randomMsg = lagMessages[Math.floor(Math.random() * lagMessages.length)];
            showPopup(randomMsg, "🐌");
        } else {
            pingStatus.classList.remove('lag');
            pingText.textContent = `${ping}ms - OK`;
        }
    }).catch(() => {
        pingStatus.classList.add('lag');
        pingText.textContent = "Mất kết nối!";
        showPopup("Mạng đi đâu mất rồi! 😭", "📡");
    });
}

function startPingCheck() {
    checkPing();
    pingInterval = setInterval(checkPing, 5000); // Kiểm tra mỗi 5 giây
}

// ==================== LOCAL STORAGE SYSTEM ====================
function generateRandomData() {
    return {
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
        userAgent: navigator.userAgent.substring(0, 50),
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        ping: lastPingTime,
        visitCount: (parseInt(localStorage.getItem('visitCount') || '0') + 1).toString()
    };
}

function saveDataSilently() {
    const data = generateRandomData();
    const storageKey = `tet_data_${Date.now()}`;
    
    try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        localStorage.setItem('visitCount', data.visitCount);
        
        // Xóa dữ liệu cũ (giữ lại 50 bản ghi gần nhất)
        const keys = Object.keys(localStorage).filter(k => k.startsWith('tet_data_')).sort();
        if (keys.length > 50) {
            keys.slice(0, keys.length - 50).forEach(k => localStorage.removeItem(k));
        }
    } catch (e) {
        // Lỗi thì bỏ qua, không thông báo
    }
}

function startSilentStorage() {
    // Lưu ngay lập tức
    saveDataSilently();
    
    // Lưu ngẫu nhiên từ 1s đến 10 phút
    function scheduleNextSave() {
        const randomDelay = Math.random() * (600000 - 1000) + 1000; // 1s - 10 phút
        storageInterval = setTimeout(() => {
            saveDataSilently();
            scheduleNextSave();
        }, randomDelay);
    }
    
    scheduleNextSave();
}

// ==================== EMOJI CLICK EFFECT ====================
function createFloatingEmoji(x, y) {
    const emoji = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    // Random hướng bay
    const randomX = (Math.random() - 0.5) * 100;
    el.style.setProperty('--random-x', `${randomX}px`);
    
    document.getElementById('emojiContainer').appendChild(el);
    
    setTimeout(() => el.remove(), 2000);
}

function initEmojiEffect() {
    document.addEventListener('click', (e) => {
        // Không tạo emoji khi click vào nút hoặc popup
        if (e.target.closest('.music-toggle-container') || 
            e.target.closest('.popup') || 
            e.target.closest('.popup-close')) {
            return;
        }
        
        // Tạo 3-5 emoji mỗi lần click
        const count = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 50;
                const offsetY = (Math.random() - 0.5) * 50;
                createFloatingEmoji(e.clientX + offsetX, e.clientY + offsetY);
            }, i * 100);
        }
    });
}

// ==================== YOUTUBE MUSIC ====================
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'fMskPmI4tp0',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'loop': 1,
            'playlist': 'fMskPmI4tp0'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

function toggleMusic() {
    if (!isPlayerReady) {
        showPopup("Nhạc đang tải, vui lòng đợi...", "⏳");
        document.getElementById('musicToggle').checked = false;
        return;
    }

    const toggle = document.getElementById('musicToggle');
    isPlaying = toggle.checked;

    if (isPlaying) {
        player.playVideo();
        showPopup("🎵 Nhạc Tết đã bật!", "🎶");
    } else {
        player.pauseVideo();
    }
}

// ==================== COUNTDOWN SYSTEM ====================
function getCanChiYear(year) {
    const canIndex = (year - 1984) % 10;
    const chiIndex = (year - 1984) % 12;
    return {
        can: canChi[canIndex],
        chi: zodiacAnimals[chiIndex],
        icon: zodiacIcons[chiIndex],
        napAm: getNapAmMenh(canIndex, chiIndex)
    };
}

function getTetDate(year) {
    if (tetDates[year]) {
        return new Date(tetDates[year]);
    }
    return new Date(year, 0, 29);
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh"
    });
    
    const dateStr = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Ho_Chi_Minh"
    });

    document.getElementById("clockTime").textContent = timeStr;
    document.getElementById("clockDate").textContent = dateStr;
}

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let targetYear = currentYear;
    let tetDate = getTetDate(currentYear);
    
    if (now >= tetDate) {
        targetYear = currentYear + 1;
        tetDate = getTetDate(targetYear);
    }

    const zodiac = getCanChiYear(targetYear);
    
    document.getElementById("zodiacIcon").textContent = zodiac.icon;
    document.getElementById("zodiacText").textContent = `Năm ${zodiac.can} ${zodiac.chi}`;
    document.getElementById("zodiacYear").textContent = `Năm ${targetYear} - ${zodiac.napAm}`;
    document.getElementById("targetYearNum").textContent = targetYear;

    const diff = tetDate - now;

    if (diff <= 0) {
        document.getElementById("countdown").style.display = "none";
        document.querySelector(".countdown-wrapper").style.display = "none";
        document.getElementById("celebration").classList.add("active");
        document.getElementById("celebrationText").innerHTML = 
            `Chúc mừng năm ${zodiac.can} ${zodiac.chi} ${targetYear}! 🧧<br>${zodiac.napAm}<br>Vạn sự như ý - An khang thịnh vượng`;
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("daysOnly").textContent = days;
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    // Khởi động đồng hồ
    updateClock();
    updateCountdown();
    setInterval(() => {
        updateClock();
        updateCountdown();
    }, 1000);
    
    // Khởi động các hệ thống
    startPingCheck();
    startSilentStorage();
    initEmojiEffect();
    
    // Popup chào mừng
    setTimeout(() => {
        showPopup("Chào mừng đến với Countdown Tết! 🧧", "🎊");
    }, 1000);
});
