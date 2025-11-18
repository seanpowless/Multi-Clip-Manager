# Multi-Clipboard Manager (MCM) v1.1.0

**Simple, clean, and functional clipboard manager for Chrome/Edge with selection-based actions.**

## ✨ What's New in v1.1.0

### **Selection-Based UI**
- Click any clip to select it (buttons slide in at bottom)
- Double-click to copy instantly
- Actions appear only when needed - cleaner scrolling
- Arrow keys navigate, Enter copies, Delete removes

### **Right-Click Magic**
```
Right-click on webpage →
├─ Copy to MCM (when text selected)
└─ Paste from MCM (when in input/textarea)
    ├─ Clip 1: "github.com/repo..."
    ├─ Clip 2: "wikipedia.org..."
    └─ +5 more (open MCM)
```

### **Visual Polish**
- Selected clip highlights with colored border
- Action buttons slide in smoothly
- Light/Dark mode adapts to browser
- Keyboard navigation built-in

---

## 🎮 How to Use

### **Minimalist View (Default)**
```
┌────────────────────────────────────┐
│ [📋] MCM  [+][≡][📋][🗑️][📌][⬆️] │
├────────────────────────────────────┤
│ 1 clip                             │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ github.com/repo        now   │   │ ← Auto-selected
│ │ Latest clip text here...     │   │
│ │ [📋 Copy][📍 Pin][🗑️ Delete] │   │ ← Buttons visible
│ └──────────────────────────────┘   │
└────────────────────────────────────┘
```

### **Expanded View**
```
┌────────────────────────────────────┐
│ [📋] MCM  [+][≡][📋][🗑️][📌][⬆️] │
├────────────────────────────────────┤
│ 12 clips • 3 pinned                │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ github.com/repo        now   │   │ ← Not selected
│ │ Latest clip text...          │   │
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │📌 wikipedia.org/art...   2m  │   │ ← SELECTED
│ │ Pinned clip text here...     │   │
│ │ [📋 Copy][📌 Unpin][🗑️]     │   │ ← Actions appear!
│ └──────────────────────────────┘   │
│            ⋮ scrollable            │
└────────────────────────────────────┘
```

---

## 🎯 Button Functions

### **Top Bar (Global Actions)**
| Button | Function | Behavior |
|--------|----------|----------|
| **+** | Add | Opens textarea to manually add clip |
| **≡** | Expand | Toggle single/all clips (changes to **−**) |
| **📋** | Copy All | Copies all clips separated by `---` |
| **🗑️** | Clear All | Deletes all clips (asks confirmation) |
| **📌** | Filter | Shows only pinned clips (toggle) |
| **⬆️** | Pin Top | Opens in popup window (top-right screen) |

### **Per-Clip Actions (Appear When Selected)**
| Button | Function | Behavior |
|--------|----------|----------|
| **📋 Copy** | Copy clip | Copies to clipboard |
| **📌/📍** | Pin/Unpin | Toggles pin (icon changes) |
| **🗑️ Delete** | Delete clip | Removes permanently |

---

## ⌨️ Keyboard Shortcuts

### **Global (Anywhere)**
- **Alt+Shift+M** - Open MCM popup
- **Ctrl+Shift+C** - Save selected text to MCM (on any webpage)

### **In Popup**
- **↑/↓ Arrow Keys** - Navigate clips
- **Enter** - Copy selected clip
- **Delete** - Delete selected clip
- **Ctrl+Enter** - Save clip (when typing in add section)
- **Escape** - Cancel/close add section

### **Mouse Actions**
- **Single-click clip** - Select (shows buttons)
- **Double-click clip** - Copy instantly
- **Click selected again** - Deselect (hides buttons)
- **Right-click** - Show context menu

---

## 🖱️ Right-Click Context Menu

### **On Any Webpage:**

**When text is selected:**
```
Right-click → "Copy to MCM"
```
Saves selected text to your clipboard manager with metadata (URL, timestamp).

**When cursor is in input/textarea:**
```
Right-click → "Paste from MCM" →
  ├─ "github.com/repo..." (most recent)
  ├─ "wikipedia.org..."
  ├─ "stackoverflow.com..."
  └─ +7 more (open MCM)
```
Click any clip to paste directly into the field!

**Smart Pasting:**
- Inserts text at cursor position
- Preserves existing text
- Works in input fields, textareas, and contentEditable elements
- Falls back to clipboard copy if no field is focused

---

## 📦 Installation

### **Files Needed:**
```
mcm-v1.1.0/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── background.js
├── content.js
├── icon16.png
├── icon48.png
└── icon128.png
```

### **Quick Icon Creation:**
1. Go to https://favicon.io/favicon-generator/
2. Choose purple color (#667eea)
3. Add text "MCM" or use 📋 emoji
4. Download and rename: icon16.png, icon48.png, icon128.png

### **Load Extension:**
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select your folder
5. Done! 🎉

---

## 🎨 Light & Dark Mode

Automatically adapts to your browser/OS theme!

**Light Mode:**
- Clean white background
- Purple accent (#667eea)
- High contrast for readability

**Dark Mode:**
- Dark gray background (#1e1e1e)
- Light purple accent (#7c8ef5)
- Reduced eye strain

No configuration needed - just works! ✨

---

## 💡 Pro Tips

### **Workflow Optimization:**
1. **Pin frequently used clips** (API keys, email templates, addresses)
2. **Use 📌 filter** to access pinned clips instantly
3. **Right-click → Paste** is faster than opening popup
4. **Keyboard navigation** - Alt+Shift+M → Arrow keys → Enter

### **Power User Features:**
- **Arrow keys** navigate without mouse
- **Double-click** for instant copy
- **Context menu** for quick paste
- **Pin important clips** to keep them at top

### **Organization:**
- Pin = Important/Frequent
- Recent = Last 20 clips
- Filter = Show only pinned

---

## 🔧 Technical Details

**Storage:**
- `chrome.storage.local` (unlimited)
- Persists across browser restarts
- No cloud sync (privacy-focused)

**Limits:**
- 20 clips maximum (oldest auto-removed)
- 10,000 characters per clip
- Context menu shows 10 most recent

**Permissions:**
- `storage` - Save clips locally
- `clipboardWrite` - Copy to clipboard
- `contextMenus` - Right-click integration

**Browser Support:**
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave, Opera (Chromium-based)

---

## 🐛 Troubleshooting

**Context menu not showing clips?**
- Reload the extension
- Add a clip first (menu updates automatically)

**Paste not working?**
- Make sure cursor is in an input field
- Some websites block content scripts (security)
- Falls back to clipboard copy

**Keyboard shortcut conflicts?**
- Go to `chrome://extensions/shortcuts`
- Change Alt+Shift+M to something else

**Icons not showing?**
- Use simple PNG files (any image works for testing)
- Or temporarily remove icon references from manifest.json

**Dark mode not working?**
- Check browser theme: `chrome://settings/appearance`
- Ensure OS dark mode is enabled

---

## 🎯 What Makes This Great

### **Thoughtful UX:**
- ✅ Actions appear where you're looking (bottom of clip)
- ✅ No button clutter when not needed
- ✅ Visual feedback for every action
- ✅ Keyboard accessible

### **Smart Features:**
- ✅ Context menu with nested clips
- ✅ Auto-pastes into input fields
- ✅ Duplicate prevention
- ✅ Metadata tracking (source URL)

### **Clean Design:**
- ✅ Respects light/dark mode
- ✅ Smooth animations
- ✅ Minimal but functional
- ✅ Progressive disclosure

---

## 🚀 Future Ideas (v1.2+)

- Search/filter clips by keyword
- Categories/tags for organization
- Export/import as JSON
- Cloud sync (optional)
- Rich text support
- Clip templates
- Usage statistics

---

## 📝 Version History

**v1.1.0** (Current)
- Selection-based UI with slide-in buttons
- Right-click "Paste from MCM" with nested clips
- Keyboard navigation (arrow keys, Enter, Delete)
- Double-click to copy
- Auto-paste to input fields

**v1.0.0**
- Initial release
- Basic clipboard management
- Light/Dark mode support

---

**Enjoy!** 🎯

A clicker's dream - right-click to save, right-click to paste, click to select, double-click to copy. Every interaction feels natural and responsive.


**The selection model is perfect** - buttons appear exactly where you need them, keeping the UI clean while scrolling. This is how clipboard managers should work! 🚀
