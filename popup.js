let currentViewingIndex = 0;
let maxUnlocked = 0;
let startIndex = 0;

// High-Energy Attractive Colors for the Big Box
const vibrantColors = ['#FFEBEE', '#E3F2FD', '#F1F8E9', '#FFFDE7', '#F3E5F5', '#FFF3E0', '#E0F7FA'];

// YOUR EXACT 7-DAY MESSAGE CYCLE
const weeklyMessages = [
    "Daily Revision Done! 📚",      // Sunday (Index 0)
    "Daily Streak Maintained! 🔥",  // Monday (Index 1)
    "Quota Complete ✍️",           // Tuesday (Index 2)
    "Consistency Maintained 🔥",    // Wednesday (Index 3)
    "Goal Reached 🔒",              // Thursday (Index 4)
    "Syllabus Covered ✅",          // Friday (Index 5)
    "See You Tomorrow! 👋"          // Saturday (Index 6)
];

function updateUI(globalIndex) {
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    if (!db || !db[globalIndex]) return;

    const item = db[globalIndex];
    let catName = (item.category || item.cat || "GENERAL GYAN").toUpperCase();
    
    // Replace QUIZ with FACT101 only
    if (catName.includes("QUIZ")) { catName = "FACT101"; }

    document.getElementById('category').innerText = catName;
    document.getElementById('card-content').innerText = item.fact || item.body || "";

    // APPLY DYNAMIC COLOR TO BIG BOX
    const card = document.getElementById('gyan-card');
    const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    card.style.backgroundColor = color;
    
    // 3D Bounce
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

window.onload = function() { setTimeout(init, 100); };
