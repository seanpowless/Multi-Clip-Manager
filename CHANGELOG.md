# Changelog

All notable changes to Multi-Clipboard Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-13

### Added
- Selection-based UI with slide-in action buttons
- Double-click to copy functionality
- Right-click "Paste from MCM" with nested clip submenu
- Keyboard navigation (Arrow keys, Enter, Delete)
- Auto-paste to input fields from context menu
- Visual feedback for selected clips
- Smooth animations for button appearance

### Changed
- Actions only appear when clip is selected (cleaner UI)
- Context menu now shows up to 10 recent clips
- Improved keyboard accessibility throughout

### Fixed
- Button positioning consistent across all clips
- Selection state properly maintained
- Context menu updates dynamically with clip changes

## [1.0.0] - 2024-09-30

### Added
- Initial release
- Basic clipboard management (20 clips max)
- Pin/unpin functionality
- Light and Dark mode support
- Chrome storage persistence
- Context menu "Copy to MCM" for selected text
- Manual add clip functionality
- Copy all clips feature
- Clear all functionality
- Expand/collapse view
- Filter to show only pinned clips
- Pin popup to top-right window
- Auto-removal of oldest clips when limit reached
- Duplicate prevention
- Source URL and timestamp metadata
- 10,000 character limit per clip

### Technical
- Manifest V3 implementation
- Service worker background script
- Content script for webpage integration
- Chrome storage API integration
- Context menus API integration
- Clipboard Write permission handling

---

## Version History Summary

- **1.1.0**: Selection-based UI overhaul, improved UX
- **1.0.0**: Initial functional release

[1.1.0]: https://github.com/yourusername/multi-clipboard-manager/releases/tag/v1.1.0
[1.0.0]: https://github.com/yourusername/multi-clipboard-manager/releases/tag/v1.0.0
