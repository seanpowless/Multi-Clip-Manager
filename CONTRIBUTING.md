# Contributing to Multi-Clipboard Manager

Thank you for your interest in contributing to MCM! This project follows engineering principles borrowed from ironwork and UNIX philosophy.

## Philosophy

**Like good ironwork:**
- Every component must carry its load
- Connections matter more than individual parts
- Build for what comes after
- Elegant solutions are stronger than complex ones

**Following UNIX principles:**
- Do one thing well
- Compose with other tools
- Use text streams where possible
- Respect user sovereignty

## How to Contribute

### Reporting Bugs
- Check existing issues first
- Include browser version and OS
- Provide steps to reproduce
- Add screenshots if relevant

### Suggesting Features
- Open an issue first to discuss
- Explain the use case clearly
- Consider if it fits the "do one thing well" philosophy
- Think about edge cases

### Code Contributions

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the code style
4. **Test thoroughly** in Chrome/Edge
5. **Commit with clear messages**: Use conventional commits format
6. **Push and create a PR**

### Code Style

- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Follow existing formatting conventions
- Avoid over-engineering

### Testing Checklist

- [ ] Loads in Chrome without errors
- [ ] All features work in light mode
- [ ] All features work in dark mode
- [ ] Keyboard navigation functions properly
- [ ] Context menu integration works
- [ ] No console errors
- [ ] Respects 20-clip limit
- [ ] Pinned clips stay at top

## Development Setup

1. Load the extension in developer mode
2. Make changes to source files
3. Click the refresh button in `chrome://extensions/`
4. Test your changes
5. Check the console for errors

## Questions?

Feel free to open an issue for any questions about contributing or the codebase.

---

*"Measure twice, cut once. Test twice, commit once."* - Ironworker's wisdom applied to code
