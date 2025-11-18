// Configuration
const MAX_CLIPS = 20;
const MAX_CHARS = 10000;

// State
let clips = [];
let expanded = false;
let showPinnedOnly = false;
let pinnedClips = new Set();

// DOM Elements
const clipDisplay = document.getElementById('clip-display');
const emptyState = document.getElementById('empty-state');
const addSection = document.getElementById('add-section');
const newClipText = document.getElementById('new-clip-text');
const statsBar = document.getElementById('stats-bar');
const clipCount = document.getElementById('clip-count');
const pinnedCount = document.getElementById('pinned-count');

// Buttons
const addBtn = document.getElementById('add-btn');
const expandBtn = document.getElementById('expand-btn');
const copyAllBtn = document.getElementById('copy-all-btn');
const clearBtn = document.getElementById('clear-btn');
const pinFilterBtn = document.getElementById('pin-filter-btn');
const topBtn = document.getElementById('top-btn');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadClips();
  setupEventListeners();
});

// Load clips from storage
async function loadClips() {
  try {
    const result = await chrome.storage.local.get(['clips', 'pinnedClips']);
    clips = result.clips || [];
    pinnedClips = new Set(result.pinnedClips || []);
    renderClips();
    updateStats();
  } catch (error) {
    console.error('Error loading clips:', error);
  }
}

// Save clips to storage
async function saveClips() {
  try {
    await chrome.storage.local.set({ 
      clips: clips,
      pinnedClips: Array.from(pinnedClips)
    });
    updateStats();
    updateBadge();
  } catch (error) {
    console.error('Error saving clips:', error);
  }
}

// Update badge
function updateBadge() {
  chrome.runtime.sendMessage({ 
    action: 'updateBadge', 
    count: clips.length 
  });
}

// Render clips based on state
function renderClips() {
  clipDisplay.innerHTML = '';
  
  if (clips.length === 0) {
    emptyState.style.display = 'flex';
    clipDisplay.style.display = 'none';
    return;
  }
  
  emptyState.style.display = 'none';
  clipDisplay.style.display = 'block';
  
  // Filter clips if showing pinned only
  let displayClips = clips.map((clip, index) => ({ clip, index }));
  
  if (showPinnedOnly) {
    displayClips = displayClips.filter(({ index }) => pinnedClips.has(index));
  }
  
  // Sort: pinned first, then by timestamp
  displayClips.sort((a, b) => {
    const aIsPinned = pinnedClips.has(a.index);
    const bIsPinned = pinnedClips.has(b.index);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return b.clip.timestamp - a.clip.timestamp;
  });
  
  // Show clips based on expanded state
  const clipsToShow = expanded ? displayClips : displayClips.slice(0, 1);
  
  clipsToShow.forEach(({ clip, index }) => {
    const clipElement = createClipElement(clip, index);
    clipDisplay.appendChild(clipElement);
  });
  
  // Show expand hint if collapsed and more clips exist
  if (!expanded && displayClips.length > 1) {
    const hint = document.createElement('div');
    hint.className = 'expand-hint';
    hint.textContent = `+${displayClips.length - 1} more clips`;
    hint.onclick = () => toggleExpand();
    clipDisplay.appendChild(hint);
  }
}

// Create clip element
function createClipElement(clip, index) {
  const clipDiv = document.createElement('div');
  clipDiv.className = 'clip-item';
  if (pinnedClips.has(index)) {
    clipDiv.classList.add('pinned');
  }
  
  // Top row: metadata and timestamp
  const topRow = document.createElement('div');
  topRow.className = 'clip-top-row';
  
  if (clip.metadata && clip.metadata.url) {
    const metaLink = document.createElement('a');
    metaLink.href = clip.metadata.url;
    metaLink.target = '_blank';
    metaLink.className = 'clip-meta-link';
    metaLink.textContent = truncateUrl(clip.metadata.url);
    metaLink.title = clip.metadata.url;
    topRow.appendChild(metaLink);
  }
  
  const timestamp = document.createElement('span');
  timestamp.className = 'clip-timestamp';
  timestamp.textContent = formatTimestamp(clip.timestamp);
  topRow.appendChild(timestamp);
  
  clipDiv.appendChild(topRow);
  
  // Content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'clip-content';
  contentDiv.textContent = clip.text;
  contentDiv.onclick = () => copyToClipboard(clip.text);
  clipDiv.appendChild(contentDiv);
  
  // Actions (only show in expanded mode)
  if (expanded) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'clip-actions';
    
    const copyBtn = createButton('📋', () => copyToClipboard(clip.text), 'Copy');
    const deleteBtn = createButton('🗑️', () => deleteClip(index), 'Delete');
    const pinBtn = createButton(
      pinnedClips.has(index) ? '📌' : '📍', 
      () => togglePin(index),
      pinnedClips.has(index) ? 'Unpin' : 'Pin'
    );
    
    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(pinBtn);
    actionsDiv.appendChild(deleteBtn);
    clipDiv.appendChild(actionsDiv);
  }
  
  return clipDiv;
}

// Helper: Create button
function createButton(text, onClick, title = '') {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.onclick = onClick;
  btn.title = title;
  btn.className = 'action-btn';
  return btn;
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showFeedback('Copied!');
  } catch (error) {
    console.error('Failed to copy:', error);
    showFeedback('Failed to copy', true);
  }
}

// Copy all clips
async function copyAllClips() {
  if (clips.length === 0) return;
  
  const allText = clips.map(c => c.text).join('\n\n---\n\n');
  await copyToClipboard(allText);
}

// Delete clip
function deleteClip(index) {
  clips.splice(index, 1);
  
  // Reindex pinned clips
  const newPinned = new Set();
  pinnedClips.forEach(i => {
    if (i > index) newPinned.add(i - 1);
    else if (i < index) newPinned.add(i);
  });
  pinnedClips = newPinned;
  
  saveClips();
  renderClips();
  showFeedback('Deleted');
}

// Toggle pin
function togglePin(index) {
  if (pinnedClips.has(index)) {
    pinnedClips.delete(index);
  } else {
    pinnedClips.add(index);
  }
  saveClips();
  renderClips();
}

// Add new clip
async function addClip() {
  const text = newClipText.value.trim();
  
  if (!text) {
    showFeedback('Enter some text', true);
    return;
  }
  
  if (text.length > MAX_CHARS) {
    showFeedback(`Max ${MAX_CHARS} characters`, true);
    return;
  }
  
  // Get metadata from current tab
  let metadata = { url: 'Manual Entry' };
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      metadata = { url: tab.url, title: tab.title };
    }
  } catch (error) {
    console.log('Could not get tab info');
  }
  
  const newClip = {
    text: text,
    timestamp: Date.now(),
    metadata: metadata
  };
  
  clips.unshift(newClip);
  
  // Limit clips
  if (clips.length > MAX_CLIPS) {
    clips = clips.slice(0, MAX_CLIPS);
  }
  
  await saveClips();
  renderClips();
  
  // Clear and hide add section
  newClipText.value = '';
  toggleAddSection(false);
  showFeedback('Saved!');
}

// Toggle expand/collapse
function toggleExpand() {
  expanded = !expanded;
  expandBtn.textContent = expanded ? '−' : '≡';
  expandBtn.classList.toggle('active', expanded);
  renderClips();
}

// Toggle add section
function toggleAddSection(show = null) {
  const shouldShow = show !== null ? show : addSection.style.display === 'none';
  addSection.style.display = shouldShow ? 'block' : 'none';
  if (shouldShow) {
    newClipText.focus();
  }
}

// Toggle pinned filter
function togglePinnedFilter() {
  showPinnedOnly = !showPinnedOnly;
  pinFilterBtn.classList.toggle('active', showPinnedOnly);
  renderClips();
}

// Clear all clips
function clearAllClips() {
  if (clips.length === 0) return;
  
  if (confirm('Clear all clips? This cannot be undone.')) {
    clips = [];
    pinnedClips.clear();
    saveClips();
    renderClips();
    showFeedback('All cleared');
  }
}

// Pin to top (create new window)
async function pinToTop() {
  try {
    const win = await chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      width: 400,
      height: 600,
      top: 0,
      left: window.screen.width - 420
    });
    window.close(); // Close the popup
  } catch (error) {
    console.error('Failed to create window:', error);
    showFeedback('Failed to pin', true);
  }
}

// Update stats
function updateStats() {
  clipCount.textContent = `${clips.length} clip${clips.length !== 1 ? 's' : ''}`;
  
  const pinned = pinnedClips.size;
  if (pinned > 0) {
    pinnedCount.textContent = `• ${pinned} pinned`;
    pinnedCount.style.display = 'inline';
  } else {
    pinnedCount.style.display = 'none';
  }
}

// Show feedback
function showFeedback(message, isError = false) {
  const feedback = document.createElement('div');
  feedback.className = `feedback ${isError ? 'error' : 'success'}`;
  feedback.textContent = message;
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.classList.add('show'), 10);
  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => feedback.remove(), 300);
  }, 1500);
}

// Utility: Truncate URL
function truncateUrl(url) {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname.replace('www.', '');
    if (urlObj.pathname !== '/') {
      const path = urlObj.pathname.substring(0, 20);
      display += path + (urlObj.pathname.length > 20 ? '...' : '');
    }
    return display;
  } catch {
    return url.length > 35 ? url.substring(0, 32) + '...' : url;
  }
}

// Utility: Format timestamp
function formatTimestamp(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString();
}

// Event listeners
function setupEventListeners() {
  addBtn.addEventListener('click', () => toggleAddSection());
  expandBtn.addEventListener('click', toggleExpand);
  copyAllBtn.addEventListener('click', copyAllClips);
  clearBtn.addEventListener('click', clearAllClips);
  pinFilterBtn.addEventListener('click', togglePinnedFilter);
  topBtn.addEventListener('click', pinToTop);
  saveBtn.addEventListener('click', addClip);
  cancelBtn.addEventListener('click', () => toggleAddSection(false));
  
  // Keyboard shortcuts
  newClipText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      addClip();
    } else if (e.key === 'Escape') {
      toggleAddSection(false);
    }
  });
}