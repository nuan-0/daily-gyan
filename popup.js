/**
 * DAILY GYAN WEB APP LOGIC - STABLE VERSION
 * Built for @Important4Exams GitHub Pages
 */

// --- 1. CONFIGURATION ---
const DAILY_LIMIT = 10;
const LOOP_DAYS = 60; // 60 days * 10 cards = 600 total items

/**
 * Updates the Visual Card, Colors, and Text
 * @param {number} globalIndex - The index (0-599) to pull from gyanDatabase
 */
function updateUI(globalIndex) {
    // Access the database (Checks both common variable names for safety)
    const db = window.gyanDatabase || window.gyanData || gyanDatabase;
    
    if (!db || !db[globalIndex]) {
        console.error("Data Point Missing at index:", globalIndex);
        return;
    }

    const item = db[globalIndex];

    // A. UPDATE CATEGORY (Checks for 'category' or 'cat')
    const catElement = document.getElementById('category');
    if (catElement) {
        catElement.innerText = (item.category || item.cat || "GENERAL GYAN").toUpperCase();
    }

    // B. UPDATE CONTENT (Checks for 'fact' or 'body' or 'title')
    const contentElement = document.getElementById('card-content');
    if (contentElement) {
        contentElement.innerText = item.fact || item.body || item.title || "Content Loading...";
    }

    // C. UPDATE CARD COLOR (If defined in gyan_data.js, e.g., color: "#ffcccc")
    const cardElement = document.getElementById('gyan-card');
    if (cardElement) {
        if (item.color) {
            cardElement.style.backgroundColor = item.color;
        } else {
            cardElement.style.backgroundColor = "#ffffff"; // Default Professional White
        }
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
 * Updates Button Text and Progress Tracker (Card X of 10)
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
        } else {
            btn.disabled = false;
            btn.innerText = "Next Surprise →";
            btn.style.opacity = "1";
        }
    }
}

/**
 * Main Initialization Logic
 */
function init() {
    const { startIndex, todayStr } = getCycleData();

    // WEB STORAGE (Using localStorage for GitHub Pages persistence)
    let savedDate = localStorage.getItem('gyan_savedDate');
    let clicks = parseInt(localStorage.getItem('gyan_clickCount')) || 0;

    // Reset Progress if a new day has started
    if (savedDate !== todayStr) {
        clicks = 0;
        localStorage.setItem('gyan_savedDate', todayStr);
        localStorage.setItem('gyan_clickCount', '0');
    }

    // Initial Load of the Card
    updateUI(startIndex + clicks);
    updateButtonAndProgress(clicks);

    // Attach Event Listener to "Next" Button
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

// Start once the page has loaded
document.addEventListener('DOMContentLoaded', () => {
    // 100ms delay ensures gyan_data.js is fully loaded in memory
    setTimeout(() => {
        if (typeof gyanDatabase !== 'undefined' || typeof gyanData !== 'undefined') {
            init();
        } else {
            const content = document.getElementById('card-content');
            if (content) {
                content.innerText = "Error: Data file not found. Please refresh.";
                console.error("Critical Error: gyanDatabase is not defined. Ensure gyan_data.js is loaded first.");
            }
        }
    }, 100);
});
