/**
 * DAILY GYAN WEB APP LOGIC
 * Created for @Important4Exams
 * Optimized for Mobile Browsers & GitHub Pages
 */

// --- 1. CONFIGURATION ---
const DAILY_LIMIT = 10;
const LOOP_DAYS = 60; // 60 days * 10 cards = 600 total facts

/**
 * Updates the Visual Card and Text
 * @param {number} globalIndex - The exact index in gyanDatabase (0-599)
 */
function updateUI(globalIndex) {
    // Safety check: Use gyanDatabase (from gyan_data.js)
    const db = window.gyanDatabase || gyanDatabase;
    
    if (!db || !db[globalIndex]) {
        console.error("Data Point Missing at index:", globalIndex);
        return;
    }

    const item = db[globalIndex];

    // Update Category Badge
    const catElement = document.getElementById('category');
    if (catElement) catElement.innerText = item.category || "GENERAL GYAN";

    // Update Main Fact Content
    const contentElement = document.getElementById('card-content');
    if (contentElement) contentElement.innerText = item.fact || item.body || "Content loading error...";
}

/**
 * Calculates which day of the 60-day cycle we are on
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
 * Handles the "Next" button logic and daily lock
 */
function updateButtonAndProgress(clicks) {
    const btn = document.getElementById('next-btn');
    const progressText = document.getElementById('progress-text');

    if (progressText) {
        progressText.innerText = `Card ${clicks + 1} of ${DAILY_LIMIT} today`;
    }

    if (btn) {
        if (clicks >= (DAILY_LIMIT - 1)) {
            btn.disabled = true;
            btn.innerText = "Daily Goal Reached! 🔒";
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
        } else {
            btn.disabled = false;
            btn.innerText = "Next Surprise →";
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    }
}

/**
 * Main Initialization
 */
function init() {
    const { startIndex, todayStr } = getCycleData();

    // Load user progress from Browser Local Storage
    let savedDate = localStorage.getItem('gyan_savedDate');
    let clicks = parseInt(localStorage.getItem('gyan_clickCount')) || 0;

    // Reset progress if a new day has started
    if (savedDate !== todayStr) {
        clicks = 0;
        localStorage.setItem('gyan_savedDate', todayStr);
        localStorage.setItem('gyan_clickCount', '0');
    }

    // Show the current fact
    updateUI(startIndex + clicks);
    updateButtonAndProgress(clicks);

    // Attach Event Listener to Button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let currentClicks = parseInt(localStorage.getItem('gyan_clickCount')) || 0;

            if (currentClicks < (DAILY_LIMIT - 1)) {
                let newClicks = currentClicks + 1;
                localStorage.setItem('gyan_clickCount', newClicks.toString());
                
                updateUI(startIndex + newClicks);
                updateButtonAndProgress(newClicks);
            }
        });
    }
}

// Run the app when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if data file is actually loaded
    if (typeof gyanDatabase !== 'undefined') {
        init();
    } else {
        const content = document.getElementById('card-content');
        if (content) content.innerText = "Error: Data file not found. Please refresh.";
    }
});
