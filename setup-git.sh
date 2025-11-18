#!/bin/bash
# Setup script for Multi-Clipboard Manager GitHub repository
# Run this after creating your GitHub repository

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Multi-Clipboard Manager - Git Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${GREEN}[1/6]${NC} Initializing git repository..."
    git init
else
    echo -e "${YELLOW}[1/6]${NC} Git already initialized, skipping..."
fi

# Add all files
echo -e "${GREEN}[2/6]${NC} Staging all files..."
git add .

# Initial commit
echo -e "${GREEN}[3/6]${NC} Creating initial commit..."
git commit -m "Initial commit: Multi-Clipboard Manager v1.1.0

- Selection-based UI with slide-in buttons
- Right-click context menu integration
- Keyboard navigation support
- Light/Dark mode adaptive styling
- Pin functionality for important clips
- 20 clip limit with auto-removal
- Duplicate prevention
- Source URL tracking"

# Set main as default branch
echo -e "${GREEN}[4/6]${NC} Setting main as default branch..."
git branch -M main

# Prompt for GitHub repository URL
echo -e "\n${YELLOW}[5/6]${NC} ${BLUE}Enter your GitHub repository URL:${NC}"
echo -e "Example: https://github.com/yourusername/multi-clipboard-manager.git"
read -p "> " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${YELLOW}No URL provided. You can add it later with:${NC}"
    echo "git remote add origin YOUR_REPO_URL"
    echo "git push -u origin main"
else
    echo -e "${GREEN}[5/6]${NC} Adding remote origin..."
    git remote add origin "$REPO_URL"
    
    echo -e "${GREEN}[6/6]${NC} Pushing to GitHub..."
    git push -u origin main
    
    echo -e "\n${GREEN}✓ Successfully pushed to GitHub!${NC}"
    echo -e "${BLUE}Repository:${NC} $REPO_URL"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit your GitHub repository"
echo "2. Add topics/tags (chrome-extension, clipboard-manager, productivity)"
echo "3. Update the repository description"
echo "4. Consider adding screenshots to README"
echo ""
echo -e "${YELLOW}To continue development:${NC}"
echo "git checkout -b feature/your-feature"
echo "# Make changes"
echo "git add ."
echo "git commit -m 'Your commit message'"
echo "git push origin feature/your-feature"
echo ""
echo -e "${GREEN}Happy coding!${NC} 🚀"
