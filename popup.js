/**
 * DAILY GYAN WEB APP LOGIC - 3D NEUMORPHIC EDITION
 * Features: Forward/Back Navigation & 10-Card Daily Limit
 * Built for @Important4Exams
 */

// --- 1. CONFIGURATION ---
const DAILY_LIMIT = 10;
const LOOP_DAYS = 60; 

// Track the current position in the session
let currentViewingIndex = 0; 

/**
 * Updates the Visual Card, Colors, and Text
 */
function updateUI(globalIndex) {
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    
    if (!db || !db[globalIndex]) {
        console.error("Data Point Missing at index:", globalIndex);
        return;
    }

    const item = db[globalIndex];

    // Update Category
    const catElement = document.getElementById('category');
    if (catElement) {
        catElement.innerText = (item.category || item.cat || "GYAN").toUpperCase();
    }

    // Update Content
    const contentElement = document.getElementById('card-content');
    if (contentElement) {
        contentElement.innerText = item.fact || item.body || item.title || "Content Loading...";
    }
}

/**
 * Calculates the Day of the Year for the 60-day loop logic
 */
function getCycleData() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // currentCycleDay will be 0 to 59
    const currentCycleDay = (dayOfYear - 1) % LOOP_DAYS;
    const startIndex = currentCycleDay * 10;

    return { startIndex, todayStr: now.toDateString() };
}

/**
 * Updates Button States and Progress Text
 */
function updateButtonAndProgress(currentIndex, maxUnlocked) {
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progressText = document.getElementById('progress-text');

    // Update Progress Text
    if (progressText) {
        progressText.innerText = `CARD ${currentIndex + 1} OF ${DAILY_LIMIT}`;
    }

    // BACK BUTTON: Disable if at the very first card
    if (backBtn) {
        backBtn.disabled = (currentIndex <= 0);
    }

    // NEXT BUTTON: Handle Forward vs Unlock vs Lock
    if (nextBtn) {
        if (currentIndex < maxUnlocked) {
            // User is moving forward through cards already seen
            nextBtn.disabled = false;
            nextBtn.innerText = "Forward →";
        } else if (maxUnlocked >= (DAILY_LIMIT - 1)) {
            // Daily limit reached (Index 9 is the 10th card)
            nextBtn.disabled = true;
            nextBtn.innerText = "Goal Reached 🔒";
        } else {
            // Standard next card unlock
            nextBtn.disabled = false;
            nextBtn.innerText = "Next Surprise →";
        }
    }
}

/**
 * Main Initialization Logic
 */
function init() {
    const { startIndex, todayStr } = getCycleData();

    // Load progress from LocalStorage
    let savedDate = localStorage.getItem('gyan_savedDate');
    let maxUnlocked = parseInt(localStorage.getItem('gyan_clickCount')) || 0;

    // Reset if it's a new day
    if (savedDate !== todayStr) {
        maxUnlocked = 0;
        localStorage.setItem('gyan_savedDate', todayStr);
        localStorage.setItem('gyan_clickCount', '0');
    }

    // Start user at their furthest progress point
    currentViewingIndex = maxUnlocked;

    // Initial Render
    updateUI(startIndex + currentViewingIndex);
    updateButtonAndProgress(currentViewingIndex, maxUnlocked);

    // --- NEXT BUTTON CLICK ---
    document.getElementById('next-btn').onclick = () => {
        let latestMax = parseInt(localStorage.getItem('gyan_clickCount')) || 0;

        if (currentViewingIndex < latestMax) {
            // Moving forward through seen cards
            currentViewingIndex++;
        } else if (latestMax < (DAILY_LIMIT - 1)) {
            // Unlocking a brand new card
            latestMax++;
            currentViewingIndex = latestMax;
            localStorage.setItem('gyan_clickCount', latestMax.toString());
        }

        updateUI(startIndex + currentViewingIndex);
        updateButtonAndProgress(currentViewingIndex, latestMax);
    };

    // --- BACK BUTTON CLICK ---
    document.getElementById('back-btn').onclick = () => {
        if (currentViewingIndex > 0) {
            currentViewingIndex--;
            const latestMax = parseInt(localStorage.getItem('gyan_clickCount')) || 0;
            updateUI(startIndex + currentViewingIndex);
            updateButtonAndProgress(currentViewingIndex, latestMax);
        }
    };
}

// Start once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 100ms delay ensures data file is parsed
    setTimeout(() => {
        if (typeof gyanDatabase !== 'undefined' || typeof gyanData !== 'undefined') {
            init();
        } else {
            const content = document.getElementById('card-content');
            if (content) content.innerText = "Error: Data file not found. Please refresh.";
        }
    }, 100);
});
