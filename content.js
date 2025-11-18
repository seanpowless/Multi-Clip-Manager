// Content script for MCM v1.1.0
// Handles keyboard shortcuts, notifications, and pasting

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showNotification') {
    showNotification(message.message, 'success');
  } else if (message.action === 'pasteText') {
    pasteTextToActiveElement(message.text);
  }
});

// Listen for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+C to save selected text
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
      e.preventDefault();
      saveSelectedText(selectedText);
    }
  }
});

// Save selected text to MCM
function saveSelectedText(text) {
  if (text.length > 10000) {
    showNotification('Text too long (max 10,000 characters)', 'error');
    return;
  }
  
  chrome.runtime.sendMessage({
    action: 'saveClip',
    data: { text: text }
  }, (response) => {
    if (response && response.success) {
      showNotification('Saved to MCM!', 'success');
    } else {
      showNotification('Failed to save', 'error');
    }
  });
}

// Paste text to currently focused element
function pasteTextToActiveElement(text) {
  const activeElement = document.activeElement;
  
  // Check if active element is an input or textarea
  if (activeElement && (activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.isContentEditable)) {
    
    // For input/textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const currentValue = activeElement.value;
      
      // Insert text at cursor position
      activeElement.value = currentValue.substring(0, start) + text + currentValue.substring(end);
      
      // Set cursor position after inserted text
      const newPosition = start + text.length;
      activeElement.selectionStart = newPosition;
      activeElement.selectionEnd = newPosition;
      
      // Trigger input event for frameworks like React
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      
      showNotification('Pasted from MCM!', 'success');
    }
    // For contentEditable elements
    else if (activeElement.isContentEditable) {
      document.execCommand('insertText', false, text);
      showNotification('Pasted from MCM!', 'success');
    }
  } else {
    // No editable element focused, just copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard (no input focused)', 'info');
    });
  }
}

// Show notification on page
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.getElementById('mcm-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'mcm-notification';
  notification.textContent = message;
  
  // Styles
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#667eea'
  };
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '6px',
    background: colors[type] || colors.info,
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '999999',
    opacity: '0',
    transform: 'translateX(400px)',
    transition: 'all 0.3s ease'
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  });
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}