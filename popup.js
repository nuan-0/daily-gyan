let currentViewingIndex = 0;
let maxUnlocked = 0;
let startIndex = 0;

// 1. FORCED LIGHT PALETTE (Ensures the box is never dark)
const lightPastelColors = [
    '#FFFFFF', // Pure White
    '#F9FAFB', // Ghost White
    '#F0F9FF', // Soft Sky
    '#F0FFF4', // Soft Mint
    '#FFF5F5', // Soft Rose
    '#FAF5FF', // Soft Lavender
    '#FFFFF0'  // Ivory
];

// 2. YOUR 7-DAY MESSAGE CYCLE
const weeklyMessages = [
    "Daily Revision Done! 📚",      // Sun
    "Daily Streak Maintained! 🔥",  // Mon
    "Quota Complete ✍️",           // Tue
    "Consistency Maintained 🔥",    // Wed
    "Goal Reached 🔒",              // Thu
    "Syllabus Covered ✅",          // Fri
    "See You Tomorrow! 👋"          // Sat
];

function updateUI(globalIndex) {
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    if (!db || !db[globalIndex]) return;

    const item = db[globalIndex];
    
    // Mapping your data fields: cat, title, body
    document.getElementById('category').innerText = (item.cat || "GENERAL GYAN").toUpperCase();
    document.getElementById('card-title').innerText = item.title || "";
    document.getElementById('card-content').innerText = item.body || "";

    const card = document.getElementById('gyan-card');
    
    // THE FIX: Ignore item.color from data and use our Light Palette
    const randomLightColor = lightPastelColors[Math.floor(Math.random() * lightPastelColors.length)];
    card.style.backgroundColor = randomLightColor;
    
    // 3D Pop Effect
    card.style.transform = "scale(1.02)";
    setTimeout(() => { card.style.transform = "scale(1)"; }, 150);
}

function updateState() {
    const nextBtn = document.getElementById('next-btn');
    const btnText = document.getElementById('btn-text');
    const dateText = document.getElementById('finish-date');
    const backBtn = document.getElementById('back-btn');
    const progress = document.getElementById('progress-text');

    progress.innerText = `Card ${currentViewingIndex + 1} of 10 today`;
    backBtn.disabled = (currentViewingIndex <= 0);

    if (currentViewingIndex < maxUnlocked) {
        btnText.innerText = "Forward →";
        dateText.style.display = "none";
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
    } else if (maxUnlocked >= 9) {
        const now = new Date();
        btnText.innerText = weeklyMessages[now.getDay()];
        dateText.innerText = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        dateText.style.display = "block";
        nextBtn.disabled = true;
        nextBtn.style.opacity = "0.7";
    } else {
        btnText.innerText = "Next Surprise →";
        dateText.style.display = "none";
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
    }
}

function handleNext() {
    if (currentViewingIndex < maxUnlocked) {
        currentViewingIndex++;
    } else if (maxUnlocked < 9) {
        maxUnlocked++;
        currentViewingIndex = maxUnlocked;
        localStorage.setItem('gyan_clickCount', maxUnlocked.toString());
    }
    updateUI(startIndex + currentViewingIndex);
    updateState();
}

function handleBack() {
    if (currentViewingIndex > 0) {
        currentViewingIndex--;
        updateUI(startIndex + currentViewingIndex);
        updateState();
    }
}

document.getElementById('next-btn').onclick = handleNext;
document.getElementById('back-btn').onclick = handleBack;

// MOBILE SWIPE SUPPORT
let touchstartX = 0;
document.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, false);
document.addEventListener('touchend', e => {
    let touchendX = e.changedTouches[0].screenX;
    if (touchendX < touchstartX - 50) handleNext(); // Swipe Left to go Next
    if (touchendX > touchstartX + 50) handleBack(); // Swipe Right to go Back
}, false);

// PC KEYBOARD SUPPORT
document.addEventListener('keydown', e => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handleBack();
});

function init() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    startIndex = ((dayOfYear - 1) % 60) * 10;
    let savedDate = localStorage.getItem('gyan_savedDate');
    maxUnlocked = parseInt(localStorage.getItem('gyan_clickCount')) || 0;
    if (savedDate !== now.toDateString()) {
        maxUnlocked = 0;
        localStorage.setItem('gyan_savedDate', now.toDateString());
        localStorage.setItem('gyan_clickCount', '0');
    }
    currentViewingIndex = maxUnlocked;
    updateUI(startIndex + currentViewingIndex);
    updateState();
}
window.onload = function() { setTimeout(init, 100); };
