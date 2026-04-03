// --- CONFIGURATION ---
const DAILY_LIMIT = 10;
const LOOP_DAYS = 60; // Your 60-day/600-item cycle

function updateUI(globalIndex) {
  const item = gyanDatabase[globalIndex] || gyanDatabase[0];
  const card = document.getElementById('gyan-card');
  card.style.backgroundColor = item.color || "#34495e";
  document.getElementById('category').innerText = item.cat;
  document.getElementById('title').innerText = item.title;
  document.getElementById('content').innerText = item.body;
}

function initializeDailyContent() {
  const now = new Date();
  const todayStr = now.toDateString();
  
  // Calculate Day of the Year
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // The 60-day rotation logic
  const currentCycleDay = (dayOfYear - 1) % LOOP_DAYS; 
  const startIndex = currentCycleDay * 10;

  chrome.storage.local.get(['savedDate', 'clickCount'], (data) => {
    let clicks = data.clickCount || 0;

    // Reset if it's a new day
    if (data.savedDate !== todayStr) {
      clicks = 0;
      chrome.storage.local.set({ savedDate: todayStr, clickCount: 0 });
    }

    const finalIndex = (startIndex + clicks);
    updateUI(finalIndex);
    updateButtonState(clicks);
  });
}

function updateButtonState(clicks) {
  const btn = document.getElementById('next-btn');
  const msg = document.getElementById('status-msg');
  
  if (clicks >= (DAILY_LIMIT - 1)) {
    btn.disabled = true;
    btn.innerText = "Daily Goal Reached! 🔒";
    msg.innerHTML = "<b style='color:#e74c3c;'>All 10 revision cards done! See you tomorrow.</b>";
  } else {
    btn.disabled = false;
    msg.innerText = `Card ${clicks + 1} of ${DAILY_LIMIT} today`;
  }
}

document.getElementById('next-btn').addEventListener('click', () => {
  chrome.storage.local.get(['clickCount'], (data) => {
    let currentClicks = data.clickCount || 0;
    if (currentClicks < (DAILY_LIMIT - 1)) {
      let newClicks = currentClicks + 1;
      
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const currentCycleDay = (dayOfYear - 1) % LOOP_DAYS;
      const startIndex = currentCycleDay * 10;

      chrome.storage.local.set({ clickCount: newClicks }, () => {
        updateUI(startIndex + newClicks);
        updateButtonState(newClicks);
      });
    }
  });
});

// --- FAVORITES LOGIC ---
document.getElementById('fav-btn').addEventListener('click', () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const currentCycleDay = (dayOfYear - 1) % LOOP_DAYS;
  const startIndex = currentCycleDay * 10;

  chrome.storage.local.get(['clickCount', 'myFavs'], (data) => {
    const clicks = data.clickCount || 0;
    const currentItem = gyanDatabase[startIndex + clicks] || gyanDatabase[0];
    let favs = data.myFavs || [];
    if (!favs.find(f => f.id === currentItem.id)) {
      favs.push(currentItem);
      chrome.storage.local.set({ myFavs: favs }, loadFavs);
    }
  });
});

function loadFavs() {
  chrome.storage.local.get(['myFavs'], (result) => {
    const list = document.getElementById('favs-ul');
    list.innerHTML = '';
    const favs = result.myFavs || [];
    favs.forEach((fav) => {
      let li = document.createElement('li');
      li.className = 'fav-item';
      li.innerHTML = `<span><b>${fav.title}</b></span> <span class="remove-btn" data-id="${fav.id}">&#10006;</span>`;
      list.appendChild(li);
    });
  });
}

document.getElementById('fav-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const idToRemove = parseInt(e.target.getAttribute('data-id'));
    chrome.storage.local.get(['myFavs'], (result) => {
      let favs = result.myFavs.filter(f => f.id !== idToRemove);
      chrome.storage.local.set({ myFavs: favs }, loadFavs);
    });
  }
});

// --- SUPPORT LINK ---
document.getElementById('support-link').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://upilinks.in/payment-link/upi925459343" });
});

document.addEventListener('DOMContentLoaded', () => {
  initializeDailyContent();
  loadFavs();
});