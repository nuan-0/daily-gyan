/**
 * Fact101 LOGIC - NAVIGATION & COLOR SYNC
 */

let currentViewingIndex = 0;
let maxUnlocked = 0;
let startIndex = 0;

// High-Energy Vibrant Colors for the 3D Box
const vibrantColors = [
    '#FFEBEE', // Soft Red
    '#E3F2FD', // Sky Blue
    '#F1F8E9', // Mint Green
    '#FFFDE7', // Bright Yellow
    '#F3E5F5', // Lavender
    '#E0F7FA', // Cyan
    '#FFFFFF'  // Pure White
];

function updateUI(globalIndex) {
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    if (!db || !db[globalIndex]) return;

    const item = db[globalIndex];
    let catName = (item.category || item.cat || "Fact101").toUpperCase();
    
    // STRICT "QUIZ" TO "FACT101" OVERRIDE
    if (catName.includes("QUIZ")) { catName = "FACT101"; }

    document.getElementById('category').innerText = catName;
    document.getElementById('card-content').innerText = item.fact || item.body || "";

    // CHANGE COLOR ON TAP
    const card = document.getElementById('gyan-card');
    const randomColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    card.style.backgroundColor = randomColor;
    
    // 3D Bounce Animation
    card.style.transform = "scale(1.03)";
    setTimeout(() => { card.style.transform = "scale(1)"; }, 150);
}

function updateState() {
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progress = document.getElementById('progress-text');

    progress.innerText = `Fact101: ${currentViewingIndex + 1} OF 10`;
    
    // Back button state
    backBtn.disabled = (currentViewingIndex <= 0);

    // Next button state
    if (currentViewingIndex < maxUnlocked) {
        nextBtn.innerText = "Forward →";
        nextBtn.disabled = false;
    } else if (maxUnlocked >= 9) {
        nextBtn.innerText = "Goal Reached 🔒";
        nextBtn.disabled = true;
    } else {
        nextBtn.innerText = "Next Fact101 →";
        nextBtn.disabled = false;
    }
}

document.getElementById('next-btn').onclick = function() {
    if (currentViewingIndex < maxUnlocked) {
        currentViewingIndex++;
    } else if (maxUnlocked < 9) {
        maxUnlocked++;
        currentViewingIndex = maxUnlocked;
        localStorage.setItem('gyan_clickCount', maxUnlocked.toString());
    }
    updateUI(startIndex + currentViewingIndex);
    updateState();
};

document.getElementById('back-btn').onclick = function() {
    if (currentViewingIndex > 0) {
        currentViewingIndex--;
        updateUI(startIndex + currentViewingIndex);
        updateState();
    }
};

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

window.onload = function() {
    setTimeout(init, 100);
};
