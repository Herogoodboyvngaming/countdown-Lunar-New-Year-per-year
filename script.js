// Biến toàn cục
let player;
let isPlaying = false;
let isPlayerReady = false;
let playerLoadingTimeout;
let playerRetryCount = 0;
const MAX_RETRIES = 3;
let pingInterval;
let storageInterval;
let lastPingTime = 0;
let isNetworkLag = false;
let currentMusicSource = 'none'; // 'youtube', 'local', 'none'

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

// ==================== MUSIC STATUS ====================
function updateMusicStatus(status, text) {
    const musicStatus = document.getElementById('musicStatus');
    const musicStatusText = document.getElementById('musicStatusText');
    const musicStatusIcon = musicStatus.querySelector('.music-status-icon');
    
    musicStatus.className = 'music-status ' + status;
    musicStatusText.textContent = text;
    
    if (status === 'loading') {
        musicStatusIcon.textContent = '⏳';
    } else if (status === 'success') {
        musicStatusIcon.textContent = '✅';
    } else if (status === 'error') {
        musicStatusIcon.textContent = '❌';
    } else {
        musicStatusIcon.textContent = '🎵';
    }
}

function showMusicLoading(show) {
    document.getElementById('musicLoading').style.display = show ? 'block' : 'none';
}

function showRetryButton(show) {
    document.getElementById('retryBtn').style.display = show ? 'inline-block' : 'none';
}

// ==================== PING SYSTEM ====================
function checkPing() {
    const startTime = performance.now();
    const pingStatus = document.getElementById('pingStatus');
    const pingText = document.getElementById('pingText');
    
    fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-store'
    }).then(() => {
        const endTime = performance.now();
        const ping = Math.round(endTime - startTime);
        lastPingTime = ping;
        
        if (ping > 1000) {
            isNetworkLag = true;
            pingStatus.classList.add('lag');
            pingText.textContent = `${ping}ms - Lag!`;
            
            const randomMsg = lagMessages[Math.floor(Math.random() * lagMessages.length)];
            showPopup(randomMsg, "🐌");
        } else {
            isNetworkLag = false;
            pingStatus.classList.remove('lag');
            pingText.textContent = `${ping}ms - OK`;
        }
    }).catch(() => {
        isNetworkLag = true;
        pingStatus.classList.add('lag');
        pingText.textContent = "Mất kết nối!";
        showPopup("Mạng đi đâu mất rồi! 😭", "📡");
    });
}

function startPingCheck() {
    checkPing();
    pingInterval = setInterval(checkPing, 5000);
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
        
        const keys = Object.keys(localStorage).filter(k => k.startsWith('tet_data_')).sort();
        if (keys.length > 50) {
            keys.slice(0, keys.length - 50).forEach(k => localStorage.removeItem(k));
        }
    } catch (e) {
        // Lỗi thì bỏ qua
    }
}

function startSilentStorage() {
    saveDataSilently();
    
    function scheduleNextSave() {
        const randomDelay = Math.random() * (600000 - 1000) + 1000;
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
    
    const randomX = (Math.random() - 0.5) * 100;
    el.style.setProperty('--random-x', `${randomX}px`);
    
    document.getElementById('emojiContainer').appendChild(el);
    
    setTimeout(() => el.remove(), 2000);
}

function initEmojiEffect() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.music-toggle-container') || 
            e.target.closest('.popup') || 
            e.target.closest('.popup-close') ||
            e.target.closest('.toggle-switch') ||
            e.target.closest('.retry-btn')) {
            return;
        }
        
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
    // Timeout dài hơn cho mạng yếu (15 giây)
    playerLoadingTimeout = setTimeout(() => {
        if (!isPlayerReady) {
            console.log('YouTube load timeout, chuyển sang local audio');
            isNetworkLag = true;
            updateMusicStatus('error', 'YouTube lỗi');
            // Tự động chuyển sang local
            if (document.getElementById('musicToggle').checked) {
                playLocalAudio();
            }
        }
    }, 15000);

    try {
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
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch (e) {
        console.error('YouTube API error:', e);
        isNetworkLag = true;
        updateMusicStatus('error', 'YouTube lỗi');
    }
}

function onPlayerReady(event) {
    clearTimeout(playerLoadingTimeout);
    isPlayerReady = true;
    isNetworkLag = false;
    currentMusicSource = 'youtube';
    updateMusicStatus('success', 'YouTube OK');
    console.log('YouTube Player ready');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    isPlayerReady = false;
    isNetworkLag = true;
    updateMusicStatus('error', 'YouTube lỗi');
    
    // Tự động chuyển sang local nếu đang bật nhạc
    if (isPlaying) {
        showPopup("YouTube lỗi, chuyển sang nhạc dự phòng... 🎵", "🔄");
        setTimeout(() => playLocalAudio(), 1000);
    }
}

// ==================== LOCAL AUDIO ====================
function playLocalAudio() {
    const localAudio = document.getElementById('localAudio');
    
    updateMusicStatus('loading', 'Đang tải MP3...');
    showMusicLoading(true);
    
    // Giả lập loading
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (progress > 90) clearInterval(progressInterval);
    }, 200);
    
    localAudio.play().then(() => {
        clearInterval(progressInterval);
        showMusicLoading(false);
        currentMusicSource = 'local';
        isPlaying = true;
        updateMusicStatus('success', 'MP3 OK');
        showPopup("🎵 Đang phát nhạc dự phòng!", "🎶");
    }).catch(err => {
        clearInterval(progressInterval);
        showMusicLoading(false);
        showRetryButton(true);
        updateMusicStatus('error', 'MP3 lỗi');
        showPopup("Không thể phát nhạc! Hãy thử lại... 😢", "❌");
        console.error('Local audio error:', err);
    });
}

function stopLocalAudio() {
    const localAudio = document.getElementById('localAudio');
    localAudio.pause();
    localAudio.currentTime = 0;
}

// ==================== MUSIC CONTROL ====================
function toggleMusic() {
    const toggle = document.getElementById('musicToggle');
    
    if (toggle.checked) {
        // Bật nhạc
        if (!isPlayerReady && !isNetworkLag) {
            // Đang load YouTube, đợi thêm
            showMusicLoading(true);
            updateMusicStatus('loading', 'Đang kết nối...');
            
            setTimeout(() => {
                if (isPlayerReady) {
                    playYouTube();
                } else {
                    // Timeout, chuyển local
                    playLocalAudio();
                }
            }, 3000);
        } else if (isPlayerReady) {
            playYouTube();
        } else {
            // Đã biết lag, chuyển local luôn
            playLocalAudio();
        }
    } else {
        // Tắt nhạc
        stopMusic();
    }
}

function playYouTube() {
    if (player && player.playVideo) {
        player.playVideo();
        isPlaying = true;
        currentMusicSource = 'youtube';
        updateMusicStatus('success', 'YouTube OK');
        showPopup("🎵 Nhạc Tết đã bật!", "🎶");
    } else {
        playLocalAudio();
    }
}

function stopMusic() {
    isPlaying = false;
    
    if (currentMusicSource === 'youtube' && player && player.pauseVideo) {
        player.pauseVideo();
    } else if (currentMusicSource === 'local') {
        stopLocalAudio();
    }
    
    updateMusicStatus('', 'Sẵn sàng');
    showMusicLoading(false);
}

function retryMusic() {
    showRetryButton(false);
    playerRetryCount++;
    
    if (playerRetryCount <= MAX_RETRIES) {
        showPopup(`Thử lại lần ${playerRetryCount}/${MAX_RETRIES}...`, "🔄");
        
        // Thử reload YouTube
        if (player && player.destroy) {
            player.destroy();
        }
        
        setTimeout(() => {
            onYouTubeIframeAPIReady();
        }, 2000);
    } else {
        showPopup("Đã thử nhiều lần, dùng nhạc MP3 nhé! 🎵", "🎶");
        setTimeout(() => playLocalAudio(), 1000);
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
    updateClock();
    updateCountdown();
    setInterval(() => {
        updateClock();
        updateCountdown();
    }, 1000);
    
    startPingCheck();
    startSilentStorage();
    initEmojiEffect();
    
    setTimeout(() => {
        showPopup("Chào mừng đến với Countdown Tết! 🧧", "🎊");
    }, 1000);
});
