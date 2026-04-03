// GLOBAL VARIABLES - Move outside to ensure they stay in memory
let currentViewingIndex = 0;
let maxUnlocked = 0;
let startIndex = 0;

// Random colors for the 3D card experience
const colors = ['#ffffff', '#fff5f5', '#f0fff4', '#fffaf0', '#f5f5ff', '#faf5ff'];

function updateUI(globalIndex) {
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    if (!db || !db[globalIndex]) return;

    const item = db[globalIndex];
    document.getElementById('category').innerText = (item.category || item.cat || "GYAN").toUpperCase();
    document.getElementById('card-content').innerText = item.fact || item.body || "";

    // CHANGE CARD COLOR ON EVERY TAP
    const card = document.getElementById('gyan-card');
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    card.style.backgroundColor = randomColor;
}

function updateButtons() {
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progress = document.getElementById('progress-text');

    progress.innerText = `CARD ${currentViewingIndex + 1} OF 10`;

    // Back button works if we aren't at the first card
    backBtn.disabled = (currentViewingIndex <= 0);

    if (currentViewingIndex < maxUnlocked) {
        nextBtn.innerText = "Forward →";
        nextBtn.disabled = false;
    } else if (maxUnlocked >= 9) {
        nextBtn.innerText = "Goal Reached 🔒";
        nextBtn.disabled = true;
    } else {
        nextBtn.innerText = "Next Surprise →";
        nextBtn.disabled = false;
    }
}

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
    updateButtons();
}

// ATTACH CLICKS DIRECTLY
document.getElementById('next-btn').onclick = function() {
    if (currentViewingIndex < maxUnlocked) {
        currentViewingIndex++;
    } else if (maxUnlocked < 9) {
        maxUnlocked++;
        currentViewingIndex = maxUnlocked;
        localStorage.setItem('gyan_clickCount', maxUnlocked.toString());
    }
    updateUI(startIndex + currentViewingIndex);
    updateButtons();
};

document.getElementById('back-btn').onclick = function() {
    if (currentViewingIndex > 0) {
        currentViewingIndex--;
        updateUI(startIndex + currentViewingIndex);
        updateButtons();
    }
};

window.onload = function() {
    setTimeout(init, 150);
};
