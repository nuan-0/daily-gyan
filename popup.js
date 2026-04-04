let currentViewingIndex = 0;
let maxUnlocked = 0;
let startIndex = 0;

const vibrantColors = ['#FFEBEE', '#E3F2FD', '#F1F8E9', '#FFFDE7', '#F3E5F5', '#FFF3E0', '#E0F7FA'];

const weeklyMessages = [
    "Daily Revision Done! 📚",      
    "Daily Streak Maintained! 🔥",  
    "Quota Complete ✍️",           
    "Consistency Maintained 🔥",    
    "Goal Reached 🔒",              
    "Syllabus Covered ✅",          
    "See You Tomorrow! 👋"          
];

function updateUI(globalIndex) {
    // 1. Get your data
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    if (!db || !db[globalIndex]) return;

    const item = db[globalIndex];
    
    // 2. THIS IS THE FIX: We use 'item.body' because that is what you wrote in your JS file
    let catName = (item.cat || "GENERAL GYAN").toUpperCase();
    let titleText = item.title || ""; 
    let bodyText = item.body || ""; // Matches your "body" field

    // 3. Push to Screen
    document.getElementById('category').innerText = catName;
    
    // Ensure this ID exists in your index.html!
    const titleElement = document.getElementById('card-title');
    if(titleElement) titleElement.innerText = titleText; 

    document.getElementById('card-content').innerText = bodyText;

    // 4. Use YOUR custom colors from the data (e.g., #3498db)
    const card = document.getElementById('gyan-card');
    card.style.backgroundColor = item.color || "#ffffff";
    
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

// --- SWIPE FEATURE (MOBILE) ---
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchendX < touchstartX - swipeThreshold) handleNext(); // Swipe Left
    if (touchendX > touchstartX + swipeThreshold) handleBack(); // Swipe Right
}, false);

// --- KEYBOARD FEATURE (PC) ---
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
