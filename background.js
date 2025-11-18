// Background service worker for MCM v1.1.0

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('MCM v1.1.0 installed');
  
  // Create "Copy to MCM" context menu
  chrome.contextMenus.create({
    id: 'copy-to-mcm',
    title: 'Copy to MCM',
    contexts: ['selection']
  });
  
  // Create "Paste from MCM" parent menu
  chrome.contextMenus.create({
    id: 'paste-from-mcm',
    title: 'Paste from MCM',
    contexts: ['editable']
  });
  
  // Initialize storage and update menus
  chrome.storage.local.get(['clips'], (result) => {
    if (!result.clips) {
      chrome.storage.local.set({ clips: [], pinnedClips: [] });
    } else {
      updatePasteMenu(result.clips);
    }
    updateBadge(result.clips?.length || 0);
  });
});

// Update paste menu with current clips
function updatePasteMenu(clips) {
  // Remove all existing paste submenus
  chrome.contextMenus.removeAll(() => {
    // Recreate base menus
    chrome.contextMenus.create({
      id: 'copy-to-mcm',
      title: 'Copy to MCM',
      contexts: ['selection']
    });
    
    chrome.contextMenus.create({
      id: 'paste-from-mcm',
      title: 'Paste from MCM',
      contexts: ['editable']
    });
    
    // Add clips as nested items (max 10 for UI cleanliness)
    const clipsToShow = clips.slice(0, 10);
    
    if (clipsToShow.length === 0) {
      chrome.contextMenus.create({
        id: 'no-clips',
        parentId: 'paste-from-mcm',
        title: 'No clips available',
        enabled: false,
        contexts: ['editable']
      });
    } else {
      clipsToShow.forEach((clip, index) => {
        const preview = clip.text.substring(0, 50).replace(/\n/g, ' ');
        const title = preview.length < clip.text.length ? preview + '...' : preview;
        
        chrome.contextMenus.create({
          id: `paste-clip-${index}`,
          parentId: 'paste-from-mcm',
          title: title,
          contexts: ['editable']
        });
      });
      
      // Add "Show all" option if more than 10 clips
      if (clips.length > 10) {
        chrome.contextMenus.create({
          id: 'show-all-clips',
          parentId: 'paste-from-mcm',
          title: `+${clips.length - 10} more (open MCM)`,
          contexts: ['editable']
        });
      }
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-to-mcm' && info.selectionText) {
    saveClipFromSelection(info.selectionText, tab);
  } else if (info.menuItemId.startsWith('paste-clip-')) {
    const index = parseInt(info.menuItemId.split('-')[2]);
    pasteClipToPage(index, tab);
  } else if (info.menuItemId === 'show-all-clips') {
    chrome.action.openPopup();
  }
});

// Handle keyboard command
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-mcm') {
    chrome.action.openPopup();
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBadge') {
    updateBadge(message.count);
    sendResponse({ success: true });
  } else if (message.action === 'saveClip') {
    saveClipFromContent(message.data, sender.tab)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  } else if (message.action === 'updatePasteMenu') {
    chrome.storage.local.get(['clips'], (result) => {
      updatePasteMenu(result.clips || []);
    });
    sendResponse({ success: true });
  }
});

// Listen for storage changes to update paste menu
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.clips) {
    updatePasteMenu(changes.clips.newValue || []);
    updateBadge(changes.clips.newValue?.length || 0);
  }
});

// Save clip from context menu selection
async function saveClipFromSelection(text, tab) {
  try {
    const result = await chrome.storage.local.get(['clips']);
    let clips = result.clips || [];
    
    // Check for duplicates
    const isDuplicate = clips.some(clip => clip.text === text);
    if (isDuplicate) {
      console.log('Duplicate clip, skipping');
      return;
    }
    
    const newClip = {
      text: text.substring(0, 10000), // Enforce character limit
      timestamp: Date.now(),
      metadata: {
        url: tab.url,
        title: tab.title
      }
    };
    
    clips.unshift(newClip);
    
    // Limit to 20 clips
    if (clips.length > 20) {
      clips = clips.slice(0, 20);
    }
    
    await chrome.storage.local.set({ clips });
    
    // Show notification in content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'showNotification',
      message: 'Saved to MCM!'
    }).catch(() => {
      // Tab might not have content script, that's okay
    });
    
  } catch (error) {
    console.error('Error saving clip:', error);
  }
}

// Paste clip to page
async function pasteClipToPage(index, tab) {
  try {
    const result = await chrome.storage.local.get(['clips']);
    const clips = result.clips || [];
    
    if (index >= clips.length) return;
    
    const clipText = clips[index].text;
    
    // Send to content script to paste
    chrome.tabs.sendMessage(tab.id, {
      action: 'pasteText',
      text: clipText
    }).catch(() => {
      // If content script not available, copy to clipboard
      console.log('Content script not available, copying to clipboard instead');
    });
    
  } catch (error) {
    console.error('Error pasting clip:', error);
  }
}

// Save clip from content script
async function saveClipFromContent(clipData, tab) {
  try {
    const result = await chrome.storage.local.get(['clips']);
    let clips = result.clips || [];
    
    const newClip = {
      text: clipData.text.substring(0, 10000),
      timestamp: Date.now(),
      metadata: {
        url: tab.url,
        title: tab.title
      }
    };
    
    clips.unshift(newClip);
    
    if (clips.length > 20) {
      clips = clips.slice(0, 20);
    }
    
    await chrome.storage.local.set({ clips });
    
    return true;
  } catch (error) {
    console.error('Error saving clip:', error);
    throw error;
  }
}

// Update extension badge
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Update badge on startup
chrome.storage.local.get(['clips'], (result) => {
  const clips = result.clips || [];
  updateBadge(clips.length);
  updatePasteMenu(clips);
});